<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { usePublish } from '../composables/usePublish'
import { useStorage } from '../composables/useStorage'
import { useToast } from '../composables/useToast'
import { useTemplates } from '../composables/useTemplates'
import { usePaywall } from '../composables/usePaywall'
import { useHtmlRenderer } from '../composables/useHtmlRenderer'
import { resolveTokens } from '../composables/useTokenResolver'
import PaywallModal from './PaywallModal.vue'
import AuthModal from './AuthModal.vue'

const props = defineProps({
  content: Object,
  template: String,
  tokens: Object,
  hasContent: Boolean
})

const router = useRouter()
const { publish, copyToClipboard, downloadHtml, reset: resetPublish, isPublishing, publishedUrl, publishError, publishErrorCode, generatedHtml } = usePublish()
const { renderToHtml } = useHtmlRenderer()
const { saveToHistory } = useStorage()
const { showSuccess } = useToast()
const { getTemplateById, builtInTemplates } = useTemplates()
const { canPublish, incrementUsage, initUsage } = usePaywall()
const clearDraft = inject('clearDraft', () => {})

// Modal state
const showPublishModal = ref(false)
const showPaywallModal = ref(false)
const showAuthModal = ref(false)
const copied = ref(false)

// Load usage on mount
onMounted(() => initUsage())

const validationErrors = computed(() => {
  const errors = []
  if (!props.content.title?.trim() && !props.content.text?.trim()) {
    errors.push('Add a title or some text content')
  }
  return errors
})

const isValid = computed(() => validationErrors.value.length === 0)

function handlePrint() {
  if (!isValid.value) return

  // Resolve tokens using centralized logic
  const tokens = resolveTokens(props.tokens, props.template, getTemplateById, builtInTemplates.value)

  // Prepare content with images in the right format
  const contentForPrint = {
    ...props.content,
    images: props.content.images?.map(img => ({
      src: img.data || img.src || img.url,
      alt: img.name || ''
    }))
  }

  // Generate printable HTML
  const html = renderToHtml(tokens, contentForPrint)

  // Open in new window using Blob URL (secure, no XSS)
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const printWindow = window.open(url, '_blank')

  if (printWindow) {
    printWindow.onload = () => {
      // Wait for fonts to load, then trigger print
      setTimeout(() => {
        printWindow.print()
        URL.revokeObjectURL(url)
      }, 500)
    }
  }

  // Save to history
  saveToHistory({
    id: Date.now(),
    title: props.content.title || 'Untitled',
    template: props.template,
    timestamp: Date.now(),
    content: {
      title: props.content.title,
      text: props.content.text,
      style: props.content.style
    }
  })
}

async function handlePublish() {
  if (!isValid.value) return

  // Check paywall before publishing
  if (!canPublish.value) {
    showPaywallModal.value = true
    return
  }

  resetPublish()
  copied.value = false
  showPublishModal.value = true

  // Resolve tokens using centralized logic
  const tokens = resolveTokens(props.tokens, props.template, getTemplateById, builtInTemplates.value)

  // Prepare content with images in the right format
  const contentForPublish = {
    ...props.content,
    images: props.content.images?.map(img => ({
      src: img.data || img.src || img.url,
      alt: img.name || ''
    }))
  }

  await publish(tokens, contentForPublish, props.template)

  if (publishedUrl.value) {
    // Increment usage after successful publish
    await incrementUsage()

    saveToHistory({
      id: Date.now(),
      title: props.content.title || 'Untitled',
      template: props.template,
      timestamp: Date.now(),
      publishedUrl: publishedUrl.value,
      content: {
        title: props.content.title,
        text: props.content.text,
        style: props.content.style
      }
    })

    // Clear draft after successful publish
    clearDraft()
  }
}

// Handle auth flow from paywall
function handleSignInFromPaywall() {
  showPaywallModal.value = false
  showAuthModal.value = true
}

function handleAuthenticated() {
  showAuthModal.value = false
  router.push('/pricing')
}

