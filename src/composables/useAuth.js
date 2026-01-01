import { ref, computed, onMounted } from 'vue'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

// Global auth state (singleton)
const user = ref(null)
const session = ref(null)
const loading = ref(true)
const error = ref(null)
let initialized = false

/**
 * Composable for authentication with Supabase
 */
export function useAuth() {
  const isAuthenticated = computed(() => Boolean(user.value))
  const isConfigured = computed(() => isSupabaseConfigured())

  /**
   * Initialize auth state listener
   * Called once on app mount
   */
  async function initAuth() {
    if (initialized || !supabase) {
      loading.value = false
      return
    }
    initialized = true

    try {
      // Get initial session
      const { data: { session: initialSession } } = await supabase.auth.getSession()
      session.value = initialSession
      user.value = initialSession?.user ?? null

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, newSession) => {
        session.value = newSession
        user.value = newSession?.user ?? null
      })
    } catch (err) {
      console.error('Auth init error:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  /**
   * Sign in with email and password
   */
  async function signIn(email, password) {
    if (!supabase) {
      error.value = 'Authentication not configured'
      return { error: error.value }
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) throw authError

      return { data, error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Sign up with email and password
   */
  async function signUp(email, password) {
    if (!supabase) {
      error.value = 'Authentication not configured'
      return { error: error.value }
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password
      })

      if (authError) throw authError

      return { data, error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Sign in with Google OAuth
   */
  async function signInWithGoogle() {
    if (!supabase) {
      error.value = 'Authentication not configured'
      return { error: error.value }
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app`
        }
      })

      if (authError) throw authError

      return { data, error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Sign out
   */
  async function signOut() {
    if (!supabase) return

    loading.value = true
    error.value = null

    try {
      const { error: authError } = await supabase.auth.signOut()
      if (authError) throw authError

      user.value = null
      session.value = null
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  /**
   * Reset password (send reset email)
   */
  async function resetPassword(email) {
    if (!supabase) {
      error.value = 'Authentication not configured'
      return { error: error.value }
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/app/reset-password`
      })

      if (authError) throw authError

      return { data, error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Update password (for logged in user)
   */
  async function updatePassword(newPassword) {
    if (!supabase) {
      error.value = 'Authentication not configured'
      return { error: error.value }
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: authError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (authError) throw authError

      return { data, error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Get user profile from profiles table
   */
  async function getProfile() {
    if (!supabase || !user.value) {
      return { data: null, error: 'Not authenticated' }
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()

      if (fetchError) throw fetchError

      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  /**
   * Update user profile
   */
  async function updateProfile({ fullName, avatarUrl: newAvatarUrl }) {
    if (!supabase || !user.value) {
      return { error: 'Not authenticated' }
    }

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          avatar_url: newAvatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.value.id)

      if (updateError) throw updateError

      return { error: null }
    } catch (err) {
      return { error: err.message }
    }
  }

  /**
   * Get user's display name or email
   */
  const displayName = computed(() => {
    if (!user.value) return null
    return user.value.user_metadata?.full_name ||
           user.value.user_metadata?.name ||
           user.value.email?.split('@')[0] ||
           'User'
  })

  /**
   * Get user's avatar URL
   */
  const avatarUrl = computed(() => {
    if (!user.value) return null
    return user.value.user_metadata?.avatar_url ||
           user.value.user_metadata?.picture ||
           null
  })

  // Auto-init on first use
  onMounted(() => {
    if (!initialized) {
      initAuth()
    }
  })

  return {
    // State
    user,
    session,
    loading,
    error,
    isAuthenticated,
    isConfigured,
    displayName,
    avatarUrl,

    // Actions
    initAuth,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    getProfile,
    updateProfile
  }
}
