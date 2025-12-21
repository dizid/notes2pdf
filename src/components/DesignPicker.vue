<script setup>
const model = defineModel()

const templates = [
  {
    id: 'bold-editorial',
    name: 'Bold Editorial',
    description: 'High-impact headers, dramatic typography'
  },
  {
    id: 'photo-spread',
    name: 'Photo Spread',
    description: 'Image-centric, magazine layout'
  },
  {
    id: 'clean-deck',
    name: 'Clean Deck',
    description: 'Professional presentation style'
  }
]
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6">
    <h2 class="text-lg font-medium mb-4">Design</h2>

    <div class="grid grid-cols-3 gap-3">
      <button
        v-for="template in templates"
        :key="template.id"
        @click="model = template.id"
        :class="[
          'p-4 border rounded-lg text-left transition-all',
          model === template.id
            ? 'border-gray-900 bg-gray-50'
            : 'border-gray-200 hover:border-gray-300'
        ]"
      >
        <!-- Template preview placeholder -->
        <div
          :class="[
            'aspect-[3/4] rounded mb-3 flex items-end p-2',
            template.id === 'bold-editorial' ? 'bg-gray-900' : '',
            template.id === 'photo-spread' ? 'bg-gradient-to-b from-gray-200 to-gray-400' : '',
            template.id === 'clean-deck' ? 'bg-white border border-gray-200' : ''
          ]"
        >
          <div class="w-full space-y-1">
            <div
              :class="[
                'h-2 rounded-sm',
                template.id === 'bold-editorial' ? 'bg-white w-3/4' : '',
                template.id === 'photo-spread' ? 'bg-white/80 w-1/2' : '',
                template.id === 'clean-deck' ? 'bg-gray-300 w-2/3' : ''
              ]"
            ></div>
            <div
              :class="[
                'h-1 rounded-sm',
                template.id === 'bold-editorial' ? 'bg-white/60 w-1/2' : '',
                template.id === 'photo-spread' ? 'bg-white/60 w-1/3' : '',
                template.id === 'clean-deck' ? 'bg-gray-200 w-1/2' : ''
              ]"
            ></div>
          </div>
        </div>

        <h3 class="font-medium text-sm">{{ template.name }}</h3>
        <p class="text-xs text-gray-500 mt-1">{{ template.description }}</p>
      </button>
    </div>
  </div>
</template>
