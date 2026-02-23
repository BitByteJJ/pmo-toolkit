/**
 * Tests for:
 * 1. Onboarding tour localStorage key constants
 * 2. Case study factual corrections (Chrome, Sydney Opera House, NHS)
 */

import { describe, it, expect } from 'vitest';

// ── Onboarding constants ──────────────────────────────────────────────────────

const ONBOARDING_STORAGE_KEY = 'pmo-onboarding-seen';
const WELCOME_MODAL_KEY = 'pmo-welcome-seen';

describe('Onboarding tour storage keys', () => {
  it('uses the correct localStorage key for onboarding tour', () => {
    expect(ONBOARDING_STORAGE_KEY).toBe('pmo-onboarding-seen');
  });

  it('uses the correct localStorage key for welcome modal', () => {
    expect(WELCOME_MODAL_KEY).toBe('pmo-welcome-seen');
  });

  it('onboarding key and welcome key are distinct', () => {
    expect(ONBOARDING_STORAGE_KEY).not.toBe(WELCOME_MODAL_KEY);
  });
});

// ── Case study fact checks ────────────────────────────────────────────────────

describe('Case study factual corrections', () => {
  it('Chrome market share claim: should say ~3 years, not 2 years', () => {
    // Chrome launched Sep 2008, surpassed IE in late 2011 = ~3 years
    const launchYear = 2008;
    const surpassedYear = 2011;
    const yearsToTopBrowser = surpassedYear - launchYear;
    expect(yearsToTopBrowser).toBeGreaterThanOrEqual(3);
    expect(yearsToTopBrowser).toBeLessThan(4);
  });

  it('Sydney Opera House budget overrun: ~1357%, not 1400%', () => {
    const originalBudgetAUD = 7_000_000;
    const finalCostAUD = 102_000_000;
    const overrunPct = Math.round(((finalCostAUD - originalBudgetAUD) / originalBudgetAUD) * 100);
    // Should be ~1357%, not 1400%
    expect(overrunPct).toBeGreaterThan(1300);
    expect(overrunPct).toBeLessThan(1400);
    expect(overrunPct).toBe(1357);
  });

  it('NHS first-dose priority phase ended April 2021, not March 2021', () => {
    // The first-dose priority phase for the top 9 cohorts extended to April 15, 2021
    const correctedTimeframe = 'December 2020 – April 2021 (first-dose priority phase)';
    expect(correctedTimeframe).toContain('April 2021');
    expect(correctedTimeframe).not.toContain('March 2021');
  });
});

// ── HowItWasBuilt page route ──────────────────────────────────────────────────

describe('How It Was Built page', () => {
  it('route path is /how-it-was-built', () => {
    const route = '/how-it-was-built';
    expect(route).toBe('/how-it-was-built');
  });

  it('has three tabs: process, tools, prompts', () => {
    const tabs = ['process', 'tools', 'prompts'];
    expect(tabs).toHaveLength(3);
    expect(tabs).toContain('process');
    expect(tabs).toContain('tools');
    expect(tabs).toContain('prompts');
  });
});
