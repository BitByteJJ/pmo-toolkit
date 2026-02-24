// podcastGenerator.ts — StratAlign Theater
// Generates a multi-host podcast episode for a PMO card.
//
// PERFORMANCE OPTIMISATION:
// - LLM script generation and TTS now run with maximum parallelism.
// - TTS is fired for ALL lines simultaneously (concurrency-limited to 10 in-flight at once).
// - For a 30-line episode this cuts wall-clock time from ~90s (sequential batches of 4)
//   down to ~15–20s (all lines in parallel, limited by Google TTS quota).
// - The endpoint streams Server-Sent Events (SSE) so the UI can show live progress:
//     data: {"type":"progress","done":5,"total":30}
//   then finally:
//     data: {"type":"done","segments":[...],"cast":[...]}
//
// DOWNLOAD:
// - /api/podcast-download stitches base64 segments into a single MP3 binary.
//   MP3 frames are self-synchronising so simple buffer concatenation is valid.

import type { Request, Response } from 'express';

const GOOGLE_TTS_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';

// ─── CAST OF CHARACTERS ───────────────────────────────────────────────────────
export type SpeakerName = 'Alex' | 'Sam' | 'Jordan' | 'Maya' | 'Chris';

interface CharacterConfig {
  name: SpeakerName;
  role: string;
  personality: string;
}

const CHARACTERS: Record<SpeakerName, CharacterConfig> = {
  Alex: {
    name: 'Alex',
    role: 'Senior PMO Consultant',
    personality: 'Experienced, analytical, loves real-world war stories and hard-won lessons from large enterprise projects.',
  },
  Sam: {
    name: 'Sam',
    role: 'Agile Coach',
    personality: 'Curious, enthusiastic, great at asking the questions listeners are thinking. Champions simplicity and people-first thinking.',
  },
  Jordan: {
    name: 'Jordan',
    role: 'Strategy & Change Management Lead',
    personality: 'Thoughtful, big-picture thinker who connects tools to organisational culture and strategic outcomes. Asks "but why does this matter?"',
  },
  Maya: {
    name: 'Maya',
    role: 'Data & Analytics Specialist',
    personality: 'Evidence-driven, loves metrics and KPIs. Pushes for measurable outcomes and challenges vague claims with "show me the data".',
  },
  Chris: {
    name: 'Chris',
    role: 'Startup Founder & Product Manager',
    personality: 'Pragmatic, fast-moving, always thinking about lean execution and what a small team can actually do. Brings startup energy to enterprise tools.',
  },
};

// Voice assignments — Journey voices: D (male), O (female), F (female)
const VOICE_MAP: Record<SpeakerName, { languageCode: string; name: string; ssmlGender: string }> = {
  Alex:   { languageCode: 'en-US', name: 'en-US-Journey-D', ssmlGender: 'MALE' },
  Sam:    { languageCode: 'en-US', name: 'en-US-Journey-O', ssmlGender: 'FEMALE' },
  Jordan: { languageCode: 'en-US', name: 'en-US-Journey-F', ssmlGender: 'FEMALE' },
  Maya:   { languageCode: 'en-US', name: 'en-US-Journey-D', ssmlGender: 'MALE' },
  Chris:  { languageCode: 'en-US', name: 'en-US-Journey-O', ssmlGender: 'FEMALE' },
};

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
  speaker: SpeakerName;
  line: string;
}

export interface PodcastSegment {
  speaker: SpeakerName;
  line: string;
  audioContent: string; // base64 MP3
}

// ─── COMPLEXITY SCORING ───────────────────────────────────────────────────────
function scoreComplexity(card: CardInput): number {
  let score = 0;
  if (card.steps && card.steps.length > 5) score += 2;
  else if (card.steps && card.steps.length > 2) score += 1;
  if (card.example && card.example.length > 200) score += 1;
  if (card.whatItIs.length > 300) score += 1;
  if (card.whenToUse.length > 200) score += 1;
  const strategicDecks = ['strategic', 'methodolog', 'business', 'technique'];
  if (strategicDecks.some(d => card.deckTitle.toLowerCase().includes(d))) score += 1;
  return score;
}

function selectCast(card: CardInput): SpeakerName[] {
  const complexity = scoreComplexity(card);
  if (complexity <= 1) return ['Alex', 'Sam'];
  if (complexity <= 3) return ['Alex', 'Sam', 'Jordan'];
  if (complexity <= 5) return ['Alex', 'Sam', 'Jordan', 'Maya'];
  return ['Alex', 'Sam', 'Jordan', 'Maya', 'Chris'];
}

