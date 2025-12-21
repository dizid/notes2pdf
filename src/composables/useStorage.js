const STORAGE_KEY = 'notes2deck_history'

export function useStorage() {
  function getHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  function saveToHistory(item) {
    const history = getHistory()
    history.unshift(item)
    // Keep only last 50 items
    const trimmed = history.slice(0, 50)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  }

  function deleteFromHistory(id) {
    const history = getHistory()
    const filtered = history.filter(item => item.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  }

  function clearHistory() {
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    getHistory,
    saveToHistory,
    deleteFromHistory,
    clearHistory
  }
}
