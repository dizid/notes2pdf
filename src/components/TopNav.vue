<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="bg-white border-b border-gray-200">
    <div class="max-w-6xl mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <RouterLink to="/" class="text-xl font-medium tracking-tight text-gray-900">
          Notes to Deck
        </RouterLink>
        <div class="flex gap-8">
          <RouterLink
            to="/"
            class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            active-class="text-gray-900 font-medium"
          >
            Create
          </RouterLink>
          <RouterLink
            to="/studio"
            class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            active-class="text-gray-900 font-medium"
          >
            Design Studio
          </RouterLink>
          <RouterLink
            to="/history"
            class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            active-class="text-gray-900 font-medium"
          >
            History
          </RouterLink>
          <RouterLink
            to="/about"
            class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            active-class="text-gray-900 font-medium"
          >
            About
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>
