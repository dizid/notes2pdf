<script setup>
import { computed, ref } from 'vue'
import { useTemplates } from '../composables/useTemplates'
import { useHtmlRenderer } from '../composables/useHtmlRenderer'
import { useTokenResolver } from '../composables/useTokenResolver'
import { usePaywall } from '../composables/usePaywall'
import DynamicTemplate from '../templates/DynamicTemplate.vue'

const props = defineProps({
  content: Object,
  template: String,
  tokens: Object,
  // AI Preview props
  aiPreviewHtml: {
    type: String,
    default: null
  },
  isGeneratingPreview: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['fullscreen', 'generate-ai-preview'])

const { getTemplateById } = useTemplates()
const { renderToHtml } = useHtmlRenderer()
const { activeTokens } = useTokenResolver(() => props.tokens, () => props.template)
const { isPro } = usePaywall()

const currentTemplate = computed(() => getTemplateById(props.template))

// Fullscreen state
const isFullscreen = ref(false)

// Generate HTML for iframe preview (WYSIWYG)
const previewHtml = computed(() => {
  const tokens = activeTokens.value

  // Check if we have any real content
  const hasRealContent = props.content?.title?.trim() || props.content?.text?.trim() || props.content?.images?.length

  // Prepare content - use placeholder if empty
  const contentForPreview = hasRealContent
    ? {
        ...props.content,
        images: props.content.images?.map(img => ({
          src: img.data || img.src || img.url,
          alt: img.name || ''
        }))
      }
    : {
        title: 'Your Title Here',
        text: 'Start typing your content in the left panel. Your text will appear here with the selected design applied.',
        images: []
      }

  return renderToHtml(tokens, contentForPreview, { isPro: isPro.value })
})

// For built-in templates, use their component directly
// For custom templates, use DynamicTemplate with their styles
const templateComponent = computed(() => {
  if (currentTemplate.value?.component) {
    return currentTemplate.value.component
  }
  return DynamicTemplate
})

// Pass styles to DynamicTemplate for custom templates
const templateStyles = computed(() => {
  if (currentTemplate.value?.type === 'custom') {
    return currentTemplate.value.styles || {}
  }
  return null
})

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
  emit('fullscreen', isFullscreen.value)
}

// Request AI preview generation
function requestAiPreview() {
  emit('generate-ai-preview')
}

// Display HTML: use AI preview if available, otherwise local
const displayHtml = computed(() => {
  return props.aiPreviewHtml || previewHtml.value
})

// Show "Preview Final" button when AI preview not yet generated
const showPreviewButton = computed(() => {
  return !props.aiPreviewHtml && !props.isGeneratingPreview
})
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
    <!-- Header -->
    <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <h2 class="text-lg font-medium">Preview</h2>
        <!-- AI Preview indicator -->
        <span v-if="aiPreviewHtml" class="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
          Final
        </span>
      </div>
      <div class="flex items-center gap-2">
        <!-- Preview Final button -->
        <button
          v-if="showPreviewButton"
          @click="requestAiPreview"
          class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          title="Generate AI preview (shows final published result)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          Preview Final
        </button>
        <!-- Loading state -->
        <div v-if="isGeneratingPreview" class="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500">
          <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          Generating...
        </div>
        <!-- Fullscreen button -->
        <button
          @click="toggleFullscreen"
          class="p-1.5 rounded hover:bg-gray-100 text-gray-500"
          title="Fullscreen preview"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Preview container with iframe - fills available space -->
    <div class="bg-white rounded-b-lg overflow-hidden" style="height: 400px;">
      <iframe
        :srcdoc="displayHtml"
        class="w-full h-full border-0"
        sandbox="allow-same-origin allow-scripts"
        title="Preview"
      ></iframe>
    </div>
  </div>

  <!-- Fullscreen overlay -->
  <Teleport to="body">
    <div
      v-if="isFullscreen"
      class="fixed inset-0 z-50 bg-gray-900/95 flex flex-col"
    >
      <!-- Fullscreen header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-700">
        <span class="text-white font-medium">Preview</span>
        <button
          @click="toggleFullscreen"
          class="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Fullscreen preview -->
      <div class="flex-1 overflow-hidden p-4">
        <iframe
          :srcdoc="displayHtml"
          class="w-full h-full border-0 bg-white rounded-lg"
          sandbox="allow-same-origin allow-scripts"
          title="Fullscreen Preview"
        ></iframe>
      </div>
    </div>
  </Teleport>
</template>
