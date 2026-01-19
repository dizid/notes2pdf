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
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="close"
      >
        <!-- Backdrop with blur -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        <!-- Modal -->
        <div class="modal-content relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <!-- Decorative gradient header -->
          <div class="h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400"></div>

          <!-- Close button -->
          <button
            @click="close"
            :disabled="loading"
            class="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all duration-200 disabled:opacity-50"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Content -->
          <div class="px-8 py-8">
            <!-- Icon + Title -->
            <div class="text-center mb-6">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-200/50 animate-float">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h4 class="text-2xl font-bold text-gray-900 mb-2">
                Unlock Pro Features
              </h4>
              <p class="text-gray-500">
                You've used your free publish. Upgrade for unlimited access.
              </p>
            </div>

            <!-- Pricing Card -->
            <div class="relative mb-6 p-5 rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
              <!-- Popular badge -->
              <div class="absolute -top-px -right-px px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-bl-lg rounded-tr-xl">
                Most Popular
              </div>

              <div class="flex items-baseline gap-1 mb-2">
                <span class="text-4xl font-bold text-gray-900">$9</span>
                <span class="text-gray-500">/month</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm text-amber-700 font-medium">or $69/year</span>
                <span class="px-2 py-0.5 text-[10px] font-semibold bg-green-100 text-green-700 rounded-full">Save 36%</span>
              </div>
            </div>

            <!-- Features -->
            <div class="mb-6">
              <ul class="space-y-3">
                <li
                  v-for="(feature, index) in features"
                  :key="feature"
                  class="flex items-center gap-3 text-sm text-gray-700"
                  :style="{ animationDelay: `${index * 50}ms` }"
                >
                  <div class="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  {{ feature }}
                </li>
              </ul>
            </div>

            <!-- Error message -->
            <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p class="text-sm text-red-700 flex items-center gap-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                {{ error }}
              </p>
            </div>

            <!-- CTA Button -->
            <button
              @click="handleUpgrade"
              :disabled="loading"
              class="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-200/50 hover:shadow-xl hover:shadow-amber-200/60 hover:-translate-y-0.5"
            >
              <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isAuthenticated ? 'Upgrade to Pro' : 'Sign in to Upgrade' }}
            </button>

            <!-- Fine print -->
            <p class="mt-4 text-xs text-gray-400 text-center flex items-center justify-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
              Secure payment via Stripe. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95) translateY(20px);
  opacity: 0;
}

/* Float animation for icon */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>
