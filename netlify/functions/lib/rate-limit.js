/**
 * IP-based rate limiter for Netlify functions
 * In-memory sliding window - resets on cold start
 */
import { errorResponse } from './validate.js'

// Store: Map<ip, number[]> (timestamps)
const requestLog = new Map()

// Clean up stale entries periodically
const CLEANUP_INTERVAL = 5 * 60 * 1000
let lastCleanup = Date.now()

/**
 * Extract client IP from Netlify event headers
 * @param {object} event - Netlify function event
 * @returns {string} Client IP or 'unknown'
 */
function getClientIp(event) {
  return (
    event.headers?.['x-nf-client-connection-ip'] ||
    event.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
    event.headers?.['client-ip'] ||
    'unknown'
  )
}

/**
 * Clean up expired entries from the request log
 * @param {number} windowMs - Window size in ms
 */
function cleanup(windowMs) {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return

  lastCleanup = now
  const cutoff = now - windowMs

  for (const [ip, timestamps] of requestLog.entries()) {
    const filtered = timestamps.filter(t => t > cutoff)
    if (filtered.length === 0) {
      requestLog.delete(ip)
    } else {
      requestLog.set(ip, filtered)
    }
  }
}

/**
 * Check rate limit for a request
 * @param {object} event - Netlify function event
 * @param {object} options - Rate limit options
 * @param {number} options.maxRequests - Max requests per window (default: 15)
 * @param {number} options.windowMs - Window size in ms (default: 60000)
 * @returns {{ allowed: boolean, error: object|null, remaining: number }}
 */
export function checkRateLimit(event, options = {}) {
  const { maxRequests = 15, windowMs = 60 * 1000 } = options

  const ip = getClientIp(event)
  if (ip === 'unknown') {
    return { allowed: true, error: null, remaining: maxRequests }
  }

  const now = Date.now()
  const cutoff = now - windowMs

  cleanup(windowMs)

  let timestamps = requestLog.get(ip)
  if (!timestamps) {
    timestamps = []
    requestLog.set(ip, timestamps)
  }

  // Remove timestamps outside the window
  const filtered = timestamps.filter(t => t > cutoff)
  requestLog.set(ip, filtered)

  if (filtered.length >= maxRequests) {
    return {
      allowed: false,
      error: errorResponse(429, 'Too many requests. Please try again later.', 'RATE_LIMITED'),
      remaining: 0
    }
  }

  // Record this request
  filtered.push(now)

  return {
    allowed: true,
    error: null,
    remaining: maxRequests - filtered.length
  }
}
