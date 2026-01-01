// Netlify function to proxy remix data from R2 (avoids CORS issues)

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  const slug = event.queryStringParameters?.slug

  if (!slug) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing slug parameter' })
    }
  }

  // Validate slug format (alphanumeric, hyphens only)
  if (!/^[a-z0-9-]+$/i.test(slug)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid slug format' })
    }
  }

  const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://pub-5e67290c6f034c6e862ab06edffab0d8.r2.dev'

  try {
    const remixUrl = `${R2_PUBLIC_URL}/${slug}-remix.json`
    const response = await fetch(remixUrl)

    if (!response.ok) {
      if (response.status === 404) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Remix data not found' })
        }
      }
      throw new Error(`R2 fetch failed: ${response.status}`)
    }

    const remixData = await response.json()

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      },
      body: JSON.stringify(remixData)
    }
  } catch (err) {
    console.error('Get remix error:', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch remix data' })
    }
  }
}
