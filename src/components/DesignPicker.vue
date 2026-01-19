<script setup>
import { ref, computed } from 'vue'
import { useTemplates } from '../composables/useTemplates'
import { useRouter } from 'vue-router'
import { useToast } from '../composables/useToast'
import { isDarkColor } from '../composables/useDesignGenerator'
import { STYLE_ARCHETYPES } from '../lib/designPresets'

const model = defineModel()
const router = useRouter()
const { allTemplates, isCustomTemplate, removeTemplate } = useTemplates()
const { showSuccess } = useToast()

// Filter state
const selectedFilter = ref('all')
const hoveredTemplate = ref(null)

const filters = [
  { id: 'all', label: 'All' },
  { id: 'builtin', label: 'Built-in' },
  { id: 'custom', label: 'My Templates' }
]

const filteredTemplates = computed(() => {
  if (selectedFilter.value === 'all') return allTemplates.value
  if (selectedFilter.value === 'custom') return allTemplates.value.filter(t => t.type === 'custom')
  return allTemplates.value.filter(t => t.type !== 'custom')
})

// Get archetype description for tooltip
function getArchetypeDescription(template) {
  const archetype = template.tokens?.archetype || template.archetype
  if (archetype && STYLE_ARCHETYPES[archetype]) {
    return STYLE_ARCHETYPES[archetype].description
  }
  return template.description
}

function getPreviewClasses(template) {
  // Built-in templates have predefined preview classes
  if (template.preview) {
    return template.preview.bg
  }

  // Templates with tokens - use background from tokens (no Tailwind class needed)
  if (template.tokens?.colors?.background) {
    return ''
  }

  // Legacy: Custom templates with gradient backgrounds
  if (template.styles?.background?.type === 'gradient') {
    return ''
  }

  // Legacy: Custom templates with solid background
  if (template.styles?.container?.backgroundColor) {
    return ''
  }

  // Default fallback
  return 'bg-gradient-to-br from-indigo-100 to-purple-200'
}

function getPreviewStyle(template) {
  const styles = {}

  // Priority 1: Use tokens for background color (new system)
  if (template.tokens?.colors?.background) {
    styles.backgroundColor = template.tokens.colors.background
    return styles
  }

  // Priority 2: Legacy gradient backgrounds
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
    // Priority 3: Legacy solid background
    styles.backgroundColor = template.styles.container.backgroundColor
  }

  return styles
}

function getTitleBarClasses(template) {
  if (template.preview) {
    return template.preview.titleBar
  }
  // For dark backgrounds, use white bars
  const bg = template.tokens?.colors?.background
  if (template.tokens?.mode === 'dark' || isDarkColor(bg)) {
    return 'bg-white w-2/3'
  }
  return 'bg-gray-600 w-2/3'
}

function getSubtitleBarClasses(template) {
  if (template.preview) {
    return template.preview.subtitleBar
  }
  // For dark backgrounds, use light bars
  const bg = template.tokens?.colors?.background
  if (template.tokens?.mode === 'dark' || isDarkColor(bg)) {
    return 'bg-white/60 w-1/2'
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
  <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
    <!-- Header -->
    <div class="flex items-center justify-between mb-5">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">Design Template</h2>
        <p class="text-sm text-gray-500 mt-0.5">Choose a style for your page</p>
      </div>
      <button
        @click="goToStudio"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 flex items-center gap-2 hover:shadow-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Template
      </button>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 mb-5 border-b border-gray-100 pb-4">
      <button
        v-for="filter in filters"
        :key="filter.id"
        @click="selectedFilter = filter.id"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
          selectedFilter === filter.id
            ? 'bg-gray-900 text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-100'
        ]"
      >
        {{ filter.label }}
        <span
          v-if="filter.id === 'custom'"
          class="ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full"
          :class="selectedFilter === filter.id ? 'bg-white/20' : 'bg-gray-200'"
        >
          {{ allTemplates.filter(t => t.type === 'custom').length }}
        </span>
      </button>
    </div>

    <!-- Templates Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <button
        v-for="template in filteredTemplates"
        :key="template.id"
        @click="model = template.id"
        @mouseenter="hoveredTemplate = template.id"
        @mouseleave="hoveredTemplate = null"
        :class="[
          'relative p-3 border-2 rounded-xl text-left transition-all duration-300 group overflow-hidden',
          model === template.id
            ? 'border-gray-900 bg-gray-50 shadow-lg scale-[1.02]'
            : 'border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.01]'
        ]"
      >
        <!-- Selected Checkmark -->
        <div
          v-if="model === template.id"
          class="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-md animate-scale-in"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </div>

        <!-- Delete button for custom templates -->
        <button
          v-if="isCustomTemplate(template.id)"
          @click="(e) => handleDelete(e, template.id)"
          class="absolute top-2 right-2 z-10 p-1.5 rounded-lg bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 shadow-lg"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

        <!-- Template preview - Larger -->
        <div
          :class="[
            'aspect-[3/4] rounded-lg mb-3 flex flex-col items-start justify-end p-3 transition-transform duration-300',
            getPreviewClasses(template),
            hoveredTemplate === template.id ? 'scale-[1.02]' : ''
          ]"
          :style="getPreviewStyle(template)"
        >
          <!-- Mini page preview elements -->
          <div class="w-full space-y-2">
            <div :class="['h-2.5 rounded', getTitleBarClasses(template)]"></div>
            <div :class="['h-1.5 rounded', getSubtitleBarClasses(template)]"></div>
            <div class="flex gap-1.5 mt-3">
              <div :class="['w-6 h-6 rounded', getSubtitleBarClasses(template), 'opacity-40']"></div>
              <div :class="['w-6 h-6 rounded', getSubtitleBarClasses(template), 'opacity-40']"></div>
            </div>
          </div>

          <!-- Hover overlay with description -->
          <div
            :class="[
              'absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-lg flex items-end p-3 transition-opacity duration-300',
              hoveredTemplate === template.id && model !== template.id ? 'opacity-100' : 'opacity-0'
            ]"
          >
            <p class="text-white text-xs font-medium leading-relaxed">
              {{ getArchetypeDescription(template) }}
            </p>
          </div>
        </div>

        <!-- Template info -->
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <h3 class="font-semibold text-sm text-gray-900 truncate">{{ template.name }}</h3>
            <p class="text-xs text-gray-500 mt-0.5 line-clamp-1">{{ template.description }}</p>
          </div>
          <span
            v-if="template.type === 'custom'"
            class="flex-shrink-0 text-[10px] px-2 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-medium"
          >
            Custom
          </span>
          <span
            v-else-if="template.tokens?.archetype"
            class="flex-shrink-0 text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-full capitalize"
          >
            {{ template.tokens.archetype }}
          </span>
        </div>
      </button>

      <!-- Empty state for custom templates -->
      <div
        v-if="selectedFilter === 'custom' && filteredTemplates.length === 0"
        class="col-span-full py-12 text-center"
      >
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 class="font-medium text-gray-900 mb-1">No custom templates yet</h3>
        <p class="text-sm text-gray-500 mb-4">Create your first template using our AI-powered studio</p>
        <button
          @click="goToStudio"
          class="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Create Template
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes scale-in {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scale-in 0.2s ease-out;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
