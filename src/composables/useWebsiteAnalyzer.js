import { ref } from 'vue'
import {
  normalizeColor,
  normalizeHex,
  rgbToHex,
  hslToHex,
  isValidBrandColor,
  deduplicateSimilarColors
} from '../lib/colorUtils.js'
import { analyzeMood } from '../lib/moodAnalyzer.js'

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

      const colors = extractColorsFromCss(css)
      const fonts = extractFontsFromHtml(html, googleFontsUrl)
      const mood = analyzeMood(colors, css)

      analysis.value = {
        colors,
        fonts,
        mood,
        rawCss: css?.slice(0, 5000),
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
   */
  function extractColorsFromCss(css) {
    if (!css) return []

    const colors = new Map()

    const hexRegex = /#([0-9a-f]{6}|[0-9a-f]{3})\b/gi
    const rgbRegex = /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/gi

    // CSS variable definitions (highest priority)
    const cssVarRegex = /--[\w-]+:\s*(#[0-9a-f]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\))/gi
    let match
    while ((match = cssVarRegex.exec(css)) !== null) {
      const color = normalizeColor(match[1])
      if (color && isValidBrandColor(color)) {
        colors.set(color, (colors.get(color) || 0) + 10)
      }
    }

    while ((match = hexRegex.exec(css)) !== null) {
      const color = normalizeHex(match[0])
      if (color && isValidBrandColor(color)) {
        colors.set(color, (colors.get(color) || 0) + 1)
      }
    }

    while ((match = rgbRegex.exec(css)) !== null) {
      const color = rgbToHex(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]))
      if (color && isValidBrandColor(color)) {
        colors.set(color, (colors.get(color) || 0) + 1)
      }
    }

    const sortedColors = [...colors.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([color]) => color)
      .slice(0, 10)

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

    if (googleFontsUrl) {
      const fontFamilies = parseGoogleFontsUrl(googleFontsUrl)
      fonts.all = fontFamilies

      if (fontFamilies.length >= 2) {
        fonts.heading = fontFamilies[0]
        fonts.body = fontFamilies[1]
      } else if (fontFamilies.length === 1) {
        fonts.heading = fontFamilies[0]
        fonts.body = fontFamilies[0]
      }
    }

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

      for (const font of foundFonts) {
        if (!fonts.all.includes(font)) {
          fonts.all.push(font)
        }
      }

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
   * Parse Google Fonts URL to extract font families
   */
  function parseGoogleFontsUrl(url) {
    const fonts = []
    try {
      const urlObj = new URL(url)
      const familyParam = urlObj.searchParams.get('family')
      if (familyParam) {
        const families = familyParam.split('&family=')
        for (const family of families) {
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

  /**
   * Check if font is generic (not a named font)
   */
  function isGenericFont(font) {
    const generics = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'inherit', 'initial']
    return generics.includes(font.toLowerCase())
  }

  /**
   * Analyze a website using Claude Vision (screenshot-based analysis)
   * Returns richer design data than CSS parsing
   * @param {string} url - Website URL to analyze
   * @returns {Object|null} Vision analysis result or null on failure
   */
  async function analyzeWithVision(url) {
    try {
      const response = await fetch('/.netlify/functions/analyze-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })

      if (!response.ok) {
        const data = await response.json()
        console.warn('Vision analysis failed:', data.error)
        return null
      }

      const { analysis: visionAnalysis } = await response.json()

      // Map vision analysis - pass through ALL rich CSS data
      return {
        colors: [
          visionAnalysis.colors?.primary,
          visionAnalysis.colors?.secondary,
          visionAnalysis.colors?.background,
          visionAnalysis.colors?.surface,
          visionAnalysis.colors?.text,
          visionAnalysis.colors?.textMuted
        ].filter(Boolean),

        // Raw color tokens for direct CSS use
        colorTokens: visionAnalysis.colors,

        // Gradient with ready-to-use CSS
        gradient: visionAnalysis.gradient,

        // Rich typography with actual CSS values
        typography: visionAnalysis.typography,

        // Spacing values
        spacing: visionAnalysis.spacing,

        // Effects with CSS values
        effects: visionAnalysis.effects,

        // Layout
        layout: visionAnalysis.layout,

        // Mood/archetype
        mood: {
          archetype: visionAnalysis.mood?.archetype || 'modern',
          style: visionAnalysis.mood?.archetype || 'modern',
          brightness: { type: visionAnalysis.mood?.brightness || 'light', strength: 0.8 },
          keywords: [visionAnalysis.mood?.archetype || 'modern']
        },

        // Pass the entire raw analysis for direct use
        rawAnalysis: visionAnalysis,

        source: 'vision'
      }
    } catch (err) {
      console.warn('Vision analysis error:', err.message)
      return null
    }
  }

  return {
    analyzeWebsite,
    analyzeWithVision,
    isAnalyzing,
    error,
    analysis
  }
}
