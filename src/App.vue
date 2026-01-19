<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TopNav from './components/TopNav.vue'
import ToastContainer from './components/ToastContainer.vue'

const route = useRoute()

// Show app chrome (nav, footer) only on /app routes
const isAppRoute = computed(() => route.path.startsWith('/app'))
</script>

<template>
  <div class="min-h-screen flex flex-col text-gray-900" :class="isAppRoute ? 'bg-gray-50' : 'bg-white'">
    <TopNav v-if="isAppRoute" />
    <main class="flex-1 text-gray-900">
      <router-view />
    </main>
    <footer v-if="isAppRoute" class="py-6 text-center text-sm text-gray-400 border-t border-gray-200">
      <div>Made with <span class="text-red-500">&hearts;</span> by <a href="https://dizid.com" target="_blank" class="text-gray-600 hover:text-gray-900">dizid.com</a></div>
      <div class="mt-2 space-x-4">
        <router-link to="/privacy" class="hover:text-gray-600">Privacy</router-link>
        <router-link to="/terms" class="hover:text-gray-600">Terms</router-link>
      </div>
    </footer>
    <ToastContainer />
  </div>
</template>