// ─── PROMPT BUILDERS ─────────────────────────────────────────────────────────
function buildSystemPrompt(cast: SpeakerName[]): string {
  const castDescriptions = cast
    .map(name => {
      const c = CHARACTERS[name];
      return `- ${name} (${c.role}): ${c.personality}`;
    })
    .join('\n');

  const speakerList = cast.map(n => `"${n}"`).join(', ');

  return `You are a scriptwriter for "StratAlign Theater", a popular podcast where project management experts have smart, engaging conversations about PM tools and techniques.

Today's cast:
${castDescriptions}

Your scripts should feel like a genuine roundtable conversation — not a lecture. Use natural speech patterns: interruptions, "exactly!", "right", "that's a good point", rhetorical questions, and light humour where appropriate. Let each character's personality shine through. Avoid bullet-point thinking; let ideas flow naturally.

OUTPUT FORMAT — return ONLY a valid JSON array with no markdown, no code fences, no explanation:
[
  { "speaker": "Alex", "line": "..." },
  { "speaker": "Sam",  "line": "..." },
  ...
]

The "speaker" field MUST be one of: ${speakerList}

Rules:
- Minimum 24 exchanges (aim for 30–40 lines total) — this should be a proper 5–8 minute episode
- Start with a warm intro where the hosts introduce the topic and themselves briefly
- Cover: what the tool is, why it matters, when to use it, a detailed real-world example, common mistakes, and a memorable takeaway
- Each character should contribute from their unique perspective (e.g. Maya asks for data, Chris asks how a small team would use it, Jordan asks about the cultural/strategic angle)
- End with each host sharing their single biggest insight and a teaser for listeners to explore related tools
- Keep each line to 1–3 natural sentences — not too short (feels choppy) and not too long (hard to follow)
- Vary who speaks — don't let one host dominate; spread lines roughly evenly across the cast
- NEVER use bullet points or numbered lists inside a line — speak naturally

CRITICAL language rules — violating these will ruin the listener experience:
- NEVER say "as you know", "as we all know", "you already know", "of course you know", "as I'm sure you know", or any variation that assumes prior listener knowledge. The listener may be hearing about this topic for the first time.
- When mentioning another PMO tool or technique by name (e.g. "Risk Register", "RACI Matrix", "Agile"), ALWAYS frame it as a separate session: say "we cover that in another session", "that's a whole episode on its own", "we have a dedicated session on that", or "check out our session on [tool name]" — never assume the listener has already heard it.
- Treat every listener as if this is their very first episode. Introduce concepts clearly without condescension.`;
}

function buildUserPrompt(card: CardInput, cast: SpeakerName[]): string {
  const castList = cast.join(', ');
  return `Create a StratAlign Theater episode about this PMO tool, featuring ${castList}:

Title: ${card.title}
Tagline: ${card.tagline}
What it is: ${card.whatItIs}
When to use: ${card.whenToUse}
Steps: ${card.steps?.join('; ') ?? 'N/A'}
Pro tip: ${card.proTip}
Example: ${card.example ?? 'N/A'}
Deck: ${card.deckTitle}

Make this episode genuinely informative and entertaining. The listener should finish it knowing exactly when and how to use this tool, with a concrete mental model. Each host should bring their unique perspective to the discussion.`;
}

// ─── TTS HELPER ───────────────────────────────────────────────────────────────
async function synthesizeLine(
  text: string,
  speaker: SpeakerName,
  apiKey: string
): Promise<string> {
  const voice = VOICE_MAP[speaker];

  const processed = text
    .replace(/\s*—\s*/g, ', ')
    .replace(/;/g, ',')
    .replace(/\.\.\./g, ',')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 4000);

  const body = {
    input: { text: processed },
    voice,
    audioConfig: AUDIO_CONFIG,
  };

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

// ─── PARALLEL TTS WITH CONCURRENCY LIMIT ─────────────────────────────────────
// Runs up to `concurrency` TTS requests simultaneously.
// This is the key performance improvement: instead of sequential batches of 4,
// we fire all lines at once (bounded by concurrency limit to respect API rate limits).
async function synthesizeAllLines(
  lines: DialogueLine[],
  apiKey: string,
  concurrency = 10,
  onProgress?: (done: number, total: number) => void
): Promise<Array<PodcastSegment | null>> {
  const results: Array<PodcastSegment | null> = new Array(lines.length).fill(null);
  let done = 0;
  let index = 0;

  async function worker() {
    while (index < lines.length) {
      const i = index++;
      const line = lines[i];
      try {
        const audioContent = await synthesizeLine(line.line, line.speaker, apiKey);
        results[i] = { speaker: line.speaker, line: line.line, audioContent };
      } catch (err) {
        console.error(`[StratAlign Theater] TTS failed for ${line.speaker}: ${line.line.slice(0, 50)}`, err);
        results[i] = null;
      }
      done++;
      onProgress?.(done, lines.length);
    }
  }

  // Launch `concurrency` workers simultaneously
  const workers = Array.from({ length: Math.min(concurrency, lines.length) }, () => worker());
  await Promise.all(workers);

  return results;
}

