import { Redis } from '@upstash/redis';

/**
 * Shared rate-limiting helper using Upstash Redis. Falls back to an in-memory store
 * when Redis creds are not present (e.g. local dev).
 */
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Upstash client (edge-compatible)
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

// Fallback in-memory map (one per lambda instance)
const memStore = new Map<string, { count: number; reset: number }>();

export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<boolean> {
  // Prefer shared Redis so limits apply across all instances/regions
  if (redis) {
    // Use seconds for Redis EXPIRE
    const windowSec = Math.floor(windowMs / 1000);
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, windowSec);
    }
    return count <= limit;
  }

  // Fallback – per-instance
  const now = Date.now();
  const record = memStore.get(key);
  if (!record || now > record.reset) {
    memStore.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (record.count >= limit) return false;
  record.count += 1;
  return true;
} 