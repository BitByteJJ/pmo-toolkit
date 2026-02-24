// podcastGenerator.ts — StratAlign Theater
// Multi-character podcast with up to 5 cast members.
// The LLM selects 2–5 characters based on tool complexity and writes natural dialogue.
// Each character has a distinct Google TTS Journey voice, role, and personality.
//
// Cast:
//   Alex  — Senior PM / host lead          — Journey-D (male, authoritative)
//   Sam   — Business Analyst / co-host     — Journey-O (female, conversational)
//   Jordan— Executive Sponsor / stakeholder— Journey-F (female, warm/decisive)
//   Maya  — Team Lead / practitioner       — Journey-B (male, energetic/practical)
//   Chris — Sceptic / devil's advocate     — Journey-E (female, calm/challenging)
//
// Streaming: LLM streams script → each line TTS'd immediately → NDJSON flushed to client
// Concurrency: up to 4 TTS requests in flight at once

import type { Request, Response } from 'express';

const GOOGLE_TTS_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';

// ─── CAST ─────────────────────────────────────────────────────────────────────
export type CastMember = 'Alex' | 'Sam' | 'Jordan' | 'Maya' | 'Chris';

const CAST_VOICES: Record<CastMember, { languageCode: string; name: string; ssmlGender: string }> = {
  Alex:  { languageCode: 'en-US', name: 'en-US-Journey-D', ssmlGender: 'MALE' },
  Sam:   { languageCode: 'en-US', name: 'en-US-Journey-O', ssmlGender: 'FEMALE' },
  Jordan:{ languageCode: 'en-US', name: 'en-US-Journey-F', ssmlGender: 'FEMALE' },
  Maya:  { languageCode: 'en-US', name: 'en-US-Journey-B', ssmlGender: 'MALE' },
  Chris: { languageCode: 'en-US', name: 'en-US-Journey-E', ssmlGender: 'FEMALE' },
};

const CAST_ROLES: Record<CastMember, string> = {
  Alex:  'Senior PM & Host',
  Sam:   'Business Analyst',
  Jordan:'Executive Sponsor',
  Maya:  'Team Lead',
  Chris: 'Devil\'s Advocate',
};

// Export cast info for the frontend
export const CAST_INFO = Object.entries(CAST_ROLES).map(([name, role]) => ({
  name: name as CastMember,
  role,
}));

const AUDIO_CONFIG = {
  audioEncoding: 'MP3',
  speakingRate: 1.0,
  pitch: 0.0,
  volumeGainDb: 1.5,
  effectsProfileId: ['headphone-class-device'],
};

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface CardInput {
  title: string;
  tagline: string;
  whatItIs: string;
  whenToUse: string;
  steps?: string[];
  proTip: string;
  example?: string;
  deckTitle: string;
  complexity?: 'simple' | 'moderate' | 'complex'; // optional hint
}

interface DialogueLine {
  speaker: CastMember;
  line: string;
}

// ─── PROMPTS ──────────────────────────────────────────────────────────────────
function buildSystemPrompt(complexity: 'simple' | 'moderate' | 'complex'): string {
  const castCount = complexity === 'simple' ? '2–3' : complexity === 'moderate' ? '3–4' : '4–5';
  const lineCount = complexity === 'simple' ? '20–30' : complexity === 'moderate' ? '30–40' : '40–50';

  return `You are the head writer for "StratAlign Theater", a podcast drama about project management where a team of professionals discuss tools and techniques through realistic workplace conversations.

THE CAST (choose ${castCount} of these for this episode based on who would naturally be involved):
- Alex: Senior PM and show host. Experienced, analytical, loves real-world examples. Usually leads the discussion.
- Sam: Business Analyst. Curious, enthusiastic, asks the questions listeners are thinking. Great at simplifying concepts.
- Jordan: Executive Sponsor. Senior leader, focused on business value, ROI, and strategic fit. Brings the "why it matters to the business" angle. Only appears in episodes where executive buy-in or strategic context is relevant.
- Maya: Team Lead / Practitioner. Hands-on, practical, speaks from the trenches. Brings real implementation experience and "what actually happens in practice". Appears when the tool has strong team-level implications.
- Chris: Devil's Advocate. Calm but challenging. Asks "but what about when this goes wrong?" and "isn't this just over-engineering it?". Keeps the conversation honest. Appears when the tool has common failure modes or is often misused.

SELECTION RULES:
- Simple/foundational tools (e.g. meeting agenda, status report): use Alex + Sam only
- Moderate tools (e.g. RACI, risk register): add Maya or Chris as appropriate
- Complex/strategic tools (e.g. programme governance, benefits realisation): use 4–5 cast members
- Jordan only appears when executive sponsorship, budget, or strategic alignment is relevant
- Chris only appears when there are genuine failure modes or scepticism worth exploring
- Always start with Alex and Sam as the anchor hosts

OUTPUT FORMAT — return ONLY a JSON array, no markdown, no explanation:
[
  { "speaker": "Alex", "line": "..." },
  { "speaker": "Sam",  "line": "..." },
  ...
]

EPISODE STRUCTURE (target ${lineCount} lines):
1. Intro — Alex and Sam open the show and introduce the topic and today's guests (4–6 lines)
2. What it is — clear explanation with an analogy (6–8 lines)
3. When to use it — real-world scenarios, guests chime in from their perspective (6–8 lines)
4. Step-by-step walkthrough — practical, detailed (8–10 lines)
5. Real-world example — specific project scenario with guest reactions (6–8 lines)
6. Challenges & pro tips — Chris raises concerns if present, Maya shares field experience (4–6 lines)
7. Wrap-up — each active cast member gives their key takeaway (3–5 lines)

CONVERSATION RULES:
- Each line: 1–3 natural sentences. Not too short (choppy) or too long (hard to follow).
- Characters should react to each other — agree, push back, build on ideas.
- Use natural speech: "exactly!", "right", "that's a fair point", "hold on though…", rhetorical questions.
- Vary who leads and who responds — don't let one character dominate.
- NEVER use bullet points or numbered lists inside a line — speak naturally.
- Guests (Jordan, Maya, Chris) should feel like they've just joined the conversation, not like they were always there.

CRITICAL LANGUAGE RULES:
- NEVER say "as you know", "as we all know", "you already know", or any variation assuming prior knowledge.
- When mentioning another PMO tool by name, ALWAYS say "we cover that in another session", "that's a whole episode on its own", or "check out our session on [tool name]".
- Treat every listener as if this is their very first episode.`;
}

