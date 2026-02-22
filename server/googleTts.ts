import type { Request, Response } from 'express';

const GOOGLE_TTS_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';

// High-quality Neural2 voice — British English female (natural, authoritative)
const VOICE_CONFIG = {
  languageCode: 'en-GB',
  name: 'en-GB-Neural2-C', // Female, clear, professional
  ssmlGender: 'FEMALE',
};

// Fallback voice if Neural2 quota is exceeded
const FALLBACK_VOICE = {
  languageCode: 'en-GB',
  name: 'en-GB-Wavenet-C',
  ssmlGender: 'FEMALE',
};

export async function handleGoogleTts(req: Request, res: Response): Promise<void> {
  try {
    const apiKey = process.env.GOOGLE_TTS_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Google TTS API key not configured' });
      return;
    }

    const { text } = (req as any)._parsedBody || req.body || {};
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Missing or invalid text parameter' });
      return;
    }

    // Limit text length to avoid excessive API costs
    const truncated = text.slice(0, 4000);

    const requestBody = {
      input: { text: truncated },
      voice: VOICE_CONFIG,
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 0.92,   // Slightly slower for clarity
        pitch: -1.0,           // Slightly lower pitch — more authoritative
        volumeGainDb: 1.0,
        effectsProfileId: ['headphone-class-device'],
      },
    };

    let response = await fetch(`${GOOGLE_TTS_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    // If Neural2 fails (quota/billing), retry with WaveNet
    if (!response.ok) {
      const errText = await response.text();
      console.warn('[TTS] Neural2 failed, trying WaveNet fallback:', errText.slice(0, 200));

      const fallbackBody = { ...requestBody, voice: FALLBACK_VOICE };
      response = await fetch(`${GOOGLE_TTS_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fallbackBody),
      });
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error('[TTS] Google TTS error:', errText.slice(0, 300));
      res.status(response.status).json({ error: 'Google TTS API error', details: errText.slice(0, 200) });
      return;
    }

    const data = await response.json() as { audioContent?: string };
    if (!data.audioContent) {
      res.status(500).json({ error: 'No audio content returned from Google TTS' });
      return;
    }

    // Return the base64 audio content as JSON — client will decode and play
    res.json({ audioContent: data.audioContent, format: 'mp3' });
  } catch (err) {
    console.error('[TTS] Unexpected error:', err);
    res.status(500).json({ error: 'Internal TTS error', details: String(err) });
  }
}
