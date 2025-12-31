<script setup>
import { computed, ref } from 'vue'
import { useTemplates } from '../composables/useTemplates'
import { useHtmlRenderer } from '../composables/useHtmlRenderer'
import { useTokenResolver } from '../composables/useTokenResolver'
import DynamicTemplate from '../templates/DynamicTemplate.vue'

const props = defineProps({
  content: Object,
  template: String,
  tokens: Object
})

const { getTemplateById } = useTemplates()
const { renderToHtml } = useHtmlRenderer()
const { activeTokens } = useTokenResolver(() => props.tokens, () => props.template)

const currentTemplate = computed(() => getTemplateById(props.template))

// Generate HTML for iframe preview (WYSIWYG)
const previewHtml = computed(() => {
  const tokens = activeTokens.value
  console.log('[Preview] Rendering with tokens:', tokens?.colors?.background, 'mode:', tokens?.mode)

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

  return renderToHtml(tokens, contentForPreview)
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

// Toggle between Vue preview and HTML preview
const showHtmlPreview = ref(true)
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <h2 class="text-lg font-medium">Preview</h2>
      <span class="text-xs text-gray-400">WYSIWYG</span>
    </div>

    <!-- Preview container with iframe -->
    <div class="p-4 bg-gray-100">
      <div
        class="bg-white shadow-lg mx-auto overflow-hidden rounded-lg"
        style="width: 100%; max-width: 320px; aspect-ratio: 1/1.3;"
      >
        <iframe
          :srcdoc="previewHtml"
          class="w-full h-full border-0"
          sandbox="allow-same-origin allow-scripts"
          title="Preview"
        ></iframe>
      </div>
    </div>

    <!-- Hidden full-size element for PDF export -->
    <div class="fixed -left-[9999px] top-0">
      <div
        id="pdf-preview"
        style="width: 210mm; min-height: 297mm; background: white;"
      >
        <iframe
          :srcdoc="previewHtml"
          style="width: 100%; height: 100%; border: none;"
          title="PDF Preview"
        ></iframe>
      </div>
    </div>
  </div>
</template>
