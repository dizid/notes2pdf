import { computed } from 'vue'
import { useTemplates } from './useTemplates'

// Default tokens for fallback
export const DEFAULT_TOKENS = {
  colors: {
    primary: '#1a1a1a',
    secondary: '#666666',
    accent: '#3b82f6',
    background: '#ffffff',
    surface: '#f8f8f8'
  },
  typography: {
    headingFont: 'Inter',
    bodyFont: 'Inter',
    scale: 'normal'
  },
  layout: {
    density: 'normal',
    alignment: 'center'
  },
  effects: {
    shadows: true,
    animations: true,
    rounded: 'medium'
  },
  decorations: {
    accentLine: false,
    dividers: 'none',
    dropCap: false,
    svgDecorations: true,
    dropCapStyle: null,
    titleUnderline: null
  },
  imageEffects: {
    hover: 'none',
    overlay: 'none',
    border: false
  },
  archetype: 'modern',
  contrast: 'medium'
}

/**
 * Generate tokens from legacy styles object
 * Used for backward compatibility with custom templates that only have styles
 */
export function generateTokensFromStyles(styles) {
  if (!styles) return null

  const s = styles

  // Extract colors from the old styles format
  const bgColor = s.container?.backgroundColor || s.background?.gradient?.stops?.[0]?.color || '#ffffff'
  const textColor = s.container?.color || s.title?.color || '#1a1a1a'
  const mutedColor = s.text?.color || '#666666'

  // Determine if dark mode based on background color
  const isDarkBg = bgColor.startsWith('#0') || bgColor.startsWith('#1') || bgColor.startsWith('#2') ||
                   bgColor === 'transparent' || (s.background?.gradient && s.container?.color === '#ffffff')

  return {
    ...DEFAULT_TOKENS,
    colors: {
      primary: isDarkBg ? '#ffffff' : textColor,
      secondary: isDarkBg ? '#d1d5db' : mutedColor,
      accent: '#3b82f6',
      background: isDarkBg ? '#111827' : (bgColor === 'transparent' ? '#111827' : bgColor),
      surface: isDarkBg ? '#1f2937' : '#f8f8f8'
    },
    typography: {
      headingFont: s.container?.fontFamily?.split(',')[0]?.replace(/['"]/g, '') || 'Inter',
      bodyFont: s.container?.fontFamily?.split(',')[0]?.replace(/['"]/g, '') || 'Inter',
      scale: 'normal'
    },
    mode: isDarkBg ? 'dark' : 'light'
  }
}

/**
 * Resolve tokens from various sources with priority:
 * 1. Explicit tokens (propsTokens)
 * 2. Template tokens (from template lookup)
 * 3. Generated from legacy styles (for backward compatibility)
 * 4. Default tokens
 */
export function resolveTokens(propsTokens, templateId, getTemplateById, builtInTemplates) {
  // 1. Props tokens take priority
  if (propsTokens) {
    return propsTokens
  }

  // 2. Get from template lookup
  const template = getTemplateById(templateId)

  if (template?.tokens) {
    return template.tokens
  }

  // 3. For custom templates without tokens, generate from styles
  if (template?.type === 'custom' && template?.styles) {
    const generated = generateTokensFromStyles(template.styles)
    if (generated) return generated
  }

  // 4. Direct lookup from builtInTemplates as fallback
  if (builtInTemplates) {
    const directLookup = builtInTemplates.find(t => t.id === templateId)
    if (directLookup?.tokens) {
      return directLookup.tokens
    }
  }

  return DEFAULT_TOKENS
}

/**
 * Composable for reactive token resolution
 * Use in components that need to compute tokens based on props
 */
export function useTokenResolver(propsTokensGetter, templateIdGetter) {
  const { getTemplateById, builtInTemplates } = useTemplates()

  const activeTokens = computed(() => {
    const propsTokens = typeof propsTokensGetter === 'function' ? propsTokensGetter() : propsTokensGetter?.value
    const templateId = typeof templateIdGetter === 'function' ? templateIdGetter() : templateIdGetter?.value

    return resolveTokens(propsTokens, templateId, getTemplateById, builtInTemplates.value)
  })

  return {
    activeTokens,
    DEFAULT_TOKENS
  }
}
