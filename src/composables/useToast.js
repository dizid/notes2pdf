import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

export function useToast() {
  function addToast(message, type = 'info', duration = 3000) {
    const id = ++toastId
    toasts.value.push({ id, message, type })

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  function removeToast(id) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  function showSuccess(message, duration = 3000) {
    return addToast(message, 'success', duration)
  }

  function showError(message, duration = 4000) {
    return addToast(message, 'error', duration)
  }

  function showInfo(message, duration = 3000) {
    return addToast(message, 'info', duration)
  }

  return {
    toasts,
    showSuccess,
    showError,
    showInfo,
    removeToast
  }
}
