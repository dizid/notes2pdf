// Netlify function to fetch website content for analysis (CORS proxy)
// Returns HTML and extracted CSS for design analysis

// Fetch with timeout and retry for transient errors
async function fetchWithTimeout(url, options = {}, timeoutMs = 5000, retries = 2) {
  let lastError
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetch(url, { ...options, signal: controller.signal })
      clearTimeout(timeout)
      return response
    } catch (err) {
      clearTimeout(timeout)
      lastError = err
      // Retry on connection errors (ETIMEDOUT, ECONNRESET, etc.)
      const isRetryable = err.cause?.code === 'ETIMEDOUT' ||
                          err.cause?.code === 'ECONNRESET' ||
                          err.cause?.code === 'ECONNREFUSED'
      if (!isRetryable || attempt === retries) {
        throw err
      }
      // Brief delay before retry
      await new Promise(r => setTimeout(r, 200))
    }
  }
  throw lastError
}

export async function handler(event) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { url } = JSON.parse(event.body)

    if (!url) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'URL is required' })
      }
    }

    // Validate URL
    let parsedUrl
    try {
      parsedUrl = new URL(url)
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid protocol')
      }
    } catch {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid URL format' })
      }
    }

    // SSRF Protection: Block internal/private IPs and localhost
    const hostname = parsedUrl.hostname.toLowerCase()
    if (isInternalHost(hostname)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Internal URLs are not allowed' })
      }
    }

    // Fetch the website with 8 second timeout
    const response = await fetchWithTimeout(parsedUrl.href, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SizzleBot/1.0; +https://sizzle.love)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      redirect: 'follow'
    }, 8000)

    if (!response.ok) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: `Failed to fetch website: ${response.status}` })
      }
    }

    const html = await response.text()

    // Extract inline styles and linked stylesheets
    const inlineStyles = extractInlineStyles(html)
    const linkedStylesheets = extractLinkedStylesheets(html, parsedUrl)

    // Fetch linked stylesheets (limit to first 3, 3 second timeout each)
    const externalCss = []
    for (const cssUrl of linkedStylesheets.slice(0, 3)) {
      try {
        const cssResponse = await fetchWithTimeout(cssUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SizzleBot/1.0)' }
        }, 3000)
        if (cssResponse.ok) {
          const cssText = await cssResponse.text()
          // Limit each CSS file to 50KB to avoid huge payloads
          externalCss.push(cssText.slice(0, 50000))
        }
      } catch {
        // Skip failed/timeout CSS fetches
      }
    }

    // Combine all CSS
    const allCss = [...inlineStyles, ...externalCss].join('\n')

    // Extract Google Fonts URL if present
    const googleFontsMatch = html.match(/href="(https:\/\/fonts\.googleapis\.com\/css2[^"]+)"/i)
    const googleFontsUrl = googleFontsMatch ? googleFontsMatch[1] : null

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        html: html.slice(0, 100000), // Limit HTML to 100KB
        css: allCss.slice(0, 100000), // Limit CSS to 100KB
        googleFontsUrl,
        baseUrl: parsedUrl.origin
      })
    }
  } catch (err) {
    console.error('Fetch website error:', err.name, err.message, err.stack)
    const isTimeout = err.name === 'AbortError'
    const errorMsg = isTimeout
      ? 'Website took too long to respond'
      : `${err.name}: ${err.message}` || 'Failed to fetch website'
    return {
      statusCode: isTimeout ? 504 : 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: errorMsg })
    }
  }
}

/**
 * Extract inline <style> content from HTML
 */
function extractInlineStyles(html) {
  const styles = []
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi
  let match
  while ((match = styleRegex.exec(html)) !== null) {
    styles.push(match[1])
  }
  return styles
}

/**
 * Extract linked stylesheet URLs from HTML
 */
function extractLinkedStylesheets(html, baseUrl) {
  const links = []
  // Handle quoted OR unquoted attributes (HTML5 allows href=value without quotes)
  const linkRegex = /<link[^>]+rel=["']?stylesheet["']?[^>]+href=["']?([^"'\s>]+)["']?/gi
  const hrefFirstRegex = /<link[^>]+href=["']?([^"'\s>]+)["']?[^>]+rel=["']?stylesheet["']?/gi

  let match
  while ((match = linkRegex.exec(html)) !== null) {
    links.push(resolveUrl(match[1], baseUrl))
  }
  while ((match = hrefFirstRegex.exec(html)) !== null) {
    links.push(resolveUrl(match[1], baseUrl))
  }

  // Filter out Google Fonts (we handle those separately) and duplicates
  return [...new Set(links)].filter(url =>
    !url.includes('fonts.googleapis.com') &&
    !url.includes('fonts.gstatic.com')
  )
}

/**
 * Resolve relative URL to absolute
 */
function resolveUrl(href, baseUrl) {
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return href
  }
  if (href.startsWith('//')) {
    return baseUrl.protocol + href
  }
  if (href.startsWith('/')) {
    return baseUrl.origin + href
  }
  return new URL(href, baseUrl.href).href
}

/**
 * Check if hostname is internal/private (SSRF protection)
 * Blocks: localhost, 127.x.x.x, 10.x.x.x, 172.16-31.x.x, 192.168.x.x, etc.
 */
function isInternalHost(hostname) {
  // Localhost variants
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
    return true
  }

  // Check for IP address patterns
  const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (ipv4Match) {
    const [, a, b] = ipv4Match.map(Number)

    // 127.x.x.x (loopback)
    if (a === 127) return true

    // 10.x.x.x (private)
    if (a === 10) return true

    // 172.16.x.x - 172.31.x.x (private)
    if (a === 172 && b >= 16 && b <= 31) return true

    // 192.168.x.x (private)
    if (a === 192 && b === 168) return true

    // 169.254.x.x (link-local)
    if (a === 169 && b === 254) return true

    // 0.x.x.x (current network)
    if (a === 0) return true
  }

  // Block .local, .internal, .localhost TLDs
  if (hostname.endsWith('.local') || hostname.endsWith('.internal') || hostname.endsWith('.localhost')) {
    return true
  }

  return false
}
