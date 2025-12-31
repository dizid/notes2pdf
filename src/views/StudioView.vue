<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTemplates } from '../composables/useTemplates'
import { useDesignGenerator, FONT_PAIRS, isLightColor } from '../composables/useDesignGenerator'
import { useImageAnalysis } from '../composables/useImageAnalysis'
import { useWebsiteAnalyzer } from '../composables/useWebsiteAnalyzer'
import { useToast } from '../composables/useToast'
import DynamicTemplate from '../templates/DynamicTemplate.vue'

const router = useRouter()
const { addTemplate } = useTemplates()
const { generateDesign, generateDesignTokens, generateLocalTokens, isGenerating, error } = useDesignGenerator()
const { analyzeImage, mergeAnalyses } = useImageAnalysis()
const { analyzeWebsite, isAnalyzing: isAnalyzingWebsite, error: websiteError } = useWebsiteAnalyzer()
const { showSuccess } = useToast()

// Brand input state
const websiteUrl = ref('')
const brandColors = ref([])
const brandImages = ref([])
const stylePrompt = ref('')

// Image analysis state
const imageAnalyses = ref([]) // Store individual analyses
const combinedAnalysis = ref(null) // Merged analysis from all images

// Website analysis state
const websiteAnalysis = ref(null)

// Generated design state
const generatedStyles = ref(null)
const templateName = ref('')

// Design tweak state
const selectedFontPair = ref(null)
const designDensity = ref('normal') // compact | normal | spacious
const enableAnimations = ref(true)
const enableShadows = ref(true)
const designMode = ref('light') // light | dark

// UI state
const colorPickerRef = ref(null)
const validationMessage = ref('')

// Sample content for preview
const sampleContent = {
  title: 'Your Amazing Title',
  text: 'This is sample text to preview how your content will look in this design. The actual content will come from your notes.',
  images: []
}

async function handleImageUpload(event) {
  const files = Array.from(event.target.files)

  for (const file of files) {
    if (file.type.startsWith('image/')) {
      // Store image for display
      const reader = new FileReader()
      reader.onload = (e) => {
        brandImages.value.push({
          id: Date.now() + Math.random(),
          name: file.name,
          data: e.target.result
        })
      }
      reader.readAsDataURL(file)

      // Analyze image for colors and mood
      const analysis = await analyzeImage(file)
      imageAnalyses.value.push(analysis)

      // Merge all analyses
      combinedAnalysis.value = mergeAnalyses(imageAnalyses.value)

      // Update brand colors from combined analysis
      brandColors.value = combinedAnalysis.value.colors.slice(0, 6)
    }
  }
}

function removeImage(id) {
  const index = brandImages.value.findIndex(img => img.id === id)
  if (index !== -1) {
    brandImages.value.splice(index, 1)
    imageAnalyses.value.splice(index, 1)

    // Recombine remaining analyses
    if (imageAnalyses.value.length > 0) {
      combinedAnalysis.value = mergeAnalyses(imageAnalyses.value)
      brandColors.value = combinedAnalysis.value.colors.slice(0, 6)
    } else {
      combinedAnalysis.value = null
    }
  }
}

function removeColor(color) {
  brandColors.value = brandColors.value.filter(c => c !== color)
}

function addCustomColor() {
  colorPickerRef.value?.click()
}

function handleColorPicked(event) {
  const color = event.target.value
  if (color && !brandColors.value.includes(color)) {
    brandColors.value.push(color)
  }
}

function showValidation(message) {
  validationMessage.value = message
  setTimeout(() => {
    validationMessage.value = ''
  }, 3000)
}

async function handleGenerate() {
  if (!stylePrompt.value && brandColors.value.length === 0) {
    showValidation('Please add brand colors or describe your desired style')
    return
  }

  const result = await generateDesign({
    colors: brandColors.value,
    prompt: stylePrompt.value,
    mood: combinedAnalysis.value?.mood,
    suggestedGradient: combinedAnalysis.value?.suggestedGradient
  })

  if (result) {
    generatedStyles.value = result
  }
}