function buildUserPrompt(card: CardInput): string {
  const complexity = card.complexity ?? inferComplexity(card);
  return `Create a StratAlign Theater episode about this PMO tool.

Title: ${card.title}
Tagline: ${card.tagline}
What it is: ${card.whatItIs}
When to use: ${card.whenToUse}
Steps: ${card.steps?.join('; ') ?? 'N/A'}
Pro tip: ${card.proTip}
Example: ${card.example ?? 'N/A'}
Deck: ${card.deckTitle}
Complexity assessment: ${complexity}

Select the right cast members for this topic and write a genuinely informative, entertaining episode. The listener should finish knowing exactly when and how to use this tool, with a concrete mental model.`;
}

function inferComplexity(card: CardInput): 'simple' | 'moderate' | 'complex' {
  const text = [card.whatItIs, card.whenToUse, card.steps?.join(' ') ?? ''].join(' ').toLowerCase();
  const complexKeywords = ['governance', 'programme', 'portfolio', 'strategic', 'executive', 'stakeholder', 'benefits', 'transformation', 'change management', 'enterprise'];
  const simpleKeywords = ['template', 'checklist', 'agenda', 'status', 'log', 'tracker', 'simple', 'basic'];
  const complexScore = complexKeywords.filter(k => text.includes(k)).length;
  const simpleScore = simpleKeywords.filter(k => text.includes(k)).length;
  if (complexScore >= 2) return 'complex';
  if (simpleScore >= 2) return 'simple';
  return 'moderate';
}

// ─── TTS HELPER ───────────────────────────────────────────────────────────────
async function synthesiseLine(
  text: string,
  speaker: CastMember,
  apiKey: string
): Promise<string> {
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

  const data = await res.json() as { audioContent?: string };
  if (!data.audioContent) throw new Error(`No audio content for ${speaker}`);
  return data.audioContent;
}

