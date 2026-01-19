/**
 * Comprehensive tests for useDesignGenerator composable
 * Tests cover: token generation, font pair selection, edge cases, color handling
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { useDesignGenerator, FONT_PAIRS } from '../../src/composables/useDesignGenerator'

describe('useDesignGenerator', () => {
  let generator

  beforeEach(() => {
    generator = useDesignGenerator()
  })

  // ===========================================
  // FONT_PAIRS EXPORT TESTS
  // ===========================================
  describe('FONT_PAIRS', () => {
    it('should export an array of font pairs', () => {
      expect(Array.isArray(FONT_PAIRS)).toBe(true)
      expect(FONT_PAIRS.length).toBeGreaterThan(0)
    })

    it('each font pair should have required properties', () => {
      FONT_PAIRS.forEach(pair => {
        expect(pair).toHaveProperty('id')
        expect(pair).toHaveProperty('name')
        expect(pair).toHaveProperty('heading')
        expect(pair).toHaveProperty('body')
        expect(pair).toHaveProperty('mood')
      })
    })

    it('should have unique IDs for all font pairs', () => {
      const ids = FONT_PAIRS.map(p => p.id)
      const uniqueIds = [...new Set(ids)]
      expect(ids.length).toBe(uniqueIds.length)
    })

    it('should include expected font pairs', () => {
      const ids = FONT_PAIRS.map(p => p.id)
      expect(ids).toContain('modern-minimal')
      expect(ids).toContain('classic-elegant')
      expect(ids).toContain('editorial-bold')
    })
  })

  // ===========================================
  // generateDesignTokens TESTS
  // ===========================================
  describe('generateDesignTokens', () => {
    it('should return tokens with all required properties', async () => {
      const tokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a', '#666666', '#e63946'],
        prompt: 'minimal'
      })

      // Check structure
      expect(tokens).toHaveProperty('colors')
      expect(tokens).toHaveProperty('typography')
      expect(tokens).toHaveProperty('layout')
      expect(tokens).toHaveProperty('effects')
      expect(tokens).toHaveProperty('mode')
    })

    it('should have correct color properties', async () => {
      const tokens = await generator.generateDesignTokens({
        colors: ['#ff0000', '#00ff00', '#0000ff']
      })

      expect(tokens.colors).toHaveProperty('primary')
      expect(tokens.colors).toHaveProperty('secondary')
      expect(tokens.colors).toHaveProperty('accent')
      expect(tokens.colors).toHaveProperty('background')
      expect(tokens.colors).toHaveProperty('surface')
    })

    it('should have correct typography properties', async () => {
      const tokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a']
      })

      expect(tokens.typography).toHaveProperty('headingFont')
      expect(tokens.typography).toHaveProperty('bodyFont')
      expect(tokens.typography).toHaveProperty('fontPairId')
      expect(tokens.typography).toHaveProperty('scale')
    })

    it('should have correct layout properties', async () => {
      const tokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a']
      })

      expect(tokens.layout).toHaveProperty('maxWidth')
      expect(tokens.layout).toHaveProperty('density')
      expect(tokens.layout).toHaveProperty('alignment')
    })

    it('should have correct effects properties', async () => {
      const tokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a']
      })

      expect(tokens.effects).toHaveProperty('animations')
      expect(tokens.effects).toHaveProperty('shadows')
      expect(tokens.effects).toHaveProperty('rounded')
    })
  })

  // ===========================================
  // PROMPT INTERPRETATION TESTS
  // ===========================================
  describe('prompt interpretation', () => {
    it('should detect minimal style from prompt', async () => {
      const tokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a'],
        prompt: 'minimal clean design'
      })

      // Minimal should disable animations
      expect(tokens.effects.animations).toBe(false)
      expect(tokens.effects.rounded).toBe('subtle')
    })

    it('should detect elegant style from prompt', async () => {
      const tokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a'],
        prompt: 'elegant sophisticated luxury'
      })

      // Should select classic-elegant font pair
      expect(tokens.typography.fontPairId).toBe('classic-elegant')
    })

    it('should detect bold style from prompt', async () => {
      const tokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a'],
        prompt: 'bold dramatic impact'
      })

      expect(tokens.typography.fontPairId).toBe('bold-display')
    })

    it('should detect modern/tech style from prompt', async () => {
      const tokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a'],
        prompt: 'modern tech startup'
      })

      expect(tokens.typography.fontPairId).toBe('tech')
    })

    it('should detect playful style from prompt', async () => {
      const tokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a'],
        prompt: 'playful fun creative'
      })

      expect(tokens.typography.fontPairId).toBe('creative')
      expect(tokens.effects.rounded).toBe('full')
    })

    it('should detect dark mode from prompt', async () => {
      const tokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a'],
        prompt: 'dark moody night'
      })

      expect(tokens.mode).toBe('dark')
      expect(tokens.colors.background).toBe('#0f0f0f')
    })
  })

  // ===========================================
  // FONT PAIR SELECTION TESTS
  // ===========================================
  describe('font pair selection', () => {
    it('should use explicit fontPairId when provided', async () => {
      const tokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a'],
        fontPairId: 'literary'
      })

      expect(tokens.typography.fontPairId).toBe('literary')
      expect(tokens.typography.headingFont).toBe('Cormorant Garamond')
    })

    it('should default to geometric (modern archetype) when no prompt or fontPairId', async () => {
      const tokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a']
      })

      // Default archetype is 'modern' which uses 'geometric' font pair
      expect(tokens.typography.fontPairId).toBe('geometric')
    })

    it('should prioritize explicit fontPairId over prompt', async () => {
      const tokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a'],
        prompt: 'elegant sophisticated', // Would normally select classic-elegant
        fontPairId: 'tech' // But explicit selection takes priority
      })

      expect(tokens.typography.fontPairId).toBe('tech')
    })
  })

  // ===========================================
  // DENSITY TESTS
  // ===========================================
  describe('density handling', () => {
    it('should use normal density by default', async () => {
      const tokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a']
      })

      expect(tokens.layout.density).toBe('normal')
      expect(tokens.typography.scale).toBe('normal')
    })

    it('should handle compact density', async () => {
      const tokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a'],
        density: 'compact'
      })

      expect(tokens.layout.density).toBe('compact')
      expect(tokens.typography.scale).toBe('small')
    })

    it('should handle spacious density', async () => {
      const tokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a'],
        density: 'spacious'
      })

      expect(tokens.layout.density).toBe('spacious')
      expect(tokens.typography.scale).toBe('large')
    })
  })

  // ===========================================
  // EDGE CASES
  // ===========================================
  describe('edge cases', () => {
    it('should handle empty colors array', async () => {
      const tokens = await generator.generateDesignTokens({
        colors: []
      })

      // Should use default colors
      expect(tokens.colors.primary).toBeDefined()
      expect(tokens.colors.secondary).toBeDefined()
    })

    it('should handle undefined colors', async () => {
      const tokens = await generator.generateDesignTokens({})

      expect(tokens.colors.primary).toBeDefined()
    })

    it('should handle undefined prompt', async () => {
      const tokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a']
      })

      expect(tokens.typography.fontPairId).toBeDefined()
    })

    it('should handle empty prompt', async () => {
      const tokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a'],
        prompt: ''
      })

      expect(tokens.typography.fontPairId).toBeDefined()
    })

    it('should handle single color', async () => {
      const tokens = await generator.generateDesignTokens({
        colors: ['#ff0000']
      })

      expect(tokens.colors.primary).toBeDefined()
      expect(tokens.colors.accent).toBeDefined()
    })
  })

  // ===========================================
  // tokensToCssVars TESTS
  // ===========================================
  describe('tokensToCssVars', () => {
    it('should convert tokens to CSS custom properties', async () => {
      const tokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a', '#666666', '#e63946']
      })

      const cssVars = generator.tokensToCssVars(tokens)

      expect(cssVars).toHaveProperty('--color-primary')
      expect(cssVars).toHaveProperty('--color-secondary')
      expect(cssVars).toHaveProperty('--color-accent')
      expect(cssVars).toHaveProperty('--color-background')
      expect(cssVars).toHaveProperty('--color-surface')
      expect(cssVars).toHaveProperty('--font-heading')
      expect(cssVars).toHaveProperty('--font-body')
      expect(cssVars).toHaveProperty('--spacing')
      expect(cssVars).toHaveProperty('--radius')
    })

    it('should format font families correctly', async () => {
      const tokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a'],
        fontPairId: 'classic-elegant'
      })

      const cssVars = generator.tokensToCssVars(tokens)

      expect(cssVars['--font-heading']).toContain('Playfair Display')
      expect(cssVars['--font-heading']).toContain('serif')
    })

    it('should use correct spacing for density', async () => {
      const compactTokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a'],
        density: 'compact'
      })
      const spaciousTokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a'],
        density: 'spacious'
      })

      const compactCss = generator.tokensToCssVars(compactTokens)
      const spaciousCss = generator.tokensToCssVars(spaciousTokens)

      expect(compactCss['--spacing']).toBe('1rem')
      expect(spaciousCss['--spacing']).toBe('2.5rem')
    })

    it('should use correct radius for rounded setting', async () => {
      const minimalTokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a'],
        prompt: 'minimal'
      })
      const playfulTokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a'],
        prompt: 'playful'
      })

      const minimalCss = generator.tokensToCssVars(minimalTokens)
      const playfulCss = generator.tokensToCssVars(playfulTokens)

      expect(minimalCss['--radius']).toBe('4px')
      expect(playfulCss['--radius']).toBe('16px')
    })
  })

  // ===========================================
  // getGoogleFontsUrl TESTS
  // ===========================================
  describe('getGoogleFontsUrl', () => {
    it('should generate valid Google Fonts URL', async () => {
      const tokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a'],
        fontPairId: 'classic-elegant'
      })

      const url = generator.getGoogleFontsUrl(tokens)

      expect(url).toContain('fonts.googleapis.com')
      expect(url).toContain('Playfair+Display')
      expect(url).toContain('Source+Sans+3')
    })

    it('should handle same heading and body font', async () => {
      const tokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a'],
        fontPairId: 'modern-minimal' // Inter for both
      })

      const url = generator.getGoogleFontsUrl(tokens)

      expect(url).toContain('Inter')
      // Should not duplicate the font
      expect(url.match(/Inter/g).length).toBe(1)
    })

    it('should include font weights', async () => {
      const tokens = await generator.generateDesignTokens({
        colors: ['#1a1a1a']
      })

      const url = generator.getGoogleFontsUrl(tokens)

      expect(url).toContain('wght@')
      expect(url).toContain('display=swap')
    })
  })

  // ===========================================
  // STATE MANAGEMENT TESTS
  // ===========================================
  describe('state management', () => {
    it('should expose isGenerating ref', () => {
      expect(generator.isGenerating).toBeDefined()
      expect(generator.isGenerating.value).toBe(false)
    })

    it('should expose error ref', () => {
      expect(generator.error).toBeDefined()
      expect(generator.error.value).toBe(null)
    })
  })
})
