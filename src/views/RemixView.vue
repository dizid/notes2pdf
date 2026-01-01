<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isLoading = ref(true)
const error = ref(null)

// R2 public URL - should match what's configured in the backend
const R2_PUBLIC_URL = 'https://pub-5e67290c6f034c6e862ab06edffab0d8.r2.dev'

onMounted(async () => {
  const slug = route.params.slug

  if (!slug) {
    error.value = 'Invalid remix link'
    isLoading.value = false
    return
  }

  try {
    // Fetch remix data from R2
    const remixUrl = `${R2_PUBLIC_URL}/${slug}-remix.json`
    const response = await fetch(remixUrl)

    if (!response.ok) {
      throw new Error('Page not found')
    }

    const remixData = await response.json()

    // Store in localStorage for HomeView to pick up
    localStorage.setItem('sizzle-remix', JSON.stringify(remixData))

    // Redirect to app with the content pre-loaded
    router.push('/app')
  } catch (err) {
    console.error('Remix fetch error:', err)
    error.value = err.message || 'Failed to load page data'
    isLoading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center max-w-md mx-auto px-6">
      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-4">
        <div class="w-12 h-12 mx-auto border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
        <p class="text-gray-600">Loading page data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="space-y-6">
        <div class="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h1 class="text-xl font-semibold text-gray-900 mb-2">Couldn't load this page</h1>
          <p class="text-gray-500 mb-6">{{ error }}</p>
        </div>
        <div class="space-y-3">
          <router-link
            to="/app"
            class="block w-full py-3 px-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Create your own page
          </router-link>
          <router-link
            to="/"
            class="block text-gray-500 hover:text-gray-700 text-sm"
          >
            Go to homepage
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
