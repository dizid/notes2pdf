import { ref } from 'vue'
import html2pdf from 'html2pdf.js'

export function usePdfExport() {
  const isExporting = ref(false)

  async function exportPdf(elementId, filename = 'deck.pdf') {
    const element = document.getElementById(elementId)
    if (!element) {
      console.error('PDF export: element not found')
      return
    }

    isExporting.value = true

    const options = {
      margin: 0,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    }

    try {
      await html2pdf().set(options).from(element).save()
    } catch (error) {
      console.error('PDF export failed:', error)
    } finally {
      isExporting.value = false
    }
  }

  return {
    exportPdf,
    isExporting
  }
}
