# Product Roadmap: Web-Native Design Export

## Vision
Transform notes2pdf from a "PDF generator" into a **web-native portfolio/deck creator** where users get beautiful, shareable web pages that match their personal brand - automatically extracted from their existing website/portfolio.

**Core insight:** HTML export isn't just "PDF but online" - it's a completely different medium with animations, responsive design, hover effects, embedded fonts, and most importantly: **design can be pulled from the user's existing web presence**.

---

## Phase 1: Basic HTML Export (MVP)
*Get shareable URLs working*

### Features
- "Share as Web Page" button alongside PDF export
- Self-contained HTML with embedded styles + base64 images
- Upload to Cloudflare R2
- Return shareable URL (e.g., `pub-xxx.r2.dev/my-deck.html`)
- 30-day expiration with cleanup

### Technical
- `useWebExport.js` composable - serialize DOM with computed styles
- `upload-share.js` Netlify function - R2 upload with slug generation
- `cleanup-expired.js` scheduled function - daily cleanup
- Modal UI with URL + copy button

---

## Phase 2: Web-Native Templates
*Design specifically for the web medium*

### Why different from PDF?
| PDF | Web |
|-----|-----|
| Fixed size (A4) | Responsive (mobile → desktop) |
| Static | Animated, interactive |
| System fonts only | Google Fonts, custom fonts |
| Single page | Scrolling, sections |
| Print-focused | Screen-focused, social sharing |

### New capabilities
- CSS animations (fade-in, slide-up on scroll)
- Google Fonts integration
- Open Graph meta tags for social previews
- Responsive breakpoints (mobile-first)
- Optional: View counter, social share buttons

---

## Phase 3: Website-Inspired Design (🔥 Differentiator)
*"Make my deck look like my website"*

### User Flow
```
1. User enters portfolio URL: https://janedoe.com
2. System analyzes the website...
3. Shows extracted brand kit:
   - Colors: [#1a1a1a] [#e63946] [#f1f1f1]
   - Fonts: "Playfair Display", "Inter"
   - Mood: Minimal, elegant, high-contrast
4. Generates deck matching their brand
```

### What we extract

**From CSS (high confidence):**
- Colors: CSS variables, background-color, color properties
- Typography: Google Fonts links, font-family declarations
- Spacing: margin/padding patterns, gap values

**From visual analysis (AI-assisted):**
- Mood: minimal vs maximalist, dark vs light
- Layout style: lots of whitespace, centered, grid-based
- Image treatment: rounded corners, shadows, borders

### Technical approach
```javascript
// Hybrid: CSS parsing + AI analysis
async function analyzeWebsite(url) {
  // 1. Fetch HTML + CSS
  const { html, css } = await fetchSiteAssets(url)

  // 2. Parse CSS for exact values
  const colors = extractColorsFromCSS(css)
  const fonts = extractFontsFromHTML(html)

  // 3. AI for mood/aesthetic
  const mood = await claude.analyze({
    prompt: "Analyze this website's design aesthetic",
    data: { colors, fonts, htmlSample: html.slice(0, 5000) }
  })

  return { colors, fonts, mood }
}
```

---

## Phase 4: Design Tweaking UI
*"AI got me 80% there, let me finish the last 20%"*

### Real-time editor
```
┌─────────────────────┬─────────────────────────┐
│                     │ Design Controls         │
│   LIVE PREVIEW      │                         │
│                     │ Colors                  │
│   Updates as you    │ Primary   [■] #1a1a1a  │
│   adjust controls   │ Accent    [■] #e63946  │
│                     │                         │
│                     │ Typography              │
│                     │ Heading [Playfair    ▼] │
│                     │ Body    [Inter       ▼] │
│                     │                         │
│                     │ Layout                  │
│                     │ [Compact|●Normal|Wide]  │
│                     │                         │
│                     │ Effects                 │
│                     │ [✓] Animations          │
│                     │ [✓] Hover effects       │
└─────────────────────┴─────────────────────────┘
```

### Design tokens (CSS variables)
```javascript
const designTokens = {
  colors: { primary: '#1a1a1a', accent: '#e63946', background: '#fff' },
  typography: { headingFont: 'Playfair Display', bodyFont: 'Inter', baseSize: 18 },
  spacing: { unit: 8, scale: 'normal' },  // compact, normal, spacious
  effects: { animations: true, hoverEffects: true }
}
```

All design controlled via CSS custom properties - tweaking just updates variables, instant preview.

---

## Phase 5: Advanced Features (Future)

- **Multi-section layouts** - Hero, content, gallery, footer
- **Custom CSS injection** - Power users can add their own styles
- **Template marketplace** - Share/browse community templates
- **Analytics** - View counts, engagement
- **Password protection** - Private links
- **Embed codes** - iframe for Notion, LinkedIn

---

## Implementation Priority

| Phase | Value | Effort | Priority |
|-------|-------|--------|----------|
| 1. Basic HTML Export | Medium | Medium | **Do first** |
| 3. Website Analysis | **High** | High | **Do second** (differentiator!) |
| 4. Design Tweaking | Medium | Medium | Do third |
| 2. Web Templates | Medium | Medium | Alongside phase 3-4 |
| 5. Advanced | Low-Med | Varies | Later |

**Recommendation:** Phase 1 → Phase 3 → Phase 4. Website analysis is the killer feature that differentiates from Canva/Notion.

---

## Questions to Decide

1. **Target users:** Photographers? Designers? All creatives?
2. **Pricing hook:** Free = watermark + 30-day expiry, Paid = permanent + custom domain?
3. **Mobile priority:** Should shared pages be mobile-first?
