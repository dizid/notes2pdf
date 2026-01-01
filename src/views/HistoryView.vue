<script setup>
import { ref, onMounted } from 'vue'
import { useStorage } from '../composables/useStorage'
import { useToast } from '../composables/useToast'
import { useAuth } from '../composables/useAuth'

const { getHistory, deleteFromHistory, clearHistory } = useStorage()
const { showSuccess } = useToast()
const { isAuthenticated } = useAuth()

const history = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    history.value = await getHistory()
  } catch (err) {
    console.error('Failed to load history:', err)
  } finally {
    loading.value = false
  }
})

async function handleDelete(id) {
  await deleteFromHistory(id)
  history.value = await getHistory()
}

async function handleClear() {
  await clearHistory()
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

function copyUrl(url) {
  navigator.clipboard.writeText(url)
  showSuccess('URL copied!')
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-8">
    <header class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl mb-2">History</h1>
        <p class="text-gray-500">
          Your previously exported pages
          <span v-if="isAuthenticated" class="text-green-600 text-sm ml-2">
            (synced)
          </span>
        </p>
      </div>
      <button
        v-if="history.length > 0"
        @click="handleClear"
        class="text-sm text-gray-500 hover:text-red-600 transition-colors"
      >
        Clear all
      </button>
    </header>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-16">
      <div class="inline-block w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      <p class="text-gray-400 mt-4">Loading history...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="history.length === 0" class="text-center py-16">
      <p class="text-gray-400 text-lg">No exports yet</p>
      <RouterLink to="/" class="text-sm text-gray-600 hover:text-gray-900 mt-2 inline-block">
        Create your first page
      </RouterLink>
    </div>

    <!-- History list -->
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

            <!-- Published URL -->
            <div v-if="item.publishedUrl" class="mt-3 flex items-center gap-2">
              <a
                :href="item.publishedUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-blue-600 hover:text-blue-700 truncate max-w-xs"
              >
                {{ item.publishedUrl }}
              </a>
              <button
                @click="copyUrl(item.publishedUrl)"
                class="text-gray-400 hover:text-gray-600 shrink-0"
                title="Copy URL"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
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
