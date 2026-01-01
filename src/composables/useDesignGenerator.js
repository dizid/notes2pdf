import { ref } from 'vue'

const isGenerating = ref(false)
const error = ref(null)

// Curated font pairs for beautiful typography
export const FONT_PAIRS = [
  { id: 'classic-elegant', name: 'Classic Elegant', heading: 'Playfair Display', body: 'Source Sans 3', mood: 'sophisticated' },
  { id: 'modern-minimal', name: 'Modern Minimal', heading: 'Inter', body: 'Inter', mood: 'clean' },
  { id: 'editorial-bold', name: 'Editorial Bold', heading: 'DM Serif Display', body: 'DM Sans', mood: 'magazine' },
  { id: 'creative', name: 'Creative', heading: 'Abril Fatface', body: 'Poppins', mood: 'artistic' },
  { id: 'friendly', name: 'Friendly', heading: 'Nunito', body: 'Nunito', mood: 'approachable' },
  { id: 'professional', name: 'Professional', heading: 'Merriweather', body: 'Open Sans', mood: 'corporate' },
  { id: 'geometric', name: 'Geometric', heading: 'Raleway', body: 'Lato', mood: 'modern' },
  { id: 'bold-display', name: 'Bold Display', heading: 'Oswald', body: 'Roboto', mood: 'impact' },
  { id: 'literary', name: 'Literary', heading: 'Cormorant Garamond', body: 'Proza Libre', mood: 'elegant' },
  { id: 'tech', name: 'Tech', heading: 'Space Grotesk', body: 'IBM Plex Sans', mood: 'technical' }
]

// Spacing presets for different densities
const DENSITY_PRESETS = {
  compact: { spacing: '1rem', scale: 0.9 },
  normal: { spacing: '1.5rem', scale: 1 },
  spacious: { spacing: '2.5rem', scale: 1.1 }
}

// Border radius presets
const ROUNDED_PRESETS = {
  none: '0',
  subtle: '4px',
  medium: '8px',
  full: '16px'
}

/**
 * Style archetype presets - bundles of visual decisions for each archetype
 * These create distinct, recognizable aesthetics
 */
const STYLE_ARCHETYPES = {
  minimal: {
    effects: { shadows: false, animations: false, rounded: 'subtle' },
    typography: { fontPairId: 'modern-minimal', headingWeight: 400, letterSpacing: '0.02em' },
    gradient: { enabled: false },
    contrast: 'low',
    description: 'Clean, simple, focused'
  },
  bold: {
    effects: { shadows: true, animations: true, rounded: 'medium' },
    typography: { fontPairId: 'bold-display', headingWeight: 800, letterSpacing: '-0.02em' },
    gradient: { enabled: true, intensity: 'high' },
    contrast: 'high',
    description: 'Impactful, dynamic, striking'
  },
  elegant: {
    effects: { shadows: 'soft', animations: 'subtle', rounded: 'subtle' },
    typography: { fontPairId: 'classic-elegant', headingWeight: 500, letterSpacing: '0.05em' },
    gradient: { enabled: true, intensity: 'low' },
    contrast: 'medium',
    description: 'Sophisticated, luxurious, refined'
  },
  playful: {
    effects: { shadows: true, animations: true, rounded: 'full' },
    typography: { fontPairId: 'creative', headingWeight: 700, letterSpacing: '0' },
    gradient: { enabled: true, intensity: 'medium' },
    contrast: 'medium',
    description: 'Fun, friendly, approachable'
  },
  tech: {
    effects: { shadows: true, animations: true, rounded: 'medium' },
    typography: { fontPairId: 'tech', headingWeight: 600, letterSpacing: '-0.01em' },
    gradient: { enabled: true, intensity: 'medium' },
    contrast: 'medium',
    description: 'Innovative, modern, precise'
  },
  organic: {
    effects: { shadows: 'soft', animations: 'subtle', rounded: 'medium' },
    typography: { fontPairId: 'friendly', headingWeight: 500, letterSpacing: '0' },
    gradient: { enabled: true, intensity: 'low', type: 'radial' },
    contrast: 'low',
    description: 'Natural, flowing, authentic'
  },
  luxury: {
    effects: { shadows: 'soft', animations: 'subtle', rounded: 'none' },
    typography: { fontPairId: 'literary', headingWeight: 400, letterSpacing: '0.08em' },
    gradient: { enabled: true, intensity: 'low' },
    contrast: 'high',
    preferDark: true,
    description: 'Premium, exclusive, opulent'
  },
  friendly: {
    effects: { shadows: true, animations: true, rounded: 'full' },
    typography: { fontPairId: 'friendly', headingWeight: 600, letterSpacing: '0' },
    gradient: { enabled: false },
    contrast: 'medium',
    preferLight: true,
    description: 'Warm, welcoming, trustworthy'
  },
  modern: {
    effects: { shadows: true, animations: true, rounded: 'medium' },
    typography: { fontPairId: 'geometric', headingWeight: 600, letterSpacing: '-0.01em' },
    gradient: { enabled: true, intensity: 'medium' },
    contrast: 'medium',
    description: 'Contemporary, clean, versatile'
  }
}

