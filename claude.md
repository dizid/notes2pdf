# Project Guide

AI-powered website-to-PDF tool. Users paste a URL, AI analyzes the design, generates styled HTML pages.

## Tech Stack
- Vue 3 + Vite + Tailwind CSS 4
- Supabase (auth + DB)
- Netlify Functions (serverless)
- Grok AI API (via proxy function)
- Stripe payments

## Dev Setup
Run `netlify dev` or use the `/dev` skill.
Access at http://localhost:8888

## Key Directories
- `src/components/` - Vue components
- `src/views/` - Page views
- `src/composables/` - Composition API hooks
- `src/lib/` - Utilities
- `netlify/functions/` - Serverless functions

## Code Style
- Variables/functions: camelCase
- Components: PascalCase
- Files: kebab-case
- Use `<script setup>` in Vue components

## Preferences
- Act like a senior developer
- Write complete, working code - no mocks, stubs, or TODOs
- Use clear comments in code
- Keep existing working code intact when adding features
- Modular, maintainable structure
