<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'normal'
  }
})

const emit = defineEmits(['update:modelValue'])

const densities = [
  {
    id: 'compact',
    label: 'Compact',
    description: 'Tighter spacing',
    icon: `<rect x="3" y="3" width="18" height="4" rx="1" /><rect x="3" y="10" width="18" height="4" rx="1" /><rect x="3" y="17" width="18" height="4" rx="1" />`
  },
  {
    id: 'normal',
    label: 'Normal',
    description: 'Balanced layout',
    icon: `<rect x="3" y="2" width="18" height="4" rx="1" /><rect x="3" y="10" width="18" height="4" rx="1" /><rect x="3" y="18" width="18" height="4" rx="1" />`
  },
  {
    id: 'spacious',
    label: 'Spacious',
    description: 'More breathing room',
    icon: `<rect x="4" y="2" width="16" height="3" rx="1" /><rect x="4" y="10.5" width="16" height="3" rx="1" /><rect x="4" y="19" width="16" height="3" rx="1" />`
  }
]

const currentIndex = computed(() =>
  densities.findIndex(d => d.id === props.modelValue)
)

const sliderPosition = computed(() => {
  const idx = currentIndex.value
  if (idx === -1) return '33.33%'
  return `${(idx / (densities.length - 1)) * 100}%`
})

function selectDensity(id) {
  emit('update:modelValue', id)
}
</script>

<template>
  <div class="density-slider">
    <!-- Visual Slider Track -->
    <div class="relative mb-4">
      <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-gray-700 to-gray-900 rounded-full transition-all duration-300 ease-out"
          :style="{ width: sliderPosition }"
        />
      </div>

      <!-- Slider Dots -->
      <div class="absolute inset-0 flex justify-between items-center px-0">
        <button
          v-for="(density, index) in densities"
          :key="density.id"
          @click="selectDensity(density.id)"
          :class="[
            'w-4 h-4 rounded-full border-2 transition-all duration-200 -mt-1',
            index <= currentIndex
              ? 'bg-gray-900 border-gray-900 scale-110'
              : 'bg-white border-gray-300 hover:border-gray-400'
          ]"
        />
      </div>
    </div>

    <!-- Density Options -->
    <div class="grid grid-cols-3 gap-2">
      <button
        v-for="density in densities"
        :key="density.id"
        @click="selectDensity(density.id)"
        :class="[
          'p-3 rounded-xl border-2 transition-all duration-200 text-center group',
          modelValue === density.id
            ? 'border-gray-900 bg-gray-50 shadow-md'
            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
        ]"
      >
        <!-- Icon -->
        <div class="flex justify-center mb-2">
          <svg
            class="w-8 h-8 transition-colors duration-200"
            :class="modelValue === density.id ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'"
            fill="currentColor"
            viewBox="0 0 24 24"
            v-html="density.icon"
          />
        </div>

        <!-- Label -->
        <div
          class="text-sm font-medium transition-colors duration-200"
          :class="modelValue === density.id ? 'text-gray-900' : 'text-gray-600'"
        >
          {{ density.label }}
        </div>

        <!-- Description -->
        <div class="text-[10px] text-gray-400 mt-0.5">
          {{ density.description }}
        </div>
      </button>
    </div>

    <!-- Live Preview Indicator -->
    <div class="mt-4 p-3 bg-gray-50 rounded-lg">
      <div class="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Preview</div>
      <div
        class="space-y-1 transition-all duration-300"
        :class="{
          'space-y-0.5': modelValue === 'compact',
          'space-y-1': modelValue === 'normal',
          'space-y-2': modelValue === 'spacious'
        }"
      >
        <div class="h-2 bg-gray-300 rounded w-3/4"></div>
        <div class="h-1.5 bg-gray-200 rounded w-full"></div>
        <div class="h-1.5 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.density-slider {
  user-select: none;
}
</style>
