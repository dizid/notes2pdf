<script setup>
import { ref, computed, watch } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'

const props = defineProps({
  show: Boolean,
  initialMode: {
    type: String,
    default: 'signup' // 'signin' | 'signup' | 'reset' - default to signup for new users
  }
})

const emit = defineEmits(['close', 'authenticated'])

const { signIn, signUp, resetPassword, loading, error, isConfigured } = useAuth()
const { showSuccess, showError } = useToast()

const mode = ref(props.initialMode)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const localError = ref(null)

// Reset form when modal opens/closes
watch(() => props.show, (isOpen) => {
  if (isOpen) {
    mode.value = props.initialMode
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    localError.value = null
  }
})

const title = computed(() => {
  switch (mode.value) {
    case 'signin': return 'Sign in'
    case 'signup': return 'Create your account'
    case 'reset': return 'Reset password'
    default: return 'Sign in'
  }
})

const submitLabel = computed(() => {
  if (loading.value) return 'Please wait...'
  switch (mode.value) {
    case 'signin': return 'Sign in'
    case 'signup': return 'Create account'
    case 'reset': return 'Send reset link'
    default: return 'Continue'
  }
})

function validateForm() {
  localError.value = null

  if (!email.value.trim()) {
    localError.value = 'Email is required'
    return false
  }

  if (!email.value.includes('@')) {
    localError.value = 'Please enter a valid email'
    return false
  }

  if (mode.value !== 'reset') {
    if (!password.value) {
      localError.value = 'Password is required'
      return false
    }

    if (password.value.length < 6) {
      localError.value = 'Password must be at least 6 characters'
      return false
    }
  }

  if (mode.value === 'signup' && password.value !== confirmPassword.value) {
    localError.value = 'Passwords do not match'
    return false
  }

  return true
}

async function handleSubmit() {
  if (!validateForm()) return

  let result

  switch (mode.value) {
    case 'signin':
      result = await signIn(email.value, password.value)
      if (!result.error) {
        showSuccess('Welcome back!')
        emit('authenticated')
        emit('close')
      }
      break

    case 'signup':
      result = await signUp(email.value, password.value)
      if (!result.error) {
        showSuccess('Account created! Please check your email to confirm.')
        emit('close')
      }
      break

    case 'reset':
      result = await resetPassword(email.value)
      if (!result.error) {
        showSuccess('Password reset link sent! Check your email.')
        mode.value = 'signin'
      }
      break
  }

  if (result?.error) {
    localError.value = result.error
    showError(result.error)
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
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold">{{ title }}</h3>
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

        <!-- Not configured warning -->
        <div v-if="!isConfigured" class="px-6 py-4 bg-amber-50 border-b border-amber-200">
          <p class="text-sm text-amber-800">
            Authentication is not configured. Add Supabase credentials to enable sign in.
          </p>
        </div>

        <!-- Content -->
        <form @submit.prevent="handleSubmit" class="px-6 py-6 space-y-4">
          <!-- Email input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              v-model="email"
              type="email"
              required
              :disabled="loading || !isConfigured"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-50"
              placeholder="you@example.com"
            />
          </div>

          <!-- Password input -->
          <div v-if="mode !== 'reset'">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              v-model="password"
              type="password"
              required
              :disabled="loading || !isConfigured"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-50"
              placeholder="At least 6 characters"
            />
          </div>

          <!-- Confirm password (signup only) -->
          <div v-if="mode === 'signup'">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              v-model="confirmPassword"
              type="password"
              required
              :disabled="loading || !isConfigured"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-50"
              placeholder="Enter password again"
            />
          </div>

          <!-- Error message -->
          <div v-if="localError || error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-700">{{ localError || error }}</p>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="loading || !isConfigured"
            class="w-full py-3 px-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ submitLabel }}
          </button>

          <!-- Forgot password link (signin only) -->
          <button
            v-if="mode === 'signin'"
            type="button"
            @click="mode = 'reset'"
            class="w-full text-sm text-gray-500 hover:text-gray-700"
          >
            Forgot your password?
          </button>
        </form>

        <!-- Footer - mode toggle -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center text-sm">
          <template v-if="mode === 'signin'">
            Don't have an account?
            <button @click="mode = 'signup'" class="text-blue-600 hover:underline font-medium">
              Sign up
            </button>
          </template>
          <template v-else-if="mode === 'signup'">
            Already have an account?
            <button @click="mode = 'signin'" class="text-blue-600 hover:underline font-medium">
              Sign in
            </button>
          </template>
          <template v-else>
            <button @click="mode = 'signin'" class="text-blue-600 hover:underline font-medium">
              Back to sign in
            </button>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>
