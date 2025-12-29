import { ref, computed, shallowRef, markRaw } from 'vue'
import BoldEditorial from '../templates/BoldEditorial.vue'
import PhotoSpread from '../templates/PhotoSpread.vue'
import CleanDeck from '../templates/CleanDeck.vue'

const STORAGE_KEY = 'notes2deck_custom_templates'

// Built-in templates with their Vue components
const builtInTemplates = [
  {
    id: 'bold-editorial',
    name: 'Bold Editorial',
    description: 'High-impact headers, dramatic typography',
    type: 'builtin',
    component: markRaw(BoldEditorial),
    preview: {
      bg: 'bg-gray-900',
      titleBar: 'bg-white w-3/4',
      subtitleBar: 'bg-white/60 w-1/2'
    }
  },
  {
    id: 'photo-spread',
    name: 'Photo Spread',
    description: 'Image-centric, magazine layout',
    type: 'builtin',
    component: markRaw(PhotoSpread),
    preview: {
      bg: 'bg-gradient-to-b from-gray-200 to-gray-400',
      titleBar: 'bg-white/80 w-1/2',
      subtitleBar: 'bg-white/60 w-1/3'
    }
  },
  {
    id: 'clean-deck',
    name: 'Clean Deck',
    description: 'Professional presentation style',
    type: 'builtin',
    component: markRaw(CleanDeck),
    preview: {
      bg: 'bg-white border border-gray-200',
      titleBar: 'bg-gray-300 w-2/3',
      subtitleBar: 'bg-gray-200 w-1/2'
    }
  }
]

// Shared state across all component instances
const customTemplates = ref([])
let initialized = false

function loadCustomTemplates() {
  if (initialized) return
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      customTemplates.value = JSON.parse(data)
    }
  } catch {
    customTemplates.value = []
  }
  initialized = true
}

function saveCustomTemplates() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customTemplates.value))
}

export function useTemplates() {
  // Initialize on first use
  loadCustomTemplates()

  // All templates combined
  const allTemplates = computed(() => [
    ...builtInTemplates,
    ...customTemplates.value.map(t => ({ ...t, type: 'custom' }))
  ])

  // Get template by ID
  function getTemplateById(id) {
    return allTemplates.value.find(t => t.id === id) || builtInTemplates[0]
  }

  // Add a new custom template
  function addTemplate(template) {
    const newTemplate = {
      ...template,
      id: template.id || `custom-${Date.now()}`,
      type: 'custom',
      createdAt: Date.now()
    }
    customTemplates.value.unshift(newTemplate)
    saveCustomTemplates()
    return newTemplate.id
  }

  // Update an existing custom template
  function updateTemplate(id, updates) {
    const index = customTemplates.value.findIndex(t => t.id === id)
    if (index !== -1) {
      customTemplates.value[index] = { ...customTemplates.value[index], ...updates }
      saveCustomTemplates()
    }
  }

  // Remove a custom template
  function removeTemplate(id) {
    customTemplates.value = customTemplates.value.filter(t => t.id !== id)
    saveCustomTemplates()
  }

  // Check if a template is custom (can be deleted)
  function isCustomTemplate(id) {
    return customTemplates.value.some(t => t.id === id)
  }

  return {
    builtInTemplates,
    customTemplates,
    allTemplates,
    getTemplateById,
    addTemplate,
    updateTemplate,
    removeTemplate,
    isCustomTemplate
  }
}
