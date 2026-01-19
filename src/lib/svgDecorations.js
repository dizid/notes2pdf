/**
 * SVG Decorations Library
 * Provides decorative graphics for each style archetype
 * These add visual polish to designs - corner decorations, dividers, patterns
 *
 * V2: Enhanced with title underlines, pull quotes, patterns, and premium decorations
 */

export const SVG_DECORATIONS = {
  minimal: {
    // Minimal has intentionally sparse decorations - clean and subtle
    cornerTopRight: null,
    cornerTopLeft: null,
    divider: `<svg class="decoration-divider" viewBox="0 0 200 2" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="60" y1="1" x2="140" y2="1" stroke="var(--color-accent)" stroke-width="1" opacity="0.2"/>
    </svg>`,
    accent: null,
    titleUnderline: `<svg class="decoration-title-underline" viewBox="0 0 120 4" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="2" x2="120" y2="2" stroke="var(--color-accent)" stroke-width="1" opacity="0.3"/>
    </svg>`,
    pullQuote: null,
    pattern: null
  },

  bold: {
    cornerTopRight: `<svg class="decoration-corner" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="140" cy="40" r="100" fill="var(--color-accent)" opacity="0.12"/>
      <circle cx="160" cy="20" r="55" fill="var(--color-accent)" opacity="0.1"/>
      <circle cx="100" cy="80" r="35" fill="var(--color-primary)" opacity="0.06"/>
      <circle cx="170" cy="90" r="20" fill="var(--color-accent)" opacity="0.15"/>
    </svg>`,
    cornerBottomLeft: `<svg class="decoration-corner-bl" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="100" r="60" fill="var(--color-accent)" opacity="0.08"/>
      <circle cx="0" cy="120" r="35" fill="var(--color-accent)" opacity="0.06"/>
    </svg>`,
    accent: `<svg class="decoration-accent" viewBox="0 0 200 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="1" width="80" height="8" rx="4" fill="var(--color-accent)"/>
      <rect x="90" y="3" width="40" height="4" rx="2" fill="var(--color-accent)" opacity="0.5"/>
      <rect x="140" y="4" width="20" height="2" rx="1" fill="var(--color-accent)" opacity="0.3"/>
    </svg>`,
    divider: `<svg class="decoration-divider" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="200" height="8" rx="4" fill="var(--color-accent)" opacity="0.15"/>
      <rect x="0" y="2" width="140" height="4" rx="2" fill="var(--color-accent)" opacity="0.3"/>
    </svg>`,
    titleUnderline: `<svg class="decoration-title-underline" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="boldUnderline" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:var(--color-accent);stop-opacity:1"/>
          <stop offset="70%" style="stop-color:var(--color-accent);stop-opacity:0.5"/>
          <stop offset="100%" style="stop-color:var(--color-accent);stop-opacity:0"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="200" height="6" rx="3" fill="url(#boldUnderline)"/>
      <rect x="0" y="8" width="80" height="3" rx="1.5" fill="var(--color-accent)" opacity="0.4"/>
    </svg>`,
    pullQuote: `<svg class="decoration-pullquote" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 35 L0 20 Q0 0, 20 0 L25 0 L25 5 Q10 5, 10 20 L10 35 Z" fill="var(--color-accent)" opacity="0.3"/>
      <path d="M30 35 L30 20 Q30 0, 50 0 L55 0 L55 5 Q40 5, 40 20 L40 35 Z" fill="var(--color-accent)" opacity="0.3"/>
    </svg>`,
    sectionDivider: `<svg class="decoration-section-divider" viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="8" width="100" height="4" rx="2" fill="var(--color-accent)" opacity="0.4"/>
      <rect x="110" y="9" width="80" height="2" fill="var(--color-accent)" opacity="0.25"/>
      <rect x="200" y="8" width="100" height="4" rx="2" fill="var(--color-accent)" opacity="0.2"/>
    </svg>`,
    pattern: `<svg class="decoration-pattern" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="boldDots" patternUnits="userSpaceOnUse" width="25" height="25">
          <circle cx="12.5" cy="12.5" r="4" fill="var(--color-accent)" opacity="0.08"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#boldDots)"/>
    </svg>`
  },

  elegant: {
    cornerTopLeft: `<svg class="decoration-corner-tl" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 80 Q0 0, 80 0" stroke="var(--color-accent)" stroke-width="1.5" fill="none" opacity="0.3"/>
      <path d="M0 55 Q0 0, 55 0" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.2"/>
      <path d="M0 30 Q0 0, 30 0" stroke="var(--color-accent)" stroke-width="0.75" fill="none" opacity="0.15"/>
      <circle cx="70" cy="70" r="5" fill="var(--color-accent)" opacity="0.35"/>
      <circle cx="70" cy="70" r="10" stroke="var(--color-accent)" stroke-width="0.5" fill="none" opacity="0.2"/>
    </svg>`,
    cornerTopRight: `<svg class="decoration-corner" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M140 80 Q140 0, 60 0" stroke="var(--color-accent)" stroke-width="1.5" fill="none" opacity="0.3"/>
      <path d="M140 55 Q140 0, 85 0" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.2"/>
      <path d="M140 30 Q140 0, 110 0" stroke="var(--color-accent)" stroke-width="0.75" fill="none" opacity="0.15"/>
    </svg>`,
    cornerBottomRight: `<svg class="decoration-corner-br" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 20 Q100 100, 20 100" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.2"/>
      <path d="M100 45 Q100 100, 45 100" stroke="var(--color-accent)" stroke-width="0.75" fill="none" opacity="0.15"/>
    </svg>`,
    divider: `<svg class="decoration-divider" viewBox="0 0 200 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 12 Q50 4, 100 12 Q150 20, 200 12" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.3"/>
      <circle cx="100" cy="12" r="4" fill="var(--color-accent)" opacity="0.4"/>
      <circle cx="100" cy="12" r="8" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.2"/>
    </svg>`,
    flourish: `<svg class="decoration-flourish" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 25 Q40 8, 80 25 Q120 42, 150 25" stroke="var(--color-accent)" stroke-width="1.5" fill="none" opacity="0.4"/>
      <path d="M30 25 Q55 15, 80 25 Q105 35, 130 25" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.25"/>
      <circle cx="80" cy="25" r="4" fill="var(--color-accent)" opacity="0.5"/>
      <circle cx="40" cy="25" r="2" fill="var(--color-accent)" opacity="0.3"/>
      <circle cx="120" cy="25" r="2" fill="var(--color-accent)" opacity="0.3"/>
    </svg>`,
    titleUnderline: `<svg class="decoration-title-underline" viewBox="0 0 200 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 8 Q50 2, 100 8 Q150 14, 200 8" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.4"/>
      <circle cx="100" cy="8" r="3" fill="var(--color-accent)" opacity="0.5"/>
    </svg>`,
    pullQuote: `<svg class="decoration-pullquote" viewBox="0 0 50 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 40 Q5 15, 20 5" stroke="var(--color-accent)" stroke-width="2" fill="none" opacity="0.4"/>
      <path d="M25 40 Q25 15, 40 5" stroke="var(--color-accent)" stroke-width="2" fill="none" opacity="0.4"/>
      <circle cx="20" cy="5" r="3" fill="var(--color-accent)" opacity="0.3"/>
      <circle cx="40" cy="5" r="3" fill="var(--color-accent)" opacity="0.3"/>
    </svg>`,
    sectionDivider: `<svg class="decoration-section-divider" viewBox="0 0 300 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="elegantDividerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:var(--color-accent);stop-opacity:0"/>
          <stop offset="50%" style="stop-color:var(--color-accent);stop-opacity:0.4"/>
          <stop offset="100%" style="stop-color:var(--color-accent);stop-opacity:0"/>
        </linearGradient>
      </defs>
      <line x1="0" y1="15" x2="300" y2="15" stroke="url(#elegantDividerGrad)" stroke-width="1"/>
      <circle cx="150" cy="15" r="5" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.3"/>
      <circle cx="150" cy="15" r="2" fill="var(--color-accent)" opacity="0.4"/>
      <circle cx="120" cy="15" r="1.5" fill="var(--color-accent)" opacity="0.2"/>
      <circle cx="180" cy="15" r="1.5" fill="var(--color-accent)" opacity="0.2"/>
    </svg>`,
    dropCapFrame: `<svg class="decoration-dropcap-frame" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 0 L0 0 L0 5" stroke="var(--color-accent)" stroke-width="1.5" fill="none" opacity="0.4"/>
      <path d="M55 0 L60 0 L60 5" stroke="var(--color-accent)" stroke-width="1.5" fill="none" opacity="0.4"/>
      <path d="M5 60 L0 60 L0 55" stroke="var(--color-accent)" stroke-width="1.5" fill="none" opacity="0.4"/>
      <path d="M55 60 L60 60 L60 55" stroke="var(--color-accent)" stroke-width="1.5" fill="none" opacity="0.4"/>
    </svg>`,
    pattern: null
  },

  playful: {
    cornerTopRight: `<svg class="decoration-corner" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="140" cy="40" r="65" fill="var(--color-accent)" opacity="0.15"/>
      <circle cx="110" cy="70" r="35" fill="var(--color-primary)" opacity="0.1"/>
      <circle cx="160" cy="80" r="25" fill="var(--color-accent)" opacity="0.2"/>
      <circle cx="85" cy="35" r="15" fill="var(--color-accent)" opacity="0.12"/>
      <circle cx="170" cy="30" r="10" fill="var(--color-primary)" opacity="0.15"/>
      <circle cx="130" cy="100" r="8" fill="var(--color-accent)" opacity="0.18"/>
    </svg>`,
    cornerBottomLeft: `<svg class="decoration-corner-bl" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="90" r="45" fill="var(--color-accent)" opacity="0.1"/>
      <circle cx="10" cy="110" r="25" fill="var(--color-accent)" opacity="0.08"/>
      <circle cx="60" cy="100" r="12" fill="var(--color-primary)" opacity="0.06"/>
    </svg>`,
    divider: `<svg class="decoration-divider" viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="10" r="6" fill="var(--color-accent)" opacity="0.4"/>
      <circle cx="50" cy="10" r="4" fill="var(--color-accent)" opacity="0.3"/>
      <circle cx="75" cy="10" r="5" fill="var(--color-primary)" opacity="0.25"/>
      <circle cx="100" cy="10" r="6" fill="var(--color-accent)" opacity="0.35"/>
      <circle cx="125" cy="10" r="4" fill="var(--color-accent)" opacity="0.25"/>
      <circle cx="150" cy="10" r="5" fill="var(--color-primary)" opacity="0.2"/>
      <circle cx="180" cy="10" r="6" fill="var(--color-accent)" opacity="0.15"/>
    </svg>`,
    wave: `<svg class="decoration-wave" viewBox="0 0 200 30" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 15 Q25 5, 50 15 T100 15 T150 15 T200 15" stroke="var(--color-accent)" stroke-width="3" fill="none" opacity="0.25" stroke-linecap="round"/>
    </svg>`,
    titleUnderline: `<svg class="decoration-title-underline" viewBox="0 0 180 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 10 Q45 2, 90 10 Q135 18, 180 10" stroke="var(--color-accent)" stroke-width="4" fill="none" opacity="0.35" stroke-linecap="round"/>
      <circle cx="0" cy="10" r="4" fill="var(--color-accent)" opacity="0.4"/>
      <circle cx="180" cy="10" r="4" fill="var(--color-accent)" opacity="0.4"/>
    </svg>`,
    pullQuote: `<svg class="decoration-pullquote" viewBox="0 0 70 55" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="15" r="12" fill="var(--color-accent)" opacity="0.25"/>
      <circle cx="15" cy="40" r="8" fill="var(--color-accent)" opacity="0.2"/>
      <circle cx="50" cy="15" r="12" fill="var(--color-accent)" opacity="0.25"/>
      <circle cx="50" cy="40" r="8" fill="var(--color-accent)" opacity="0.2"/>
    </svg>`,
    sectionDivider: `<svg class="decoration-section-divider" viewBox="0 0 300 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="12" r="8" fill="var(--color-accent)" opacity="0.3"/>
      <circle cx="100" cy="12" r="5" fill="var(--color-primary)" opacity="0.2"/>
      <circle cx="150" cy="12" r="10" fill="var(--color-accent)" opacity="0.25"/>
      <circle cx="200" cy="12" r="5" fill="var(--color-primary)" opacity="0.2"/>
      <circle cx="250" cy="12" r="8" fill="var(--color-accent)" opacity="0.3"/>
    </svg>`,
    confetti: `<svg class="decoration-confetti" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="20" r="4" fill="var(--color-accent)" opacity="0.3"/>
      <circle cx="45" cy="10" r="3" fill="var(--color-primary)" opacity="0.25"/>
      <circle cx="75" cy="25" r="5" fill="var(--color-accent)" opacity="0.2"/>
      <circle cx="85" cy="60" r="4" fill="var(--color-primary)" opacity="0.25"/>
      <circle cx="25" cy="80" r="5" fill="var(--color-accent)" opacity="0.2"/>
      <circle cx="60" cy="75" r="3" fill="var(--color-accent)" opacity="0.3"/>
      <rect x="30" y="40" width="6" height="6" rx="1" fill="var(--color-accent)" opacity="0.2" transform="rotate(15 33 43)"/>
      <rect x="70" y="45" width="5" height="5" rx="1" fill="var(--color-primary)" opacity="0.15" transform="rotate(-20 72 47)"/>
    </svg>`,
    pattern: `<svg class="decoration-pattern" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="playfulBubbles" patternUnits="userSpaceOnUse" width="30" height="30">
          <circle cx="15" cy="15" r="8" fill="var(--color-accent)" opacity="0.06"/>
          <circle cx="5" cy="5" r="3" fill="var(--color-accent)" opacity="0.04"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#playfulBubbles)"/>
    </svg>`
  },

  tech: {
    cornerTopRight: `<svg class="decoration-corner" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="90" y="0" width="70" height="2" fill="var(--color-accent)" opacity="0.5"/>
      <rect x="158" y="0" width="2" height="70" fill="var(--color-accent)" opacity="0.5"/>
      <rect x="110" y="20" width="30" height="30" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.3"/>
      <rect x="120" y="30" width="10" height="10" fill="var(--color-accent)" opacity="0.4"/>
      <rect x="70" y="50" width="20" height="20" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.2"/>
      <rect x="76" y="56" width="8" height="8" fill="var(--color-accent)" opacity="0.15"/>
      <line x1="60" y1="0" x2="60" y2="40" stroke="var(--color-accent)" stroke-width="1" opacity="0.15"/>
      <line x1="50" y1="80" x2="90" y2="80" stroke="var(--color-accent)" stroke-width="1" opacity="0.1"/>
    </svg>`,
    cornerTopLeft: `<svg class="decoration-corner-tl" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="2" height="50" fill="var(--color-accent)" opacity="0.4"/>
      <rect x="0" y="0" width="50" height="2" fill="var(--color-accent)" opacity="0.4"/>
      <rect x="15" y="15" width="18" height="18" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.2"/>
    </svg>`,
    divider: `<svg class="decoration-divider" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="6" x2="60" y2="6" stroke="var(--color-accent)" stroke-width="1" opacity="0.3"/>
      <rect x="62" y="3" width="6" height="6" fill="var(--color-accent)" opacity="0.4"/>
      <line x1="70" y1="6" x2="130" y2="6" stroke="var(--color-accent)" stroke-width="1" opacity="0.3"/>
      <rect x="132" y="3" width="6" height="6" fill="var(--color-accent)" opacity="0.4"/>
      <line x1="140" y1="6" x2="200" y2="6" stroke="var(--color-accent)" stroke-width="1" opacity="0.3"/>
    </svg>`,
    titleUnderline: `<svg class="decoration-title-underline" viewBox="0 0 200 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="120" height="3" fill="var(--color-accent)" opacity="0.5"/>
      <rect x="125" y="1" width="40" height="1" fill="var(--color-accent)" opacity="0.3"/>
      <rect x="170" y="0" width="3" height="3" fill="var(--color-accent)" opacity="0.4"/>
    </svg>`,
    pullQuote: `<svg class="decoration-pullquote" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="3" height="50" fill="var(--color-accent)" opacity="0.4"/>
      <rect x="8" y="5" width="15" height="15" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.25"/>
      <rect x="28" y="5" width="15" height="15" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.25"/>
    </svg>`,
    sectionDivider: `<svg class="decoration-section-divider" viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="10" x2="90" y2="10" stroke="var(--color-accent)" stroke-width="1" opacity="0.25"/>
      <rect x="95" y="5" width="10" height="10" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.3"/>
      <rect x="98" y="8" width="4" height="4" fill="var(--color-accent)" opacity="0.4"/>
      <line x1="110" y1="10" x2="190" y2="10" stroke="var(--color-accent)" stroke-width="1" opacity="0.25"/>
      <rect x="195" y="5" width="10" height="10" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.3"/>
      <rect x="198" y="8" width="4" height="4" fill="var(--color-accent)" opacity="0.4"/>
      <line x1="210" y1="10" x2="300" y2="10" stroke="var(--color-accent)" stroke-width="1" opacity="0.25"/>
    </svg>`,
    grid: `<svg class="decoration-grid" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="techGrid" patternUnits="userSpaceOnUse" width="20" height="20">
          <rect width="20" height="20" fill="none" stroke="var(--color-accent)" stroke-width="0.5" opacity="0.1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#techGrid)"/>
    </svg>`,
    circuit: `<svg class="decoration-circuit" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 30 L30 30 L30 10 L60 10 L60 30 L90 30 L90 50 L120 50" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.2"/>
      <circle cx="30" cy="30" r="3" fill="var(--color-accent)" opacity="0.3"/>
      <circle cx="60" cy="10" r="3" fill="var(--color-accent)" opacity="0.3"/>
      <circle cx="90" cy="30" r="3" fill="var(--color-accent)" opacity="0.3"/>
    </svg>`,
    pattern: `<svg class="decoration-pattern" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="techDots" patternUnits="userSpaceOnUse" width="15" height="15">
          <circle cx="7.5" cy="7.5" r="1" fill="var(--color-accent)" opacity="0.15"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#techDots)"/>
    </svg>`
  },

  organic: {
    cornerTopLeft: `<svg class="decoration-corner-tl" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0 C35 60, 60 95, 0 140" stroke="var(--color-accent)" stroke-width="2" fill="none" opacity="0.2"/>
      <path d="M0 0 C60 35, 95 60, 140 0" stroke="var(--color-accent)" stroke-width="2" fill="none" opacity="0.15"/>
      <ellipse cx="45" cy="45" rx="18" ry="24" fill="var(--color-accent)" opacity="0.08" transform="rotate(-30 45 45)"/>
      <ellipse cx="25" cy="70" rx="10" ry="14" fill="var(--color-accent)" opacity="0.06" transform="rotate(-45 25 70)"/>
    </svg>`,
    cornerBottomRight: `<svg class="decoration-corner-br" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 100 C70 50, 50 30, 100 0" stroke="var(--color-accent)" stroke-width="1.5" fill="none" opacity="0.15"/>
      <ellipse cx="75" cy="75" rx="12" ry="16" fill="var(--color-accent)" opacity="0.06" transform="rotate(30 75 75)"/>
    </svg>`,
    divider: `<svg class="decoration-divider" viewBox="0 0 200 30" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 15 Q40 5, 80 18 Q120 28, 160 12 Q180 8, 200 15" stroke="var(--color-accent)" stroke-width="1.5" fill="none" opacity="0.25"/>
    </svg>`,
    titleUnderline: `<svg class="decoration-title-underline" viewBox="0 0 180 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 10 Q30 4, 60 12 Q90 18, 120 8 Q150 2, 180 10" stroke="var(--color-accent)" stroke-width="2" fill="none" opacity="0.3"/>
    </svg>`,
    pullQuote: `<svg class="decoration-pullquote" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 50 Q10 20, 25 10" stroke="var(--color-accent)" stroke-width="3" fill="none" opacity="0.25" stroke-linecap="round"/>
      <path d="M35 50 Q35 20, 50 10" stroke="var(--color-accent)" stroke-width="3" fill="none" opacity="0.25" stroke-linecap="round"/>
      <ellipse cx="25" cy="10" rx="5" ry="6" fill="var(--color-accent)" opacity="0.2"/>
      <ellipse cx="50" cy="10" rx="5" ry="6" fill="var(--color-accent)" opacity="0.2"/>
    </svg>`,
    sectionDivider: `<svg class="decoration-section-divider" viewBox="0 0 300 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 20 Q50 8, 100 22 Q150 36, 200 18 Q250 4, 300 20" stroke="var(--color-accent)" stroke-width="1.5" fill="none" opacity="0.2"/>
      <ellipse cx="150" cy="20" rx="8" ry="10" fill="var(--color-accent)" opacity="0.15"/>
    </svg>`,
    leaf: `<svg class="decoration-leaf" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 5 Q55 35, 30 75 Q5 35, 30 5" stroke="var(--color-accent)" stroke-width="1" fill="var(--color-accent)" fill-opacity="0.1"/>
      <path d="M30 15 L30 65" stroke="var(--color-accent)" stroke-width="1" opacity="0.3"/>
      <path d="M30 25 Q40 30, 45 40" stroke="var(--color-accent)" stroke-width="0.75" fill="none" opacity="0.2"/>
      <path d="M30 35 Q20 40, 15 50" stroke="var(--color-accent)" stroke-width="0.75" fill="none" opacity="0.2"/>
      <path d="M30 45 Q38 48, 42 55" stroke="var(--color-accent)" stroke-width="0.75" fill="none" opacity="0.2"/>
    </svg>`,
    branch: `<svg class="decoration-branch" viewBox="0 0 150 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 40 Q40 30, 75 40 Q110 50, 150 35" stroke="var(--color-accent)" stroke-width="2" fill="none" opacity="0.2"/>
      <ellipse cx="35" cy="32" rx="8" ry="10" fill="var(--color-accent)" opacity="0.1" transform="rotate(-20 35 32)"/>
      <ellipse cx="75" cy="42" rx="10" ry="12" fill="var(--color-accent)" opacity="0.12" transform="rotate(10 75 42)"/>
      <ellipse cx="115" cy="38" rx="8" ry="10" fill="var(--color-accent)" opacity="0.1" transform="rotate(-15 115 38)"/>
    </svg>`,
    pattern: `<svg class="decoration-pattern" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="organicLeaves" patternUnits="userSpaceOnUse" width="40" height="40">
          <ellipse cx="20" cy="20" rx="8" ry="12" fill="var(--color-accent)" opacity="0.04" transform="rotate(-30 20 20)"/>
          <ellipse cx="35" cy="35" rx="5" ry="8" fill="var(--color-accent)" opacity="0.03" transform="rotate(20 35 35)"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#organicLeaves)"/>
    </svg>`
  },

  luxury: {
    cornerTopLeft: `<svg class="decoration-corner-tl" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 35 L0 0 L35 0" stroke="var(--color-accent)" stroke-width="2" fill="none" opacity="0.6"/>
      <path d="M6 28 L6 6 L28 6" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.3"/>
      <path d="M12 21 L12 12 L21 12" stroke="var(--color-accent)" stroke-width="0.75" fill="none" opacity="0.2"/>
    </svg>`,
    cornerTopRight: `<svg class="decoration-corner" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 35 L100 0 L65 0" stroke="var(--color-accent)" stroke-width="2" fill="none" opacity="0.6"/>
      <path d="M94 28 L94 6 L72 6" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.3"/>
      <path d="M88 21 L88 12 L79 12" stroke="var(--color-accent)" stroke-width="0.75" fill="none" opacity="0.2"/>
    </svg>`,
    cornerBottomLeft: `<svg class="decoration-corner-bl" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 55 L0 80 L25 80" stroke="var(--color-accent)" stroke-width="2" fill="none" opacity="0.5"/>
      <path d="M5 60 L5 75 L20 75" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.25"/>
    </svg>`,
    cornerBottomRight: `<svg class="decoration-corner-br" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M80 55 L80 80 L55 80" stroke="var(--color-accent)" stroke-width="2" fill="none" opacity="0.5"/>
      <path d="M75 60 L75 75 L60 75" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.25"/>
    </svg>`,
    divider: `<svg class="decoration-divider" viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="luxuryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:var(--color-accent);stop-opacity:0"/>
          <stop offset="50%" style="stop-color:var(--color-accent);stop-opacity:0.6"/>
          <stop offset="100%" style="stop-color:var(--color-accent);stop-opacity:0"/>
        </linearGradient>
      </defs>
      <rect x="0" y="9" width="200" height="2" fill="url(#luxuryGrad)"/>
      <circle cx="100" cy="10" r="7" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.4"/>
      <circle cx="100" cy="10" r="3" fill="var(--color-accent)" opacity="0.5"/>
      <circle cx="70" cy="10" r="2" fill="var(--color-accent)" opacity="0.25"/>
      <circle cx="130" cy="10" r="2" fill="var(--color-accent)" opacity="0.25"/>
    </svg>`,
    titleUnderline: `<svg class="decoration-title-underline" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="luxuryTitleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:var(--color-accent);stop-opacity:0"/>
          <stop offset="20%" style="stop-color:var(--color-accent);stop-opacity:0.7"/>
          <stop offset="80%" style="stop-color:var(--color-accent);stop-opacity:0.7"/>
          <stop offset="100%" style="stop-color:var(--color-accent);stop-opacity:0"/>
        </linearGradient>
      </defs>
      <rect x="0" y="5" width="200" height="2" fill="url(#luxuryTitleGrad)"/>
    </svg>`,
    pullQuote: `<svg class="decoration-pullquote" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 5 L5 0 L0 0 L0 40 L5 40 L5 35" stroke="var(--color-accent)" stroke-width="1.5" fill="none" opacity="0.4"/>
      <circle cx="25" cy="20" r="10" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.3"/>
      <circle cx="25" cy="20" r="4" fill="var(--color-accent)" opacity="0.25"/>
      <circle cx="45" cy="20" r="10" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.3"/>
      <circle cx="45" cy="20" r="4" fill="var(--color-accent)" opacity="0.25"/>
    </svg>`,
    sectionDivider: `<svg class="decoration-section-divider" viewBox="0 0 300 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="luxurySectionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:var(--color-accent);stop-opacity:0"/>
          <stop offset="50%" style="stop-color:var(--color-accent);stop-opacity:0.5"/>
          <stop offset="100%" style="stop-color:var(--color-accent);stop-opacity:0"/>
        </linearGradient>
      </defs>
      <line x1="0" y1="12" x2="115" y2="12" stroke="url(#luxurySectionGrad)" stroke-width="1"/>
      <circle cx="150" cy="12" r="8" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.4"/>
      <circle cx="150" cy="12" r="4" stroke="var(--color-accent)" stroke-width="0.75" fill="none" opacity="0.3"/>
      <circle cx="150" cy="12" r="1.5" fill="var(--color-accent)" opacity="0.5"/>
      <line x1="185" y1="12" x2="300" y2="12" stroke="url(#luxurySectionGrad)" stroke-width="1"/>
    </svg>`,
    ornament: `<svg class="decoration-ornament" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="20" x2="30" y2="20" stroke="var(--color-accent)" stroke-width="1" opacity="0.4"/>
      <line x1="70" y1="20" x2="100" y2="20" stroke="var(--color-accent)" stroke-width="1" opacity="0.4"/>
      <circle cx="50" cy="20" r="12" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.5"/>
      <circle cx="50" cy="20" r="7" stroke="var(--color-accent)" stroke-width="0.75" fill="none" opacity="0.3"/>
      <circle cx="50" cy="20" r="3" fill="var(--color-accent)" opacity="0.4"/>
    </svg>`,
    frame: `<svg class="decoration-frame" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 15 L0 0 L15 0" stroke="var(--color-accent)" stroke-width="1.5" fill="none" opacity="0.5"/>
      <path d="M85 0 L100 0 L100 15" stroke="var(--color-accent)" stroke-width="1.5" fill="none" opacity="0.5"/>
      <path d="M100 85 L100 100 L85 100" stroke="var(--color-accent)" stroke-width="1.5" fill="none" opacity="0.5"/>
      <path d="M15 100 L0 100 L0 85" stroke="var(--color-accent)" stroke-width="1.5" fill="none" opacity="0.5"/>
    </svg>`,
    pattern: null
  },

  friendly: {
    cornerTopRight: `<svg class="decoration-corner" viewBox="0 0 170 170" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="130" cy="40" rx="80" ry="70" fill="var(--color-accent)" opacity="0.1" transform="rotate(15 130 40)"/>
      <ellipse cx="110" cy="60" rx="35" ry="30" fill="var(--color-accent)" opacity="0.08" transform="rotate(-10 110 60)"/>
      <ellipse cx="150" cy="80" rx="20" ry="18" fill="var(--color-primary)" opacity="0.06" transform="rotate(5 150 80)"/>
    </svg>`,
    cornerBottomLeft: `<svg class="decoration-corner-bl" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="90" rx="50" ry="45" fill="var(--color-accent)" opacity="0.08" transform="rotate(-15 30 90)"/>
      <ellipse cx="50" cy="100" rx="25" ry="20" fill="var(--color-accent)" opacity="0.06" transform="rotate(10 50 100)"/>
    </svg>`,
    divider: `<svg class="decoration-divider" viewBox="0 0 200 20" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 10 Q30 4, 60 10 T120 10 T180 10 L200 10" stroke="var(--color-accent)" stroke-width="2.5" fill="none" opacity="0.2" stroke-linecap="round"/>
    </svg>`,
    titleUnderline: `<svg class="decoration-title-underline" viewBox="0 0 160 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 8 Q40 2, 80 8 Q120 14, 160 8" stroke="var(--color-accent)" stroke-width="3" fill="none" opacity="0.3" stroke-linecap="round"/>
    </svg>`,
    pullQuote: `<svg class="decoration-pullquote" viewBox="0 0 70 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="20" rx="15" ry="12" fill="var(--color-accent)" opacity="0.2"/>
      <ellipse cx="50" cy="20" rx="15" ry="12" fill="var(--color-accent)" opacity="0.2"/>
      <ellipse cx="20" cy="35" rx="8" ry="6" fill="var(--color-accent)" opacity="0.15"/>
      <ellipse cx="50" cy="35" rx="8" ry="6" fill="var(--color-accent)" opacity="0.15"/>
    </svg>`,
    sectionDivider: `<svg class="decoration-section-divider" viewBox="0 0 300 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 12 Q75 4, 150 12 Q225 20, 300 12" stroke="var(--color-accent)" stroke-width="2" fill="none" opacity="0.2" stroke-linecap="round"/>
    </svg>`,
    dots: `<svg class="decoration-dots" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="6" fill="var(--color-accent)" opacity="0.35"/>
      <circle cx="30" cy="10" r="4" fill="var(--color-accent)" opacity="0.25"/>
      <circle cx="50" cy="10" r="5" fill="var(--color-accent)" opacity="0.3"/>
      <circle cx="70" cy="10" r="4" fill="var(--color-accent)" opacity="0.2"/>
      <circle cx="90" cy="10" r="6" fill="var(--color-accent)" opacity="0.15"/>
    </svg>`,
    hearts: `<svg class="decoration-hearts" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 25 C30 18, 22 15, 20 20 C18 15, 10 18, 10 25 C10 32, 20 38, 20 38 C20 38, 30 32, 30 25" fill="var(--color-accent)" opacity="0.15"/>
      <path d="M70 25 C70 18, 62 15, 60 20 C58 15, 50 18, 50 25 C50 32, 60 38, 60 38 C60 38, 70 32, 70 25" fill="var(--color-accent)" opacity="0.12"/>
      <path d="M110 25 C110 18, 102 15, 100 20 C98 15, 90 18, 90 25 C90 32, 100 38, 100 38 C100 38, 110 32, 110 25" fill="var(--color-accent)" opacity="0.1"/>
    </svg>`,
    pattern: `<svg class="decoration-pattern" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="friendlyBlobs" patternUnits="userSpaceOnUse" width="35" height="35">
          <ellipse cx="17" cy="17" rx="10" ry="8" fill="var(--color-accent)" opacity="0.05" transform="rotate(-15 17 17)"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#friendlyBlobs)"/>
    </svg>`
  },

  modern: {
    cornerTopRight: `<svg class="decoration-corner" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="90" y="0" width="50" height="50" fill="var(--color-accent)" opacity="0.1"/>
      <rect x="105" y="15" width="30" height="30" fill="var(--color-accent)" opacity="0.15"/>
      <rect x="115" y="25" width="15" height="15" fill="var(--color-accent)" opacity="0.2"/>
      <line x1="70" y1="0" x2="70" y2="60" stroke="var(--color-accent)" stroke-width="1" opacity="0.2"/>
      <line x1="50" y1="70" x2="110" y2="70" stroke="var(--color-accent)" stroke-width="1" opacity="0.15"/>
    </svg>`,
    cornerTopLeft: `<svg class="decoration-corner-tl" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="30" height="30" fill="var(--color-accent)" opacity="0.08"/>
      <rect x="10" y="10" width="15" height="15" fill="var(--color-accent)" opacity="0.12"/>
      <line x1="0" y1="45" x2="45" y2="45" stroke="var(--color-accent)" stroke-width="1" opacity="0.15"/>
    </svg>`,
    divider: `<svg class="decoration-divider" viewBox="0 0 200 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="3" width="70" height="4" rx="2" fill="var(--color-accent)" opacity="0.5"/>
      <rect x="80" y="4" width="40" height="2" rx="1" fill="var(--color-accent)" opacity="0.3"/>
      <rect x="130" y="4.5" width="20" height="1" fill="var(--color-accent)" opacity="0.2"/>
    </svg>`,
    titleUnderline: `<svg class="decoration-title-underline" viewBox="0 0 200 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="modernTitleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:var(--color-accent);stop-opacity:0.8"/>
          <stop offset="60%" style="stop-color:var(--color-accent);stop-opacity:0.4"/>
          <stop offset="100%" style="stop-color:var(--color-accent);stop-opacity:0"/>
        </linearGradient>
      </defs>
      <rect x="0" y="3" width="200" height="4" rx="2" fill="url(#modernTitleGrad)"/>
    </svg>`,
    pullQuote: `<svg class="decoration-pullquote" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="4" height="50" fill="var(--color-accent)" opacity="0.35"/>
      <rect x="10" y="5" width="15" height="15" fill="var(--color-accent)" opacity="0.15"/>
      <rect x="30" y="5" width="15" height="15" fill="var(--color-accent)" opacity="0.15"/>
    </svg>`,
    sectionDivider: `<svg class="decoration-section-divider" viewBox="0 0 300 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="6" width="90" height="4" rx="2" fill="var(--color-accent)" opacity="0.3"/>
      <rect x="100" y="7" width="100" height="2" rx="1" fill="var(--color-accent)" opacity="0.2"/>
      <rect x="210" y="6" width="90" height="4" rx="2" fill="var(--color-accent)" opacity="0.3"/>
    </svg>`,
    accent: `<svg class="decoration-accent" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="modernDots" patternUnits="userSpaceOnUse" width="16" height="16">
          <circle cx="8" cy="8" r="1.5" fill="var(--color-accent)" opacity="0.15"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#modernDots)"/>
    </svg>`,
    geometric: `<svg class="decoration-geometric" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="25" height="25" fill="var(--color-accent)" opacity="0.15"/>
      <rect x="30" y="10" width="20" height="20" fill="var(--color-accent)" opacity="0.1"/>
      <rect x="55" y="5" width="15" height="15" fill="var(--color-accent)" opacity="0.2"/>
      <rect x="75" y="15" width="25" height="25" fill="var(--color-accent)" opacity="0.12"/>
      <rect x="105" y="20" width="15" height="15" fill="var(--color-accent)" opacity="0.08"/>
    </svg>`,
    pattern: `<svg class="decoration-pattern" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="modernGrid" patternUnits="userSpaceOnUse" width="20" height="20">
          <rect x="0" y="0" width="8" height="8" fill="var(--color-accent)" opacity="0.04"/>
          <rect x="10" y="10" width="8" height="8" fill="var(--color-accent)" opacity="0.03"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#modernGrid)"/>
    </svg>`
  }
}

