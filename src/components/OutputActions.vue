<script setup>
import { computed } from 'vue'
import { usePdfExport } from '../composables/usePdfExport'
import { useStorage } from '../composables/useStorage'
import { useToast } from '../composables/useToast'

const props = defineProps({
  content: Object,
  template: String,
  hasContent: Boolean
})

const { exportPdf, isExporting } = usePdfExport()
const { saveToHistory } = useStorage()
const { showSuccess } = useToast()

const validationErrors = computed(() => {
  const errors = []
  if (!props.content.title?.trim() && !props.content.text?.trim()) {
    errors.push('Add a title or some text content')
  }
  return errors
})

const isValid = computed(() => validationErrors.value.length === 0)

async function handleExport() {
  if (!isValid.value) return

  const filename = props.content.title?.trim()
    ? `${props.content.title.trim().replace(/\s+/g, '-').toLowerCase()}.pdf`
    : `deck-${Date.now()}.pdf`

  await exportPdf('pdf-preview', filename)

  saveToHistory({
    id: Date.now(),
    title: props.content.title || 'Untitled',
    template: props.template,
    timestamp: Date.now()
  })

  showSuccess('PDF downloaded!')
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6">
    <h2 class="text-lg font-medium mb-4">Export</h2>

    <!-- Validation warnings -->
    <div v-if="validationErrors.length > 0" class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
      <p class="text-sm text-amber-800 font-medium mb-1">Before exporting:</p>
      <ul class="text-sm text-amber-700 space-y-1">
        <li v-for="error in validationErrors" :key="error" class="flex items-center gap-2">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {{ error }}
        </li>
      </ul>
    </div>

    <!-- Export button -->
    <button
      @click="handleExport"
      :disabled="!isValid || isExporting"
      :class="[
        'w-full py-3 px-4 rounded-lg font-medium transition-all',
        isValid
          ? 'bg-gray-900 text-white hover:bg-gray-800'
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
      ]"
    >
      <span v-if="isExporting" class="flex items-center justify-center gap-2">
        <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Generating PDF...
      </span>
      <span v-else>Download PDF</span>
    </button>
  </div>
</template>