// ─── LLM SCRIPT GENERATOR ────────────────────────────────────────────────────
async function generateScript(card: CardInput, cast: SpeakerName[]): Promise<DialogueLine[]> {
  const apiUrl = process.env.OPENAI_BASE_URL || process.env.BUILT_IN_FORGE_API_URL;
  const apiKey = process.env.OPENAI_API_KEY || process.env.BUILT_IN_FORGE_API_KEY;

  if (!apiUrl || !apiKey) throw new Error('LLM API not configured');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch(`${apiUrl}/v1/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gemini-2.0-flash',
        messages: [
          { role: 'system', content: buildSystemPrompt(cast) },
          { role: 'user',   content: buildUserPrompt(card, cast) },
        ],
        temperature: 0.75,
        max_tokens: 4000,
      }),
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`LLM error ${res.status}: ${err.slice(0, 200)}`);
    }

    const data = await res.json() as { choices: Array<{ message: { content: string } }> };
    const content = data.choices?.[0]?.message?.content ?? '';

    const cleaned = content
      .replace(/^```(?:json)?\s*/m, '')
      .replace(/\s*```\s*$/m, '')
      .trim();

    const arrayStart = cleaned.indexOf('[');
    const arrayEnd = cleaned.lastIndexOf(']');
    if (arrayStart === -1 || arrayEnd === -1) {
      throw new Error('LLM response does not contain a JSON array');
    }
    const jsonStr = cleaned.slice(arrayStart, arrayEnd + 1);
    const parsed = JSON.parse(jsonStr) as DialogueLine[];

    if (!Array.isArray(parsed) || parsed.length < 4) {
      throw new Error('LLM returned invalid script structure');
    }

    const validSpeakers = new Set<string>(cast);
    const filtered = parsed.filter(line =>
      validSpeakers.has(line.speaker) &&
      typeof line.line === 'string' &&
      line.line.trim().length > 0
    );

    if (filtered.length < 4) {
      throw new Error(`Too few valid lines after filtering: ${filtered.length}`);
    }

    return filtered;
  } finally {
    clearTimeout(timeout);
  }
}

// ─── MAIN HANDLER — SSE STREAMING ─────────────────────────────────────────────
// Streams progress events so the UI can show "Generating segment X of Y…"
// This dramatically improves perceived performance even before total latency drops.
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

    const useSSE = req.headers.accept?.includes('text/event-stream');

    if (useSSE) {
      // ── SSE mode: stream progress events ──
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no'); // disable nginx buffering
      res.flushHeaders();

      const sendEvent = (data: object) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
        // Flush if available (for Node.js HTTP compression middleware)
        if (typeof (res as any).flush === 'function') (res as any).flush();
      };

      try {
        const cast = selectCast(card);
        sendEvent({ type: 'cast', cast });
        sendEvent({ type: 'status', message: 'Writing script…' });

        let script: DialogueLine[];
        try {
          script = await generateScript(card, cast);
        } catch (err) {
          sendEvent({ type: 'error', message: 'Failed to generate script', details: String(err) });
          res.end();
          return;
        }

        sendEvent({ type: 'status', message: `Script ready (${script.length} lines). Generating audio…`, total: script.length });

        const rawResults = await synthesizeAllLines(script, ttsKey, 10, (done, total) => {
          sendEvent({ type: 'progress', done, total });
        });

        const segments = rawResults.filter((s): s is PodcastSegment => s !== null);

        if (segments.length === 0) {
          sendEvent({ type: 'error', message: 'All TTS segments failed' });
          res.end();
          return;
        }

        sendEvent({ type: 'done', segments, cast, totalLines: script.length });
        res.end();
      } catch (err) {
        try {
          res.write(`data: ${JSON.stringify({ type: 'error', message: String(err) })}\n\n`);
        } catch {}
        res.end();
      }
    } else {
      // ── JSON mode: wait for full result (backwards-compatible) ──
      const cast = selectCast(card);
      let script: DialogueLine[];
      try {
        script = await generateScript(card, cast);
      } catch (err) {
        res.status(502).json({ error: 'Failed to generate podcast script', details: String(err) });
        return;
      }

      const rawResults = await synthesizeAllLines(script, ttsKey, 10);
      const segments = rawResults.filter((s): s is PodcastSegment => s !== null);

      if (segments.length === 0) {
        res.status(500).json({ error: 'All TTS segments failed' });
        return;
      }

      res.status(200).json({ segments, totalLines: script.length, cast });
    }
  } catch (err) {
    console.error('[StratAlign Theater] Unexpected error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal podcast generation error', details: String(err) });
    }
  }
}
