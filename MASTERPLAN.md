# Sizzle Monetization Masterplan

> Transform Sizzle from a $22 one-time tool into a sustainable subscription business.

---

## Executive Summary

**Current State:** $22 lifetime pricing with free AI = bleeding money, no recurring revenue
**Target State:** $9/mo subscription with gated AI, analytics for ongoing value
**Goal:** $1,500-2,500 MRR within 6 months (200-300 subscribers)

---

## Phase 1: Fix the Bleeding (Week 1)

### 1.1 Fix Pricing Inconsistency
- Landing page shows $9/mo, pricing page shows $22 lifetime
- **Decision:** Standardize on $9/mo (or $69/year)
- Files: `src/views/LandingView.vue`, `src/views/PricingView.vue`

### 1.2 Gate AI Behind Auth
- AI brand extraction costs ~$0.02-0.05 per use (Claude API)
- Currently free = losing money on best feature
- **Change:**
  - Free: 0 AI generations (use preset styles only)
  - Pro: Unlimited AI generations
- Files: `src/composables/useDesignGenerator.js`, `src/views/StudioView.vue`

### 1.3 Add Page View Tracking
- Foundation for "analytics" subscription value
- Inject tracking pixel into published pages
- Store views in Supabase
- Files: `netlify/functions/upload-publish.js`, `netlify/functions/track.js` (new)

---

## Phase 2: Subscription Value (Week 2)

### 2.1 Analytics Display
- Show view counts in History view
- "47 views • Top sources: Twitter (23), Direct (18)"
- **This justifies ongoing subscription**
- Files: `src/views/HistoryView.vue`, `src/composables/useAnalytics.js` (new)

### 2.2 Switch to Subscription Billing
- Change Stripe from `mode: 'payment'` to `mode: 'subscription'`
- Add annual option ($69/year = 2 months free)
- Files: `netlify/functions/create-checkout.js`, `src/views/PricingView.vue`

### 2.3 Grandfather Existing Users
- Keep $22 lifetime users on unlimited publishes
- New features (analytics) require active subscription or add-on

---

## Phase 3: Stickiness (Week 3)

### 3.1 Brand Kit Feature
- Save brand colors, fonts, mood after AI analysis
- "Use saved brand" dropdown in Studio
- Creates lock-in (leaving = losing saved brands)
- Schema: `brand_kits` table
- Files: `src/composables/useBrandKit.js` (new), `src/views/StudioView.vue`

### 3.2 Tier Differentiation
```
FREE:   0 brand kits, must re-analyze each time
PRO:    1 brand kit saved
TEAMS:  Unlimited brand kits + sharing
```

---

## Phase 4: Growth (Week 4)

### 4.1 Optimize Viral Loop
- Move CTA from bottom bar to floating badge (more visible)
- Track remix funnel: cta_view → cta_click → remix_start → remix_complete
- Files: `netlify/functions/upload-publish.js`

### 4.2 Social Proof
- Show "X people viewed this" on published pages
- Show "Y people remixed this" for popular pages

---

## Pricing Structure

| Tier | Price | Includes |
|------|-------|----------|
| **Free** | $0 | 1 publish/month, sizzle branding, NO AI, NO analytics |
| **Pro** | $9/mo or $69/year | Unlimited publishes, AI brand extraction, analytics, 1 brand kit, no branding |
| **Team** | $29/mo (future) | Everything in Pro + unlimited brand kits, 3 seats |

---

## Database Schema Additions

```sql
-- Page view tracking
CREATE TABLE public.page_views (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  user_id uuid,
  viewed_at timestamp with time zone DEFAULT now(),
  referrer text,
  country text,
  CONSTRAINT page_views_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_page_views_slug ON public.page_views(slug);
CREATE INDEX idx_page_views_user_id ON public.page_views(user_id);

-- Aggregated stats
CREATE TABLE public.page_stats (
  slug text NOT NULL,
  user_id uuid,
  total_views integer DEFAULT 0,
  last_viewed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT page_stats_pkey PRIMARY KEY (slug)
);

-- Brand kits
CREATE TABLE public.brand_kits (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL DEFAULT 'My Brand',
  colors jsonb DEFAULT '[]',
  fonts jsonb DEFAULT '{}',
  mood jsonb DEFAULT '{}',
  source_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT brand_kits_pkey PRIMARY KEY (id),
  CONSTRAINT brand_kits_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Remix funnel tracking
CREATE TABLE public.remix_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  source_slug text NOT NULL,
  event_type text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);
```

---

## Success Metrics

### Acquisition
- Landing → Signup: >5%
- Signup → First Publish: >30%
- Remix CTA click rate: >2%

### Revenue
- Free → Pro conversion: >3%
- Monthly churn: <5%
- Target MRR: $1,500+ by month 6

### Engagement
- Publishes per user/month: >2
- 7-day return rate: >20%

---

## Implementation Checklist

### Week 1: Fix the Bleeding
- [ ] Standardize pricing to $9/mo across all pages
- [ ] Add tracking pixel to published pages
- [ ] Create `track.js` Netlify function
- [ ] Gate AI generation behind Pro tier
- [ ] Update free tier to preset styles only

### Week 2: Subscription Value
- [ ] Switch Stripe to subscription mode
- [ ] Add annual pricing option
- [ ] Build analytics view in History
- [ ] Create `useAnalytics.js` composable

### Week 3: Stickiness
- [ ] Create `brand_kits` table in Supabase
- [ ] Build Brand Kit save UI
- [ ] Add "Use saved brand" in Studio
- [ ] Limit brand kits by tier

### Week 4: Growth
- [ ] Redesign remix CTA (floating badge)
- [ ] Add remix funnel tracking
- [ ] Add view count display on pages
- [ ] A/B test CTA copy

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/views/LandingView.vue` | Update pricing display |
| `src/views/PricingView.vue` | Switch to subscription tiers |
| `src/views/HistoryView.vue` | Add analytics display |
| `src/views/StudioView.vue` | Gate AI, add brand kit selector |
| `src/composables/usePaywall.js` | Add AI gating logic |
| `netlify/functions/create-checkout.js` | Switch to subscription |
| `netlify/functions/upload-publish.js` | Add tracking pixel |
| `netlify/functions/track.js` | New - handle view tracking |
| `supabase/schema.sql` | Add new tables |

---

## Risk Mitigation

1. **Existing users angry about price change**
   - Grandfather all $22 lifetime purchasers
   - Give them Pro features forever (but new features may require add-on)

2. **Subscription churn too high**
   - Analytics creates ongoing value
   - Brand Kit creates switching cost
   - Annual discount encourages commitment

3. **AI costs spiral**
   - Gating AI behind Pro means paying users cover costs
   - Monitor usage, set soft limits if needed

---

*Last updated: January 2026*
