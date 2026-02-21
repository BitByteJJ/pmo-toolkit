// useCardNotes — stores per-card user notes in localStorage

import { useState, useCallback } from 'react';

const STORAGE_KEY = 'pmo_card_notes';

type NotesMap = Record<string, string>;

function loadNotes(): NotesMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as NotesMap;
  } catch {
    // ignore
  }
  return {};
}

function saveNotes(notes: NotesMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // ignore
  }
}

export function useCardNotes() {
  const [notes, setNotes] = useState<NotesMap>(loadNotes);

  const getNote = useCallback((cardId: string) => notes[cardId] ?? '', [notes]);

  const setNote = useCallback((cardId: string, text: string) => {
    setNotes(prev => {
      const next = { ...prev };
      if (text.trim() === '') {
        delete next[cardId];
      } else {
        next[cardId] = text;
      }
      saveNotes(next);
      return next;
    });
  }, []);

  const hasNote = useCallback((cardId: string) => Boolean(notes[cardId]?.trim()), [notes]);

  return { getNote, setNote, hasNote };
}
