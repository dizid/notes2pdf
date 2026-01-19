import { ref, computed, markRaw } from 'vue'
import BoldEditorial from '../templates/BoldEditorial.vue'
import PhotoSpread from '../templates/PhotoSpread.vue'
import CleanDeck from '../templates/CleanDeck.vue'

import { generateTokensFromStyles } from './useTokenResolver'

const STORAGE_KEY = 'notes2deck_custom_templates'

// Built-in templates with their Vue components AND design tokens for HTML rendering
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
    },
    tokens: {
      colors: {
        primary: '#ffffff',
        secondary: '#d1d5db',
        accent: '#3b82f6',
        background: '#111827',
        surface: '#111827'
      },
      typography: {
        headingFont: 'Georgia',
        bodyFont: 'Georgia',
        scale: 'large'
      },
      layout: {
        density: 'spacious',
        alignment: 'left'
      },
      effects: {
        shadows: false,
        animations: false,
        rounded: 'subtle'
      }
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
    },
    tokens: {
      colors: {
        primary: '#1f2937',
        secondary: '#4b5563',
        accent: '#6366f1',
        background: '#e5e7eb',
        surface: '#ffffff'
      },
      typography: {
        headingFont: 'Playfair Display',
        bodyFont: 'Source Sans Pro',
        scale: 'normal'
      },
      layout: {
        density: 'normal',
        alignment: 'center'
      },
      effects: {
        shadows: true,
        animations: false,
        rounded: 'medium'
      }
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
    },
    tokens: {
      colors: {
        primary: '#111827',
        secondary: '#374151',
        accent: '#2563eb',
        background: '#f9fafb',
        surface: '#ffffff'
      },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        scale: 'normal'
      },
      layout: {
        density: 'normal',
        alignment: 'left'
      },
      effects: {
        shadows: true,
        animations: false,
        rounded: 'medium'
      }
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
      const templates = JSON.parse(data)

      // Migrate legacy templates: generate tokens from styles if missing
      let migrated = false
      customTemplates.value = templates.map(t => {
        if (!t.tokens && t.styles) {
          console.log('[Templates] Migrating legacy template:', t.id)
          const tokens = generateTokensFromStyles(t.styles)
          migrated = true
          return { ...t, tokens }
        }
        return t
      })

      // Save if any templates were migrated
      if (migrated) {
        saveCustomTemplates()
        console.log('[Templates] Migration complete - saved updated templates')
      }

      console.log('[Templates] Loaded from localStorage:', customTemplates.value.map(t => ({
        id: t.id,
        name: t.name,
        hasTokens: !!t.tokens,
        tokensBg: t.tokens?.colors?.background,
        tokensMode: t.tokens?.mode
      })))
    }
  } catch (err) {
    console.error('[Templates] Failed to load from localStorage:', err)
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
    console.log('[Templates] Adding new template:', {
      id: newTemplate.id,
      name: newTemplate.name,
      hasTokens: !!newTemplate.tokens,
      tokensBg: newTemplate.tokens?.colors?.background,
      tokensMode: newTemplate.tokens?.mode,
      hasStyles: !!newTemplate.styles
    })
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
