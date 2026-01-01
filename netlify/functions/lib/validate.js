/**
 * Input validation utilities for Netlify functions
 * Provides size limits, type checking, and sanitization
 */

// Size limits (in bytes/characters)
export const LIMITS = {
  MAX_TITLE_LENGTH: 500,
  MAX_TEXT_LENGTH: 50000,      // 50KB of text
  MAX_PROMPT_LENGTH: 2000,
  MAX_IMAGES: 10,
  MAX_IMAGE_DATA_SIZE: 5000000, // 5MB per image
  MAX_COLORS: 20,
  MAX_JSON_DEPTH: 10,
  MAX_ARRAY_LENGTH: 100
}

/**
 * Safely parse JSON with error handling
 * @param {string} body - JSON string to parse
 * @returns {{ data: any, error: string|null }}
 */
export function safeJsonParse(body) {
  if (!body || typeof body !== 'string') {
    return { data: null, error: 'Request body is required' }
  }

  // Check body size (10MB max)
  if (body.length > 10 * 1024 * 1024) {
    return { data: null, error: 'Request body too large' }
  }

  try {
    const data = JSON.parse(body)
    return { data, error: null }
  } catch {
    return { data: null, error: 'Invalid JSON in request body' }
  }
}

/**
 * Validate a string field
 * @param {any} value - Value to check
 * @param {string} name - Field name for error messages
 * @param {object} options - Validation options
 * @returns {string|null} Error message or null if valid
 */
export function validateString(value, name, options = {}) {
  const { required = false, maxLength = 10000, minLength = 0 } = options

  if (value === undefined || value === null || value === '') {
    return required ? `${name} is required` : null
  }

  if (typeof value !== 'string') {
    return `${name} must be a string`
  }

  if (value.length > maxLength) {
    return `${name} exceeds maximum length of ${maxLength} characters`
  }

  if (value.length < minLength) {
    return `${name} must be at least ${minLength} characters`
  }

  return null
}

/**
 * Validate an array field
 * @param {any} value - Value to check
 * @param {string} name - Field name for error messages
 * @param {object} options - Validation options
 * @returns {string|null} Error message or null if valid
 */
export function validateArray(value, name, options = {}) {
  const { required = false, maxLength = LIMITS.MAX_ARRAY_LENGTH } = options

  if (value === undefined || value === null) {
    return required ? `${name} is required` : null
  }

  if (!Array.isArray(value)) {
    return `${name} must be an array`
  }

  if (value.length > maxLength) {
    return `${name} exceeds maximum of ${maxLength} items`
  }

  return null
}

/**
 * Validate an object field
 * @param {any} value - Value to check
 * @param {string} name - Field name for error messages
 * @param {object} options - Validation options
 * @returns {string|null} Error message or null if valid
 */
export function validateObject(value, name, options = {}) {
  const { required = false } = options

  if (value === undefined || value === null) {
    return required ? `${name} is required` : null
  }

  if (typeof value !== 'object' || Array.isArray(value)) {
    return `${name} must be an object`
  }

  return null
}

/**
 * Validate content object for HTML generation
 * @param {any} content - Content object
 * @returns {string|null} Error message or null if valid
 */
export function validateContent(content) {
  const objError = validateObject(content, 'content', { required: true })
  if (objError) return objError

  // At least one of title or text must be present
  if (!content.title && !content.text) {
    return 'Content must have at least a title or text'
  }

  const titleError = validateString(content.title, 'content.title', {
    maxLength: LIMITS.MAX_TITLE_LENGTH
  })
  if (titleError) return titleError

  const textError = validateString(content.text, 'content.text', {
    maxLength: LIMITS.MAX_TEXT_LENGTH
  })
  if (textError) return textError

  // Validate images if present
  if (content.images !== undefined) {
    const imagesError = validateArray(content.images, 'content.images', {
      maxLength: LIMITS.MAX_IMAGES
    })
    if (imagesError) return imagesError

    // Check each image data size
    for (let i = 0; i < content.images.length; i++) {
      const img = content.images[i]
      const imgData = img?.data || img?.src || img?.url || ''
      if (typeof imgData === 'string' && imgData.length > LIMITS.MAX_IMAGE_DATA_SIZE) {
        return `Image ${i + 1} data exceeds maximum size of ${LIMITS.MAX_IMAGE_DATA_SIZE / 1000000}MB`
      }
    }
  }

  return null
}

/**
 * Validate design tokens
 * @param {any} tokens - Tokens object
 * @returns {string|null} Error message or null if valid
 */
export function validateTokens(tokens) {
  if (tokens === undefined || tokens === null) {
    return null // tokens are optional
  }

  return validateObject(tokens, 'tokens')
}

/**
 * Validate colors array for design generation
 * @param {any} colors - Colors array
 * @returns {string|null} Error message or null if valid
 */
export function validateColors(colors) {
  const arrError = validateArray(colors, 'colors', { maxLength: LIMITS.MAX_COLORS })
  if (arrError) return arrError

  if (colors) {
    for (let i = 0; i < colors.length; i++) {
      if (typeof colors[i] !== 'string') {
        return `colors[${i}] must be a string`
      }
      // Basic hex color validation
      if (colors[i] && !colors[i].match(/^#[0-9A-Fa-f]{3,8}$/)) {
        return `colors[${i}] is not a valid hex color`
      }
    }
  }

  return null
}

/**
 * Create standard error response
 * @param {number} statusCode - HTTP status code
 * @param {string} error - Error message
 * @param {string} code - Optional error code
 * @returns {object} Netlify function response
 */
export function errorResponse(statusCode, error, code = null) {
  const body = { error }
  if (code) body.code = code

  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }
}

/**
 * Create standard success response
 * @param {any} data - Response data
 * @returns {object} Netlify function response
 */
export function successResponse(data) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }
}
