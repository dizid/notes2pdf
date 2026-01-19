import { useDesignGenerator } from './useDesignGenerator'
import {
  SHADOW_PRESETS,
  GLASS_PRESETS,
  GRAIN_TEXTURE,
  TEXT_SHADOW_PRESETS,
  IMAGE_TREATMENT_PRESETS
} from '../lib/designPresets'
import { getDecorationsForArchetype, getDecorationStyles } from '../lib/svgDecorations'

const { getGoogleFontsUrl } = useDesignGenerator()

/**
 * Composable for rendering design tokens + content into complete HTML
 */
export function useHtmlRenderer() {
  /**
   * Generate shared CSS styles for both full document and export fragment
   * @param {Object} tokens - Design tokens
   * @param {Object} options - { scope: string, forExport: boolean }
   */
  function generateSharedStyles(tokens, options = {}) {
    const { scope = '', forExport = false } = options
    const s = scope ? `${scope} ` : ''

    // Get shadow style from tokens or default to layered
    const shadowStyle = tokens.effects?.shadowStyle || (tokens.effects?.shadows ? 'layered' : 'none')
    const shadowCss = SHADOW_PRESETS[shadowStyle] || SHADOW_PRESETS.layered

    // Typography settings
    const letterSpacing = tokens.typography?.letterSpacing || '-0.01em'
    const lineHeight = tokens.typography?.lineHeight || 1.6
    const headingWeight = tokens.typography?.headingWeight || 600
    const textShadowKey = tokens.typography?.textShadow || tokens.effects?.textShadow || 'none'
    const textShadow = TEXT_SHADOW_PRESETS[textShadowKey] || 'none'
    const ligatures = tokens.typography?.ligatures
    const opticalSizing = tokens.typography?.opticalSizing

    // Decoration settings
    const decorations = tokens.decorations || {}
    const imageEffects = tokens.imageEffects || {}
    const spacing = tokens.spacing || {}
    const whitespaceMultiplier = spacing.whitespaceMultiplier || 1

    // Glass effect
    const glassKey = tokens.effects?.glass || 'none'
    const glass = GLASS_PRESETS[glassKey]

    // Grain texture
    const grainKey = tokens.effects?.grain || 'none'
    const grain = GRAIN_TEXTURE[grainKey]

    // Image treatment
    const treatmentKey = imageEffects.treatment || 'none'
    const imageTreatment = IMAGE_TREATMENT_PRESETS[treatmentKey]

    // For export, h1 doesn't have nowrap (no JS to resize)
    const h1Extra = forExport ? '' : 'white-space: nowrap;'
    const h1MaxFont = forExport ? '2.5rem' : '3.5rem'

    // Computed spacing with whitespace multiplier
    const baseSpacing = 'var(--spacing)'
    const scaledSpacing = whitespaceMultiplier !== 1 ? `calc(var(--spacing) * ${whitespaceMultiplier})` : baseSpacing

    return `
    ${s}* { margin: 0; padding: 0; box-sizing: border-box; }

    ${scope || 'body'} {
      ${forExport ? '' : 'min-height: 100vh;'}
      background: var(--color-background);
      font-family: var(--font-body);
      color: var(--color-secondary);
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 0;
      ${grain ? `position: relative;` : ''}
    }

    ${grain ? `
    ${scope || 'body'}::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: ${grain.svg};
      opacity: ${grain.opacity};
      pointer-events: none;
      z-index: 1000;
    }
    ` : ''}

    ${decorations.gridBackground ? `
    ${scope || 'body'}::after {
      content: '';
      position: fixed;
      inset: 0;
      background-image:
        linear-gradient(rgba(128, 128, 128, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(128, 128, 128, 0.03) 1px, transparent 1px);
      background-size: 20px 20px;
      pointer-events: none;
      z-index: -1;
    }
    ` : ''}

    ${s}.page {
      position: relative;
      max-width: 100%;
      width: 100%;
      background: var(--color-surface);
      border-radius: 0;
      padding: 1.25rem;
      padding-bottom: calc(1.25rem + 1.5rem);
      ${shadowCss !== 'none' ? `box-shadow: ${shadowCss};` : ''}
      ${glass ? `
      background: ${glass.background};
      backdrop-filter: ${glass.backdropFilter};
      -webkit-backdrop-filter: ${glass.backdropFilter};
      border: ${glass.border};
      ` : ''}
      ${decorations.frame ? `
      border: 2px solid var(--color-accent);
      ` : ''}
    }

    /* Tablet and up - centered card with padding */
    @media (min-width: 640px) {
      ${scope || 'body'} {
        padding: ${scaledSpacing};
        padding-top: calc(${scaledSpacing} * 2);
      }
      ${s}.page {
        max-width: 800px;
        border-radius: var(--radius);
        padding: calc(${scaledSpacing} * 2);
        padding-bottom: calc(${scaledSpacing} * 2 + 1.5rem);
        ${decorations.frame ? `
        padding: calc(${scaledSpacing} * 2.5);
        ` : ''}
      }
    }

    /* Typography - Enhanced hierarchy */
    ${s}h1 {
      font-family: var(--font-heading);
      color: var(--color-primary);
      font-size: clamp(1.75rem, 6vw, ${h1MaxFont});
      font-weight: ${headingWeight};
      line-height: 1.05;
      letter-spacing: ${letterSpacing};
      text-wrap: balance;
      margin-bottom: ${decorations.accentLine ? '0.75rem' : '1.5rem'};
      ${h1Extra}
      overflow: hidden;
      max-width: 100%;
      ${textShadow !== 'none' ? `text-shadow: ${textShadow};` : ''}
      ${ligatures ? `font-feature-settings: "liga" 1, "calt" 1;` : ''}
      ${opticalSizing ? `font-optical-sizing: auto;` : ''}
    }

    ${decorations.accentLine ? `
    ${s}h1::after {
      content: '';
      display: block;
      width: 3rem;
      height: 3px;
      background: var(--color-accent);
      margin-top: 0.75rem;
      border-radius: 2px;
    }
    ` : ''}

    ${s}h2 {
      font-family: var(--font-heading);
      color: var(--color-secondary);
      font-size: clamp(1rem, 2.5vw, 1.35rem);
      font-weight: 400;
      letter-spacing: 0.01em;
      line-height: 1.4;
      margin-bottom: 2.5rem;
      opacity: 0.85;
    }

    ${s}.metadata {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 2rem;
      font-size: 0.8rem;
      color: var(--color-secondary);
    }

    ${s}.metadata-item {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.35rem 0.75rem;
      background: var(--color-background);
      border-radius: 100px;
      font-weight: 500;
    }

    ${s}.metadata-label {
      opacity: 0.6;
      font-weight: 400;
    }

    /* Content - Better readability */
    ${s}.content {
      font-size: clamp(1rem, 2vw, 1.125rem);
      line-height: ${lineHeight};
      margin-bottom: 2.5rem;
      letter-spacing: 0.01em;
    }

    ${decorations.dropCap ? `
    ${s}.content p:first-of-type::first-letter {
      float: left;
      font-family: var(--font-heading);
      font-size: 3.5em;
      font-weight: ${headingWeight};
      line-height: 0.8;
      padding-right: 0.1em;
      color: var(--color-primary);
    }
    ` : ''}

    ${s}.content p {
      margin-bottom: 1.25rem;
    }

    ${s}.content p:last-child {
      margin-bottom: 0;
    }

    ${s}.content strong {
      font-weight: 600;
      color: var(--color-primary);
    }

    ${s}.content em {
      font-style: italic;
      color: var(--color-primary);
      opacity: 0.9;
    }

    ${s}.content ul, ${s}.content ol {
      margin-left: 1.5rem;
      margin-bottom: 1.25rem;
    }

    ${s}.content li {
      margin-bottom: 0.5rem;
    }

    ${s}.content li::marker {
      color: var(--color-accent);
    }

    /* Pull quotes / blockquotes */
    ${decorations.pullQuotes ? `
    ${s}.content blockquote,
    ${s}.pull-quote {
      position: relative;
      margin: 2rem 0;
      padding: 1.5rem 2rem;
      font-family: var(--font-heading);
      font-size: 1.25em;
      font-style: italic;
      line-height: 1.5;
      color: var(--color-primary);
      border-left: 4px solid var(--color-accent);
      background: linear-gradient(90deg, rgba(var(--color-accent-rgb, 128, 128, 128), 0.05), transparent);
    }

    ${s}.content blockquote::before,
    ${s}.pull-quote::before {
      content: '"';
      position: absolute;
      top: -0.25em;
      left: 0.5rem;
      font-size: 3em;
      font-family: Georgia, serif;
      color: var(--color-accent);
      opacity: 0.3;
      line-height: 1;
    }

    ${s}.content blockquote cite,
    ${s}.pull-quote cite {
      display: block;
      margin-top: 0.75rem;
      font-size: 0.8em;
      font-style: normal;
      color: var(--color-secondary);
      opacity: 0.7;
    }
    ` : `
    ${s}.content blockquote {
      margin: 1.5rem 0;
      padding-left: 1.5rem;
      border-left: 3px solid var(--color-accent);
      font-style: italic;
      opacity: 0.9;
    }
    `}

    /* Mono accents for tech archetype */
    ${tokens.typography?.monoAccents ? `
    ${s}.content code,
    ${s}.mono {
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 0.9em;
      padding: 0.15em 0.4em;
      background: rgba(128, 128, 128, 0.1);
      border-radius: 4px;
    }
    ` : ''}

    /* Dividers */
    ${decorations.dividers === 'simple' ? `
    ${s}.divider {
      height: 1px;
      background: var(--color-secondary);
      opacity: 0.15;
      margin: 2.5rem 0;
    }
    ` : decorations.dividers === 'gradient' ? `
    ${s}.divider {
      height: 2px;
      background: linear-gradient(90deg, var(--color-accent), transparent);
      opacity: 0.5;
      margin: 2.5rem 0;
      border-radius: 1px;
    }
    ` : ''}

    /* Gallery - Enhanced image treatment */
    ${s}.gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2.5rem;
    }

    ${s}.gallery.layout-featured {
      grid-template-columns: 1fr;
    }

    ${s}.gallery.layout-featured-grid {
      grid-template-columns: 2fr 1fr;
      grid-template-rows: 1fr 1fr;
    }

    ${s}.gallery.layout-featured-grid img:first-child {
      grid-row: span 2;
    }

    ${s}.gallery.layout-side-by-side {
      grid-template-columns: 1fr 1fr;
    }

    ${s}.gallery img {
      width: 100%;
      border-radius: calc(var(--radius) * 0.75);
      aspect-ratio: 4/3;
      object-fit: cover;
      ${imageEffects.border ? 'border: 1px solid rgba(128,128,128,0.15);' : ''}
      ${!forExport ? 'transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, filter 0.3s ease;' : ''}
      ${imageTreatment?.filter ? `filter: ${imageTreatment.filter};` : ''}
      ${imageTreatment?.mixBlendMode ? `mix-blend-mode: ${imageTreatment.mixBlendMode};` : ''}
    }

    ${treatmentKey === 'polaroid' ? `
    ${s}.gallery .img-wrapper {
      display: inline-block;
      padding: ${imageTreatment.padding};
      padding-bottom: ${imageTreatment.paddingBottom};
      background: ${imageTreatment.background};
      box-shadow: ${imageTreatment.boxShadow};
      transform: ${imageTreatment.transform};
      transition: transform 0.3s ease;
    }
    ${s}.gallery .img-wrapper:nth-child(even) {
      transform: rotate(2deg);
    }
    ${s}.gallery .img-wrapper img {
      border-radius: 0;
    }
    ${!forExport ? `
    ${s}.gallery .img-wrapper:hover {
      transform: rotate(0) scale(1.02);
    }
    ` : ''}
    ` : ''}

    ${treatmentKey === 'masked' ? `
    ${s}.gallery img {
      border-radius: ${imageTreatment.borderRadius};
      aspect-ratio: ${imageTreatment.aspectRatio};
    }
    ` : ''}

    ${imageEffects.overlay === 'gradient' ? `
    ${s}.gallery .img-wrapper {
      position: relative;
      overflow: hidden;
      border-radius: calc(var(--radius) * 0.75);
    }
    ${s}.gallery .img-wrapper::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.3));
      pointer-events: none;
    }
    ` : imageEffects.overlay === 'tint' ? `
    ${s}.gallery .img-wrapper {
      position: relative;
      overflow: hidden;
      border-radius: calc(var(--radius) * 0.75);
    }
    ${s}.gallery .img-wrapper::after {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--color-accent);
      opacity: 0.1;
      mix-blend-mode: multiply;
      pointer-events: none;
    }
    ` : ''}

    ${!forExport && imageEffects.hover === 'zoom' ? `
    ${s}.gallery img:hover {
      transform: scale(1.03);
    }
    ` : !forExport && imageEffects.hover === 'lift' ? `
    ${s}.gallery img:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.15);
    }
    ` : ''}

    ${s}.gallery.layout-featured img {
      aspect-ratio: 16/9;
    }

    ${s}a {
      color: var(--color-accent);
      text-decoration: none;
      ${!forExport ? 'transition: opacity 0.2s ease;' : ''}
    }

    ${!forExport ? `${s}a:hover {
      opacity: 0.8;
    }` : ''}

    ${s}.watermark {
      position: absolute;
      bottom: 1rem;
      right: 1.25rem;
      font-size: 0.65rem;
      opacity: 0.35;
      color: var(--color-secondary);
      letter-spacing: 0.02em;
    }

    ${s}.watermark a {
      color: inherit;
      text-decoration: none;
    }

    ${!forExport ? `${s}.watermark a:hover {
      opacity: 0.6;
    }` : ''}`
  }

  /**
   * Generate enhanced typography CSS based on decoration options
   * @param {Object} tokens - Design tokens
   * @returns {string} Enhanced typography CSS
   */
  function generateEnhancedTypography(tokens) {
    const decorations = tokens.decorations || {}
    const headingWeight = tokens.typography?.headingWeight || 600
    let css = ''

    // Enhanced drop cap styles (supports all DROP_CAP_PRESETS)
    const dropCapStyle = decorations.dropCapStyle
    if (dropCapStyle && dropCapStyle !== 'simple') {
      if (dropCapStyle === 'decorative') {
        css += `
    .content p:first-of-type::first-letter {
      float: left;
      font-family: var(--font-heading);
      font-size: 4em;
      font-weight: 700;
      line-height: 0.75;
      padding-right: 0.15em;
      padding-top: 0.05em;
      color: var(--color-accent);
      text-shadow: 2px 2px 0 var(--color-background);
    }`
      } else if (dropCapStyle === 'boxed') {
        css += `
    .content p:first-of-type::first-letter {
      float: left;
      font-family: var(--font-heading);
      font-size: 2.5em;
      font-weight: ${headingWeight};
      line-height: 1;
      padding: 0.3em 0.5em;
      margin-right: 0.5em;
      margin-top: 0.1em;
      margin-bottom: 0.1em;
      background: var(--color-accent);
      color: var(--color-background);
      border-radius: var(--radius);
    }`
      } else if (dropCapStyle === 'outlined') {
        css += `
    .content p:first-of-type::first-letter {
      float: left;
      font-family: var(--font-heading);
      font-size: 4em;
      font-weight: 700;
      line-height: 0.75;
      padding-right: 0.15em;
      padding-top: 0.05em;
      -webkit-text-stroke: 2px var(--color-accent);
      color: transparent;
    }`
      } else if (dropCapStyle === 'colored') {
        css += `
    .content p:first-of-type::first-letter {
      float: left;
      font-family: var(--font-heading);
      font-size: 3.5em;
      font-weight: ${headingWeight};
      line-height: 0.8;
      padding-right: 0.1em;
      padding-top: 0.1em;
      color: var(--color-accent);
    }`
      }
    }

    // Enhanced title underline styles
    if (decorations.titleUnderline === 'gradient') {
      css += `
    h1 {
      margin-bottom: 0.5rem;
    }
    h1::after {
      content: '';
      display: block;
      width: 120px;
      height: 4px;
      background: linear-gradient(90deg, var(--color-accent), transparent);
      margin-top: 1rem;
      margin-bottom: 1rem;
      border-radius: 2px;
    }`
    } else if (decorations.titleUnderline === 'elegant') {
      css += `
    h1 {
      position: relative;
      margin-bottom: 0.5rem;
    }
    h1::after {
      content: '';
      display: block;
      width: 60px;
      height: 2px;
      background: var(--color-accent);
      margin-top: 1rem;
      margin-bottom: 1rem;
    }`
    }

    // Section divider decoration placeholder class
    if (decorations.sectionDividers) {
      css += `
    .section-divider {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 2.5rem 0;
      opacity: 0.6;
    }
    .section-divider svg {
      max-width: 200px;
      height: auto;
    }`
    }

    return css
  }

  /**
   * Generate complete self-contained HTML from design tokens and content
   * @param {Object} tokens - Design tokens from useDesignGenerator
   * @param {Object} content - Content object with title, text, images, sections
   * @returns {string} Complete HTML document
   */
  function renderToHtml(tokens, content, options = {}) {
    const { isPro = false } = options
    const fontsUrl = getGoogleFontsUrl(tokens)
    const cssVars = generateCssVars(tokens)
    const bodyContent = renderContent(content, tokens)
    const firstImageUrl = getFirstImageUrl(content)
    const sharedStyles = generateSharedStyles(tokens, { scope: '', forExport: false })

    // Get SVG decorations based on archetype
    const archetype = tokens.archetype || 'modern'
    const decorations = tokens.decorations || {}
    const archetypeDecorations = decorations.svgDecorations !== false ? getDecorationsForArchetype(archetype) : {}
    const decorationStyles = decorations.svgDecorations !== false ? getDecorationStyles() : ''

    // Generate decoration HTML
    let decorationHtml = ''
    // Top corners
    if (archetypeDecorations.cornerTopRight) {
      decorationHtml += archetypeDecorations.cornerTopRight
    }
    if (archetypeDecorations.cornerTopLeft) {
      decorationHtml += archetypeDecorations.cornerTopLeft
    }
    // Bottom corners
    if (archetypeDecorations.cornerBottomRight) {
      decorationHtml += archetypeDecorations.cornerBottomRight
    }
    if (archetypeDecorations.cornerBottomLeft) {
      decorationHtml += archetypeDecorations.cornerBottomLeft
    }
    // Frame decoration (wraps content)
    if (archetypeDecorations.frame) {
      decorationHtml += archetypeDecorations.frame
    }
    // Pattern overlay
    if (archetypeDecorations.pattern) {
      decorationHtml += archetypeDecorations.pattern
    }

    // Generate enhanced typography styles
    const enhancedTypographyStyles = generateEnhancedTypography(tokens)

    // Add mono font if monoAccents is enabled
    const monoFontLink = tokens.typography?.monoAccents
      ? '\n  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">'
      : ''

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta property="og:title" content="${escapeHtml(content.title || 'Untitled')}">
  ${firstImageUrl ? `<meta property="og:image" content="${escapeHtml(firstImageUrl)}">` : ''}
  <title>${escapeHtml(content.title || 'Untitled')}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontsUrl}" rel="stylesheet">${monoFontLink}
  <style>
    :root {
${cssVars}
    }
