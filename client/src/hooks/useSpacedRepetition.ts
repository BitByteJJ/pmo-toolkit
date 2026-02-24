// useSpacedRepetition — SM-2 spaced repetition algorithm
// Stores per-card review state in localStorage
// Quality ratings: 0=Again, 1=Hard, 2=Good, 3=Easy (mapped from SM-2 0-5 scale)

import { useState, useCallback } from 'react';

export type SRQuality = 0 | 1 | 2 | 3; // Again | Hard | Good | Easy

export interface SRCardState {
  cardId: string;
  interval: number;       // days until next review
  easeFactor: number;     // SM-2 ease factor (default 2.5)
  repetitions: number;    // number of successful reviews
  nextReview: number;     // UTC timestamp (ms) of next due date
  lastReviewed: number;   // UTC timestamp (ms) of last review
}

const STORAGE_KEY = 'pmo_sr_state';

// SM-2 quality mapping: Again=0, Hard=1, Good=2, Easy=3
// Maps to SM-2 quality scale: Again→1, Hard→2, Good→4, Easy→5
const QUALITY_MAP: Record<SRQuality, number> = { 0: 1, 1: 2, 2: 4, 3: 5 };

function loadSRState(): Record<string, SRCardState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Record<string, SRCardState>;
  } catch {
    // ignore
  }
  return {};
}

function saveSRState(state: Record<string, SRCardState>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

/**
 * SM-2 algorithm: compute next interval and ease factor from quality rating.
 * Returns updated { interval, easeFactor, repetitions, nextReview }.
 */
function sm2(
  quality: SRQuality,
  prev: Pick<SRCardState, 'interval' | 'easeFactor' | 'repetitions'>
): Pick<SRCardState, 'interval' | 'easeFactor' | 'repetitions'> {
  const q = QUALITY_MAP[quality];
  let { interval, easeFactor, repetitions } = prev;

  if (q < 3) {
    // Failed — reset repetitions, short interval
    repetitions = 0;
    interval = 1;
  } else {
    // Passed
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor (SM-2 formula)
  easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));

  return { interval, easeFactor, repetitions };
}

export function useSpacedRepetition() {
  const [srState, setSRState] = useState<Record<string, SRCardState>>(loadSRState);

  const getCardSR = useCallback(
    (cardId: string): SRCardState | null => srState[cardId] ?? null,
    [srState]
  );

  const isDueForReview = useCallback(
    (cardId: string): boolean => {
      const card = srState[cardId];
      if (!card) return false;
      return Date.now() >= card.nextReview;
    },
    [srState]
  );

  const getDueCards = useCallback(
    (cardIds: string[]): string[] => {
      const now = Date.now();
      return cardIds.filter(id => {
        const card = srState[id];
        return card && now >= card.nextReview;
      });
    },
    [srState]
  );

  const getDueCount = useCallback(
    (cardIds?: string[]): number => {
      const now = Date.now();
      const entries = cardIds
        ? cardIds.map(id => srState[id]).filter(Boolean)
        : Object.values(srState);
      return entries.filter(c => c && now >= c.nextReview).length;
    },
    [srState]
  );

  const recordReview = useCallback(
    (cardId: string, quality: SRQuality) => {
      setSRState(prev => {
        const existing = prev[cardId] ?? {
          cardId,
          interval: 1,
          easeFactor: 2.5,
          repetitions: 0,
          nextReview: Date.now(),
          lastReviewed: 0,
        };

        const updated = sm2(quality, existing);
        const now = Date.now();
        const nextReview = now + updated.interval * 24 * 60 * 60 * 1000;

        const next: Record<string, SRCardState> = {
          ...prev,
          [cardId]: {
            cardId,
            ...updated,
            nextReview,
            lastReviewed: now,
          },
        };
        saveSRState(next);
        return next;
      });
    },
    []
  );

  /**
   * Schedule a card for SR without a quality rating (e.g. after first read).
   * Sets interval to 1 day so it appears in tomorrow's review queue.
   */
  const scheduleCard = useCallback(
    (cardId: string) => {
      setSRState(prev => {
        if (prev[cardId]) return prev; // already scheduled
        const now = Date.now();
        const next: Record<string, SRCardState> = {
          ...prev,
          [cardId]: {
            cardId,
            interval: 1,
            easeFactor: 2.5,
            repetitions: 0,
            nextReview: now + 24 * 60 * 60 * 1000,
            lastReviewed: now,
          },
        };
        saveSRState(next);
        return next;
      });
    },
    []
  );

  const getNextReviewDate = useCallback(
    (cardId: string): Date | null => {
      const card = srState[cardId];
      if (!card) return null;
      return new Date(card.nextReview);
    },
    [srState]
  );

  return {
    srState,
    getCardSR,
    isDueForReview,
    getDueCards,
    getDueCount,
    recordReview,
    scheduleCard,
    getNextReviewDate,
  };
}
