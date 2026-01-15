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

// Shadow style presets - layered for realistic depth
export const SHADOW_PRESETS = {
  none: 'none',
  flat: '0 4px 24px rgba(0,0,0,0.08)',
  soft: '0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
  layered: '0 1px 2px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.05), 0 16px 32px rgba(0,0,0,0.08)',
  dramatic: '0 2px 4px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.12), 0 24px 48px rgba(0,0,0,0.16)'
}

// Animation easing presets
export const ANIMATION_PRESETS = {
  none: { enabled: false },
  subtle: { enabled: true, duration: '0.5s', easing: 'ease-out', stagger: 0.08 },
  normal: { enabled: true, duration: '0.6s', easing: 'cubic-bezier(0.16, 1, 0.3, 1)', stagger: 0.1 },
  dramatic: { enabled: true, duration: '0.8s', easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', stagger: 0.12 }
}

/**
 * Style archetype presets - bundles of visual decisions for each archetype
 *
 * Decoration options:
 * - svgDecorations: boolean - Enable SVG corner/divider decorations
 * - dropCapStyle: 'simple' | 'decorative' | 'boxed' - Style of drop cap
 * - titleUnderline: 'gradient' | 'elegant' | null - Style of title underline
 */
export const STYLE_ARCHETYPES = {
  minimal: {
    effects: { shadows: 'none', shadowStyle: 'none', animations: 'none', rounded: 'subtle' },
    typography: { fontPairId: 'modern-minimal', headingWeight: 400, letterSpacing: '0.02em', lineHeight: 1.6 },
    gradient: { enabled: false },
    decorations: { accentLine: false, dividers: 'none', dropCap: false, svgDecorations: false, dropCapStyle: null, titleUnderline: null },
    imageEffects: { hover: 'none', overlay: 'none', border: false },
    contrast: 'low',
    description: 'Clean, simple, focused'
  },
  bold: {
    effects: { shadows: true, shadowStyle: 'dramatic', animations: 'dramatic', rounded: 'medium' },
    typography: { fontPairId: 'bold-display', headingWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.0 },
    gradient: { enabled: true, intensity: 'high' },
    decorations: { accentLine: true, dividers: 'gradient', dropCap: false, svgDecorations: true, dropCapStyle: null, titleUnderline: 'gradient' },
    imageEffects: { hover: 'lift', overlay: 'none', border: false },
    contrast: 'high',
    description: 'Impactful, dynamic, striking'
  },
  elegant: {
    effects: { shadows: true, shadowStyle: 'soft', animations: 'subtle', rounded: 'subtle' },
    typography: { fontPairId: 'classic-elegant', headingWeight: 500, letterSpacing: '0.05em', lineHeight: 1.7 },
    gradient: { enabled: true, intensity: 'low' },
    decorations: { accentLine: false, dividers: 'simple', dropCap: true, svgDecorations: true, dropCapStyle: 'decorative', titleUnderline: 'elegant' },
    imageEffects: { hover: 'zoom', overlay: 'none', border: true },
    contrast: 'medium',
    description: 'Sophisticated, luxurious, refined'
  },
  playful: {
    effects: { shadows: true, shadowStyle: 'layered', animations: 'normal', rounded: 'full' },
    typography: { fontPairId: 'creative', headingWeight: 700, letterSpacing: '0', lineHeight: 1.5 },
    gradient: { enabled: true, intensity: 'medium' },
    decorations: { accentLine: false, dividers: 'gradient', dropCap: false, svgDecorations: true, dropCapStyle: null, titleUnderline: null },
    imageEffects: { hover: 'lift', overlay: 'none', border: false },
    contrast: 'medium',
    description: 'Fun, friendly, approachable'
  },
  tech: {
    effects: { shadows: true, shadowStyle: 'layered', animations: 'normal', rounded: 'medium' },
    typography: { fontPairId: 'tech', headingWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.6 },
    gradient: { enabled: true, intensity: 'medium' },
    decorations: { accentLine: true, dividers: 'simple', dropCap: false, svgDecorations: true, dropCapStyle: null, titleUnderline: null },
    imageEffects: { hover: 'zoom', overlay: 'gradient', border: false },
    contrast: 'medium',
    description: 'Innovative, modern, precise'
  },
  organic: {
    effects: { shadows: true, shadowStyle: 'soft', animations: 'subtle', rounded: 'medium' },
    typography: { fontPairId: 'friendly', headingWeight: 500, letterSpacing: '0', lineHeight: 1.7 },
    gradient: { enabled: true, intensity: 'low', type: 'radial' },
    decorations: { accentLine: false, dividers: 'simple', dropCap: false, svgDecorations: true, dropCapStyle: null, titleUnderline: null },
    imageEffects: { hover: 'zoom', overlay: 'none', border: false },
    contrast: 'low',
    description: 'Natural, flowing, authentic'
  },
  luxury: {
    effects: { shadows: true, shadowStyle: 'soft', animations: 'subtle', rounded: 'none' },
    typography: { fontPairId: 'literary', headingWeight: 400, letterSpacing: '0.08em', lineHeight: 1.8 },
    gradient: { enabled: true, intensity: 'low' },
    decorations: { accentLine: false, dividers: 'simple', dropCap: true, svgDecorations: true, dropCapStyle: 'boxed', titleUnderline: 'elegant' },
    imageEffects: { hover: 'zoom', overlay: 'tint', border: true },
    contrast: 'high',
    preferDark: true,
    description: 'Premium, exclusive, opulent'
  },
  friendly: {
    effects: { shadows: true, shadowStyle: 'layered', animations: 'normal', rounded: 'full' },
    typography: { fontPairId: 'friendly', headingWeight: 600, letterSpacing: '0', lineHeight: 1.6 },
    gradient: { enabled: false },
    decorations: { accentLine: false, dividers: 'none', dropCap: false, svgDecorations: true, dropCapStyle: null, titleUnderline: null },
    imageEffects: { hover: 'lift', overlay: 'none', border: false },
    contrast: 'medium',
    preferLight: true,
    description: 'Warm, welcoming, trustworthy'
  },
  modern: {
    effects: { shadows: true, shadowStyle: 'layered', animations: 'normal', rounded: 'medium' },
    typography: { fontPairId: 'geometric', headingWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.6 },
    gradient: { enabled: true, intensity: 'medium' },
    decorations: { accentLine: true, dividers: 'gradient', dropCap: false, svgDecorations: true, dropCapStyle: null, titleUnderline: 'gradient' },
    imageEffects: { hover: 'zoom', overlay: 'none', border: false },
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
 * Get shadow CSS from style
 */
export function getShadowCss(shadowStyle) {
  return SHADOW_PRESETS[shadowStyle] || SHADOW_PRESETS.layered
}

/**
 * Get animation preset
 */
export function getAnimationPreset(animationStyle) {
  if (animationStyle === true) return ANIMATION_PRESETS.normal
  if (animationStyle === false) return ANIMATION_PRESETS.none
  return ANIMATION_PRESETS[animationStyle] || ANIMATION_PRESETS.normal
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
