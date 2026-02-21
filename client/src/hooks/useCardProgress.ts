// useCardProgress — tracks which cards have been viewed, stored in localStorage
// Used for deck progress bars and completion celebration

import { useState, useCallback } from 'react';

const STORAGE_KEY = 'pmo_read_cards';

function loadRead(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch {
    // ignore
  }
  return new Set();
}

function saveRead(set: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // ignore
  }
}

export function useCardProgress() {
  const [readCards, setReadCards] = useState<Set<string>>(loadRead);

  const markRead = useCallback((cardId: string) => {
    setReadCards(prev => {
      if (prev.has(cardId)) return prev;
      const next = new Set(prev);
      next.add(cardId);
      saveRead(next);
      return next;
    });
  }, []);

  const isRead = useCallback((cardId: string) => readCards.has(cardId), [readCards]);

  const deckProgress = useCallback(
    (cardIds: string[]) => {
      if (cardIds.length === 0) return 0;
      const done = cardIds.filter(id => readCards.has(id)).length;
      return done / cardIds.length;
    },
    [readCards]
  );

  const deckReadCount = useCallback(
    (cardIds: string[]) => cardIds.filter(id => readCards.has(id)).length,
    [readCards]
  );

  return { readCards, markRead, isRead, deckProgress, deckReadCount };
}
