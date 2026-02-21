// useMasteryBadges — tracks mastery badges earned per deck
// Badges are awarded when:
//   - 'read': user has read all cards in a deck
//   - 'quiz': user scores 100% on a deck quiz
// Stored in localStorage as a map of deckId -> string[] (badge types earned)

import { useState, useCallback } from 'react';

export type BadgeType = 'read' | 'quiz';

export interface MasteryBadge {
  deckId: string;
  type: BadgeType;
  earnedAt: number; // Unix timestamp ms
}

const STORAGE_KEY = 'pmo_mastery_badges';

function loadBadges(): MasteryBadge[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as MasteryBadge[];
  } catch {
    // ignore
  }
  return [];
}

function saveBadges(badges: MasteryBadge[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(badges));
  } catch {
    // ignore
  }
}

export function useMasteryBadges() {
  const [badges, setBadges] = useState<MasteryBadge[]>(loadBadges);

  const awardBadge = useCallback((deckId: string, type: BadgeType) => {
    setBadges(prev => {
      // Don't duplicate
      if (prev.some(b => b.deckId === deckId && b.type === type)) return prev;
      const next = [...prev, { deckId, type, earnedAt: Date.now() }];
      saveBadges(next);
      return next;
    });
  }, []);

  const hasBadge = useCallback(
    (deckId: string, type: BadgeType) => badges.some(b => b.deckId === deckId && b.type === type),
    [badges]
  );

  const getBadgesForDeck = useCallback(
    (deckId: string) => badges.filter(b => b.deckId === deckId),
    [badges]
  );

  const totalBadges = badges.length;

  return { badges, awardBadge, hasBadge, getBadgesForDeck, totalBadges };
}
