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
    padding: '48px',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Inter, system-ui, sans-serif',
    boxSizing: 'border-box'
  }">
    <!-- Header -->
    <header :style="{
      marginBottom: '32px',
      paddingBottom: '24px',
      borderBottom: '1px solid #e5e7eb'
    }">
      <p :style="{
        fontSize: '11px',
        color: '#9ca3af',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: '8px',
        margin: '0 0 8px 0'
      }">Work in Progress</p>
      <h1 :style="{
        fontSize: '36px',
        color: '#111827',
        fontFamily: 'Georgia, serif',
        fontWeight: '400',
        margin: '0'
      }">
        {{ content.title || 'Untitled' }}
      </h1>
    </header>

    <!-- Content grid -->
    <div :style="{
      flex: '1',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '24px'
    }">
      <!-- Left: Text -->
      <div>
        <h2 :style="{
          fontSize: '12px',
          fontWeight: '500',
          color: '#6b7280',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '12px',
          margin: '0 0 12px 0'
        }">Notes</h2>
        <div
          v-if="content.text"
          :style="{
            fontSize: '14px',
            color: '#374151',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap'
          }"
        >
          {{ content.text }}
        </div>
        <p v-else :style="{
          fontSize: '14px',
          color: '#d1d5db',
          fontStyle: 'italic',
          margin: '0'
        }">No notes added</p>
      </div>

      <!-- Right: Images -->
      <div>
        <h2 :style="{
          fontSize: '12px',
          fontWeight: '500',
          color: '#6b7280',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '12px',
          margin: '0 0 12px 0'
        }">Visual Reference</h2>
        <div v-if="content.images?.length" :style="{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px'
        }">
          <div
            v-for="img in content.images.slice(0, 4)"
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
        <div v-else :style="{
          aspectRatio: '1',
          backgroundColor: '#f9fafb',
          borderRadius: '4px',
          border: '2px dashed #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }">
          <p :style="{
            fontSize: '14px',
            color: '#d1d5db',
            margin: '0'
          }">No images</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer :style="{
      marginTop: 'auto',
      paddingTop: '24px',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }">
      <span :style="{ fontSize: '12px', color: '#9ca3af' }">Roger Eaton Studio</span>
      <span :style="{ fontSize: '12px', color: '#9ca3af' }">{{ new Date().toLocaleDateString() }}</span>
    </footer>
  </div>
</template>
