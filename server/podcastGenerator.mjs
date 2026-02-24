// server/podcastGenerator.mjs
// ESM version for Vite dev middleware.
// Approach: collect full LLM response → parse JSON array → TTS each line concurrently → stream NDJSON to client.
// This is simpler and more robust than streaming JSON parsing.

const GOOGLE_TTS_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';

// Studio voices = highest quality (broadcast-grade)
// Neural2 voices = natural, conversational
const CAST_VOICES = {
  Alex:   { languageCode: 'en-US', name: 'en-US-Studio-Q',   ssmlGender: 'MALE' },    // Senior PM host — warm, authoritative male
  Sam:    { languageCode: 'en-US', name: 'en-US-Studio-O',   ssmlGender: 'FEMALE' },  // Analyst — clear, engaging female
  Jordan: { languageCode: 'en-US', name: 'en-US-Neural2-J',  ssmlGender: 'MALE' },    // Exec Sponsor — confident male
  Maya:   { languageCode: 'en-US', name: 'en-US-Neural2-F',  ssmlGender: 'FEMALE' },  // Team Lead — practical female
  Chris:  { languageCode: 'en-US', name: 'en-US-Neural2-D',  ssmlGender: 'MALE' },    // Devil's Advocate — measured male
};

const AUDIO_CONFIG = {
  audioEncoding: 'MP3',
  speakingRate: 1.0,
  pitch: 0.0,
  volumeGainDb: 1.5,
  effectsProfileId: ['headphone-class-device'],
};

function buildSystemPrompt(complexity) {
  const castCount = complexity === 'simple' ? '2' : complexity === 'moderate' ? '3' : '4–5';
  const lineCount = complexity === 'simple' ? '20–28' : complexity === 'moderate' ? '28–38' : '38–50';

  return `You are the head writer for "StratAlign Theater", a podcast drama about project management where a team of professionals discuss tools and techniques through realistic workplace conversations.

THE CAST (choose ${castCount} of these for this episode):
- Alex: Senior PM and show host. Experienced, analytical, loves real-world examples. Always present.
- Sam: Business Analyst. Curious, enthusiastic, asks the questions listeners are thinking. Always present.
- Jordan: Executive Sponsor. Senior leader, focused on business value and ROI. Only for strategic/governance topics.
- Maya: Team Lead / Practitioner. Hands-on, practical, speaks from the trenches. For team-level tools.
- Chris: Devil's Advocate. Calm but challenging. For tools with common failure modes or misuse.

OUTPUT FORMAT — return ONLY a valid JSON array, no markdown fences, no explanation, no preamble:
[{"speaker":"Alex","line":"..."},{"speaker":"Sam","line":"..."},...]

EPISODE STRUCTURE (target ${lineCount} lines):
1. Intro — Alex and Sam open the show, introduce the topic and any guests (4–5 lines)
2. What it is — clear explanation with an analogy (5–7 lines)
3. When to use it — real-world scenarios (5–7 lines)
4. Step-by-step walkthrough — practical and detailed (7–9 lines)
5. Real-world example — specific project scenario (5–7 lines)
6. Challenges and tips — Chris raises concerns if present, Maya shares field experience (3–5 lines)
7. Wrap-up — each active cast member gives their key takeaway (3–4 lines)

CONVERSATION RULES:
- Each line: 1–3 natural sentences. Conversational, not lecture-style.
- Characters react to each other — agree, push back, build on ideas.
- Use natural speech patterns: "exactly!", "right", "that's a fair point", "hold on though…"
- NEVER use bullet points or numbered lists inside a line.
- NEVER say "as you know", "as we all know", or assume prior knowledge.
- When mentioning another PMO tool, say "we cover that in another session" or "that's a whole episode on its own".
- Treat every listener as if this is their very first episode.

CRITICAL: Return ONLY the JSON array. No \`\`\`json, no \`\`\`, no text before or after the array.`;
}

function buildUserPrompt(card) {
  const complexity = inferComplexity(card);
  return `Create a StratAlign Theater episode about this PMO tool. Complexity: ${complexity}.

Title: ${card.title}
Tagline: ${card.tagline ?? ''}
What it is: ${card.whatItIs ?? ''}
When to use: ${card.whenToUse ?? ''}
Steps: ${card.steps?.join('; ') ?? 'N/A'}
Pro tip: ${card.proTip ?? ''}
Example: ${card.example ?? 'N/A'}
Deck: ${card.deckTitle ?? ''}

Select the right cast members and write an informative, entertaining episode. Return ONLY the JSON array.`;
}

function inferComplexity(card) {
  const text = [card.whatItIs ?? '', card.whenToUse ?? '', (card.steps ?? []).join(' ')].join(' ').toLowerCase();
  const complexKeywords = ['governance', 'programme', 'portfolio', 'strategic', 'executive', 'stakeholder', 'benefits', 'transformation', 'change management', 'enterprise'];
  const simpleKeywords = ['template', 'checklist', 'agenda', 'status', 'log', 'tracker', 'simple', 'basic'];
  const complexScore = complexKeywords.filter(k => text.includes(k)).length;
  const simpleScore = simpleKeywords.filter(k => text.includes(k)).length;
  if (complexScore >= 2) return 'complex';
  if (simpleScore >= 2) return 'simple';
  return 'moderate';
}

