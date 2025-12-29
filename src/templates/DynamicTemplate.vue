<script setup>
import { computed } from 'vue'

const props = defineProps({
  content: Object,
  styles: Object // Template style definition from AI/user
})

// Default styles if not provided
const defaultStyles = {
  container: {
    backgroundColor: '#ffffff',
    color: '#111827',
    padding: '48px',
    fontFamily: 'system-ui, sans-serif'
  },
  title: {
    fontSize: '42px',
    fontWeight: 'bold',
    lineHeight: '1.2',
    color: '#111827'
  },
  text: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#4b5563'
  },
  imageGrid: {
    gap: '12px',
    columns: 2,
    borderRadius: '8px'
  },
  divider: {
    color: 'rgba(0,0,0,0.1)',
    margin: '24px 0'
  },
  background: {
    type: 'none'
  }
}

// Merge provided styles with defaults
const mergedStyles = computed(() => ({
  container: { ...defaultStyles.container, ...(props.styles?.container || {}) },
  title: { ...defaultStyles.title, ...(props.styles?.title || {}) },
  text: { ...defaultStyles.text, ...(props.styles?.text || {}) },
  imageGrid: { ...defaultStyles.imageGrid, ...(props.styles?.imageGrid || {}) },
  divider: { ...defaultStyles.divider, ...(props.styles?.divider || {}) },
  background: { ...defaultStyles.background, ...(props.styles?.background || {}) }
}))

// Generate background CSS from background style object
const backgroundStyle = computed(() => {
  const bg = mergedStyles.value.background
  if (!bg || bg.type === 'none') return {}

  const styles = {}

  if (bg.type === 'gradient' && bg.gradient) {
    const { type, angle, stops } = bg.gradient
    if (stops && stops.length >= 2) {
      const stopsStr = stops.map(s => `${s.color} ${s.position}%`).join(', ')

      if (type === 'radial') {
        styles.backgroundImage = `radial-gradient(circle, ${stopsStr})`
      } else {
        styles.backgroundImage = `linear-gradient(${angle || 135}deg, ${stopsStr})`
      }
    }
  }

  return styles
})

// Overlay style for readability (if specified)
const overlayStyle = computed(() => {
  const overlay = mergedStyles.value.background?.overlay
  if (!overlay || !overlay.color) return null

  return {
    position: 'absolute',
    inset: '0',
    backgroundColor: overlay.color,
    pointerEvents: 'none',
    zIndex: 0
  }
})

const containerStyle = computed(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  position: 'relative',
  ...mergedStyles.value.container,
  ...backgroundStyle.value
}))

const titleStyle = computed(() => ({
  margin: '0 0 16px 0',
  ...mergedStyles.value.title
}))

const textStyle = computed(() => ({
  whiteSpace: 'pre-wrap',
  ...mergedStyles.value.text
}))

const imageGridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${mergedStyles.value.imageGrid.columns || 2}, 1fr)`,
  gap: mergedStyles.value.imageGrid.gap || '12px',
  marginBottom: '24px'
}))

const imageContainerStyle = computed(() => ({
  aspectRatio: '1',
  borderRadius: mergedStyles.value.imageGrid.borderRadius || '8px',
  overflow: 'hidden',
  backgroundColor: mergedStyles.value.container.backgroundColor === '#ffffff' ? '#f3f4f6' : 'rgba(255,255,255,0.1)'
}))

const dividerStyle = computed(() => ({
  border: 'none',
  borderTop: `1px solid ${mergedStyles.value.divider.color}`,
  margin: mergedStyles.value.divider.margin
}))
</script>

<template>
  <div :style="containerStyle">
    <!-- Background overlay for readability -->
    <div v-if="overlayStyle" :style="overlayStyle"></div>

    <!-- Header area -->
    <header style="flex: 1; display: flex; flex-direction: column; justify-content: flex-end; padding-bottom: 24px; position: relative; z-index: 1;">
      <h1 :style="titleStyle">
        {{ content.title || 'Untitled' }}
      </h1>
    </header>

    <!-- Divider -->
    <hr :style="{ ...dividerStyle, position: 'relative', zIndex: 1 }" />

    <!-- Content area -->
    <div style="flex: 2; position: relative; z-index: 1;">
      <!-- Images grid -->
      <div v-if="content.images?.length" :style="imageGridStyle">
        <div
          v-for="img in content.images.slice(0, 4)"
          :key="img.id"
          :style="imageContainerStyle"
        >
          <img
            :src="img.data"
            :alt="img.name"
            style="width: 100%; height: 100%; object-fit: cover;"
          />
        </div>
      </div>

      <!-- Text content -->
      <div v-if="content.text" :style="textStyle">
        {{ content.text }}
      </div>
    </div>
  </div>
</template>
