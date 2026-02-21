// StratAlign — Custom Collections Hook
// Manages named folders of cards stored in localStorage

import { useState, useCallback } from 'react';

export interface Collection {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  cardIds: string[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'stratAlign_collections';

const COLLECTION_COLORS = [
  '#0284C7', '#059669', '#D97706', '#E11D48',
  '#7C3AED', '#0891B2', '#CA8A04', '#DC2626',
];

const COLLECTION_ICONS = ['📁', '⭐', '🎯', '🔥', '💡', '🚀', '📌', '🏆'];

function loadCollections(): Collection[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCollections(collections: Collection[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
  } catch {}
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>(loadCollections);

  const createCollection = useCallback((name: string, description?: string): Collection => {
    const idx = collections.length % COLLECTION_COLORS.length;
    const newCollection: Collection = {
      id: generateId(),
      name,
      description,
      color: COLLECTION_COLORS[idx],
      icon: COLLECTION_ICONS[idx],
      cardIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setCollections(prev => {
      const next = [...prev, newCollection];
      saveCollections(next);
      return next;
    });
    return newCollection;
  }, [collections.length]);

  const deleteCollection = useCallback((id: string) => {
    setCollections(prev => {
      const next = prev.filter(c => c.id !== id);
      saveCollections(next);
      return next;
    });
  }, []);

  const updateCollection = useCallback((id: string, updates: Partial<Pick<Collection, 'name' | 'description' | 'color' | 'icon'>>) => {
    setCollections(prev => {
      const next = prev.map(c => c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c);
      saveCollections(next);
      return next;
    });
  }, []);

  const addCardToCollection = useCallback((collectionId: string, cardId: string) => {
    setCollections(prev => {
      const next = prev.map(c => {
        if (c.id !== collectionId) return c;
        if (c.cardIds.includes(cardId)) return c;
        return { ...c, cardIds: [...c.cardIds, cardId], updatedAt: Date.now() };
      });
      saveCollections(next);
      return next;
    });
  }, []);

  const removeCardFromCollection = useCallback((collectionId: string, cardId: string) => {
    setCollections(prev => {
      const next = prev.map(c => {
        if (c.id !== collectionId) return c;
        return { ...c, cardIds: c.cardIds.filter(id => id !== cardId), updatedAt: Date.now() };
      });
      saveCollections(next);
      return next;
    });
  }, []);

  const isCardInCollection = useCallback((collectionId: string, cardId: string): boolean => {
    const col = collections.find(c => c.id === collectionId);
    return col ? col.cardIds.includes(cardId) : false;
  }, [collections]);

  const getCollectionsForCard = useCallback((cardId: string): Collection[] => {
    return collections.filter(c => c.cardIds.includes(cardId));
  }, [collections]);

  return {
    collections,
    createCollection,
    deleteCollection,
    updateCollection,
    addCardToCollection,
    removeCardFromCollection,
    isCardInCollection,
    getCollectionsForCard,
  };
}
