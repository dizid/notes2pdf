import { ref, computed, readonly } from 'vue'

// Element types
export const ELEMENT_TYPES = {
  TEXT: 'text',
  HEADING: 'heading',
  IMAGE: 'image',
  DIVIDER: 'divider',
  SHAPE: 'shape',
  SPACER: 'spacer'
}

// Default element styles
const DEFAULT_STYLES = {
  text: {
    fontSize: 16,
    fontWeight: 'normal',
    textAlign: 'left',
    color: '#333333',
    lineHeight: 1.6
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#111111',
    lineHeight: 1.2
  },
  image: {
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    borderRadius: 8
  },
  divider: {
    height: 1,
    color: '#e5e7eb',
    width: '100%',
    margin: '16px 0'
  },
  shape: {
    width: 100,
    height: 100,
    backgroundColor: '#f3f4f6',
    borderRadius: 8
  },
  spacer: {
    height: 32
  }
}

// Canvas state
const elements = ref([])
const selectedElementId = ref(null)
const canvasSettings = ref({
  width: 800,
  height: 1132, // A4 ratio
  backgroundColor: '#ffffff',
  padding: 40
})

// Computed
const selectedElement = computed(() => {
  if (!selectedElementId.value) return null
  return elements.value.find(el => el.id === selectedElementId.value)
})

// Generate unique ID
function generateId() {
  return `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Add element
function addElement(type, options = {}) {
  const id = generateId()
  const defaultStyle = DEFAULT_STYLES[type] || {}

  const element = {
    id,
    type,
    content: options.content || getDefaultContent(type),
    style: { ...defaultStyle, ...options.style },
    position: {
      x: options.x || 0,
      y: options.y || elements.value.length * 60,
      width: options.width || '100%'
    }
  }

  elements.value.push(element)
  selectedElementId.value = id

  return id
}

function getDefaultContent(type) {
  switch (type) {
    case ELEMENT_TYPES.HEADING:
      return 'Your Heading'
    case ELEMENT_TYPES.TEXT:
      return 'Add your text here...'
    case ELEMENT_TYPES.IMAGE:
      return { src: '', alt: 'Image' }
    case ELEMENT_TYPES.DIVIDER:
      return null
    case ELEMENT_TYPES.SPACER:
      return null
    case ELEMENT_TYPES.SHAPE:
      return { shape: 'rectangle' }
    default:
      return ''
  }
}

// Update element
function updateElement(id, updates) {
  const index = elements.value.findIndex(el => el.id === id)
  if (index !== -1) {
    elements.value[index] = {
      ...elements.value[index],
      ...updates,
      style: {
        ...elements.value[index].style,
        ...(updates.style || {})
      },
      position: {
        ...elements.value[index].position,
        ...(updates.position || {})
      }
    }
  }
}

// Remove element
function removeElement(id) {
  const index = elements.value.findIndex(el => el.id === id)
  if (index !== -1) {
    elements.value.splice(index, 1)
    if (selectedElementId.value === id) {
      selectedElementId.value = null
    }
  }
}

// Move element (reorder)
function moveElement(id, direction) {
  const index = elements.value.findIndex(el => el.id === id)
  if (index === -1) return

  const newIndex = direction === 'up' ? index - 1 : index + 1
  if (newIndex < 0 || newIndex >= elements.value.length) return

  const temp = elements.value[index]
  elements.value[index] = elements.value[newIndex]
  elements.value[newIndex] = temp
}

// Duplicate element
function duplicateElement(id) {
  const element = elements.value.find(el => el.id === id)
  if (!element) return

  const newId = generateId()
  const duplicate = {
    ...JSON.parse(JSON.stringify(element)),
    id: newId,
    position: {
      ...element.position,
      y: element.position.y + 20
    }
  }

  const index = elements.value.findIndex(el => el.id === id)
  elements.value.splice(index + 1, 0, duplicate)
  selectedElementId.value = newId

  return newId
}

// Select element
function selectElement(id) {
  selectedElementId.value = id
}

// Clear selection
function clearSelection() {
  selectedElementId.value = null
}

// Update canvas settings
function updateCanvasSettings(settings) {
  canvasSettings.value = {
    ...canvasSettings.value,
    ...settings
  }
}

// Clear all elements
function clearCanvas() {
  elements.value = []
  selectedElementId.value = null
}

// Export template as JSON
function exportTemplate() {
  return {
    version: '1.0',
    canvas: canvasSettings.value,
    elements: elements.value
  }
}

// Import template from JSON
function importTemplate(template) {
  if (template.canvas) {
    canvasSettings.value = template.canvas
  }
  if (template.elements) {
    elements.value = template.elements
  }
  selectedElementId.value = null
}

// Load default template structure
function loadDefaultTemplate() {
  clearCanvas()

  addElement(ELEMENT_TYPES.HEADING, {
    content: 'Your Title Here',
    style: { fontSize: 48, textAlign: 'center' }
  })

  addElement(ELEMENT_TYPES.SPACER, {
    style: { height: 24 }
  })

  addElement(ELEMENT_TYPES.TEXT, {
    content: 'Add your content here. This is where your main text will appear.',
    style: { fontSize: 18, textAlign: 'center', color: '#666666' }
  })

  addElement(ELEMENT_TYPES.SPACER, {
    style: { height: 32 }
  })

  addElement(ELEMENT_TYPES.DIVIDER)

  clearSelection()
}

export function useTemplateBuilder() {
  return {
    // State
    elements: readonly(elements),
    selectedElementId: readonly(selectedElementId),
    selectedElement,
    canvasSettings: readonly(canvasSettings),

    // Element types
    ELEMENT_TYPES,

    // Actions
    addElement,
    updateElement,
    removeElement,
    moveElement,
    duplicateElement,
    selectElement,
    clearSelection,
    updateCanvasSettings,
    clearCanvas,
    loadDefaultTemplate,

    // Import/Export
    exportTemplate,
    importTemplate
  }
}
