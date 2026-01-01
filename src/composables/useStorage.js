import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from './useAuth'

const STORAGE_KEY = 'sizzle_history'

/**
 * History storage composable with Supabase sync
 * - Authenticated users: sync to Supabase + localStorage cache
 * - Anonymous users: localStorage only
 */
export function useStorage() {
  const { user, isAuthenticated } = useAuth()

  // ============================================
  // LOCAL STORAGE HELPERS
  // ============================================

  function getLocalHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  function saveToLocalHistory(item) {
    const history = getLocalHistory()
    history.unshift(item)
    const trimmed = history.slice(0, 50)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  }

  function deleteFromLocalHistory(id) {
    const history = getLocalHistory()
    const filtered = history.filter(item => item.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  }

  function clearLocalHistory() {
    localStorage.removeItem(STORAGE_KEY)
  }

  function getLocalHistoryItem(id) {
    const history = getLocalHistory()
    return history.find(item => item.id === id) || null
  }

  // ============================================
  // SUPABASE SYNC
  // ============================================

  /**
   * Get history - from Supabase if authenticated, localStorage otherwise
   */
  async function getHistory() {
    if (isSupabaseConfigured() && isAuthenticated.value && user.value) {
      try {
        const { data, error } = await supabase
          .from('history')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) {
          console.error('Failed to fetch history:', error)
          return getLocalHistory()
        }

        // Transform Supabase data to local format
        return (data || []).map(row => ({
          id: row.id,
          title: row.title,
          template: row.template,
          timestamp: new Date(row.created_at).getTime(),
          publishedUrl: row.published_url,
          content: {
            title: row.content_title,
            text: row.content_text,
            style: row.content_style
          }
        }))
      } catch (err) {
        console.error('History fetch error:', err)
        return getLocalHistory()
      }
    }
    return getLocalHistory()
  }

  /**
   * Save to history - Supabase + localStorage cache
   */
  async function saveToHistory(item) {
    // Always save locally as cache
    const localItem = {
      id: item.id || Date.now(),
      title: item.title || 'Untitled',
      template: item.template,
      timestamp: item.timestamp || Date.now(),
      publishedUrl: item.publishedUrl,
      content: item.content
    }
    saveToLocalHistory(localItem)

    // Sync to Supabase if authenticated
    if (isSupabaseConfigured() && isAuthenticated.value && user.value) {
      try {
        const { error } = await supabase.from('history').insert({
          user_id: user.value.id,
          title: item.title || 'Untitled',
          template: item.template,
          published_url: item.publishedUrl,
          content_title: item.content?.title,
          content_text: item.content?.text,
          content_style: item.content?.style
        })

        if (error) {
          console.error('Failed to save to Supabase:', error)
        }
      } catch (err) {
        console.error('History save error:', err)
      }
    }
  }

  /**
   * Delete from history
   */
  async function deleteFromHistory(id) {
    deleteFromLocalHistory(id)

    if (isSupabaseConfigured() && isAuthenticated.value && user.value) {
      try {
        const { error } = await supabase
          .from('history')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Failed to delete from Supabase:', error)
        }
      } catch (err) {
        console.error('History delete error:', err)
      }
    }
  }

  /**
   * Clear all history
   */
  async function clearHistory() {
    clearLocalHistory()

    if (isSupabaseConfigured() && isAuthenticated.value && user.value) {
      try {
        const { error } = await supabase
          .from('history')
          .delete()
          .eq('user_id', user.value.id)

        if (error) {
          console.error('Failed to clear Supabase history:', error)
        }
      } catch (err) {
        console.error('History clear error:', err)
      }
    }
  }

  /**
   * Load a specific history item for re-editing
   */
  async function loadFromHistory(id) {
    if (isSupabaseConfigured() && isAuthenticated.value && user.value) {
      try {
        const { data, error } = await supabase
          .from('history')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
          console.error('Failed to load from Supabase:', error)
          return getLocalHistoryItem(id)
        }

        return {
          id: data.id,
          title: data.title,
          template: data.template,
          timestamp: new Date(data.created_at).getTime(),
          publishedUrl: data.published_url,
          content: {
            title: data.content_title,
            text: data.content_text,
            style: data.content_style
          }
        }
      } catch (err) {
        console.error('History load error:', err)
        return getLocalHistoryItem(id)
      }
    }
    return getLocalHistoryItem(id)
  }

  /**
   * Migrate localStorage history to Supabase (call after login)
   */
  async function migrateLocalHistory() {
    if (!isSupabaseConfigured() || !isAuthenticated.value || !user.value) {
      return { migrated: 0 }
    }

    const local = getLocalHistory()
    if (local.length === 0) {
      return { migrated: 0 }
    }

    // Check if user already has Supabase history
    const { data: existing } = await supabase
      .from('history')
      .select('id')
      .eq('user_id', user.value.id)
      .limit(1)

    if (existing && existing.length > 0) {
      // User already has cloud history, don't migrate
      return { migrated: 0, skipped: 'existing_history' }
    }

    // Migrate local items to Supabase
    const rows = local.map(item => ({
      user_id: user.value.id,
      title: item.title || 'Untitled',
      template: item.template,
      published_url: item.publishedUrl,
      content_title: item.content?.title,
      content_text: item.content?.text,
      content_style: item.content?.style,
      created_at: new Date(item.timestamp || Date.now()).toISOString()
    }))

    const { error } = await supabase.from('history').insert(rows)

    if (error) {
      console.error('Migration failed:', error)
      return { migrated: 0, error: error.message }
    }

    // Clear local after successful migration
    clearLocalHistory()
    return { migrated: rows.length }
  }

  return {
    getHistory,
    saveToHistory,
    deleteFromHistory,
    clearHistory,
    loadFromHistory,
    migrateLocalHistory,
    // Expose local helpers for edge cases
    getLocalHistory,
    clearLocalHistory
  }
}
