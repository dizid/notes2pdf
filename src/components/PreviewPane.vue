<script setup>
import { computed } from 'vue'
import { useTemplates } from '../composables/useTemplates'
import DynamicTemplate from '../templates/DynamicTemplate.vue'

const props = defineProps({
  content: Object,
  template: String
})

const { getTemplateById } = useTemplates()

const currentTemplate = computed(() => getTemplateById(props.template))

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
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <h2 class="text-lg font-medium">Preview</h2>
      <span class="text-xs text-gray-400">A4 format</span>
    </div>

    <!-- Preview container -->
    <div class="p-6 bg-gray-100">
      <!-- Scaled preview for display -->
      <div
        class="bg-white shadow-lg mx-auto overflow-hidden"
        style="width: 100%; max-width: 300px; aspect-ratio: 1/1.414;"
      >
        <div class="origin-top-left" style="transform: scale(0.35); width: 285.7%; height: 285.7%;">
          <component
            :is="templateComponent"
            :content="content"
            :styles="templateStyles"
          />
        </div>
      </div>
    </div>

    <!-- Hidden full-size element for PDF export -->
    <div class="fixed -left-[9999px] top-0">
      <div
        id="pdf-preview"
        style="width: 210mm; min-height: 297mm; background: white;"
      >
        <component
          :is="templateComponent"
          :content="content"
          :styles="templateStyles"
        />
      </div>
    </div>
  </div>
</template>
