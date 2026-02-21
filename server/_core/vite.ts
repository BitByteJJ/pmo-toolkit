import type { Express } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupVite(app: Express) {
  const vite = await createViteServer({
    configFile: path.resolve(__dirname, '..', '..', 'vite.config.ts'),
    server: {
      middlewareMode: true,
      hmr: true,
    },
    appType: 'spa',
  });

  app.use(vite.middlewares);
  return vite;
}
