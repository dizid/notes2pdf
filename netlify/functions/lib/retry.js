/**
 * Retry utility for external API calls with exponential backoff
 */

/**
 * Fetch with automatic retry on failure
 * @param {string} url - URL to fetch
 * @param {object} options - Fetch options
 * @param {object} retryOptions - Retry configuration
 * @returns {Promise<Response>} Fetch response
 */
export async function fetchWithRetry(url, options = {}, retryOptions = {}) {
  const {
    maxRetries = 3,
    baseDelay = 1000,      // 1 second
    maxDelay = 10000,      // 10 seconds
    retryOn = [408, 429, 500, 502, 503, 504], // Status codes to retry
    shouldRetry = null     // Custom retry predicate
  } = retryOptions

  let lastError
  let lastResponse

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options)
      lastResponse = response

      // Check if we should retry based on status code
      if (retryOn.includes(response.status) && attempt < maxRetries) {
        // Custom retry check
        if (shouldRetry && !shouldRetry(response, attempt)) {
          return response
        }

        // Calculate delay with exponential backoff + jitter
        const delay = Math.min(
          baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
          maxDelay
        )
        await sleep(delay)
        continue
      }

      return response
    } catch (error) {
      lastError = error

      // Network errors are retryable
      if (attempt < maxRetries) {
        const delay = Math.min(
          baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
          maxDelay
        )
        await sleep(delay)
        continue
      }
    }
  }

  // All retries exhausted
  if (lastResponse) {
    return lastResponse
  }

  throw lastError || new Error('Request failed after retries')
}

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Wrap a function with retry logic
 * @param {Function} fn - Async function to wrap
 * @param {object} options - Retry options
 * @returns {Function} Wrapped function
 */
export function withRetry(fn, options = {}) {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    shouldRetry = (error) => true
  } = options

  return async function (...args) {
    let lastError

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args)
      } catch (error) {
        lastError = error

        if (attempt < maxRetries && shouldRetry(error, attempt)) {
          const delay = Math.min(
            baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
            maxDelay
          )
          await sleep(delay)
          continue
        }
      }
    }

    throw lastError
  }
}
