<script setup>
import { computed } from 'vue'
import BoldEditorial from '../templates/BoldEditorial.vue'
import PhotoSpread from '../templates/PhotoSpread.vue'
import CleanDeck from '../templates/CleanDeck.vue'

const props = defineProps({
  content: Object,
  template: String
})

const templateComponent = computed(() => {
  const templates = {
    'bold-editorial': BoldEditorial,
    'photo-spread': PhotoSpread,
    'clean-deck': CleanDeck
  }
  return templates[props.template] || BoldEditorial
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
          <component :is="templateComponent" :content="content" />
        </div>
      </div>
    </div>

    <!-- Hidden full-size element for PDF export -->
    <div class="fixed -left-[9999px] top-0">
      <div
        id="pdf-preview"
        style="width: 210mm; min-height: 297mm; background: white;"
      >
        <component :is="templateComponent" :content="content" />
      </div>
    </div>
  </div>
</template>
