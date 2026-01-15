<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  html: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'print'])

// Page size options
const pageSizes = [
  { id: 'a4', name: 'A4', size: 'A4 portrait' },
  { id: 'letter', name: 'Letter', size: 'letter portrait' }
]
const selectedSize = ref('a4')

// Generate preview HTML with selected page size
const previewHtml = computed(() => {
  if (!props.html) return ''

  // Replace the @page size in the HTML
  const sizeValue = pageSizes.find(s => s.id === selectedSize.value)?.size || 'A4 portrait'
  return props.html.replace(
    /@page\s*\{[^}]*size:\s*[^;]+;/,
    `@page { size: ${sizeValue};`
  )
})

// Create blob URL for iframe
const blobUrl = ref(null)

watch(previewHtml, (html) => {
  // Revoke old URL
  if (blobUrl.value) {
    URL.revokeObjectURL(blobUrl.value)
  }
  // Create new URL
  if (html) {
    const blob = new Blob([html], { type: 'text/html' })
    blobUrl.value = URL.createObjectURL(blob)
  } else {
    blobUrl.value = null
  }
}, { immediate: true })

// Cleanup on close
watch(() => props.show, (show) => {
  if (!show && blobUrl.value) {
    URL.revokeObjectURL(blobUrl.value)
    blobUrl.value = null
  }
})

function handlePrint() {
  emit('print', { pageSize: selectedSize.value, html: previewHtml.value })
}

function close() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      @click.self="close"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-4">
            <h3 class="text-lg font-semibold">Print Preview</h3>
            <!-- Page size selector -->
            <div class="flex items-center gap-2 text-sm">
              <span class="text-gray-500">Page size:</span>
              <select
                v-model="selectedSize"
                class="px-3 py-1.5 bg-gray-100 border-0 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-200 focus:ring-2 focus:ring-blue-500"
              >
                <option v-for="size in pageSizes" :key="size.id" :value="size.id">
                  {{ size.name }}
                </option>
              </select>
            </div>
          </div>
          <button @click="close" class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Preview iframe -->
        <div class="flex-1 p-4 bg-gray-100 overflow-auto">
          <div class="bg-white shadow-lg rounded-lg overflow-hidden mx-auto" style="max-width: 595px;">
            <iframe
              v-if="blobUrl"
              :src="blobUrl"
              class="w-full border-0"
              style="height: 600px;"
              sandbox="allow-same-origin"
              title="Print Preview"
            ></iframe>
            <div v-else class="h-96 flex items-center justify-center text-gray-400">
              Loading preview...
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between shrink-0 bg-gray-50">
          <p class="text-sm text-gray-500">
            Your browser's print dialog will open. Save as PDF or print directly.
          </p>
          <div class="flex items-center gap-3">
            <button
              @click="close"
              class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="handlePrint"
              class="px-5 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
