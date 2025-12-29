/**
 * Image Analysis Composable
 * Extracts colors, mood, and atmosphere from uploaded images
 */

// Convert RGB to HSL for hue/saturation analysis
function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s
  const l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return { h: h * 360, s, l }
}

// Convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

// Adjust color brightness
function adjustBrightness(hex, percent) {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const amt = Math.round(2.55 * percent)
  const r = Math.min(255, Math.max(0, rgb.r + amt))
  const g = Math.min(255, Math.max(0, rgb.g + amt))
  const b = Math.min(255, Math.max(0, rgb.b + amt))

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// Adjust color saturation
function adjustSaturation(hex, amount) {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const newS = Math.max(0, Math.min(1, hsl.s + amount))

  // Convert back to RGB
  const c = (1 - Math.abs(2 * hsl.l - 1)) * newS
  const x = c * (1 - Math.abs((hsl.h / 60) % 2 - 1))
  const m = hsl.l - c / 2

  let r, g, b
  if (hsl.h < 60) { r = c; g = x; b = 0 }
  else if (hsl.h < 120) { r = x; g = c; b = 0 }
  else if (hsl.h < 180) { r = 0; g = c; b = x }
  else if (hsl.h < 240) { r = 0; g = x; b = c }
  else if (hsl.h < 300) { r = x; g = 0; b = c }
  else { r = c; g = 0; b = x }

  const rFinal = Math.round((r + m) * 255)
  const gFinal = Math.round((g + m) * 255)
  const bFinal = Math.round((b + m) * 255)

  return `#${rFinal.toString(16).padStart(2, '0')}${gFinal.toString(16).padStart(2, '0')}${bFinal.toString(16).padStart(2, '0')}`
}

// Extract dominant colors from pixel data - PRIORITIZE VIBRANT COLORS
function extractDominantColors(pixels) {
  const colorData = {}

  // Sample every 4th pixel for performance on large images
  const step = pixels.length > 100000 ? 16 : 4

  for (let i = 0; i < pixels.length; i += step) {
    // Quantize to 32-step values, but cap at 255 to prevent invalid hex
    const r = Math.min(255, Math.round(pixels[i] / 32) * 32)
    const g = Math.min(255, Math.round(pixels[i + 1] / 32) * 32)
    const b = Math.min(255, Math.round(pixels[i + 2] / 32) * 32)
    const a = pixels[i + 3]

    // Skip transparent pixels
    if (a < 128) continue

    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`

    if (!colorData[hex]) {
      // Calculate saturation for this color
      const hsl = rgbToHsl(r, g, b)
      colorData[hex] = { count: 0, saturation: hsl.s, lightness: hsl.l }
    }
    colorData[hex].count++
  }

  // Score colors: prioritize saturated colors over grays
  // Vibrant colors get a 3x boost, slightly saturated get 1.5x boost
  // Very dark or very light colors (near black/white) get penalized
  return Object.entries(colorData)
    .map(([color, data]) => {
      let score = data.count

      // Boost saturated colors significantly
      if (data.saturation > 0.4) {
        score *= 3 // Strong saturation boost
      } else if (data.saturation > 0.2) {
        score *= 1.5 // Mild saturation boost
      } else if (data.saturation < 0.1) {
        score *= 0.3 // Penalize grays heavily
      }

      // Penalize very dark or very light (near white/black)
      if (data.lightness < 0.15 || data.lightness > 0.85) {
        score *= 0.5
      }

      return { color, score, saturation: data.saturation }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(item => item.color)
}

// Analyze color temperature (warm vs cool)
function analyzeTemperature(pixels) {
  let warmCount = 0
  let coolCount = 0
  let totalCount = 0

  const step = pixels.length > 100000 ? 16 : 4

  for (let i = 0; i < pixels.length; i += step) {
    const a = pixels[i + 3]
    if (a < 128) continue

    const hsl = rgbToHsl(pixels[i], pixels[i + 1], pixels[i + 2])

    // Skip very desaturated colors (grays)
    if (hsl.s < 0.1) continue

    totalCount++

    // Warm hues: 0-60 (reds, oranges, yellows) or 300-360 (magentas, pinks)
    // Cool hues: 150-270 (cyans, blues, purples)
    if ((hsl.h >= 0 && hsl.h <= 60) || hsl.h >= 300) {
      warmCount++
    } else if (hsl.h >= 150 && hsl.h <= 270) {
      coolCount++
    }
  }

  if (totalCount === 0) return { temperature: 'neutral', score: 0.5 }

  const warmRatio = warmCount / totalCount
  const coolRatio = coolCount / totalCount

  if (warmRatio > 0.4) return { temperature: 'warm', score: warmRatio }
  if (coolRatio > 0.4) return { temperature: 'cool', score: coolRatio }
  return { temperature: 'neutral', score: 0.5 }
}

// Analyze saturation levels (vibrant vs muted)
function analyzeSaturation(pixels) {
  let totalSaturation = 0
  let count = 0

  const step = pixels.length > 100000 ? 16 : 4

  for (let i = 0; i < pixels.length; i += step) {
    const a = pixels[i + 3]
    if (a < 128) continue

    const hsl = rgbToHsl(pixels[i], pixels[i + 1], pixels[i + 2])
    totalSaturation += hsl.s
    count++
  }

  if (count === 0) return { saturation: 'neutral', score: 0.5 }

  const avgSat = totalSaturation / count

  if (avgSat > 0.5) return { saturation: 'vibrant', score: avgSat }
  if (avgSat < 0.25) return { saturation: 'muted', score: avgSat }
  return { saturation: 'neutral', score: avgSat }
}

// Analyze brightness distribution (light vs dark)
function analyzeBrightness(pixels) {
  let lightPixels = 0
  let darkPixels = 0
  let totalCount = 0

  const step = pixels.length > 100000 ? 16 : 4

  for (let i = 0; i < pixels.length; i += step) {
    const a = pixels[i + 3]
    if (a < 128) continue

    // Calculate luminance
    const luminance = (0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2]) / 255

    totalCount++
    if (luminance > 0.6) lightPixels++
    else if (luminance < 0.4) darkPixels++
  }

  if (totalCount === 0) return { brightness: 'balanced', score: 0.5 }

  const lightRatio = lightPixels / totalCount
  const darkRatio = darkPixels / totalCount

  if (lightRatio > 0.5) return { brightness: 'light', score: lightRatio }
  if (darkRatio > 0.5) return { brightness: 'dark', score: darkRatio }
  return { brightness: 'balanced', score: 0.5 }
}

// Generate a SPECTACULAR mood-based gradient
function generateMoodGradient(colors, mood) {
  const primary = colors[0] || '#6366f1'
  const secondary = colors[1] || adjustBrightness(primary, -30)
  const tertiary = colors[2] || adjustBrightness(primary, 40)
  const accent = colors[3] || adjustSaturation(primary, 0.2)

  // Dynamic gradient type based on mood
  let gradientType = 'linear'
  let angle = 135

  // Vibrant = bold diagonal, Muted = soft radial, Dark = dramatic angle
  if (mood.saturation === 'muted') {
    gradientType = 'radial' // Soft, ethereal feel
  } else if (mood.saturation === 'vibrant') {
    angle = 145 // Bold diagonal
  }

  // Temperature affects angle
  if (mood.temperature === 'warm') angle = 160 // Steep warm diagonal
  if (mood.temperature === 'cool') angle = 120 // Cool diagonal

  // Build gradient stops based on mood - USE 3-4 STOPS for richness
  let stops = []

  if (mood.brightness === 'light') {
    // Light mood: soft, ethereal gradients
    stops = [
      { color: adjustBrightness(primary, 15), position: 0 },
      { color: adjustBrightness(secondary, 25), position: 45 },
      { color: adjustBrightness(tertiary, 20), position: 100 }
    ]
  } else if (mood.brightness === 'dark') {
    // Dark mood: rich, deep gradients with high contrast
    stops = [
      { color: adjustBrightness(primary, -15), position: 0 },
      { color: adjustBrightness(secondary, -25), position: 40 },
      { color: adjustBrightness(accent, -20), position: 70 },
      { color: adjustBrightness(tertiary, -30), position: 100 }
    ]
  } else {
    // Balanced: rich mid-tones
    stops = [
      { color: primary, position: 0 },
      { color: secondary, position: 50 },
      { color: tertiary, position: 100 }
    ]
  }

  // Saturation adjustments
  if (mood.saturation === 'vibrant') {
    // Boost saturation for punchy colors
    stops = stops.map(stop => ({
      ...stop,
      color: adjustSaturation(stop.color, 0.15)
    }))
  } else if (mood.saturation === 'muted') {
    // Desaturate for soft, elegant feel
    stops = stops.map(stop => ({
      ...stop,
      color: adjustSaturation(stop.color, -0.15)
    }))
  }

  return {
    type: gradientType,
    angle,
    stops
  }
}

// Main analysis function
export async function analyzeImage(file) {
  return new Promise((resolve) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    img.onload = () => {
      // Scale down large images for performance
      const maxDim = 400
      let width = img.width
      let height = img.height

      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)

      const imageData = ctx.getImageData(0, 0, width, height)
      const pixels = imageData.data

      // Extract all analysis data
      const colors = extractDominantColors(pixels)
      const temperatureData = analyzeTemperature(pixels)
      const saturationData = analyzeSaturation(pixels)
      const brightnessData = analyzeBrightness(pixels)

      const mood = {
        temperature: temperatureData.temperature,
        saturation: saturationData.saturation,
        brightness: brightnessData.brightness
      }

      const suggestedGradient = generateMoodGradient(colors, mood)

      // Clean up
      URL.revokeObjectURL(img.src)

      resolve({
        colors,
        mood,
        suggestedGradient
      })
    }

    img.onerror = () => {
      resolve({
        colors: [],
        mood: {
          temperature: 'neutral',
          saturation: 'neutral',
          brightness: 'balanced'
        },
        suggestedGradient: null
      })
    }

    img.src = URL.createObjectURL(file)
  })
}

// Merge analysis from multiple images
export function mergeAnalyses(analyses) {
  if (!analyses || analyses.length === 0) {
    return {
      colors: [],
      mood: {
        temperature: 'neutral',
        saturation: 'neutral',
        brightness: 'balanced'
      },
      suggestedGradient: null
    }
  }

  if (analyses.length === 1) {
    return analyses[0]
  }

  // Collect all colors, deduplicate
  const allColors = []
  const seenColors = new Set()

  for (const analysis of analyses) {
    for (const color of analysis.colors) {
      if (!seenColors.has(color)) {
        seenColors.add(color)
        allColors.push(color)
      }
    }
  }

  // Average the mood (simplified - take the most common)
  const tempCounts = { warm: 0, cool: 0, neutral: 0 }
  const satCounts = { vibrant: 0, muted: 0, neutral: 0 }
  const brightCounts = { light: 0, dark: 0, balanced: 0 }

  for (const analysis of analyses) {
    tempCounts[analysis.mood.temperature]++
    satCounts[analysis.mood.saturation]++
    brightCounts[analysis.mood.brightness]++
  }

  const getMax = (counts) => Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]

  const mood = {
    temperature: getMax(tempCounts),
    saturation: getMax(satCounts),
    brightness: getMax(brightCounts)
  }

  const suggestedGradient = generateMoodGradient(allColors.slice(0, 6), mood)

  return {
    colors: allColors.slice(0, 6),
    mood,
    suggestedGradient
  }
}

export function useImageAnalysis() {
  return {
    analyzeImage,
    mergeAnalyses,
    generateMoodGradient
  }
}
