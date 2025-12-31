<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="bg-white border-b border-gray-200">
    <div class="max-w-6xl mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <RouterLink to="/app" class="text-xl font-semibold tracking-tight text-gray-900">
          dizid
        </RouterLink>
        <div class="flex gap-8">
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
          <RouterLink
            to="/app/about"
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
