<script setup>
import TopNav from './components/TopNav.vue'
import ToastContainer from './components/ToastContainer.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <TopNav />
    <main class="flex-1">
      <router-view />
    </main>
    <footer class="py-6 text-center text-sm text-gray-400 border-t border-gray-200">
      Made with <span class="text-red-500">&hearts;</span> by <a href="https://dizid.com" target="_blank" class="text-gray-600 hover:text-gray-900">dizid.com</a>
    </footer>
    <ToastContainer />
  </div>
</template>
