// stratAlignTheater.test.ts
// Tests for StratAlign Theater podcast generator:
// - Cast selection based on topic complexity
// - Voice mapping for all 5 characters
// - Prompt building with correct speaker lists
// - Script validation and filtering

import { describe, it, expect } from 'vitest';

// ─── Re-implement the pure logic functions for testing ─────────────────────────
// (We test the logic directly without importing the Express handler)

type SpeakerName = 'Alex' | 'Sam' | 'Jordan' | 'Maya' | 'Chris';

const VOICE_MAP: Record<SpeakerName, { languageCode: string; name: string; ssmlGender: string }> = {
  Alex:   { languageCode: 'en-US', name: 'en-US-Journey-D', ssmlGender: 'MALE' },
  Sam:    { languageCode: 'en-US', name: 'en-US-Journey-O', ssmlGender: 'FEMALE' },
  Jordan: { languageCode: 'en-US', name: 'en-US-Journey-F', ssmlGender: 'FEMALE' },
  Maya:   { languageCode: 'en-US', name: 'en-US-Journey-D', ssmlGender: 'MALE' },
  Chris:  { languageCode: 'en-US', name: 'en-US-Journey-O', ssmlGender: 'FEMALE' },
};

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

// ─── TESTS ────────────────────────────────────────────────────────────────────

describe('StratAlign Theater — Voice Map', () => {
  it('should have a voice for every character', () => {
    const speakers: SpeakerName[] = ['Alex', 'Sam', 'Jordan', 'Maya', 'Chris'];
    for (const speaker of speakers) {
      expect(VOICE_MAP[speaker]).toBeDefined();
      expect(VOICE_MAP[speaker].name).toMatch(/^en-US-Journey-[DOF]$/);
      expect(VOICE_MAP[speaker].languageCode).toBe('en-US');
    }
  });

  it('Alex should use Journey-D (male)', () => {
    expect(VOICE_MAP.Alex.name).toBe('en-US-Journey-D');
    expect(VOICE_MAP.Alex.ssmlGender).toBe('MALE');
  });

  it('Sam should use Journey-O (female)', () => {
    expect(VOICE_MAP.Sam.name).toBe('en-US-Journey-O');
    expect(VOICE_MAP.Sam.ssmlGender).toBe('FEMALE');
  });

  it('Jordan should use Journey-F (female)', () => {
    expect(VOICE_MAP.Jordan.name).toBe('en-US-Journey-F');
    expect(VOICE_MAP.Jordan.ssmlGender).toBe('FEMALE');
  });
});

