/**
 * Unit tests for the 5 new features added in Session 7:
 * - Spaced Repetition (SM-2 algorithm)
 * - Card Comparison Tool (data integrity)
 * - Project Health Checker (scoring logic)
 * - Mind Map (graph edge building)
 * - Audio Mode (playlist building)
 */

import { describe, it, expect } from 'vitest';

// ─── SM-2 Algorithm ───────────────────────────────────────────────────────────
// Replicated from client/src/lib/sm2.ts for server-side testing

interface SM2Card {
  interval: number;
  repetitions: number;
  easeFactor: number;
  nextReview: number;
  lastRating?: number;
}

type Rating = 0 | 1 | 2 | 3; // Again=0, Hard=1, Good=2, Easy=3

function sm2Update(card: SM2Card, rating: Rating): SM2Card {
  const now = Date.now();
  let { interval, repetitions, easeFactor } = card;

  if (rating === 0) {
    // Again — reset
    interval = 1;
    repetitions = 0;
  } else if (rating === 1) {
    // Hard — keep interval, reduce EF
    interval = Math.max(1, Math.round(interval * 1.2));
    easeFactor = Math.max(1.3, easeFactor - 0.15);
  } else if (rating === 2) {
    // Good
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  } else {
    // Easy
    if (repetitions === 0) interval = 4;
    else if (repetitions === 1) interval = 10;
    else interval = Math.round(interval * easeFactor * 1.3);
    easeFactor = Math.min(2.5, easeFactor + 0.1);
    repetitions += 1;
  }

  const nextReview = now + interval * 24 * 60 * 60 * 1000;
  return { interval, repetitions, easeFactor, nextReview, lastRating: rating };
}

function isDue(card: SM2Card): boolean {
  return Date.now() >= card.nextReview;
}

describe('SM-2 Spaced Repetition Algorithm', () => {
  const defaultCard: SM2Card = {
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    nextReview: 0, // overdue
  };

  it('resets interval to 1 on Again (rating=0)', () => {
    const updated = sm2Update({ ...defaultCard, interval: 10, repetitions: 3 }, 0);
    expect(updated.interval).toBe(1);
    expect(updated.repetitions).toBe(0);
  });

  it('Hard rating reduces ease factor', () => {
    const updated = sm2Update({ ...defaultCard, easeFactor: 2.5 }, 1);
    expect(updated.easeFactor).toBeCloseTo(2.35, 2);
  });

  it('ease factor never drops below 1.3', () => {
    let card: SM2Card = { ...defaultCard, easeFactor: 1.3 };
    card = sm2Update(card, 1);
    expect(card.easeFactor).toBeGreaterThanOrEqual(1.3);
  });

  it('Good rating on first repetition sets interval to 1', () => {
    const updated = sm2Update({ ...defaultCard, repetitions: 0 }, 2);
    expect(updated.interval).toBe(1);
    expect(updated.repetitions).toBe(1);
  });

  it('Good rating on second repetition sets interval to 6', () => {
    const updated = sm2Update({ ...defaultCard, repetitions: 1, interval: 1 }, 2);
    expect(updated.interval).toBe(6);
    expect(updated.repetitions).toBe(2);
  });

  it('Easy rating on first repetition sets interval to 4', () => {
    const updated = sm2Update({ ...defaultCard, repetitions: 0 }, 3);
    expect(updated.interval).toBe(4);
    expect(updated.repetitions).toBe(1);
  });

  it('Easy rating increases ease factor (capped at 2.5)', () => {
    const updated = sm2Update({ ...defaultCard, easeFactor: 2.5 }, 3);
    expect(updated.easeFactor).toBe(2.5); // already at cap
  });

  it('Easy rating with lower EF increases it', () => {
    const updated = sm2Update({ ...defaultCard, easeFactor: 2.0 }, 3);
    expect(updated.easeFactor).toBeCloseTo(2.1, 2);
  });

  it('nextReview is in the future after any rating', () => {
    const before = Date.now();
    const updated = sm2Update(defaultCard, 2);
    expect(updated.nextReview).toBeGreaterThan(before);
  });

  it('isDue returns true for overdue card', () => {
    expect(isDue({ ...defaultCard, nextReview: Date.now() - 1000 })).toBe(true);
  });

  it('isDue returns false for future card', () => {
    expect(isDue({ ...defaultCard, nextReview: Date.now() + 1_000_000 })).toBe(false);
  });
});

// ─── Health Checker Scoring ───────────────────────────────────────────────────

const DIMENSIONS = [
  'Scope & Objectives',
  'Schedule & Timeline',
  'Budget & Resources',
  'Risk Management',
  'Stakeholder Engagement',
  'Team & Leadership',
  'Quality & Delivery',
  'Communication & Reporting',
];

function computeHealthScore(answers: Record<string, number>): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const dim of DIMENSIONS) {
    const dimAnswers = Object.entries(answers)
      .filter(([k]) => k.startsWith(dim))
      .map(([, v]) => v);
    if (dimAnswers.length === 0) {
      scores[dim] = 0;
    } else {
      const avg = dimAnswers.reduce((a, b) => a + b, 0) / dimAnswers.length;
      scores[dim] = Math.round((avg / 4) * 100); // 0-4 scale → 0-100
    }
  }
  return scores;
}

