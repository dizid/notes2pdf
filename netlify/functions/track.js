// Netlify function to track page views
// Accepts both GET (pixel) and POST (script) requests

import { createClient } from '@supabase/supabase-js'

// 1x1 transparent GIF in base64
const TRANSPARENT_GIF = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

// Initialize Supabase client
function getSupabase() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

  if (!url || !key) {
    return null
  }

  return createClient(url, key)
}

export async function handler(event) {
  // Handle both GET (pixel) and POST (script) requests
  const isPost = event.httpMethod === 'POST'

  let slug, referrer

  if (isPost) {
    try {
      const body = JSON.parse(event.body || '{}')
      slug = body.s || body.slug
      referrer = body.r || body.referrer
    } catch {
      return { statusCode: 400, body: 'Invalid JSON' }
    }
  } else {
    // GET request - from tracking pixel
    slug = event.queryStringParameters?.s || event.queryStringParameters?.slug
    referrer = event.headers.referer || event.headers.referrer || null
  }

  // Validate slug
  if (!slug || typeof slug !== 'string' || slug.length > 100) {
    // Return pixel anyway to avoid broken images
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      },
      body: TRANSPARENT_GIF,
      isBase64Encoded: true
    }
  }

  // Get country from Cloudflare/Netlify headers
  const country = event.headers['cf-ipcountry'] ||
                  event.headers['x-country'] ||
                  event.headers['x-nf-client-connection-ip'] ? 'unknown' : null

  // Record the view (fire and forget - don't wait)
  const supabase = getSupabase()
  if (supabase) {
    // Insert page view (async, don't await for faster response)
    const viewPromise = supabase
      .from('page_views')
      .insert({
        slug: slug.toLowerCase().trim(),
        referrer: referrer ? referrer.substring(0, 500) : null,
        country
      })

    // Update aggregated stats - first try to get existing, then upsert with incremented count
    const slugLower = slug.toLowerCase().trim()
    const statsPromise = supabase
      .from('page_stats')
      .select('total_views')
      .eq('slug', slugLower)
      .single()
      .then(({ data }) => {
        const currentViews = data?.total_views || 0
        return supabase
          .from('page_stats')
          .upsert({
            slug: slugLower,
            total_views: currentViews + 1,
            last_viewed_at: new Date().toISOString()
          }, { onConflict: 'slug' })
      })

    // Don't await - fire and forget for faster response
    Promise.all([viewPromise, statsPromise]).catch(err => {
      console.error('Track error:', err)
    })
  }

  // Return response immediately
  if (isPost) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ ok: true })
    }
  }

  // Return 1x1 transparent GIF for pixel requests
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    },
    body: TRANSPARENT_GIF,
    isBase64Encoded: true
  }
}
