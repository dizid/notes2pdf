<script setup>
import { ref, computed } from 'vue'
import InputZone from '../components/InputZone.vue'
import DesignPicker from '../components/DesignPicker.vue'
import PreviewPane from '../components/PreviewPane.vue'
import OutputActions from '../components/OutputActions.vue'

const content = ref({
  title: '',
  text: '',
  images: []
})

const selectedTemplate = ref('bold-editorial')

const hasContent = computed(() => {
  return !!(content.value.title.trim() || content.value.text.trim() || content.value.images.length > 0)
})

function updateContent(newContent) {
  content.value = { ...content.value, ...newContent }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-8">
    <header class="mb-8">
      <h1 class="text-3xl mb-2">Create a Deck</h1>
      <p class="text-gray-500">Paste your notes, pick a design, export as PDF</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Left: Input & Design Selection -->
      <div class="space-y-6">
        <InputZone :content="content" @update="updateContent" />
        <DesignPicker v-model="selectedTemplate" />
      </div>

      <!-- Right: Preview & Export -->
      <div class="space-y-6">
        <PreviewPane :content="content" :template="selectedTemplate" />
        <OutputActions :content="content" :template="selectedTemplate" :hasContent="hasContent" />
      </div>
    </div>
  </div>
</template>
