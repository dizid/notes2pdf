// Netlify function to upload HTML to Cloudflare R2 for sharing
// Environment variables required:
//   CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME,
//   CLOUDFLARE_ACCOUNT_ID, R2_PUBLIC_URL

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
function getSupabase() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

  if (!url || !key) {
    return null
  }

  return createClient(url, key)
}
import {
  safeJsonParse,
  validateString,
  validateObject,
  errorResponse,
  LIMITS
} from './lib/validate.js'

// Max HTML size: 10MB
const MAX_HTML_SIZE = 10 * 1024 * 1024

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return errorResponse(405, 'Method not allowed')
  }

  // Check environment variables (use CLOUDFLARE_R2_ prefix to match .env)
  const {
    CLOUDFLARE_R2_ACCESS_KEY_ID,
    CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME,
    CLOUDFLARE_ACCOUNT_ID,
    R2_PUBLIC_URL
  } = process.env

  if (!CLOUDFLARE_R2_ACCESS_KEY_ID || !CLOUDFLARE_R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME || !CLOUDFLARE_ACCOUNT_ID) {
    console.error('Missing R2 environment variables')
    return errorResponse(503, 'Cloud publishing is not configured', 'R2_NOT_CONFIGURED')
  }

  // Parse and validate request body
  const { data: body, error: parseError } = safeJsonParse(event.body)
  if (parseError) {
    return errorResponse(400, parseError)
  }

  const { html, title, remixData, userId } = body

  // Validate HTML
  const htmlError = validateString(html, 'html', { required: true, maxLength: MAX_HTML_SIZE })
  if (htmlError) {
    return errorResponse(400, htmlError)
  }

  // Validate title
  const titleError = validateString(title, 'title', { maxLength: LIMITS.MAX_TITLE_LENGTH })
  if (titleError) {
    return errorResponse(400, titleError)
  }

  // Validate remixData if present
  if (remixData !== undefined) {
    const remixError = validateObject(remixData, 'remixData')
    if (remixError) {
      return errorResponse(400, remixError)
    }
  }

  try {

    // Generate slug from title
    const slug = generateSlug(title || 'deck')

    // Build injected content: tracking pixel + CTA
    let injectedHtml = ''

    // 1. Always add tracking pixel for analytics
    const trackingPixel = `
<!-- Sizzle Analytics -->
<img src="https://sizzle.love/.netlify/functions/track?s=${slug}" style="position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;" alt="" />
`
    injectedHtml += trackingPixel

    // 2. Add "Create your own" CTA if remix data present (floating badge style)
    if (remixData) {
      const ctaHtml = `
<!-- Sizzle Remix CTA -->
<a href="https://sizzle.love/remix/${slug}" style="position:fixed;bottom:20px;right:20px;background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);color:#fff;text-decoration:none;font-family:system-ui,-apple-system,sans-serif;font-size:14px;font-weight:500;padding:12px 20px;border-radius:99px;display:inline-flex;align-items:center;gap:8px;box-shadow:0 4px 20px rgba(0,0,0,0.3);z-index:9999;transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
  <span style="font-size:16px;">✨</span>
  Make your own
  <span style="opacity:0.7;">→</span>
</a>
`
      injectedHtml += ctaHtml
    }

    // Inject before </body>
    let finalHtml = html.replace('</body>', `${injectedHtml}</body>`)

    // Create S3 client configured for R2
    const client = new S3Client({
      region: 'auto',
      endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY
      }
    })

    // Upload HTML file (with CTA injected if remix data present)
    const key = `${slug}.html`
    await client.send(new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: finalHtml,
      ContentType: 'text/html; charset=utf-8',
      CacheControl: 'public, max-age=31536000' // 1 year cache
    }))

    // Upload remix data JSON (for "Create your own" feature)
    if (remixData) {
      const remixKey = `${slug}-remix.json`
      await client.send(new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: remixKey,
        Body: JSON.stringify(remixData),
        ContentType: 'application/json',
        CacheControl: 'public, max-age=31536000'
      }))
    }

    // Construct public URL
    const publicUrl = R2_PUBLIC_URL
      ? `${R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`
      : `https://${R2_BUCKET_NAME}.${CLOUDFLARE_ACCOUNT_ID}.r2.dev/${key}`

    // Initialize page stats in Supabase (fire and forget)
    const supabase = getSupabase()
    if (supabase) {
      supabase
        .from('page_stats')
        .upsert({
          slug,
          user_id: userId || null,
          total_views: 0,
          created_at: new Date().toISOString()
        }, {
          onConflict: 'slug',
          ignoreDuplicates: true
        })
        .then(() => {
          console.log('Page stats initialized for:', slug)
        })
        .catch(err => {
          console.error('Failed to init page stats:', err)
        })
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: publicUrl,
        slug
      })
    }
  } catch (err) {
    console.error('Upload error:', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Failed to upload' })
    }
  }
}

/**
 * Generate URL-safe slug from title with random suffix for uniqueness
 */
function generateSlug(title) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')          // Spaces to hyphens
    .replace(/-+/g, '-')           // Collapse multiple hyphens
    .replace(/^-|-$/g, '')         // Trim hyphens
    .slice(0, 50)                  // Limit length

  // Add random suffix for uniqueness
  const suffix = Math.random().toString(36).slice(2, 8)

  return base ? `${base}-${suffix}` : suffix
}
