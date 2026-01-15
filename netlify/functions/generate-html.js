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

  const { content, tokens, templateStyle, isPro } = body

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
    const systemPrompt = `You are a world-class web designer known for creating visually stunning, polished pages. Generate a beautiful, complete HTML page.

OUTPUT REQUIREMENTS:
1. Return ONLY the complete HTML document - no explanation, no markdown
2. Start with <!DOCTYPE html> and end with </html>
3. Single self-contained file with all CSS in <style> tags
4. Use Google Fonts CDN for typography
5. Mobile responsive design
6. Include smooth animations and transitions${!isPro ? `
7. Add a subtle footer: "Created with <a href="https://sizzle.love">sizzle.love</a>"` : ''}

DESIGN PRINCIPLES (Critical for visual quality):

Typography & Hierarchy:
- Use text-wrap: balance on headings for better line breaks
- Title: Large, impactful (48-72px), with tight letter-spacing (-0.02em for bold fonts)
- Subtitle: Smaller, lighter weight, with subtle opacity (0.8)
- Body: 18-20px with generous line-height (1.6-1.7)
- Add a decorative accent line (3px colored bar) under the main title

Visual Depth & Effects:
- Use LAYERED shadows for realistic depth, not flat single shadows:
  box-shadow: 0 1px 2px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.05), 0 16px 32px rgba(0,0,0,0.08);
- Add subtle transitions on interactive elements (0.3s ease)
- Consider soft gradients for backgrounds when appropriate

Spacing & Layout:
- Use generous whitespace (48px+ between major sections)
- Padding inside cards: 40-48px
- Gallery gap: 16-20px between images

Image Treatment:
- Rounded corners matching the design style
- Subtle hover effects: scale(1.02) or translateY(-4px) with shadow change
- Use aspect-ratio for consistent sizing (4/3 or 16/9)
- Add transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)

Animations:
- Stagger fade-in animations for elements (0.1s delay between items)
- Use spring-like easing: cubic-bezier(0.16, 1, 0.3, 1)
- Animate from opacity: 0; transform: translateY(20px)

IMAGE PLACEHOLDERS:
- If images exist, use placeholders: src="{{IMAGE_0}}", src="{{IMAGE_1}}", etc.
- I will replace these with actual image data URLs
- Style images with object-fit: cover`

    // Build template style context
    let styleContext = ''
    if (templateStyle === 'bold-editorial' || tokens?.mode === 'dark') {
      styleContext = `
STYLE: Bold Editorial / Magazine
- Dark background (#111827 or deeper black)
- White/light text with HIGH contrast
- HUGE title (64-80px) with display serif font (Playfair Display, DM Serif Display)
- Very tight letter-spacing on title (-0.03em)
- Dramatic visual hierarchy - title should dominate
- Add a thin accent line (3px) under title in accent color
- Images with subtle borders or dramatic shadows
- Use dramatic layered shadows:
  box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.15), 0 24px 48px rgba(0,0,0,0.2);
- Minimal UI, maximum impact`
    } else if (templateStyle === 'clean-modern') {
      styleContext = `
STYLE: Clean Modern / Professional
- Crisp white or very light gray background (#fafafa)
- Dark text (#111827), clean geometric sans-serif (Inter, Raleway)
- Title 48-56px with medium weight (600)
- Add colored accent bar (3px) under title
- Layered soft shadows on cards:
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.06);
- Rounded corners (12px) on cards and images
- Generous padding (48px) inside content areas
- Subtle hover animations on images (scale 1.02)`
    } else if (templateStyle === 'photo-gallery') {
      styleContext = `
STYLE: Photo Gallery / Portfolio
- Full-width hero image at top with gradient overlay for text legibility
- Title overlaid on hero, large and bold with text-shadow
- Body text in elegant columns below (max-width: 680px centered)
- Images are the star - large, with hover zoom effects
- Use masonry or asymmetric grid for visual interest
- Subtle image borders or shadows
- Staggered fade-in animations for gallery items`
    } else {
      styleContext = `
STYLE: Elegant Default
- Use ${tokens?.mode || 'light'} theme
- Sophisticated, refined aesthetic
- Title with accent underline decoration
- Layered shadows for depth:
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.04), 0 16px 32px rgba(0,0,0,0.06);
- Generous whitespace (48px between sections)
- Smooth hover transitions on all interactive elements
- Typography with good contrast and hierarchy`
    }

    // Build content description
    const imageCount = content.images?.length || 0
    let contentDesc = `
CONTENT TO DISPLAY:
- Title: "${content.title || 'Untitled'}"
${content.subtitle ? `- Subtitle: "${content.subtitle}"` : ''}
- Body text: ${content.text ? `"${content.text.substring(0, 10000)}${content.text.length > 10000 ? '...' : ''}"` : 'None'}
- Images: ${imageCount} image(s) ${imageCount > 0 ? '(use placeholders {{IMAGE_0}}, {{IMAGE_1}}, etc.)' : ''}`

    // Build design tokens context
    const tokensContext = tokens ? `
DESIGN TOKENS (use these exactly):
Colors:
- Primary (text/headings): ${tokens.colors?.primary || '#1a1a1a'}
- Secondary (body text): ${tokens.colors?.secondary || '#666666'}
- Accent (links, decorations): ${tokens.colors?.accent || '#3b82f6'}
- Background: ${tokens.colors?.background || '#ffffff'}
- Surface (cards): ${tokens.colors?.surface || '#f8f8f8'}

Typography:
- Heading font: ${tokens.typography?.headingFont || 'Georgia'}
- Body font: ${tokens.typography?.bodyFont || 'Inter'}
- Heading weight: ${tokens.typography?.headingWeight || 600}
- Letter spacing: ${tokens.typography?.letterSpacing || '-0.01em'}

Visual Settings:
- Mode: ${tokens.mode || 'light'}
- Rounded corners: ${tokens.effects?.rounded || 'medium'} (none=0, subtle=4px, medium=12px, full=20px)
- Shadow style: ${tokens.effects?.shadowStyle || 'layered'} (use layered multi-shadow)
- Animations: ${tokens.effects?.animations ? 'yes - use staggered fade-ins' : 'no'}

Decorations:
- Accent line under title: ${tokens.decorations?.accentLine ? 'yes (3px colored bar)' : 'no'}
- Drop cap: ${tokens.decorations?.dropCap ? 'yes (large first letter)' : 'no'}
- Image hover effect: ${tokens.imageEffects?.hover || 'zoom'} (zoom=scale 1.02, lift=translateY -4px)` : ''

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
