import { readFileSync } from 'fs';

const data = readFileSync('client/src/lib/pmoData.ts', 'utf8');

// Match card objects: id, code, title, deckId, tagline (in any order within a block)
// Split by card objects using id: 'XX' pattern
const cardBlocks = data.split(/\n  \{/);

const SKIP = new Set(['phases','archetypes','methodologies','people','process','business','tools','techniques','phase-setup','phase-execution','phase-closure']);

const cards = [];
for (const block of cardBlocks) {
  const idMatch = block.match(/id:\s+'([^']+)'/);
  const codeMatch = block.match(/code:\s+'([^']+)'/);
  const titleMatch = block.match(/title:\s+'([^']+)'/);
  const deckMatch = block.match(/deckId:\s+'([^']+)'/);
  const taglineMatch = block.match(/tagline:\s+'([^']+)'/);
  
  if (idMatch && codeMatch && titleMatch && deckMatch && taglineMatch) {
    const id = idMatch[1];
    if (!SKIP.has(id)) {
      cards.push({
        id,
        code: codeMatch[1],
        title: titleMatch[1],
        deckId: deckMatch[1],
        tagline: taglineMatch[1],
      });
    }
  }
}

// Group by deck
const byDeck = {};
for (const c of cards) {
  if (!byDeck[c.deckId]) byDeck[c.deckId] = [];
  byDeck[c.deckId].push(c);
}

for (const [deck, list] of Object.entries(byDeck)) {
  console.log(`\n=== ${deck.toUpperCase()} (${list.length} cards) ===`);
  for (const c of list) {
    console.log(`${c.id}|${c.code}|${c.title}|${c.tagline}`);
  }
}

console.log('\nTotal cards:', cards.length);
