import { createClient } from 'redis';

// Rate limiting utility for AI API calls
export class AIRateLimiter {
  private redis: ReturnType<typeof createClient> | null = null;
  private memoryStore: Map<string, { count: number; resetTime: number }> = new Map();

  constructor() {
    // Initialize Redis if available, otherwise use memory store
    if (process.env.REDIS_URL) {
      try {
        this.redis = createClient({ url: process.env.REDIS_URL });
      } catch (error) {
        console.warn('Redis not available, using memory store for rate limiting');
      }
    }
  }

  // Check if request is within rate limit
  async checkRateLimit(
    identifier: string,
    limit: number,
    windowMs: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = `rate_limit:${identifier}`;
    const now = Date.now();
    const resetTime = now + windowMs;

    if (this.redis) {
      return this.checkRedisRateLimit(key, limit, windowMs);
    } else {
      return this.checkMemoryRateLimit(key, limit, windowMs);
    }
  }

  private async checkRedisRateLimit(
    key: string,
    limit: number,
    windowMs: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    try {
      const current = await this.redis!.get(key);
      const count = current ? parseInt(current) : 0;
      const remaining = Math.max(0, limit - count - 1);
      const allowed = count < limit;

      if (allowed) {
        await this.redis!.incr(key);
        await this.redis!.expire(key, Math.ceil(windowMs / 1000));
      }

      return {
        allowed,
        remaining,
        resetTime: Date.now() + windowMs
      };
    } catch (error) {
      console.error('Redis rate limit error:', error);
      // Fallback to allowing the request
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: Date.now() + windowMs
      };
    }
  }

  private checkMemoryRateLimit(
    key: string,
    limit: number,
    windowMs: number
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const stored = this.memoryStore.get(key);

    if (!stored || now > stored.resetTime) {
      // Reset or create new entry
      this.memoryStore.set(key, { count: 1, resetTime: now + windowMs });
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: now + windowMs
      };
    }

    const allowed = stored.count < limit;
    if (allowed) {
      stored.count++;
    }

    return {
      allowed,
      remaining: Math.max(0, limit - stored.count),
      resetTime: stored.resetTime
    };
  }

  // Clean up expired entries from memory store
  cleanupMemoryStore(): void {
    const now = Date.now();
    for (const [key, value] of this.memoryStore.entries()) {
      if (now > value.resetTime) {
        this.memoryStore.delete(key);
      }
    }
  }

  // Get rate limit status
  async getRateLimitStatus(identifier: string): Promise<{
    current: number;
    limit: number;
    resetTime: number;
  }> {
    const key = `rate_limit:${identifier}`;
    
    if (this.redis) {
      try {
        const current = await this.redis.get(key);
        const count = current ? parseInt(current) : 0;
        const ttl = await this.redis.ttl(key);
        return {
          current: count,
          limit: 60, // Default limit
          resetTime: Date.now() + (ttl * 1000)
        };
      } catch (error) {
        return { current: 0, limit: 60, resetTime: Date.now() };
      }
    } else {
      const stored = this.memoryStore.get(key);
      return {
        current: stored?.count || 0,
        limit: 60,
        resetTime: stored?.resetTime || Date.now()
      };
    }
  }
}

// Singleton instance
export const aiRateLimiter = new AIRateLimiter();

// Clean up memory store every 5 minutes
setInterval(() => {
  aiRateLimiter.cleanupMemoryStore();
}, 5 * 60 * 1000);
