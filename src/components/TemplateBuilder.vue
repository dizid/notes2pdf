<script setup>
import { computed } from 'vue'
import { useTemplateBuilder, ELEMENT_TYPES } from '../composables/useTemplateBuilder'

const props = defineProps({
  scale: {
    type: Number,
    default: 0.5
  }
})

const {
  elements,
  selectedElementId,
  canvasSettings,
  selectElement,
  clearSelection
} = useTemplateBuilder()

const canvasStyle = computed(() => ({
  width: `${canvasSettings.value.width}px`,
  minHeight: `${canvasSettings.value.height}px`,
  backgroundColor: canvasSettings.value.backgroundColor,
  padding: `${canvasSettings.value.padding}px`,
  transform: `scale(${props.scale})`,
  transformOrigin: 'top left'
}))

const wrapperStyle = computed(() => ({
  width: `${canvasSettings.value.width * props.scale}px`,
  height: `${canvasSettings.value.height * props.scale}px`
}))

function handleCanvasClick(event) {
  // Only clear if clicking directly on canvas, not on an element
  if (event.target === event.currentTarget) {
    clearSelection()
  }
}

function handleElementClick(id, event) {
  event.stopPropagation()
  selectElement(id)
}

function getElementStyle(element) {
  const baseStyle = {
    ...element.style,
    cursor: 'pointer'
  }

  if (element.type === ELEMENT_TYPES.TEXT || element.type === ELEMENT_TYPES.HEADING) {
    return {
      ...baseStyle,
      fontSize: `${element.style.fontSize}px`,
      fontWeight: element.style.fontWeight,
      textAlign: element.style.textAlign,
      color: element.style.color,
      lineHeight: element.style.lineHeight
    }
  }

  if (element.type === ELEMENT_TYPES.DIVIDER) {
    return {
      height: `${element.style.height}px`,
      backgroundColor: element.style.color,
      width: element.style.width,
      margin: element.style.margin,
      cursor: 'pointer'
    }
  }

  if (element.type === ELEMENT_TYPES.SPACER) {
    return {
      height: `${element.style.height}px`,
      cursor: 'pointer'
    }
  }

  if (element.type === ELEMENT_TYPES.SHAPE) {
    return {
      ...baseStyle,
      width: `${element.style.width}px`,
      height: `${element.style.height}px`,
      backgroundColor: element.style.backgroundColor,
      borderRadius: `${element.style.borderRadius}px`
    }
  }

  if (element.type === ELEMENT_TYPES.IMAGE) {
    return {
      ...baseStyle,
      width: element.style.width,
      borderRadius: `${element.style.borderRadius}px`,
      objectFit: element.style.objectFit
    }
  }

  return baseStyle
}
</script>

<template>
  <div class="overflow-auto bg-gray-200 rounded-lg p-4">
    <div :style="wrapperStyle" class="relative">
      <div
        :style="canvasStyle"
        class="bg-white shadow-xl"
        @click="handleCanvasClick"
      >
        <div
          v-for="element in elements"
          :key="element.id"
          @click="handleElementClick(element.id, $event)"
          :class="[
            'relative transition-all',
            selectedElementId === element.id ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300'
          ]"
        >
          <!-- Heading -->
          <h2
            v-if="element.type === ELEMENT_TYPES.HEADING"
            :style="getElementStyle(element)"
            class="font-serif"
          >
            {{ element.content }}
          </h2>

          <!-- Text -->
          <p
            v-else-if="element.type === ELEMENT_TYPES.TEXT"
            :style="getElementStyle(element)"
          >
            {{ element.content }}
          </p>

          <!-- Divider -->
          <div
            v-else-if="element.type === ELEMENT_TYPES.DIVIDER"
            :style="getElementStyle(element)"
          ></div>

          <!-- Spacer -->
          <div
            v-else-if="element.type === ELEMENT_TYPES.SPACER"
            :style="getElementStyle(element)"
            class="bg-gray-100/50 border border-dashed border-gray-300"
          >
            <span class="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
              Spacer
            </span>
          </div>

          <!-- Shape -->
          <div
            v-else-if="element.type === ELEMENT_TYPES.SHAPE"
            :style="getElementStyle(element)"
          ></div>

          <!-- Image -->
          <div
            v-else-if="element.type === ELEMENT_TYPES.IMAGE"
            :style="getElementStyle(element)"
            class="bg-gray-100 flex items-center justify-center min-h-[100px]"
          >
            <img
              v-if="element.content?.src"
              :src="element.content.src"
              :alt="element.content.alt"
              :style="getElementStyle(element)"
            />
            <div v-else class="text-gray-400 text-center p-4">
              <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-xs">Click to add image</span>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-if="elements.length === 0"
          class="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-400"
        >
          <svg class="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <p class="text-sm">Add elements from the palette</p>
        </div>
      </div>
    </div>
  </div>
</template>