// Shared color utility functions
export function isLightColor(hex) {
  if (!hex || typeof hex !== 'string') return true
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return true
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5
}

export function isDarkColor(hex) {
  return !isLightColor(hex)
}

export function useDesignGenerator() {
  // Generate new standardized design tokens
  async function generateDesignTokens({ colors, prompt, mood, suggestedGradient, fontPairId, density = 'normal' }) {
    isGenerating.value = true
    error.value = null

    try {
      const tokens = generateLocalTokens({ colors, prompt, mood, suggestedGradient, fontPairId, density })
      return tokens
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isGenerating.value = false
    }
  }

  // Generate standardized design tokens locally
  function generateLocalTokens({ colors, prompt, mood, suggestedGradient, fontPairId, density = 'normal' }) {
    const primaryColor = colors?.[0] || '#1a1a1a'
    const secondaryColor = colors?.[1] || '#666666'
    const accentColor = colors?.[2] || '#e63946'

    // Parse prompt for style hints
    const isMinimal = /minimal|clean|simple/i.test(prompt || '')
    const isBold = /bold|dramatic|impact/i.test(prompt || '')
    const isElegant = /elegant|luxury|premium|sophisticated/i.test(prompt || '')
    const isModern = /modern|tech|startup/i.test(prompt || '')
    const isPlayful = /playful|fun|creative|vibrant/i.test(prompt || '')
    const isDarkPrompt = /dark|night|moody/i.test(prompt || '')

    // Get archetype from mood analysis or derive from prompt
    let archetype = mood?.archetype || 'modern'
    if (isMinimal) archetype = 'minimal'
    else if (isBold) archetype = 'bold'
    else if (isElegant) archetype = 'elegant'
    else if (isPlayful) archetype = 'playful'
    else if (isModern) archetype = 'tech'

    // Get archetype preset (fallback to modern if not found)
    const archetypePreset = STYLE_ARCHETYPES[archetype] || STYLE_ARCHETYPES.modern

    // Select font pair: explicit > archetype preset > prompt-based
    let fontPair = FONT_PAIRS.find(fp => fp.id === fontPairId)
    if (!fontPair && archetypePreset.typography?.fontPairId) {
      fontPair = FONT_PAIRS.find(fp => fp.id === archetypePreset.typography.fontPairId)
    }
    if (!fontPair) {
      fontPair = FONT_PAIRS.find(fp => fp.id === 'modern-minimal')
    }

    // Determine mode (light/dark) based on prompt, mood, and archetype preference
    const brightnessType = typeof mood?.brightness === 'object' ? mood.brightness.type : mood?.brightness
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

    // Get density settings
    const densitySettings = DENSITY_PRESETS[density] || DENSITY_PRESETS.normal

    // Generate gradient token using archetype preferences
    const gradient = generateGradientToken({
      suggestedGradient,
      colors,
      mood,
      isMinimal: archetype === 'minimal',
      isBold: archetype === 'bold',
      isPlayful: archetype === 'playful',
      isElegant: archetype === 'elegant',
      archetypeGradient: archetypePreset.gradient
    })

    // Determine effects from archetype preset
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
      // Keep original inputs for reference
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
   * Generate gradient token from suggested gradient or colors
   */
  function generateGradientToken({ suggestedGradient, colors, mood, isMinimal, isBold, isPlayful, isElegant, archetypeGradient }) {
    // Check if archetype explicitly disables gradients
    if (archetypeGradient?.enabled === false || isMinimal) {
      return { enabled: false }
    }

    // Use suggested gradient if provided
    if (suggestedGradient && suggestedGradient.stops?.length >= 2) {
      // Normalize stops to include position percentages
      const normalizedStops = suggestedGradient.stops.map((stop, i, arr) => {
        // If stop is object with color/position
        if (typeof stop === 'object' && stop.color) {
          const pos = stop.position !== undefined ? stop.position : Math.round((i / (arr.length - 1)) * 100)
          return `${stop.color} ${pos}%`
        }
        // If stop already has percentage
        if (typeof stop === 'string' && (stop.includes('%') || stop.includes('px'))) {
          return stop
        }
        // Just a color - distribute evenly
        const position = Math.round((i / (arr.length - 1)) * 100)
        return `${stop} ${position}%`
      })

      // Use archetype's preferred gradient type if specified
      const gradientType = archetypeGradient?.type || suggestedGradient.type || 'linear'

      return {
        enabled: true,
        type: gradientType,
        angle: suggestedGradient.angle || 145,
        stops: normalizedStops,
        intensity: archetypeGradient?.intensity || 'medium'
      }
    }

    // Determine if we should generate gradient based on archetype and mood
    const saturationType = typeof mood?.saturation === 'object' ? mood.saturation.type : mood?.saturation
    const archetypeWantsGradient = archetypeGradient?.enabled === true
    const shouldGenerateGradient = archetypeWantsGradient || isBold || isPlayful || saturationType === 'vibrant'

    if (shouldGenerateGradient && colors?.length >= 2) {
      // Determine angle based on mood (handle both object and string format)
      const temperatureType = typeof mood?.temperature === 'object' ? mood.temperature.type : mood?.temperature
      let angle = 145
      if (temperatureType === 'warm') angle = 135
      else if (temperatureType === 'cool') angle = 155

      // Use archetype's preferred gradient type
      const gradientType = archetypeGradient?.type || 'linear'

      // Create gradient stops from available colors
      const stops = []
      stops.push(`${colors[0]} 0%`)

      if (colors.length >= 3) {
        stops.push(`${colors[1]} 50%`)
        stops.push(`${colors[2]} 100%`)
      } else {
        stops.push(`${colors[1]} 100%`)
      }

      return {
        enabled: true,
        type: gradientType,
        angle,
        stops,
        intensity: archetypeGradient?.intensity || 'medium'
      }
    }

    // Elegant styles may get a subtle gradient
    if (isElegant && colors?.length >= 2) {
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
    if (!hex || typeof hex !== 'string') return `rgba(0,0,0,${opacity})`
    const clean = hex.replace('#', '')
    if (clean.length !== 6) return hex
    const r = parseInt(clean.slice(0, 2), 16)
    const g = parseInt(clean.slice(2, 4), 16)
    const b = parseInt(clean.slice(4, 6), 16)
    return `rgba(${r},${g},${b},${opacity})`
  }

  /**
   * @deprecated Use generateDesignTokens instead. This function generates legacy styles.
   * Legacy: Generate old-style design for backward compatibility with existing templates
   */
  async function generateDesign({ colors, prompt, mood, suggestedGradient }) {
    isGenerating.value = true
    error.value = null

    try {
      // Try to call the Netlify function
      const response = await fetch('/.netlify/functions/generate-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colors, prompt, mood, suggestedGradient })
      })

      if (!response.ok) {
        // If function not available, use local generation
        if (response.status === 404) {
          console.log('Netlify function not found, using local generation')
          return generateLocalDesign({ colors, prompt, mood, suggestedGradient })
        }
        throw new Error('Failed to generate design')
      }

      const data = await response.json()
      return data.styles
    } catch (err) {
      // Fallback to local generation for development
      return generateLocalDesign({ colors, prompt, mood, suggestedGradient })
    } finally {
      isGenerating.value = false
    }
  }

  /**
   * @deprecated Use generateLocalTokens instead. This function generates legacy styles.
   * Local fallback generator for development/demo
   */
  function generateLocalDesign({ colors, prompt, mood, suggestedGradient }) {
    const primaryColor = colors[0] || '#3b82f6'
    const secondaryColor = colors[1] || colors[2] || adjustBrightness(primaryColor, -30)
    const tertiaryColor = colors[2] || colors[3] || adjustBrightness(primaryColor, 40)

    // Parse prompt for style hints
    const isMinimal = /minimal|clean|simple/i.test(prompt)
    const isBold = /bold|dramatic|impact/i.test(prompt)
    const isElegant = /elegant|luxury|premium|sophisticated/i.test(prompt)
    const isModern = /modern|tech|startup/i.test(prompt)
    const isPlayful = /playful|fun|creative|vibrant/i.test(prompt)

    // MOOD-DRIVEN typography enhancements
    let fontFamily = 'system-ui, -apple-system, sans-serif'
    let titleSize = '42px'
    let titleWeight = 'bold'
    let letterSpacing = '-0.01em'
    let padding = '48px'

    // Style-based adjustments (from prompt)
    if (isElegant) {
      fontFamily = 'Georgia, Cambria, "Times New Roman", serif'
      letterSpacing = '0.02em'
      titleWeight = '600'
    }
    if (isBold) {
      fontFamily = 'system-ui, -apple-system, sans-serif'
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

    // MOOD-DRIVEN typography overrides (from image analysis)
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

    // Generate background - USE THE SUGGESTED GRADIENT DIRECTLY (no double adjustment!)
    let background = { type: 'none' }
    let hasGradient = false

    if (suggestedGradient && suggestedGradient.stops?.length >= 2) {
      // Use the gradient from image analysis AS-IS (already optimized)
      hasGradient = true
      background = {
        type: 'gradient',
        gradient: {
          type: suggestedGradient.type || 'linear',
          angle: suggestedGradient.angle || 135,
          stops: suggestedGradient.stops
        },
        overlay: {
          // Stronger overlay for better readability
          color: mood?.brightness === 'dark' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.15)'
        }
      }
    } else if (colors.length >= 2) {
      // Generate a rich 3-stop gradient from colors
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
        overlay: {
          color: 'rgba(255,255,255,0.15)'
        }
      }
    }

    // Determine text colors based on background
    const bgIsLight = hasGradient ? isLightColor(primaryColor) : (isMinimal || isLightColor(primaryColor))
    const textColor = bgIsLight ? '#111827' : '#ffffff'
    const mutedTextColor = bgIsLight ? '#4b5563' : '#d1d5db'

    // Container backgroundColor: transparent if using gradient, otherwise solid
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

  // Helper: adjust color brightness
  function adjustBrightness(hex, percent) {
    const num = parseInt(hex.slice(1), 16)
    const amt = Math.round(2.55 * percent)
    const R = Math.min(255, Math.max(0, (num >> 16) + amt))
    const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt))
    const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt))
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
  }

  // Convert design tokens to CSS custom properties
  function tokensToCssVars(tokens) {
    const densitySpacing = DENSITY_PRESETS[tokens.layout?.density || 'normal'].spacing
    const radiusValue = ROUNDED_PRESETS[tokens.effects?.rounded || 'medium']

    return {
      '--color-primary': tokens.colors.primary,
      '--color-secondary': tokens.colors.secondary,
      '--color-accent': tokens.colors.accent,
      '--color-background': tokens.colors.background,
      '--color-surface': tokens.colors.surface,
      '--font-heading': `'${tokens.typography.headingFont}', serif`,
      '--font-body': `'${tokens.typography.bodyFont}', sans-serif`,
      '--spacing': densitySpacing,
      '--radius': radiusValue
    }
  }

  // Get Google Fonts URL for the tokens
  function getGoogleFontsUrl(tokens) {
    const heading = tokens.typography.headingFont.replace(/\s+/g, '+')
    const body = tokens.typography.bodyFont.replace(/\s+/g, '+')
    if (heading === body) {
      return `https://fonts.googleapis.com/css2?family=${heading}:wght@400;500;600;700;800&display=swap`
    }
    return `https://fonts.googleapis.com/css2?family=${heading}:wght@400;500;600;700;800&family=${body}:wght@400;500;600&display=swap`
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
