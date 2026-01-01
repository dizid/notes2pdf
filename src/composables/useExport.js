import { ref } from 'vue'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

/**
 * Export format presets with dimensions
 */
export const EXPORT_FORMATS = {
  // Standard sizes
  png: { label: 'PNG', ext: 'png', width: null, height: null }, // Original size
  pdf: { label: 'PDF', ext: 'pdf', width: 210, height: 297, unit: 'mm' }, // A4

  // Social media sizes (in pixels)
  ogImage: { label: 'Open Graph (1200x630)', ext: 'png', width: 1200, height: 630 },
  instagram: { label: 'Instagram Post (1080x1080)', ext: 'png', width: 1080, height: 1080 },
  instagramStory: { label: 'Instagram Story (1080x1920)', ext: 'png', width: 1080, height: 1920 },
  twitter: { label: 'Twitter Post (1200x675)', ext: 'png', width: 1200, height: 675 },
  linkedin: { label: 'LinkedIn Post (1200x627)', ext: 'png', width: 1200, height: 627 },
  facebook: { label: 'Facebook Post (1200x630)', ext: 'png', width: 1200, height: 630 }
}

/**
 * Composable for multi-format export
 */
export function useExport() {
  const isExporting = ref(false)
  const exportProgress = ref(0)
  const exportError = ref(null)

  /**
   * Capture HTML element to canvas
   * @param {HTMLElement} element - Element to capture
   * @param {Object} options - html2canvas options
   * @returns {Promise<HTMLCanvasElement>}
   */
  async function captureToCanvas(element, options = {}) {
    const defaultOptions = {
      scale: 2, // High DPI
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true,
      ...options
    }

    return html2canvas(element, defaultOptions)
  }

  /**
   * Resize canvas to target dimensions
   * @param {HTMLCanvasElement} sourceCanvas - Source canvas
   * @param {number} targetWidth - Target width
   * @param {number} targetHeight - Target height
   * @returns {HTMLCanvasElement}
   */
  function resizeCanvas(sourceCanvas, targetWidth, targetHeight) {
    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight

    const ctx = canvas.getContext('2d')

    // Fill with white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, targetWidth, targetHeight)

    // Calculate scaling to fit while maintaining aspect ratio
    const sourceRatio = sourceCanvas.width / sourceCanvas.height
    const targetRatio = targetWidth / targetHeight

    let drawWidth, drawHeight, drawX, drawY

    if (sourceRatio > targetRatio) {
      // Source is wider - fit to width
      drawWidth = targetWidth
      drawHeight = targetWidth / sourceRatio
      drawX = 0
      drawY = (targetHeight - drawHeight) / 2
    } else {
      // Source is taller - fit to height
      drawHeight = targetHeight
      drawWidth = targetHeight * sourceRatio
      drawX = (targetWidth - drawWidth) / 2
      drawY = 0
    }

    ctx.drawImage(sourceCanvas, drawX, drawY, drawWidth, drawHeight)

    return canvas
  }

  /**
   * Download canvas as PNG
   * @param {HTMLCanvasElement} canvas - Canvas to download
   * @param {string} filename - Filename without extension
   */
  function downloadPng(canvas, filename) {
    const link = document.createElement('a')
    link.download = `${filename}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  /**
   * Download canvas as PDF
   * @param {HTMLCanvasElement} canvas - Canvas to download
   * @param {string} filename - Filename without extension
   */
  function downloadPdf(canvas, filename) {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    // Calculate dimensions to fit page
    const imgRatio = canvas.width / canvas.height
    const pageRatio = pageWidth / pageHeight

    let imgWidth, imgHeight

    if (imgRatio > pageRatio) {
      imgWidth = pageWidth
      imgHeight = pageWidth / imgRatio
    } else {
      imgHeight = pageHeight
      imgWidth = pageHeight * imgRatio
    }

    const x = (pageWidth - imgWidth) / 2
    const y = (pageHeight - imgHeight) / 2

    const imgData = canvas.toDataURL('image/png')
    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight)
    pdf.save(`${filename}.pdf`)
  }

  /**
   * Get canvas as data URL
   * @param {HTMLCanvasElement} canvas - Canvas
   * @param {string} format - 'png' or 'jpeg'
   * @returns {string}
   */
  function getDataUrl(canvas, format = 'png') {
    return canvas.toDataURL(`image/${format}`)
  }

  /**
   * Export element in specified format
   * @param {HTMLElement|string} elementOrId - Element or element ID
   * @param {string} format - Format key from EXPORT_FORMATS
   * @param {string} filename - Base filename (without extension)
   * @returns {Promise<string|null>} Data URL or null on error
   */
  async function exportAs(elementOrId, format, filename = 'export') {
    const element = typeof elementOrId === 'string'
      ? document.getElementById(elementOrId)
      : elementOrId

    if (!element) {
      exportError.value = 'Element not found'
      console.error('Export: element not found')
      return null
    }

    const formatConfig = EXPORT_FORMATS[format]
    if (!formatConfig) {
      exportError.value = 'Invalid format'
      console.error('Export: invalid format', format)
      return null
    }

    isExporting.value = true
    exportProgress.value = 0
    exportError.value = null

    try {
      exportProgress.value = 25

      // Capture element to canvas
      let canvas = await captureToCanvas(element)
      exportProgress.value = 50

      // Resize if target dimensions specified
      if (formatConfig.width && formatConfig.height) {
        canvas = resizeCanvas(canvas, formatConfig.width, formatConfig.height)
      }
      exportProgress.value = 75

      // Download based on format
      if (format === 'pdf') {
        downloadPdf(canvas, filename)
      } else {
        downloadPng(canvas, filename)
      }

      exportProgress.value = 100
      return getDataUrl(canvas)
    } catch (error) {
      exportError.value = error.message
      console.error('Export failed:', error)
      return null
    } finally {
      isExporting.value = false
    }
  }

  /**
   * Export as PNG (original size)
   */
  async function exportPng(elementOrId, filename = 'export') {
    return exportAs(elementOrId, 'png', filename)
  }

  /**
   * Export as PDF
   */
  async function exportPdf(elementOrId, filename = 'export') {
    return exportAs(elementOrId, 'pdf', filename)
  }

  /**
   * Export for social media
   * @param {HTMLElement|string} elementOrId - Element or ID
   * @param {string} platform - 'ogImage' | 'instagram' | 'instagramStory' | 'twitter' | 'linkedin' | 'facebook'
   * @param {string} filename - Base filename
   */
  async function exportForSocial(elementOrId, platform, filename = 'social') {
    return exportAs(elementOrId, platform, `${filename}-${platform}`)
  }

  /**
   * Get canvas data URL without downloading
   * @param {HTMLElement|string} elementOrId - Element or ID
   * @param {string} format - Format key
   * @returns {Promise<string|null>}
   */
  async function getExportDataUrl(elementOrId, format = 'png') {
    const element = typeof elementOrId === 'string'
      ? document.getElementById(elementOrId)
      : elementOrId

    if (!element) return null

    const formatConfig = EXPORT_FORMATS[format]

    try {
      let canvas = await captureToCanvas(element)

      if (formatConfig?.width && formatConfig?.height) {
        canvas = resizeCanvas(canvas, formatConfig.width, formatConfig.height)
      }

      return getDataUrl(canvas)
    } catch (error) {
      console.error('Failed to get data URL:', error)
      return null
    }
  }

  /**
   * Reset export state
   */
  function reset() {
    isExporting.value = false
    exportProgress.value = 0
    exportError.value = null
  }

  return {
    // State
    isExporting,
    exportProgress,
    exportError,

    // Methods
    exportAs,
    exportPng,
    exportPdf,
    exportForSocial,
    getExportDataUrl,
    reset,

    // Constants
    EXPORT_FORMATS
  }
}
