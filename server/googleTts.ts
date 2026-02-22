import type { Request, Response } from 'express';

const GOOGLE_TTS_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';

/// Journey-F — Google's most natural, conversational voice (designed for long-form content)
const VOICE_CONFIG = {
  languageCode: 'en-US',
  name: 'en-US-Journey-F', // Warm, natural, encouraging — ideal for explainer narration
  ssmlGender: 'FEMALE',
};
// Fallback: Neural2-F if Journey quota is exceeded
const FALLBACK_VOICE = {
  languageCode: 'en-US',
  name: 'en-US-Neural2-F',
  ssmlGender: 'FEMALE',
};

export async function handleGoogleTts(req: Request, res: Response): Promise<void> {
  try {
    const apiKey = process.env.GOOGLE_TTS_API_KEY;
    if (!apiKey) {
      (res as any).writeHead
        ? ((res as any).writeHead(500, { 'Content-Type': 'application/json' }), (res as any).end(JSON.stringify({ error: 'Google TTS API key not configured' })))
        : res.status(500).json({ error: 'Google TTS API key not configured' });
      return;
    }

    // Parse body — support both pre-parsed (Express) and raw stream (Vite dev)
    let parsedBody: { text?: string } = {};
    if ((req as any)._parsedBody) {
      parsedBody = (req as any)._parsedBody;
    } else if ((req as any).body) {
      parsedBody = (req as any).body;
    } else {
      // Raw stream — read and parse manually
      await new Promise<void>((resolve) => {
        let raw = '';
        (req as any).on('data', (chunk: Buffer) => { raw += chunk.toString(); });
        (req as any).on('end', () => {
          try { parsedBody = JSON.parse(raw); } catch { /* invalid JSON */ }
          resolve();
        });
      });
    }

    const { text } = parsedBody;
    if (!text || typeof text !== 'string') {
      const sendErr = (code: number, msg: object) => {
        if ((res as any).writeHead) {
          (res as any).writeHead(code, { 'Content-Type': 'application/json' });
          (res as any).end(JSON.stringify(msg));
        } else {
          (res as any).status(code).json(msg);
        }
      };
      sendErr(400, { error: 'Missing or invalid text parameter' });
      return;
    }

    const sendJson = (code: number, data: object) => {
      if ((res as any).writeHead) {
        (res as any).writeHead(code, { 'Content-Type': 'application/json' });
        (res as any).end(JSON.stringify(data));
      } else {
        (res as any).status(code).json(data);
      }
    };

    // Limit text length to avoid excessive API costs
    const truncated = text.slice(0, 4000);

    const requestBody = {
      input: { text: truncated },
      voice: VOICE_CONFIG,
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,    // Natural pace — Journey voice handles rhythm itself
        pitch: 0.0,           // No pitch adjustment — Journey voice is naturally warm
        volumeGainDb: 1.5,    // Slightly louder for clarity
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
      sendJson(response.status, { error: 'Google TTS API error', details: errText.slice(0, 200) });
      return;
    }

    const data = await response.json() as { audioContent?: string };
    if (!data.audioContent) {
      sendJson(500, { error: 'No audio content returned from Google TTS' });
      return;
    }

    // Return the base64 audio content as JSON — client will decode and play
    sendJson(200, { audioContent: data.audioContent, format: 'mp3' });
  } catch (err) {
    console.error('[TTS] Unexpected error:', err);
    const sendErrFallback = (code: number, data: object) => {
      if ((res as any).writeHead) {
        (res as any).writeHead(code, { 'Content-Type': 'application/json' });
        (res as any).end(JSON.stringify(data));
      } else {
        (res as any).status(code).json(data);
      }
    };
    sendErrFallback(500, { error: 'Internal TTS error', details: String(err) });
  }
}
