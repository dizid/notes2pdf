<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStorage } from '../composables/useStorage'
import { useToast } from '../composables/useToast'
import { useAuth } from '../composables/useAuth'
import { useAnalytics } from '../composables/useAnalytics'
import { usePaywall } from '../composables/usePaywall'

const { getHistory, deleteFromHistory, clearHistory } = useStorage()
const { showSuccess } = useToast()
const { isAuthenticated } = useAuth()
const { getMultiplePageStats, extractSlugFromUrl } = useAnalytics()
const { isPro } = usePaywall()

const history = ref([])
const loading = ref(true)
const pageStats = ref({})

// Total views across all pages
const totalViews = computed(() => {
  return Object.values(pageStats.value).reduce((sum, stats) => sum + (stats?.total_views || 0), 0)
})

onMounted(async () => {
  try {
    history.value = await getHistory()

    // Fetch analytics for all published pages
    if (isPro.value && history.value.length > 0) {
      const slugs = history.value
        .filter(item => item.publishedUrl)
        .map(item => extractSlugFromUrl(item.publishedUrl))
        .filter(Boolean)

      if (slugs.length > 0) {
        pageStats.value = await getMultiplePageStats(slugs)
      }
    }
  } catch (err) {
    console.error('Failed to load history:', err)
  } finally {
    loading.value = false
  }
})

function getViewsForItem(item) {
  if (!item.publishedUrl) return null
  const slug = extractSlugFromUrl(item.publishedUrl)
  return slug ? pageStats.value[slug]?.total_views || 0 : null
}

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

    <!-- Analytics Summary (Pro only) -->
    <div v-if="isPro && history.length > 0" class="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total Page Views</p>
            <p class="text-2xl font-semibold text-gray-900">{{ totalViews.toLocaleString() }}</p>
          </div>
        </div>
        <span class="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
          Analytics
        </span>
      </div>
    </div>

    <!-- Analytics Upgrade Prompt (Non-Pro) -->
    <div v-else-if="!isPro && history.length > 0" class="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">See who's viewing your pages</p>
            <p class="text-xs text-gray-500">Upgrade to Pro to unlock page view analytics</p>
          </div>
        </div>
        <RouterLink
          to="/pricing"
          class="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Upgrade
        </RouterLink>
      </div>
    </div>

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
            <div v-if="item.publishedUrl" class="mt-3 flex items-center gap-3">
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

              <!-- View count (Pro only) -->
              <span
                v-if="isPro && getViewsForItem(item) !== null"
                class="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {{ getViewsForItem(item).toLocaleString() }} {{ getViewsForItem(item) === 1 ? 'view' : 'views' }}
              </span>
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