// ─── LLM STREAMING SCRIPT GENERATOR ──────────────────────────────────────────
async function* streamScript(card: CardInput): AsyncGenerator<DialogueLine> {
  const apiUrl = process.env.OPENAI_BASE_URL || process.env.BUILT_IN_FORGE_API_URL;
  const apiKey = process.env.OPENAI_API_KEY || process.env.BUILT_IN_FORGE_API_KEY;

  if (!apiUrl || !apiKey) throw new Error('LLM API not configured');

  const complexity = card.complexity ?? inferComplexity(card);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90000);

  let res: globalThis.Response;
  try {
    res = await fetch(`${apiUrl}/v1/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
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
        temperature: 0.78,
        max_tokens: 5000,
        stream: true,
      }),
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`LLM error ${res.status}: ${err.slice(0, 200)}`);
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let jsonBuffer = '';

  let depth = 0;
  let inString = false;
  let escape = false;
  let objectStart = -1;

  const tryExtractObjects = (): DialogueLine[] => {
    const found: DialogueLine[] = [];
    for (let i = 0; i < buffer.length; i++) {
      const ch = buffer[i];
      if (escape) { escape = false; continue; }
      if (ch === '\\' && inString) { escape = true; continue; }
      if (ch === '"') { inString = !inString; continue; }
      if (inString) continue;
      if (ch === '{') { if (depth === 0) objectStart = i; depth++; }
      else if (ch === '}') {
        depth--;
        if (depth === 0 && objectStart !== -1) {
          const raw = buffer.slice(objectStart, i + 1);
          try {
            const obj = JSON.parse(raw) as DialogueLine;
            const validSpeakers: CastMember[] = ['Alex', 'Sam', 'Jordan', 'Maya', 'Chris'];
            if (obj.speaker && validSpeakers.includes(obj.speaker) && obj.line) found.push(obj);
          } catch { /* skip */ }
          objectStart = -1;
        }
      }
    }
    if (found.length > 0) {
      let lastEnd = -1; let d2 = 0; let inS2 = false; let esc2 = false;
      for (let i = 0; i < buffer.length; i++) {
        const ch = buffer[i];
        if (esc2) { esc2 = false; continue; }
        if (ch === '\\' && inS2) { esc2 = true; continue; }
        if (ch === '"') { inS2 = !inS2; continue; }
        if (inS2) continue;
        if (ch === '{') d2++;
        else if (ch === '}') { d2--; if (d2 === 0) lastEnd = i; }
      }
      if (lastEnd !== -1) {
        buffer = buffer.slice(lastEnd + 1);
        depth = 0; inString = false; escape = false; objectStart = -1;
      }
    }
    return found;
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    jsonBuffer += decoder.decode(value, { stream: true });
    const lines = jsonBuffer.split('\n');
    jsonBuffer = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') return;
      try {
        const chunk = JSON.parse(data) as {
          choices: Array<{ delta: { content?: string }; finish_reason?: string }>;
        };
        const token = chunk.choices?.[0]?.delta?.content ?? '';
        if (token) {
          buffer += token;
          const extracted = tryExtractObjects();
          for (const obj of extracted) yield obj;
        }
        if (chunk.choices?.[0]?.finish_reason === 'stop') return;
      } catch { /* skip malformed SSE */ }
    }
  }
  const remaining = tryExtractObjects();
  for (const obj of remaining) yield obj;
}

// ─── STREAMING MAIN HANDLER ───────────────────────────────────────────────────
export async function handlePodcastGenerate(req: Request, res: Response): Promise<void> {
  try {
    const ttsKey = process.env.GOOGLE_TTS_API_KEY;
    if (!ttsKey) {
      res.status(500).json({ error: 'Google TTS API key not configured' });
      return;
    }

    const body = (req as any)._parsedBody ?? (req as any).body ?? {};
    const card: CardInput = body.card;

    if (!card?.title || !card?.whatItIs) {
      res.status(400).json({ error: 'Missing card data' });
      return;
    }

    console.log(`[Theater] Streaming episode for: ${card.title}`);

    res.setHeader('Content-Type', 'application/x-ndjson');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Accel-Buffering', 'no');
    res.status(200);

    let index = 0;
    let successCount = 0;
    const activeSpeakers = new Set<CastMember>();

    const MAX_CONCURRENT = 4;
    const inFlight: Promise<void>[] = [];

    const processLine = async (dialogueLine: DialogueLine, lineIndex: number) => {
      try {
        const audioContent = await synthesiseLine(dialogueLine.line, dialogueLine.speaker, ttsKey);
        activeSpeakers.add(dialogueLine.speaker);
        const segment = {
          speaker: dialogueLine.speaker,
          line: dialogueLine.line,
          audioContent,
          index: lineIndex,
          done: false,
        };
        res.write(JSON.stringify(segment) + '\n');
        successCount++;
        console.log(`[Theater] Segment ${lineIndex} — ${dialogueLine.speaker}`);
      } catch (err) {
        console.error(`[Theater] TTS failed for line ${lineIndex}:`, err);
      }
    };

    for await (const dialogueLine of streamScript(card)) {
      const lineIndex = index++;
      if (inFlight.length >= MAX_CONCURRENT) await inFlight.shift();
      const p = processLine(dialogueLine, lineIndex).then(() => {
        const idx = inFlight.indexOf(p);
        if (idx !== -1) inFlight.splice(idx, 1);
      });
      inFlight.push(p);
    }

    await Promise.all(inFlight);

    if (successCount === 0) {
      res.write(JSON.stringify({ error: 'All TTS segments failed', done: true }) + '\n');
    } else {
      res.write(JSON.stringify({
        done: true,
        total: successCount,
        cast: Array.from(activeSpeakers),
      }) + '\n');
    }

    res.end();
    console.log(`[Theater] Episode complete: ${successCount} segments, cast: ${Array.from(activeSpeakers).join(', ')}`);

  } catch (err) {
    console.error('[Theater] Unexpected error:', err);
    try {
      res.write(JSON.stringify({ error: String(err), done: true }) + '\n');
      res.end();
    } catch { /* response already ended */ }
  }
}
