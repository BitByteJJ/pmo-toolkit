import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { handleAiSuggest } from "./aiSuggest.js";
import { handleAiDeepDive } from "./aiDeepDive.js";
import { handleAiVideoScript } from "./aiVideoScript.js";
import { handleAiVideoGuide } from "./aiVideoGuide.js";
import { handleGoogleTts } from './googleTts.js';
import { handlePodcastGenerate } from './podcastGenerator.js';
import { handlePodcastDownload } from './podcastDownload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // AI Suggest endpoint — use express.json() to parse body before passing to handler
  app.post('/api/ai-suggest', express.json(), async (req, res, next) => {
    try {
      // Inject the already-parsed body so handleAiSuggest doesn't need to re-read the stream
      (req as any)._parsedBody = req.body;
      await handleAiSuggest(req as any, res as any);
    } catch (e) {
      next(e);
    }
  });

  // AI Deep Dive endpoint
  app.post('/api/ai-deep-dive', express.json(), async (req, res, next) => {
    try {
      (req as any)._parsedBody = req.body;
      await handleAiDeepDive(req as any, res as any);
    } catch (e) {
      next(e);
    }
  });

  // AI Video Script endpoint
  app.post('/api/ai-video-script', express.json(), async (req, res, next) => {
    try {
      (req as any)._parsedBody = req.body;
      await handleAiVideoScript(req as any, res as any);
    } catch (e) {
      next(e);
    }
  });

  // Google TTS endpoint
  app.post('/api/tts', express.json(), async (req, res, next) => {
    try {
      (req as any)._parsedBody = req.body;
      await handleGoogleTts(req as any, res as any);
    } catch (e) {
      next(e);
    }
  });

  // Podcast download endpoint — stitches segments into a single MP3
  app.post('/api/podcast-download', express.json({ limit: '50mb' }), async (req, res, next) => {
    try {
      (req as any)._parsedBody = req.body;
      await handlePodcastDownload(req as any, res as any);
    } catch (e) {
      next(e);
    }
  });

  // Podcast generation endpoint — LLM script + two-voice TTS
  app.post('/api/podcast', express.json(), async (req, res, next) => {
    try {
      (req as any)._parsedBody = req.body;
      await handlePodcastGenerate(req as any, res as any);
    } catch (e) {
      next(e);
    }
  });

  // AI Video Guide endpoint
  app.post('/api/ai-video-guide', express.json(), async (req, res, next) => {
    try {
      (req as any).body = req.body;
      await handleAiVideoGuide(req as any, res as any);
    } catch (e) {
      next(e);
    }
  });

  // Audio proxy for jingle/outro files (avoids CORS on CDN fetch from browser)
  app.get("/api/audio-proxy", async (req, res) => {
    try {
      const audioUrl = req.query.url as string;
      if (!audioUrl) {
        res.status(400).json({ error: "Missing url parameter" });
        return;
      }
      const parsed = new URL(audioUrl);
      if (!parsed.hostname.endsWith("manuscdn.com")) {
        res.status(403).json({ error: "Domain not allowed" });
        return;
      }
      const response = await fetch(audioUrl);
      if (!response.ok) {
        res.status(response.status).end();
        return;
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      res.set({
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      });
      res.send(buffer);
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });

  // Image proxy for PDF export (avoids CORS issues with CDN images)
  app.get("/api/image-proxy", async (req, res) => {
    try {
      const imageUrl = req.query.url as string;
      if (!imageUrl) {
        res.status(400).json({ error: "Missing url parameter" });
        return;
      }
      const parsed = new URL(imageUrl);
      if (!parsed.hostname.endsWith("manuscdn.com")) {
        res.status(403).json({ error: "Domain not allowed" });
        return;
      }
      const response = await fetch(imageUrl);
      if (!response.ok) {
        res.status(response.status).end();
        return;
      }
      const contentType = response.headers.get("content-type") || "image/png";
      const buffer = Buffer.from(await response.arrayBuffer());
      res.set({
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      });
      res.send(buffer);
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
