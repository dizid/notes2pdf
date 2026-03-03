/**
 * Authentication utilities for Netlify functions
 * Verifies Supabase JWT tokens from Authorization header
 */
import { createClient } from '@supabase/supabase-js'
import { errorResponse } from './validate.js'

// Lazy-init Supabase admin client (singleton)
let _supabase = null

function getSupabase() {
  if (!_supabase) {
    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (url && key) {
      _supabase = createClient(url, key)
    }
  }
  return _supabase
}

/**
 * Extract Bearer token from Authorization header
 * @param {object} event - Netlify function event
 * @returns {string|null} JWT token or null
 */
function extractToken(event) {
  const authHeader = event.headers?.authorization || event.headers?.Authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.slice(7).trim()
}

/**
 * Verify authentication and return user
 * @param {object} event - Netlify function event
 * @returns {{ user: object|null, error: object|null }}
 */
export async function requireAuth(event) {
  const supabase = getSupabase()

  if (!supabase) {
    console.error('Auth: Supabase not configured')
    return {
      user: null,
      error: errorResponse(500, 'Authentication service not configured')
    }
  }

  const token = extractToken(event)
  if (!token) {
    return {
      user: null,
      error: errorResponse(401, 'Authentication required', 'AUTH_REQUIRED')
    }
  }

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return {
        user: null,
        error: errorResponse(401, 'Invalid or expired token', 'AUTH_INVALID')
      }
    }

    return { user, error: null }
  } catch (err) {
    console.error('Auth verification error:', err.message)
    return {
      user: null,
      error: errorResponse(401, 'Authentication failed', 'AUTH_INVALID')
    }
  }
}
