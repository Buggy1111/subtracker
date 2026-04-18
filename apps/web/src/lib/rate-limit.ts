/**
 * Lightweight in-memory rate limiter.
 *
 * Good enough for a self-hosted app or small Vercel deployment where a single
 * serverless instance handles most of the traffic. For multi-region / high
 * scale, replace with Upstash Ratelimit or Vercel KV.
 *
 * Sliding window: `max` requests per `windowMs`.
 */

type Entry = {
  timestamps: number[];
};

const buckets = new Map<string, Entry>();

// Periodic cleanup so Map doesn't grow unbounded
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

export interface RateLimitOptions {
  /** Unique key per actor — e.g. `user:123` or `ip:1.2.3.4` */
  key: string;
  /** Max requests allowed in the window */
  max: number;
  /** Window size in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit({ key, max, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Cleanup stale buckets occasionally
  if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
    for (const [k, entry] of buckets.entries()) {
      entry.timestamps = entry.timestamps.filter((t) => t > windowStart);
      if (entry.timestamps.length === 0) buckets.delete(k);
    }
    lastCleanup = now;
  }

  const bucket = buckets.get(key) ?? { timestamps: [] };
  // Drop timestamps outside current window
  bucket.timestamps = bucket.timestamps.filter((t) => t > windowStart);

  if (bucket.timestamps.length >= max) {
    const oldest = bucket.timestamps[0];
    return {
      allowed: false,
      remaining: 0,
      resetAt: oldest + windowMs,
    };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);

  return {
    allowed: true,
    remaining: max - bucket.timestamps.length,
    resetAt: now + windowMs,
  };
}
