<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import AuthModal from './AuthModal.vue'

const { user, isAuthenticated, displayName, avatarUrl, signOut, loading } = useAuth()

const showAuthModal = ref(false)
const showUserMenu = ref(false)

async function handleSignOut() {
  await signOut()
  showUserMenu.value = false
}
</script>

<template>
  <nav class="bg-white border-b border-gray-200">
    <div class="max-w-6xl mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <RouterLink to="/app" class="text-xl font-semibold tracking-tight text-gray-900">
          sizzle
        </RouterLink>
        <!-- Navigation Links -->
        <div class="flex items-center gap-8">
          <RouterLink
            to="/app"
            class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            active-class="text-gray-900 font-medium"
            exact
          >
            Create
          </RouterLink>
          <RouterLink
            to="/app/studio"
            class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            active-class="text-gray-900 font-medium"
          >
            Template Builder
          </RouterLink>
          <RouterLink
            to="/app/history"
            class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            active-class="text-gray-900 font-medium"
          >
            History
          </RouterLink>

          <!-- Auth Section -->
          <div class="border-l border-gray-200 pl-6 ml-2">
            <!-- Signed Out: Show Sign In button -->
            <button
              v-if="!isAuthenticated"
              @click="showAuthModal = true"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Sign in
            </button>

            <!-- Signed In: Show User Menu -->
            <div v-else class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <!-- Avatar -->
                <div class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                  <img
                    v-if="avatarUrl"
                    :src="avatarUrl"
                    :alt="displayName"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-sm font-medium text-gray-600">
                    {{ displayName?.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <!-- Dropdown icon -->
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                @click.stop
              >
                <div class="px-4 py-2 border-b border-gray-100">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ displayName }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ user?.email }}</p>
                </div>
                <RouterLink
                  to="/app/about"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  @click="showUserMenu = false"
                >
                  About
                </RouterLink>
                <button
                  @click="handleSignOut"
                  :disabled="loading"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Sign out
                </button>
              </div>

              <!-- Click outside to close -->
              <div
                v-if="showUserMenu"
                class="fixed inset-0 z-40"
                @click="showUserMenu = false"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Auth Modal -->
  <AuthModal
    :show="showAuthModal"
    @close="showAuthModal = false"
    @authenticated="showAuthModal = false"
  />
</template>
