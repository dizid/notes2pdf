/**
 * SVG Decorations Library
 * Provides decorative graphics for each style archetype
 * These add visual polish to designs - corner decorations, dividers, patterns
 */

export const SVG_DECORATIONS = {
  minimal: {
    // Minimal has no decorations - keep it clean
    cornerTopRight: null,
    cornerTopLeft: null,
    divider: null,
    accent: null
  },

  bold: {
    cornerTopRight: `<svg class="decoration-corner" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="120" cy="30" r="80" fill="var(--color-accent)" opacity="0.12"/>
      <circle cx="140" cy="10" r="45" fill="var(--color-accent)" opacity="0.08"/>
      <circle cx="90" cy="60" r="25" fill="var(--color-primary)" opacity="0.06"/>
    </svg>`,
    accent: `<svg class="decoration-accent" viewBox="0 0 200 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="1" width="80" height="8" rx="4" fill="var(--color-accent)"/>
      <rect x="90" y="3" width="40" height="4" rx="2" fill="var(--color-accent)" opacity="0.5"/>
      <rect x="140" y="4" width="20" height="2" rx="1" fill="var(--color-accent)" opacity="0.3"/>
    </svg>`,
    divider: `<svg class="decoration-divider" viewBox="0 0 200 4" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="4" rx="2" fill="var(--color-accent)" opacity="0.2"/>
    </svg>`
  },

  elegant: {
    cornerTopLeft: `<svg class="decoration-corner-tl" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 60 Q0 0, 60 0" stroke="var(--color-accent)" stroke-width="1.5" fill="none" opacity="0.3"/>
      <path d="M0 40 Q0 0, 40 0" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.2"/>
      <circle cx="60" cy="60" r="4" fill="var(--color-accent)" opacity="0.4"/>
    </svg>`,
    cornerTopRight: `<svg class="decoration-corner" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M120 60 Q120 0, 60 0" stroke="var(--color-accent)" stroke-width="1.5" fill="none" opacity="0.3"/>
      <path d="M120 40 Q120 0, 80 0" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.2"/>
    </svg>`,
    divider: `<svg class="decoration-divider" viewBox="0 0 200 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 12 Q50 4, 100 12 Q150 20, 200 12" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.3"/>
      <circle cx="100" cy="12" r="4" fill="var(--color-accent)" opacity="0.4"/>
      <circle cx="100" cy="12" r="8" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.2"/>
    </svg>`,
    flourish: `<svg class="decoration-flourish" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 20 Q30 8, 60 20 Q90 32, 110 20" stroke="var(--color-accent)" stroke-width="1.5" fill="none" opacity="0.4"/>
      <circle cx="60" cy="20" r="3" fill="var(--color-accent)" opacity="0.5"/>
    </svg>`
  },

  playful: {
    cornerTopRight: `<svg class="decoration-corner" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="130" cy="30" r="55" fill="var(--color-accent)" opacity="0.15"/>
      <circle cx="100" cy="60" r="30" fill="var(--color-primary)" opacity="0.1"/>
      <circle cx="150" cy="70" r="20" fill="var(--color-accent)" opacity="0.2"/>
      <circle cx="80" cy="30" r="12" fill="var(--color-accent)" opacity="0.12"/>
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
    </svg>`
  },

  tech: {
    cornerTopRight: `<svg class="decoration-corner" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="80" y="0" width="60" height="2" fill="var(--color-accent)" opacity="0.5"/>
      <rect x="138" y="0" width="2" height="60" fill="var(--color-accent)" opacity="0.5"/>
      <rect x="100" y="20" width="24" height="24" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.25"/>
      <rect x="108" y="28" width="8" height="8" fill="var(--color-accent)" opacity="0.4"/>
      <rect x="60" y="40" width="16" height="16" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.15"/>
    </svg>`,
    divider: `<svg class="decoration-divider" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="6" x2="60" y2="6" stroke="var(--color-accent)" stroke-width="1" opacity="0.3"/>
      <circle cx="65" cy="6" r="4" fill="var(--color-accent)" opacity="0.4"/>
      <line x1="70" y1="6" x2="130" y2="6" stroke="var(--color-accent)" stroke-width="1" opacity="0.3"/>
      <circle cx="135" cy="6" r="4" fill="var(--color-accent)" opacity="0.4"/>
      <line x1="140" y1="6" x2="200" y2="6" stroke="var(--color-accent)" stroke-width="1" opacity="0.3"/>
    </svg>`,
    grid: `<svg class="decoration-grid" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="techGrid" patternUnits="userSpaceOnUse" width="20" height="20">
          <rect width="20" height="20" fill="none" stroke="var(--color-accent)" stroke-width="0.5" opacity="0.1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#techGrid)"/>
    </svg>`
  },

  organic: {
    cornerTopLeft: `<svg class="decoration-corner-tl" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0 C30 50, 50 80, 0 120" stroke="var(--color-accent)" stroke-width="2" fill="none" opacity="0.2"/>
      <path d="M0 0 C50 30, 80 50, 120 0" stroke="var(--color-accent)" stroke-width="2" fill="none" opacity="0.15"/>
      <ellipse cx="40" cy="40" rx="15" ry="20" fill="var(--color-accent)" opacity="0.08" transform="rotate(-30 40 40)"/>
    </svg>`,
    divider: `<svg class="decoration-divider" viewBox="0 0 200 30" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 15 Q40 5, 80 18 Q120 28, 160 12 Q180 8, 200 15" stroke="var(--color-accent)" stroke-width="1.5" fill="none" opacity="0.25"/>
    </svg>`,
    leaf: `<svg class="decoration-leaf" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 5 Q50 30, 30 75 Q10 30, 30 5" stroke="var(--color-accent)" stroke-width="1" fill="var(--color-accent)" fill-opacity="0.1"/>
      <path d="M30 15 L30 65" stroke="var(--color-accent)" stroke-width="1" opacity="0.3"/>
    </svg>`
  },

  luxury: {
    cornerTopLeft: `<svg class="decoration-corner-tl" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 25 L0 0 L25 0" stroke="var(--color-accent)" stroke-width="2" fill="none" opacity="0.6"/>
      <path d="M5 20 L5 5 L20 5" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.3"/>
    </svg>`,
    cornerTopRight: `<svg class="decoration-corner" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M80 25 L80 0 L55 0" stroke="var(--color-accent)" stroke-width="2" fill="none" opacity="0.6"/>
      <path d="M75 20 L75 5 L60 5" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.3"/>
    </svg>`,
    divider: `<svg class="decoration-divider" viewBox="0 0 200 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="luxuryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:var(--color-accent);stop-opacity:0"/>
          <stop offset="50%" style="stop-color:var(--color-accent);stop-opacity:0.6"/>
          <stop offset="100%" style="stop-color:var(--color-accent);stop-opacity:0"/>
        </linearGradient>
      </defs>
      <rect x="0" y="7" width="200" height="2" fill="url(#luxuryGrad)"/>
      <circle cx="100" cy="8" r="6" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.4"/>
      <circle cx="100" cy="8" r="2" fill="var(--color-accent)" opacity="0.5"/>
    </svg>`,
    ornament: `<svg class="decoration-ornament" viewBox="0 0 80 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="15" x2="25" y2="15" stroke="var(--color-accent)" stroke-width="1" opacity="0.4"/>
      <line x1="55" y1="15" x2="80" y2="15" stroke="var(--color-accent)" stroke-width="1" opacity="0.4"/>
      <circle cx="40" cy="15" r="8" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.5"/>
      <circle cx="40" cy="15" r="3" fill="var(--color-accent)" opacity="0.4"/>
    </svg>`
  },

  friendly: {
    cornerTopRight: `<svg class="decoration-corner" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="120" cy="30" rx="70" ry="60" fill="var(--color-accent)" opacity="0.1" transform="rotate(15 120 30)"/>
      <ellipse cx="100" cy="50" rx="30" ry="25" fill="var(--color-accent)" opacity="0.08" transform="rotate(-10 100 50)"/>
    </svg>`,
    divider: `<svg class="decoration-divider" viewBox="0 0 200 20" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 10 Q30 4, 60 10 T120 10 T180 10 L200 10" stroke="var(--color-accent)" stroke-width="2.5" fill="none" opacity="0.2" stroke-linecap="round"/>
    </svg>`,
    dots: `<svg class="decoration-dots" viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="5" fill="var(--color-accent)" opacity="0.35"/>
      <circle cx="30" cy="10" r="4" fill="var(--color-accent)" opacity="0.25"/>
      <circle cx="50" cy="10" r="5" fill="var(--color-accent)" opacity="0.2"/>
      <circle cx="70" cy="10" r="4" fill="var(--color-accent)" opacity="0.15"/>
    </svg>`
  },

  modern: {
    cornerTopRight: `<svg class="decoration-corner" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="80" y="0" width="40" height="40" fill="var(--color-accent)" opacity="0.1"/>
      <rect x="95" y="15" width="25" height="25" fill="var(--color-accent)" opacity="0.15"/>
      <line x1="60" y1="0" x2="60" y2="50" stroke="var(--color-accent)" stroke-width="1" opacity="0.2"/>
    </svg>`,
    divider: `<svg class="decoration-divider" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="2" width="60" height="4" rx="2" fill="var(--color-accent)" opacity="0.6"/>
      <rect x="70" y="3" width="30" height="2" rx="1" fill="var(--color-accent)" opacity="0.3"/>
    </svg>`,
    accent: `<svg class="decoration-accent" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="modernDots" patternUnits="userSpaceOnUse" width="16" height="16">
          <circle cx="8" cy="8" r="1.5" fill="var(--color-accent)" opacity="0.15"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#modernDots)"/>
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
 */
export function getDecorationStyles() {
  return `
    /* Decoration positioning */
    .decoration-corner {
      position: absolute;
      top: 0;
      right: 0;
      width: 120px;
      height: 120px;
      pointer-events: none;
      z-index: 0;
    }

    .decoration-corner-tl {
      position: absolute;
      top: 0;
      left: 0;
      width: 100px;
      height: 100px;
      pointer-events: none;
      z-index: 0;
    }

    .decoration-divider {
      width: 100%;
      height: 24px;
      margin: 1.5rem 0;
      display: block;
    }

    .decoration-accent {
      width: 200px;
      height: 10px;
      margin-top: 0.75rem;
      display: block;
    }

    .decoration-flourish {
      width: 120px;
      height: 40px;
      margin: 1.5rem auto;
      display: block;
    }

    .decoration-wave {
      width: 100%;
      height: 30px;
      margin: 1.5rem 0;
      display: block;
    }

    .decoration-dots {
      width: 80px;
      height: 20px;
      margin: 1rem auto;
      display: block;
    }

    .decoration-leaf {
      width: 40px;
      height: 60px;
      position: absolute;
      bottom: 2rem;
      right: 2rem;
      pointer-events: none;
      z-index: 0;
      opacity: 0.6;
    }

    .decoration-ornament {
      width: 80px;
      height: 30px;
      margin: 1rem auto;
      display: block;
    }

    .decoration-grid {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      opacity: 0.5;
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
      .decoration-divider,
      .decoration-accent,
      .decoration-flourish,
      .decoration-wave,
      .decoration-dots,
      .decoration-leaf,
      .decoration-ornament,
      .decoration-grid {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      /* Boost decoration visibility for print */
      .decoration-corner,
      .decoration-corner-tl {
        width: 100px;
        height: 100px;
      }

      .decoration-corner svg [opacity],
      .decoration-corner-tl svg [opacity] {
        opacity: 0.4 !important;
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
    }
  `
}
