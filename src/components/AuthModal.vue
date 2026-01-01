<script setup>
import { ref, computed, watch } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'

const props = defineProps({
  show: Boolean,
  initialMode: {
    type: String,
    default: 'signin' // 'signin' | 'signup' | 'reset'
  }
})

const emit = defineEmits(['close', 'authenticated'])

const { signIn, signUp, signInWithGoogle, resetPassword, loading, error, isConfigured } = useAuth()
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
    case 'signin': return 'Welcome back'
    case 'signup': return 'Create account'
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

async function handleGoogleSignIn() {
  const { error: googleError } = await signInWithGoogle()
  if (googleError) {
    localError.value = googleError
    showError(googleError)
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
          <!-- Google OAuth -->
          <button
            v-if="mode !== 'reset'"
            type="button"
            @click="handleGoogleSignIn"
            :disabled="loading || !isConfigured"
            class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span class="font-medium text-gray-700">
              {{ mode === 'signin' ? 'Continue with Google' : 'Sign up with Google' }}
            </span>
          </button>

          <!-- Divider -->
          <div v-if="mode !== 'reset'" class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

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
