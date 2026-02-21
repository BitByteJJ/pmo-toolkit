import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from '../routers';
import { createContext } from './context';
import { handleOAuthCallback, handleLogout } from './oauth';
import { env } from './env';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(cookieParser());
  app.use(express.json());

  // OAuth routes
  app.get('/api/oauth/callback', handleOAuthCallback);
  app.post('/api/auth/logout', handleLogout);

  // tRPC
  app.use(
    '/api/trpc',
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Static files
  const staticPath =
    env.NODE_ENV === 'production'
      ? path.resolve(__dirname, '..', '..', 'dist', 'public')
      : path.resolve(__dirname, '..', '..', 'dist');

  if (env.NODE_ENV === 'production') {
    app.use(express.static(staticPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(staticPath, 'index.html'));
    });
  }

  const port = parseInt(env.PORT, 10);
  server.listen(port, () => {
    console.log(`[Server] Running on http://localhost:${port}`);
    console.log(`[OAuth] Initialized with baseURL: ${env.OAUTH_SERVER_URL}`);
  });
}

startServer().catch(console.error);
