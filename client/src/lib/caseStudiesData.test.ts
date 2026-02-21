import { describe, it, expect } from 'vitest';
import {
  getCaseStudyByCardId,
  getAllCaseStudies,
  CARDS_WITH_CASE_STUDIES,
} from './caseStudiesData';

describe('caseStudiesData', () => {
  it('getAllCaseStudies returns a non-empty array', () => {
    const all = getAllCaseStudies();
    expect(all.length).toBeGreaterThan(0);
  });

  it('every case study has required fields', () => {
    const all = getAllCaseStudies();
    for (const cs of all) {
      expect(cs.cardId, `cardId missing for ${cs.organisation}`).toBeTruthy();
      expect(cs.organisation, `organisation missing for ${cs.cardId}`).toBeTruthy();
      expect(cs.industry, `industry missing for ${cs.cardId}`).toBeTruthy();
      expect(cs.projectName, `projectName missing for ${cs.cardId}`).toBeTruthy();
      expect(cs.challenge, `challenge missing for ${cs.cardId}`).toBeTruthy();
      expect(cs.approach, `approach missing for ${cs.cardId}`).toBeTruthy();
      expect(cs.outcome, `outcome missing for ${cs.cardId}`).toBeTruthy();
      expect(cs.lessonsLearned.length, `lessonsLearned empty for ${cs.cardId}`).toBeGreaterThan(0);
    }
  });

  it('getCaseStudyByCardId returns the correct study', () => {
    const cs = getCaseStudyByCardId('M2');
    expect(cs).toBeDefined();
    expect(cs?.organisation).toBe('Spotify');
    expect(cs?.cardId).toBe('M2');
  });

  it('getCaseStudyByCardId returns undefined for unknown cardId', () => {
    expect(getCaseStudyByCardId('NONEXISTENT')).toBeUndefined();
  });

  it('CARDS_WITH_CASE_STUDIES set contains known card IDs', () => {
    expect(CARDS_WITH_CASE_STUDIES.has('M1')).toBe(true);
    expect(CARDS_WITH_CASE_STUDIES.has('T7')).toBe(true);
    expect(CARDS_WITH_CASE_STUDIES.has('A30')).toBe(true);
    expect(CARDS_WITH_CASE_STUDIES.has('NONEXISTENT')).toBe(false);
  });

  it('no duplicate cardIds in the dataset', () => {
    const all = getAllCaseStudies();
    const ids = all.map(cs => cs.cardId);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('case studies with quotes have both text and attribution', () => {
    const all = getAllCaseStudies();
    for (const cs of all) {
      if (cs.quote) {
        expect(cs.quote.text, `quote.text missing for ${cs.cardId}`).toBeTruthy();
        expect(cs.quote.attribution, `quote.attribution missing for ${cs.cardId}`).toBeTruthy();
      }
    }
  });
});
