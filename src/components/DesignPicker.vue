<script setup>
import { useTemplates } from '../composables/useTemplates'
import { useRouter } from 'vue-router'
import { useToast } from '../composables/useToast'

const model = defineModel()
const router = useRouter()
const { allTemplates, isCustomTemplate, removeTemplate } = useTemplates()
const { showSuccess } = useToast()

function getPreviewClasses(template) {
  if (template.preview) {
    return template.preview.bg
  }
  // Custom templates with gradient backgrounds don't need default classes
  if (template.styles?.background?.type === 'gradient') {
    return ''
  }
  // Default for custom templates without styles
  return template.styles?.container?.backgroundColor
    ? ''
    : 'bg-gradient-to-br from-indigo-100 to-purple-200'
}

function getPreviewStyle(template) {
  const styles = {}

  // Handle gradient backgrounds for custom templates
  if (template.styles?.background?.type === 'gradient' && template.styles.background.gradient) {
    const { type, angle, stops } = template.styles.background.gradient
    if (stops && stops.length >= 2) {
      const stopsStr = stops.map(s => `${s.color} ${s.position}%`).join(', ')
      if (type === 'radial') {
        styles.backgroundImage = `radial-gradient(circle, ${stopsStr})`
      } else {
        styles.backgroundImage = `linear-gradient(${angle || 135}deg, ${stopsStr})`
      }
    }
  } else if (template.styles?.container?.backgroundColor && template.styles.container.backgroundColor !== 'transparent') {
    styles.backgroundColor = template.styles.container.backgroundColor
  }

  return styles
}

function getTitleBarClasses(template) {
  if (template.preview) {
    return template.preview.titleBar
  }
  return 'bg-gray-600 w-2/3'
}

function getSubtitleBarClasses(template) {
  if (template.preview) {
    return template.preview.subtitleBar
  }
  return 'bg-gray-400 w-1/2'
}

function handleDelete(e, templateId) {
  e.stopPropagation()
  removeTemplate(templateId)
  if (model.value === templateId) {
    model.value = 'bold-editorial'
  }
  showSuccess('Template deleted')
}

function goToStudio() {
  router.push('/studio')
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-medium">Design</h2>
      <button
        @click="goToStudio"
        class="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Design
      </button>
    </div>

    <div class="grid grid-cols-3 gap-3">
      <button
        v-for="template in allTemplates"
        :key="template.id"
        @click="model = template.id"
        :class="[
          'p-4 border rounded-lg text-left transition-all relative group',
          model === template.id
            ? 'border-gray-900 bg-gray-50'
            : 'border-gray-200 hover:border-gray-300'
        ]"
      >
        <!-- Delete button for custom templates -->
        <button
          v-if="isCustomTemplate(template.id)"
          @click="(e) => handleDelete(e, template.id)"
          class="absolute top-2 right-2 p-1 rounded bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Template preview placeholder -->
        <div
          :class="[
            'aspect-[3/4] rounded mb-3 flex items-end p-2',
            getPreviewClasses(template)
          ]"
          :style="getPreviewStyle(template)"
        >
          <div class="w-full space-y-1">
            <div :class="['h-2 rounded-sm', getTitleBarClasses(template)]"></div>
            <div :class="['h-1 rounded-sm', getSubtitleBarClasses(template)]"></div>
          </div>
        </div>

        <div class="flex items-center gap-1">
          <h3 class="font-medium text-sm">{{ template.name }}</h3>
          <span
            v-if="template.type === 'custom'"
            class="text-[10px] px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded"
          >
            Custom
          </span>
        </div>
        <p class="text-xs text-gray-500 mt-1">{{ template.description }}</p>
      </button>
    </div>
  </div>
</template>
