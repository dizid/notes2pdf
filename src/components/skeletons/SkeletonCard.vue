<script setup>
defineProps({
  aspectRatio: {
    type: String,
    default: '3/4' // 3/4 for template cards, 16/9 for preview, 1/1 for square
  },
  showText: {
    type: Boolean,
    default: true
  },
  showBadge: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="skeleton-card p-3 border border-gray-200 rounded-xl bg-white">
    <!-- Image placeholder -->
    <div
      class="skeleton rounded-lg mb-3"
      :style="{ aspectRatio: aspectRatio }"
    ></div>

    <!-- Text content -->
    <div v-if="showText" class="space-y-2">
      <div class="flex items-center justify-between gap-2">
        <div class="skeleton h-4 w-2/3 rounded"></div>
        <div v-if="showBadge" class="skeleton h-4 w-12 rounded-full"></div>
      </div>
      <div class="skeleton h-3 w-full rounded"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e8e8e8 50%,
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
