import type { Request, Response } from 'express';
import { jwtVerify } from 'jose';
import { env } from './env';
import type { User } from '../../drizzle/schema';

export interface Context {
  req: Request;
  res: Response;
  user: User | null;
}

export async function createContext({ req, res }: { req: Request; res: Response }): Promise<Context> {
  let user: User | null = null;

  try {
    const token = req.cookies?.['session'];
    if (token) {
      const secret = new TextEncoder().encode(env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      if (payload && typeof payload === 'object' && 'user' in payload) {
        user = payload.user as User;
      }
    }
  } catch {
    // Invalid or expired token — treat as unauthenticated
  }

  return { req, res, user };
}
