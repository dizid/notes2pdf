<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InputZone from '../components/InputZone.vue'
import DesignPicker from '../components/DesignPicker.vue'
import PreviewPane from '../components/PreviewPane.vue'
import OutputActions from '../components/OutputActions.vue'
import OnboardingModal from '../components/OnboardingModal.vue'
import AuthModal from '../components/AuthModal.vue'
import { useOnboarding } from '../composables/useOnboarding'
import { usePaywall } from '../composables/usePaywall'
import { useToast } from '../composables/useToast'

const route = useRoute()
const router = useRouter()
const { shouldShowOnboarding, startOnboarding } = useOnboarding()
const { refreshProStatus } = usePaywall()
const { showSuccess } = useToast()

const content = ref({
  title: '',
  text: '',
  images: []
})

// Auth modal for ?auth=true query param
const showAuthModal = ref(false)

// Read template from URL query param, or default to bold-editorial
const selectedTemplate = ref(route.query.template || 'bold-editorial')

// Update if route changes (e.g., coming back from Studio)
onMounted(async () => {
  // Check for remix data (from "Create your own" viral link)
  const remixDataStr = localStorage.getItem('sizzle-remix')
  if (remixDataStr) {
    try {
      const remixData = JSON.parse(remixDataStr)
      // Pre-populate content from remix
      if (remixData.content) {
        content.value = {
          title: remixData.content.title || '',
          text: remixData.content.text || '',
          images: remixData.content.images || []
        }
      }
      // Set template style
      if (remixData.templateStyle) {
        selectedTemplate.value = remixData.templateStyle
      }
      // Clear remix data after loading
      localStorage.removeItem('sizzle-remix')
      showSuccess('Page loaded! Edit and make it your own.')
    } catch (err) {
      console.error('Failed to parse remix data:', err)
      localStorage.removeItem('sizzle-remix')
    }
  }

  if (route.query.template) {
    selectedTemplate.value = route.query.template
  }

  // Handle checkout success return from Stripe
  if (route.query.checkout === 'success') {
    await refreshProStatus()
    showSuccess('Welcome to Pro! You now have unlimited publishes.')
    // Clean up URL
    router.replace({ path: route.path, query: {} })
  }

  // Handle auth trigger from pricing page
  if (route.query.auth === 'true') {
    showAuthModal.value = true
    router.replace({ path: route.path, query: {} })
  }

  // Show onboarding for first-time users
  if (shouldShowOnboarding()) {
    startOnboarding()
  }
})

const hasContent = computed(() => {
  return !!(content.value.title.trim() || content.value.text.trim() || content.value.images.length > 0)
})

function updateContent(newContent) {
  content.value = { ...content.value, ...newContent }
}

// Handle brand URL from onboarding
function handleBrandUrl(url) {
  // Could navigate to studio with URL or store for later
  console.log('Brand URL for extraction:', url)
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-8">
    <header class="mb-8">
      <h1 class="text-3xl mb-2">Create a Page</h1>
      <p class="text-gray-500">Add your content, pick a template, publish instantly</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Left: Input & Design Selection -->
      <div class="space-y-6">
        <InputZone :content="content" @update="updateContent" />
        <DesignPicker v-model="selectedTemplate" />
      </div>

      <!-- Right: Preview & Export -->
      <div class="space-y-6">
        <PreviewPane :content="content" :template="selectedTemplate" />
        <OutputActions :content="content" :template="selectedTemplate" :hasContent="hasContent" />
      </div>
    </div>

    <!-- Onboarding Modal -->
    <OnboardingModal @brandUrl="handleBrandUrl" />

    <!-- Auth Modal (triggered by ?auth=true) -->
    <AuthModal
      :show="showAuthModal"
      @close="showAuthModal = false"
      @authenticated="showAuthModal = false"
    />
  </div>
</template>