// Helper to convert hex to rgba
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Computed style for dynamic background in preview
const previewBackgroundStyle = computed(() => {
  if (!combinedAnalysis.value?.suggestedGradient) return {}

  const gradient = combinedAnalysis.value.suggestedGradient
  // Use 40% opacity for visible but subtle preview background
  const stopsStr = gradient.stops.map(s => `${hexToRgba(s.color, 0.4)} ${s.position}%`).join(', ')

  return {
    background: `linear-gradient(${gradient.angle}deg, ${stopsStr})`
  }
})

function saveTemplate() {
  if (!templateName.value.trim()) {
    showValidation('Please enter a name for your template')
    return
  }

  // Generate design tokens for the new template
  const tokens = generateLocalTokens({
    colors: brandColors.value,
    prompt: stylePrompt.value,
    mood: effectiveMood.value,
    fontPairId: selectedFontPair.value,
    density: designDensity.value
  })

  // Override with explicit user settings
  tokens.mode = designMode.value
  tokens.effects.animations = enableAnimations.value
  tokens.effects.shadows = enableShadows.value

  // Use brand colors for the design - don't override with plain dark/light!
  // If user has brand colors, use them to create a colored background
  if (brandColors.value.length > 0) {
    const primaryBrand = brandColors.value[0]
    const secondaryBrand = brandColors.value[1] || primaryBrand

    if (designMode.value === 'dark') {
      // Dark mode with brand accent: dark bg with brand color as accent
      tokens.colors.background = '#111827'
      tokens.colors.surface = '#1f2937'
      tokens.colors.primary = '#ffffff'
      tokens.colors.secondary = '#d1d5db'
      tokens.colors.accent = primaryBrand
    } else {
      // Light mode: use brand color as background tint or keep it as accent
      // For a more colorful design, use the brand color as background
      tokens.colors.background = primaryBrand
      tokens.colors.surface = secondaryBrand
      // Determine text color based on background luminance
      const isLightBg = isLightColor(primaryBrand)
      tokens.colors.primary = isLightBg ? '#1a1a1a' : '#ffffff'
      tokens.colors.secondary = isLightBg ? '#4b5563' : '#d1d5db'
      tokens.colors.accent = brandColors.value[2] || secondaryBrand
    }
  } else {
    // No brand colors - use standard dark/light theme
    if (designMode.value === 'dark') {
      tokens.colors.background = '#111827'
      tokens.colors.surface = '#1f2937'
      tokens.colors.primary = '#ffffff'
      tokens.colors.secondary = '#d1d5db'
    } else {
      tokens.colors.background = '#ffffff'
      tokens.colors.surface = '#f8f8f8'
      tokens.colors.primary = '#1a1a1a'
      tokens.colors.secondary = '#666666'
    }
  }

  console.log('[Studio] Saving template with tokens:', tokens)

  const newId = addTemplate({
    name: templateName.value,
    description: stylePrompt.value || 'Custom template',
    tokens: tokens
  })

  showSuccess('Template saved!')
  router.push({ path: '/app', query: { template: newId } })
}

function startOver() {
  generatedStyles.value = null
  templateName.value = ''
}

const hasInput = computed(() =>
  brandColors.value.length > 0 || stylePrompt.value.trim() || websiteUrl.value.trim()
)

// Analyze website URL
async function handleAnalyzeWebsite() {
  if (!websiteUrl.value.trim()) return

  const result = await analyzeWebsite(websiteUrl.value)
  if (result) {
    websiteAnalysis.value = result

    // Merge website colors with existing colors
    if (result.colors?.length > 0) {
      // Add unique colors
      for (const color of result.colors) {
        if (!brandColors.value.includes(color)) {
          brandColors.value.push(color)
        }
      }
      // Keep only first 6
      brandColors.value = brandColors.value.slice(0, 6)
    }

    // Set font pair if detected
    if (result.fonts?.heading) {
      const matchingPair = FONT_PAIRS.find(
        p => p.heading.toLowerCase() === result.fonts.heading.toLowerCase() ||
             p.body.toLowerCase() === result.fonts.body?.toLowerCase()
      )
      if (matchingPair) {
        selectedFontPair.value = matchingPair.id
      }
    }

    // Set mood-based preferences
    if (result.mood) {
      designMode.value = result.mood.brightness === 'dark' ? 'dark' : 'light'
    }

    showSuccess('Website analyzed! Colors and fonts extracted.')
  }
}

