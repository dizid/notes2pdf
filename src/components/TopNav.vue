<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { usePaywall } from '../composables/usePaywall'
import AuthModal from './AuthModal.vue'

const { user, isAuthenticated, displayName, avatarUrl, signOut, loading } = useAuth()
const { isPro } = usePaywall()

const showAuthModal = ref(false)
const showUserMenu = ref(false)

async function handleSignOut() {
  await signOut()
  showUserMenu.value = false
}
</script>

<template>
  <nav class="bg-white/95 backdrop-blur-sm border-b border-gray-200/80 sticky top-0 z-40">
    <div class="max-w-6xl mx-auto px-6 py-3.5">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <RouterLink to="/app" class="group flex items-center gap-2">
          <span class="text-xl font-bold tracking-tight text-gray-900 group-hover:text-gray-700 transition-colors">
            sizzle
          </span>
          <span v-if="isPro" class="px-2 py-0.5 text-[10px] font-semibold bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-full uppercase tracking-wider">
            Pro
          </span>
        </RouterLink>

        <!-- Navigation Links -->
        <div class="flex items-center gap-1">
          <RouterLink
            to="/app"
            class="nav-link relative px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50"
            active-class="text-gray-900 font-medium active"
            exact
          >
            Create
          </RouterLink>
          <RouterLink
            to="/app/studio"
            class="nav-link relative px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50"
            active-class="text-gray-900 font-medium active"
          >
            Template Builder
          </RouterLink>
          <RouterLink
            to="/app/history"
            class="nav-link relative px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50"
            active-class="text-gray-900 font-medium active"
          >
            History
          </RouterLink>
          <RouterLink
            to="/pricing"
            class="nav-link relative px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50"
            active-class="text-gray-900 font-medium active"
          >
            Pricing
          </RouterLink>

          <!-- Upgrade button (only for non-pro users) -->
          <RouterLink
            v-if="!isPro"
            to="/pricing"
            class="upgrade-btn ml-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-md shadow-amber-200/50 hover:shadow-lg hover:shadow-amber-200/60 hover:-translate-y-0.5"
          >
            <span class="flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clip-rule="evenodd" />
              </svg>
              Upgrade
            </span>
          </RouterLink>

          <!-- Auth Section -->
          <div class="border-l border-gray-200 pl-4 ml-4">
            <!-- Signed Out: Show Sign In button -->
            <button
              v-if="!isAuthenticated"
              @click="showAuthModal = true"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              Sign in
            </button>

            <!-- Signed In: Show User Menu -->
            <div v-else class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <!-- Avatar -->
                <div class="relative">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex items-center justify-center ring-2 ring-white shadow-sm">
                    <img
                      v-if="avatarUrl"
                      :src="avatarUrl"
                      :alt="displayName"
                      class="w-full h-full object-cover"
                    />
                    <span v-else class="text-sm font-semibold text-gray-600">
                      {{ displayName?.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <!-- Pro indicator dot -->
                  <div v-if="isPro" class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full border-2 border-white"></div>
                </div>
                <!-- Dropdown icon -->
                <svg
                  class="w-4 h-4 text-gray-400 transition-transform duration-200"
                  :class="{ 'rotate-180': showUserMenu }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <Transition name="dropdown">
                <div
                  v-if="showUserMenu"
                  class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200/80 py-2 z-50 overflow-hidden"
                  @click.stop
                >
                  <div class="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex items-center justify-center">
                        <img
                          v-if="avatarUrl"
                          :src="avatarUrl"
                          :alt="displayName"
                          class="w-full h-full object-cover"
                        />
                        <span v-else class="text-sm font-semibold text-gray-600">
                          {{ displayName?.charAt(0).toUpperCase() }}
                        </span>
                      </div>
                      <div class="min-w-0">
                        <p class="text-sm font-semibold text-gray-900 truncate">{{ displayName }}</p>
                        <p class="text-xs text-gray-500 truncate">{{ user?.email }}</p>
                      </div>
                    </div>
                    <div v-if="isPro" class="mt-2 flex items-center gap-1.5 text-xs text-amber-700">
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clip-rule="evenodd" />
                      </svg>
                      Pro Member
                    </div>
                  </div>
                  <div class="py-1">
                    <RouterLink
                      to="/app/about"
                      class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      @click="showUserMenu = false"
                    >
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      About
                    </RouterLink>
                    <button
                      @click="handleSignOut"
                      :disabled="loading"
                      class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              </Transition>

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

  <style scoped>
  /* Active nav link underline */
  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 2px;
    background: linear-gradient(90deg, #f59e0b, #f97316);
    border-radius: 1px;
    animation: slideIn 0.2s ease-out;
  }

  @keyframes slideIn {
    from {
      width: 0;
      opacity: 0;
    }
    to {
      width: 20px;
      opacity: 1;
    }
  }

  /* Dropdown animation */
  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .dropdown-enter-from,
  .dropdown-leave-to {
    opacity: 0;
    transform: translateY(-8px) scale(0.95);
  }

  /* Upgrade button pulse animation */
  .upgrade-btn {
    position: relative;
  }

  .upgrade-btn::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(90deg, #f59e0b, #f97316);
    border-radius: 10px;
    opacity: 0;
    z-index: -1;
    animation: pulse-glow 2s ease-in-out infinite;
  }

  @keyframes pulse-glow {
    0%, 100% {
      opacity: 0;
      transform: scale(1);
    }
    50% {
      opacity: 0.3;
      transform: scale(1.05);
    }
  }
  </style>

  <!-- Auth Modal -->
  <AuthModal
    :show="showAuthModal"
    @close="showAuthModal = false"
    @authenticated="showAuthModal = false"
  />
</template>
