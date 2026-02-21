// StratAlign — Spaced Repetition Hook (SM-2 algorithm)
// Schedules card reviews at increasing intervals based on recall quality

import { useState, useCallback } from 'react';

export type RecallQuality = 0 | 1 | 2 | 3 | 4 | 5;
// 0 = complete blackout, 5 = perfect recall

export interface CardSRData {
  cardId: string;
  interval: number;      // days until next review
  repetitions: number;   // number of successful reviews
  easeFactor: number;    // difficulty multiplier (default 2.5)
  nextReview: number;    // UTC timestamp (ms) of next review date
  lastReview: number;    // UTC timestamp (ms) of last review
}

const STORAGE_KEY = 'stratAlign_sr_data';

function loadSRData(): Record<string, CardSRData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveSRData(data: Record<string, CardSRData>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

// SM-2 algorithm implementation
function sm2(card: CardSRData, quality: RecallQuality): CardSRData {
  let { interval, repetitions, easeFactor } = card;

  if (quality >= 3) {
    // Successful recall
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    // Failed recall — reset
    interval = 1;
    repetitions = 0;
  }

  // Update ease factor
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  const now = Date.now();
  const nextReview = now + interval * 24 * 60 * 60 * 1000;

  return { ...card, interval, repetitions, easeFactor, nextReview, lastReview: now };
}

export function useSpacedRepetition() {
  const [srData, setSRData] = useState<Record<string, CardSRData>>(loadSRData);

  const getDueCards = useCallback((cardIds: string[]): string[] => {
    const now = Date.now();
    return cardIds.filter(id => {
      const data = srData[id];
      if (!data) return true; // never reviewed = due
      return data.nextReview <= now;
    });
  }, [srData]);

  const recordReview = useCallback((cardId: string, quality: RecallQuality) => {
    setSRData(prev => {
      const existing = prev[cardId] ?? {
        cardId,
        interval: 0,
        repetitions: 0,
        easeFactor: 2.5,
        nextReview: 0,
        lastReview: 0,
      };
      const updated = sm2(existing, quality);
      const next = { ...prev, [cardId]: updated };
      saveSRData(next);
      return next;
    });
  }, []);

  const getCardSRData = useCallback((cardId: string): CardSRData | null => {
    return srData[cardId] ?? null;
  }, [srData]);

  const getDaysUntilReview = useCallback((cardId: string): number => {
    const data = srData[cardId];
    if (!data) return 0;
    const diff = data.nextReview - Date.now();
    return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
  }, [srData]);

  const getTotalDueCount = useCallback((cardIds: string[]): number => {
    return getDueCards(cardIds).length;
  }, [getDueCards]);

  const resetCard = useCallback((cardId: string) => {
    setSRData(prev => {
      const next = { ...prev };
      delete next[cardId];
      saveSRData(next);
      return next;
    });
  }, []);

  return {
    srData,
    getDueCards,
    recordReview,
    getCardSRData,
    getDaysUntilReview,
    getTotalDueCount,
    resetCard,
  };
}
