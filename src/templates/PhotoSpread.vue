<script setup>
defineProps({
  content: Object
})
</script>

<template>
  <div :style="{
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Inter, system-ui, sans-serif',
    boxSizing: 'border-box'
  }">
    <!-- Main image area -->
    <div
      v-if="content.images?.length"
      :style="{
        flex: '1',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '24px'
      }"
    >
      <img
        :src="content.images[0].data"
        :alt="content.images[0].name"
        :style="{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }"
      />
    </div>
    <div
      v-else
      :style="{
        flex: '1',
        background: 'linear-gradient(to bottom, #f3f4f6, #e5e7eb)',
        borderRadius: '8px',
        marginBottom: '24px'
      }"
    ></div>

    <!-- Title area -->
    <div :style="{ marginBottom: '16px' }">
      <h1 :style="{
        fontSize: '28px',
        fontWeight: '300',
        color: '#111827',
        marginBottom: '8px',
        fontFamily: 'Georgia, serif',
        margin: '0 0 8px 0'
      }">
        {{ content.title || 'Untitled' }}
      </h1>
      <div :style="{
        height: '2px',
        width: '64px',
        backgroundColor: '#111827'
      }"></div>
    </div>

    <!-- Secondary images -->
    <div v-if="content.images?.length > 1" :style="{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px',
      marginBottom: '16px'
    }">
      <div
        v-for="img in content.images.slice(1, 4)"
        :key="img.id"
        :style="{
          aspectRatio: '1',
          backgroundColor: '#f3f4f6',
          borderRadius: '4px',
          overflow: 'hidden'
        }"
      >
        <img :src="img.data" :alt="img.name" :style="{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }" />
      </div>
    </div>

    <!-- Caption text -->
    <p
      v-if="content.text"
      :style="{
        fontSize: '14px',
        color: '#4b5563',
        lineHeight: '1.6',
        margin: '0',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: '4',
        WebkitBoxOrient: 'vertical'
      }"
    >
      {{ content.text }}
    </p>
  </div>
</template>
