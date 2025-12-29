import { ref } from 'vue'

const isGenerating = ref(false)
const error = ref(null)

export function useDesignGenerator() {
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

  // Local fallback generator for development/demo
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

  // Helper: check if color is light
  function isLightColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5
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

  return {
    generateDesign,
    isGenerating,
    error
  }
}
