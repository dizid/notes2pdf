<script setup>
import { computed } from 'vue'
import { useTemplateBuilder, ELEMENT_TYPES } from '../composables/useTemplateBuilder'

const {
  selectedElement,
  selectedElementId,
  updateElement,
  removeElement,
  moveElement,
  duplicateElement
} = useTemplateBuilder()

const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 56, 64, 72]
const fontWeights = [
  { value: 'normal', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semibold' },
  { value: 'bold', label: 'Bold' }
]
const textAligns = ['left', 'center', 'right']

const isTextElement = computed(() => {
  return selectedElement.value?.type === ELEMENT_TYPES.TEXT ||
         selectedElement.value?.type === ELEMENT_TYPES.HEADING
})

function updateStyle(key, value) {
  if (!selectedElementId.value) return
  updateElement(selectedElementId.value, {
    style: { [key]: value }
  })
}

function updateContent(content) {
  if (!selectedElementId.value) return
  updateElement(selectedElementId.value, { content })
}

function handleDelete() {
  if (!selectedElementId.value) return
  removeElement(selectedElementId.value)
}

function handleDuplicate() {
  if (!selectedElementId.value) return
  duplicateElement(selectedElementId.value)
}

function handleMoveUp() {
  if (!selectedElementId.value) return
  moveElement(selectedElementId.value, 'up')
}

function handleMoveDown() {
  if (!selectedElementId.value) return
  moveElement(selectedElementId.value, 'down')
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4">
    <h3 class="text-sm font-medium text-gray-700 mb-3">Style</h3>

    <!-- No selection -->
    <div v-if="!selectedElement" class="text-sm text-gray-500 text-center py-8">
      Select an element to edit its style
    </div>

    <!-- Element selected -->
    <div v-else class="space-y-4">
      <!-- Element type badge -->
      <div class="flex items-center justify-between">
        <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {{ selectedElement.type }}
        </span>
        <div class="flex gap-1">
          <button
            @click="handleMoveUp"
            class="p-1.5 rounded hover:bg-gray-100 text-gray-500"
            title="Move up"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            @click="handleMoveDown"
            class="p-1.5 rounded hover:bg-gray-100 text-gray-500"
            title="Move down"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            @click="handleDuplicate"
            class="p-1.5 rounded hover:bg-gray-100 text-gray-500"
            title="Duplicate"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            @click="handleDelete"
            class="p-1.5 rounded hover:bg-red-50 text-red-500"
            title="Delete"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Text content (for text/heading) -->
      <div v-if="isTextElement">
        <label class="block text-xs text-gray-500 mb-1">Content</label>
        <textarea
          :value="selectedElement.content"
          @input="updateContent($event.target.value)"
          rows="3"
          class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
        ></textarea>
      </div>

      <!-- Font size (for text/heading) -->
      <div v-if="isTextElement">
        <label class="block text-xs text-gray-500 mb-1">Font Size</label>
        <select
          :value="selectedElement.style?.fontSize"
          @change="updateStyle('fontSize', parseInt($event.target.value))"
          class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        >
          <option v-for="size in fontSizes" :key="size" :value="size">{{ size }}px</option>
        </select>
      </div>

      <!-- Font weight (for text/heading) -->
      <div v-if="isTextElement">
        <label class="block text-xs text-gray-500 mb-1">Font Weight</label>
        <select
          :value="selectedElement.style?.fontWeight"
          @change="updateStyle('fontWeight', $event.target.value)"
          class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        >
          <option v-for="weight in fontWeights" :key="weight.value" :value="weight.value">
            {{ weight.label }}
          </option>
        </select>
      </div>

      <!-- Text align (for text/heading) -->
      <div v-if="isTextElement">
        <label class="block text-xs text-gray-500 mb-1">Alignment</label>
        <div class="flex gap-1">
          <button
            v-for="align in textAligns"
            :key="align"
            @click="updateStyle('textAlign', align)"
            :class="[
              'flex-1 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
              selectedElement.style?.textAlign === align
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ align }}
          </button>
        </div>
      </div>

      <!-- Color (for text/heading/divider/shape) -->
      <div v-if="isTextElement || selectedElement.type === ELEMENT_TYPES.DIVIDER || selectedElement.type === ELEMENT_TYPES.SHAPE">
        <label class="block text-xs text-gray-500 mb-1">
          {{ isTextElement ? 'Text Color' : 'Color' }}
        </label>
        <div class="flex gap-2 items-center">
          <input
            type="color"
            :value="selectedElement.style?.color || selectedElement.style?.backgroundColor || '#333333'"
            @input="updateStyle(isTextElement ? 'color' : (selectedElement.type === ELEMENT_TYPES.SHAPE ? 'backgroundColor' : 'color'), $event.target.value)"
            class="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
          />
          <input
            type="text"
            :value="selectedElement.style?.color || selectedElement.style?.backgroundColor || '#333333'"
            @input="updateStyle(isTextElement ? 'color' : (selectedElement.type === ELEMENT_TYPES.SHAPE ? 'backgroundColor' : 'color'), $event.target.value)"
            class="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Height (for spacer/divider) -->
      <div v-if="selectedElement.type === ELEMENT_TYPES.SPACER || selectedElement.type === ELEMENT_TYPES.DIVIDER">
        <label class="block text-xs text-gray-500 mb-1">Height</label>
        <input
          type="range"
          min="8"
          max="120"
          :value="selectedElement.style?.height || 32"
          @input="updateStyle('height', parseInt($event.target.value))"
          class="w-full"
        />
        <div class="text-xs text-gray-400 text-right">{{ selectedElement.style?.height || 32 }}px</div>
      </div>

      <!-- Border radius (for shape/image) -->
      <div v-if="selectedElement.type === ELEMENT_TYPES.SHAPE || selectedElement.type === ELEMENT_TYPES.IMAGE">
        <label class="block text-xs text-gray-500 mb-1">Corner Radius</label>
        <input
          type="range"
          min="0"
          max="50"
          :value="selectedElement.style?.borderRadius || 0"
          @input="updateStyle('borderRadius', parseInt($event.target.value))"
          class="w-full"
        />
        <div class="text-xs text-gray-400 text-right">{{ selectedElement.style?.borderRadius || 0 }}px</div>
      </div>
    </div>
  </div>
</template>