async function handleCopy() {
  if (publishedUrl.value) {
    const success = await copyToClipboard(publishedUrl.value)
    if (success) {
      copied.value = true
      showSuccess('Link copied!')
      setTimeout(() => { copied.value = false }, 2000)
    }
  }
}

function handleDownloadHtml() {
  const title = props.content.title || 'page'
  const success = downloadHtml(title)
  if (success) {
    showSuccess('HTML downloaded!')
    closeModal()
  }
}

function closeModal() {
  showPublishModal.value = false
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6">
    <h2 class="text-lg font-medium mb-4">Export</h2>

    <!-- Validation warnings -->
    <div v-if="validationErrors.length > 0" class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
      <p class="text-sm text-amber-800 font-medium mb-1">Before exporting:</p>
      <ul class="text-sm text-amber-700 space-y-1">
        <li v-for="error in validationErrors" :key="error" class="flex items-center gap-2">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {{ error }}
        </li>
      </ul>
    </div>

    <!-- Export buttons -->
    <div class="flex gap-3">
      <!-- Publish button -->
      <button
        @click="handlePublish"
        :disabled="!isValid || isPublishing"
        :class="[
          'flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2',
          isValid
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        ]"
      >
        <span v-if="isPublishing" class="flex items-center gap-2">
          <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Publishing...
        </span>
        <span v-else class="flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Publish
        </span>
      </button>

      <!-- Print to PDF button -->
      <button
        @click="handlePrint"
        :disabled="!isValid"
        :class="[
          'flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2',
          isValid
            ? 'bg-gray-900 text-white hover:bg-gray-800'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        ]"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print to PDF
      </button>
    </div>
  </div>

  <!-- Paywall Modal -->
  <PaywallModal
    :show="showPaywallModal"
    @close="showPaywallModal = false"
    @signIn="handleSignInFromPaywall"
  />

  <!-- Auth Modal (for signup after paywall) -->
  <AuthModal
    :show="showAuthModal"
    initial-mode="signup"
    @close="showAuthModal = false"
    @authenticated="handleAuthenticated"
  />

  <!-- Publish Modal -->
  <Teleport to="body">
    <div
      v-if="showPublishModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold">Publish your page</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="px-6 py-6">
          <!-- Loading state -->
          <div v-if="isPublishing" class="text-center py-8">
            <svg class="w-8 h-8 animate-spin mx-auto text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="mt-3 text-gray-600">Publishing your page...</p>
          </div>

          <!-- Error state - Cloud not configured -->
          <div v-else-if="publishErrorCode === 'R2_NOT_CONFIGURED' && generatedHtml" class="text-center py-4">
            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-gray-800 font-medium">Cloud publishing unavailable</p>
            <p class="text-sm text-gray-500 mt-1">Download your page as an HTML file instead</p>
            <button
              @click="handleDownloadHtml"
              class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 mx-auto"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download HTML
            </button>
          </div>

          <!-- Error state - Other errors -->
          <div v-else-if="publishError" class="text-center py-4">
            <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p class="text-red-600 font-medium">Publishing failed</p>
            <p class="text-sm text-gray-500 mt-1">{{ publishError }}</p>
            <div class="flex gap-2 justify-center mt-4">
              <button
                v-if="generatedHtml"
                @click="handleDownloadHtml"
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download HTML
              </button>
              <button
                @click="handlePublish"
                class="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
              >
                Try again
              </button>
            </div>
          </div>

          <!-- Success state -->
          <div v-else-if="publishedUrl">
            <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p class="text-center text-gray-600 mb-4">Your page is live! Share this link:</p>

            <!-- URL display -->
            <div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <input
                type="text"
                :value="publishedUrl"
                readonly
                class="flex-1 bg-transparent text-sm text-gray-700 outline-none truncate"
              />
              <button
                @click="handleCopy"
                :class="[
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  copied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                ]"
              >
                {{ copied ? 'Copied!' : 'Copy' }}
              </button>
            </div>

            <!-- Open link -->
            <a
              :href="publishedUrl"
              target="_blank"
              class="mt-4 block text-center text-sm text-blue-600 hover:underline"
            >
              Open in new tab
            </a>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
