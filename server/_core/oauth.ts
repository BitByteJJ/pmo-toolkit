import type { Request, Response } from 'express';
import { SignJWT } from 'jose';
import { env } from './env';
import { db } from './db';
import { users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

interface OAuthUserInfo {
  open_id: string;
  name: string;
  avatar?: string;
}

export async function handleOAuthCallback(req: Request, res: Response) {
  const { code, state } = req.query as { code?: string; state?: string };

  if (!code) {
    return res.status(400).send('Missing code');
  }

  try {
    // Exchange code for token
    const tokenRes = await fetch(`${env.OAUTH_SERVER_URL}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        app_id: env.VITE_APP_ID,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      throw new Error(`Token exchange failed: ${tokenRes.status}`);
    }

    const tokenData = await tokenRes.json() as { access_token: string };

    // Get user info
    const userRes = await fetch(`${env.OAUTH_SERVER_URL}/oauth/userinfo`, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userRes.ok) {
      throw new Error(`User info failed: ${userRes.status}`);
    }

    const userInfo = await userRes.json() as OAuthUserInfo;

    // Upsert user in database
    const existing = await db.select().from(users).where(eq(users.openId, userInfo.open_id)).limit(1);

    let dbUser;
    if (existing.length > 0) {
      await db.update(users)
        .set({ name: userInfo.name, avatar: userInfo.avatar, updatedAt: Date.now() })
        .where(eq(users.openId, userInfo.open_id));
      dbUser = { ...existing[0], name: userInfo.name, avatar: userInfo.avatar };
    } else {
      const isOwner = userInfo.open_id === env.OWNER_OPEN_ID;
      await db.insert(users).values({
        openId: userInfo.open_id,
        name: userInfo.name,
        avatar: userInfo.avatar,
        role: isOwner ? 'admin' : 'user',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      const inserted = await db.select().from(users).where(eq(users.openId, userInfo.open_id)).limit(1);
      dbUser = inserted[0];
    }

    // Sign JWT session
    const secret = new TextEncoder().encode(env.JWT_SECRET);
    const token = await new SignJWT({ user: dbUser })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('30d')
      .sign(secret);

    // Set cookie
    res.cookie('session', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    // Redirect back to app
    let redirectUrl = '/';
    if (state) {
      try {
        const parsed = JSON.parse(Buffer.from(state, 'base64').toString());
        if (parsed.origin) {
          redirectUrl = `${parsed.origin}${parsed.returnPath ?? '/'}`;
        } else if (parsed.returnPath) {
          redirectUrl = parsed.returnPath;
        }
      } catch {
        // ignore invalid state
      }
    }

    res.redirect(redirectUrl);
  } catch (err) {
    console.error('[OAuth] Callback error:', err);
    res.status(500).send('Authentication failed');
  }
}

export async function handleLogout(req: Request, res: Response) {
  res.clearCookie('session', { path: '/' });
  const origin = req.headers.origin ?? req.headers.referer ?? '/';
  res.redirect(origin as string);
}
