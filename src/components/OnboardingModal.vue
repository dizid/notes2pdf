<script setup>
import { ref, computed } from 'vue'
import { useOnboarding } from '../composables/useOnboarding'

const {
  showOnboarding,
  currentStep,
  nextStep,
  prevStep,
  completeOnboarding,
  dismissOnboarding
} = useOnboarding()

const websiteUrl = ref('')

const steps = [
  {
    title: "Welcome to sizzle",
    description: "Create stunning, shareable pages from your content in seconds.",
    icon: "sparkles"
  },
  {
    title: "Extract your brand",
    description: "Paste your website URL and we'll automatically extract your colors, fonts, and style.",
    icon: "globe",
    hasInput: true
  },
  {
    title: "Create & Share",
    description: "Add your content, pick a template, and share instantly with a single click.",
    icon: "share"
  }
]

const currentStepData = computed(() => steps[currentStep.value] || steps[0])
const isLastStep = computed(() => currentStep.value >= steps.length - 1)
const isFirstStep = computed(() => currentStep.value === 0)

function handleNext() {
  if (isLastStep.value) {
    completeOnboarding()
  } else {
    nextStep()
  }
}

function handleSkip() {
  dismissOnboarding()
}

// Emit website URL for brand extraction if provided
const emit = defineEmits(['brandUrl'])

function handleComplete() {
  if (websiteUrl.value) {
    emit('brandUrl', websiteUrl.value)
  }
  completeOnboarding()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showOnboarding" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="handleSkip"></div>

        <!-- Modal -->
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          <!-- Progress bar -->
          <div class="h-1 bg-gray-100">
            <div
              class="h-full bg-gray-900 transition-all duration-300"
              :style="{ width: `${((currentStep + 1) / steps.length) * 100}%` }"
            ></div>
          </div>

          <!-- Content -->
          <div class="p-8">
            <!-- Icon -->
            <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <!-- Sparkles -->
              <svg v-if="currentStepData.icon === 'sparkles'" class="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <!-- Globe -->
              <svg v-if="currentStepData.icon === 'globe'" class="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <!-- Share -->
              <svg v-if="currentStepData.icon === 'share'" class="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>

            <!-- Text -->
            <h2 class="text-2xl font-semibold text-gray-900 text-center mb-2">
              {{ currentStepData.title }}
            </h2>
            <p class="text-gray-600 text-center mb-6">
              {{ currentStepData.description }}
            </p>

            <!-- URL Input (step 2) -->
            <div v-if="currentStepData.hasInput" class="mb-6">
              <input
                v-model="websiteUrl"
                type="url"
                placeholder="https://yourwebsite.com"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <p class="text-xs text-gray-400 mt-2 text-center">Optional - you can skip this</p>
            </div>

            <!-- Step indicators -->
            <div class="flex justify-center gap-2 mb-6">
              <div
                v-for="(step, index) in steps"
                :key="index"
                class="w-2 h-2 rounded-full transition-colors"
                :class="index === currentStep ? 'bg-gray-900' : 'bg-gray-200'"
              ></div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
              <button
                v-if="!isFirstStep"
                @click="prevStep"
                class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Back
              </button>
              <button
                v-else
                @click="handleSkip"
                class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 font-medium hover:bg-gray-50 transition"
              >
                Skip
              </button>
              <button
                @click="isLastStep ? handleComplete() : handleNext()"
                class="flex-1 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
              >
                {{ isLastStep ? "Let's go!" : 'Next' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
