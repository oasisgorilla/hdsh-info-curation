import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface GeneratePDFOptions {
  element: HTMLElement;
  filename: string;
  onProgress?: (progress: number) => void; // Progress callback (0-100)
}

/**
 * Generate PDF from HTML element by capturing each page individually
 * This avoids canvas size limits by processing pages one at a time
 */
export async function generatePDF({ element, filename, onProgress }: GeneratePDFOptions): Promise<void> {
  console.log('=== generatePDF function called ===');
  console.log('Element:', element);
  console.log('Filename:', filename);

  try {
    // Find all pages with class 'report-page'
    const pages = element.querySelectorAll('.report-page');
    console.log(`Found ${pages.length} pages to convert`);

    if (pages.length === 0) {
      throw new Error('No pages found with class "report-page"');
    }

    // Create PDF document (A4 portrait)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const a4Width = 210; // mm
    const a4Height = 297; // mm

    // Convert each page to canvas and add to PDF
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;
      console.log(`Processing page ${i + 1}/${pages.length}...`);

      try {
        // Convert page to canvas
        const canvas = await html2canvas(page, {
          scale: 2, // Higher quality
          useCORS: true,
          logging: false,
          backgroundColor: '#f5f5f5',
          windowWidth: page.scrollWidth,
          windowHeight: page.scrollHeight,
        });

        console.log(`Page ${i + 1} canvas created:`, {
          width: canvas.width,
          height: canvas.height,
        });

        // Convert canvas to image
        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        // Add new page for subsequent pages
        if (i > 0) {
          pdf.addPage();
        }

        // Add image to PDF (fill entire A4 page)
        pdf.addImage(imgData, 'JPEG', 0, 0, a4Width, a4Height);
        console.log(`Page ${i + 1} added to PDF`);

        // Update progress
        const progress = Math.round(((i + 1) / pages.length) * 100);
        if (onProgress) {
          onProgress(progress);
        }

      } catch (pageError) {
        console.error(`Failed to process page ${i + 1}:`, pageError);
        throw new Error(`페이지 ${i + 1} 처리 중 오류가 발생했습니다.`);
      }
    }

    // Save PDF
    console.log('Saving PDF...');
    pdf.save(filename);
    console.log('PDF save completed');

  } catch (error) {
    console.error('PDF generation failed:', error);
    console.error('Error type:', (error as Error).constructor.name);
    console.error('Error message:', (error as Error).message);
    console.error('Error stack:', (error as Error).stack);
    throw new Error('PDF 생성 중 오류가 발생했습니다.');
  }
}
