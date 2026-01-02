<script setup>
import { computed } from 'vue'

const props = defineProps({
  content: Object,
  styles: Object // Template style definition - supports both legacy and token formats
})

// Check if styles use the new token format (has colors/typography objects)
const isTokenFormat = computed(() => {
  return props.styles?.colors && props.styles?.typography
})

// Convert token format to legacy format for rendering
const convertedStyles = computed(() => {
  if (!isTokenFormat.value) return null

  const s = props.styles
  const colors = s.colors || {}
  const typo = s.typography || {}
  const spacing = s.spacing || {}
  const effects = s.effects || {}
  const gradient = s.gradient || {}

  return {
    container: {
      backgroundColor: colors.background || '#ffffff',
      color: colors.primary || '#111827',
      padding: spacing.containerPadding || '48px',
      fontFamily: `${typo.bodyFont || 'system-ui'}, sans-serif`
    },
    title: {
      fontSize: typo.headingSize || '42px',
      fontWeight: typo.headingWeight || 'bold',
      lineHeight: typo.headingLineHeight || '1.2',
      letterSpacing: typo.headingLetterSpacing || '-0.02em',
      fontFamily: `${typo.headingFont || 'system-ui'}, sans-serif`,
      color: colors.primary || '#111827'
    },
    text: {
      fontSize: typo.bodySize || '14px',
      lineHeight: typo.bodyLineHeight || '1.6',
      color: colors.secondary || '#4b5563'
    },
    imageGrid: {
      gap: spacing.elementGap || '12px',
      columns: 2,
      borderRadius: effects.borderRadius || '8px'
    },
    divider: {
      color: colors.border || 'rgba(0,0,0,0.1)',
      margin: `${spacing.sectionGap || '24px'} 0`
    },
    background: gradient.enabled ? {
      type: 'gradient',
      gradient: {
        type: gradient.type || 'linear',
        angle: gradient.angle || 135,
        stops: gradient.stops?.map((stop, i) => {
          // Handle both "color position%" string format and object format
          if (typeof stop === 'string') {
            const match = stop.match(/^(#[a-fA-F0-9]+|rgba?\([^)]+\))\s*(\d+)%?$/)
            if (match) return { color: match[1], position: parseInt(match[2]) }
            return { color: stop, position: i * 100 }
          }
          return stop
        }) || []
      }
    } : { type: 'none' },
    // Pass through raw effects for components that need them
    _effects: effects
  }
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

// Use converted styles if token format, otherwise merge with defaults
const mergedStyles = computed(() => {
  const source = convertedStyles.value || props.styles || {}
  return {
    container: { ...defaultStyles.container, ...(source.container || {}) },
    title: { ...defaultStyles.title, ...(source.title || {}) },
    text: { ...defaultStyles.text, ...(source.text || {}) },
    imageGrid: { ...defaultStyles.imageGrid, ...(source.imageGrid || {}) },
    divider: { ...defaultStyles.divider, ...(source.divider || {}) },
    background: { ...defaultStyles.background, ...(source.background || {}) }
  }
})

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

const containerStyle = computed(() => {
  const effects = convertedStyles.value?._effects || {}
  return {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    position: 'relative',
    ...mergedStyles.value.container,
    ...backgroundStyle.value,
    // Apply box-shadow from vision analysis
    ...(effects.shadow && effects.shadow !== 'none' ? { boxShadow: effects.shadow } : {})
  }
})

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
