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

    // Build rich narrative mood context for the prompt
    let moodContext = ''
    if (mood) {
      // Handle both old format (strings) and new format (objects with type/strength)
      const getType = (val) => typeof val === 'object' ? val.type : val
      const getStrength = (val) => typeof val === 'object' ? val.strength : 0.5

      const temperature = getType(mood.temperature) || 'neutral'
      const saturation = getType(mood.saturation) || 'moderate'
      const brightness = getType(mood.brightness) || 'balanced'
      const energy = getType(mood.energy) || 'balanced'
      const formality = getType(mood.formality) || 'neutral'
      const archetype = mood.archetype || 'modern'
      const keywords = mood.keywords || []

      // Build strength descriptors
      const tempStrength = getStrength(mood.temperature)
      const satStrength = getStrength(mood.saturation)
      const energyStrength = getStrength(mood.energy)

      const tempDesc = tempStrength > 0.7 ? 'VERY ' : tempStrength > 0.5 ? '' : 'slightly '
      const satDesc = satStrength > 0.7 ? 'HIGHLY ' : satStrength > 0.5 ? '' : 'subtly '
      const energyDesc = energyStrength > 0.7 ? 'VERY ' : energyStrength > 0.5 ? '' : 'gently '

      moodContext = `
═══════════════════════════════════════════════════
BRAND PERSONALITY ANALYSIS
═══════════════════════════════════════════════════

This brand has a ${tempDesc}${temperature.toUpperCase()}, ${satDesc}${saturation.toUpperCase()}, ${brightness.toUpperCase()} mood
with ${energyDesc}${energy.toUpperCase()} energy and ${formality.toUpperCase()} formality.

DETECTED ARCHETYPE: ${archetype.toUpperCase()}
${keywords.length > 0 ? `\nEmotional keywords: ${keywords.join(', ')}` : ''}

═══════════════════════════════════════════════════
DESIGN DIRECTION
═══════════════════════════════════════════════════

Create a design that feels genuinely ${archetype.toUpperCase()}:
${archetype === 'minimal' ? '- Use restrained colors, subtle typography, generous whitespace\n- Avoid gradients or make them very subtle\n- Focus on typography and spacing over decoration' : ''}
${archetype === 'bold' ? '- Use saturated colors, heavy typography weights (700-900)\n- High contrast, impactful gradients with strong angles\n- Make it feel confident and attention-grabbing' : ''}
${archetype === 'elegant' ? '- Use refined, muted colors with sophisticated gradients\n- Light to medium weights, generous letter-spacing\n- Serif or refined sans-serif typography' : ''}
${archetype === 'playful' ? '- Use vibrant, saturated colors and fun gradients\n- Rounded corners, friendly typography\n- Make it feel approachable and joyful' : ''}
${archetype === 'tech' ? '- Use cool colors, precise geometric feel\n- Modern sans-serif, tight letter-spacing\n- Clean gradients with subtle blue/purple tones' : ''}
${archetype === 'luxury' ? '- Use deep, rich colors, often dark mode\n- Refined typography, generous spacing\n- Subtle gold/cream accents if appropriate' : ''}
${archetype === 'friendly' ? '- Use warm, welcoming colors\n- Rounded elements, approachable typography\n- Light, airy feel with soft shadows' : ''}
${archetype === 'organic' ? '- Use natural, earthy tones\n- Flowing gradients, soft edges\n- Typography that feels authentic, not corporate' : ''}
${archetype === 'modern' ? '- Use contemporary color combinations\n- Clean typography, balanced spacing\n- Sophisticated but not stuffy' : ''}

DO NOT make it feel: ${archetype === 'playful' ? 'corporate, sterile, minimalist' : archetype === 'minimal' ? 'flashy, busy, overwhelming' : archetype === 'luxury' ? 'cheap, casual, playful' : archetype === 'bold' ? 'subtle, muted, boring' : 'generic, bland, forgettable'}
DO make it feel: ${keywords.slice(0, 3).join(', ') || 'distinctive, memorable, on-brand'}`
    }

    let gradientContext = ''
    if (suggestedGradient) {
      const stopColors = suggestedGradient.stops.map(s => typeof s === 'object' ? s.color : s).join(' → ')
      gradientContext = `
Suggested gradient from brand analysis:
- Angle: ${suggestedGradient.angle}deg
- Colors: ${stopColors}
(Refine this gradient to match the archetype - make it subtle for minimal, bold for playful, etc.)`
    }

    const userPrompt = `Brand colors: ${colors.length ? colors.join(', ') : 'Not provided, use neutral colors'}

Style description: ${prompt || 'Modern, clean, professional'}
${moodContext}
${gradientContext}

Generate the CSS styles JSON that TRULY EMBODIES this brand personality:`

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
