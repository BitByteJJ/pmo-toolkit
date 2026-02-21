import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../../drizzle/schema';
import { env } from './env';

const pool = mysql.createPool({
  uri: env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
});

export const db = drizzle(pool, { schema, mode: 'default' });
export type DB = typeof db;
