import { ref } from 'vue'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

/**
 * Composable for fetching page analytics
 */
export function useAnalytics() {
  const loading = ref(false)
  const error = ref(null)

  /**
   * Get view stats for a specific slug
   * @param {string} slug - The page slug
   * @returns {Promise<{total_views: number, last_viewed_at: string|null}>}
   */
  async function getPageStats(slug) {
    if (!isSupabaseConfigured() || !slug) {
      return { total_views: 0, last_viewed_at: null }
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('page_stats')
        .select('total_views, last_viewed_at')
        .eq('slug', slug.toLowerCase())
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Failed to fetch page stats:', fetchError)
        return { total_views: 0, last_viewed_at: null }
      }

      return data || { total_views: 0, last_viewed_at: null }
    } catch (e) {
      console.error('Analytics error:', e)
      return { total_views: 0, last_viewed_at: null }
    }
  }

  /**
   * Get view stats for multiple slugs
   * @param {string[]} slugs - Array of page slugs
   * @returns {Promise<Object>} Map of slug -> stats
   */
  async function getMultiplePageStats(slugs) {
    if (!isSupabaseConfigured() || !slugs?.length) {
      return {}
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('page_stats')
        .select('slug, total_views, last_viewed_at')
        .in('slug', slugs.map(s => s.toLowerCase()))

      if (fetchError) {
        throw fetchError
      }

      // Convert to map
      const statsMap = {}
      for (const item of (data || [])) {
        statsMap[item.slug] = {
          total_views: item.total_views,
          last_viewed_at: item.last_viewed_at
        }
      }

      return statsMap
    } catch (e) {
      console.error('Analytics error:', e)
      error.value = e.message
      return {}
    } finally {
      loading.value = false
    }
  }

  /**
   * Get recent views for a user's pages
   * @param {string} userId - The user ID
   * @param {number} limit - Max number of views to return
   * @returns {Promise<Array>} Recent view records
   */
  async function getRecentViews(userId, limit = 50) {
    if (!isSupabaseConfigured() || !userId) {
      return []
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('page_views')
        .select('slug, viewed_at, referrer, country')
        .eq('user_id', userId)
        .order('viewed_at', { ascending: false })
        .limit(limit)

      if (fetchError) {
        throw fetchError
      }

      return data || []
    } catch (e) {
      console.error('Failed to fetch recent views:', e)
      return []
    }
  }

  /**
   * Get aggregated stats for a user
   * @param {string} userId - The user ID
   * @returns {Promise<{total_views: number, total_pages: number}>}
   */
  async function getUserStats(userId) {
    if (!isSupabaseConfigured() || !userId) {
      return { total_views: 0, total_pages: 0 }
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('page_stats')
        .select('total_views')
        .eq('user_id', userId)

      if (fetchError) {
        throw fetchError
      }

      const total_views = (data || []).reduce((sum, item) => sum + (item.total_views || 0), 0)
      const total_pages = (data || []).length

      return { total_views, total_pages }
    } catch (e) {
      console.error('Failed to fetch user stats:', e)
      return { total_views: 0, total_pages: 0 }
    }
  }

  /**
   * Extract slug from published URL
   * @param {string} url - The published URL
   * @returns {string|null} The slug
   */
  function extractSlugFromUrl(url) {
    if (!url) return null
    try {
      const urlObj = new URL(url)
      const path = urlObj.pathname
      // Remove leading slash and .html extension
      const slug = path.replace(/^\//, '').replace(/\.html$/, '')
      return slug || null
    } catch {
      return null
    }
  }

  return {
    loading,
    error,
    getPageStats,
    getMultiplePageStats,
    getRecentViews,
    getUserStats,
    extractSlugFromUrl
  }
}
