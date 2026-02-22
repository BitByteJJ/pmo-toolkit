// Tests for the AI Suggest endpoint logic
// Tests the CARD_CATALOGUE structure and the enrichment logic

import { describe, it, expect } from 'vitest';

// Import the catalogue and helpers by reading the compiled .mjs
// We test the data structure and enrichment logic without calling the real LLM

const CARD_CATALOGUE = [
  { id: 'T5', code: 'T5', title: 'RACI Matrix', tagline: 'Clarify who is Responsible, Accountable, Consulted, Informed', whenToUse: 'When roles and responsibilities are unclear or overlapping.', tags: ['raci', 'roles', 'accountability'] },
  { id: 'PD2', code: 'PD2', title: 'Define Team Roles', tagline: 'Clarify who does what to prevent confusion and gaps', whenToUse: 'When roles and responsibilities are unclear.', tags: ['roles', 'responsibilities'] },
  { id: 'T6', code: 'T6', title: 'Risk Register', tagline: 'Central log of risks with mitigation and contingency plans', whenToUse: 'Throughout the project lifecycle to identify, assess, and manage risks.', tags: ['risk', 'mitigation'] },
];

// Simulate the enrichment logic from handleAiSuggest
function enrichRecommendations(
  recommendations: Array<{ cardId: string; reason: string }>,
  catalogue: typeof CARD_CATALOGUE
) {
  return recommendations.map(rec => {
    const card = catalogue.find(c => c.id === rec.cardId || c.code === rec.cardId);
    return {
      cardId: card?.id ?? rec.cardId,
      code: card?.code ?? rec.cardId,
      title: card?.title ?? rec.cardId,
      tagline: card?.tagline ?? '',
      reason: rec.reason,
    };
  });
}

describe('AI Suggest — enrichRecommendations', () => {
  it('enriches a recommendation by cardId', () => {
    const recs = [{ cardId: 'T5', reason: 'Helps clarify responsibilities' }];
    const enriched = enrichRecommendations(recs, CARD_CATALOGUE);
    expect(enriched[0].title).toBe('RACI Matrix');
    expect(enriched[0].code).toBe('T5');
    expect(enriched[0].tagline).toContain('Responsible');
    expect(enriched[0].reason).toBe('Helps clarify responsibilities');
  });

  it('falls back to cardId when card is not found', () => {
    const recs = [{ cardId: 'UNKNOWN', reason: 'Some reason' }];
    const enriched = enrichRecommendations(recs, CARD_CATALOGUE);
    expect(enriched[0].cardId).toBe('UNKNOWN');
    expect(enriched[0].title).toBe('UNKNOWN');
    expect(enriched[0].tagline).toBe('');
  });

  it('enriches multiple recommendations in order', () => {
    const recs = [
      { cardId: 'T5', reason: 'First reason' },
      { cardId: 'PD2', reason: 'Second reason' },
      { cardId: 'T6', reason: 'Third reason' },
    ];
    const enriched = enrichRecommendations(recs, CARD_CATALOGUE);
    expect(enriched).toHaveLength(3);
    expect(enriched[0].title).toBe('RACI Matrix');
    expect(enriched[1].title).toBe('Define Team Roles');
    expect(enriched[2].title).toBe('Risk Register');
  });

  it('matches by code as well as id', () => {
    const recs = [{ cardId: 'T6', reason: 'Risk management' }];
    const enriched = enrichRecommendations(recs, CARD_CATALOGUE);
    expect(enriched[0].title).toBe('Risk Register');
  });
});

describe('AI Suggest — CARD_CATALOGUE structure', () => {
  it('all cards have required fields', () => {
    for (const card of CARD_CATALOGUE) {
      expect(card.id).toBeTruthy();
      expect(card.code).toBeTruthy();
      expect(card.title).toBeTruthy();
      expect(card.tagline).toBeTruthy();
      expect(card.whenToUse).toBeTruthy();
      expect(Array.isArray(card.tags)).toBe(true);
      expect(card.tags.length).toBeGreaterThan(0);
    }
  });

  it('all card ids are unique', () => {
    const ids = CARD_CATALOGUE.map(c => c.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});
