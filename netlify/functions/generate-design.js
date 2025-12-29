// Netlify function to generate designs using Claude API
// Environment variable required: ANTHROPIC_API_KEY

export async function handler(event) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  // Check for API key
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured' })
    }
  }

  try {
    const { colors, prompt, mood, suggestedGradient } = JSON.parse(event.body)

    // Build the prompt for Claude
    const systemPrompt = `You are an expert design system generator creating SPECTACULAR, visually striking templates. Generate CSS style definitions for a PDF template based on brand colors, style descriptions, and mood analysis.

IMPORTANT: Create BOLD, IMPACTFUL designs that truly reflect the uploaded image's atmosphere. Don't be boring!

Output ONLY valid JSON with this exact structure (no markdown, no explanation):
{
  "container": {
    "backgroundColor": "transparent",
    "color": "#hex",
    "padding": "48px",
    "fontFamily": "font-stack"
  },
  "title": {
    "fontSize": "42px",
    "fontWeight": "bold",
    "lineHeight": "1.1",
    "letterSpacing": "-0.01em",
    "color": "#hex"
  },
  "text": {
    "fontSize": "14px",
    "lineHeight": "1.6",
    "color": "#hex"
  },
  "imageGrid": {
    "gap": "12px",
    "columns": 2,
    "borderRadius": "8px"
  },
  "divider": {
    "color": "rgba(0,0,0,0.1)",
    "margin": "24px 0"
  },
  "background": {
    "type": "gradient",
    "gradient": {
      "type": "linear or radial",
      "angle": 135,
      "stops": [
        { "color": "#hex", "position": 0 },
        { "color": "#hex", "position": 50 },
        { "color": "#hex", "position": 100 }
      ]
    },
    "overlay": {
      "color": "rgba(0,0,0,0.2)"
    }
  }
}

DESIGN PRINCIPLES FOR SPECTACULAR RESULTS:

1. GRADIENT BACKGROUNDS (most important!):
   - ALWAYS use 3-4 color stops for rich, dynamic gradients
   - Use the ACTUAL brand colors in the gradient (don't dilute them!)
   - container.backgroundColor MUST be "transparent" when using gradients
   - Vibrant mood: Use "linear" with bold angle (145-160deg), saturated colors
   - Muted mood: Use "radial" for soft, ethereal feel
   - Dark mood: Deep, rich colors with 4 stops for drama
   - Light mood: Soft luminous colors, still visible gradients
   - overlay should be 0.15-0.25 opacity for readability

2. TYPOGRAPHY that MATCHES the mood:
   - Vibrant: Extra bold (800-900), large sizes (48-56px), tight letterSpacing (-0.02em)
   - Muted: Light weights (400-500), elegant letterSpacing (0.01em)
   - Dark: Bold (700), high contrast white text
   - Light: Medium weights (500-600), refined feel
   - Warm: Consider serif fonts like Georgia
   - Cool: Clean sans-serif, geometric feel

3. VISUAL HARMONY:
   - Text colors must have strong contrast against the gradient
   - For dark gradients: use white/light text
   - For light gradients: use dark text
   - imageGrid.borderRadius: vibrant = 12px (rounded), minimal = 4px (sharp)

4. DON'T BE SUBTLE - BE SPECTACULAR:
   - The gradient should be VISIBLE and IMPACTFUL
   - Colors should MATCH the brand imagery atmosphere
   - Typography should FEEL like the mood (bold for vibrant, elegant for muted)`

    // Build mood context for the prompt
    let moodContext = ''
    if (mood) {
      moodContext = `
Image mood analysis:
- Temperature: ${mood.temperature} (warm colors vs cool colors)
- Saturation: ${mood.saturation} (vibrant/colorful vs muted/subdued)
- Brightness: ${mood.brightness} (light/airy vs dark/moody)`
    }

    let gradientContext = ''
    if (suggestedGradient) {
      gradientContext = `
Suggested gradient from image analysis:
- Angle: ${suggestedGradient.angle}deg
- Colors: ${suggestedGradient.stops.map(s => s.color).join(' -> ')}
(You may refine this gradient based on the style description)`
    }

    const userPrompt = `Brand colors: ${colors.length ? colors.join(', ') : 'Not provided, use neutral colors'}

Style description: ${prompt || 'Modern, clean, professional'}
${moodContext}
${gradientContext}

Generate the CSS styles JSON with an atmospheric background that reflects the mood:`

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ],
        system: systemPrompt
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Claude API error:', errorText)
      throw new Error('Claude API request failed')
    }

    const data = await response.json()
    const content = data.content[0].text

    // Parse the JSON response
    let styles
    try {
      // Try to extract JSON from the response (in case Claude adds any text)
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        styles = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError, content)
      throw new Error('Failed to parse design styles')
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ styles })
    }
  } catch (err) {
    console.error('Function error:', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    }
  }
}
