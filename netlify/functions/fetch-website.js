// Netlify function to fetch website content for analysis (CORS proxy)
// Returns HTML and extracted CSS for design analysis

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

    // Fetch the website
    const response = await fetch(parsedUrl.href, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DizidBot/1.0; +https://dizid.com)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      redirect: 'follow'
    })

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

    // Fetch linked stylesheets (limit to first 3 to avoid timeout)
    const externalCss = []
    for (const cssUrl of linkedStylesheets.slice(0, 3)) {
      try {
        const cssResponse = await fetch(cssUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DizidBot/1.0)' }
        })
        if (cssResponse.ok) {
          const cssText = await cssResponse.text()
          // Limit each CSS file to 50KB to avoid huge payloads
          externalCss.push(cssText.slice(0, 50000))
        }
      } catch {
        // Skip failed CSS fetches
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
    console.error('Fetch website error:', err)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message || 'Failed to fetch website' })
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
  const linkRegex = /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi
  const hrefFirstRegex = /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']stylesheet["']/gi

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