async function generateScript(card) {
  const apiUrl = process.env.BUILT_IN_FORGE_API_URL;
  const apiKey = process.env.BUILT_IN_FORGE_API_KEY;

  if (!apiUrl || !apiKey) throw new Error('LLM API not configured');

  const complexity = inferComplexity(card);

  const res = await fetch(`${apiUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gemini-2.0-flash',
      messages: [
        { role: 'system', content: buildSystemPrompt(complexity) },
        { role: 'user',   content: buildUserPrompt(card) },
      ],
      temperature: 0.75,
      max_tokens: 6000,
      stream: false,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`LLM error ${res.status}: ${err.slice(0, 300)}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? '';

  console.log(`[Theater] LLM raw content (first 200 chars): ${content.slice(0, 200)}`);

  // Strip markdown code fences if present
  const cleaned = content
    .replace(/^```(?:json)?\s*/im, '')
    .replace(/```\s*$/m, '')
    .trim();

  // Parse JSON array
  let lines;
  try {
    lines = JSON.parse(cleaned);
  } catch (e) {
    // Try to extract JSON array from within the text
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (match) {
      lines = JSON.parse(match[0]);
    } else {
      throw new Error(`Failed to parse script JSON: ${e.message}. Content: ${cleaned.slice(0, 200)}`);
    }
  }

  if (!Array.isArray(lines)) throw new Error('Script is not an array');

  const validSpeakers = ['Alex', 'Sam', 'Jordan', 'Maya', 'Chris'];
  const valid = lines.filter(l => l && validSpeakers.includes(l.speaker) && typeof l.line === 'string' && l.line.trim().length > 0);

  console.log(`[Theater] Script parsed: ${lines.length} raw lines, ${valid.length} valid`);
  return valid;
}

async function synthesiseLine(text, speaker, apiKey) {
  const voice = CAST_VOICES[speaker] ?? CAST_VOICES.Alex;
  const processed = text
    .replace(/\s*—\s*/g, ', ')
    .replace(/;/g, ',')
    .replace(/\.\.\./g, ',')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 4000);

  const body = { input: { text: processed }, voice, audioConfig: AUDIO_CONFIG };
  const res = await fetch(`${GOOGLE_TTS_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`TTS error for ${speaker}: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  if (!data.audioContent) throw new Error(`No audio content for ${speaker}`);
  return data.audioContent;
}

export async function handlePodcastGenerate(req, res) {
  try {
    const ttsKey = process.env.GOOGLE_TTS_API_KEY;
    if (!ttsKey) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Google TTS API key not configured' }));
      return;
    }

    // Parse body
    let parsedBody = {};
    if (req._parsedBody) {
      parsedBody = req._parsedBody;
    } else if (req.body && typeof req.body === 'object') {
      parsedBody = req.body;
    } else {
      await new Promise((resolve) => {
        let raw = '';
        req.on('data', chunk => { raw += chunk.toString(); });
        req.on('end', () => {
          try { parsedBody = JSON.parse(raw); } catch { /* ignore */ }
          resolve();
        });
      });
    }

    const card = parsedBody.card;
    if (!card?.title) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing card data' }));
      return;
    }

    console.log(`[Theater] Generating episode for: ${card.title}`);

    // Set streaming headers
    res.writeHead(200, {
      'Content-Type': 'application/x-ndjson',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    });

    // Step 1: Generate full script from LLM (non-streaming for reliability)
    let scriptLines;
    try {
      scriptLines = await generateScript(card);
    } catch (err) {
      console.error('[Theater] Script generation failed:', err);
      res.write(JSON.stringify({ error: `Script generation failed: ${String(err)}`, done: true }) + '\n');
      res.end();
      return;
    }

    if (scriptLines.length === 0) {
      res.write(JSON.stringify({ error: 'Empty script generated', done: true }) + '\n');
      res.end();
      return;
    }

    // Step 2: TTS each line — process in batches of 4 for speed, stream as each completes
    const activeSpeakers = new Set();
    let successCount = 0;

    // Process in order but with concurrency
    const BATCH_SIZE = 4;
    for (let i = 0; i < scriptLines.length; i += BATCH_SIZE) {
      const batch = scriptLines.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(
        batch.map(async (dialogueLine, batchIdx) => {
          const lineIndex = i + batchIdx;
          console.log(`[Theater] TTS: line ${lineIndex} ${dialogueLine.speaker}`);
          const audioContent = await synthesiseLine(dialogueLine.line, dialogueLine.speaker, ttsKey);
          return { ...dialogueLine, audioContent, index: lineIndex, done: false };
        })
      );

      // Stream each successful result immediately
      for (const result of results) {
        if (result.status === 'fulfilled') {
          res.write(JSON.stringify(result.value) + '\n');
          activeSpeakers.add(result.value.speaker);
          successCount++;
        } else {
          console.error('[Theater] TTS batch item failed:', result.reason);
        }
      }
    }

    // Done
    res.write(JSON.stringify({
      done: true,
      total: successCount,
      cast: Array.from(activeSpeakers),
    }) + '\n');
    res.end();

    console.log(`[Theater] Episode complete: ${successCount}/${scriptLines.length} segments, cast: ${Array.from(activeSpeakers).join(', ')}`);

  } catch (err) {
    console.error('[Theater] Fatal error:', err);
    try {
      res.write(JSON.stringify({ error: String(err), done: true }) + '\n');
      res.end();
    } catch { /* response already ended */ }
  }
}
