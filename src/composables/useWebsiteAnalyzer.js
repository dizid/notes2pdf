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
   */
  function analyzeMood(colors, css) {
    const mood = {
      temperature: 'neutral',
      saturation: 'moderate',
      brightness: 'moderate',
      style: 'modern'
    }

    if (colors.length === 0) return mood

    // Analyze color temperature
    let warmCount = 0
    let coolCount = 0
    for (const color of colors) {
      const temp = getColorTemperature(color)
      if (temp === 'warm') warmCount++
      else if (temp === 'cool') coolCount++
    }
    mood.temperature = warmCount > coolCount ? 'warm' : coolCount > warmCount ? 'cool' : 'neutral'

    // Analyze saturation
    let totalSaturation = 0
    for (const color of colors) {
      totalSaturation += getColorSaturation(color)
    }
    const avgSaturation = totalSaturation / colors.length
    mood.saturation = avgSaturation > 60 ? 'vibrant' : avgSaturation < 30 ? 'muted' : 'moderate'

    // Analyze brightness
    let totalBrightness = 0
    for (const color of colors) {
      totalBrightness += getColorBrightness(color)
    }
    const avgBrightness = totalBrightness / colors.length
    mood.brightness = avgBrightness > 70 ? 'light' : avgBrightness < 40 ? 'dark' : 'moderate'

    // Analyze style from CSS patterns
    if (css) {
      if (css.includes('border-radius: 0') || css.includes('border-radius:0')) {
        mood.style = 'minimal'
      } else if (css.includes('border-radius: 50%') || css.includes('rounded-full')) {
        mood.style = 'playful'
      } else if (css.includes('serif') && !css.includes('sans-serif')) {
        mood.style = 'elegant'
      }
    }

    return mood
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
