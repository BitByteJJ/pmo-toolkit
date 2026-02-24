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

// All 5 characters rotate through every episode.
// Complexity determines cast size (3–5), but the rotating guest slot ensures
// Maya and Chris appear just as often as Jordan.
const GUEST_ROTATION: SpeakerName[] = ['Jordan', 'Maya', 'Chris'];
let _guestRotationIndex = 0;

function selectCast(card: CardInput): SpeakerName[] {
  const complexity = scoreComplexity(card);

  // Alex and Sam are always the core duo.
  // Pick 1–3 guests from the rotation so every character appears regularly.
  if (complexity <= 1) {
    // Simple card: 3 hosts — Alex, Sam + 1 rotating guest
    const guest = GUEST_ROTATION[_guestRotationIndex % GUEST_ROTATION.length];
    _guestRotationIndex++;
    return ['Alex', 'Sam', guest];
  }
  if (complexity <= 3) {
    // Medium card: 4 hosts — Alex, Sam + 2 rotating guests
    const g1 = GUEST_ROTATION[_guestRotationIndex % GUEST_ROTATION.length];
    const g2 = GUEST_ROTATION[(_guestRotationIndex + 1) % GUEST_ROTATION.length];
    _guestRotationIndex += 2;
    return ['Alex', 'Sam', g1, g2];
  }
  // Complex card: full 5-person panel
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

  return `You are the head writer for "StratAlign Theater" — a podcast that sounds like the smartest, funniest group of friends you know talking about project management. Think NPR's "How I Built This" meets "The Office" banter meets genuinely useful PM advice.

Today's cast:
${castDescriptions}

THE VIBE: This is NOT a corporate training video. It's a real conversation between people who genuinely care about this stuff AND have strong opinions. There should be:
- Friendly disagreements ("I actually push back on that a little...")
- Genuine laughs ("Ha! I've been in that exact meeting")
- Moments of surprise ("Wait, I never thought about it that way")
- Personality clashes that create energy (Chris wants speed, Maya wants data, Jordan wants to zoom out)
- Callbacks to earlier points in the episode
- Occasional self-deprecating humour from the hosts about their own past mistakes

OUTPUT FORMAT — return ONLY a valid JSON array with no markdown, no code fences, no explanation:
[
  { "speaker": "Alex", "line": "..." },
  { "speaker": "Sam",  "line": "..." },
  ...
]

The "speaker" field MUST be one of: ${speakerList}

STRUCTURE (30–40 lines, proper 5–8 minute episode):
1. COLD OPEN (2–3 lines): Start mid-conversation with a hook — a surprising stat, a provocative claim, or a relatable disaster story. Don't start with "Welcome to StratAlign Theater."
2. INTRO (2–3 lines): Hosts briefly introduce themselves and the topic with genuine enthusiasm
3. CORE DISCUSSION (20–25 lines): Cover what the tool is, why it matters, when to use it, a juicy real-world example, and common mistakes. Let each character's personality drive their contributions:
   - Alex shares war stories from large enterprise projects
   - Sam asks the "dumb question" that listeners are actually thinking
   - Jordan zooms out to the cultural/strategic angle
   - Maya demands evidence: "but what does the data say?"
   - Chris asks "but what if you only have 3 people and no budget?"
4. RAPID FIRE (3–4 lines): Each host gives their single most memorable takeaway in one punchy sentence
5. SIGN-OFF (2–3 lines): Warm, energetic close with a teaser for related topics

STYLE RULES:
- Each line: 1–3 natural sentences. No bullet points inside lines. Speak like a human.
- Use: "Exactly!", "Oh that's such a good point", "Okay but here's where I disagree", "I've made that mistake", "Right, and the thing people miss is...", "Wait, say more about that"
- Vary who speaks — spread lines roughly evenly, no host should dominate
- Include at least 2 moments of genuine disagreement or pushback between hosts
- Include at least 1 funny or self-deprecating moment per episode
- Include at least 1 concrete number or real-world example

JOKES & RELATABLE HUMOUR — REQUIRED (at least 2 per episode):
Every episode MUST include at least 2 PM-specific jokes or relatable observations. Use these as inspiration but make them feel natural in context:
- Scope creep: "The project started as a landing page and somehow ended up including a full ERP migration and a rebrand."
- Status meetings: "We had a 45-minute meeting to decide when to have the meeting about the meeting."
- Gantt charts: "The Gantt chart looked beautiful on day one. By day three it was basically modern art."
- Stakeholders: "The stakeholder said 'I just want a simple dashboard' and then sent 47 follow-up emails with new requirements."
- Estimates: "We estimated two weeks. It took four months. The estimate was correct, we just forgot to account for reality."
- Risk registers: "We had a risk register. We just never looked at it."
- Agile: "We're doing agile. Which means we have sprints, standups, retros, and absolutely no idea what we're building."
- Velocity: "Our velocity was amazing in sprint one. Then we discovered what the project actually was."
- Documentation: "The documentation was thorough, detailed, and completely out of date by the time anyone read it."
- Sign-off: "We got sign-off from everyone except the one person whose opinion actually mattered."

The jokes should feel like something a PM would say at a team lunch — wry, self-aware, and instantly recognisable. Weave them into the conversation naturally, not as a separate "joke segment".

CRITICAL language rules:
- NEVER say "as you know", "as we all know", "you already know", or any variation that assumes prior knowledge. Every listener is a first-timer.
- When mentioning another PMO tool by name, ALWAYS frame it as a separate session: "we cover that in another session", "that's a whole episode on its own", "check out our session on [tool name]"
- NEVER start the episode with "Welcome to StratAlign Theater" — start with something that immediately grabs attention`;
}

function buildUserPrompt(card: CardInput, cast: SpeakerName[]): string {
  const castList = cast.join(', ');
  return `Create a StratAlign Theater episode about "${card.title}" featuring ${castList}.

TOOL BRIEF:
- Title: ${card.title}
- Tagline: ${card.tagline}
- What it is: ${card.whatItIs}
- When to use: ${card.whenToUse}
- Steps: ${card.steps?.join('; ') ?? 'N/A'}
- Pro tip: ${card.proTip}
- Real-world example: ${card.example ?? 'N/A'}
- Deck: ${card.deckTitle}

MAKE IT GREAT:
- Open with a hook that makes the listener think "oh I've been in that situation"
- Include a moment where two hosts genuinely disagree about something
- Include a funny or relatable failure story from one of the hosts
- Make the real-world example vivid and specific (name a type of company, a specific situation)
- The listener should finish knowing EXACTLY when to reach for this tool and what mistake to avoid
- End on a high note that makes the listener want to try it immediately`;
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
