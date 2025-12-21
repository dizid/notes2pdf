<script setup>
defineProps({
  content: Object
})
</script>

<template>
  <div class="w-full h-full bg-gray-900 text-white p-12 flex flex-col">
    <!-- Header area -->
    <header class="flex-1 flex flex-col justify-end pb-8">
      <h1 class="text-5xl font-bold leading-tight tracking-tight">
        {{ content.title || 'Untitled' }}
      </h1>
    </header>

    <!-- Content area -->
    <div class="border-t border-white/20 pt-8">
      <!-- Images grid -->
      <div v-if="content.images?.length" class="mb-6 grid grid-cols-2 gap-3">
        <div
          v-for="img in content.images.slice(0, 4)"
          :key="img.id"
          class="aspect-square bg-gray-800 rounded overflow-hidden"
        >
          <img :src="img.data" :alt="img.name" class="w-full h-full object-cover" />
        </div>
      </div>

      <!-- Text content -->
      <div
        v-if="content.text"
        class="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap"
      >
        {{ content.text }}
      </div>
    </div>

    <!-- Footer -->
    <footer class="mt-auto pt-8 text-xs text-gray-500">
      Roger Eaton Studio
    </footer>
  </div>
</template>
