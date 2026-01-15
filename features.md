# Sizzle - Features

Transform raw notes into beautiful, shareable web pages and PDFs in seconds.

## Core Workflow
1. **Input** - Add title, content, images
2. **Design** - AI analyzes your brand or website
3. **Customize** - Tweak colors, fonts, density
4. **Share** - Get instant shareable URL

## Content Input

- **Title & Body** - Paste from any source (Notes app, ChatGPT, documents)
- **Multi-Image Upload** - Support for multiple image formats with preview
- **Direct Paste** - No formatting cleanup needed

## AI Assistance

- **Website Analysis** - Paste any URL, AI extracts colors, fonts, and mood
- **Image Color Extraction** - Upload brand assets, AI detects palette + atmosphere
- **Mood Detection** - Analyzes temperature (warm/cool), saturation, brightness
- **Smart Defaults** - AI picks matching font pairs and layout based on mood
- **Prompt Keywords** - Type "minimal", "bold", "elegant" for instant style shifts

## Design Studio

- 10 curated font pairs (Classic Elegant, Modern Minimal, Editorial Bold, etc.)
- Real-time A4 preview with live updates
- Custom color picker for brand colors
- Light/dark mode toggle
- Density control (compact → normal → spacious)
- Effects: animations, shadows, rounded corners

## Templates

- **Bold Editorial** - Dark, high-impact magazine aesthetic with large serif typography
- **Photo Spread** - Visual-first layout optimized for images
- **Clean Deck** - Professional, minimal design for work-in-progress updates
- Save custom templates from any design
- Full design token control (colors, typography, layout, effects)

## Export Options

### Formats
- **PDF** - A4 format, print-ready
- **PNG** - Original size or custom dimensions

### Social Media Sizes
- Open Graph (1200x630)
- Instagram Post (1080x1080)
- Instagram Story (1080x1920)
- Twitter (1200x675)
- LinkedIn (1200x627)
- Facebook (1200x630)

## Web Publishing

- One-click shareable URL (Cloudflare R2 CDN)
- Self-contained HTML (no external dependencies)
- Open Graph meta tags for social previews
- Print-safe CSS included

### Remix Feature
- "Create your own" viral CTA on published pages
- Others can remix your page with pre-populated content
- Incentivizes viral sharing

## User Features

### Export History
- Local browser storage of all exports
- Supabase sync for authenticated users
- One-click access to previous pages
- Clear individual items or all history

### Authentication
- Email/password authentication via Supabase
- Optional: use the app anonymously without signup
- User profiles with avatar and metadata

### Analytics (Pro)
- Page view tracking on published pages
- Total views across all pages
- Per-page view counts in history

## Pricing

### Free Tier
- 1 publish per month
- Preset templates only
- PNG & PDF export
- Sizzle branding on pages

### Pro Tier ($9/month or $69/year)
- Unlimited publishes
- AI brand extraction & website analysis
- Page view analytics
- All export formats
- No sizzle branding
- Priority support

## Privacy

- Browser-based processing
- No backend storage of content
- AI features with local fallback

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/app` | Main create/export interface |
| `/app/studio` | AI design generator studio |
| `/app/studio/builder` | Advanced template customization |
| `/app/history` | Export history viewer |
| `/pricing` | Pricing page |
| `/remix/:slug` | Remix share link |

## Tech Stack

- **Frontend**: Vue 3, Vite, Tailwind CSS v4
- **Backend**: Netlify Functions (serverless)
- **Database**: Supabase (auth + data)
- **AI**: Anthropic Claude API
- **CDN**: Cloudflare R2
- **Payments**: Stripe
