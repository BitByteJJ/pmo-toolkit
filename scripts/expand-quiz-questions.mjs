/**
 * expand-quiz-questions.mjs
 * Generates 3 extra quiz questions per lesson day using the built-in LLM API.
 * Reads existing questions for context, generates 3 new ones, and appends them
 * to journeyData.ts inside each lesson's questions array.
 *
 * Run: node scripts/expand-quiz-questions.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JOURNEY_FILE = path.join(__dirname, '../client/src/lib/journeyData.ts');

// Load env for LLM API
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
try {
  const dotenv = require('dotenv');
  dotenv.config({ path: path.join(__dirname, '../.env') });
} catch {
  // dotenv not available, env vars should already be set
}

const LLM_URL = process.env.BUILT_IN_FORGE_API_URL;
const LLM_KEY = process.env.BUILT_IN_FORGE_API_KEY;

if (!LLM_URL || !LLM_KEY) {
  console.error('Missing BUILT_IN_FORGE_API_URL or BUILT_IN_FORGE_API_KEY');
  process.exit(1);
}

async function invokeLLM(messages, responseFormat) {
  const body = { messages };
  if (responseFormat) body.response_format = responseFormat;

  const res = await fetch(`${LLM_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${LLM_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LLM error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

// Extract lesson blocks from the TS file
function extractLessons(content) {
  // Find all lesson objects by matching their id pattern
  const lessons = [];
  const lessonRegex = /\{\s*\n\s*id:\s*'(day-\d+)',[\s\S]*?(?=\n  \{|\n\];)/g;
  let match;
  while ((match = lessonRegex.exec(content)) !== null) {
    lessons.push({ id: match[1], raw: match[0], index: match.index });
  }
  return lessons;
}

// Extract existing questions for a lesson block
function extractExistingQuestions(lessonRaw) {
  const qRegex = /\{\s*\n\s*id:\s*'(q-d\d+-\d+)',[\s\S]*?explanation:.*?,\s*\n\s*cardRefs:.*?,\s*\n\s*xp:.*?,?\s*\n\s*\}/g;
  const questions = [];
  let m;
  while ((m = qRegex.exec(lessonRaw)) !== null) {
    questions.push(m[0]);
  }
  return questions;
}

// Extract lesson metadata
function extractLessonMeta(lessonRaw) {
  const titleMatch = lessonRaw.match(/title:\s*'([^']+)'/);
  const descMatch = lessonRaw.match(/description:\s*'([^']+)'/);
  const cardRefsMatch = lessonRaw.match(/cardRefs:\s*\[([^\]]+)\]/);
  return {
    title: titleMatch ? titleMatch[1] : '',
    description: descMatch ? descMatch[1] : '',
    cardRefs: cardRefsMatch ? cardRefsMatch[1].replace(/'/g, '').split(',').map(s => s.trim()) : [],
  };
}

// Get the highest question number for a day
function getMaxQNum(lessonRaw, dayNum) {
  const qRegex = new RegExp(`q-d${dayNum}-(\\d+)`, 'g');
  let max = 0;
  let m;
  while ((m = qRegex.exec(lessonRaw)) !== null) {
    const n = parseInt(m[1]);
    if (n > max) max = n;
  }
  return max;
}

async function generateQuestionsForLesson(dayNum, meta, existingQSummaries, startQNum) {
  const prompt = `You are a Project Management quiz question writer for a professional PM learning app called StratAlign.

Lesson: Day ${dayNum} — "${meta.title}"
Description: ${meta.description}
Card references: ${meta.cardRefs.join(', ')}

Existing question topics (DO NOT repeat these):
${existingQSummaries.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Generate exactly 3 NEW quiz questions for this lesson. Each must:
- Be a different type: use a mix of 'mcq', 'scenario', and 'truefalse'
- Test a DIFFERENT aspect of the lesson than the existing questions
- Have exactly 4 options (or 2 for truefalse: ['True', 'False'])
- Have a clear correctIndex (0-based)
- Have a 1-2 sentence explanation referencing the relevant card code(s)
- Reference at least one card from the cardRefs list
- Be practical and scenario-based where possible

Return ONLY a JSON array of 3 question objects with this exact structure:
[
  {
    "type": "mcq" | "scenario" | "truefalse",
    "prompt": "...",
    "options": ["...", "...", "...", "..."],
    "correctIndex": 0,
    "explanation": "...",
    "cardRefs": ["..."]
  }
]`;

  const responseText = await invokeLLM(
    [
      { role: 'system', content: 'You are a professional PM quiz question writer. Return only valid JSON arrays, no markdown.' },
      { role: 'user', content: prompt },
    ],
    {
      type: 'json_schema',
      json_schema: {
        name: 'quiz_questions',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            questions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string' },
                  prompt: { type: 'string' },
                  options: { type: 'array', items: { type: 'string' } },
                  correctIndex: { type: 'integer' },
                  explanation: { type: 'string' },
                  cardRefs: { type: 'array', items: { type: 'string' } },
                },
                required: ['type', 'prompt', 'options', 'correctIndex', 'explanation', 'cardRefs'],
                additionalProperties: false,
              },
            },
          },
          required: ['questions'],
          additionalProperties: false,
        },
      },
    }
  );

  let parsed;
  try {
    const obj = JSON.parse(responseText);
    parsed = obj.questions || obj;
  } catch {
    // Try to extract JSON array from response
    const match = responseText.match(/\[[\s\S]*\]/);
    if (match) parsed = JSON.parse(match[0]);
    else throw new Error(`Failed to parse LLM response: ${responseText.slice(0, 200)}`);
  }

  // Convert to TS string
  return parsed.slice(0, 3).map((q, i) => {
    const qNum = startQNum + i + 1;
    const id = `q-d${dayNum}-${qNum}`;
    const optionsStr = q.options.map(o => `          '${o.replace(/'/g, "\\'")}'`).join(',\n');
    const cardRefsStr = q.cardRefs.map(r => `'${r}'`).join(', ');
    return `      {
        id: '${id}',
        type: '${q.type}',
        prompt: '${q.prompt.replace(/'/g, "\\'")}',
        options: [
${optionsStr},
        ],
        correctIndex: ${q.correctIndex},
        explanation: '${q.explanation.replace(/'/g, "\\'")}',
        cardRefs: [${cardRefsStr}],
        xp: 10,
      }`;
  });
}

async function main() {
  let content = fs.readFileSync(JOURNEY_FILE, 'utf8');
  console.log('Loaded journeyData.ts');

  // Process each day
  for (let day = 1; day <= 35; day++) {
    const dayId = `day-${day}`;
    
    // Find the lesson block for this day
    const lessonStart = content.indexOf(`  {\n    id: '${dayId}'`);
    if (lessonStart === -1) {
      console.log(`Day ${day}: not found, skipping`);
      continue;
    }

    // Find the end of this lesson's questions array closing bracket
    // We need to find the last question's closing brace and insert after it
    // Find the questions array for this lesson
    const questionsArrayStart = content.indexOf(`    questions: [`, lessonStart);
    if (questionsArrayStart === -1) {
      console.log(`Day ${day}: no questions array found, skipping`);
      continue;
    }

    // Find the closing of the questions array
    // Count brackets from questionsArrayStart
    let depth = 0;
    let i = questionsArrayStart + '    questions: ['.length;
    let questionsArrayEnd = -1;
    while (i < content.length) {
      if (content[i] === '[') depth++;
      else if (content[i] === ']') {
        if (depth === 0) {
          questionsArrayEnd = i;
          break;
        }
        depth--;
      }
      i++;
    }

    if (questionsArrayEnd === -1) {
      console.log(`Day ${day}: could not find questions array end, skipping`);
      continue;
    }

    // Extract the lesson block for metadata
    const lessonBlock = content.slice(lessonStart, questionsArrayEnd + 100);
    const meta = extractLessonMeta(lessonBlock);
    const maxQNum = getMaxQNum(lessonBlock, day);

    // Extract existing question prompts for context
    const existingPrompts = [];
    const promptRegex = /prompt:\s*'([^']+)'/g;
    let pm;
    const qBlock = content.slice(questionsArrayStart, questionsArrayEnd);
    while ((pm = promptRegex.exec(qBlock)) !== null) {
      existingPrompts.push(pm[1].slice(0, 80) + '...');
    }

    console.log(`Day ${day}: "${meta.title}" — generating 3 new questions (current max: q${maxQNum})...`);

    try {
      const newQStrings = await generateQuestionsForLesson(day, meta, existingPrompts, maxQNum);
      
      // Insert new questions before the closing ] of the questions array
      const insertPoint = questionsArrayEnd;
      const insertText = ',\n' + newQStrings.join(',\n');
      content = content.slice(0, insertPoint) + insertText + '\n    ' + content.slice(insertPoint);
      
      console.log(`Day ${day}: ✓ Added ${newQStrings.length} questions`);
      
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.error(`Day ${day}: ERROR — ${err.message}`);
    }
  }

  // Write back
  fs.writeFileSync(JOURNEY_FILE, content, 'utf8');
  console.log('\n✅ Done! journeyData.ts updated with expanded question pools.');
  
  // Count new total
  const newContent = fs.readFileSync(JOURNEY_FILE, 'utf8');
  const total = (newContent.match(/id: 'q-d\d+-\d+'/g) || []).length;
  console.log(`Total questions now: ${total}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
