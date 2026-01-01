import { ref } from 'vue'
import { isLightColor, adjustBrightness, hexToRgb } from '../lib/colorUtils.js'
import {
  FONT_PAIRS,
  DENSITY_PRESETS,
  getFontPair,
  getArchetypePreset,
  getGoogleFontsUrl,
  tokensToCssVars
} from '../lib/designPresets.js'

// Re-export for backward compatibility
export { FONT_PAIRS, isLightColor }
export const isDarkColor = (hex) => !isLightColor(hex)

const isGenerating = ref(false)
const error = ref(null)

export function useDesignGenerator() {
  /**
   * Generate design tokens from colors and mood
   */
  async function generateDesignTokens({ colors, prompt, mood, suggestedGradient, fontPairId, density = 'normal' }) {
    isGenerating.value = true
    error.value = null

    try {
      return generateLocalTokens({ colors, prompt, mood, suggestedGradient, fontPairId, density })
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isGenerating.value = false
    }
  }

  /**
   * Generate design tokens locally
   */
  function generateLocalTokens({ colors, prompt, mood, suggestedGradient, fontPairId, density = 'normal' }) {
    const primaryColor = colors?.[0] || '#1a1a1a'
    const secondaryColor = colors?.[1] || '#666666'
    const accentColor = colors?.[2] || '#e63946'

    // Detect archetype from prompt or mood
    const archetype = detectArchetypeFromPrompt(prompt, mood)
    const archetypePreset = getArchetypePreset(archetype)

    // Select font pair
    let fontPair = getFontPair(fontPairId)
    if (!fontPairId && archetypePreset.typography?.fontPairId) {
      fontPair = getFontPair(archetypePreset.typography.fontPairId)
    }

    // Determine light/dark mode
    const brightnessType = typeof mood?.brightness === 'object' ? mood.brightness.type : mood?.brightness
    const isDarkPrompt = /dark|night|moody/i.test(prompt || '')
    const isDark = isDarkPrompt || brightnessType === 'dark' || archetypePreset.preferDark
    const mode = isDark && !archetypePreset.preferLight ? 'dark' : 'light'

    // Calculate colors based on mode
    const bgColor = mode === 'dark' ? '#0f0f0f' : '#ffffff'
    const surfaceColor = mode === 'dark' ? '#1a1a1a' : '#f8f8f8'
    const textPrimary = mode === 'dark' ? '#ffffff' : primaryColor
    const textSecondary = mode === 'dark' ? '#a1a1a1' : secondaryColor

    // Get rounded corners from archetype or mood
    const saturationType = typeof mood?.saturation === 'object' ? mood.saturation.type : mood?.saturation
    let rounded = archetypePreset.effects?.rounded || 'medium'
    if (saturationType === 'vibrant' && !archetypePreset.effects?.rounded) {
      rounded = 'full'
    }

    const densitySettings = DENSITY_PRESETS[density] || DENSITY_PRESETS.normal

    // Generate gradient token
    const gradient = generateGradientToken({
      suggestedGradient,
      colors,
      mood,
      archetype,
      archetypeGradient: archetypePreset.gradient
    })

    // Determine effects from archetype
    const archetypeEffects = archetypePreset.effects || {}
    const animations = archetypeEffects.animations !== false && archetypeEffects.animations !== 'none'
    const shadows = archetypeEffects.shadows !== false && (archetypeEffects.shadows === true || archetypeEffects.shadows === 'soft' || mode === 'light')

    return {
      colors: {
        primary: textPrimary,
        secondary: textSecondary,
        accent: accentColor,
        background: bgColor,
        surface: surfaceColor
      },
      typography: {
        headingFont: fontPair.heading,
        bodyFont: fontPair.body,
        fontPairId: fontPair.id,
        headingWeight: archetypePreset.typography?.headingWeight || 600,
        letterSpacing: archetypePreset.typography?.letterSpacing || '0',
        scale: densitySettings.scale < 1 ? 'small' : densitySettings.scale > 1 ? 'large' : 'normal'
      },
      layout: {
        maxWidth: '800px',
        density,
        alignment: 'center'
      },
      effects: {
        animations,
        animationStyle: archetypeEffects.animations === 'subtle' ? 'subtle' : 'normal',
        shadows,
        shadowStyle: archetypeEffects.shadows === 'soft' ? 'soft' : 'normal',
        rounded
      },
      gradient,
      mode,
      archetype,
      _meta: {
        sourceColors: colors,
        prompt,
        mood,
        fontPairId: fontPair.id,
        archetypeDescription: archetypePreset.description
      }
    }
  }

  /**
   * Detect archetype from prompt keywords and mood
   */
  function detectArchetypeFromPrompt(prompt, mood) {
    if (/minimal|clean|simple/i.test(prompt || '')) return 'minimal'
    if (/bold|dramatic|impact/i.test(prompt || '')) return 'bold'
    if (/elegant|luxury|premium|sophisticated/i.test(prompt || '')) return 'elegant'
    if (/playful|fun|creative|vibrant/i.test(prompt || '')) return 'playful'
    if (/modern|tech|startup/i.test(prompt || '')) return 'tech'
    return mood?.archetype || 'modern'
  }

  /**
   * Generate gradient token
   */
  function generateGradientToken({ suggestedGradient, colors, mood, archetype, archetypeGradient }) {
    if (archetypeGradient?.enabled === false || archetype === 'minimal') {
      return { enabled: false }
    }

    // Use suggested gradient if provided
    if (suggestedGradient && suggestedGradient.stops?.length >= 2) {
      const normalizedStops = suggestedGradient.stops.map((stop, i, arr) => {
        if (typeof stop === 'object' && stop.color) {
          const pos = stop.position !== undefined ? stop.position : Math.round((i / (arr.length - 1)) * 100)
          return `${stop.color} ${pos}%`
        }
        if (typeof stop === 'string' && (stop.includes('%') || stop.includes('px'))) {
          return stop
        }
        return `${stop} ${Math.round((i / (arr.length - 1)) * 100)}%`
      })

      return {
        enabled: true,
        type: archetypeGradient?.type || suggestedGradient.type || 'linear',
        angle: suggestedGradient.angle || 145,
        stops: normalizedStops,
        intensity: archetypeGradient?.intensity || 'medium'
      }
    }

    // Generate gradient from colors if appropriate
    const saturationType = typeof mood?.saturation === 'object' ? mood.saturation.type : mood?.saturation
    const shouldGenerate = archetypeGradient?.enabled === true ||
      archetype === 'bold' || archetype === 'playful' || saturationType === 'vibrant'

    if (shouldGenerate && colors?.length >= 2) {
      const temperatureType = typeof mood?.temperature === 'object' ? mood.temperature.type : mood?.temperature
      let angle = 145
      if (temperatureType === 'warm') angle = 135
      else if (temperatureType === 'cool') angle = 155

      const stops = [`${colors[0]} 0%`]
      if (colors.length >= 3) {
        stops.push(`${colors[1]} 50%`)
        stops.push(`${colors[2]} 100%`)
      } else {
        stops.push(`${colors[1]} 100%`)
      }

      return {
        enabled: true,
        type: archetypeGradient?.type || 'linear',
        angle,
        stops,
        intensity: archetypeGradient?.intensity || 'medium'
      }
    }

    // Elegant gets subtle gradient
    if (archetype === 'elegant' && colors?.length >= 2) {
      return {
        enabled: true,
        type: 'linear',
        angle: 180,
        stops: [
          `${adjustColorOpacity(colors[0], 0.9)} 0%`,
          `${adjustColorOpacity(colors[1] || colors[0], 0.95)} 100%`
        ],
        intensity: 'low'
      }
    }

    return { enabled: false }
  }

  /**
   * Adjust color opacity (returns rgba string)
   */
  function adjustColorOpacity(hex, opacity) {
    const rgb = hexToRgb(hex)
    if (!rgb) return `rgba(0,0,0,${opacity})`
    return `rgba(${rgb.r},${rgb.g},${rgb.b},${opacity})`
  }

  /**
   * @deprecated Use generateDesignTokens instead
   */
  async function generateDesign({ colors, prompt, mood, suggestedGradient }) {
    isGenerating.value = true
    error.value = null

    try {
      const response = await fetch('/.netlify/functions/generate-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colors, prompt, mood, suggestedGradient })
      })

      if (!response.ok) {
        if (response.status === 404) {
          return generateLocalDesign({ colors, prompt, mood, suggestedGradient })
        }
        throw new Error('Failed to generate design')
      }

      const data = await response.json()
      return data.styles
    } catch (err) {
      return generateLocalDesign({ colors, prompt, mood, suggestedGradient })
    } finally {
      isGenerating.value = false
    }
  }

  /**
   * @deprecated Use generateLocalTokens instead
   */
  function generateLocalDesign({ colors, prompt, mood, suggestedGradient }) {
    const primaryColor = colors[0] || '#3b82f6'
    const secondaryColor = colors[1] || colors[2] || adjustBrightness(primaryColor, -30)
    const tertiaryColor = colors[2] || colors[3] || adjustBrightness(primaryColor, 40)

    const isMinimal = /minimal|clean|simple/i.test(prompt)
    const isBold = /bold|dramatic|impact/i.test(prompt)
    const isElegant = /elegant|luxury|premium|sophisticated/i.test(prompt)
    const isModern = /modern|tech|startup/i.test(prompt)
    const isPlayful = /playful|fun|creative|vibrant/i.test(prompt)

    let fontFamily = 'system-ui, -apple-system, sans-serif'
    let titleSize = '42px'
    let titleWeight = 'bold'
    let letterSpacing = '-0.01em'
    let padding = '48px'

    if (isElegant) {
      fontFamily = 'Georgia, Cambria, "Times New Roman", serif'
      letterSpacing = '0.02em'
      titleWeight = '600'
    }
    if (isBold) {
      titleSize = '56px'
      titleWeight = '900'
      letterSpacing = '-0.03em'
    }
    if (isModern) {
      fontFamily = '"SF Pro Display", "Segoe UI", system-ui, sans-serif'
    }
    if (isMinimal) {
      titleSize = '36px'
      titleWeight = '500'
      padding = '64px'
    }
    if (isPlayful) {
      titleSize = '48px'
      titleWeight = '800'
    }

    if (mood?.saturation === 'vibrant') {
      titleWeight = '800'
      titleSize = parseInt(titleSize) + 4 + 'px'
      letterSpacing = '-0.02em'
    }
    if (mood?.saturation === 'muted') {
      titleWeight = '500'
      letterSpacing = '0.01em'
    }
    if (mood?.brightness === 'dark') {
      titleWeight = '700'
    }

    let background = { type: 'none' }
    let hasGradient = false

    if (suggestedGradient && suggestedGradient.stops?.length >= 2) {
      hasGradient = true
      background = {
        type: 'gradient',
        gradient: {
          type: suggestedGradient.type || 'linear',
          angle: suggestedGradient.angle || 135,
          stops: suggestedGradient.stops
        },
        overlay: {
          color: mood?.brightness === 'dark' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.15)'
        }
      }
    } else if (colors.length >= 2) {
      hasGradient = true
      const angle = mood?.temperature === 'warm' ? 145 : mood?.temperature === 'cool' ? 125 : 135
      background = {
        type: 'gradient',
        gradient: {
          type: 'linear',
          angle,
          stops: [
            { color: primaryColor, position: 0 },
            { color: secondaryColor, position: 50 },
            { color: tertiaryColor, position: 100 }
          ]
        },
        overlay: { color: 'rgba(255,255,255,0.15)' }
      }
    }

    const bgIsLight = hasGradient ? isLightColor(primaryColor) : (isMinimal || isLightColor(primaryColor))
    const textColor = bgIsLight ? '#111827' : '#ffffff'
    const mutedTextColor = bgIsLight ? '#4b5563' : '#d1d5db'
    const containerBg = hasGradient ? 'transparent' : (isMinimal ? '#ffffff' : primaryColor)

    return {
      container: {
        backgroundColor: containerBg,
        color: textColor,
        padding,
        fontFamily
      },
      title: {
        fontSize: titleSize,
        fontWeight: titleWeight,
        lineHeight: '1.1',
        letterSpacing,
        color: isMinimal && !hasGradient ? primaryColor : textColor
      },
      text: {
        fontSize: '14px',
        lineHeight: '1.7',
        color: mutedTextColor
      },
      imageGrid: {
        gap: isMinimal ? '16px' : '12px',
        columns: 2,
        borderRadius: isModern || mood?.saturation === 'vibrant' ? '12px' : isMinimal ? '4px' : '8px'
      },
      divider: {
        color: bgIsLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
        margin: '32px 0'
      },
      background
    }
  }

  return {
    generateDesign,
    generateDesignTokens,
    generateLocalTokens,
    tokensToCssVars,
    getGoogleFontsUrl,
    isGenerating,
    error,
    FONT_PAIRS
  }
}
