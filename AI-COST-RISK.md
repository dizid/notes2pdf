# AI Cost Risk — ESCALATED (not disabled)

**Date:** 2026-07-20
**Status:** Escalated for CEO decision — NO changes made to `analyze-design.js`, `generate-design.js`, `generate-html.js`, `parse-content.js`, or any other code
**Risk level (scanner flag):** ok(0) — but this is a known scanner blind spot (non-recursive `netlify/functions/*` scan combined with the fact these functions live at the top level, so scanner should have caught them; treat the "0" as unreliable, not as evidence of safety)

## Why this was escalated instead of disabled

The task instructions required stopping before disabling anything if there was evidence of
real paying users or revenue. That evidence exists here, clearly.

## What was found

1. **Four live Netlify functions call the Anthropic API directly**, all reachable from the
   public frontend (not build-time/local-only):
   - `netlify/functions/analyze-design.js` — Claude Vision (`claude-3-5-haiku-latest`), called from `src/composables/useWebsiteAnalyzer.js`
   - `netlify/functions/generate-design.js` — `claude-haiku-4-5-20251001`, called from `src/composables/useDesignGenerator.js`
   - `netlify/functions/generate-html.js` — `claude-haiku-4-5-20251001`, called from (template builder flow)
   - `netlify/functions/parse-content.js` — `claude-haiku-4-5-20251001`, called from `src/composables/useContentParser.js`

2. **Real, wired-up JWT authentication gates all four** — not a stub:
   - Every one of the four functions calls `requireAuth(event)` from `netlify/functions/lib/auth.js` before touching Anthropic, and `checkRateLimit(event, { maxRequests: N })` from `lib/rate-limit.js` (10–20 req/min per IP).
   - This wasn't incidental — commit `b309e9b` (2026-03-03) is titled **"Add auth + rate limiting to Netlify Functions calling Anthropic API"**, i.e. the founder already identified and hardened this exact cost-abuse surface once.
   - Caveat: auth here means "any signed-up user," not "paying user" — signup is free (`auth-signup.js`, email+password, no verification gate found). So this blocks anonymous scripted abuse but not a free-tier account created for the purpose of hammering the AI endpoints. Rate limiting (per-IP, in-memory, resets on cold start) is the actual backstop against volume abuse, not the auth check itself.

3. **Real Stripe integration with live keys, not placeholders**:
   - `.env`: `STRIPE_SECRET_KEY=sk_live_51STUbg8g...`, `VITE_STRIPE_PUBLIC_KEY=pk_live_51STUbg8g...` — both `sk_live_`/`pk_live_`, not `sk_test_`/placeholder text.
   - `STRIPE_PRICE_ID=price_1SkdoL8gBja0qkMxDT7PGJPK` — real price ID format, wired into `create-checkout.js` for a one-time "lifetime Pro" payment.
   - `stripe-webhook.js` verifies the Stripe signature (`stripe.webhooks.constructEvent`) and on `checkout.session.completed` writes `is_pro = true` + `stripe_customer_id` to the database — a complete, functioning payment→entitlement pipeline, not a stub.

4. **Real billing/usage schema** (Neon Postgres, via `netlify/functions/lib/db.js` / `@neondatabase/serverless`):
   - `users` table: `id`, `email`, `password_hash`, `full_name`, `avatar_url`, `created_at` (seen in `auth-signup.js`).
   - `usage` table: `user_id`, `is_pro`, `stripe_customer_id`, `month_year`, `shares_this_month` — read/written by `stripe-webhook.js` and `api-usage.js`. `usePaywall.js` enforces `FREE_TIER_LIMIT = 1` share/month for non-pro users (falls back to `localStorage` tracking for anonymous users, DB-backed tracking for authenticated ones).
   - This is a real, enforced free/paid tier split, not a placeholder table.

5. **Active, recent, cost-conscious development** — inconsistent with an abandoned/demo project:
   - Most recent commit touching the AI functions: `3c3562f` (2026-07-08, 12 days before this audit) — **"Switch all AI functions from Sonnet to Haiku 4.5 (~80% cost saving)"**. This is the founder actively managing real Anthropic spend on a live product, which only makes sense if there's real traffic generating real cost.
   - Surrounding commit history (Jan–Jul 2026) shows continuous feature work: Smart Content Parser, Claude Vision design extraction, remix viral loop, affiliate tracking (PlugAff), paywall flow, design system overhaul — a live product under active iteration, not dormant.

