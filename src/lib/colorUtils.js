/**
 * Color Utility Functions
 * Centralized color manipulation utilities used across the application
 */

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color string (with or without #)
 * @returns {{ r: number, g: number, b: number } | null} RGB values or null if invalid
 */
export function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string') return null
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * Convert RGB to hex color
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string | null} Hex color string or null if invalid
 */
export function rgbToHex(r, g, b) {
  if ([r, g, b].some(v => v < 0 || v > 255 || !Number.isFinite(v))) return null
  return '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('')
}

/**
 * Convert RGB to HSL
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {{ h: number, s: number, l: number }} HSL values (h: 0-360, s: 0-1, l: 0-1)
 */
export function rgbToHsl(r, g, b) {
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

/**
 * Convert HSL to hex color
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {string} Hex color string
 */
export function hslToHex(h, s, l) {
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

/**
 * Adjust color brightness
 * @param {string} hex - Hex color string
 * @param {number} percent - Brightness adjustment (-100 to 100)
 * @returns {string} Adjusted hex color
 */
export function adjustBrightness(hex, percent) {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const amt = Math.round(2.55 * percent)
  const r = Math.min(255, Math.max(0, rgb.r + amt))
  const g = Math.min(255, Math.max(0, rgb.g + amt))
  const b = Math.min(255, Math.max(0, rgb.b + amt))

  return rgbToHex(r, g, b) || hex
}

/**
 * Adjust color saturation
 * @param {string} hex - Hex color string
 * @param {number} amount - Saturation adjustment (-1 to 1)
 * @returns {string} Adjusted hex color
 */
export function adjustSaturation(hex, amount) {
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

  return rgbToHex(rFinal, gFinal, bFinal) || hex
}

/**
 * Check if a color is light (for determining text contrast)
 * @param {string} hex - Hex color string
 * @returns {boolean} True if the color is light
 */
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

/**
 * Check if a color is dark (for determining text contrast)
 * @param {string} hex - Hex color string
 * @returns {boolean} True if the color is dark
 */
export function isDarkColor(hex) {
  return !isLightColor(hex)
}

/**
 * Get luminance of a color (0-1)
 * @param {string} hex - Hex color string
 * @returns {number} Luminance value (0-1)
 */
export function getLuminance(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0.5
  return (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
}

/**
 * Check if a hex color string is valid
 * @param {string} hex - Hex color string
 * @returns {boolean} True if valid hex color
 */
export function isValidHex(hex) {
  if (!hex || typeof hex !== 'string') return false
  return /^#?([a-f\d]{6}|[a-f\d]{3})$/i.test(hex)
}

/**
 * Normalize a hex color to 6-digit format with #
 * @param {string} hex - Hex color string
 * @returns {string | null} Normalized hex color or null if invalid
 */
export function normalizeHex(hex) {
  if (!hex || typeof hex !== 'string') return null

  let clean = hex.replace('#', '').toLowerCase()

  // Expand 3-digit hex to 6-digit
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('')
  }

  if (clean.length !== 6 || !/^[a-f\d]{6}$/i.test(clean)) {
    return null
  }

  return '#' + clean
}

/**
 * Normalize any color format to hex
 * @param {string} color - Color in hex, rgb, or hsl format
 * @returns {string | null} Hex color or null if invalid
 */
export function normalizeColor(color) {
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

/**
 * Get color saturation (0-100)
 * @param {string} hex - Hex color string
 * @returns {number} Saturation percentage
 */
export function getColorSaturation(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  return max === 0 ? 0 : ((max - min) / max) * 100
}

/**
 * Get perceived brightness (0-100)
 * @param {string} hex - Hex color string
 * @returns {number} Brightness percentage
 */
export function getColorBrightness(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return 50
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 / 2.55
}

/**
 * Get color temperature score
 * @param {string} hex - Hex color string
 * @returns {{ warm: number, cool: number }} Temperature scores
 */
export function getColorTemperatureScore(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return { warm: 0, cool: 0 }
  const { r, g, b } = rgb
  const warm = Math.max(0, r - b) + Math.max(0, (r + g) / 2 - b) / 2
  const cool = Math.max(0, b - r) + Math.max(0, (b + g) / 2 - r) / 2
  return { warm, cool }
}

/**
 * Get simple color temperature classification
 * @param {string} hex - Hex color string
 * @returns {'warm' | 'cool' | 'neutral'} Temperature type
 */
export function getColorTemperature(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return 'neutral'
  if (rgb.r > rgb.b + 30) return 'warm'
  if (rgb.b > rgb.r + 30) return 'cool'
  return 'neutral'
}

/**
 * Calculate Euclidean distance between two colors
 * @param {string} hex1 - First hex color
 * @param {string} hex2 - Second hex color
 * @returns {number} Distance (0-441.67 max)
 */
export function colorDistance(hex1, hex2) {
  const rgb1 = hexToRgb(hex1)
  const rgb2 = hexToRgb(hex2)
  if (!rgb1 || !rgb2) return 0
  return Math.sqrt(
    (rgb1.r - rgb2.r) ** 2 +
    (rgb1.g - rgb2.g) ** 2 +
    (rgb1.b - rgb2.b) ** 2
  )
}

/**
 * Check if color is valid for brand use (not too dark/light/gray)
 * @param {string} hex - Hex color string
 * @returns {boolean} True if valid brand color
 */
export function isValidBrandColor(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return false

  const brightness = (rgb.r + rgb.g + rgb.b) / 3
  if (brightness < 15 || brightness > 245) return false

  const max = Math.max(rgb.r, rgb.g, rgb.b)
  const min = Math.min(rgb.r, rgb.g, rgb.b)
  const saturation = max === 0 ? 0 : (max - min) / max * 100
  // Allow slightly desaturated colors (brand colors often have subtle tints)
  if (saturation < 3 && brightness > 20 && brightness < 235) return false

  return true
}

/**
 * Remove visually similar colors from array
 * @param {string[]} colors - Array of hex colors
 * @param {number} threshold - Minimum distance (default 30)
 * @returns {string[]} Deduplicated colors
 */
export function deduplicateSimilarColors(colors, threshold = 30) {
  const result = []
  for (const color of colors) {
    const isSimilar = result.some(existing => colorDistance(existing, color) < threshold)
    if (!isSimilar) {
      result.push(color)
    }
  }
  return result
}
