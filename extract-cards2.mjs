// Extract card data by parsing the pmoData.ts file properly
import { readFileSync } from 'fs';

const content = readFileSync('./client/src/lib/pmoData.ts', 'utf8');

// Find all card objects — they start with "  {" and have id, code, title, deckId, tagline
const cards = [];
// Split by card object boundaries
const cardBlocks = content.split(/\n  \{/);

for (const block of cardBlocks) {
  const idMatch = block.match(/^\s*id:\s*'([^']+)'/m);
  const titleMatch = block.match(/title:\s*'([^']+)'/m);
  const taglineMatch = block.match(/tagline:\s*'([^']+)'/m);
  const deckMatch = block.match(/deckId:\s*'([^']+)'/m);
  const codeMatch = block.match(/code:\s*'([^']+)'/m);
  const typeMatch = block.match(/type:\s*'([^']+)'/m);
  const whatItIsMatch = block.match(/whatItIs:\s*'([^']+)'/m);
  
  if (idMatch && titleMatch && deckMatch) {
    const id = idMatch[1];
    // Skip deck entries (they have no code field typically)
    if (!codeMatch) continue;
    cards.push({
      id,
      code: codeMatch[1],
      title: titleMatch[1],
      deckId: deckMatch[1],
      type: typeMatch ? typeMatch[1] : 'tool',
      tagline: taglineMatch ? taglineMatch[1] : '',
      whatItIs: whatItIsMatch ? whatItIsMatch[1] : '',
    });
  }
}

console.log(JSON.stringify(cards, null, 2));
console.error(`Total cards: ${cards.length}`);