// Clear website analysis
function clearWebsiteAnalysis() {
  websiteUrl.value = ''
  websiteAnalysis.value = null
}

// Get current effective mood (from website or image analysis)
const effectiveMood = computed(() => {
  return websiteAnalysis.value?.mood || combinedAnalysis.value?.mood || null
})

// Font pairs for dropdown
const fontPairs = FONT_PAIRS
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button
            @click="router.push('/app')"
            class="text-gray-500 hover:text-gray-700"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-xl font-semibold">Template Builder</h1>
        </div>
        <div class="flex items-center gap-3">
          <router-link
            to="/app/studio/builder"
            class="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Visual Builder
          </router-link>
          <span class="text-sm text-gray-500">AI-powered</span>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left: Input Panel -->
        <div class="space-y-6">
          <!-- Website URL Input -->
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h2 class="text-lg font-medium mb-4">Website URL</h2>
            <p class="text-sm text-gray-500 mb-4">
              Enter your portfolio or website URL to extract colors and fonts
            </p>

            <div class="flex gap-2">
              <input
                v-model="websiteUrl"
                type="url"
                placeholder="https://yourwebsite.com"
                class="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                @keyup.enter="handleAnalyzeWebsite"
              />
              <button
                @click="handleAnalyzeWebsite"
                :disabled="!websiteUrl.trim() || isAnalyzingWebsite"
                :class="[
                  'px-4 py-3 rounded-lg font-medium transition-colors whitespace-nowrap',
                  websiteUrl.trim() && !isAnalyzingWebsite
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                ]"
              >
                <span v-if="isAnalyzingWebsite" class="flex items-center gap-2">
                  <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Analyzing...
                </span>
                <span v-else>Analyze</span>
              </button>
            </div>

            <!-- Website analysis result -->
            <div v-if="websiteAnalysis" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-start justify-between">
                <div>
                  <p class="text-sm font-medium text-green-800">Website analyzed!</p>
                  <p class="text-xs text-green-600 mt-1">
                    Found {{ websiteAnalysis.colors?.length || 0 }} colors
                    <span v-if="websiteAnalysis.fonts?.heading">, fonts: {{ websiteAnalysis.fonts.heading }}</span>
                  </p>
                </div>
                <button @click="clearWebsiteAnalysis" class="text-green-600 hover:text-green-800">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Website error -->
            <p v-if="websiteError" class="mt-2 text-sm text-red-600">{{ websiteError }}</p>
          </div>

          <!-- Brand Images -->
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h2 class="text-lg font-medium mb-4">Brand Assets</h2>
            <p class="text-sm text-gray-500 mb-4">
              Upload logos or brand images to extract colors automatically
            </p>

            <label class="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                class="hidden"
                @change="handleImageUpload"
              />
              <svg class="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-sm text-gray-600">Drop images or click to upload</span>
            </label>

            <!-- Uploaded images -->
            <div v-if="brandImages.length" class="mt-4 flex flex-wrap gap-2">
              <div
                v-for="img in brandImages"
                :key="img.id"
                class="relative group"
              >
                <img
                  :src="img.data"
                  :alt="img.name"
                  class="w-16 h-16 object-cover rounded"
                />
                <button
                  @click="removeImage(img.id)"
                  class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <!-- Extracted Colors -->
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h2 class="text-lg font-medium mb-4">Brand Colors</h2>
            <p class="text-sm text-gray-500 mb-4">
              Colors extracted from your images (click to remove, or add custom)
            </p>

            <div class="flex flex-wrap gap-2">
              <button
                v-for="color in brandColors"
                :key="color"
                @click="removeColor(color)"
                class="group relative w-10 h-10 rounded-lg border-2 border-white shadow-md hover:scale-110 transition-transform"
                :style="{ backgroundColor: color }"
                :title="color"
              >
                <span class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 rounded-lg text-white text-xs">
                  ×
                </span>
              </button>

              <button
                @click="addCustomColor"
                class="w-10 h-10 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors"
              >
                +
              </button>
              <input
                ref="colorPickerRef"
                type="color"
                class="sr-only"
                @change="handleColorPicked"
              />
            </div>
          </div>

          <!-- Detected Atmosphere -->
          <div v-if="combinedAnalysis?.mood" class="bg-white border border-gray-200 rounded-lg p-6">
            <h2 class="text-lg font-medium mb-4">Detected Atmosphere</h2>
            <p class="text-sm text-gray-500 mb-4">
              Visual characteristics extracted from your images
            </p>

            <div class="grid grid-cols-3 gap-3">
              <!-- Temperature -->
              <div class="text-center p-3 rounded-lg transition-colors"
                   :class="combinedAnalysis.mood.temperature === 'warm' ? 'bg-orange-50' :
                           combinedAnalysis.mood.temperature === 'cool' ? 'bg-blue-50' : 'bg-gray-50'">
                <div class="text-2xl mb-1">
                  <span v-if="combinedAnalysis.mood.temperature === 'warm'">
                    <svg class="w-6 h-6 mx-auto text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                    </svg>
                  </span>
                  <span v-else-if="combinedAnalysis.mood.temperature === 'cool'">
                    <svg class="w-6 h-6 mx-auto text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83M12 8a4 4 0 100 8 4 4 0 000-8z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                    </svg>
                  </span>
                  <span v-else>
                    <svg class="w-6 h-6 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                    </svg>
                  </span>
                </div>
                <div class="text-xs text-gray-500">Temperature</div>
                <div class="text-sm font-medium capitalize"
                     :class="combinedAnalysis.mood.temperature === 'warm' ? 'text-orange-600' :
                             combinedAnalysis.mood.temperature === 'cool' ? 'text-blue-600' : 'text-gray-600'">
                  {{ combinedAnalysis.mood.temperature }}
                </div>
              </div>

              <!-- Saturation -->
              <div class="text-center p-3 rounded-lg transition-colors"
                   :class="combinedAnalysis.mood.saturation === 'vibrant' ? 'bg-purple-50' :
                           combinedAnalysis.mood.saturation === 'muted' ? 'bg-stone-50' : 'bg-gray-50'">
                <div class="text-2xl mb-1">
                  <span v-if="combinedAnalysis.mood.saturation === 'vibrant'">
                    <svg class="w-6 h-6 mx-auto text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
                    </svg>
                  </span>
                  <span v-else-if="combinedAnalysis.mood.saturation === 'muted'">
                    <svg class="w-6 h-6 mx-auto text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                    </svg>
                  </span>
                  <span v-else>
                    <svg class="w-6 h-6 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                    </svg>
                  </span>
                </div>
                <div class="text-xs text-gray-500">Saturation</div>
                <div class="text-sm font-medium capitalize"
                     :class="combinedAnalysis.mood.saturation === 'vibrant' ? 'text-purple-600' :
                             combinedAnalysis.mood.saturation === 'muted' ? 'text-stone-500' : 'text-gray-600'">
                  {{ combinedAnalysis.mood.saturation }}
                </div>
              </div>

              <!-- Brightness -->
              <div class="text-center p-3 rounded-lg transition-colors"
                   :class="combinedAnalysis.mood.brightness === 'light' ? 'bg-yellow-50' :
                           combinedAnalysis.mood.brightness === 'dark' ? 'bg-slate-100' : 'bg-gray-50'">
                <div class="text-2xl mb-1">
                  <span v-if="combinedAnalysis.mood.brightness === 'light'">
                    <svg class="w-6 h-6 mx-auto text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
                    </svg>
                  </span>
                  <span v-else-if="combinedAnalysis.mood.brightness === 'dark'">
                    <svg class="w-6 h-6 mx-auto text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span v-else>
                    <svg class="w-6 h-6 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                  </span>
                </div>
                <div class="text-xs text-gray-500">Brightness</div>
                <div class="text-sm font-medium capitalize"
                     :class="combinedAnalysis.mood.brightness === 'light' ? 'text-yellow-600' :
                             combinedAnalysis.mood.brightness === 'dark' ? 'text-slate-600' : 'text-gray-600'">
                  {{ combinedAnalysis.mood.brightness }}
                </div>
              </div>
            </div>
          </div>

          <!-- Design Tweaks -->
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h2 class="text-lg font-medium mb-4">Design Tweaks</h2>
            <p class="text-sm text-gray-500 mb-4">
              Fine-tune your design settings
            </p>

            <div class="space-y-4">
              <!-- Font Pair -->
              <div>
                <label class="block text-sm text-gray-600 mb-2">Font Pair</label>
                <select
                  v-model="selectedFontPair"
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option :value="null">Auto (from analysis)</option>
                  <option v-for="pair in fontPairs" :key="pair.id" :value="pair.id">
                    {{ pair.name }} - {{ pair.heading }} / {{ pair.body }}
                  </option>
                </select>
              </div>

              <!-- Density -->
              <div>
                <label class="block text-sm text-gray-600 mb-2">Density</label>
                <div class="flex gap-2">
                  <button
                    v-for="density in ['compact', 'normal', 'spacious']"
                    :key="density"
                    @click="designDensity = density"
                    :class="[
                      'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors capitalize',
                      designDensity === density
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    ]"
                  >
                    {{ density }}
                  </button>
                </div>
              </div>

              <!-- Mode (Light/Dark) -->
              <div>
                <label class="block text-sm text-gray-600 mb-2">Mode</label>
                <div class="flex gap-2">
                  <button
                    @click="designMode = 'light'"
                    :class="[
                      'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2',
                      designMode === 'light'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    ]"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
                    </svg>
                    Light
                  </button>
                  <button
                    @click="designMode = 'dark'"
                    :class="[
                      'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2',
                      designMode === 'dark'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    ]"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd" />
                    </svg>
                    Dark
                  </button>
                </div>
              </div>

              <!-- Effects -->
              <div>
                <label class="block text-sm text-gray-600 mb-2">Effects</label>
                <div class="flex gap-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      v-model="enableAnimations"
                      type="checkbox"
                      class="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <span class="text-sm text-gray-700">Animations</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      v-model="enableShadows"
                      type="checkbox"
                      class="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <span class="text-sm text-gray-700">Shadows</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Style Prompt -->
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h2 class="text-lg font-medium mb-4">Style Description</h2>
            <p class="text-sm text-gray-500 mb-4">
              Describe the style, mood, or aesthetic you want (optional)
            </p>

            <textarea
              v-model="stylePrompt"
              placeholder="e.g., Modern and minimal with bold typography, suitable for a tech startup..."
              rows="3"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            ></textarea>
          </div>

        </div>

        <!-- Right: Preview Panel -->
        <div class="space-y-6">
          <!-- Generate Button - Above the fold -->
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <button
              @click="handleGenerate"
              :disabled="!hasInput || isGenerating"
              :class="[
                'w-full py-4 rounded-lg font-medium transition-colors text-lg',
                hasInput && !isGenerating
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              ]"
            >
              <span v-if="isGenerating" class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Design...
              </span>
              <span v-else>Generate Design with AI</span>
            </button>
            <p v-if="validationMessage" class="text-amber-600 text-sm text-center mt-3 animate-pulse">{{ validationMessage }}</p>
            <p v-else-if="error" class="text-red-600 text-sm text-center mt-3">{{ error }}</p>
            <p v-else-if="!hasInput" class="text-gray-400 text-sm text-center mt-3">Add colors or describe your style to generate</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 class="text-lg font-medium">Preview</h2>
              <span class="text-xs text-gray-400">A4 format</span>
            </div>

            <div class="p-6 bg-gray-100">
              <div
                class="bg-white shadow-lg mx-auto overflow-hidden"
                style="width: 100%; max-width: 350px; aspect-ratio: 1/1.414;"
              >
                <div class="origin-top-left" style="transform: scale(0.4); width: 250%; height: 250%;">
                  <DynamicTemplate
                    :content="sampleContent"
                    :styles="generatedStyles"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Save Template -->
          <div v-if="generatedStyles" class="bg-white border border-gray-200 rounded-lg p-6">
            <h2 class="text-lg font-medium mb-4">Save Your Design</h2>

            <input
              v-model="templateName"
              type="text"
              placeholder="Template name..."
              class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />

            <div class="flex gap-3">
              <button
                @click="saveTemplate"
                class="flex-1 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Save & Use Template
              </button>
              <button
                @click="startOver"
                class="px-4 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>

          <!-- Instructions -->
          <div v-else class="bg-gray-100 border border-gray-200 rounded-lg p-6 text-center">
            <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p class="text-gray-500">
              Upload brand assets or describe your style, then click Generate to create a custom design
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
