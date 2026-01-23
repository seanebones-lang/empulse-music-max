/**
 * Simple in-memory rate limiting for API routes
 * For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * Rate limit configuration
 */
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60; // 60 requests per minute

/**
 * Get client identifier from request
 */
function getClientId(request: Request): string {
  // Try to get IP from headers (works with most proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  
  return ip;
}

/**
 * Check if request should be rate limited
 * @param request - The incoming request
 * @param maxRequests - Maximum requests per window (default: 60)
 * @param windowMs - Time window in milliseconds (default: 60000)
 * @returns Object with allowed status and remaining requests
 */
export function checkRateLimit(
  request: Request,
  maxRequests: number = RATE_LIMIT_MAX_REQUESTS,
  windowMs: number = RATE_LIMIT_WINDOW
): { allowed: boolean; remaining: number; resetTime: number } {
  const clientId = getClientId(request);
  const now = Date.now();
  
  // Get or create rate limit entry
  let entry = store[clientId];
  
  // Reset if window expired
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + windowMs,
    };
    store[clientId] = entry;
  }
  
  // Increment count
  entry.count++;
  
  // Check if limit exceeded
  const allowed = entry.count <= maxRequests;
  const remaining = Math.max(0, maxRequests - entry.count);
  
  return {
    allowed,
    remaining,
    resetTime: entry.resetTime,
  };
}

/**
 * Clean up expired entries (call periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}

// Cleanup every 5 minutes (only in Node.js environment)
if (typeof setInterval !== 'undefined' && typeof window === 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}
