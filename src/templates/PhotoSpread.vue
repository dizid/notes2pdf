<script setup>
defineProps({
  content: Object
})
</script>

<template>
  <div class="w-full h-full bg-white p-8 flex flex-col">
    <!-- Main image area -->
    <div
      v-if="content.images?.length"
      class="flex-1 bg-gray-100 rounded-lg overflow-hidden mb-6"
    >
      <img
        :src="content.images[0].data"
        :alt="content.images[0].name"
        class="w-full h-full object-cover"
      />
    </div>
    <div
      v-else
      class="flex-1 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg mb-6"
    ></div>

    <!-- Title overlay area -->
    <div class="mb-4">
      <h1 class="text-3xl font-light text-gray-900 mb-2">
        {{ content.title || 'Untitled' }}
      </h1>
      <div class="h-0.5 w-16 bg-gray-900"></div>
    </div>

    <!-- Secondary images -->
    <div v-if="content.images?.length > 1" class="grid grid-cols-3 gap-2 mb-4">
      <div
        v-for="img in content.images.slice(1, 4)"
        :key="img.id"
        class="aspect-square bg-gray-100 rounded overflow-hidden"
      >
        <img :src="img.data" :alt="img.name" class="w-full h-full object-cover" />
      </div>
    </div>

    <!-- Caption text -->
    <p
      v-if="content.text"
      class="text-sm text-gray-600 leading-relaxed line-clamp-4"
    >
      {{ content.text }}
    </p>

    <!-- Footer -->
    <footer class="mt-auto pt-4 text-xs text-gray-400 text-right">
      Roger Eaton Studio
    </footer>
  </div>
</template>
