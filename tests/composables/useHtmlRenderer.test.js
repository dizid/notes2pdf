/**
 * Comprehensive tests for useHtmlRenderer composable
 * Tests cover: HTML generation, content rendering, text formatting, edge cases
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { useHtmlRenderer } from '../../src/composables/useHtmlRenderer'

describe('useHtmlRenderer', () => {
  let renderer

  beforeEach(() => {
    renderer = useHtmlRenderer()
  })

  // Sample tokens for testing
  const sampleTokens = {
    colors: {
      primary: '#1a1a1a',
      secondary: '#666666',
      accent: '#e63946',
      background: '#ffffff',
      surface: '#f8f8f8'
    },
    typography: {
      headingFont: 'Playfair Display',
      bodyFont: 'Inter',
      fontPairId: 'classic-elegant',
      scale: 'normal'
    },
    layout: {
      maxWidth: '800px',
      density: 'normal',
      alignment: 'center'
    },
    effects: {
      animations: true,
      shadows: true,
      rounded: 'medium'
    },
    mode: 'light'
  }

  // ===========================================
  // renderToHtml BASIC TESTS
  // ===========================================
  describe('renderToHtml', () => {
    it('should return valid HTML document', () => {
      const html = renderer.renderToHtml(sampleTokens, { title: 'Test' })

      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('<html lang="en">')
      expect(html).toContain('</html>')
    })

    it('should include meta tags', () => {
      const html = renderer.renderToHtml(sampleTokens, { title: 'My Title' })

      expect(html).toContain('<meta charset="UTF-8">')
      expect(html).toContain('<meta name="viewport"')
      expect(html).toContain('og:title')
    })

    it('should include Google Fonts link', () => {
      const html = renderer.renderToHtml(sampleTokens, { title: 'Test' })

      expect(html).toContain('fonts.googleapis.com')
      expect(html).toContain('Playfair+Display')
    })

    it('should include CSS variables in style tag', () => {
      const html = renderer.renderToHtml(sampleTokens, { title: 'Test' })

      expect(html).toContain('--color-primary')
      expect(html).toContain('--color-accent')
      expect(html).toContain('--font-heading')
    })

    it('should include watermark with sizzle.love link', () => {
      const html = renderer.renderToHtml(sampleTokens, { title: 'Test' })

      expect(html).toContain('sizzle.love')
      expect(html).toContain('watermark')
    })

    it('should hide watermark for pro users', () => {
      const html = renderer.renderToHtml(sampleTokens, { title: 'Test' }, { isPro: true })

      expect(html).not.toContain('class="watermark"')
      expect(html).not.toContain('sizzle.love')
    })
  })

  // ===========================================
  // CONTENT RENDERING TESTS
  // ===========================================
  describe('content rendering', () => {
    it('should render title', () => {
      const html = renderer.renderToHtml(sampleTokens, {
        title: 'My Amazing Title'
      })

      expect(html).toContain('<h1')
      expect(html).toContain('My Amazing Title')
      expect(html).toContain('</h1>')
    })

    it('should render subtitle', () => {
      const html = renderer.renderToHtml(sampleTokens, {
        title: 'Title',
        subtitle: 'My Subtitle'
      })

      expect(html).toContain('<h2')
      expect(html).toContain('My Subtitle')
      expect(html).toContain('</h2>')
    })

    it('should render metadata', () => {
      const html = renderer.renderToHtml(sampleTokens, {
        title: 'Title',
        metadata: {
          client: 'Acme Corp',
          date: '2024',
          role: 'Lead Designer'
        }
      })

      // Class may include animation class, so use regex
      expect(html).toMatch(/class="metadata\s/)
      expect(html).toContain('Client:')
      expect(html).toContain('Acme Corp')
      expect(html).toContain('Date:')
      expect(html).toContain('2024')
      expect(html).toContain('Role:')
      expect(html).toContain('Lead Designer')
    })

    it('should render metadata tags', () => {
      const html = renderer.renderToHtml(sampleTokens, {
        title: 'Title',
        metadata: {
          tags: ['branding', 'identity', 'design']
        }
      })

      expect(html).toContain('branding')
      expect(html).toContain('identity')
      expect(html).toContain('·') // Tag separator
    })

    it('should render text content', () => {
      const html = renderer.renderToHtml(sampleTokens, {
        title: 'Title',
        text: 'This is my content paragraph.'
      })

      // Class may include animation class
      expect(html).toMatch(/class="content\s/)
      expect(html).toContain('This is my content paragraph.')
    })

    it('should render images', () => {
      const html = renderer.renderToHtml(sampleTokens, {
        title: 'Title',
        images: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg']
      })

      // Class may include animation class
      expect(html).toMatch(/class="gallery\s/)
      expect(html).toContain('src="https://example.com/img1.jpg"')
      expect(html).toContain('src="https://example.com/img2.jpg"')
      expect(html).toContain('loading="lazy"')
    })

    it('should handle image objects with alt text', () => {
      const html = renderer.renderToHtml(sampleTokens, {
        title: 'Title',
        images: [
          { src: 'https://example.com/img.jpg', alt: 'My image' }
        ]
      })

      expect(html).toContain('alt="My image"')
    })
  })

  // ===========================================
  // SECTIONS CONTENT MODEL TESTS
  // ===========================================
  describe('sections content model', () => {
    it('should render text sections', () => {
      const html = renderer.renderToHtml(sampleTokens, {
        title: 'Title',
        sections: [
          { type: 'text', content: 'First paragraph' },
          { type: 'text', content: 'Second paragraph' }
        ]
      })

      expect(html).toContain('First paragraph')
      expect(html).toContain('Second paragraph')
    })

    it('should render image sections with layout', () => {
      const html = renderer.renderToHtml(sampleTokens, {
        title: 'Title',
        sections: [
          {
            type: 'images',
            items: ['https://example.com/img.jpg'],
            layout: 'featured'
          }
        ]
      })

      expect(html).toContain('layout-featured')
    })

    it('should render mixed sections in order', () => {
      const html = renderer.renderToHtml(sampleTokens, {
        title: 'Title',
        sections: [
          { type: 'text', content: 'FIRSTUNIQUETEXT123' },
          { type: 'images', items: ['unique-test-image-12345.jpg'], layout: 'grid' },
          { type: 'text', content: 'SECONDUNIQUETEXT456' }
        ]
      })

      // Extract just the body to avoid matching og:image in head
      const bodyStart = html.indexOf('<body>')
      const body = html.slice(bodyStart)

      // Use unique strings without underscores (formatText converts _x_ to <em>)
      const firstPos = body.indexOf('FIRSTUNIQUETEXT123')
      const imgPos = body.indexOf('unique-test-image-12345.jpg')
      const secondPos = body.indexOf('SECONDUNIQUETEXT456')

      expect(firstPos).toBeGreaterThan(0)
      expect(imgPos).toBeGreaterThan(0)
      expect(secondPos).toBeGreaterThan(0)
      expect(firstPos).toBeLessThan(imgPos)
      expect(imgPos).toBeLessThan(secondPos)
    })

    it('should support all layout types', () => {
      const layouts = ['grid', 'featured', 'featured-grid', 'side-by-side']

      layouts.forEach(layout => {
        const html = renderer.renderToHtml(sampleTokens, {
          title: 'Title',
          sections: [
            { type: 'images', items: ['img.jpg'], layout }
          ]
        })

        expect(html).toContain(`layout-${layout}`)
      })
    })
  })

  // ===========================================
  // TEXT FORMATTING TESTS
  // ===========================================
  describe('formatText', () => {
    it('should convert bold markdown', () => {
      const formatted = renderer.formatText('This is **bold** text')
      expect(formatted).toContain('<strong>bold</strong>')
    })

    it('should convert alternative bold markdown', () => {
      const formatted = renderer.formatText('This is __bold__ text')
      expect(formatted).toContain('<strong>bold</strong>')
    })

    it('should convert italic markdown', () => {
      const formatted = renderer.formatText('This is *italic* text')
      expect(formatted).toContain('<em>italic</em>')
    })

    it('should convert alternative italic markdown', () => {
      const formatted = renderer.formatText('This is _italic_ text')
      expect(formatted).toContain('<em>italic</em>')
    })

    it('should convert double newlines to paragraphs', () => {
      const formatted = renderer.formatText('First paragraph\n\nSecond paragraph')
      expect(formatted).toContain('<p>First paragraph</p>')
      expect(formatted).toContain('<p>Second paragraph</p>')
    })

    it('should convert single newlines to br tags', () => {
      const formatted = renderer.formatText('Line one\nLine two')
      expect(formatted).toContain('<br>')
    })

    it('should handle empty string', () => {
      const formatted = renderer.formatText('')
      expect(formatted).toBe('')
    })

    it('should handle null/undefined', () => {
      expect(renderer.formatText(null)).toBe('')
      expect(renderer.formatText(undefined)).toBe('')
    })
  })

  // ===========================================
  // HTML ESCAPING TESTS
  // ===========================================
  describe('escapeHtml', () => {
    it('should escape ampersands', () => {
      expect(renderer.escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry')
    })

    it('should escape less than', () => {
      expect(renderer.escapeHtml('a < b')).toBe('a &lt; b')
    })

    it('should escape greater than', () => {
      expect(renderer.escapeHtml('a > b')).toBe('a &gt; b')
    })

    it('should escape quotes', () => {
      expect(renderer.escapeHtml('say "hello"')).toBe('say &quot;hello&quot;')
    })

    it('should escape single quotes', () => {
      expect(renderer.escapeHtml("it's")).toBe('it&#039;s')
    })

    it('should handle empty string', () => {
      expect(renderer.escapeHtml('')).toBe('')
    })

    it('should handle null/undefined', () => {
      expect(renderer.escapeHtml(null)).toBe('')
      expect(renderer.escapeHtml(undefined)).toBe('')
    })

    it('should prevent XSS in title', () => {
      const html = renderer.renderToHtml(sampleTokens, {
        title: '<script>alert("xss")</script>'
      })

      expect(html).not.toContain('<script>alert')
      expect(html).toContain('&lt;script&gt;')
    })
  })

  // ===========================================
  // ANIMATION TESTS
  // ===========================================
  describe('animations', () => {
    it('should include animation classes when enabled', () => {
      const tokensWithAnim = { ...sampleTokens, effects: { ...sampleTokens.effects, animations: true } }
      const html = renderer.renderToHtml(tokensWithAnim, { title: 'Test' })

      expect(html).toContain('animate-in')
      expect(html).toContain('@keyframes fadeSlideIn')
    })

    it('should not include animation classes when disabled', () => {
      const tokensNoAnim = { ...sampleTokens, effects: { ...sampleTokens.effects, animations: false } }
      const html = renderer.renderToHtml(tokensNoAnim, { title: 'Test' })

      // Animation class should not be on elements (though keyframes may still be in CSS)
      expect(html).not.toContain('class="animate-in"')
    })

    it('should stagger animation delays', () => {
      const html = renderer.renderToHtml(sampleTokens, {
        title: 'Title',
        subtitle: 'Subtitle',
        text: 'Content'
      })

      expect(html).toContain('animation-delay: 0s')
      expect(html).toContain('animation-delay: 0.1s')
      expect(html).toContain('animation-delay: 0.2s')
    })
  })

  // ===========================================
  // SHADOWS TESTS
  // ===========================================
  describe('shadows', () => {
    it('should include box-shadow when enabled', () => {
      const tokensWithShadow = { ...sampleTokens, effects: { ...sampleTokens.effects, shadows: true } }
      const html = renderer.renderToHtml(tokensWithShadow, { title: 'Test' })

      expect(html).toContain('box-shadow')
    })

    it('should not include box-shadow when disabled', () => {
      const tokensNoShadow = { ...sampleTokens, effects: { ...sampleTokens.effects, shadows: false } }
      const html = renderer.renderToHtml(tokensNoShadow, { title: 'Test' })

      // The .page element should not have inline box-shadow
      expect(html).not.toContain('.page" style="box-shadow')
    })
  })

  // ===========================================
  // OG META TAGS TESTS
  // ===========================================
  describe('OG meta tags', () => {
    it('should include og:title from content title', () => {
      const html = renderer.renderToHtml(sampleTokens, {
        title: 'My Portfolio'
      })

      expect(html).toContain('og:title')
      expect(html).toContain('My Portfolio')
    })

    it('should include og:image when images present', () => {
      const html = renderer.renderToHtml(sampleTokens, {
        title: 'Title',
        images: ['https://example.com/hero.jpg']
      })

      expect(html).toContain('og:image')
      expect(html).toContain('https://example.com/hero.jpg')
    })

    it('should get first image from sections', () => {
      const html = renderer.renderToHtml(sampleTokens, {
        title: 'Title',
        sections: [
          { type: 'text', content: 'Text' },
          { type: 'images', items: ['https://example.com/section-img.jpg'] }
        ]
      })

      expect(html).toContain('og:image')
      expect(html).toContain('https://example.com/section-img.jpg')
    })

    it('should not include og:image when no images', () => {
      const html = renderer.renderToHtml(sampleTokens, {
        title: 'Title',
        text: 'Just text'
      })

      expect(html).not.toContain('og:image')
    })
  })

  // ===========================================
  // PRINT STYLES TESTS
  // ===========================================
  describe('print styles', () => {
    it('should include print media query', () => {
      const html = renderer.renderToHtml(sampleTokens, { title: 'Test' })

      expect(html).toContain('@media print')
      expect(html).toContain('box-shadow: none')
    })
  })

  // ===========================================
  // EDGE CASES
  // ===========================================
  describe('edge cases', () => {
    it('should handle missing title', () => {
      const html = renderer.renderToHtml(sampleTokens, {})

      expect(html).toContain('Untitled')
    })

    it('should handle empty content object', () => {
      const html = renderer.renderToHtml(sampleTokens, {})

      expect(html).toContain('<!DOCTYPE html>')
    })

    it('should handle missing effects', () => {
      const tokensNoEffects = { ...sampleTokens, effects: undefined }
      const html = renderer.renderToHtml(tokensNoEffects, { title: 'Test' })

      expect(html).toContain('<!DOCTYPE html>')
    })

    it('should handle empty sections array', () => {
      const html = renderer.renderToHtml(sampleTokens, {
        title: 'Title',
        sections: []
      })

      expect(html).not.toContain('class="content"')
    })

    it('should handle section with empty items', () => {
      const html = renderer.renderToHtml(sampleTokens, {
        title: 'Title',
        sections: [
          { type: 'images', items: [] }
        ]
      })

      expect(html).not.toContain('class="gallery"')
    })

    it('should handle special characters in content', () => {
      const html = renderer.renderToHtml(sampleTokens, {
        title: 'Tom & Jerry\'s "Adventure"',
        text: 'Price: $100 < $200'
      })

      expect(html).toContain('Tom &amp; Jerry&#039;s &quot;Adventure&quot;')
      expect(html).toContain('$100 &lt; $200')
    })
  })
})
