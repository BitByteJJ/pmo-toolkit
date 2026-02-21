import { describe, it, expect } from 'vitest';
import { DECK_INTROS, getDeckIntro } from '../client/src/lib/deckIntroData';

describe('deckIntroData – category filterTags', () => {
  it('every deck has categories', () => {
    for (const deck of DECK_INTROS) {
      expect(deck.categories.length).toBeGreaterThan(0);
    }
  });

  it('every category has filterTags defined', () => {
    for (const deck of DECK_INTROS) {
      for (const cat of deck.categories) {
        expect(
          cat.filterTags,
          `${deck.deckId} → ${cat.name} is missing filterTags`,
        ).toBeDefined();
        expect(
          (cat.filterTags ?? []).length,
          `${deck.deckId} → ${cat.name} has empty filterTags`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it('getDeckIntro returns the right deck', () => {
    const intro = getDeckIntro('techniques');
    expect(intro).toBeDefined();
    expect(intro!.deckId).toBe('techniques');
    expect(intro!.categories.length).toBe(4);
  });

  it('techniques Agile & Lean category has expected tags', () => {
    const intro = getDeckIntro('techniques')!;
    const cat = intro.categories.find(c => c.name === 'Agile & Lean')!;
    expect(cat).toBeDefined();
    expect(cat.filterTags).toContain('agile');
    expect(cat.filterTags).toContain('Kaizen');
    expect(cat.filterTags).toContain('WSJF');
  });

  it('people Team Leadership category has expected tags', () => {
    const intro = getDeckIntro('people')!;
    const cat = intro.categories.find(c => c.name === 'Team Leadership')!;
    expect(cat).toBeDefined();
    expect(cat.filterTags).toContain('leadership');
    expect(cat.filterTags).toContain('team');
  });

  it('process Planning category has expected tags', () => {
    const intro = getDeckIntro('process')!;
    const cat = intro.categories.find(c => c.name === 'Planning')!;
    expect(cat).toBeDefined();
    expect(cat.filterTags).toContain('scope');
    expect(cat.filterTags).toContain('planning');
  });
});
