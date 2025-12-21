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

    <!-- Preview container with A4 aspect ratio -->
    <div class="p-6 bg-gray-100">
      <div
        id="pdf-preview"
        class="bg-white shadow-lg mx-auto"
        style="width: 100%; max-width: 400px; aspect-ratio: 1/1.414;"
      >
        <div class="w-full h-full overflow-hidden" style="transform: scale(0.5); transform-origin: top left; width: 200%; height: 200%;">
          <component :is="templateComponent" :content="content" />
        </div>
      </div>
    </div>
  </div>
</template>
