import { ref } from 'vue'

/**
 * Composable for analyzing websites to extract design tokens
 * Extracts colors, fonts, and design characteristics from a URL
 */
export function useWebsiteAnalyzer() {
  const isAnalyzing = ref(false)
  const error = ref(null)
  const analysis = ref(null)

  /**
   * Analyze a website URL and extract design tokens
   * @param {string} url - Website URL to analyze
   * @returns {Object} Analysis result with colors, fonts, mood
   */
  async function analyzeWebsite(url) {
    isAnalyzing.value = true
    error.value = null
    analysis.value = null

    try {
      // Fetch website content via CORS proxy
      const response = await fetch('/.netlify/functions/fetch-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to fetch website')
      }

      const { html, css, googleFontsUrl } = await response.json()

      // Extract design elements
      const colors = extractColorsFromCss(css)
      const fonts = extractFontsFromHtml(html, googleFontsUrl)
      const mood = analyzeMood(colors, css)

      analysis.value = {
        colors,
        fonts,
        mood,
        rawCss: css?.slice(0, 5000), // Keep a sample for debugging
        googleFontsUrl
      }

      return analysis.value
    } catch (err) {
      error.value = err.message
      return null
    } finally {
      isAnalyzing.value = false
    }
  }

  /**
   * Extract colors from CSS content
   * Looks for CSS variables, color properties, and background colors
   */
  function extractColorsFromCss(css) {
    if (!css) return []

    const colors = new Map() // Use Map to track frequency

    // CSS color regex patterns
    const hexRegex = /#([0-9a-f]{6}|[0-9a-f]{3})\b/gi
    const rgbRegex = /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/gi
    const hslRegex = /hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%/gi

    // Extract CSS variable definitions (highest priority)
    const cssVarRegex = /--[\w-]+:\s*(#[0-9a-f]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\))/gi
    let match
    while ((match = cssVarRegex.exec(css)) !== null) {
      const color = normalizeColor(match[1])
      if (color && isValidBrandColor(color)) {
        colors.set(color, (colors.get(color) || 0) + 10) // Higher weight for CSS vars
      }
    }

    // Extract hex colors
    while ((match = hexRegex.exec(css)) !== null) {
      const color = normalizeHex(match[0])
      if (color && isValidBrandColor(color)) {
        colors.set(color, (colors.get(color) || 0) + 1)
      }
    }

    // Extract rgb colors
    while ((match = rgbRegex.exec(css)) !== null) {
      const color = rgbToHex(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]))
      if (color && isValidBrandColor(color)) {
        colors.set(color, (colors.get(color) || 0) + 1)
      }
    }

    // Sort by frequency and return top colors
    const sortedColors = [...colors.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([color]) => color)
      .slice(0, 10)

    // Deduplicate similar colors
    return deduplicateSimilarColors(sortedColors).slice(0, 6)
  }

  /**
   * Extract fonts from HTML (Google Fonts links, font-family declarations)
   */
  function extractFontsFromHtml(html, googleFontsUrl) {
    const fonts = {
      heading: null,
      body: null,
      all: []
    }

    // Parse Google Fonts URL
    if (googleFontsUrl) {
      const fontFamilies = parseGoogleFontsUrl(googleFontsUrl)
      fonts.all = fontFamilies

      // Assume first font is heading, second is body
      if (fontFamilies.length >= 2) {
        fonts.heading = fontFamilies[0]
        fonts.body = fontFamilies[1]
      } else if (fontFamilies.length === 1) {
        fonts.heading = fontFamilies[0]
        fonts.body = fontFamilies[0]
      }
    }

    // Also look for font-family in inline styles
    if (html) {
      const fontFamilyRegex = /font-family:\s*['"]?([^'";,]+)/gi
      let match
      const foundFonts = new Set()
      while ((match = fontFamilyRegex.exec(html)) !== null) {
        const font = match[1].trim()
        if (font && !isGenericFont(font)) {
          foundFonts.add(font)
        }
      }

      // Add to all fonts if not already present
      for (const font of foundFonts) {
        if (!fonts.all.includes(font)) {
          fonts.all.push(font)
        }
      }

      // Set heading/body if not already set from Google Fonts
      const fontArray = [...foundFonts]
      if (!fonts.heading && fontArray.length > 0) {
        fonts.heading = fontArray[0]
      }
      if (!fonts.body && fontArray.length > 1) {
        fonts.body = fontArray[1]
      } else if (!fonts.body && fonts.heading) {
        fonts.body = fonts.heading
      }
    }

    return fonts
  }

  /**
   * Analyze mood/aesthetic from colors and CSS patterns
   * Returns enhanced mood object with strength values and emotional keywords
   */
  function analyzeMood(colors, css) {
    const mood = {
      // Core dimensions with strength (0-1)
      temperature: { type: 'neutral', strength: 0.5 },
      saturation: { type: 'moderate', strength: 0.5 },
      brightness: { type: 'balanced', strength: 0.5 },

      // New dimensions
      energy: { type: 'balanced', strength: 0.5 },
      formality: { type: 'neutral', strength: 0.5 },

      // Style archetype
      archetype: 'modern',

      // Emotional keywords for AI prompt enrichment
      keywords: [],

      // Legacy flat values for backward compatibility
      style: 'modern'
    }

    if (colors.length === 0) return mood

    // Analyze color temperature with strength
    let warmScore = 0
    let coolScore = 0
    for (const color of colors) {
      const temp = getColorTemperatureScore(color)
      warmScore += temp.warm
      coolScore += temp.cool
    }
    const tempDiff = Math.abs(warmScore - coolScore) / colors.length
    if (warmScore > coolScore) {
      mood.temperature = { type: 'warm', strength: Math.min(1, tempDiff / 50) }
    } else if (coolScore > warmScore) {
      mood.temperature = { type: 'cool', strength: Math.min(1, tempDiff / 50) }
    } else {
      mood.temperature = { type: 'neutral', strength: 0.5 }
    }

    // Analyze saturation with strength
    let totalSaturation = 0
    for (const color of colors) {
      totalSaturation += getColorSaturation(color)
    }
    const avgSaturation = totalSaturation / colors.length
    if (avgSaturation > 60) {
      mood.saturation = { type: 'vibrant', strength: Math.min(1, avgSaturation / 100) }
    } else if (avgSaturation < 30) {
      mood.saturation = { type: 'muted', strength: Math.min(1, (50 - avgSaturation) / 50) }
    } else {
      mood.saturation = { type: 'moderate', strength: 0.5 }
    }

    // Analyze brightness with strength
    let totalBrightness = 0
    for (const color of colors) {
      totalBrightness += getColorBrightness(color)
    }
    const avgBrightness = totalBrightness / colors.length
    if (avgBrightness > 70) {
      mood.brightness = { type: 'light', strength: Math.min(1, avgBrightness / 100) }
    } else if (avgBrightness < 40) {
      mood.brightness = { type: 'dark', strength: Math.min(1, (60 - avgBrightness) / 60) }
    } else {
      mood.brightness = { type: 'balanced', strength: 0.5 }
    }

    // Analyze energy from CSS patterns
    mood.energy = analyzeEnergy(css, colors)

    // Analyze formality from CSS and fonts
    mood.formality = analyzeFormality(css)

    // Detect style archetype
    mood.archetype = detectArchetype(css, colors, mood)

    // Generate emotional keywords
    mood.keywords = generateKeywords(mood)

    // Set legacy style value for backward compatibility
    mood.style = mood.archetype

    return mood
  }

  /**
   * Analyze energy level from CSS patterns
   */
  function analyzeEnergy(css, colors) {
    if (!css) return { type: 'balanced', strength: 0.5 }

    let energyScore = 50 // Start neutral

    // Animation presence increases energy
    if (css.includes('animation') || css.includes('@keyframes')) {
      energyScore += 20
    }
    if (css.includes('transition')) {
      energyScore += 10
    }

    // Gradient complexity increases energy
    const gradientMatches = css.match(/linear-gradient|radial-gradient/gi) || []
    energyScore += Math.min(15, gradientMatches.length * 3)

    // High color contrast increases energy
    if (colors.length >= 2) {
      const contrast = colorDistance(colors[0], colors[1])
      if (contrast > 150) energyScore += 15
      else if (contrast > 100) energyScore += 8
    }

    // Transform/scale effects increase energy
    if (css.includes('transform') || css.includes('scale')) {
      energyScore += 10
    }

    // Heavy shadows can increase energy
    if (css.includes('box-shadow') && css.includes('rgba(0')) {
      energyScore += 5
    }

    // Determine type and strength
    if (energyScore >= 70) {
      return { type: 'energetic', strength: Math.min(1, energyScore / 100) }
    } else if (energyScore <= 35) {
      return { type: 'calm', strength: Math.min(1, (50 - energyScore) / 50) }
    }
    return { type: 'balanced', strength: 0.5 }
  }

  /**
   * Analyze formality from CSS patterns and typography hints
   */
  function analyzeFormality(css) {
    if (!css) return { type: 'neutral', strength: 0.5 }

    let formalityScore = 50 // Start neutral

    // Serif fonts = more formal
    if (css.includes('serif') && !css.includes('sans-serif')) {
      formalityScore += 25
    }
    // Sans-serif only = less formal
    if (css.includes('sans-serif') && !css.includes('serif')) {
      formalityScore -= 10
    }

    // Rounded corners = less formal
    if (css.includes('rounded-full') || css.includes('border-radius: 50%') || css.includes('border-radius: 9999')) {
      formalityScore -= 20
    }
    // Sharp corners = more formal
    if (css.includes('border-radius: 0') || css.includes('border-radius:0')) {
      formalityScore += 15
    }

    // Tight letter-spacing = more formal
    if (css.includes('letter-spacing') && css.includes('-0.0')) {
      formalityScore += 10
    }

    // Large spacing/padding = more formal/elegant
    const paddingMatches = css.match(/padding:\s*(\d+)px/gi) || []
    for (const match of paddingMatches) {
      const value = parseInt(match.match(/\d+/)?.[0] || '0')
      if (value >= 40) formalityScore += 5
    }

    // Playful colors (bright, saturated) = less formal
    if (css.includes('#ff') || css.includes('#00ff') || css.includes('hsl(')) {
      formalityScore -= 5
    }

    if (formalityScore >= 65) {
      return { type: 'formal', strength: Math.min(1, formalityScore / 100) }
    } else if (formalityScore <= 35) {
      return { type: 'casual', strength: Math.min(1, (50 - formalityScore) / 50) }
    }
    return { type: 'neutral', strength: 0.5 }
  }

  /**
   * Detect overall style archetype from patterns
   */
  function detectArchetype(css, colors, mood) {
    if (!css) return 'modern'

    const scores = {
      minimal: 0,
      bold: 0,
      elegant: 0,
      playful: 0,
      tech: 0,
      organic: 0,
      luxury: 0,
      friendly: 0
    }

    // MINIMAL indicators
    if (css.includes('border-radius: 0') || css.includes('border-radius:0')) scores.minimal += 2
    if (mood.saturation.type === 'muted') scores.minimal += 2
    if (mood.energy.type === 'calm') scores.minimal += 1
    if (!css.includes('gradient')) scores.minimal += 1
    if (!css.includes('box-shadow') || css.includes('shadow-none')) scores.minimal += 1

    // BOLD indicators
    if (mood.saturation.type === 'vibrant') scores.bold += 2
    if (mood.energy.type === 'energetic') scores.bold += 2
    if (css.includes('font-weight: 700') || css.includes('font-weight: 800') || css.includes('font-weight: 900')) scores.bold += 2
    if (css.includes('text-transform: uppercase')) scores.bold += 1
    if (colors.length >= 2 && colorDistance(colors[0], colors[1]) > 150) scores.bold += 1

    // ELEGANT indicators
    if (css.includes('serif') && !css.includes('sans-serif')) scores.elegant += 3
    if (mood.formality.type === 'formal') scores.elegant += 2
    if (css.includes('letter-spacing') && css.includes('0.0')) scores.elegant += 1
    if (mood.saturation.type === 'muted') scores.elegant += 1

    // PLAYFUL indicators
    if (css.includes('rounded-full') || css.includes('border-radius: 50%') || css.includes('border-radius: 9999')) scores.playful += 3
    if (mood.saturation.type === 'vibrant') scores.playful += 1
    if (mood.formality.type === 'casual') scores.playful += 2
    if (mood.temperature.type === 'warm') scores.playful += 1

    // TECH indicators
    if (css.includes('monospace') || css.includes('SF Mono') || css.includes('Consolas')) scores.tech += 3
    if (css.includes('grid') || css.includes('flex')) scores.tech += 1
    if (mood.temperature.type === 'cool') scores.tech += 1
    if (css.includes('rgb(') && css.includes('0,')) scores.tech += 1

    // ORGANIC indicators
    if (css.includes('border-radius') && !css.includes('border-radius: 0')) scores.organic += 1
    if (mood.temperature.type === 'warm') scores.organic += 1
    if (css.includes('gradient') && css.includes('radial')) scores.organic += 1

    // LUXURY indicators
    if (mood.brightness.type === 'dark') scores.luxury += 2
    if (mood.saturation.type === 'muted') scores.luxury += 1
    if (mood.formality.type === 'formal') scores.luxury += 2
    if (css.includes('gold') || css.includes('#d4af37') || css.includes('#c9a227')) scores.luxury += 3

    // FRIENDLY indicators
    if (scores.playful > 0) scores.friendly += 1
    if (mood.temperature.type === 'warm') scores.friendly += 2
    if (mood.brightness.type === 'light') scores.friendly += 1
    if (css.includes('Nunito') || css.includes('Poppins') || css.includes('rounded')) scores.friendly += 2

    // Find highest scoring archetype
    let maxScore = 0
    let archetype = 'modern'
    for (const [type, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score
        archetype = type
      }
    }

    return archetype
  }

  /**
   * Generate emotional keywords based on mood analysis
   */
  function generateKeywords(mood) {
    const keywords = []

    // Temperature keywords
    if (mood.temperature.type === 'warm') {
      keywords.push('inviting', 'cozy')
      if (mood.temperature.strength > 0.7) keywords.push('passionate')
    } else if (mood.temperature.type === 'cool') {
      keywords.push('calm', 'professional')
      if (mood.temperature.strength > 0.7) keywords.push('serene')
    }

    // Saturation keywords
    if (mood.saturation.type === 'vibrant') {
      keywords.push('dynamic', 'bold')
      if (mood.saturation.strength > 0.7) keywords.push('striking')
    } else if (mood.saturation.type === 'muted') {
      keywords.push('subtle', 'refined')
      if (mood.saturation.strength > 0.7) keywords.push('understated')
    }

    // Energy keywords
    if (mood.energy.type === 'energetic') {
      keywords.push('lively', 'exciting')
    } else if (mood.energy.type === 'calm') {
      keywords.push('peaceful', 'relaxed')
    }

    // Formality keywords
    if (mood.formality.type === 'formal') {
      keywords.push('sophisticated', 'polished')
    } else if (mood.formality.type === 'casual') {
      keywords.push('friendly', 'approachable')
    }

    // Archetype-specific keywords
    const archetypeKeywords = {
      minimal: ['clean', 'simple', 'focused'],
      bold: ['impactful', 'confident', 'strong'],
      elegant: ['luxurious', 'refined', 'timeless'],
      playful: ['fun', 'creative', 'joyful'],
      tech: ['innovative', 'modern', 'precise'],
      organic: ['natural', 'flowing', 'authentic'],
      luxury: ['premium', 'exclusive', 'opulent'],
      friendly: ['warm', 'welcoming', 'trustworthy']
    }

    if (archetypeKeywords[mood.archetype]) {
      keywords.push(...archetypeKeywords[mood.archetype])
    }

    // Deduplicate and limit
    return [...new Set(keywords)].slice(0, 8)
  }

  /**
   * Get color temperature score (returns warm and cool scores)
   */
  function getColorTemperatureScore(hex) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)

    // Warm colors have higher red, cool colors have higher blue
    const warm = Math.max(0, r - b) + Math.max(0, (r + g) / 2 - b) / 2
    const cool = Math.max(0, b - r) + Math.max(0, (b + g) / 2 - r) / 2

    return { warm, cool }
  }

  // =========================================
  // Helper functions
  // =========================================

  function normalizeColor(color) {
    if (!color) return null
    color = color.trim().toLowerCase()

    if (color.startsWith('#')) {
      return normalizeHex(color)
    }
    if (color.startsWith('rgb')) {
      const match = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
      if (match) {
        return rgbToHex(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]))
      }
    }
    if (color.startsWith('hsl')) {
      const match = color.match(/hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%/)
      if (match) {
        return hslToHex(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]))
      }
    }
    return null
  }

  function normalizeHex(hex) {
    if (!hex) return null
    hex = hex.toLowerCase()
    // Convert 3-digit to 6-digit
    if (hex.length === 4) {
      return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
    }
    if (hex.length === 7) {
      return hex
    }
    return null
  }

  function rgbToHex(r, g, b) {
    if ([r, g, b].some(v => v < 0 || v > 255)) return null
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
  }

  function hslToHex(h, s, l) {
    s /= 100
    l /= 100
    const a = s * Math.min(l, 1 - l)
    const f = n => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color).toString(16).padStart(2, '0')
    }
    return `#${f(0)}${f(8)}${f(4)}`
  }

  function isValidBrandColor(hex) {
    if (!hex || hex.length !== 7) return false

    // Skip pure black, white, and near-grays
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)

    // Skip if too close to black or white
    const brightness = (r + g + b) / 3
    if (brightness < 15 || brightness > 245) return false

    // Skip near-grays (low saturation)
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const saturation = max === 0 ? 0 : (max - min) / max * 100
    if (saturation < 5 && brightness > 20 && brightness < 235) return false

    return true
  }

  function deduplicateSimilarColors(colors) {
    const result = []
    for (const color of colors) {
      const isSimilar = result.some(existing => colorDistance(existing, color) < 30)
      if (!isSimilar) {
        result.push(color)
      }
    }
    return result
  }

  function colorDistance(hex1, hex2) {
    const r1 = parseInt(hex1.slice(1, 3), 16)
    const g1 = parseInt(hex1.slice(3, 5), 16)
    const b1 = parseInt(hex1.slice(5, 7), 16)
    const r2 = parseInt(hex2.slice(1, 3), 16)
    const g2 = parseInt(hex2.slice(3, 5), 16)
    const b2 = parseInt(hex2.slice(5, 7), 16)
    return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2)
  }

  function getColorTemperature(hex) {
    const r = parseInt(hex.slice(1, 3), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    if (r > b + 30) return 'warm'
    if (b > r + 30) return 'cool'
    return 'neutral'
  }

  function getColorSaturation(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    return max === 0 ? 0 : ((max - min) / max) * 100
  }

  function getColorBrightness(hex) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    // Using perceived brightness formula
    return (r * 299 + g * 587 + b * 114) / 1000 / 2.55
  }

  function parseGoogleFontsUrl(url) {
    const fonts = []
    try {
      const urlObj = new URL(url)
      const familyParam = urlObj.searchParams.get('family')
      if (familyParam) {
        // Handle both old and new Google Fonts URL formats
        // New format: family=Playfair+Display:wght@400;700&family=Inter
        // Old format: family=Playfair+Display|Inter
        const families = familyParam.split('&family=')
        for (const family of families) {
          // Extract font name (before : or |)
          const fontName = family.split(':')[0].split('|')[0].replace(/\+/g, ' ').trim()
          if (fontName) {
            fonts.push(fontName)
          }
        }
      }
    } catch {
      // Invalid URL
    }
    return fonts
  }

  function isGenericFont(font) {
    const generics = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'inherit', 'initial']
    return generics.includes(font.toLowerCase())
  }

  return {
    analyzeWebsite,
    isAnalyzing,
    error,
    analysis
  }
}
