// generateJingle.mjs
// Generates the StratAlign Theater intro jingle using Google TTS Journey voices
// and saves it as public/stratalign-theater-jingle.mp3
//
// Run: GOOGLE_TTS_API_KEY=your_key node scripts/generateJingle.mjs
// Or:  node scripts/generateJingle.mjs  (reads from .env)

import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Try to load .env
try {
  const { config } = await import('dotenv');
  config({ path: resolve(ROOT, '.env') });
} catch {}

const API_KEY = process.env.GOOGLE_TTS_API_KEY;
if (!API_KEY) {
  console.error('❌  GOOGLE_TTS_API_KEY not set');
  process.exit(1);
}

const TTS_URL = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;

async function synthesize(text, voiceName, gender) {
  const body = {
    input: { text },
    voice: { languageCode: 'en-US', name: voiceName, ssmlGender: gender },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: 0.95,
      pitch: 0.0,
      volumeGainDb: 2.0,
      effectsProfileId: ['headphone-class-device'],
    },
  };

  const res = await fetch(TTS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`TTS failed (${res.status}): ${err.slice(0, 300)}`);
  }

  const data = await res.json();
  if (!data.audioContent) throw new Error('No audioContent in response');
  return Buffer.from(data.audioContent, 'base64');
}

// The jingle is a two-part spoken intro:
// 1. Alex (Journey-D) delivers the show open
// 2. Sam (Journey-O) adds the tagline
// We concatenate the two MP3 buffers — browsers handle this correctly.

console.log('🎙  Generating StratAlign Theater intro jingle…');

const [alexBuf, samBuf] = await Promise.all([
  synthesize(
    "Welcome to StratAlign Theater.",
    'en-US-Journey-D',
    'MALE'
  ),
  synthesize(
    "Where project management comes to life.",
    'en-US-Journey-O',
    'FEMALE'
  ),
]);

// Concatenate the two MP3 buffers
const combined = Buffer.concat([alexBuf, samBuf]);

// Save to public/
const outDir = resolve(ROOT, 'client', 'public');
mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, 'stratalign-theater-jingle.mp3');
writeFileSync(outPath, combined);

console.log(`✅  Jingle saved to ${outPath} (${combined.length} bytes)`);
