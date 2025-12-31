import { ref, readonly } from 'vue'

const STORAGE_KEY = 'dizid_onboarded'

// Shared state
const isOnboarded = ref(false)
const showOnboarding = ref(false)
const currentStep = ref(0)

// Initialize from localStorage
function init() {
  const stored = localStorage.getItem(STORAGE_KEY)
  isOnboarded.value = stored === 'true'
}

// Check if should show onboarding
function shouldShowOnboarding() {
  init()
  return !isOnboarded.value
}

// Start onboarding
function startOnboarding() {
  currentStep.value = 0
  showOnboarding.value = true
}

// Next step
function nextStep() {
  currentStep.value++
}

// Previous step
function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// Complete onboarding
function completeOnboarding() {
  isOnboarded.value = true
  showOnboarding.value = false
  localStorage.setItem(STORAGE_KEY, 'true')
}

// Skip/dismiss onboarding
function dismissOnboarding() {
  showOnboarding.value = false
  // Still mark as completed so it doesn't show again
  localStorage.setItem(STORAGE_KEY, 'true')
  isOnboarded.value = true
}

// Reset onboarding (for "Show me around" feature)
function resetOnboarding() {
  localStorage.removeItem(STORAGE_KEY)
  isOnboarded.value = false
  currentStep.value = 0
}

export function useOnboarding() {
  return {
    // State (readonly to prevent external mutation)
    isOnboarded: readonly(isOnboarded),
    showOnboarding: readonly(showOnboarding),
    currentStep: readonly(currentStep),

    // Actions
    shouldShowOnboarding,
    startOnboarding,
    nextStep,
    prevStep,
    completeOnboarding,
    dismissOnboarding,
    resetOnboarding
  }
}
