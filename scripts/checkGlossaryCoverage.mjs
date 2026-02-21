import { readFileSync } from 'fs';

const glossaryContent = readFileSync('client/src/lib/glossaryData.ts', 'utf8');
const pmoContent = readFileSync('client/src/lib/pmoData.ts', 'utf8');

// Get all card IDs from pmoData
const cardMatches = [...pmoContent.matchAll(/^\s+id:\s*'([^']+)'/gm)];
const deckIds = ['phases', 'archetypes', 'methodologies', 'people', 'process', 'business', 'tools', 'techniques'];
const allCardIds = cardMatches.map(m => m[1]).filter(id => !deckIds.includes(id));

// Get all card IDs referenced in glossary
const glossaryMatches = [...glossaryContent.matchAll(/relatedCards:\s*\[([^\]]*)\]/g)];
const glossaryCardIds = new Set();
glossaryMatches.forEach(m => {
  const ids = m[1].match(/'([^']+)'/g);
  if (ids) ids.forEach(id => glossaryCardIds.add(id.replace(/'/g, '')));
});

const covered = allCardIds.filter(id => glossaryCardIds.has(id));
const missing = allCardIds.filter(id => !glossaryCardIds.has(id));

console.log(`Total cards: ${allCardIds.length}`);
console.log(`Cards with glossary terms: ${covered.length}`);
console.log(`Cards WITHOUT glossary terms: ${missing.length}`);
console.log('\nMissing card IDs:');
missing.forEach(id => console.log(' -', id));
