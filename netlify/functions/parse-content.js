// Netlify function to parse unstructured notes into structured content using Claude API
// Environment variable required: ANTHROPIC_API_KEY

import {
  safeJsonParse,
  validateString,
  errorResponse,
  successResponse
} from './lib/validate.js'
import { fetchWithRetry } from './lib/retry.js'

// Valid archetypes for suggestion
const VALID_ARCHETYPES = ['minimal', 'bold', 'elegant', 'playful', 'tech', 'modern', 'friendly', 'luxury', 'organic']

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

  const { rawText } = body

  // Validate rawText
  const textError = validateString(rawText, 'rawText', {
    required: true,
    minLength: 20,
    maxLength: 50000
  })
  if (textError) {
    return errorResponse(400, textError)
  }

  try {
    // Build the prompt for Claude
    const systemPrompt = `You are an expert content editor. Your job is to take messy, unstructured notes and extract a clean, well-organized structure.

ANALYZE the text and extract:
1. A compelling TITLE (the main topic or headline, max 10 words)
2. An optional SUBTITLE (supporting context or tagline, only if it adds value)
3. A clean BODY (the main content, organized into clear paragraphs)
4. KEY HIGHLIGHTS (2-4 important takeaways, only if the content has clear key points)
5. A SUGGESTED ARCHETYPE based on the tone and content

ARCHETYPES (choose the most fitting):
- minimal: Clean, simple, focused content
- bold: Dramatic, impactful, high-energy
- elegant: Sophisticated, refined, premium
- playful: Fun, creative, approachable
- tech: Modern, innovative, technical
- modern: Contemporary, versatile, professional
- friendly: Warm, welcoming, conversational
- luxury: Premium, exclusive, high-end
- organic: Natural, flowing, authentic

RESPONSE FORMAT (JSON only, no explanation):
{
  "title": "Your Compelling Title Here",
  "subtitle": "Optional supporting line" or null,
  "body": "Clean, organized paragraphs...",
  "highlights": ["Key point 1", "Key point 2"] or null,
  "suggestedArchetype": "modern",
  "confidence": 0.85
}

RULES:
- Extract the essence, don't just copy-paste
- Make the title punchy and memorable
- Clean up grammar and flow in the body
- Only include highlights if there are clear key takeaways
- Confidence should reflect how well the content fits your structure (0-1)`

    const response = await fetchWithRetry('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: `Parse and structure these notes:\n\n${rawText}`
        }]
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Claude API error:', errorData)
      return errorResponse(500, 'Failed to parse content')
    }

    const data = await response.json()

    // Extract the text content from Claude's response
    const textContent = data.content?.[0]?.text
    if (!textContent) {
      return errorResponse(500, 'No response from AI')
    }

    // Parse the JSON response from Claude
    let parsed
    try {
      // Handle potential markdown code block wrapping
      let jsonStr = textContent.trim()
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
      }
      parsed = JSON.parse(jsonStr)
    } catch {
      console.error('Failed to parse Claude response:', textContent)
      return errorResponse(500, 'Failed to parse AI response')
    }

    // Validate and sanitize the parsed response
    const result = {
      title: typeof parsed.title === 'string' ? parsed.title.slice(0, 200) : 'Untitled',
      subtitle: typeof parsed.subtitle === 'string' ? parsed.subtitle.slice(0, 300) : null,
      body: typeof parsed.body === 'string' ? parsed.body.slice(0, 50000) : '',
      highlights: Array.isArray(parsed.highlights)
        ? parsed.highlights.filter(h => typeof h === 'string').slice(0, 5)
        : null,
      suggestedArchetype: VALID_ARCHETYPES.includes(parsed.suggestedArchetype)
        ? parsed.suggestedArchetype
        : 'modern',
      confidence: typeof parsed.confidence === 'number'
        ? Math.min(1, Math.max(0, parsed.confidence))
        : 0.7
    }

    return successResponse(result)

  } catch (err) {
    console.error('Parse content error:', err)
    return errorResponse(500, 'An error occurred while parsing content')
  }
}