${sharedStyles}
${decorationStyles}
${enhancedTypographyStyles}

    ${tokens.effects?.animations ? `
    .animate-in {
      animation: fadeSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    @keyframes fadeSlideIn {
      from {
        opacity: 0;
        transform: translateY(24px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Staggered animation for gallery images */
    .gallery img {
      animation: fadeZoomIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    .gallery img:nth-child(1) { animation-delay: 0.1s; }
    .gallery img:nth-child(2) { animation-delay: 0.15s; }
    .gallery img:nth-child(3) { animation-delay: 0.2s; }
    .gallery img:nth-child(4) { animation-delay: 0.25s; }

    @keyframes fadeZoomIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    ` : ''}

    /* Mobile gallery - single column */
    @media (max-width: 480px) {
      .gallery {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }
      .gallery.layout-featured-grid {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
      }
      .gallery.layout-featured-grid img:first-child {
        grid-row: auto;
      }
      h2 {
        margin-bottom: 1.5rem;
      }
      .content {
        margin-bottom: 1.5rem;
      }
    }

    /* Comprehensive print styles for A4 output */
    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }

      html, body {
        width: 210mm;
        min-height: 297mm;
        margin: 0;
        padding: 0;
        background: white !important;
      }

      body {
        display: block;
        padding: 0 !important;
      }

      /* Page container - optimized for A4 */
      .page {
        width: 100%;
        max-width: none !important;
        min-height: calc(297mm - 40mm);
        margin: 0;
        padding: 20mm 15mm !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        page-break-inside: avoid;
        background: var(--color-surface) !important;
      }

      /* Typography adjustments for print */
      h1 {
        font-size: 28pt !important;
        line-height: 1.1 !important;
        margin-bottom: 8mm !important;
        page-break-after: avoid;
        white-space: normal !important;
      }

      h2 {
        font-size: 14pt !important;
        margin-bottom: 6mm !important;
        page-break-after: avoid;
      }

      .content {
        font-size: 11pt !important;
        line-height: 1.6 !important;
        orphans: 3;
        widows: 3;
      }

      .content p {
        margin-bottom: 4mm !important;
        page-break-inside: avoid;
      }

      /* Gallery - optimize for print layout */
      .gallery {
        page-break-inside: avoid;
        margin-bottom: 8mm !important;
        overflow: hidden !important;
      }

      .gallery img {
        max-height: 60mm;
        object-fit: cover;
        page-break-inside: avoid;
      }

      /* Boost decoration opacity for print visibility */
      .decoration-corner svg *,
      .decoration-corner-tl svg *,
      .decoration-divider svg *,
      .decoration-accent svg *,
      .decoration-corner,
      .decoration-corner-tl {
        opacity: 1 !important;
      }
      .decoration-corner [opacity],
      .decoration-corner-tl [opacity] {
        opacity: 0.35 !important;
      }

      /* Disable animations */
      .animate-in {
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
      }

      /* SVG decorations - ensure they print */
      .decoration-corner,
      .decoration-corner-tl,
      .decoration-divider,
      .decoration-accent {
        display: block !important;
        -webkit-print-color-adjust: exact !important;
      }

      /* Watermark positioning for print */
      .watermark {
        position: absolute;
        bottom: 10mm;
        right: 15mm;
        font-size: 9pt;
        opacity: 0.5 !important;
      }

      /* Drop cap adjustment for print */
      .content p:first-of-type::first-letter {
        font-size: 32pt !important;
      }

      /* Page breaks */
      .page-break-before {
        page-break-before: always;
      }

      .page-break-after {
        page-break-after: always;
      }
    }

    @page {
      size: A4 portrait;
      margin: 0;
    }
  </style>
