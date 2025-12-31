<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import InputZone from '../components/InputZone.vue'
import DesignPicker from '../components/DesignPicker.vue'
import PreviewPane from '../components/PreviewPane.vue'
import OutputActions from '../components/OutputActions.vue'
import OnboardingModal from '../components/OnboardingModal.vue'
import { useOnboarding } from '../composables/useOnboarding'

const route = useRoute()
const { shouldShowOnboarding, startOnboarding } = useOnboarding()

const content = ref({
  title: '',
  text: '',
  images: []
})

// Read template from URL query param, or default to bold-editorial
const selectedTemplate = ref(route.query.template || 'bold-editorial')

// Update if route changes (e.g., coming back from Studio)
onMounted(() => {
  if (route.query.template) {
    selectedTemplate.value = route.query.template
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
  </div>
</template>
