<script setup>
import { ref, computed } from 'vue'
import { useExport, EXPORT_FORMATS } from '../composables/useExport'
import { useToast } from '../composables/useToast'

const props = defineProps({
  show: Boolean,
  elementId: {
    type: String,
    default: 'pdf-preview'
  },
  filename: {
    type: String,
    default: 'export'
  }
})

const emit = defineEmits(['close', 'exported'])

const { exportAs, isExporting, exportProgress, exportError, reset } = useExport()
const { showSuccess, showError } = useToast()

const selectedFormat = ref('png')

// Group formats for display
const formatGroups = computed(() => [
  {
    label: 'Standard',
    formats: [
      { key: 'png', ...EXPORT_FORMATS.png },
      { key: 'pdf', ...EXPORT_FORMATS.pdf }
    ]
  },
  {
    label: 'Social Media',
    formats: [
      { key: 'ogImage', ...EXPORT_FORMATS.ogImage },
      { key: 'instagram', ...EXPORT_FORMATS.instagram },
      { key: 'instagramStory', ...EXPORT_FORMATS.instagramStory },
      { key: 'twitter', ...EXPORT_FORMATS.twitter },
      { key: 'linkedin', ...EXPORT_FORMATS.linkedin }
    ]
  }
])

const selectedFormatInfo = computed(() => {
  const config = EXPORT_FORMATS[selectedFormat.value]
  if (!config) return null

  if (config.width && config.height) {
    return `${config.width} x ${config.height}px`
  }
  return 'Original size'
})

async function handleExport() {
  reset()

  const result = await exportAs(
    props.elementId,
    selectedFormat.value,
    props.filename
  )

  if (result) {
    showSuccess(`Exported as ${EXPORT_FORMATS[selectedFormat.value].label}`)
    emit('exported', { format: selectedFormat.value, dataUrl: result })
  } else if (exportError.value) {
    showError(`Export failed: ${exportError.value}`)
  }
}

function close() {
  if (!isExporting.value) {
    reset()
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="close"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold">Export Options</h3>
          <button
            @click="close"
            :disabled="isExporting"
            class="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="px-6 py-6">
          <!-- Format groups -->
          <div class="space-y-4">
            <div v-for="group in formatGroups" :key="group.label">
              <h4 class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                {{ group.label }}
              </h4>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="format in group.formats"
                  :key="format.key"
                  @click="selectedFormat = format.key"
                  :class="[
                    'p-3 rounded-lg border text-left transition-all',
                    selectedFormat === format.key
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  ]"
                >
                  <div class="text-sm font-medium text-gray-900">{{ format.label }}</div>
                  <div class="text-xs text-gray-500 mt-0.5">
                    {{ format.width && format.height ? `${format.width}x${format.height}` : 'Original' }}
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Selected format info -->
          <div class="mt-4 p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Output size:</span>
              <span class="font-medium text-gray-900">{{ selectedFormatInfo }}</span>
            </div>
          </div>

          <!-- Progress bar -->
          <div v-if="isExporting" class="mt-4">
            <div class="flex items-center justify-between text-sm mb-1">
              <span class="text-gray-600">Exporting...</span>
              <span class="text-gray-900 font-medium">{{ exportProgress }}%</span>
            </div>
            <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full bg-blue-500 transition-all duration-300"
                :style="{ width: `${exportProgress}%` }"
              ></div>
            </div>
          </div>

          <!-- Error message -->
          <div v-if="exportError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-700">{{ exportError }}</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            @click="close"
            :disabled="isExporting"
            class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            @click="handleExport"
            :disabled="isExporting"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 flex items-center gap-2"
          >
            <svg v-if="isExporting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {{ isExporting ? 'Exporting...' : 'Download' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
