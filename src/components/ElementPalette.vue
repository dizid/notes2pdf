<script setup>
import { useTemplateBuilder, ELEMENT_TYPES } from '../composables/useTemplateBuilder'

const { addElement } = useTemplateBuilder()

const elementButtons = [
  { type: ELEMENT_TYPES.HEADING, label: 'Heading', icon: 'heading' },
  { type: ELEMENT_TYPES.TEXT, label: 'Text', icon: 'text' },
  { type: ELEMENT_TYPES.IMAGE, label: 'Image', icon: 'image' },
  { type: ELEMENT_TYPES.DIVIDER, label: 'Divider', icon: 'divider' },
  { type: ELEMENT_TYPES.SPACER, label: 'Spacer', icon: 'spacer' },
  { type: ELEMENT_TYPES.SHAPE, label: 'Shape', icon: 'shape' }
]

function handleAddElement(type) {
  addElement(type)
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4">
    <h3 class="text-sm font-medium text-gray-700 mb-3">Elements</h3>

    <div class="grid grid-cols-3 gap-2">
      <button
        v-for="el in elementButtons"
        :key="el.type"
        @click="handleAddElement(el.type)"
        class="flex flex-col items-center gap-1 p-3 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-colors group"
      >
        <!-- Heading icon -->
        <svg v-if="el.icon === 'heading'" class="w-5 h-5 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
        </svg>

        <!-- Text icon -->
        <svg v-if="el.icon === 'text'" class="w-5 h-5 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h10" />
        </svg>

        <!-- Image icon -->
        <svg v-if="el.icon === 'image'" class="w-5 h-5 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>

        <!-- Divider icon -->
        <svg v-if="el.icon === 'divider'" class="w-5 h-5 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
        </svg>

        <!-- Spacer icon -->
        <svg v-if="el.icon === 'spacer'" class="w-5 h-5 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>

        <!-- Shape icon -->
        <svg v-if="el.icon === 'shape'" class="w-5 h-5 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
        </svg>

        <span class="text-xs text-gray-600">{{ el.label }}</span>
      </button>
    </div>
  </div>
</template>
