<script setup>
import { computed } from 'vue'

const props = defineProps({
  animations: {
    type: Boolean,
    default: true
  },
  shadows: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:animations', 'update:shadows'])

const effects = computed(() => [
  {
    id: 'animations',
    label: 'Animations',
    description: 'Smooth entrance effects',
    enabled: props.animations,
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`,
    activeColor: 'from-violet-500 to-purple-500',
    preview: 'motion'
  },
  {
    id: 'shadows',
    label: 'Shadows',
    description: 'Depth and elevation',
    enabled: props.shadows,
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />`,
    activeColor: 'from-amber-500 to-orange-500',
    preview: 'depth'
  }
])

function toggleEffect(effectId) {
  if (effectId === 'animations') {
    emit('update:animations', !props.animations)
  } else if (effectId === 'shadows') {
    emit('update:shadows', !props.shadows)
  }
}
</script>

<template>
  <div class="effects-panel space-y-3">
    <button
      v-for="effect in effects"
      :key="effect.id"
      @click="toggleEffect(effect.id)"
      :class="[
        'w-full p-4 rounded-xl border-2 transition-all duration-300 text-left group relative overflow-hidden',
        effect.enabled
          ? 'border-gray-900 bg-gray-50'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      ]"
    >
      <!-- Background gradient when active -->
      <div
        :class="[
          'absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300',
          effect.activeColor,
          effect.enabled ? 'opacity-5' : ''
        ]"
      />

      <div class="relative flex items-start gap-4">
        <!-- Icon Container -->
        <div
          :class="[
            'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300',
            effect.enabled
              ? `bg-gradient-to-br ${effect.activeColor} shadow-lg`
              : 'bg-gray-100 group-hover:bg-gray-200'
          ]"
        >
          <svg
            class="w-6 h-6 transition-colors duration-300"
            :class="effect.enabled ? 'text-white' : 'text-gray-500'"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            v-html="effect.icon"
          />
        </div>

        <!-- Content -->
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <span
              class="font-medium transition-colors duration-200"
              :class="effect.enabled ? 'text-gray-900' : 'text-gray-700'"
            >
              {{ effect.label }}
            </span>

            <!-- Toggle Switch -->
            <div
              :class="[
                'w-10 h-6 rounded-full transition-all duration-300 relative',
                effect.enabled ? 'bg-gray-900' : 'bg-gray-300'
              ]"
            >
              <div
                :class="[
                  'absolute w-4 h-4 rounded-full bg-white shadow top-1 transition-all duration-300',
                  effect.enabled ? 'left-5' : 'left-1'
                ]"
              />
            </div>
          </div>

          <p class="text-xs text-gray-500 mt-0.5">{{ effect.description }}</p>

          <!-- Mini Preview -->
          <div class="mt-3 flex gap-2">
            <!-- Animation preview -->
            <div
              v-if="effect.preview === 'motion'"
              class="flex gap-1"
            >
              <div
                :class="[
                  'w-6 h-1.5 rounded-full transition-all',
                  effect.enabled ? 'bg-violet-400 animate-slide' : 'bg-gray-200'
                ]"
              />
              <div
                :class="[
                  'w-4 h-1.5 rounded-full transition-all',
                  effect.enabled ? 'bg-violet-300 animate-slide delay-100' : 'bg-gray-200'
                ]"
                style="animation-delay: 0.1s"
              />
              <div
                :class="[
                  'w-3 h-1.5 rounded-full transition-all',
                  effect.enabled ? 'bg-violet-200 animate-slide delay-200' : 'bg-gray-200'
                ]"
                style="animation-delay: 0.2s"
              />
            </div>

            <!-- Shadow preview -->
            <div
              v-if="effect.preview === 'depth'"
              class="flex gap-2"
            >
              <div
                :class="[
                  'w-8 h-6 rounded bg-white border border-gray-200 transition-shadow duration-300',
                  effect.enabled ? 'shadow-lg' : ''
                ]"
              />
              <div
                :class="[
                  'w-8 h-6 rounded bg-white border border-gray-200 transition-shadow duration-300',
                  effect.enabled ? 'shadow-md' : ''
                ]"
              />
              <div
                :class="[
                  'w-8 h-6 rounded bg-white border border-gray-200 transition-shadow duration-300',
                  effect.enabled ? 'shadow-sm' : ''
                ]"
              />
            </div>
          </div>
        </div>
      </div>
    </button>
  </div>
</template>

<style scoped>
@keyframes slide {
  0%, 100% {
    transform: translateX(0);
    opacity: 0.6;
  }
  50% {
    transform: translateX(4px);
    opacity: 1;
  }
}

.animate-slide {
  animation: slide 1.5s ease-in-out infinite;
}
</style>