/**
 * Get decorations for a specific archetype
 * @param {string} archetype - The style archetype name
 * @returns {Object} Object containing SVG strings for various decoration positions
 */
export function getDecorationsForArchetype(archetype) {
  return SVG_DECORATIONS[archetype] || SVG_DECORATIONS.modern
}

/**
 * Generate CSS for positioning decorations
 * This CSS should be included when using decorations
 * V2: Enhanced with additional decoration positions and types
 */
export function getDecorationStyles() {
  return `
    /* Corner Decorations */
    .decoration-corner {
      position: absolute;
      top: 0;
      right: 0;
      width: 140px;
      height: 140px;
      pointer-events: none;
      z-index: 0;
    }

    .decoration-corner-tl {
      position: absolute;
      top: 0;
      left: 0;
      width: 120px;
      height: 120px;
      pointer-events: none;
      z-index: 0;
    }

    .decoration-corner-bl {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100px;
      height: 100px;
      pointer-events: none;
      z-index: 0;
    }

    .decoration-corner-br {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 100px;
      height: 100px;
      pointer-events: none;
      z-index: 0;
    }

    /* Dividers */
    .decoration-divider {
      width: 100%;
      height: 24px;
      margin: 1.5rem 0;
      display: block;
    }

    .decoration-section-divider {
      width: 100%;
      height: 30px;
      margin: 2.5rem 0;
      display: block;
    }

    /* Title Elements */
    .decoration-title-underline {
      width: 200px;
      max-width: 80%;
      height: 16px;
      margin-top: 0.5rem;
      display: block;
    }

    .decoration-accent {
      width: 200px;
      height: 10px;
      margin-top: 0.75rem;
      display: block;
    }

    /* Pull Quotes */
    .decoration-pullquote {
      width: 50px;
      height: 45px;
      position: absolute;
      top: -10px;
      left: -10px;
      pointer-events: none;
      z-index: 0;
    }

    /* Flourishes and Ornaments */
    .decoration-flourish {
      width: 160px;
      height: 50px;
      margin: 1.5rem auto;
      display: block;
    }

    .decoration-ornament {
      width: 100px;
      height: 40px;
      margin: 1rem auto;
      display: block;
    }

    .decoration-wave {
      width: 100%;
      height: 30px;
      margin: 1.5rem 0;
      display: block;
    }

    .decoration-dots {
      width: 100px;
      height: 20px;
      margin: 1rem auto;
      display: block;
    }

    /* Nature Elements */
    .decoration-leaf {
      width: 45px;
      height: 70px;
      position: absolute;
      bottom: 2rem;
      right: 2rem;
      pointer-events: none;
      z-index: 0;
      opacity: 0.7;
    }

    .decoration-branch {
      width: 150px;
      height: 80px;
      margin: 1.5rem auto;
      display: block;
    }

    /* Special Elements */
    .decoration-hearts {
      width: 120px;
      height: 40px;
      margin: 1rem auto;
      display: block;
    }

    .decoration-confetti {
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 100px;
      pointer-events: none;
      z-index: 0;
      opacity: 0.8;
    }

    .decoration-circuit {
      width: 120px;
      height: 60px;
      margin: 1rem auto;
      display: block;
    }

    .decoration-geometric {
      width: 120px;
      height: 60px;
      margin: 1rem auto;
      display: block;
    }

    /* Frame for content */
    .decoration-frame {
      position: absolute;
      inset: 1rem;
      width: calc(100% - 2rem);
      height: calc(100% - 2rem);
      pointer-events: none;
      z-index: 0;
    }

    .decoration-dropcap-frame {
      width: 60px;
      height: 60px;
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 0;
    }

    /* Background Patterns */
    .decoration-grid,
    .decoration-pattern {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      opacity: 0.6;
    }

    /* Ensure page content is above decorations */
    .page {
      position: relative;
      overflow: hidden;
    }

    .page > *:not([class*="decoration"]) {
      position: relative;
      z-index: 1;
    }

    /* Print styles for decorations */
    @media print {
      .decoration-corner,
      .decoration-corner-tl,
      .decoration-corner-bl,
      .decoration-corner-br,
      .decoration-divider,
      .decoration-section-divider,
      .decoration-title-underline,
      .decoration-accent,
      .decoration-flourish,
      .decoration-wave,
      .decoration-dots,
      .decoration-leaf,
      .decoration-branch,
      .decoration-ornament,
      .decoration-hearts,
      .decoration-grid,
      .decoration-pattern,
      .decoration-pullquote,
      .decoration-confetti,
      .decoration-circuit,
      .decoration-geometric,
      .decoration-frame,
      .decoration-dropcap-frame {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      /* Boost decoration visibility for print */
      .decoration-corner,
      .decoration-corner-tl {
        width: 110px;
        height: 110px;
      }

      .decoration-corner-bl,
      .decoration-corner-br {
        width: 80px;
        height: 80px;
      }

      [class*="decoration-"] svg [opacity] {
        opacity: calc(var(--print-opacity, 1) * 1.3) !important;
      }
    }

    /* Tablet - moderate scaling */
    @media (max-width: 768px) {
      .decoration-corner {
        width: 110px;
        height: 110px;
      }
      .decoration-corner-tl {
        width: 90px;
        height: 90px;
      }
      .decoration-corner-bl,
      .decoration-corner-br {
        width: 70px;
        height: 70px;
      }
      .decoration-title-underline {
        width: 160px;
      }
      .decoration-flourish {
        width: 130px;
        height: 40px;
      }
    }

    /* Mobile - scale down decorations */
    @media (max-width: 640px) {
      .decoration-corner {
        width: 80px;
        height: 80px;
      }
      .decoration-corner-tl {
        width: 60px;
        height: 60px;
      }
      .decoration-corner-bl,
      .decoration-corner-br {
        width: 50px;
        height: 50px;
      }
      .decoration-section-divider {
        margin: 1.5rem 0;
      }
      .decoration-title-underline {
        width: 120px;
      }
      .decoration-flourish {
        width: 100px;
        height: 35px;
      }
      .decoration-ornament {
        width: 70px;
        height: 30px;
      }
      .decoration-leaf {
        width: 30px;
        height: 50px;
        bottom: 1rem;
        right: 1rem;
      }
      .decoration-confetti {
        width: 70px;
        height: 70px;
      }
      .decoration-frame {
        inset: 0.5rem;
        width: calc(100% - 1rem);
        height: calc(100% - 1rem);
      }
    }
  `
}
