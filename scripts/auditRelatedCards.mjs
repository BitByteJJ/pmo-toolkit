/**
 * Audit script: find every card ID mentioned in proTip, steps, or example
 * that is NOT present in that card's relatedCards array.
 *
 * Run: node scripts/auditRelatedCards.mjs
 */

import { readFileSync } from 'fs';
import { createRequire } from 'module';

// Read the raw TS file and extract CARDS array via regex
const src = readFileSync('./client/src/lib/pmoData.ts', 'utf8');

// All valid card IDs — collect them first
const allIds = new Set();
const idMatches = src.matchAll(/\bid:\s*'([^']+)'/g);
for (const m of idMatches) allIds.add(m[1]);

// Pattern to detect card ID references like (T6), (A47), (A33), (M4), etc.
// Also catches bare IDs in relatedCards arrays
const REF_PATTERN = /\(([A-Z]{1,2}\d+|[a-z]+-\d+|AG\d+|M\d+|T\d+|A\d+|phase-[a-z]+)\)/g;

// Parse each card block
// We'll extract card objects by splitting on the card boundaries
const cardBlocks = [];
const blockRe = /\{\s*\n\s*id:\s*'([^']+)'[\s\S]*?(?=\n  \{|\n\];)/g;
let bm;
while ((bm = blockRe.exec(src)) !== null) {
  cardBlocks.push({ id: bm[1], block: bm[0] });
}

const issues = [];

for (const { id, block } of cardBlocks) {
  // Extract relatedCards array content
  const rcMatch = block.match(/relatedCards:\s*\[([^\]]*)\]/);
  const relatedCards = new Set();
  if (rcMatch) {
    const rcContent = rcMatch[1];
    const rcIds = rcContent.matchAll(/'([^']+)'/g);
    for (const m of rcIds) relatedCards.add(m[1]);
  }

  // Extract proTip, steps, example, whatItIs, whenToUse text
  const fieldsToCheck = ['proTip', 'steps', 'example', 'whenToUse'];
  const missing = new Set();

  for (const field of fieldsToCheck) {
    // Extract field value(s)
    let fieldRe;
    if (field === 'steps') {
      fieldRe = /steps:\s*\[([^\]]*)\]/s;
    } else {
      fieldRe = new RegExp(`${field}:\\s*'([^']*(?:\\\\'[^']*)*)'`);
    }
    const fm = block.match(fieldRe);
    if (!fm) continue;
    const text = fm[1];

    // Find all (ID) references
    const refs = text.matchAll(REF_PATTERN);
    for (const ref of refs) {
      const refId = ref[1];
      // Only flag if the referenced ID actually exists as a card
      if (allIds.has(refId) && refId !== id && !relatedCards.has(refId)) {
        missing.add(refId);
      }
    }
  }

  if (missing.size > 0) {
    issues.push({ id, missing: [...missing].sort() });
  }
}

if (issues.length === 0) {
  console.log('✓ All cards pass — no missing relatedCards cross-references found.');
} else {
  console.log(`Found ${issues.length} cards with missing relatedCards entries:\n`);
  for (const { id, missing } of issues) {
    console.log(`  ${id.padEnd(20)} missing: ${missing.join(', ')}`);
  }
  console.log(`\nTotal fixes needed: ${issues.reduce((s, i) => s + i.missing.length, 0)}`);
}

// Export for use by fix script
export { issues };
