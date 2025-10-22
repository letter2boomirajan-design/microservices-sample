// src/cache/redisClient.ts
import Redis from "ioredis";

// Create and export a Redis client.
// Use environment variables; fallback to defaults matching docker-compose.
export const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT || 6379)
});

// helper: set JSON to redis with TTL (seconds)
export async function cacheSet(key: string, value: any, ttlSeconds = 60) {
    const payload = JSON.stringify(value);
    await redis.set(key, payload, "EX", ttlSeconds);
}

// helper: get JSON from redis
export async function cacheGet<T = any>(key: string): Promise<T | null> {
    const result = await redis.get(key);
    if (!result) return null;
    return JSON.parse(result) as T;
}

// helper: remove key
export async function cacheDel(key: string) {
    await redis.del(key);
}
