// podcastGenerator.ts
// Streaming two-host podcast generator.
//
// Architecture (low-latency):
//   1. LLM streams the script via SSE — we parse lines as they arrive.
//   2. Each parsed dialogue line is immediately sent to Google TTS.
//   3. As soon as a TTS response comes back it is flushed to the client as an
//      NDJSON line: { speaker, line, audioContent, index, done: false }
//   4. When all lines are done we flush { done: true, total }.
//
// The client can start playing the first segment ~3-5 s after pressing play,
// while the rest of the episode loads in the background.

import type { Request, Response } from 'express';

const GOOGLE_TTS_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';

// ─── VOICE CONFIGS ────────────────────────────────────────────────────────────
const VOICE_ALEX = { languageCode: 'en-US', name: 'en-US-Journey-D', ssmlGender: 'MALE' };
const VOICE_SAM  = { languageCode: 'en-US', name: 'en-US-Journey-O', ssmlGender: 'FEMALE' };

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
}

interface DialogueLine {
  speaker: 'Alex' | 'Sam';
  line: string;
}

// ─── SCRIPT PROMPTS ───────────────────────────────────────────────────────────
function buildSystemPrompt(): string {
  return `You are a scriptwriter for "StratAlign Theater", a popular show where two hosts — Alex and Sam — have smart, engaging conversations about project management tools and techniques.

Alex is experienced, slightly analytical, and loves real-world examples. Sam is curious, enthusiastic, and great at asking the questions listeners are thinking.

Your scripts should feel like a genuine conversation — not a lecture. Use natural speech patterns: interruptions, "exactly!", "right", "that's a good point", rhetorical questions, and light humour where appropriate.

OUTPUT FORMAT — return ONLY a JSON array, no markdown, no explanation:
[
  { "speaker": "Alex", "line": "..." },
  { "speaker": "Sam",  "line": "..." },
  ...
]

Episode structure (target 30–50 lines for a 5–10 min episode):
1. Warm intro — both hosts greet listeners and introduce the topic (4–6 lines)
2. What it is — clear explanation with an analogy (6–8 lines)
3. When to use it — real-world scenarios (6–8 lines)
4. Step-by-step walkthrough — detailed, practical (8–10 lines)
5. Real-world example — specific project scenario (6–8 lines)
6. Common mistakes & pro tips (4–6 lines)
7. Wrap-up — key takeaway + teaser for related sessions (4–6 lines)

Rules:
- Each line: 1–3 natural sentences. Not too short (choppy) or too long (hard to follow).
- Vary who asks and who explains — don't let one host dominate.
- NEVER use bullet points or numbered lists inside a line — speak naturally.

CRITICAL language rules:
- NEVER say "as you know", "as we all know", "you already know", "of course you know", or any variation that assumes prior knowledge.
- When mentioning another PMO tool by name, ALWAYS frame it as a separate session: "we cover that in another session", "that's a whole episode on its own", "check out our session on [tool name]".
- Treat every listener as if this is their very first episode.`;
}

function buildUserPrompt(card: CardInput): string {
  return `Create a podcast episode about this PMO tool:

Title: ${card.title}
Tagline: ${card.tagline}
What it is: ${card.whatItIs}
When to use: ${card.whenToUse}
Steps: ${card.steps?.join('; ') ?? 'N/A'}
Pro tip: ${card.proTip}
Example: ${card.example ?? 'N/A'}
Deck: ${card.deckTitle}

Make this episode genuinely informative and entertaining. Target 30–50 lines. The listener should finish knowing exactly when and how to use this tool.`;
}

