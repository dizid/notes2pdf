/**
 * Design System Presets
 * Curated font pairs, spacing, and style archetypes
 *
 * V2: Enhanced with additional font pairs, effects, and archetype refinements
 */

// Curated font pairs for beautiful typography (15 pairs)
export const FONT_PAIRS = [
  // Original 10 pairs
  { id: 'classic-elegant', name: 'Classic Elegant', heading: 'Playfair Display', body: 'Source Sans 3', mood: 'sophisticated', category: 'serif' },
  { id: 'modern-minimal', name: 'Modern Minimal', heading: 'Inter', body: 'Inter', mood: 'clean', category: 'sans' },
  { id: 'editorial-bold', name: 'Editorial Bold', heading: 'DM Serif Display', body: 'DM Sans', mood: 'magazine', category: 'serif' },
  { id: 'creative', name: 'Creative', heading: 'Abril Fatface', body: 'Poppins', mood: 'artistic', category: 'display' },
  { id: 'friendly', name: 'Friendly', heading: 'Nunito', body: 'Nunito', mood: 'approachable', category: 'sans' },
  { id: 'professional', name: 'Professional', heading: 'Merriweather', body: 'Open Sans', mood: 'corporate', category: 'serif' },
  { id: 'geometric', name: 'Geometric', heading: 'Raleway', body: 'Lato', mood: 'modern', category: 'sans' },
  { id: 'bold-display', name: 'Bold Display', heading: 'Oswald', body: 'Roboto', mood: 'impact', category: 'display' },
  { id: 'literary', name: 'Literary', heading: 'Cormorant Garamond', body: 'Proza Libre', mood: 'elegant', category: 'serif' },
  { id: 'tech', name: 'Tech', heading: 'Space Grotesk', body: 'IBM Plex Sans', mood: 'technical', category: 'sans' },

  // New 5 pairs for enhanced variety
  { id: 'neo-grotesque', name: 'Neo Grotesque', heading: 'Plus Jakarta Sans', body: 'Plus Jakarta Sans', mood: 'contemporary', category: 'sans' },
  { id: 'editorial-serif', name: 'Editorial Serif', heading: 'Fraunces', body: 'Source Serif 4', mood: 'storytelling', category: 'serif' },
  { id: 'high-contrast', name: 'High Contrast', heading: 'Bodoni Moda', body: 'Work Sans', mood: 'dramatic', category: 'display' },
  { id: 'retro-modern', name: 'Retro Modern', heading: 'Sora', body: 'Outfit', mood: 'nostalgic', category: 'sans' },
  { id: 'humanist', name: 'Humanist', heading: 'Fira Sans', body: 'Fira Sans', mood: 'accessible', category: 'sans' }
]

// Font pair categories for filtering
export const FONT_CATEGORIES = {
  serif: 'Serif fonts - traditional, elegant',
  sans: 'Sans-serif - modern, clean',
  display: 'Display fonts - bold, expressive'
}

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

// ============================================================================
// V2: ENHANCED EFFECT PRESETS
// ============================================================================

// Glassmorphism effect presets
export const GLASS_PRESETS = {
  none: null,
  subtle: {
    background: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  medium: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  strong: {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.4)'
  },
  dark: {
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  }
}

// Grain texture overlay (inline SVG for self-contained pages)
export const GRAIN_TEXTURE = {
  none: null,
  subtle: {
    opacity: 0.03,
    svg: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
  },
  medium: {
    opacity: 0.05,
    svg: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
  },
  strong: {
    opacity: 0.08,
    svg: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
  }
}

// Text shadow presets for headings
export const TEXT_SHADOW_PRESETS = {
  none: 'none',
  subtle: '0 1px 2px rgba(0, 0, 0, 0.1)',
  medium: '0 2px 4px rgba(0, 0, 0, 0.15)',
  glow: '0 0 20px rgba(255, 255, 255, 0.5)',
  hard: '2px 2px 0 rgba(0, 0, 0, 0.1)'
}

// Image treatment presets
export const IMAGE_TREATMENT_PRESETS = {
  none: null,
  polaroid: {
    padding: '0.75rem',
    paddingBottom: '2rem',
    background: '#ffffff',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    transform: 'rotate(-2deg)'
  },
  duotone: {
    filter: 'grayscale(100%) contrast(1.1)',
    mixBlendMode: 'multiply'
  },
  vintage: {
    filter: 'sepia(20%) contrast(1.05) brightness(1.05)',
    borderRadius: '2px'
  },
  masked: {
    borderRadius: '50%',
    aspectRatio: '1/1',
    objectFit: 'cover'
  }
}