</head>
<body>
  <article class="page">
${decorationHtml}
${bodyContent}
${!isPro ? `    <div class="watermark">
      <a href="https://sizzle.love">sizzle.love</a>
    </div>` : ''}
  </article>
  <script>
    (function() {
      const h1 = document.querySelector('h1');
      if (!h1) return;
      const page = document.querySelector('.page');
      if (!page) return;

      function fitTitle() {
        // Less padding on mobile (< 640px)
        const isMobile = window.innerWidth < 640;
        const padding = isMobile ? 40 : 64;
        const maxWidth = page.clientWidth - padding;
        const startSize = isMobile ? 36 : 56;
        const minSize = isMobile ? 18 : 16;

        let fontSize = startSize;
        h1.style.fontSize = fontSize + 'px';

        while (h1.scrollWidth > maxWidth && fontSize > minSize) {
          fontSize -= 2;
          h1.style.fontSize = fontSize + 'px';
        }
      }

      fitTitle();
      window.addEventListener('resize', fitTitle);
    })();
  </script>
</body>
</html>`
  }

  /**
   * Generate gradient CSS from gradient token
   */
  function generateGradientCss(gradient) {
    if (!gradient || !gradient.enabled || !gradient.stops || gradient.stops.length === 0) {
      return null
    }

    const { type = 'linear', angle = 145, stops } = gradient

    // Format stops - ensure they have position values
    const formattedStops = stops.map((stop, i) => {
      // If stop already has position (e.g., "#ff6b6b 0%"), use as-is
      if (stop.includes('%') || stop.includes('px')) {
        return stop
      }
      // Otherwise, distribute evenly
      const position = Math.round((i / (stops.length - 1)) * 100)
      return `${stop} ${position}%`
    }).join(', ')

    if (type === 'radial') {
      return `radial-gradient(ellipse at center, ${formattedStops})`
    }
    return `linear-gradient(${angle}deg, ${formattedStops})`
  }

  /**
   * Convert hex color to RGB string (e.g., "#ff6b6b" -> "255, 107, 107")
   */
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return '128, 128, 128'
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
  }

  /**
   * Generate CSS custom properties from design tokens
   */
  function generateCssVars(tokens) {
    const densitySpacing = {
      compact: '1rem',
      normal: '1.5rem',
      spacious: '2.5rem'
    }[tokens.layout?.density || 'normal']

    const radiusValue = {
      none: '0',
      subtle: '4px',
      medium: '8px',
      full: '16px'
    }[tokens.effects?.rounded || 'medium']

    // Check for gradient background
    const gradientCss = generateGradientCss(tokens.gradient)
    const backgroundValue = gradientCss || tokens.colors.background

    // Compute RGB version of accent for rgba() usage
    const accentRgb = hexToRgb(tokens.colors.accent)

    return `      --color-primary: ${tokens.colors.primary};
      --color-secondary: ${tokens.colors.secondary};
      --color-accent: ${tokens.colors.accent};
      --color-accent-rgb: ${accentRgb};
      --color-background: ${backgroundValue};
      --color-background-fallback: ${tokens.colors.background};
      --color-surface: ${tokens.colors.surface};
      --font-heading: '${tokens.typography.headingFont}', serif;
      --font-body: '${tokens.typography.bodyFont}', sans-serif;
      --spacing: ${densitySpacing};
      --radius: ${radiusValue};`
  }

  /**
   * Render content (title, subtitle, metadata, sections) to HTML
   */
  function renderContent(content, tokens) {
    const animate = tokens.effects?.animations
    let html = ''
    let animDelay = 0

    // Title
    if (content.title) {
      html += `    <h1 class="${animate ? 'animate-in' : ''}"${animate ? ` style="animation-delay: ${animDelay}s"` : ''}>${escapeHtml(content.title)}</h1>\n`
      animDelay += 0.1
    }

    // Subtitle
    if (content.subtitle) {
      html += `    <h2 class="${animate ? 'animate-in' : ''}"${animate ? ` style="animation-delay: ${animDelay}s"` : ''}>${escapeHtml(content.subtitle)}</h2>\n`
      animDelay += 0.1
    }

    // Metadata
    if (content.metadata && Object.keys(content.metadata).length > 0) {
      html += `    <div class="metadata ${animate ? 'animate-in' : ''}"${animate ? ` style="animation-delay: ${animDelay}s"` : ''}>\n`
      const { client, date, role, tags } = content.metadata
      if (client) html += `      <span class="metadata-item"><span class="metadata-label">Client:</span> ${escapeHtml(client)}</span>\n`
      if (date) html += `      <span class="metadata-item"><span class="metadata-label">Date:</span> ${escapeHtml(date)}</span>\n`
      if (role) html += `      <span class="metadata-item"><span class="metadata-label">Role:</span> ${escapeHtml(role)}</span>\n`
      if (tags && tags.length) html += `      <span class="metadata-item">${tags.map(t => escapeHtml(t)).join(' · ')}</span>\n`
      html += `    </div>\n`
      animDelay += 0.1
    }

    // Sections (new content model) or legacy text/images
    if (content.sections && content.sections.length > 0) {
      for (const section of content.sections) {
        if (section.type === 'text' && section.content) {
          html += `    <div class="content ${animate ? 'animate-in' : ''}"${animate ? ` style="animation-delay: ${animDelay}s"` : ''}>\n`
          html += `      ${formatText(section.content)}\n`
          html += `    </div>\n`
          animDelay += 0.1
        } else if (section.type === 'images' && section.items?.length > 0) {
          const layout = section.layout || 'grid'
          html += `    <div class="gallery layout-${layout} ${animate ? 'animate-in' : ''}"${animate ? ` style="animation-delay: ${animDelay}s"` : ''}>\n`
          for (const img of section.items) {
            const src = typeof img === 'string' ? img : img.src || img.url
            const alt = typeof img === 'string' ? '' : img.alt || ''
            html += `      <img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy">\n`
          }
          html += `    </div>\n`
          animDelay += 0.1
        }
      }
    } else {
      // Legacy: single text block
      if (content.text) {
        html += `    <div class="content ${animate ? 'animate-in' : ''}"${animate ? ` style="animation-delay: ${animDelay}s"` : ''}>\n`
        html += `      ${formatText(content.text)}\n`
        html += `    </div>\n`
        animDelay += 0.1
      }

      // Legacy: single images array
      if (content.images && content.images.length > 0) {
        html += `    <div class="gallery ${animate ? 'animate-in' : ''}"${animate ? ` style="animation-delay: ${animDelay}s"` : ''}>\n`
        for (const img of content.images) {
          const src = typeof img === 'string' ? img : img.src || img.url
          const alt = typeof img === 'string' ? '' : img.alt || ''
          html += `      <img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy">\n`
        }
        html += `    </div>\n`
      }
    }

    return html
  }

  /**
   * Format plain text to HTML (enhanced markdown support)
   */
  function formatText(text) {
    if (!text) return ''

    // Escape HTML first
    let html = escapeHtml(text)

    // Convert markdown-like syntax
    // Bold: **text** or __text__
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>')

    // Italic: *text* or _text_
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
    html = html.replace(/_(.+?)_/g, '<em>$1</em>')

    // Inline code: `code`
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

    // Process blocks (blockquotes, paragraphs)
    const lines = html.split('\n')
    const blocks = []
    let currentBlock = []
    let inBlockquote = false

    for (const line of lines) {
      const isQuoteLine = line.startsWith('&gt; ')

      if (isQuoteLine && !inBlockquote) {
        // Flush current paragraph block
        if (currentBlock.length > 0) {
          blocks.push({ type: 'p', content: currentBlock.join('<br>') })
          currentBlock = []
        }
        inBlockquote = true
        currentBlock.push(line.slice(5)) // Remove "&gt; " prefix
      } else if (isQuoteLine && inBlockquote) {
        currentBlock.push(line.slice(5))
      } else if (!isQuoteLine && inBlockquote) {
        // End blockquote
        blocks.push({ type: 'blockquote', content: currentBlock.join('<br>') })
        currentBlock = []
        inBlockquote = false
        if (line.trim()) currentBlock.push(line)
      } else if (line.trim() === '') {
        // Empty line - flush current block
        if (currentBlock.length > 0) {
          blocks.push({ type: inBlockquote ? 'blockquote' : 'p', content: currentBlock.join('<br>') })
          currentBlock = []
        }
        inBlockquote = false
      } else {
        currentBlock.push(line)
      }
    }

    // Flush remaining content
    if (currentBlock.length > 0) {
      blocks.push({ type: inBlockquote ? 'blockquote' : 'p', content: currentBlock.join('<br>') })
    }

    // Render blocks
    return blocks.map(block => {
      if (block.type === 'blockquote') {
        return `<blockquote>${block.content}</blockquote>`
      }
      return `<p>${block.content}</p>`
    }).join('\n      ')
  }

  /**
   * Get first image URL for OG meta tag
   */
  function getFirstImageUrl(content) {
    if (content.sections) {
      for (const section of content.sections) {
        if (section.type === 'images' && section.items?.length > 0) {
          const img = section.items[0]
          return typeof img === 'string' ? img : img.src || img.url
        }
      }
    }
    if (content.images && content.images.length > 0) {
      const img = content.images[0]
      return typeof img === 'string' ? img : img.src || img.url
    }
    return null
  }

  /**
   * Escape HTML special characters
   */
  function escapeHtml(str) {
    if (!str) return ''
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  return {
    renderToHtml,
    formatText,
    escapeHtml
  }
}
