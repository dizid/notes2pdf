<script setup>
defineProps({
  content: Object
})
</script>

<template>
  <div class="w-full h-full bg-white p-12 flex flex-col">
    <!-- Header -->
    <header class="mb-8 pb-6 border-b border-gray-200">
      <p class="text-xs text-gray-400 uppercase tracking-widest mb-2">Work in Progress</p>
      <h1 class="text-4xl text-gray-900">
        {{ content.title || 'Untitled' }}
      </h1>
    </header>

    <!-- Content grid -->
    <div class="flex-1 grid grid-cols-2 gap-6">
      <!-- Left: Text -->
      <div>
        <h2 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Notes</h2>
        <div
          v-if="content.text"
          class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap"
        >
          {{ content.text }}
        </div>
        <p v-else class="text-sm text-gray-300 italic">No notes added</p>
      </div>

      <!-- Right: Images -->
      <div>
        <h2 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Visual Reference</h2>
        <div v-if="content.images?.length" class="grid grid-cols-2 gap-2">
          <div
            v-for="img in content.images.slice(0, 4)"
            :key="img.id"
            class="aspect-square bg-gray-100 rounded overflow-hidden"
          >
            <img :src="img.data" :alt="img.name" class="w-full h-full object-cover" />
          </div>
        </div>
        <div v-else class="aspect-square bg-gray-50 rounded border-2 border-dashed border-gray-200 flex items-center justify-center">
          <p class="text-sm text-gray-300">No images</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="mt-auto pt-6 border-t border-gray-200 flex items-center justify-between">
      <span class="text-xs text-gray-400">Roger Eaton Studio</span>
      <span class="text-xs text-gray-400">{{ new Date().toLocaleDateString() }}</span>
    </footer>
  </div>
</template>