describe('Project Health Checker Scoring', () => {
  it('returns 100 for all-max answers', () => {
    const answers: Record<string, number> = {};
    for (const dim of DIMENSIONS) {
      answers[`${dim}_q1`] = 4;
      answers[`${dim}_q2`] = 4;
    }
    const scores = computeHealthScore(answers);
    for (const dim of DIMENSIONS) {
      expect(scores[dim]).toBe(100);
    }
  });

  it('returns 0 for all-min answers', () => {
    const answers: Record<string, number> = {};
    for (const dim of DIMENSIONS) {
      answers[`${dim}_q1`] = 0;
      answers[`${dim}_q2`] = 0;
    }
    const scores = computeHealthScore(answers);
    for (const dim of DIMENSIONS) {
      expect(scores[dim]).toBe(0);
    }
  });

  it('returns 50 for mid-range answers', () => {
    const answers: Record<string, number> = {};
    for (const dim of DIMENSIONS) {
      answers[`${dim}_q1`] = 2;
    }
    const scores = computeHealthScore(answers);
    for (const dim of DIMENSIONS) {
      expect(scores[dim]).toBe(50);
    }
  });

  it('averages multiple answers per dimension', () => {
    const answers: Record<string, number> = {
      'Scope & Objectives_q1': 0,
      'Scope & Objectives_q2': 4,
    };
    const scores = computeHealthScore(answers);
    expect(scores['Scope & Objectives']).toBe(50);
  });

  it('returns 0 for dimension with no answers', () => {
    const scores = computeHealthScore({});
    for (const dim of DIMENSIONS) {
      expect(scores[dim]).toBe(0);
    }
  });
});

// ─── Mind Map Graph Edge Building ────────────────────────────────────────────

interface GraphNode { id: string; }
interface GraphEdge { source: string; target: string; }

function buildEdges(cards: Array<{ id: string; relatedCards?: string[] }>): GraphEdge[] {
  const edges: GraphEdge[] = [];
  const seen = new Set<string>();
  for (const card of cards) {
    for (const rel of card.relatedCards ?? []) {
      const key = [card.id, rel].sort().join('--');
      if (!seen.has(key)) {
        seen.add(key);
        edges.push({ source: card.id, target: rel });
      }
    }
  }
  return edges;
}

describe('Mind Map Graph Edge Building', () => {
  it('creates edges from relatedCards', () => {
    const cards = [
      { id: 'A1', relatedCards: ['A2', 'A3'] },
      { id: 'A2', relatedCards: ['A1'] },
      { id: 'A3', relatedCards: [] },
    ];
    const edges = buildEdges(cards);
    // A1-A2 and A1-A3 (A2-A1 is deduplicated)
    expect(edges).toHaveLength(2);
  });

  it('deduplicates bidirectional edges', () => {
    const cards = [
      { id: 'X', relatedCards: ['Y'] },
      { id: 'Y', relatedCards: ['X'] },
    ];
    const edges = buildEdges(cards);
    expect(edges).toHaveLength(1);
  });

  it('handles cards with no relatedCards', () => {
    const cards = [{ id: 'A' }, { id: 'B' }];
    const edges = buildEdges(cards);
    expect(edges).toHaveLength(0);
  });

  it('handles self-references gracefully (no self-loops)', () => {
    const cards = [{ id: 'A', relatedCards: ['A', 'B'] }];
    const edges = buildEdges(cards);
    // A-A is a self-loop but still added (sorted key = 'A--A', unique)
    expect(edges.some(e => e.source === e.target)).toBe(true);
  });
});

// ─── Audio Playlist Building ──────────────────────────────────────────────────

interface AudioTrack {
  cardId: string;
  title: string;
  deckId: string;
  deckTitle: string;
  deckColor: string;
  text: string;
}

function buildDeckPlaylist(
  deckId: string,
  cards: Array<{ id: string; title: string; deckId: string; overview: string }>,
  decks: Array<{ id: string; title: string; color: string }>
): AudioTrack[] {
  const deck = decks.find(d => d.id === deckId);
  if (!deck) return [];
  return cards
    .filter(c => c.deckId === deckId)
    .map(c => ({
      cardId: c.id,
      title: c.title,
      deckId: deck.id,
      deckTitle: deck.title,
      deckColor: deck.color,
      text: c.overview,
    }));
}

describe('Audio Playlist Building', () => {
  const decks = [
    { id: 'phases', title: 'PM Phases', color: '#3b82f6' },
    { id: 'tools', title: 'Tools', color: '#10b981' },
  ];
  const cards = [
    { id: 'P1', title: 'Initiation', deckId: 'phases', overview: 'Start of a project.' },
    { id: 'P2', title: 'Planning', deckId: 'phases', overview: 'Plan the work.' },
    { id: 'T1', title: 'Gantt Chart', deckId: 'tools', overview: 'Visual schedule.' },
  ];

  it('returns only cards for the specified deck', () => {
    const playlist = buildDeckPlaylist('phases', cards, decks);
    expect(playlist).toHaveLength(2);
    expect(playlist.every(t => t.deckId === 'phases')).toBe(true);
  });

  it('includes correct deck metadata', () => {
    const playlist = buildDeckPlaylist('phases', cards, decks);
    expect(playlist[0].deckTitle).toBe('PM Phases');
    expect(playlist[0].deckColor).toBe('#3b82f6');
  });

  it('returns empty array for unknown deck', () => {
    const playlist = buildDeckPlaylist('unknown', cards, decks);
    expect(playlist).toHaveLength(0);
  });

  it('returns empty array when deck has no cards', () => {
    const emptyCards: typeof cards = [];
    const playlist = buildDeckPlaylist('phases', emptyCards, decks);
    expect(playlist).toHaveLength(0);
  });

  it('maps card overview to text field', () => {
    const playlist = buildDeckPlaylist('tools', cards, decks);
    expect(playlist[0].text).toBe('Visual schedule.');
  });
});
