// server/podcastDownload.mjs
// ESM version for Vite dev middleware — mirrors podcastDownload.ts exactly.
// POST /api/podcast-download
// Accepts an array of base64 MP3 segments, concatenates them into a single MP3 buffer,
// and returns it as a downloadable file.

export async function handlePodcastDownload(req, res) {
  try {
    // Parse body from stream if not already parsed
    let parsedBody = {};
    if (req._parsedBody) {
      parsedBody = req._parsedBody;
    } else if (req.body && typeof req.body === 'object') {
      parsedBody = req.body;
    } else {
      await new Promise((resolve) => {
        let raw = '';
        req.on('data', chunk => { raw += chunk.toString(); });
        req.on('end', () => {
          try { parsedBody = JSON.parse(raw); } catch { /* ignore */ }
          resolve();
        });
      });
    }

    const { segments, title } = parsedBody;

    if (!Array.isArray(segments) || segments.length === 0) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'No segments provided' }));
      return;
    }

    // Decode each base64 segment and concatenate into one buffer
    const buffers = segments.map(seg => {
      if (!seg.audioContent) return Buffer.alloc(0);
      return Buffer.from(seg.audioContent, 'base64');
    });
    const combined = Buffer.concat(buffers);

    // Sanitise the filename
    const safeName = (title ?? 'stratAlign-theater')
      .replace(/[^a-z0-9\s-]/gi, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .slice(0, 80);
    const filename = `${safeName}-stratAlign-theater.mp3`;

    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': combined.length,
    });
    res.end(combined);

    console.log(`[PodcastDownload] Served ${(combined.length / 1024).toFixed(0)} KB — "${filename}"`);
  } catch (err) {
    console.error('[PodcastDownload] Error:', err);
    try {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to generate download', details: String(err) }));
    } catch { /* response already ended */ }
  }
}
