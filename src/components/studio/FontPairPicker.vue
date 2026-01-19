<script setup>
import { ref, computed } from 'vue'
import { FONT_PAIRS, FONT_CATEGORIES } from '../../lib/designPresets'

const props = defineProps({
  modelValue: {
    type: String,
    default: null
  },
  showCategories: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

const selectedCategory = ref('all')
const hoveredPair = ref(null)

const categories = computed(() => ({
  all: 'All Fonts',
  ...FONT_CATEGORIES
}))

const filteredPairs = computed(() => {
  if (selectedCategory.value === 'all') {
    return FONT_PAIRS
  }
  return FONT_PAIRS.filter(pair => pair.category === selectedCategory.value)
})

function selectPair(pairId) {
  emit('update:modelValue', pairId)
}

function getMoodColor(mood) {
  const moodColors = {
    sophisticated: 'bg-purple-100 text-purple-700',
    clean: 'bg-gray-100 text-gray-700',
    magazine: 'bg-rose-100 text-rose-700',
    artistic: 'bg-amber-100 text-amber-700',
    approachable: 'bg-emerald-100 text-emerald-700',
    corporate: 'bg-blue-100 text-blue-700',
    modern: 'bg-indigo-100 text-indigo-700',
    impact: 'bg-red-100 text-red-700',
    elegant: 'bg-violet-100 text-violet-700',
    technical: 'bg-cyan-100 text-cyan-700',
    contemporary: 'bg-teal-100 text-teal-700',
    storytelling: 'bg-orange-100 text-orange-700',
    dramatic: 'bg-fuchsia-100 text-fuchsia-700',
    nostalgic: 'bg-yellow-100 text-yellow-700',
    accessible: 'bg-green-100 text-green-700'
  }
  return moodColors[mood] || 'bg-gray-100 text-gray-700'
}

function getCategoryIcon(category) {
  const icons = {
    serif: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />`,
    sans: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />`,
    display: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />`
  }
  return icons[category] || icons.sans
}
</script>

<template>
  <div class="font-pair-picker">
    <!-- Category Filter -->
    <div v-if="showCategories" class="flex gap-2 mb-4 overflow-x-auto pb-2">
      <button
        v-for="(label, key) in categories"
        :key="key"
        @click="selectedCategory = key"
        :class="[
          'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap',
          selectedCategory === key
            ? 'bg-gray-900 text-white shadow-md'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        ]"
      >
        {{ label }}
      </button>
    </div>

    <!-- Auto Option -->
    <button
      @click="selectPair(null)"
      :class="[
        'w-full mb-3 p-4 rounded-xl border-2 transition-all duration-200 text-left',
        modelValue === null
          ? 'border-gray-900 bg-gray-50 shadow-md'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      ]"
    >
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <div class="font-medium text-gray-900">Auto Detect</div>
          <div class="text-xs text-gray-500">Based on your brand analysis</div>
        </div>
      </div>
    </button>

    <!-- Font Pairs Grid -->
    <div class="grid grid-cols-1 gap-2.5">
      <button
        v-for="pair in filteredPairs"
        :key="pair.id"
        @click="selectPair(pair.id)"
        @mouseenter="hoveredPair = pair.id"
        @mouseleave="hoveredPair = null"
        :class="[
          'relative p-4 rounded-xl border-2 transition-all duration-200 text-left group overflow-hidden',
          modelValue === pair.id
            ? 'border-gray-900 bg-gray-50 shadow-md'
            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
        ]"
      >
        <!-- Selected Indicator -->
        <div
          v-if="modelValue === pair.id"
          class="absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center"
        >
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </div>

        <!-- Font Preview -->
        <div class="mb-3">
          <div
            class="text-xl font-semibold text-gray-900 mb-0.5 truncate transition-colors"
            :style="{ fontFamily: `'${pair.heading}', serif` }"
          >
            {{ pair.name }}
          </div>
          <div
            class="text-sm text-gray-600"
            :style="{ fontFamily: `'${pair.body}', sans-serif` }"
          >
            The quick brown fox jumps over the lazy dog
          </div>
        </div>

        <!-- Font Names + Mood Tag -->
        <div class="flex items-center justify-between gap-2">
          <div class="text-xs text-gray-500 truncate">
            <span class="font-medium">{{ pair.heading }}</span>
            <span v-if="pair.heading !== pair.body" class="opacity-60"> + {{ pair.body }}</span>
          </div>
          <span :class="['px-2 py-0.5 rounded-full text-[10px] font-medium', getMoodColor(pair.mood)]">
            {{ pair.mood }}
          </span>
        </div>

        <!-- Hover Preview Overlay -->
        <div
          v-if="hoveredPair === pair.id && modelValue !== pair.id"
          class="absolute inset-0 bg-gradient-to-t from-gray-900/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        />
      </button>
    </div>
  </div>
</template>

<style scoped>
.font-pair-picker {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 4px;
}

.font-pair-picker::-webkit-scrollbar {
  width: 4px;
}

.font-pair-picker::-webkit-scrollbar-track {
  background: transparent;
}

.font-pair-picker::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

.font-pair-picker::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
