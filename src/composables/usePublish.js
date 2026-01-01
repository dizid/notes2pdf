import { ref } from 'vue'
import { useHtmlRenderer } from './useHtmlRenderer'

/**
 * Composable for publishing HTML content to Cloudflare R2
 */
export function usePublish() {
  const isPublishing = ref(false)
  const publishedUrl = ref(null)
  const publishError = ref(null)
  const publishErrorCode = ref(null)
  const generatedHtml = ref(null)
  const { renderToHtml } = useHtmlRenderer()

  /**
   * Generate beautiful HTML using AI (Claude API)
   * Falls back to local renderer if AI fails
   * @param {Object} tokens - Design tokens (colors, typography, etc.)
   * @param {Object} content - Content object (title, text, images)
   * @param {string} templateStyle - Optional template style hint
   * @returns {Promise<string>} Complete self-contained HTML
   */
  async function generateHtml(tokens, content, templateStyle = null) {
    try {
      // Try AI generation first
      const response = await fetch('/.netlify/functions/generate-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, tokens, templateStyle })
      })

      if (response.ok) {
        const { html } = await response.json()
        if (html && html.includes('<!DOCTYPE')) {
          console.log('Using AI-generated HTML')
          return html
        }
      }

      // Fall back to local renderer
      console.log('AI generation failed, using local renderer')
      return renderToHtml(tokens, content)
    } catch (err) {
      console.warn('AI HTML generation error, falling back to local:', err.message)
      return renderToHtml(tokens, content)
    }
  }

  /**
   * Generate HTML locally (synchronous fallback)
   */
  function generateHtmlLocal(tokens, content) {
    return renderToHtml(tokens, content)
  }

  /**
   * Upload HTML content to R2 and get public URL
   * @param {string} html - Self-contained HTML string
   * @param {string} title - Title for slug generation
   * @returns {Promise<string|null>} Public URL or null on error
   */
  async function upload(html, title) {
    isPublishing.value = true
    publishError.value = null
    publishedUrl.value = null

    try {
      const response = await fetch('/.netlify/functions/upload-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html, title })
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || `Upload failed: ${response.status}`)
      }

      const { url } = await response.json()
      publishedUrl.value = url
      return url
    } catch (err) {
      publishError.value = err.message
      return null
    } finally {
      isPublishing.value = false
    }
  }

  /**
   * Generate HTML from tokens + content and publish to R2
   * @param {Object} tokens - Design tokens
   * @param {Object} content - Content object
   * @param {string} templateStyle - Optional template style hint
   */
  async function publish(tokens, content, templateStyle = null) {
    // Set publishing state immediately (before AI generation which takes 10+ sec)
    isPublishing.value = true
    publishError.value = null
    publishErrorCode.value = null
    publishedUrl.value = null
    generatedHtml.value = null

    try {
      const html = await generateHtml(tokens, content, templateStyle)
      const title = content.title || 'page'

      // Store HTML for potential download fallback
      generatedHtml.value = html

      // Upload to R2
      const response = await fetch('/.netlify/functions/upload-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html, title })
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        publishErrorCode.value = data.code || null
        throw new Error(data.error || `Upload failed: ${response.status}`)
      }

      const { url } = await response.json()
      publishedUrl.value = url
      return url
    } catch (err) {
      publishError.value = err.message
      return null
    } finally {
      isPublishing.value = false
    }
  }

  /**
   * Copy URL to clipboard
   */
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  }

  /**
   * Reset publish state
   */
  function reset() {
    publishedUrl.value = null
    publishError.value = null
    publishErrorCode.value = null
    generatedHtml.value = null
  }

  /**
   * Download HTML as a file (fallback when cloud publishing unavailable)
   * @param {string} title - Title for filename
   */
  function downloadHtml(title = 'page') {
    if (!generatedHtml.value) return false

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 50) || 'page'

    const blob = new Blob([generatedHtml.value], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${slug}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    return true
  }

  return {
    generateHtml,
    generateHtmlLocal,
    upload,
    publish,
    copyToClipboard,
    downloadHtml,
    reset,
    isPublishing,
    publishedUrl,
    publishError,
    publishErrorCode,
    generatedHtml
  }
}
