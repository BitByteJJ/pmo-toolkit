// PMO Toolkit Navigator — Bookmarks Context
// Persists bookmarked card IDs to localStorage

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface BookmarksContextType {
  bookmarks: string[];
  isBookmarked: (cardId: string) => boolean;
  toggleBookmark: (cardId: string) => void;
  clearBookmarks: () => void;
}

const BookmarksContext = createContext<BookmarksContextType | null>(null);

const STORAGE_KEY = 'pmo-toolkit-bookmarks';

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const isBookmarked = useCallback((cardId: string) => bookmarks.includes(cardId), [bookmarks]);

  const toggleBookmark = useCallback((cardId: string) => {
    setBookmarks(prev =>
      prev.includes(cardId) ? prev.filter(id => id !== cardId) : [...prev, cardId]
    );
  }, []);

  const clearBookmarks = useCallback(() => setBookmarks([]), []);

  return (
    <BookmarksContext.Provider value={{ bookmarks, isBookmarked, toggleBookmark, clearBookmarks }}>
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const ctx = useContext(BookmarksContext);
  if (!ctx) throw new Error('useBookmarks must be used within BookmarksProvider');
  return ctx;
}
