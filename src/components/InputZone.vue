<script setup>
import { ref } from 'vue'

const props = defineProps({
  content: Object
})

const emit = defineEmits(['update'])

const dragActive = ref(false)

function handleTitleInput(e) {
  emit('update', { title: e.target.value })
}

function handleTextInput(e) {
  emit('update', { text: e.target.value })
}

function handleDrop(e) {
  e.preventDefault()
  dragActive.value = false
  const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
  if (files.length > 0) {
    processImages(files)
  }
}

function handleFileSelect(e) {
  const files = Array.from(e.target.files)
  processImages(files)
  e.target.value = ''
}

function processImages(files) {
  const existingImages = props.content.images || []

  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const newImage = {
        id: Date.now() + Math.random(),
        name: file.name,
        data: e.target.result
      }
      emit('update', { images: [...existingImages, newImage] })
    }
    reader.readAsDataURL(file)
  })
}

function removeImage(imageId) {
  const images = (props.content.images || []).filter(img => img.id !== imageId)
  emit('update', { images })
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6">
    <h2 class="text-lg font-medium mb-4">Content</h2>

    <div class="space-y-4">
      <!-- Title -->
      <div>
        <label class="block text-sm text-gray-600 mb-2">Title</label>
        <input
          type="text"
          :value="content.title"
          @input="handleTitleInput"
          placeholder="Your title..."
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
      </div>

      <!-- Text -->
      <div>
        <label class="block text-sm text-gray-600 mb-2">Text</label>
        <textarea
          :value="content.text"
          @input="handleTextInput"
          placeholder="Your content..."
          rows="4"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
        ></textarea>
      </div>

      <!-- Images -->
      <div>
        <label class="block text-sm text-gray-600 mb-2">Images</label>

        <!-- Drop zone -->
        <label
          @dragover.prevent="dragActive = true"
          @dragleave="dragActive = false"
          @drop="handleDrop"
          :class="[
            'block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
            dragActive ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
          ]"
        >
          <input
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            @change="handleFileSelect"
          />
          <p class="text-sm text-gray-500">
            <span class="font-medium text-gray-700">Drop images</span> or click to add
          </p>
        </label>

        <!-- Image previews -->
        <div v-if="content.images?.length > 0" class="mt-3 grid grid-cols-4 gap-2">
          <div
            v-for="img in content.images"
            :key="img.id"
            class="relative aspect-square bg-gray-100 rounded overflow-hidden group"
          >
            <img :src="img.data" :alt="img.name || ''" class="w-full h-full object-cover" />
            <button
              @click="removeImage(img.id)"
              class="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
