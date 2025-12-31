import { useDesignGenerator } from './useDesignGenerator'

const { getGoogleFontsUrl } = useDesignGenerator()

/**
 * Composable for rendering design tokens + content into complete HTML
 */
export function useHtmlRenderer() {
  /**
   * Generate complete self-contained HTML from design tokens and content
   * @param {Object} tokens - Design tokens from useDesignGenerator
   * @param {Object} content - Content object with title, text, images, sections
   * @returns {string} Complete HTML document
   */
  function renderToHtml(tokens, content) {
    const fontsUrl = getGoogleFontsUrl(tokens)
    const cssVars = generateCssVars(tokens)
    const bodyContent = renderContent(content, tokens)
    const firstImageUrl = getFirstImageUrl(content)

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
  <link href="${fontsUrl}" rel="stylesheet">
  <style>
    :root {
${cssVars}
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      min-height: 100vh;
      background: var(--color-background);
      font-family: var(--font-body);
      color: var(--color-secondary);
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: var(--spacing);
      padding-top: calc(var(--spacing) * 2);
    }

    .page {
      max-width: 800px;
      width: 100%;
      background: var(--color-surface);
      border-radius: var(--radius);
      padding: calc(var(--spacing) * 2);
      ${tokens.effects?.shadows ? 'box-shadow: 0 4px 24px rgba(0,0,0,0.08);' : ''}
    }

    h1 {
      font-family: var(--font-heading);
      color: var(--color-primary);
      font-size: clamp(2rem, 5vw, 3.5rem);
      line-height: 1.1;
      margin-bottom: 1.5rem;
    }

    h2 {
      font-family: var(--font-heading);
      color: var(--color-secondary);
      font-size: clamp(1rem, 2vw, 1.25rem);
      font-weight: 400;
      margin-bottom: 2rem;
    }

    .metadata {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2rem;
      font-size: 0.875rem;
      color: var(--color-secondary);
      opacity: 0.8;
    }

    .metadata-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .metadata-label {
      font-weight: 500;
    }

    .content {
      font-size: 1.125rem;
      line-height: 1.7;
      margin-bottom: 2rem;
    }

    .content p {
      margin-bottom: 1rem;
    }

    .content strong {
      font-weight: 600;
      color: var(--color-primary);
    }

    .content ul, .content ol {
      margin-left: 1.5rem;
      margin-bottom: 1rem;
    }

    .content li {
      margin-bottom: 0.5rem;
    }

    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .gallery.layout-featured {
      grid-template-columns: 1fr;
    }

    .gallery.layout-featured-grid {
      grid-template-columns: 2fr 1fr;
      grid-template-rows: 1fr 1fr;
    }

    .gallery.layout-featured-grid img:first-child {
      grid-row: span 2;
    }

    .gallery.layout-side-by-side {
      grid-template-columns: 1fr 1fr;
    }

    .gallery img {
      width: 100%;
      border-radius: calc(var(--radius) / 2);
      aspect-ratio: 4/3;
      object-fit: cover;
    }

    .gallery.layout-featured img {
      aspect-ratio: 16/9;
    }

    a {
      color: var(--color-accent);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    ${tokens.effects?.animations ? `
    .animate-in {
      animation: fadeIn 0.6s ease-out both;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    ` : ''}

    footer {
      margin-top: 3rem;
      text-align: center;
      font-size: 0.875rem;
      opacity: 0.5;
    }

    @media (max-width: 600px) {
      .gallery {
        grid-template-columns: 1fr;
      }
      .gallery.layout-featured-grid {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
      }
      .gallery.layout-featured-grid img:first-child {
        grid-row: auto;
      }
    }

    @media print {
      body { padding: 0; background: white; }
      .page { box-shadow: none; max-width: 100%; }
      .animate-in { animation: none; }
    }
  </style>
</head>
<body>
  <article class="page">
${bodyContent}
    <footer>
      Created with <a href="https://dizid.com">dizid.com</a>
    </footer>
  </article>
</body>
</html>`
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

    return `      --color-primary: ${tokens.colors.primary};
      --color-secondary: ${tokens.colors.secondary};
      --color-accent: ${tokens.colors.accent};
      --color-background: ${tokens.colors.background};
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
   * Format plain text to HTML (basic markdown support)
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

    // Line breaks to paragraphs
    const paragraphs = html.split(/\n\n+/)
    if (paragraphs.length > 1) {
      html = paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('\n      ')
    } else {
      html = `<p>${html.replace(/\n/g, '<br>')}</p>`
    }

    return html
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
