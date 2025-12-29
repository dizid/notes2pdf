<script setup>
import { ref } from 'vue'

const props = defineProps({
  content: Object
})

const emit = defineEmits(['update'])

const dragActive = ref(false)

function handleTextInput(e) {
  emit('update', { [e.target.name]: e.target.value })
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
}

function processImages(files) {
  const newImages = []
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      newImages.push({
        id: Date.now() + Math.random(),
        name: file.name,
        data: e.target.result
      })
      if (newImages.length === files.length) {
        emit('update', { images: [...props.content.images, ...newImages] })
      }
    }
    reader.readAsDataURL(file)
  })
}

function removeImage(id) {
  emit('update', { images: props.content.images.filter(img => img.id !== id) })
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6">
    <h2 class="text-lg font-medium mb-4">Content</h2>

    <!-- Title -->
    <div class="mb-4">
      <label class="block text-sm text-gray-600 mb-2">Title</label>
      <input
        type="text"
        name="title"
        :value="content.title"
        @input="handleTextInput"
        placeholder="Deck title..."
        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
      />
    </div>

    <!-- Text Content -->
    <div class="mb-4">
      <label class="block text-sm text-gray-600 mb-2">Notes</label>
      <textarea
        name="text"
        :value="content.text"
        @input="handleTextInput"
        placeholder="Paste your notes, research, ideas..."
        rows="8"
        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
      ></textarea>
    </div>

    <!-- Image Upload -->
    <div>
      <label class="block text-sm text-gray-600 mb-2">Images</label>
      <div
        @dragover.prevent="dragActive = true"
        @dragleave="dragActive = false"
        @drop="handleDrop"
        :class="[
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
          dragActive ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
        ]"
        @click="$refs.fileInput.click()"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          class="hidden"
          @change="handleFileSelect"
        />
        <p class="text-gray-500">
          <span class="font-medium text-gray-700">Drop images</span> or click to upload
        </p>
      </div>

      <!-- Image previews -->
      <div v-if="content.images.length > 0" class="mt-4 grid grid-cols-4 gap-2">
        <div
          v-for="img in content.images"
          :key="img.id"
          class="relative aspect-square bg-gray-100 rounded overflow-hidden group"
        >
          <img :src="img.data" :alt="img.name" class="w-full h-full object-cover" />
          <button
            @click.stop="removeImage(img.id)"
            class="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
