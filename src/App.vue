<script setup>
import TopNav from './components/TopNav.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <TopNav />
    <main>
      <router-view />
    </main>
  </div>
</template>
