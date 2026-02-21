import dotenv from 'dotenv';
dotenv.config();

export const env = {
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  JWT_SECRET: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  VITE_APP_ID: process.env.VITE_APP_ID ?? '',
  OAUTH_SERVER_URL: process.env.OAUTH_SERVER_URL ?? 'https://api.manus.im',
  VITE_OAUTH_PORTAL_URL: process.env.VITE_OAUTH_PORTAL_URL ?? 'https://manus.im',
  OWNER_OPEN_ID: process.env.OWNER_OPEN_ID ?? '',
  OWNER_NAME: process.env.OWNER_NAME ?? '',
  BUILT_IN_FORGE_API_URL: process.env.BUILT_IN_FORGE_API_URL ?? '',
  BUILT_IN_FORGE_API_KEY: process.env.BUILT_IN_FORGE_API_KEY ?? '',
  VITE_FRONTEND_FORGE_API_KEY: process.env.VITE_FRONTEND_FORGE_API_KEY ?? '',
  VITE_FRONTEND_FORGE_API_URL: process.env.VITE_FRONTEND_FORGE_API_URL ?? '',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: process.env.PORT ?? '3000',
};
