<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTemplateBuilder } from '../composables/useTemplateBuilder'
import { useTemplates } from '../composables/useTemplates'
import { useToast } from '../composables/useToast'
import TemplateBuilder from '../components/TemplateBuilder.vue'
import ElementPalette from '../components/ElementPalette.vue'
import StylePanel from '../components/StylePanel.vue'

const router = useRouter()
const { showSuccess } = useToast()
const { addTemplate } = useTemplates()
const {
  canvasSettings,
  updateCanvasSettings,
  clearCanvas,
  loadDefaultTemplate,
  exportTemplate
} = useTemplateBuilder()

const templateName = ref('')
const showSaveModal = ref(false)

// Canvas background color
const bgColor = ref(canvasSettings.value.backgroundColor)

function updateBgColor(color) {
  bgColor.value = color
  updateCanvasSettings({ backgroundColor: color })
}

function handleLoadDefault() {
  loadDefaultTemplate()
}

function handleClear() {
  if (confirm('Clear all elements?')) {
    clearCanvas()
  }
}

function handleSave() {
  if (!templateName.value.trim()) {
    return
  }

  const templateData = exportTemplate()

  // Create a template compatible with the app's template system
  const newId = addTemplate({
    name: templateName.value,
    description: 'Custom template from builder',
    type: 'builder',
    builderData: templateData,
    tokens: {
      colors: {
        background: canvasSettings.value.backgroundColor,
        primary: '#1a1a1a',
        secondary: '#666666',
        accent: '#3b82f6',
        surface: '#f8f8f8'
      },
      typography: {
        headingFont: 'Georgia, serif',
        bodyFont: 'Inter, sans-serif',
        scale: 1
      },
      layout: {
        density: 'normal',
        alignment: 'left'
      },
      effects: {
        animations: false,
        shadows: true
      }
    }
  })

  showSuccess('Template saved!')
  showSaveModal.value = false
  router.push({ path: '/app', query: { template: newId } })
}

function handleExportJSON() {
  const data = exportTemplate()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${templateName.value || 'template'}.json`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button
            @click="router.push('/app/studio')"
            class="text-gray-500 hover:text-gray-700"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-lg font-semibold">Template Builder</h1>
          <span class="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Beta</span>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="handleLoadDefault"
            class="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            Load Default
          </button>
          <button
            @click="handleClear"
            class="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            Clear
          </button>
          <button
            @click="showSaveModal = true"
            class="px-4 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Save Template
          </button>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-6 py-6">
      <div class="grid grid-cols-12 gap-6">
        <!-- Left sidebar: Elements -->
        <div class="col-span-2 space-y-4">
          <ElementPalette />

          <!-- Canvas settings -->
          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-700 mb-3">Canvas</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-xs text-gray-500 mb-1">Background</label>
                <div class="flex gap-2">
                  <input
                    type="color"
                    :value="bgColor"
                    @input="updateBgColor($event.target.value)"
                    class="w-10 h-8 rounded border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    :value="bgColor"
                    @input="updateBgColor($event.target.value)"
                    class="flex-1 px-2 py-1 text-sm border border-gray-200 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Center: Canvas -->
        <div class="col-span-7">
          <TemplateBuilder :scale="0.6" />
        </div>

        <!-- Right sidebar: Style panel -->
        <div class="col-span-3">
          <StylePanel />
        </div>
      </div>
    </main>

    <!-- Save modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showSaveModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50" @click="showSaveModal = false"></div>
          <div class="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 class="text-xl font-semibold mb-4">Save Template</h2>

            <div class="mb-4">
              <label class="block text-sm text-gray-600 mb-1">Template Name</label>
              <input
                v-model="templateName"
                type="text"
                placeholder="My Custom Template"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div class="flex gap-3">
              <button
                @click="handleSave"
                :disabled="!templateName.trim()"
                :class="[
                  'flex-1 py-3 rounded-lg font-medium transition',
                  templateName.trim()
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                ]"
              >
                Save & Use
              </button>
              <button
                @click="handleExportJSON"
                class="px-4 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
              >
                Export JSON
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