// Drop cap style presets
export const DROP_CAP_PRESETS = {
  none: null,
  simple: {
    fontSize: '3.5em',
    lineHeight: 0.8,
    float: 'left',
    marginRight: '0.1em',
    marginTop: '0.1em'
  },
  decorative: {
    fontSize: '4em',
    lineHeight: 0.75,
    float: 'left',
    marginRight: '0.15em',
    marginTop: '0.05em',
    fontWeight: 700
  },
  boxed: {
    fontSize: '2.5em',
    lineHeight: 1,
    float: 'left',
    marginRight: '0.5em',
    marginTop: '0.1em',
    marginBottom: '0.1em',
    padding: '0.3em 0.5em',
    background: 'var(--color-accent)',
    color: 'var(--color-background)'
  },
  outlined: {
    fontSize: '4em',
    lineHeight: 0.75,
    float: 'left',
    marginRight: '0.15em',
    marginTop: '0.05em',
    fontWeight: 700,
    WebkitTextStroke: '2px var(--color-accent)',
    color: 'transparent'
  },
  colored: {
    fontSize: '3.5em',
    lineHeight: 0.8,
    float: 'left',
    marginRight: '0.1em',
    marginTop: '0.1em',
    color: 'var(--color-accent)'
  }
}

/**
 * Style archetype presets - bundles of visual decisions for each archetype
 *
 * V2: Enhanced with glass effects, grain textures, text shadows, and more
 *
 * Decoration options:
 * - svgDecorations: boolean - Enable SVG corner/divider decorations
 * - dropCapStyle: 'simple' | 'decorative' | 'boxed' | 'outlined' | 'colored' - Style of drop cap
 * - titleUnderline: 'gradient' | 'elegant' | null - Style of title underline
 * - sectionDividers: boolean - Enable section divider decorations
 * - pullQuotes: boolean - Enable decorative pull quote styling
 *
 * New V2 options:
 * - glass: 'none' | 'subtle' | 'medium' | 'strong' | 'dark' - Glassmorphism effect
 * - grain: 'none' | 'subtle' | 'medium' | 'strong' - Grain texture overlay
 * - textShadow: 'none' | 'subtle' | 'medium' | 'glow' | 'hard' - Heading text shadow
 * - imageTreatment: 'none' | 'polaroid' | 'duotone' | 'vintage' | 'masked' - Image treatment
 */
