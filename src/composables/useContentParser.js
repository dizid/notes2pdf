import { ref } from 'vue'

/**
 * Composable for parsing unstructured notes into structured content
 * Uses Claude API to extract title, body, highlights, and suggest archetypes
 */
export function useContentParser() {
  const isParsing = ref(false)
  const parseError = ref(null)
  const parsedContent = ref(null)

  /**
   * Parse raw unstructured text into structured content
   * @param {string} rawText - The raw notes/text to parse
   * @returns {Promise<object|null>} Parsed content or null on error
   */
  async function parseContent(rawText) {
    // Validate input
    if (!rawText || typeof rawText !== 'string') {
      parseError.value = 'Please enter some text to parse'
      return null
    }

    const trimmed = rawText.trim()
    if (trimmed.length < 20) {
      parseError.value = 'Please enter at least 20 characters'
      return null
    }

    isParsing.value = true
    parseError.value = null

    try {
      const response = await fetch('/.netlify/functions/parse-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: trimmed })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to parse content')
      }

      const data = await response.json()
      parsedContent.value = data
      return data

    } catch (err) {
      parseError.value = err.message || 'An error occurred while parsing'
      console.error('Content parsing error:', err)
      return null
    } finally {
      isParsing.value = false
    }
  }

  /**
   * Clear the parsed content and error state
   */
  function clearParsed() {
    parsedContent.value = null
    parseError.value = null
  }

  /**
   * Update a field in the parsed content (for editing)
   * @param {string} field - Field name (title, subtitle, body)
   * @param {string} value - New value
   */
  function updateParsedField(field, value) {
    if (parsedContent.value && field in parsedContent.value) {
      parsedContent.value = {
        ...parsedContent.value,
        [field]: value
      }
    }
  }

  return {
    // State
    isParsing,
    parseError,
    parsedContent,

    // Actions
    parseContent,
    clearParsed,
    updateParsedField
  }
}