// ─── TTS HELPER ───────────────────────────────────────────────────────────────
async function synthesiseLine(
  text: string,
  speaker: 'Alex' | 'Sam',
  apiKey: string
): Promise<string> {
  const voice = speaker === 'Alex' ? VOICE_ALEX : VOICE_SAM;

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
// Calls the LLM with stream:true and yields DialogueLines as they are parsed
// from the SSE token stream. This lets us start TTS before the full script is done.
async function* streamScript(card: CardInput): AsyncGenerator<DialogueLine> {
  const apiUrl = process.env.OPENAI_BASE_URL || process.env.BUILT_IN_FORGE_API_URL;
  const apiKey = process.env.OPENAI_API_KEY || process.env.BUILT_IN_FORGE_API_KEY;

  if (!apiUrl || !apiKey) throw new Error('LLM API not configured');

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
          { role: 'system', content: buildSystemPrompt() },
          { role: 'user',   content: buildUserPrompt(card) },
        ],
        temperature: 0.75,
        max_tokens: 4000,
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

  // Read the SSE stream and accumulate tokens into a JSON buffer
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = ''; // accumulated JSON text from tokens
  let jsonBuffer = ''; // the raw SSE line buffer

  // We parse the JSON array incrementally.
  // Strategy: accumulate all tokens, then extract complete JSON objects
  // using a simple brace-depth scanner as soon as we see a closing `}`.
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

      if (ch === '{') {
        if (depth === 0) objectStart = i;
        depth++;
      } else if (ch === '}') {
        depth--;
        if (depth === 0 && objectStart !== -1) {
          const raw = buffer.slice(objectStart, i + 1);
          try {
            const obj = JSON.parse(raw) as DialogueLine;
            if (obj.speaker && obj.line) found.push(obj);
          } catch {
            // partial or malformed — skip
          }
          objectStart = -1;
        }
      }
    }
    // Trim consumed buffer up to the last complete object
    if (found.length > 0) {
      // Find the last `}` at depth 0 to trim
      let lastEnd = -1;
      let d2 = 0;
      let inS2 = false;
      let esc2 = false;
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
        // reset scanner state
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
      } catch {
        // malformed SSE chunk — skip
      }
    }
  }

  // Final flush — try to extract any remaining complete objects
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

    console.log(`[Podcast] Streaming episode for: ${card.title}`);

    // Set up NDJSON streaming response
    res.setHeader('Content-Type', 'application/x-ndjson');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Accel-Buffering', 'no'); // disable nginx buffering
    res.status(200);

    let index = 0;
    let successCount = 0;

    // Concurrency control: allow up to 4 TTS requests in flight at once
    // to maximise throughput without hitting rate limits
    const MAX_CONCURRENT = 4;
    const inFlight: Promise<void>[] = [];

    const processLine = async (dialogueLine: DialogueLine, lineIndex: number) => {
      try {
        const audioContent = await synthesiseLine(dialogueLine.line, dialogueLine.speaker, ttsKey);
        const segment = {
          speaker: dialogueLine.speaker,
          line: dialogueLine.line,
          audioContent,
          index: lineIndex,
          done: false,
        };
        res.write(JSON.stringify(segment) + '\n');
        successCount++;
        console.log(`[Podcast] Streamed segment ${lineIndex} (${dialogueLine.speaker})`);
      } catch (err) {
        console.error(`[Podcast] TTS failed for line ${lineIndex}:`, err);
        // Skip failed line — don't break the stream
      }
    };

    for await (const dialogueLine of streamScript(card)) {
      const lineIndex = index++;

      // If at max concurrency, wait for one to finish
      if (inFlight.length >= MAX_CONCURRENT) {
        await inFlight.shift();
      }

      const p = processLine(dialogueLine, lineIndex).then(() => {
        const idx = inFlight.indexOf(p);
        if (idx !== -1) inFlight.splice(idx, 1);
      });
      inFlight.push(p);
    }

    // Wait for all remaining TTS requests
    await Promise.all(inFlight);

    if (successCount === 0) {
      res.write(JSON.stringify({ error: 'All TTS segments failed', done: true }) + '\n');
    } else {
      res.write(JSON.stringify({ done: true, total: successCount }) + '\n');
    }

    res.end();
    console.log(`[Podcast] Episode complete: ${successCount} segments for "${card.title}"`);

  } catch (err) {
    console.error('[Podcast] Unexpected error:', err);
    try {
      res.write(JSON.stringify({ error: String(err), done: true }) + '\n');
      res.end();
    } catch {
      // response already ended
    }
  }
}
