# Friendly Paywall Flow

## User Journey
```
1st publish (anonymous) → ✅ Success! (free)
2nd publish (anonymous) → 🛑 "Create account to continue" modal
   → Sign up with email
   → Redirect to /pricing page
   → Upgrade to Pro for $22 lifetime
```

## What Already Works
- `usePaywall.js` - Tracks usage in localStorage, `FREE_TIER_LIMIT = 1`
- `PaywallModal.vue` - Shows "Sign in to Upgrade", emits `@signIn`
- `AuthModal.vue` - Signup/signin flow
- `create-checkout.js` - Stripe checkout
- `PricingView.vue` - At `/pricing`

## Implementation

### 1. OutputActions.vue - Wire up paywall

```vue
// Add imports
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePaywall } from '../composables/usePaywall'
import PaywallModal from './PaywallModal.vue'
import AuthModal from './AuthModal.vue'

// Add to setup
const router = useRouter()
const { canPublish, incrementUsage, initUsage } = usePaywall()
const showPaywallModal = ref(false)
const showAuthModal = ref(false)

// Load usage on mount
onMounted(() => initUsage())

// In handlePublish() - add check at start:
async function handlePublish() {
  if (!isValid.value) return

  // Check paywall BEFORE publishing
  if (!canPublish.value) {
    showPaywallModal.value = true
    return
  }

  // ... existing publish code ...

  if (publishedUrl.value) {
    // Increment usage after successful publish
    await incrementUsage()
    // ... save to history ...
  }
}

// Handle auth flow
function handleSignInFromPaywall() {
  showPaywallModal.value = false
  showAuthModal.value = true
}

function handleAuthenticated() {
  showAuthModal.value = false
  router.push('/pricing')
}
```

```vue
<!-- Add to template -->
<PaywallModal
  :show="showPaywallModal"
  @close="showPaywallModal = false"
  @signIn="handleSignInFromPaywall"
/>
<AuthModal
  :show="showAuthModal"
  initial-mode="signup"
  @close="showAuthModal = false"
  @authenticated="handleAuthenticated"
/>
```

### 2. TopNav.vue - Add Pricing link + Upgrade button

```vue
// Add import
import { usePaywall } from '../composables/usePaywall'
const { isPro } = usePaywall()

// Add Pricing link in nav (after History):
<RouterLink
  to="/pricing"
  class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
  active-class="text-gray-900 font-medium"
>
  Pricing
</RouterLink>

// Add Upgrade button before auth section (only if not pro):
<RouterLink
  v-if="!isPro"
  to="/pricing"
  class="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
>
  Upgrade
</RouterLink>
```

## Files to Modify
1. `src/components/OutputActions.vue` - Add paywall check + auth flow
2. `src/components/TopNav.vue` - Add Pricing link + Upgrade button
