<script setup>
import { useRouter } from 'vue-router'
import { usePaywall } from '../composables/usePaywall'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'

const router = useRouter()
const { createCheckout, isPro, loading, error } = usePaywall()
const { isAuthenticated } = useAuth()
const { showError } = useToast()

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out sizzle',
    features: [
      '1 free publish',
      'All templates',
      'PNG & PDF export',
      'sizzle branding on pages'
    ],
    cta: 'Get Started',
    ctaAction: () => router.push('/app')
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$22',
    period: 'one-time',
    description: 'Unlimited access, forever',
    badge: 'Lifetime',
    features: [
      'Unlimited publishes',
      'All templates',
      'All export formats',
      'Social media sizes',
      'No sizzle branding',
      'Priority support'
    ],
    cta: 'Get Lifetime Access',
    popular: true
  }
]

async function handlePlanClick(plan) {
  if (plan.ctaAction) {
    plan.ctaAction()
    return
  }

  if (isPro.value) {
    // Already pro
    router.push('/app')
    return
  }

  if (!isAuthenticated.value) {
    // Redirect to app with auth trigger
    router.push('/app?auth=true')
    return
  }

  const checkoutUrl = await createCheckout()
  if (checkoutUrl) {
    window.location.href = checkoutUrl
  } else if (error.value) {
    showError(error.value)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <router-link to="/" class="text-xl font-semibold tracking-tight text-gray-900">
          sizzle
        </router-link>
        <router-link
          to="/app"
          class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Back to app
        </router-link>
      </div>
    </header>

    <!-- Content -->
    <main class="max-w-4xl mx-auto px-6 py-16">
      <!-- Hero -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Simple, transparent pricing
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Try free, then get lifetime access with a single payment.
          No subscriptions, no recurring fees.
        </p>
      </div>

      <!-- Pricing cards -->
      <div class="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        <div
          v-for="plan in plans"
          :key="plan.id"
          :class="[
            'relative bg-white rounded-2xl border-2 p-8 transition-all',
            plan.popular
              ? 'border-blue-500 shadow-xl'
              : 'border-gray-200 hover:border-gray-300'
          ]"
        >
          <!-- Badge -->
          <div
            v-if="plan.badge"
            class="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-white text-sm font-medium rounded-full"
          >
            {{ plan.badge }}
          </div>

          <!-- Plan header -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-1">
              {{ plan.name }}
            </h3>
            <p class="text-sm text-gray-500">{{ plan.description }}</p>
          </div>

          <!-- Price -->
          <div class="mb-6">
            <span class="text-4xl font-bold text-gray-900">{{ plan.price }}</span>
            <span class="text-gray-500 ml-1">{{ plan.period }}</span>
          </div>

          <!-- Features -->
          <ul class="space-y-3 mb-8">
            <li
              v-for="feature in plan.features"
              :key="feature"
              class="flex items-start gap-3"
            >
              <svg class="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-sm text-gray-600">{{ feature }}</span>
            </li>
          </ul>

          <!-- CTA -->
          <button
            @click="handlePlanClick(plan)"
            :disabled="loading"
            :class="[
              'w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2',
              plan.popular
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200',
              loading && 'opacity-50 cursor-not-allowed'
            ]"
          >
            <svg v-if="loading && plan.id === 'pro'" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ plan.cta }}
          </button>
        </div>
      </div>

      <!-- FAQ -->
      <div class="mt-16 text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">
          Frequently Asked Questions
        </h2>

        <div class="max-w-2xl mx-auto space-y-6 text-left">
          <div class="bg-white rounded-lg p-6 border border-gray-200">
            <h3 class="font-medium text-gray-900 mb-2">What counts as a "publish"?</h3>
            <p class="text-gray-600 text-sm">
              Each time you click the "Publish" button to create a shareable link, that counts as one publish.
              Exporting to PDF or PNG doesn't count against your limit.
            </p>
          </div>

          <div class="bg-white rounded-lg p-6 border border-gray-200">
            <h3 class="font-medium text-gray-900 mb-2">Is this really lifetime access?</h3>
            <p class="text-gray-600 text-sm">
              Yes! Pay once, use forever. No subscriptions, no recurring charges.
              You get unlimited publishes for as long as sizzle exists.
            </p>
          </div>

          <div class="bg-white rounded-lg p-6 border border-gray-200">
            <h3 class="font-medium text-gray-900 mb-2">What payment methods do you accept?</h3>
            <p class="text-gray-600 text-sm">
              We accept all major credit cards through Stripe. Your payment information is securely processed and never stored on our servers.
            </p>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 mt-16">
      <div class="max-w-6xl mx-auto px-6 py-8 text-center text-sm text-gray-500">
        <p>Secure payment via Stripe. Questions? Contact support@sizzle.love</p>
      </div>
    </footer>
  </div>
</template>
