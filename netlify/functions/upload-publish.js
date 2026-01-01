// Netlify function to upload HTML to Cloudflare R2 for sharing
// Environment variables required:
//   CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME,
//   CLOUDFLARE_ACCOUNT_ID, R2_PUBLIC_URL

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
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
    return {
      statusCode: 503,
      body: JSON.stringify({
        error: 'Cloud publishing is not configured',
        code: 'R2_NOT_CONFIGURED'
      })
    }
  }

  try {
    const { html, title } = JSON.parse(event.body)

    if (!html) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'HTML content is required' })
      }
    }

    // Generate slug from title
    const slug = generateSlug(title || 'deck')

    // Create S3 client configured for R2
    const client = new S3Client({
      region: 'auto',
      endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY
      }
    })

    // Upload HTML file
    const key = `${slug}.html`
    await client.send(new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: html,
      ContentType: 'text/html; charset=utf-8',
      CacheControl: 'public, max-age=31536000' // 1 year cache
    }))

    // Construct public URL
    const publicUrl = R2_PUBLIC_URL
      ? `${R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`
      : `https://${R2_BUCKET_NAME}.${CLOUDFLARE_ACCOUNT_ID}.r2.dev/${key}`

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
