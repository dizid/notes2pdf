/**
 * Design System Presets
 * Curated font pairs, spacing, and style archetypes
 */

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
export const DENSITY_PRESETS = {
  compact: { spacing: '1rem', scale: 0.9 },
  normal: { spacing: '1.5rem', scale: 1 },
  spacious: { spacing: '2.5rem', scale: 1.1 }
}

// Border radius presets
export const ROUNDED_PRESETS = {
  none: '0',
  subtle: '4px',
  medium: '8px',
  full: '16px'
}

/**
 * Style archetype presets - bundles of visual decisions for each archetype
 */
export const STYLE_ARCHETYPES = {
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

/**
 * Get font pair by ID
 */
export function getFontPair(fontPairId) {
  return FONT_PAIRS.find(fp => fp.id === fontPairId) || FONT_PAIRS.find(fp => fp.id === 'modern-minimal')
}

/**
 * Get archetype preset
 */
export function getArchetypePreset(archetype) {
  return STYLE_ARCHETYPES[archetype] || STYLE_ARCHETYPES.modern
}

/**
 * Generate Google Fonts URL for given fonts
 */
export function getGoogleFontsUrl(tokens) {
  const heading = tokens.typography.headingFont.replace(/\s+/g, '+')
  const body = tokens.typography.bodyFont.replace(/\s+/g, '+')
  if (heading === body) {
    return `https://fonts.googleapis.com/css2?family=${heading}:wght@400;500;600;700;800&display=swap`
  }
  return `https://fonts.googleapis.com/css2?family=${heading}:wght@400;500;600;700;800&family=${body}:wght@400;500;600&display=swap`
}

/**
 * Convert design tokens to CSS custom properties
 */
export function tokensToCssVars(tokens) {
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
