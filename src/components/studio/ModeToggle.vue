<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'light'
  }
})

const emit = defineEmits(['update:modelValue'])

const isLight = computed(() => props.modelValue === 'light')

function toggle() {
  emit('update:modelValue', isLight.value ? 'dark' : 'light')
}
</script>

<template>
  <div class="mode-toggle">
    <!-- Toggle Switch -->
    <button
      @click="toggle"
      class="relative w-full h-14 rounded-2xl transition-all duration-500 overflow-hidden group"
      :class="isLight ? 'bg-gradient-to-r from-sky-100 to-amber-50' : 'bg-gradient-to-r from-slate-800 to-indigo-900'"
    >
      <!-- Sun/Moon Background Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <!-- Stars (dark mode) -->
        <div
          class="absolute inset-0 transition-opacity duration-500"
          :class="isLight ? 'opacity-0' : 'opacity-100'"
        >
          <div class="absolute w-1 h-1 bg-white rounded-full top-3 left-6 animate-pulse"></div>
          <div class="absolute w-0.5 h-0.5 bg-white/70 rounded-full top-5 left-10 animate-pulse" style="animation-delay: 0.3s"></div>
          <div class="absolute w-1 h-1 bg-white rounded-full top-2 right-12 animate-pulse" style="animation-delay: 0.6s"></div>
          <div class="absolute w-0.5 h-0.5 bg-white/70 rounded-full top-6 right-8 animate-pulse" style="animation-delay: 0.9s"></div>
          <div class="absolute w-0.5 h-0.5 bg-white/50 rounded-full top-4 left-1/2 animate-pulse" style="animation-delay: 0.5s"></div>
        </div>

        <!-- Clouds (light mode) -->
        <div
          class="absolute inset-0 transition-opacity duration-500"
          :class="isLight ? 'opacity-100' : 'opacity-0'"
        >
          <div class="absolute bottom-2 left-4 w-12 h-4 bg-white/50 rounded-full"></div>
          <div class="absolute bottom-3 left-8 w-8 h-3 bg-white/40 rounded-full"></div>
          <div class="absolute bottom-1 right-6 w-10 h-3 bg-white/30 rounded-full"></div>
        </div>
      </div>

      <!-- Toggle Thumb with Icon -->
      <div
        class="absolute top-1.5 w-11 h-11 rounded-xl shadow-lg transition-all duration-500 ease-out flex items-center justify-center"
        :class="isLight
          ? 'left-1.5 bg-gradient-to-br from-amber-300 to-orange-400'
          : 'left-[calc(100%-2.75rem-0.375rem)] bg-gradient-to-br from-slate-200 to-gray-300'"
      >
        <!-- Sun Icon -->
        <svg
          class="absolute w-6 h-6 text-amber-100 transition-all duration-300"
          :class="isLight ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>

        <!-- Moon Icon -->
        <svg
          class="absolute w-5 h-5 text-slate-700 transition-all duration-300"
          :class="isLight ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd" />
        </svg>
      </div>

      <!-- Label -->
      <div
        class="absolute inset-0 flex items-center transition-all duration-500"
        :class="isLight ? 'justify-end pr-5' : 'justify-start pl-5'"
      >
        <span
          class="text-sm font-medium transition-colors duration-300"
          :class="isLight ? 'text-amber-700' : 'text-slate-300'"
        >
          {{ isLight ? 'Light' : 'Dark' }}
        </span>
      </div>
    </button>

    <!-- Color Preview -->
    <div class="mt-4 flex gap-2">
      <div
        class="flex-1 h-8 rounded-lg transition-all duration-500 flex items-center justify-center text-[10px] font-medium"
        :class="isLight ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'bg-gray-900 text-white'"
      >
        Background
      </div>
      <div
        class="flex-1 h-8 rounded-lg transition-all duration-500 flex items-center justify-center text-[10px] font-medium"
        :class="isLight ? 'bg-gray-100 text-gray-700' : 'bg-gray-800 text-gray-300'"
      >
        Surface
      </div>
      <div
        class="flex-1 h-8 rounded-lg transition-all duration-500 flex items-center justify-center text-[10px] font-medium"
        :class="isLight ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'"
      >
        Text
      </div>
    </div>
  </div>
</template>

<style scoped>
.mode-toggle {
  user-select: none;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