export const STYLE_ARCHETYPES = {
  minimal: {
    effects: { shadows: 'none', shadowStyle: 'none', animations: 'none', rounded: 'subtle', glass: 'none', grain: 'none' },
    typography: { fontPairId: 'modern-minimal', headingWeight: 400, letterSpacing: '0.02em', lineHeight: 1.6, textShadow: 'none' },
    gradient: { enabled: false },
    decorations: { accentLine: false, dividers: 'none', dropCap: false, svgDecorations: false, dropCapStyle: null, titleUnderline: null, sectionDividers: false, pullQuotes: false },
    imageEffects: { hover: 'none', overlay: 'none', border: false, treatment: 'none' },
    spacing: { whitespaceMultiplier: 1.3 },
    contrast: 'low',
    description: 'Clean, simple, focused'
  },
  bold: {
    effects: { shadows: true, shadowStyle: 'dramatic', animations: 'dramatic', rounded: 'medium', glass: 'none', grain: 'subtle' },
    typography: { fontPairId: 'bold-display', headingWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.0, textShadow: 'medium' },
    gradient: { enabled: true, intensity: 'high' },
    decorations: { accentLine: true, dividers: 'gradient', dropCap: false, svgDecorations: true, dropCapStyle: null, titleUnderline: 'gradient', sectionDividers: true, pullQuotes: true },
    imageEffects: { hover: 'lift', overlay: 'none', border: false, treatment: 'none' },
    spacing: { whitespaceMultiplier: 1.0 },
    contrast: 'high',
    description: 'Impactful, dynamic, striking'
  },
  elegant: {
    effects: { shadows: true, shadowStyle: 'soft', animations: 'subtle', rounded: 'subtle', glass: 'none', grain: 'none' },
    typography: { fontPairId: 'classic-elegant', headingWeight: 500, letterSpacing: '0.05em', lineHeight: 1.7, textShadow: 'none', ligatures: true, opticalSizing: true },
    gradient: { enabled: true, intensity: 'low' },
    decorations: { accentLine: false, dividers: 'simple', dropCap: true, svgDecorations: true, dropCapStyle: 'decorative', titleUnderline: 'elegant', sectionDividers: true, pullQuotes: true },
    imageEffects: { hover: 'zoom', overlay: 'none', border: true, treatment: 'none' },
    spacing: { whitespaceMultiplier: 1.2 },
    contrast: 'medium',
    description: 'Sophisticated, luxurious, refined'
  },
  playful: {
    effects: { shadows: true, shadowStyle: 'layered', animations: 'normal', rounded: 'full', glass: 'none', grain: 'none' },
    typography: { fontPairId: 'creative', headingWeight: 700, letterSpacing: '0', lineHeight: 1.5, textShadow: 'none' },
    gradient: { enabled: true, intensity: 'medium' },
    decorations: { accentLine: false, dividers: 'gradient', dropCap: false, svgDecorations: true, dropCapStyle: null, titleUnderline: null, sectionDividers: true, pullQuotes: false },
    imageEffects: { hover: 'lift', overlay: 'none', border: false, treatment: 'none' },
    spacing: { whitespaceMultiplier: 1.1 },
    contrast: 'medium',
    description: 'Fun, friendly, approachable'
  },
  tech: {
    effects: { shadows: true, shadowStyle: 'layered', animations: 'normal', rounded: 'medium', glass: 'subtle', grain: 'subtle' },
    typography: { fontPairId: 'tech', headingWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.6, textShadow: 'none', monoAccents: true },
    gradient: { enabled: true, intensity: 'medium' },
    decorations: { accentLine: true, dividers: 'simple', dropCap: false, svgDecorations: true, dropCapStyle: null, titleUnderline: null, sectionDividers: true, pullQuotes: false, gridBackground: true },
    imageEffects: { hover: 'zoom', overlay: 'gradient', border: false, treatment: 'none' },
    spacing: { whitespaceMultiplier: 1.0 },
    contrast: 'medium',
    description: 'Innovative, modern, precise'
  },
  organic: {
    effects: { shadows: true, shadowStyle: 'soft', animations: 'subtle', rounded: 'medium', glass: 'none', grain: 'subtle' },
    typography: { fontPairId: 'friendly', headingWeight: 500, letterSpacing: '0', lineHeight: 1.7, textShadow: 'none' },
    gradient: { enabled: true, intensity: 'low', type: 'radial' },
    decorations: { accentLine: false, dividers: 'simple', dropCap: false, svgDecorations: true, dropCapStyle: null, titleUnderline: null, sectionDividers: true, pullQuotes: false },
    imageEffects: { hover: 'zoom', overlay: 'none', border: false, treatment: 'vintage' },
    spacing: { whitespaceMultiplier: 1.15 },
    contrast: 'low',
    preferLight: true,
    description: 'Natural, flowing, authentic'
  },
  luxury: {
    effects: { shadows: true, shadowStyle: 'soft', animations: 'subtle', rounded: 'none', glass: 'dark', grain: 'medium' },
    typography: { fontPairId: 'literary', headingWeight: 400, letterSpacing: '0.08em', lineHeight: 1.8, textShadow: 'subtle', ligatures: true },
    gradient: { enabled: true, intensity: 'low' },
    decorations: { accentLine: false, dividers: 'simple', dropCap: true, svgDecorations: true, dropCapStyle: 'boxed', titleUnderline: 'elegant', sectionDividers: true, pullQuotes: true, frame: true },
    imageEffects: { hover: 'zoom', overlay: 'tint', border: true, treatment: 'none' },
    spacing: { whitespaceMultiplier: 1.25 },
    contrast: 'high',
    preferDark: true,
    description: 'Premium, exclusive, opulent'
  },
  friendly: {
    effects: { shadows: true, shadowStyle: 'layered', animations: 'normal', rounded: 'full', glass: 'none', grain: 'none' },
    typography: { fontPairId: 'friendly', headingWeight: 600, letterSpacing: '0', lineHeight: 1.6, textShadow: 'none' },
    gradient: { enabled: false },
    decorations: { accentLine: false, dividers: 'none', dropCap: false, svgDecorations: true, dropCapStyle: null, titleUnderline: null, sectionDividers: false, pullQuotes: false },
    imageEffects: { hover: 'lift', overlay: 'none', border: false, treatment: 'none' },
    spacing: { whitespaceMultiplier: 1.1 },
    contrast: 'medium',
    preferLight: true,
    description: 'Warm, welcoming, trustworthy'
  },
  modern: {
    effects: { shadows: true, shadowStyle: 'layered', animations: 'normal', rounded: 'medium', glass: 'none', grain: 'none' },
    typography: { fontPairId: 'geometric', headingWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.6, textShadow: 'none' },
    gradient: { enabled: true, intensity: 'medium' },
    decorations: { accentLine: true, dividers: 'gradient', dropCap: false, svgDecorations: true, dropCapStyle: null, titleUnderline: 'gradient', sectionDividers: true, pullQuotes: false },
    imageEffects: { hover: 'zoom', overlay: 'none', border: false, treatment: 'none' },
    spacing: { whitespaceMultiplier: 1.0 },
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
