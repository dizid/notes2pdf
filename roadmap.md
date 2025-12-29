# Technical Foundation: Supabase + Stripe Preparation

## Overview
Prepare the Vue 3 app for auth, database, payments, and future enhancements using **Supabase** (auth + PostgreSQL) and **Stripe** foundation. KISS approach: minimal viable structure that works now and scales later.

## Key Decisions
- **Supabase** for auth + database (one platform, generous free tier)
- **Hybrid mode**: Guests use localStorage, logged-in users sync to Supabase
- **Stripe foundation only**: Webhook handler + customer creation (no payment flows yet)
- **Follow existing patterns**: Singleton composables with module-level refs

---

## Phase 1: Supabase Setup

### 1.1 Install dependency
```bash
npm install @supabase/supabase-js
```

### 1.2 Create `src/lib/supabase.js`
Simple client initialization using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` env vars.

### 1.3 Database Schema (run in Supabase SQL Editor)
```sql
-- profiles (extends auth.users)
-- designs (replaces localStorage history)
-- custom_templates (replaces localStorage templates)
-- usage (for future billing)
-- All with RLS policies: users only see own data
-- Trigger to auto-create profile on signup
```

### 1.4 Environment Variables
- `.env.local` for local dev
- Netlify dashboard for production
- Keys: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

---

## Phase 2: Authentication

### 2.1 Create `src/composables/useAuth.js`
- `user`, `loading`, `isAuthenticated` state
- `signUp()`, `signIn()`, `signInWithOAuth()`, `signOut()`
- `init()` to set up auth listener

### 2.2 Update `src/main.js`
Initialize auth before mounting app.

### 2.3 Update `src/router/index.js`
- Add route guard for `meta: { requiresAuth: true }`
- Add `/login` and `/account` routes

### 2.4 Create `src/views/LoginView.vue`
Simple email/password + OAuth login form.

---

## Phase 3: Migrate Storage to Supabase

### 3.1 Update `src/composables/useStorage.js`
- If authenticated: use Supabase `designs` table
- If guest: use localStorage (existing behavior)
- Add `migrateLocalStorage()` to import guest data on login

### 3.2 Update `src/composables/useTemplates.js`
- If authenticated: use Supabase `custom_templates` table
- If guest: use localStorage
- Add `migrateLocalTemplates()`

---

## Phase 4: Stripe Foundation

### 4.1 Install dependency
```bash
npm install stripe
```

### 4.2 Create `netlify/functions/stripe-webhook.js`
Handle events: `customer.created`, `checkout.session.completed`, subscription events.

### 4.3 Create `netlify/functions/create-stripe-customer.js`
Lazily create Stripe customer linked to Supabase user.

### 4.4 Create `src/composables/useStripe.js`
- `ensureCustomer()` - creates Stripe customer if needed
- Placeholder `createCheckoutSession()` for future use

### 4.5 Environment Variables
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (server only)
- `VITE_STRIPE_PUBLISHABLE_KEY` (frontend)

---

## Phase 5: UI Polish

### 5.1 Create `src/views/AccountView.vue`
Simple profile page showing email, Stripe customer status.

### 5.2 Update `src/components/TopNav.vue`
Show login/logout button based on auth state.

---

## Files to Create
| File | Purpose |
|------|---------|
| `src/lib/supabase.js` | Supabase client |
| `src/composables/useAuth.js` | Authentication |
| `src/composables/useStripe.js` | Stripe integration |
| `src/views/LoginView.vue` | Login/signup page |
| `src/views/AccountView.vue` | User profile |
| `netlify/functions/stripe-webhook.js` | Stripe webhooks |
| `netlify/functions/create-stripe-customer.js` | Create Stripe customer |

## Files to Modify
| File | Changes |
|------|---------|
| `src/composables/useStorage.js` | Add Supabase support |
| `src/composables/useTemplates.js` | Add Supabase support |
| `src/router/index.js` | Add auth guards + new routes |
| `src/main.js` | Initialize auth |
| `src/components/TopNav.vue` | Auth-aware UI |
| `package.json` | Add dependencies |

---

## Implementation Order
1. Supabase project setup + schema
2. `supabase.js` + `useAuth.js` + login flow
3. Update `useStorage.js` + `useTemplates.js`
4. Stripe functions + `useStripe.js`
5. UI updates (TopNav, AccountView)
