import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

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
