<script setup>
import { ref, onMounted } from 'vue'
import { useStorage } from '../composables/useStorage'
import { useToast } from '../composables/useToast'

const { getHistory, deleteFromHistory, clearHistory } = useStorage()
const { showSuccess } = useToast()
const history = ref([])

onMounted(() => {
  history.value = getHistory()
})

function handleDelete(id) {
  deleteFromHistory(id)
  history.value = getHistory()
}

function handleClear() {
  clearHistory()
  history.value = []
  showSuccess('History cleared')
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-8">
    <header class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl mb-2">History</h1>
        <p class="text-gray-500">Your previously exported decks</p>
      </div>
      <button
        v-if="history.length > 0"
        @click="handleClear"
        class="text-sm text-gray-500 hover:text-red-600 transition-colors"
      >
        Clear all
      </button>
    </header>

    <div v-if="history.length === 0" class="text-center py-16">
      <p class="text-gray-400 text-lg">No exports yet</p>
      <RouterLink to="/" class="text-sm text-gray-600 hover:text-gray-900 mt-2 inline-block">
        Create your first deck
      </RouterLink>
    </div>

    <div v-else class="space-y-4">
      <article
        v-for="item in history"
        :key="item.id"
        class="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <h3 class="font-medium text-gray-900 truncate">
              {{ item.title || 'Untitled' }}
            </h3>
            <p class="text-sm text-gray-500 mt-1">
              {{ formatDate(item.timestamp) }}
            </p>
            <p class="text-sm text-gray-400 mt-2">
              Template: {{ item.template }}
            </p>
          </div>
          <button
            @click="handleDelete(item.id)"
            class="text-gray-400 hover:text-red-500 transition-colors ml-4"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </article>
    </div>
  </div>
</template>
