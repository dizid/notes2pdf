/**
 * Mood Analysis Functions
 * Analyzes colors and CSS to determine brand mood and archetype
 */

import {
  getColorTemperatureScore,
  getColorSaturation,
  getColorBrightness,
  colorDistance
} from './colorUtils.js'

/**
 * Analyze mood/aesthetic from colors and CSS patterns
 * @param {string[]} colors - Array of hex colors
 * @param {string} css - CSS content
 * @returns {Object} Mood analysis result
 */
export function analyzeMood(colors, css) {
  const mood = {
    temperature: { type: 'neutral', strength: 0.5 },
    saturation: { type: 'moderate', strength: 0.5 },
    brightness: { type: 'balanced', strength: 0.5 },
    energy: { type: 'balanced', strength: 0.5 },
    formality: { type: 'neutral', strength: 0.5 },
    archetype: 'modern',
    keywords: [],
    style: 'modern'
  }

  // Analyze colors if available
  if (colors && colors.length > 0) {
    mood.temperature = analyzeTemperature(colors)
    mood.saturation = analyzeSaturationMood(colors)
    mood.brightness = analyzeBrightnessMood(colors)
  }

  // Always analyze CSS patterns (energy, formality) even without colors
  mood.energy = analyzeEnergy(css, colors)
  mood.formality = analyzeFormality(css)
  mood.archetype = detectArchetype(css, colors, mood)
  mood.keywords = generateKeywords(mood)
  mood.style = mood.archetype

  return mood
}

/**
 * Analyze color temperature
 */
function analyzeTemperature(colors) {
  let warmScore = 0
  let coolScore = 0

  for (const color of colors) {
    const temp = getColorTemperatureScore(color)
    warmScore += temp.warm
    coolScore += temp.cool
  }

  const tempDiff = Math.abs(warmScore - coolScore) / colors.length
  if (warmScore > coolScore) {
    return { type: 'warm', strength: Math.min(1, tempDiff / 50) }
  } else if (coolScore > warmScore) {
    return { type: 'cool', strength: Math.min(1, tempDiff / 50) }
  }
  return { type: 'neutral', strength: 0.5 }
}

/**
 * Analyze saturation mood
 */
function analyzeSaturationMood(colors) {
  let totalSaturation = 0
  for (const color of colors) {
    totalSaturation += getColorSaturation(color)
  }
  const avgSaturation = totalSaturation / colors.length

  if (avgSaturation > 60) {
    return { type: 'vibrant', strength: Math.min(1, avgSaturation / 100) }
  } else if (avgSaturation < 30) {
    return { type: 'muted', strength: Math.min(1, (50 - avgSaturation) / 50) }
  }
  return { type: 'moderate', strength: 0.5 }
}

/**
 * Analyze brightness mood
 */
function analyzeBrightnessMood(colors) {
  let totalBrightness = 0
  for (const color of colors) {
    totalBrightness += getColorBrightness(color)
  }
  const avgBrightness = totalBrightness / colors.length

  if (avgBrightness > 70) {
    return { type: 'light', strength: Math.min(1, avgBrightness / 100) }
  } else if (avgBrightness < 40) {
    return { type: 'dark', strength: Math.min(1, (60 - avgBrightness) / 60) }
  }
  return { type: 'balanced', strength: 0.5 }
}

/**
 * Analyze energy level from CSS patterns
 */
export function analyzeEnergy(css, colors) {
  if (!css) return { type: 'balanced', strength: 0.5 }

  let energyScore = 50

  if (css.includes('animation') || css.includes('@keyframes')) {
    energyScore += 20
  }
  if (css.includes('transition')) {
    energyScore += 10
  }

  const gradientMatches = css.match(/linear-gradient|radial-gradient/gi) || []
  energyScore += Math.min(15, gradientMatches.length * 3)

  if (colors && colors.length >= 2) {
    const contrast = colorDistance(colors[0], colors[1])
    if (contrast > 150) energyScore += 15
    else if (contrast > 100) energyScore += 8
  }

  if (css.includes('transform') || css.includes('scale')) {
    energyScore += 10
  }

  if (css.includes('box-shadow') && css.includes('rgba(0')) {
    energyScore += 5
  }

  if (energyScore >= 70) {
    return { type: 'energetic', strength: Math.min(1, energyScore / 100) }
  } else if (energyScore <= 35) {
    return { type: 'calm', strength: Math.min(1, (50 - energyScore) / 50) }
  }
  return { type: 'balanced', strength: 0.5 }
}

/**
 * Analyze formality from CSS patterns
 */
export function analyzeFormality(css) {
  if (!css) return { type: 'neutral', strength: 0.5 }

  let formalityScore = 50

  if (css.includes('serif') && !css.includes('sans-serif')) {
    formalityScore += 25
  }
  if (css.includes('sans-serif') && !css.includes('serif')) {
    formalityScore -= 10
  }

  if (css.includes('rounded-full') || css.includes('border-radius: 50%') || css.includes('border-radius: 9999')) {
    formalityScore -= 20
  }
  if (css.includes('border-radius: 0') || css.includes('border-radius:0')) {
    formalityScore += 15
  }

  if (css.includes('letter-spacing') && css.includes('-0.0')) {
    formalityScore += 10
  }

  const paddingMatches = css.match(/padding:\s*(\d+)px/gi) || []
  for (const match of paddingMatches) {
    const value = parseInt(match.match(/\d+/)?.[0] || '0')
    if (value >= 40) formalityScore += 5
  }

  if (css.includes('#ff') || css.includes('#00ff') || css.includes('hsl(')) {
    formalityScore -= 5
  }

  if (formalityScore >= 65) {
    return { type: 'formal', strength: Math.min(1, formalityScore / 100) }
  } else if (formalityScore <= 35) {
    return { type: 'casual', strength: Math.min(1, (50 - formalityScore) / 50) }
  }
  return { type: 'neutral', strength: 0.5 }
}

