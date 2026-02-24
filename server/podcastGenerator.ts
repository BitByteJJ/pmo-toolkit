// podcastGenerator.ts — StratAlign Theater
// Generates a multi-host podcast episode for a PMO card.
// Step 1: LLM selects 2–5 characters based on topic complexity and writes a rich dialogue.
// Step 2: Each dialogue line is sent to Google TTS with the matching character voice.
// Step 3: All base64 MP3 segments are returned as a single JSON response.

import type { Request, Response } from 'express';

const GOOGLE_TTS_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';

// ─── CAST OF CHARACTERS ───────────────────────────────────────────────────────
// Five distinct characters, each with a unique voice and role in the show.

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
// Alex  → Journey-D (deep male)
// Sam   → Journey-O (warm female)
// Jordan→ Journey-F (clear female)
// Maya  → Journey-D (same voice as Alex but distinct personality)
// Chris → Journey-O (same voice as Sam but distinct personality)
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
// Determines how many characters to use based on the card's content richness.
function scoreComplexity(card: CardInput): number {
  let score = 0;
  if (card.steps && card.steps.length > 5) score += 2;
  else if (card.steps && card.steps.length > 2) score += 1;
  if (card.example && card.example.length > 200) score += 1;
  if (card.whatItIs.length > 300) score += 1;
  if (card.whenToUse.length > 200) score += 1;
  // Strategic/methodology decks get more voices
  const strategicDecks = ['strategic', 'methodolog', 'business', 'technique'];
  if (strategicDecks.some(d => card.deckTitle.toLowerCase().includes(d))) score += 1;
  return score;
}

function selectCast(card: CardInput): SpeakerName[] {
  const complexity = scoreComplexity(card);
  // 0–1: 2 hosts (Alex + Sam — the core duo)
  // 2–3: 3 hosts (add Jordan for strategic depth)
  // 4–5: 4 hosts (add Maya for data-driven angle)
  // 6+:  5 hosts (full cast)
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
async function generateScript(card: CardInput, cast: SpeakerName[]): Promise<DialogueLine[]> {
  const apiUrl = process.env.OPENAI_BASE_URL || process.env.BUILT_IN_FORGE_API_URL;
  const apiKey = process.env.OPENAI_API_KEY || process.env.BUILT_IN_FORGE_API_KEY;

  if (!apiUrl || !apiKey) throw new Error('LLM API not configured');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000); // 60s for longer scripts

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

    // Strip markdown code fences if present
    const cleaned = content
      .replace(/^```(?:json)?\s*/m, '')
      .replace(/\s*```\s*$/m, '')
      .trim();

    // Find the JSON array in the response (robust extraction)
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

    // Validate and filter speaker names
    const validSpeakers = new Set<string>(cast);
    const filtered = parsed.filter(line =>
      validSpeakers.has(line.speaker) && typeof line.line === 'string' && line.line.trim().length > 0
    );

    if (filtered.length < 4) {
      throw new Error(`Too few valid lines after filtering: ${filtered.length}`);
    }

    return filtered;
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

    console.log(`[StratAlign Theater] Generating episode for: ${card.title}`);

    // Determine cast based on topic complexity
    const cast = selectCast(card);
    console.log(`[StratAlign Theater] Cast selected: ${cast.join(', ')} (${cast.length} hosts)`);

    // Step 1: Generate the dialogue script via LLM
    let script: DialogueLine[];
    try {
      script = await generateScript(card, cast);
      console.log(`[StratAlign Theater] Script generated: ${script.length} lines`);
    } catch (err) {
      console.error('[StratAlign Theater] Script generation failed:', err);
      sendJson(502, { error: 'Failed to generate podcast script', details: String(err) });
      return;
    }

    // Step 2: TTS each line concurrently (in batches of 4 to avoid rate limits)
    const segments: PodcastSegment[] = [];
    const BATCH_SIZE = 4;

    for (let i = 0; i < script.length; i += BATCH_SIZE) {
      const batch = script.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(async (line) => {
          try {
            const audioContent = await synthesizeLine(line.line, line.speaker as SpeakerName, ttsKey);
            return { speaker: line.speaker as SpeakerName, line: line.line, audioContent };
          } catch (err) {
            console.error(`[StratAlign Theater] TTS failed for ${line.speaker}: ${line.line.slice(0, 50)}`, err);
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

    console.log(`[StratAlign Theater] Generated ${segments.length} audio segments with cast: ${cast.join(', ')}`);
    sendJson(200, { segments, totalLines: script.length, cast });

  } catch (err) {
    console.error('[StratAlign Theater] Unexpected error:', err);
    sendJson(500, { error: 'Internal podcast generation error', details: String(err) });
  }
}
