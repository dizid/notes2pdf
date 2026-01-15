import { ref, watch } from 'vue'

const STORAGE_KEY = 'sizzle_draft'

// Module-level state (survives navigation)
const content = ref({ title: '', text: '', images: [] })
const selectedTemplate = ref('bold-editorial')

let initialized = false

function init() {
  if (initialized) return
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      if (data.content) content.value = data.content
      if (data.selectedTemplate) selectedTemplate.value = data.selectedTemplate
    }
  } catch (e) {
    console.error('[Draft] Load failed:', e)
  }
  initialized = true
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      content: content.value,
      selectedTemplate: selectedTemplate.value
    }))
  } catch (e) {
    console.error('[Draft] Save failed:', e)
  }
}

function clear() {
  content.value = { title: '', text: '', images: [] }
  selectedTemplate.value = 'bold-editorial'
  localStorage.removeItem(STORAGE_KEY)
}

export function useDraft() {
  init()
  watch([content, selectedTemplate], save, { deep: true })
  return { content, selectedTemplate, clear }
}
