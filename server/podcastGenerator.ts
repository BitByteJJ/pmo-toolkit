// podcastGenerator.ts
// Generates a two-host podcast episode for a PMO card.
// Step 1: LLM writes a rich, conversational dialogue between Alex (male) and Sam (female).
// Step 2: Each dialogue line is sent to Google TTS with the matching voice.
// Step 3: All base64 MP3 segments are returned to the client for sequential playback.

import type { Request, Response } from 'express';

const GOOGLE_TTS_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';

// ─── VOICE CONFIGS ────────────────────────────────────────────────────────────
// Alex — Journey-D: warm, authoritative male voice
const VOICE_ALEX = { languageCode: 'en-US', name: 'en-US-Journey-D', ssmlGender: 'MALE' };
// Sam — Journey-O: friendly, conversational female voice
const VOICE_SAM  = { languageCode: 'en-US', name: 'en-US-Journey-O', ssmlGender: 'FEMALE' };

const AUDIO_CONFIG = {
  audioEncoding: 'MP3',
  speakingRate: 1.0,
  pitch: 0.0,
  volumeGainDb: 1.5,
  effectsProfileId: ['headphone-class-device'],
};

// ─── PODCAST SCRIPT PROMPT ────────────────────────────────────────────────────
function buildSystemPrompt(): string {
  return `You are a scriptwriter for "The PMO Toolkit Podcast", a popular show where two hosts — Alex and Sam — have smart, engaging conversations about project management tools and techniques.

Alex is experienced, slightly analytical, and loves real-world examples. Sam is curious, enthusiastic, and great at asking the questions listeners are thinking.

Your scripts should feel like a genuine conversation — not a lecture. Use natural speech patterns: interruptions, "exactly!", "right", "that's a good point", rhetorical questions, and light humour where appropriate. Avoid bullet-point thinking; let ideas flow naturally.

OUTPUT FORMAT — return ONLY a JSON array, no markdown, no explanation:
[
  { "speaker": "Alex", "line": "..." },
  { "speaker": "Sam",  "line": "..." },
  ...
]

Rules:
- Minimum 20 exchanges (40+ lines total) — this should be a proper 4–6 minute episode
- Start with a warm intro where both hosts introduce the topic
- Cover: what the tool is, why it matters, when to use it, a detailed real-world example, common mistakes, and a memorable takeaway
- End with both hosts summarising their key insight and a teaser for listeners to explore related tools
- Keep each line to 1–3 natural sentences — not too short (feels choppy) and not too long (hard to follow)
- Vary who asks questions and who explains — don't let one host dominate
- NEVER use bullet points or numbered lists inside a line — speak naturally

CRITICAL language rules — violating these will ruin the listener experience:
- NEVER say "as you know", "as we all know", "you already know", "of course you know", "as I'm sure you know", or any variation that assumes prior listener knowledge. The listener may be hearing about this topic for the first time.
- When mentioning another PMO tool or technique by name (e.g. "Risk Register", "RACI Matrix", "Agile"), ALWAYS frame it as a separate session: say "we cover that in another session", "that's a whole episode on its own", "we have a dedicated session on that", or "check out our session on [tool name]" — never assume the listener has already heard it.
- Treat every listener as if this is their very first episode. Introduce concepts clearly without condescension.`;
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

Make this episode genuinely informative and entertaining. The listener should finish it knowing exactly when and how to use this tool, with a concrete mental model.`;
}

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

interface PodcastSegment {
  speaker: 'Alex' | 'Sam';
  line: string;
  audioContent: string; // base64 MP3
}

// ─── TTS HELPER ───────────────────────────────────────────────────────────────
async function synthesiseLine(
  text: string,
  speaker: 'Alex' | 'Sam',
  apiKey: string
): Promise<string> {
  const voice = speaker === 'Alex' ? VOICE_ALEX : VOICE_SAM;

  // Soften punctuation for more natural delivery
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

// ─── LLM SCRIPT GENERATOR ────────────────────────────────────────────────────
async function generateScript(card: CardInput): Promise<DialogueLine[]> {
  const apiUrl = process.env.OPENAI_BASE_URL || process.env.BUILT_IN_FORGE_API_URL;
  const apiKey = process.env.OPENAI_API_KEY || process.env.BUILT_IN_FORGE_API_KEY;

  if (!apiUrl || !apiKey) throw new Error('LLM API not configured');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000); // 45s for longer scripts

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
          { role: 'system', content: buildSystemPrompt() },
          { role: 'user',   content: buildUserPrompt(card) },
        ],
        temperature: 0.75, // More creative for natural dialogue
        max_tokens: 3000,
      }),
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`LLM error ${res.status}: ${err.slice(0, 200)}`);
    }

    const data = await res.json() as { choices: Array<{ message: { content: string } }> };
    const content = data.choices?.[0]?.message?.content ?? '';

    // Strip markdown code fences
    const cleaned = content.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    const parsed = JSON.parse(cleaned) as DialogueLine[];

    if (!Array.isArray(parsed) || parsed.length < 4) {
      throw new Error('LLM returned invalid script structure');
    }

    return parsed;
  } finally {
    clearTimeout(timeout);
  }
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────
export async function handlePodcastGenerate(req: Request, res: Response): Promise<void> {
  const sendJson = (code: number, data: object) => {
    res.status(code).json(data);
  };

  try {
    const ttsKey = process.env.GOOGLE_TTS_API_KEY;
    if (!ttsKey) {
      sendJson(500, { error: 'Google TTS API key not configured' });
      return;
    }

    const body = (req as any)._parsedBody ?? (req as any).body ?? {};
    const card: CardInput = body.card;

    if (!card?.title || !card?.whatItIs) {
      sendJson(400, { error: 'Missing card data' });
      return;
    }

    console.log(`[Podcast] Generating episode for: ${card.title}`);

    // Step 1: Generate the dialogue script via LLM
    let script: DialogueLine[];
    try {
      script = await generateScript(card);
      console.log(`[Podcast] Script generated: ${script.length} lines`);
    } catch (err) {
      console.error('[Podcast] Script generation failed:', err);
      sendJson(502, { error: 'Failed to generate podcast script', details: String(err) });
      return;
    }

    // Step 2: TTS each line concurrently (in batches of 5 to avoid rate limits)
    const segments: PodcastSegment[] = [];
    const BATCH_SIZE = 5;

    for (let i = 0; i < script.length; i += BATCH_SIZE) {
      const batch = script.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(async (line) => {
          try {
            const audioContent = await synthesiseLine(line.line, line.speaker, ttsKey);
            return { speaker: line.speaker, line: line.line, audioContent };
          } catch (err) {
            console.error(`[Podcast] TTS failed for line: ${line.line.slice(0, 50)}`, err);
            // Skip failed lines rather than failing the whole episode
            return null;
          }
        })
      );

      for (const result of batchResults) {
        if (result) segments.push(result);
      }
    }

    if (segments.length === 0) {
      sendJson(500, { error: 'All TTS segments failed' });
      return;
    }

    console.log(`[Podcast] Generated ${segments.length} audio segments`);
    sendJson(200, { segments, totalLines: script.length });

  } catch (err) {
    console.error('[Podcast] Unexpected error:', err);
    sendJson(500, { error: 'Internal podcast generation error', details: String(err) });
  }
}
