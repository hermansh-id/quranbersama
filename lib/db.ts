import { createClient } from '@libsql/client';
import { createClient as RedisClient } from 'redis';

export const db = createClient({
    url: process.env.TURSO_DATABASE_URL || "",
    authToken: process.env.TURSO_AUTH_TOKEN || ""
  });

export const redis = await RedisClient({
    url: process.env.REDIS_URL || ""
})
.on("error", (err) => console.log("Redis Client Error", err))
.connect();
