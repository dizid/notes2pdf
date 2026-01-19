<script setup>
import { ref } from 'vue'
import { useContentParser } from '../composables/useContentParser'

const props = defineProps({
  content: Object
})

const emit = defineEmits(['update', 'parsed'])

const dragActive = ref(false)

// Smart Paste state
const smartPasteMode = ref(false)
const rawNotes = ref('')
const { isParsing, parseError, parsedContent, parseContent, clearParsed } = useContentParser()

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

// Smart Paste functions
function toggleSmartPaste() {
  smartPasteMode.value = !smartPasteMode.value
  if (!smartPasteMode.value) {
    rawNotes.value = ''
    clearParsed()
  }
}

async function handleSmartParse() {
  await parseContent(rawNotes.value)
}

function acceptParsed() {
  if (parsedContent.value) {
    // Update content with parsed values
    emit('update', {
      title: parsedContent.value.title,
      text: parsedContent.value.body
    })

    // Emit the full parsed data including archetype suggestion
    emit('parsed', {
      ...parsedContent.value,
      accepted: true
    })

    // Exit smart paste mode
    smartPasteMode.value = false
    rawNotes.value = ''
    clearParsed()
  }
}

function rejectParsed() {
  clearParsed()
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6 text-gray-900">
    <!-- Header with toggle -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-medium text-gray-900">Content</h2>
      <button
        @click="toggleSmartPaste"
        :class="[
          'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
          smartPasteMode
            ? 'bg-purple-100 text-purple-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        {{ smartPasteMode ? 'Normal Input' : 'Smart Paste' }}
      </button>
    </div>

    <!-- Smart Paste Mode -->
    <div v-if="smartPasteMode" class="space-y-4">
      <!-- Raw notes input (before parsing) -->
      <div v-if="!parsedContent">
        <label class="block text-sm text-gray-600 mb-2">Paste your raw notes</label>
        <textarea
          v-model="rawNotes"
          placeholder="Paste your meeting notes, brainstorm, rough draft, or any unstructured text here. AI will extract a title, organize the content, and suggest a design style..."
          rows="8"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
        ></textarea>

        <!-- Error message -->
        <p v-if="parseError" class="mt-2 text-sm text-red-600">
          {{ parseError }}
        </p>

        <!-- Parse button -->
        <button
          @click="handleSmartParse"
          :disabled="isParsing || rawNotes.trim().length < 20"
          :class="[
            'mt-3 w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2',
            isParsing || rawNotes.trim().length < 20
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          ]"
        >
          <svg v-if="isParsing" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          {{ isParsing ? 'Analyzing...' : 'Structure My Notes' }}
        </button>

        <p class="mt-2 text-xs text-gray-500 text-center">
          Minimum 20 characters required
        </p>
      </div>

      <!-- Parsed result preview (after parsing) -->
      <div v-else class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium text-gray-700">Suggested Structure</h3>
          <span class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
            {{ parsedContent.suggestedArchetype }} style
          </span>
        </div>

        <!-- Editable title -->
        <div>
          <label class="block text-xs text-gray-500 mb-1">Title</label>
          <input
            :value="parsedContent.title"
            @input="parsedContent.title = $event.target.value"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg font-medium"
          />
        </div>

        <!-- Editable subtitle (if present) -->
        <div v-if="parsedContent.subtitle">
          <label class="block text-xs text-gray-500 mb-1">Subtitle</label>
          <input
            :value="parsedContent.subtitle"
            @input="parsedContent.subtitle = $event.target.value"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-600"
          />
        </div>

        <!-- Editable body -->
        <div>
          <label class="block text-xs text-gray-500 mb-1">Content</label>
          <textarea
            :value="parsedContent.body"
            @input="parsedContent.body = $event.target.value"
            rows="6"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none"
          ></textarea>
        </div>

        <!-- Highlights (if present) -->
        <div v-if="parsedContent.highlights?.length" class="bg-gray-50 rounded-lg p-3">
          <label class="block text-xs text-gray-500 mb-2">Key Highlights</label>
          <ul class="space-y-1">
            <li
              v-for="(highlight, index) in parsedContent.highlights"
              :key="index"
              class="flex items-start gap-2 text-sm text-gray-700"
            >
              <span class="text-purple-500 mt-0.5">•</span>
              {{ highlight }}
            </li>
          </ul>
        </div>

        <!-- Action buttons -->
        <div class="flex gap-3">
          <button
            @click="rejectParsed"
            class="flex-1 py-2.5 px-4 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Try Again
          </button>
          <button
            @click="acceptParsed"
            class="flex-1 py-2.5 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Use This
          </button>
        </div>
      </div>
    </div>

    <!-- Normal Input Mode -->
    <div v-else class="space-y-4">
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
