import html2pdf from 'html2pdf.js';

interface GeneratePDFOptions {
  element: HTMLElement;
  filename: string;
}

/**
 * Generate PDF from HTML element using html2pdf.js
 * This preserves the exact styling and layout of the HTML content
 */
export async function generatePDF({ element, filename }: GeneratePDFOptions): Promise<void> {
  const opt = {
    margin: 0,
    filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
    },
    jsPDF: {
      unit: 'mm' as const,
      format: 'a4' as const,
      orientation: 'portrait' as const,
      compress: true,
    },
    pagebreak: { mode: 'avoid-all' as const },
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('PDF 생성 중 오류가 발생했습니다.');
  }
}
