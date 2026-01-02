// Netlify function to analyze website design using Claude Vision
// Takes a screenshot via ApiFlash, then uses Claude to extract design characteristics

import Anthropic from '@anthropic-ai/sdk'

const DESIGN_ANALYSIS_PROMPT = `You are a CSS expert. Analyze this website screenshot and extract PRECISE, DIRECTLY-USABLE design values.

Return ONLY valid JSON (no markdown, no code blocks):
{
  "colors": {
    "background": "#hex (page background - sample the EXACT color)",
    "surface": "#hex (card/section bg, or same as background)",
    "text": "#hex (main text color)",
    "textMuted": "#hex (secondary/gray text)",
    "primary": "#hex (brand/accent - buttons, links)",
    "secondary": "#hex (secondary accent)",
    "border": "#hex (border/divider color)"
  },
  "gradient": {
    "detected": true/false,
    "type": "linear|radial",
    "angle": 135,
    "colors": ["#start", "#end"],
    "css": "linear-gradient(135deg, #start 0%, #end 100%)"
  },
  "typography": {
    "headingFont": "Inter|Poppins|Playfair Display|system-ui|Georgia|etc",
    "bodyFont": "Inter|system-ui|Georgia|etc",
    "headingSize": "48px|56px|64px|etc",
    "headingWeight": "400|500|600|700|800|900",
    "headingLineHeight": "1.1|1.2|1.3",
    "headingLetterSpacing": "-0.02em|0|0.02em",
    "bodySize": "16px|18px",
    "bodyLineHeight": "1.5|1.6|1.7"
  },
  "spacing": {
    "containerPadding": "24px|32px|48px|64px|80px",
    "sectionGap": "48px|64px|80px|120px",
    "elementGap": "16px|24px|32px"
  },
  "effects": {
    "borderRadius": "0|4px|8px|12px|16px|24px|9999px",
    "shadow": "none|0 1px 2px rgba(0,0,0,0.05)|0 4px 6px rgba(0,0,0,0.1)|0 10px 25px rgba(0,0,0,0.15)",
    "buttonStyle": "solid|outline|ghost",
    "cardStyle": "flat|elevated|bordered"
  },
  "layout": {
    "maxWidth": "640px|768px|960px|1200px|1400px|full",
    "alignment": "left|center",
    "density": "compact|normal|spacious"
  },
  "mood": {
    "archetype": "minimal|bold|elegant|playful|tech|corporate",
    "brightness": "light|dark"
  }
}

CRITICAL INSTRUCTIONS:
1. SAMPLE EXACT HEX VALUES from the screenshot - don't guess or use defaults
2. For typography, estimate the closest common font based on visual appearance
3. For sizes/spacing, give actual pixel values you observe
4. background = the main page background (white pages = #ffffff or close)
5. If the design is light/white, background should be #ffffff or near-white
6. If dark mode, background should be the actual dark color (#0a0a0a, #1a1a1a, etc)
7. The shadow value should be a complete CSS box-shadow string
8. Be specific with border-radius - give exact pixel values`

export async function handler(event) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  const apiflashKey = process.env.APIFLASH_ACCESS_KEY
  const anthropicKey = process.env.ANTHROPIC_API_KEY

  if (!apiflashKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'ApiFlash API key not configured' })
    }
  }

  if (!anthropicKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Anthropic API key not configured' })
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

    // Step 1: Get screenshot from ApiFlash
    const screenshotParams = new URLSearchParams({
      access_key: apiflashKey,
      url: parsedUrl.href,
      width: '1280',
      height: '800',
      format: 'jpeg',
      quality: '80',
      fresh: 'true', // Don't use cached screenshots
      delay: '2' // Wait 2 seconds for page to load
    })

    const screenshotUrl = `https://api.apiflash.com/v1/urltoimage?${screenshotParams}`

    const screenshotResponse = await fetch(screenshotUrl)
    if (!screenshotResponse.ok) {
      const errorText = await screenshotResponse.text()
      console.error('ApiFlash error:', screenshotResponse.status, errorText)
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to capture screenshot' })
      }
    }

    const imageBuffer = await screenshotResponse.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')

    // Step 2: Send to Claude Vision for analysis
    const anthropic = new Anthropic({ apiKey: anthropicKey })

    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-latest',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: base64Image
            }
          },
          {
            type: 'text',
            text: DESIGN_ANALYSIS_PROMPT
          }
        ]
      }]
    })

    // Parse Claude's response
    const responseText = message.content[0].text.trim()

    // Try to extract JSON from response (handle potential markdown code blocks)
    let jsonText = responseText
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim()
    }

    let analysis
    try {
      analysis = JSON.parse(jsonText)
    } catch (parseErr) {
      console.error('Failed to parse Claude response:', responseText)
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to parse design analysis' })
      }
    }

    // Validate required fields
    if (!analysis.colors || !analysis.mood) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Incomplete design analysis' })
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        analysis,
        source: 'vision',
        screenshotUrl: parsedUrl.href
      })
    }

  } catch (err) {
    console.error('Analyze design error:', err.name, err.message, err.stack)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message || 'Failed to analyze design' })
    }
  }
}
