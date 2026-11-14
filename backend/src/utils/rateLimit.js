// Tiny in-memory fixed-window rate limiter (per key). Good enough for a single
// server instance; use Redis or similar if you run several instances.
import AppError from './AppError.js'

const buckets = new Map()

export function rateLimit(key, { limit = 10, windowMs = 15 * 60 * 1000 } = {}) {
  const now = Date.now()
  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return
  }
  bucket.count += 1
  if (bucket.count > limit) {
    const minutes = Math.ceil((bucket.resetAt - now) / 60000)
    throw new AppError(`Too many attempts. Please try again in ${minutes} minute(s).`, 429)
  }
}

export function resetRateLimit(key) {
  buckets.delete(key)
}

// Periodically drop expired buckets so memory doesn't grow forever
setInterval(() => {
  const now = Date.now()
  for (const [key, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(key)
}, 10 * 60 * 1000).unref()

// Only trust X-Forwarded-For when running behind a reverse proxy you control
// (set TRUST_PROXY=true); otherwise clients could spoof it to dodge the limit.
export const clientIp = (req) => {
  if (process.env.TRUST_PROXY === 'true') {
    const forwarded = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    if (forwarded) return forwarded
  }
  return req.socket?.remoteAddress || 'unknown'
}