/**
 * Detect overall style archetype from patterns
 */
export function detectArchetype(css, colors, mood) {
  if (!css) return 'modern'

  const scores = {
    minimal: 0,
    bold: 0,
    elegant: 0,
    playful: 0,
    tech: 0,
    organic: 0,
    luxury: 0,
    friendly: 0
  }

  // MINIMAL
  if (css.includes('border-radius: 0') || css.includes('border-radius:0')) scores.minimal += 2
  if (mood.saturation?.type === 'muted') scores.minimal += 2
  if (mood.energy?.type === 'calm') scores.minimal += 1
  if (!css.includes('gradient')) scores.minimal += 1
  if (!css.includes('box-shadow') || css.includes('shadow-none')) scores.minimal += 1

  // BOLD
  if (mood.saturation?.type === 'vibrant') scores.bold += 2
  if (mood.energy?.type === 'energetic') scores.bold += 2
  if (css.includes('font-weight: 700') || css.includes('font-weight: 800') || css.includes('font-weight: 900')) scores.bold += 2
  if (css.includes('text-transform: uppercase')) scores.bold += 1
  if (colors && colors.length >= 2 && colorDistance(colors[0], colors[1]) > 150) scores.bold += 1

  // ELEGANT
  if (css.includes('serif') && !css.includes('sans-serif')) scores.elegant += 3
  if (mood.formality?.type === 'formal') scores.elegant += 2
  if (css.includes('letter-spacing') && css.includes('0.0')) scores.elegant += 1
  if (mood.saturation?.type === 'muted') scores.elegant += 1

  // PLAYFUL
  if (css.includes('rounded-full') || css.includes('border-radius: 50%') || css.includes('border-radius: 9999')) scores.playful += 3
  if (mood.saturation?.type === 'vibrant') scores.playful += 1
  if (mood.formality?.type === 'casual') scores.playful += 2
  if (mood.temperature?.type === 'warm') scores.playful += 1

  // TECH
  if (css.includes('monospace') || css.includes('SF Mono') || css.includes('Consolas')) scores.tech += 3
  if (css.includes('grid') || css.includes('flex')) scores.tech += 1
  if (mood.temperature?.type === 'cool') scores.tech += 1
  if (css.includes('rgb(') && css.includes('0,')) scores.tech += 1

  // ORGANIC
  if (css.includes('border-radius') && !css.includes('border-radius: 0')) scores.organic += 1
  if (mood.temperature?.type === 'warm') scores.organic += 1
  if (css.includes('gradient') && css.includes('radial')) scores.organic += 1

  // LUXURY
  if (mood.brightness?.type === 'dark') scores.luxury += 2
  if (mood.saturation?.type === 'muted') scores.luxury += 1
  if (mood.formality?.type === 'formal') scores.luxury += 2
  if (css.includes('gold') || css.includes('#d4af37') || css.includes('#c9a227')) scores.luxury += 3

  // FRIENDLY
  if (scores.playful > 0) scores.friendly += 1
  if (mood.temperature?.type === 'warm') scores.friendly += 2
  if (mood.brightness?.type === 'light') scores.friendly += 1
  if (css.includes('Nunito') || css.includes('Poppins') || css.includes('rounded')) scores.friendly += 2

  let maxScore = 0
  let archetype = 'modern'
  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score
      archetype = type
    }
  }

  return archetype
}

/**
 * Generate emotional keywords based on mood analysis
 */
export function generateKeywords(mood) {
  const keywords = []

  if (mood.temperature?.type === 'warm') {
    keywords.push('inviting', 'cozy')
    if (mood.temperature?.strength > 0.7) keywords.push('passionate')
  } else if (mood.temperature?.type === 'cool') {
    keywords.push('calm', 'professional')
    if (mood.temperature?.strength > 0.7) keywords.push('serene')
  }

  if (mood.saturation?.type === 'vibrant') {
    keywords.push('dynamic', 'bold')
    if (mood.saturation?.strength > 0.7) keywords.push('striking')
  } else if (mood.saturation?.type === 'muted') {
    keywords.push('subtle', 'refined')
    if (mood.saturation?.strength > 0.7) keywords.push('understated')
  }

  if (mood.energy?.type === 'energetic') {
    keywords.push('lively', 'exciting')
  } else if (mood.energy?.type === 'calm') {
    keywords.push('peaceful', 'relaxed')
  }

  if (mood.formality?.type === 'formal') {
    keywords.push('sophisticated', 'polished')
  } else if (mood.formality?.type === 'casual') {
    keywords.push('friendly', 'approachable')
  }

  const archetypeKeywords = {
    minimal: ['clean', 'simple', 'focused'],
    bold: ['impactful', 'confident', 'strong'],
    elegant: ['luxurious', 'refined', 'timeless'],
    playful: ['fun', 'creative', 'joyful'],
    tech: ['innovative', 'modern', 'precise'],
    organic: ['natural', 'flowing', 'authentic'],
    luxury: ['premium', 'exclusive', 'opulent'],
    friendly: ['warm', 'welcoming', 'trustworthy']
  }

  if (archetypeKeywords[mood.archetype]) {
    keywords.push(...archetypeKeywords[mood.archetype])
  }

  return [...new Set(keywords)].slice(0, 8)
}
