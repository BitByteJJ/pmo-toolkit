import { readFileSync } from 'fs';

const content = readFileSync('client/src/lib/pmoData.ts', 'utf8');
const cardMatches = content.match(/\{\s*id:\s*'([^']+)'[^}]*title:\s*'([^']+)'/g) || [];
const cards = cardMatches.map(m => {
  const id = m.match(/id:\s*'([^']+)'/)?.[1];
  const title = m.match(/title:\s*'([^']+)'/)?.[1];
  return { id, title };
}).filter(c => c.id && c.title);

const covered = new Set([
  'M1','M2','M3','M4',
  'T1','T2','T3','T4','T5','T6','T7','T8','T11','T16','T17',
  'people-1','people-2','people-6','people-9',
  'process-3','process-5','process-8','process-10',
  'business-2',
  'A1','A18','A23','A25','A28','A30','A35','A40','A53','A55'
]);

const missing = cards.filter(c => !covered.has(c.id));
console.log('Total cards:', cards.length);
console.log('Already covered:', covered.size);
console.log('Missing:', missing.length);
missing.forEach(c => console.log(c.id, '-', c.title));
