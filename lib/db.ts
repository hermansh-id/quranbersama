import { Database } from 'bun:sqlite';

export const db = new Database('quran.db');
export const redis = new Bun.RedisClient(process.env.REDIS_URL);
