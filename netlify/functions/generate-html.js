// Netlify function to generate beautiful HTML using Claude API
// Environment variable required: ANTHROPIC_API_KEY

import {
  safeJsonParse,
  validateContent,
  validateTokens,
  validateString,
  errorResponse
} from './lib/validate.js'
import { fetchWithRetry } from './lib/retry.js'

export async function handler(event) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return errorResponse(405, 'Method not allowed')
  }

  // Check for API key
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return errorResponse(500, 'API key not configured')
  }

  // Parse and validate request body
  const { data: body, error: parseError } = safeJsonParse(event.body)
  if (parseError) {
    return errorResponse(400, parseError)
  }

  const { content, tokens, templateStyle } = body

  // Validate content
  const contentError = validateContent(content)
  if (contentError) {
    return errorResponse(400, contentError)
  }

  // Validate tokens
  const tokensError = validateTokens(tokens)
  if (tokensError) {
    return errorResponse(400, tokensError)
  }

  // Validate templateStyle
  const styleError = validateString(templateStyle, 'templateStyle', { maxLength: 100 })
  if (styleError) {
    return errorResponse(400, styleError)
  }

  try {

    // Build the prompt for Claude
    const systemPrompt = `You are a world-class web designer. Generate a beautiful, complete HTML page.

OUTPUT REQUIREMENTS:
1. Return ONLY the complete HTML document - no explanation, no markdown
2. Start with <!DOCTYPE html> and end with </html>
3. Single self-contained file with all CSS in <style> tags
4. Use Google Fonts CDN for typography
5. Mobile responsive design
6. Include subtle animations and transitions
7. Add footer: "Created with <a href="https://sizzle.love">sizzle.love</a>"

DESIGN PRINCIPLES:
- Create visual hierarchy: large impactful title, readable body text
- Use whitespace generously for elegance
- Ensure excellent readability and contrast
- Images should have modern styling (rounded corners, shadows, hover effects)
- Gallery layouts should be responsive grid
- Use the exact colors from the design tokens provided

IMAGE PLACEHOLDERS:
- If images exist, use placeholders: src="{{IMAGE_0}}", src="{{IMAGE_1}}", etc.
- I will replace these with actual image data URLs
- Style images with object-fit: cover and consistent aspect ratios`

    // Build template style context
    let styleContext = ''
    if (templateStyle === 'bold-editorial' || tokens?.mode === 'dark') {
      styleContext = `
STYLE: Bold Editorial / Magazine
- Dark background (#111827 or similar dark color)
- White/light text with high contrast
- HUGE title (72px+) with serif font (Playfair Display or Georgia)
- Title positioned dramatically
- Images in compelling grid layout
- Minimal, high-end magazine aesthetic
- Strong visual impact`
    } else if (templateStyle === 'clean-modern') {
      styleContext = `
STYLE: Clean Modern / Professional
- Light/white background
- Dark text, clean sans-serif font (Inter or SF Pro)
- Medium title size (48px), positioned at top
- Subtle shadows and rounded corners (8px)
- Professional startup aesthetic
- Focus on content clarity`
    } else if (templateStyle === 'photo-gallery') {
      styleContext = `
STYLE: Photo Gallery / Portfolio
- Hero image at top (if images exist)
- Title overlaid on hero with gradient overlay for readability
- Body text in clean columns below
- Portfolio/magazine style
- Images are the star - give them prominence`
    } else {
      styleContext = `
STYLE: Elegant Default
- Use the mode from tokens (${tokens?.mode || 'light'}) for light/dark theme
- Create sophisticated, professional design
- Balance between content and whitespace
- Modern typography with good hierarchy`
    }

    // Build content description
    const imageCount = content.images?.length || 0
    let contentDesc = `
CONTENT TO DISPLAY:
- Title: "${content.title || 'Untitled'}"
${content.subtitle ? `- Subtitle: "${content.subtitle}"` : ''}
- Body text: ${content.text ? `"${content.text.substring(0, 500)}${content.text.length > 500 ? '...' : ''}"` : 'None'}
- Images: ${imageCount} image(s) ${imageCount > 0 ? '(use placeholders {{IMAGE_0}}, {{IMAGE_1}}, etc.)' : ''}`

    // Build design tokens context
    const tokensContext = tokens ? `
DESIGN TOKENS (use these exactly):
- Primary color: ${tokens.colors?.primary || '#1a1a1a'}
- Secondary color: ${tokens.colors?.secondary || '#666666'}
- Accent color: ${tokens.colors?.accent || '#3b82f6'}
- Background: ${tokens.colors?.background || '#ffffff'}
- Surface: ${tokens.colors?.surface || '#f8f8f8'}
- Heading font: ${tokens.typography?.headingFont || 'Georgia'}
- Body font: ${tokens.typography?.bodyFont || 'Inter'}
- Mode: ${tokens.mode || 'light'}
- Rounded corners: ${tokens.effects?.rounded || 'medium'}
- Shadows: ${tokens.effects?.shadows ? 'yes' : 'no'}
- Animations: ${tokens.effects?.animations ? 'yes' : 'no'}` : ''

    const userPrompt = `Generate a beautiful HTML page with these specifications:
${styleContext}
${contentDesc}
${tokensContext}

Remember: Output ONLY the complete HTML, starting with <!DOCTYPE html>`

    // Call Claude API with retry logic
    const response = await fetchWithRetry('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ],
        system: systemPrompt
      })
    }, { maxRetries: 2, baseDelay: 1000 })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Claude API error:', errorText)
      throw new Error('Claude API request failed')
    }

    const data = await response.json()
    let html = data.content[0].text

    // Extract HTML if Claude wrapped it in markdown code blocks
    const htmlMatch = html.match(/```html\s*([\s\S]*?)```/) || html.match(/```\s*(<!DOCTYPE[\s\S]*?<\/html>)\s*```/)
    if (htmlMatch) {
      html = htmlMatch[1].trim()
    }

    // Ensure it starts with DOCTYPE
    if (!html.startsWith('<!DOCTYPE')) {
      const doctypeIndex = html.indexOf('<!DOCTYPE')
      if (doctypeIndex !== -1) {
        html = html.substring(doctypeIndex)
      }
    }

    // Replace image placeholders with actual data URLs
    if (content.images && content.images.length > 0) {
      content.images.forEach((img, index) => {
        const placeholder = `{{IMAGE_${index}}}`
        const imageData = img.data || img.src || img.url || ''
        html = html.replace(new RegExp(placeholder, 'g'), imageData)
      })
    }

    // Add OG meta tags if not present
    if (!html.includes('og:title')) {
      const titleTag = `<meta property="og:title" content="${escapeHtml(content.title || 'Untitled')}">`
      html = html.replace('</head>', `  ${titleTag}\n</head>`)
    }

    if (content.images?.[0] && !html.includes('og:image')) {
      const firstImage = content.images[0].data || content.images[0].src || content.images[0].url
      if (firstImage && !firstImage.startsWith('data:')) {
        const imageTag = `<meta property="og:image" content="${escapeHtml(firstImage)}">`
        html = html.replace('</head>', `  ${imageTag}\n</head>`)
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ html })
    }
  } catch (err) {
    console.error('Function error:', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    }
  }
}

function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
