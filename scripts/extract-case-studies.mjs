import { readFileSync } from 'fs';

const content = readFileSync('client/src/lib/caseStudiesData.ts', 'utf8');

// Extract all case study entries using regex
const entryRegex = /\{\s*cardId:\s*'([^']+)',[\s\S]*?lessonsLearned:\s*\[[\s\S]*?\],[\s\S]*?\}/g;

const realOrgs = ['NASA', 'Boeing', 'Google', 'Heathrow', 'Crossrail', 'Toyota', 'ING Bank', 'Spotify', 'Sydney Opera House', 'Denver International', 'Apple', 'Rolls-Royce', 'General Electric', 'Ford Motor', 'IDEO', 'Intel', 'Airbus', 'Netflix', 'Lockheed', 'Amazon', 'NHS', 'BP ', 'Kodak', 'Procter', 'Pixar', 'Microsoft', 'Valve', 'Atlassian', 'Shell', 'Saatchi', 'EDF', 'Samsung', 'Deloitte', 'PwC', 'McKinsey', 'Cisco', 'World Bank', 'UK Ministry', 'Monzo', 'HMRC', 'Unilever', 'Camp David', 'US Army', 'US Department'];

// Parse line by line to find entries
const lines = content.split('\n');
const results = [];
let i = 0;

while (i < lines.length) {
  const line = lines[i];
  const cardIdMatch = line.match(/cardId:\s*'([^']+)'/);
  if (cardIdMatch) {
    // Collect this entry
    const startLine = i;
    let j = i;
    let depth = 0;
    let started = false;
    // Find the opening brace of this object
    while (j < lines.length) {
      const l = lines[j];
      for (const ch of l) {
        if (ch === '{') { depth++; started = true; }
        if (ch === '}') depth--;
      }
      if (started && depth <= 0) break;
      j++;
    }
    const entryLines = lines.slice(startLine, j + 1);
    const entryText = entryLines.join('\n');
    
    const isReal = realOrgs.some(org => entryText.includes(org));
    if (isReal) {
      // Extract key fields
      const orgMatch = entryText.match(/organisation:\s*'([^']+)'/);
      const projMatch = entryText.match(/projectName:\s*'([^']+)'/);
      const outcomeMatch = entryText.match(/outcome:\s*'([^']+)'/);
      const timeframeMatch = entryText.match(/timeframe:\s*'([^']+)'/);
      
      results.push({
        cardId: cardIdMatch[1],
        organisation: orgMatch ? orgMatch[1] : '?',
        projectName: projMatch ? projMatch[1] : '?',
        outcome: outcomeMatch ? outcomeMatch[1].substring(0, 200) : '?',
        timeframe: timeframeMatch ? timeframeMatch[1] : '?',
      });
    }
    i = j + 1;
  } else {
    i++;
  }
}

console.log(`Found ${results.length} real-org case studies\n`);
results.forEach(r => {
  console.log(`[${r.cardId}] ${r.organisation} — ${r.projectName}`);
  console.log(`  Timeframe: ${r.timeframe}`);
  console.log(`  Outcome snippet: ${r.outcome.substring(0, 150)}...`);
  console.log('');
});
