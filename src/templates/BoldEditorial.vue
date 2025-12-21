<script setup>
defineProps({
  content: Object
})
</script>

<template>
  <div :style="{
    width: '100%',
    height: '100%',
    backgroundColor: '#111827',
    color: '#ffffff',
    padding: '48px',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Georgia, serif',
    boxSizing: 'border-box'
  }">
    <!-- Header area -->
    <header :style="{
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      paddingBottom: '32px'
    }">
      <h1 :style="{
        fontSize: '48px',
        fontWeight: 'bold',
        lineHeight: '1.1',
        letterSpacing: '-0.02em',
        margin: '0'
      }">
        {{ content.title || 'Untitled' }}
      </h1>
    </header>

    <!-- Content area -->
    <div :style="{
      borderTop: '1px solid rgba(255,255,255,0.2)',
      paddingTop: '32px'
    }">
      <!-- Images grid -->
      <div v-if="content.images?.length" :style="{
        marginBottom: '24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px'
      }">
        <div
          v-for="img in content.images.slice(0, 4)"
          :key="img.id"
          :style="{
            aspectRatio: '1',
            backgroundColor: '#1f2937',
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

      <!-- Text content -->
      <div
        v-if="content.text"
        :style="{
          color: '#d1d5db',
          fontSize: '14px',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap'
        }"
      >
        {{ content.text }}
      </div>
    </div>

    <!-- Footer -->
    <footer :style="{
      marginTop: 'auto',
      paddingTop: '32px',
      fontSize: '12px',
      color: '#6b7280'
    }">
      Roger Eaton Studio
    </footer>
  </div>
</template>
