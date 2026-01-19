<script setup>
defineProps({
  showHeader: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <div class="skeleton-preview bg-white border border-gray-200 rounded-xl overflow-hidden">
    <!-- Header -->
    <div v-if="showHeader" class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <div class="skeleton h-5 w-24 rounded"></div>
      <div class="skeleton h-4 w-16 rounded"></div>
    </div>

    <!-- Preview content -->
    <div class="p-6 bg-gray-100">
      <div
        class="bg-white shadow-lg mx-auto overflow-hidden rounded-lg"
        style="max-width: 350px; aspect-ratio: 1/1.414;"
      >
        <!-- Page content skeleton -->
        <div class="p-6 space-y-4">
          <!-- Title -->
          <div class="skeleton h-8 w-3/4 rounded"></div>

          <!-- Subtitle -->
          <div class="skeleton h-4 w-1/2 rounded"></div>

          <!-- Divider -->
          <div class="my-6">
            <div class="skeleton h-px w-full"></div>
          </div>

          <!-- Content paragraphs -->
          <div class="space-y-2">
            <div class="skeleton h-3 w-full rounded"></div>
            <div class="skeleton h-3 w-full rounded"></div>
            <div class="skeleton h-3 w-4/5 rounded"></div>
          </div>

          <!-- Image placeholders -->
          <div class="grid grid-cols-2 gap-2 mt-6">
            <div class="skeleton aspect-square rounded"></div>
            <div class="skeleton aspect-square rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
