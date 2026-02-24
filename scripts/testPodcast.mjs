// Quick diagnostic — checks env vars and makes a single TTS call
const ttsKey = process.env.GOOGLE_TTS_API_KEY;
const llmUrl = process.env.BUILT_IN_FORGE_API_URL;
const llmKey = process.env.BUILT_IN_FORGE_API_KEY;

console.log('GOOGLE_TTS_API_KEY:', ttsKey ? ttsKey.slice(0, 8) + '...' : 'MISSING');
console.log('BUILT_IN_FORGE_API_URL:', llmUrl ? llmUrl.slice(0, 40) + '...' : 'MISSING');
console.log('BUILT_IN_FORGE_API_KEY:', llmKey ? llmKey.slice(0, 8) + '...' : 'MISSING');

if (!ttsKey) {
  console.error('ERROR: GOOGLE_TTS_API_KEY is not set');
  process.exit(1);
}

console.log('\nTesting TTS with a short line...');
try {
  const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${ttsKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: { text: 'Welcome to StratAlign Theater.' },
      voice: { languageCode: 'en-US', name: 'en-US-Journey-D', ssmlGender: 'MALE' },
      audioConfig: { audioEncoding: 'MP3' },
    }),
  });
  const data = await res.json();
  if (data.audioContent) {
    console.log('TTS SUCCESS — audio content length:', data.audioContent.length, 'chars');
  } else {
    console.error('TTS FAILED:', JSON.stringify(data).slice(0, 300));
  }
} catch (e) {
  console.error('TTS fetch error:', e.message);
}
