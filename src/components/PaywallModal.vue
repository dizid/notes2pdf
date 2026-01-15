<script setup>
import { usePaywall } from '../composables/usePaywall'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close', 'signIn'])

const { usageCount, FREE_TIER_LIMIT, createCheckout, loading, error } = usePaywall()
const { isAuthenticated } = useAuth()
const { showError } = useToast()

const features = [
  'Unlimited publishes',
  'AI brand extraction',
  'Page view analytics',
  'All export formats',
  'No sizzle branding'
]

async function handleUpgrade() {
  if (!isAuthenticated.value) {
    emit('signIn')
    return
  }

  const checkoutUrl = await createCheckout()

  if (checkoutUrl) {
    window.location.href = checkoutUrl
  } else if (error.value) {
    showError(error.value)
  }
}

function close() {
  if (!loading.value) {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="close"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold">Upgrade to Pro</h3>
          <button
            @click="close"
            :disabled="loading"
            class="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="px-6 py-6">
          <!-- Usage info -->
          <div class="text-center mb-6">
            <div class="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h4 class="text-xl font-semibold text-gray-900 mb-1">
              You've reached your limit
            </h4>
            <p class="text-gray-600">
              You've used your free publish
            </p>
          </div>

          <!-- Pricing -->
          <div class="text-center mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-500">
            <div class="flex items-baseline justify-center gap-1 mb-1">
              <span class="text-3xl font-bold text-gray-900">$9</span>
              <span class="text-sm text-gray-500">/month</span>
            </div>
            <span class="text-sm text-blue-600 font-medium">or $69/year (save 36%)</span>
          </div>

          <!-- Features -->
          <div class="mb-6">
            <h5 class="text-sm font-medium text-gray-700 mb-3">What's included:</h5>
            <ul class="space-y-2">
              <li
                v-for="feature in features"
                :key="feature"
                class="flex items-center gap-2 text-sm text-gray-600"
              >
                <svg class="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ feature }}
              </li>
            </ul>
          </div>

          <!-- Error message -->
          <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>

          <!-- CTA -->
          <button
            @click="handleUpgrade"
            :disabled="loading"
            class="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isAuthenticated ? 'Upgrade Now' : 'Sign in to Upgrade' }}
          </button>

          <!-- Fine print -->
          <p class="mt-4 text-xs text-gray-500 text-center">
            Secure payment via Stripe. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>
