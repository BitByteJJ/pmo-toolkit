// server/googleTts.ts
var GOOGLE_TTS_URL = "https://texttospeech.googleapis.com/v1/text:synthesize";
var VOICE_CONFIG = {
  languageCode: "en-US",
  name: "en-US-Journey-F",
  // Warm, natural, encouraging — ideal for explainer narration
  ssmlGender: "FEMALE"
};
var FALLBACK_VOICE = {
  languageCode: "en-US",
  name: "en-US-Neural2-F",
  ssmlGender: "FEMALE"
};
async function handleGoogleTts(req, res) {
  try {
    const apiKey = process.env.GOOGLE_TTS_API_KEY;
    if (!apiKey) {
      res.writeHead ? (res.writeHead(500, { "Content-Type": "application/json" }), res.end(JSON.stringify({ error: "Google TTS API key not configured" }))) : res.status(500).json({ error: "Google TTS API key not configured" });
      return;
    }
    let parsedBody = {};
    if (req._parsedBody) {
      parsedBody = req._parsedBody;
    } else if (req.body) {
      parsedBody = req.body;
    } else {
      await new Promise((resolve) => {
        let raw = "";
        req.on("data", (chunk) => {
          raw += chunk.toString();
        });
        req.on("end", () => {
          try {
            parsedBody = JSON.parse(raw);
          } catch {
          }
          resolve();
        });
      });
    }
    const { text } = parsedBody;
    if (!text || typeof text !== "string") {
      const sendErr = (code, msg) => {
        if (res.writeHead) {
          res.writeHead(code, { "Content-Type": "application/json" });
          res.end(JSON.stringify(msg));
        } else {
          res.status(code).json(msg);
        }
      };
      sendErr(400, { error: "Missing or invalid text parameter" });
      return;
    }
    const sendJson = (code, data2) => {
      if (res.writeHead) {
        res.writeHead(code, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data2));
      } else {
        res.status(code).json(data2);
      }
    };
    const truncated = text.slice(0, 4e3);
    const requestBody = {
      input: { text: truncated },
      voice: VOICE_CONFIG,
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: 1,
        // Natural pace — Journey voice handles rhythm itself
        pitch: 0,
        // No pitch adjustment — Journey voice is naturally warm
        volumeGainDb: 1.5,
        // Slightly louder for clarity
        effectsProfileId: ["headphone-class-device"]
      }
    };
    let response = await fetch(`${GOOGLE_TTS_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
      const errText = await response.text();
      console.warn("[TTS] Neural2 failed, trying WaveNet fallback:", errText.slice(0, 200));
      const fallbackBody = { ...requestBody, voice: FALLBACK_VOICE };
      response = await fetch(`${GOOGLE_TTS_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fallbackBody)
      });
    }
    if (!response.ok) {
      const errText = await response.text();
      console.error("[TTS] Google TTS error:", errText.slice(0, 300));
      sendJson(response.status, { error: "Google TTS API error", details: errText.slice(0, 200) });
      return;
    }
    const data = await response.json();
    if (!data.audioContent) {
      sendJson(500, { error: "No audio content returned from Google TTS" });
      return;
    }
    sendJson(200, { audioContent: data.audioContent, format: "mp3" });
  } catch (err) {
    console.error("[TTS] Unexpected error:", err);
    const sendErrFallback = (code, data) => {
      if (res.writeHead) {
        res.writeHead(code, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
      } else {
        res.status(code).json(data);
      }
    };
    sendErrFallback(500, { error: "Internal TTS error", details: String(err) });
  }
}
export {
  handleGoogleTts
};
