import { ref, computed } from 'vue'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from './useAuth'

// Constants
const FREE_TIER_LIMIT = 1
const STORAGE_KEY = 'sizzle_usage'

// Global state
const usage = ref(null)
const loading = ref(false)
const error = ref(null)

/**
 * Composable for paywall/quota management
 */
export function usePaywall() {
  const { user, isAuthenticated } = useAuth()

  const isPro = computed(() => usage.value?.is_pro || false)
  const usageCount = computed(() => usage.value?.shares_this_month || 0)
  const usageLimit = computed(() => isPro.value ? Infinity : FREE_TIER_LIMIT)
  const usageRemaining = computed(() => Math.max(0, usageLimit.value - usageCount.value))
  const canPublish = computed(() => isPro.value || usageCount.value < FREE_TIER_LIMIT)

  /**
   * Get current month string (YYYY-MM)
   */
  function getCurrentMonth() {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  }

  /**
   * Load usage from localStorage (for anonymous users)
   */
  function loadLocalUsage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        // Reset if new month
        if (data.month_year !== getCurrentMonth()) {
          return {
            shares_this_month: 0,
            month_year: getCurrentMonth(),
            is_pro: false
          }
        }
        return data
      }
    } catch (e) {
      console.error('Failed to load local usage:', e)
    }
    return {
      shares_this_month: 0,
      month_year: getCurrentMonth(),
      is_pro: false
    }
  }

  /**
   * Save usage to localStorage (for anonymous users)
   */
  function saveLocalUsage(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error('Failed to save local usage:', e)
    }
  }

  /**
   * Load usage from Supabase (for authenticated users)
   */
  async function loadSupabaseUsage() {
    if (!supabase || !user.value) return null

    try {
      const { data, error: fetchError } = await supabase
        .from('usage')
        .select('*')
        .eq('user_id', user.value.id)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 = no rows found, which is fine for new users
        throw fetchError
      }

      // Check if we need to reset for new month
      if (data && data.month_year !== getCurrentMonth()) {
        await supabase
          .from('usage')
          .update({
            shares_this_month: 0,
            month_year: getCurrentMonth()
          })
          .eq('user_id', user.value.id)

        return {
          ...data,
          shares_this_month: 0,
          month_year: getCurrentMonth()
        }
      }

      return data
    } catch (e) {
      console.error('Failed to load Supabase usage:', e)
      return null
    }
  }

  /**
   * Initialize or refresh usage data
   */
  async function initUsage() {
    loading.value = true
    error.value = null

    try {
      if (isSupabaseConfigured() && isAuthenticated.value) {
        // Load from Supabase for authenticated users
        const supabaseUsage = await loadSupabaseUsage()
        if (supabaseUsage) {
          usage.value = supabaseUsage
        } else {
          // Create initial record
          usage.value = {
            shares_this_month: 0,
            month_year: getCurrentMonth(),
            is_pro: false
          }
        }
      } else {
        // Use localStorage for anonymous users
        usage.value = loadLocalUsage()
      }
    } catch (e) {
      error.value = e.message
      // Fallback to local storage
      usage.value = loadLocalUsage()
    } finally {
      loading.value = false
    }
  }

  /**
   * Increment usage count after successful publish
   */
  async function incrementUsage() {
    if (!usage.value) {
      await initUsage()
    }

    const newCount = (usage.value?.shares_this_month || 0) + 1

    if (isSupabaseConfigured() && isAuthenticated.value && user.value) {
      try {
        const { error: upsertError } = await supabase
          .from('usage')
          .upsert({
            user_id: user.value.id,
            shares_this_month: newCount,
            month_year: getCurrentMonth(),
            is_pro: usage.value?.is_pro || false
          })

        if (upsertError) throw upsertError
      } catch (e) {
        console.error('Failed to update Supabase usage:', e)
      }
    }

    // Always update local state and storage
    usage.value = {
      ...usage.value,
      shares_this_month: newCount,
      month_year: getCurrentMonth()
    }
    saveLocalUsage(usage.value)
  }

  /**
   * Check if user can publish (returns true if allowed)
   */
  function checkCanPublish() {
    if (!usage.value) {
      // Optimistically allow if we haven't loaded yet
      return true
    }
    return canPublish.value
  }

  /**
   * Create Stripe checkout session (one-time payment)
   * @returns {Promise<string|null>} Checkout URL or null on error
   */
  async function createCheckout() {
    if (!isAuthenticated.value) {
      error.value = 'Please sign in to upgrade'
      return null
    }

    loading.value = true
    error.value = null

    try {
      const response = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.value?.id,
          email: user.value?.email,
          returnUrl: window.location.origin + '/app'
        })
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to create checkout session')
      }

      const { url } = await response.json()
      return url
    } catch (e) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Open Stripe Customer Portal (for managing subscription)
   */
  async function openCustomerPortal() {
    if (!isAuthenticated.value) {
      error.value = 'Please sign in to manage subscription'
      return null
    }

    loading.value = true
    error.value = null

    try {
      const response = await fetch('/.netlify/functions/create-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.value?.id,
          returnUrl: window.location.origin + '/app'
        })
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to create portal session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  /**
   * Refresh pro status (after webhook or checkout)
   */
  async function refreshProStatus() {
    await initUsage()
  }

  return {
    // State
    usage,
    loading,
    error,

    // Computed
    isPro,
    usageCount,
    usageLimit,
    usageRemaining,
    canPublish,

    // Actions
    initUsage,
    incrementUsage,
    checkCanPublish,
    createCheckout,
    openCustomerPortal,
    refreshProStatus,

    // Constants
    FREE_TIER_LIMIT
  }
}
