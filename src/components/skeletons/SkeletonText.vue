<script setup>
defineProps({
  lines: {
    type: Number,
    default: 3
  },
  lastLineWidth: {
    type: String,
    default: '60%'
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  spacing: {
    type: String,
    default: 'normal', // tight, normal, loose
    validator: (v) => ['tight', 'normal', 'loose'].includes(v)
  }
})

const heightClasses = {
  sm: 'h-2.5',
  md: 'h-3',
  lg: 'h-4'
}

const spacingClasses = {
  tight: 'space-y-1.5',
  normal: 'space-y-2.5',
  loose: 'space-y-3.5'
}
</script>

<template>
  <div :class="['skeleton-text', spacingClasses[spacing]]">
    <div
      v-for="line in lines"
      :key="line"
      :class="['skeleton rounded', heightClasses[size]]"
      :style="{
        width: line === lines ? lastLineWidth : '100%'
      }"
    ></div>
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