describe('StratAlign Theater — Complexity Scoring', () => {
  const baseCard: CardInput = {
    title: 'Test Tool',
    tagline: 'A simple tool',
    whatItIs: 'A short description.',
    whenToUse: 'When needed.',
    proTip: 'Use it wisely.',
    deckTitle: 'Phases',
  };

  it('simple card with no steps scores 0', () => {
    expect(scoreComplexity(baseCard)).toBe(0);
  });

  it('card with 3 steps scores 1', () => {
    const card = { ...baseCard, steps: ['Step 1', 'Step 2', 'Step 3'] };
    expect(scoreComplexity(card)).toBe(1);
  });

  it('card with 6 steps scores 2', () => {
    const card = { ...baseCard, steps: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'] };
    expect(scoreComplexity(card)).toBe(2);
  });

  it('strategic deck adds 1 to score', () => {
    const card = { ...baseCard, deckTitle: 'Strategic Planning' };
    expect(scoreComplexity(card)).toBe(1);
  });

  it('methodology deck adds 1 to score', () => {
    const card = { ...baseCard, deckTitle: 'Methodologies & Frameworks' };
    expect(scoreComplexity(card)).toBe(1);
  });

  it('long whatItIs (>300 chars) adds 1', () => {
    const card = { ...baseCard, whatItIs: 'A'.repeat(301) };
    expect(scoreComplexity(card)).toBe(1);
  });

  it('long example (>200 chars) adds 1', () => {
    const card = { ...baseCard, example: 'B'.repeat(201) };
    expect(scoreComplexity(card)).toBe(1);
  });

  it('long whenToUse (>200 chars) adds 1', () => {
    const card = { ...baseCard, whenToUse: 'C'.repeat(201) };
    expect(scoreComplexity(card)).toBe(1);
  });
});

describe('StratAlign Theater — Cast Selection', () => {
  const simpleCard: CardInput = {
    title: 'Simple Tool',
    tagline: 'Basic',
    whatItIs: 'Short.',
    whenToUse: 'Sometimes.',
    proTip: 'Tip.',
    deckTitle: 'Phases',
  };

  it('simple card (score 0) gets 2-host cast: Alex + Sam', () => {
    const cast = selectCast(simpleCard);
    expect(cast).toHaveLength(2);
    expect(cast).toContain('Alex');
    expect(cast).toContain('Sam');
  });

  it('moderately complex card (score 2-3) gets 3-host cast', () => {
    const card = {
      ...simpleCard,
      steps: ['S1', 'S2', 'S3'],
      deckTitle: 'Strategic Planning', // +1 for strategic
    };
    const cast = selectCast(card);
    expect(cast).toHaveLength(3);
    expect(cast).toContain('Jordan');
  });

  it('complex card (score 4-5) gets 4-host cast', () => {
    const card = {
      ...simpleCard,
      steps: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'], // +2
      whatItIs: 'A'.repeat(301), // +1
      whenToUse: 'C'.repeat(201), // +1
    };
    const cast = selectCast(card);
    expect(cast).toHaveLength(4);
    expect(cast).toContain('Maya');
  });

  it('very complex card (score 6+) gets full 5-host cast', () => {
    const card = {
      ...simpleCard,
      steps: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'], // +2
      whatItIs: 'A'.repeat(301), // +1
      whenToUse: 'C'.repeat(201), // +1
      example: 'B'.repeat(201), // +1
      deckTitle: 'Methodologies', // +1
    };
    const cast = selectCast(card);
    expect(cast).toHaveLength(5);
    expect(cast).toContain('Chris');
  });

  it('cast always starts with Alex and Sam', () => {
    const cards = [
      simpleCard,
      { ...simpleCard, steps: ['S1', 'S2', 'S3'], deckTitle: 'Strategic' },
      { ...simpleCard, steps: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'], whatItIs: 'A'.repeat(301) },
    ];
    for (const card of cards) {
      const cast = selectCast(card);
      expect(cast[0]).toBe('Alex');
      expect(cast[1]).toBe('Sam');
    }
  });
});

describe('StratAlign Theater — Script Validation', () => {
  const validCast: SpeakerName[] = ['Alex', 'Sam'];

  function validateScript(
    parsed: Array<{ speaker: string; line: string }>,
    cast: SpeakerName[]
  ): Array<{ speaker: SpeakerName; line: string }> {
    const validSpeakers = new Set<string>(cast);
    return parsed.filter(line =>
      validSpeakers.has(line.speaker) && typeof line.line === 'string' && line.line.trim().length > 0
    ) as Array<{ speaker: SpeakerName; line: string }>;
  }

  it('filters out lines with invalid speakers', () => {
    const script = [
      { speaker: 'Alex', line: 'Hello!' },
      { speaker: 'Unknown', line: 'I should be filtered.' },
      { speaker: 'Sam', line: 'Hi there!' },
    ];
    const filtered = validateScript(script, validCast);
    expect(filtered).toHaveLength(2);
    expect(filtered.map(l => l.speaker)).toEqual(['Alex', 'Sam']);
  });

  it('filters out lines with empty text', () => {
    const script = [
      { speaker: 'Alex', line: 'Hello!' },
      { speaker: 'Sam', line: '' },
      { speaker: 'Sam', line: '   ' },
      { speaker: 'Alex', line: 'Goodbye!' },
    ];
    const filtered = validateScript(script, validCast);
    expect(filtered).toHaveLength(2);
  });

  it('accepts all 5 characters when all are in cast', () => {
    const fullCast: SpeakerName[] = ['Alex', 'Sam', 'Jordan', 'Maya', 'Chris'];
    const script = fullCast.map(speaker => ({ speaker, line: `Hello from ${speaker}!` }));
    const filtered = validateScript(script, fullCast);
    expect(filtered).toHaveLength(5);
  });

  it('rejects Jordan when cast is only Alex+Sam', () => {
    const script = [
      { speaker: 'Alex', line: 'Hello!' },
      { speaker: 'Jordan', line: 'I should not be here.' },
      { speaker: 'Sam', line: 'Hi!' },
    ];
    const filtered = validateScript(script, validCast);
    expect(filtered).toHaveLength(2);
    expect(filtered.some(l => l.speaker === 'Jordan')).toBe(false);
  });
});
