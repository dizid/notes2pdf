<script setup>
import { useToast } from '../composables/useToast'

const { toasts, removeToast } = useToast()

function getToastClasses(type) {
  const base = 'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium'
  switch (type) {
    case 'success':
      return `${base} bg-green-600 text-white`
    case 'error':
      return `${base} bg-red-600 text-white`
    default:
      return `${base} bg-gray-800 text-white`
  }
}

function getIcon(type) {
  switch (type) {
    case 'success':
      return 'M5 13l4 4L19 7'
    case 'error':
      return 'M6 18L18 6M6 6l12 12'
    default:
      return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
}
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="getToastClasses(toast.type)"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getIcon(toast.type)" />
        </svg>
        <span>{{ toast.message }}</span>
        <button
          @click="removeToast(toast.id)"
          class="ml-2 opacity-70 hover:opacity-100 transition-opacity"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}
.toast-leave-active {
  transition: all 0.2s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