## Uncommitted work in this repo (auth refactor) — did not touch, did not conflict

Per the task brief, `git status`/`git diff` were checked first. The repo has substantial uncommitted work migrating auth from Supabase to a custom JWT/Neon implementation:
- Modified: `netlify/functions/lib/auth.js`, `stripe-webhook.js`, `track.js`, `upload-publish.js`, `package.json`/`package-lock.json`, several `src/composables/*` and `src/components/AuthModal.vue`, plus deletion of `src/lib/supabase.js`.
- Untracked (new): `netlify/functions/api-analytics.js`, `api-history.js`, `api-usage.js`, `auth-me.js`, `auth-reset-password.js`, `auth-signin.js`, `auth-signup.js`, `auth-update-password.js`, `netlify/functions/lib/db.js`, `src/lib/api.js`.

None of the four Anthropic-calling functions (`analyze-design.js`, `generate-design.js`, `generate-html.js`, `parse-content.js`) are part of this diff, so there was no direct file conflict to navigate. However, since this investigation concluded in **escalation** (no code changes of any kind), the question of whether a `DEMO_MODE` patch would have collided with the in-flight auth refactor is moot — nothing was written to any file, modified or not. Worth flagging for whoever picks this up next: the diff shows `requireAuth()` behaving equivalently before and after the refactor (JWT verification either way — Supabase-issued JWT on `HEAD`, self-issued JWT via `jsonwebtoken` in the uncommitted version), so the auth-gating conclusion above holds regardless of which version of `auth.js` eventually lands.

## What was NOT done

- No function was modified (`analyze-design.js`, `generate-design.js`, `generate-html.js`, `parse-content.js`, or their `lib/` dependencies)
- No `DEMO_MODE` flag or mock response was added anywhere
- No SQL was run against the database
- No files touched by the uncommitted auth refactor were modified or read-edited
- No other files were touched

## Recommendation: harden, don't disable (pending verification)

This is not a decision — it's a fork for the CEO, gated on one query:

1. **Confirm real usage directly in the database** before any action (read-only, run manually):
   ```sql
   -- Total registered accounts
   SELECT COUNT(*) AS total_users FROM users;

   -- Paying (lifetime Pro) customers
   SELECT COUNT(*) AS pro_users FROM usage WHERE is_pro = true;

   SELECT COUNT(DISTINCT stripe_customer_id) AS distinct_stripe_customers
   FROM usage
   WHERE stripe_customer_id IS NOT NULL;

   -- Recent activity (proxy for live AI-endpoint usage, since shares
   -- increment on successful publish, which follows an AI generation)
   SELECT COUNT(*) AS active_accounts_this_month
   FROM usage
   WHERE month_year = to_char(now(), 'YYYY-MM') AND shares_this_month > 0;
   ```

2. **If `pro_users` / `distinct_stripe_customers` are nonzero:** this is a live,
   revenue-generating product with real Stripe customers. Disabling the Anthropic calls
   would break a paid feature for paying customers. Recommended next step instead:
   - Tighten the existing per-IP rate limits (currently 10–20 req/min, in-memory, resets on
     Netlify cold start — fine against bots, weak against a determined free-tier abuser who
     spreads requests over time or across IPs).
   - Add a per-user (not just per-IP) cap tied to the existing `usage`/`shares_this_month`
     mechanism, since that infrastructure already exists — e.g. cap total AI calls (not just
     successful "shares") per free user per day, independent of the publish-time paywall.
   - Add a max-input-size guard on `parse-content.js`'s `rawText` (currently capped at 50,000
     chars server-side — reasonable) and confirm `generate-html.js`'s `content.text` truncation
     (currently truncated to 10,000 chars in the prompt — also reasonable) are both intentional
     ceilings, not oversights.

3. **If those queries come back zero/near-zero** (e.g. Stripe keys are live but no real
   checkout has ever completed): safe to disable via the standard `DEMO_MODE` env-flag pattern
   instead, per the original plan — mock responses matching each function's real response shape
   (`{ analysis, source, screenshotUrl }` for `analyze-design.js`; `{ styles }` for
   `generate-design.js`; `{ html }` for `generate-html.js`; the parsed-content object for
   `parse-content.js`), gated behind `DEMO_MODE`, default-on. At that point, also re-check
   `git status` before editing, since the uncommitted auth refactor may have landed or changed
   shape by then.

No code changes have been made; this file exists purely to surface the decision for the CEO.
