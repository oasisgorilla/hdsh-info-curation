import { useRef, useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Toolbar,
  Typography,
  Divider,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useWeeklyReport } from '../../hooks/useWeeklyReport';
import { aggregateReportStats, getTopClustersByCategory, formatWeekInfo } from '../../utils/reportHelpers';
import { CATEGORY_MAP } from '../../types/report';
import CoverPage from '../../features/report/CoverPage';
import TableOfContentsPage from '../../features/report/TableOfContentsPage';
import CategorySummaryPage from '../../features/report/CategorySummaryPage';
import { generatePDF } from '../../utils/generatePDF';
import type { WeeklyReportDialogProps } from '../../types/report';

function WeeklyReportDialog({ open, onClose, date }: WeeklyReportDialogProps) {
  const { clusters, loading, error } = useWeeklyReport(date);
  const reportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.62);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0); // PDF generation progress (0-100)
  const [currentPage, setCurrentPage] = useState(1);

  // Category pagination state: categoryId -> current page number
  const [categoryPages, setCategoryPages] = useState<Record<number, number>>({
    1: 1, // 국내동향
    2: 1, // 중국동향
    3: 1, // 해외동향
    4: 1, // 원자재·RISK
    5: 1, // 기술·R&D
    6: 1, // 정책·규제
  });

  // Calculate total pages dynamically
  const calculateTotalPages = () => {
    if (clusters.length === 0) return 8; // 1 Cover + 1 TOC + 6 Category pages (empty)

    let categoryPages = 0;
    Object.keys(CATEGORY_MAP).forEach(categoryId => {
      const categoryClusters = clusters.filter(c => c.category_id === Number(categoryId));
      if (categoryClusters.length === 0) {
        categoryPages += 1; // 빈 페이지
      } else {
        categoryPages += Math.ceil(categoryClusters.length / 3); // 3개씩 분할
      }
    });

    return 1 + 1 + categoryPages; // Cover + TOC + Category pages
  };

  const totalPages = calculateTotalPages();

  // Calculate dynamic scale based on container height
  useEffect(() => {
    const calculateScale = () => {
      if (!contentRef.current) return;

      const container = contentRef.current;
      const containerHeight = container.clientHeight;

      // A4 페이지 높이 (297mm를 픽셀로 변환, 1mm ≈ 3.7795px)
      const a4HeightPx = 297 * 3.7795;

      // 페이지 간 여백 (16px)
      const pageMargin = 16;

      // 컨테이너 내부 패딩 (위아래 2 * 16px)
      const containerPadding = 32;

      // 사용 가능한 높이에서 여백을 뺀 높이
      const availableHeight = containerHeight - containerPadding - pageMargin;

      // 계산된 배율 (페이지가 컨테이너에 꽉 차도록)
      const calculatedScale = availableHeight / a4HeightPx;

      setScale(Math.min(calculatedScale, 1)); // 최대 1배율로 제한
    };

    // 초기 계산
    calculateScale();

    // 윈도우 리사이즈 시 재계산
    window.addEventListener('resize', calculateScale);

    return () => {
      window.removeEventListener('resize', calculateScale);
    };
  }, [open, loading, error]);

  // Preload images when dialog opens
  useEffect(() => {
    if (open && !loading && !error && clusters.length > 0) {
      console.log('Preloading images for report...');

      // Images to preload
      const imagesToPreload = ['/logo.png', '/cginside-logo.png'];

      const preloadPromises = imagesToPreload.map(src => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            console.log('Preloaded:', src);
            resolve();
          };
          img.onerror = () => {
            console.error('Failed to preload:', src);
            reject(new Error(`Failed to preload: ${src}`));
          };
          img.src = src;
        });
      });

      Promise.all(preloadPromises)
        .then(() => console.log('All images preloaded successfully'))
        .catch(err => console.error('Image preload failed:', err));
    }
  }, [open, loading, error, clusters.length]);

  // Format week info
  const { weekNumber, dateRange } = formatWeekInfo(date);

  // Aggregate stats
  const { totalNews, totalIssues } = clusters.length > 0
    ? aggregateReportStats(clusters)
    : { totalNews: 0, totalIssues: 0 };

  // Prepare table of contents categories with dynamic page numbers
  const tocCategories = (() => {
    let currentPageNumber = 3; // 1 Cover + 1 TOC + start from 3

    if (pdfGenerating) {
      // PDF 모드: 각 카테고리가 클러스터 수에 따라 여러 페이지 차지
      return Object.entries(CATEGORY_MAP).map(([id, label]) => {
        const categoryId = Number(id);
        const startPage = currentPageNumber;

        const categoryClusters = clusters.filter(c => c.category_id === categoryId);
        const pagesForCategory = categoryClusters.length === 0
          ? 1
          : Math.ceil(categoryClusters.length / 3);

        currentPageNumber += pagesForCategory;

        return {
          id: categoryId,
          label,
          pageNumber: startPage,
        };
      });
    } else {
      // 웹 프리뷰 모드: 각 카테고리가 1페이지씩만 차지 (캐러셀로 압축)
      return Object.entries(CATEGORY_MAP).map(([id, label]) => {
        const pageNumber = currentPageNumber;
        currentPageNumber += 1;
        return {
          id: Number(id),
          label,
          pageNumber,
        };
      });
    }
  })();

  // Zoom handlers
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.3));
  };

  // Page navigation handlers
  const scrollToPage = (pageNumber: number) => {
    if (!contentRef.current || !reportRef.current) return;

    // Try to find page by ID first (more reliable)
    const pageId = `report-page-${pageNumber}`;
    const targetPage = document.getElementById(pageId);

    if (targetPage) {
      targetPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentPage(pageNumber);
    } else {
      // Fallback to old method if ID not found
      const pages = reportRef.current.querySelectorAll('.report-page');
      if (pageNumber < 1 || pageNumber > pages.length) return;

      const fallbackPage = pages[pageNumber - 1];
      if (fallbackPage) {
        fallbackPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setCurrentPage(pageNumber);
      }
    }
  };

  const handleFirstPage = () => scrollToPage(1);
  const handleLastPage = () => scrollToPage(8);
  const handlePrevPage = () => scrollToPage(Math.max(currentPage - 1, 1));
  const handleNextPage = () => scrollToPage(Math.min(currentPage + 1, 8));

  // Handle category page change
  const handleCategoryPageChange = (categoryId: number, page: number) => {
    setCategoryPages(prev => ({
      ...prev,
      [categoryId]: page,
    }));
  };

  // Wait for all images to load before PDF generation
  const waitForImages = async (element: HTMLElement): Promise<void> => {
    const images = Array.from(element.querySelectorAll('img'));
    console.log(`Waiting for ${images.length} images to load...`);

    const imagePromises = images.map((img, idx) => {
      return new Promise<void>((resolve, reject) => {
        if (img.complete && img.naturalHeight !== 0) {
          console.log(`Image ${idx} already loaded:`, img.src);
          resolve();
        } else {
          console.log(`Waiting for image ${idx}:`, img.src);
          img.onload = () => {
            console.log(`Image ${idx} loaded:`, img.src);
            resolve();
          };
          img.onerror = () => {
            console.error(`Image ${idx} failed to load:`, img.src);
            reject(new Error(`Failed to load image: ${img.src}`));
          };
          // Timeout after 5 seconds
          setTimeout(() => {
            console.warn(`Image ${idx} load timeout:`, img.src);
            reject(new Error(`Image load timeout: ${img.src}`));
          }, 5000);
        }
      });
    });

    await Promise.all(imagePromises);
    console.log('All images loaded successfully');
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    setPdfGenerating(true);

    // Store original transform
    const originalTransform = reportRef.current.style.transform;
    const originalTransformOrigin = reportRef.current.style.transformOrigin;

    try {
      console.log('=== PDF Generation Started ===');
      console.log('Total clusters:', clusters.length);

      // Remove transform to get actual size
      reportRef.current.style.transform = 'none';
      reportRef.current.style.transformOrigin = 'top center';

      // Wait for DOM to render all pages
      await new Promise(resolve => setTimeout(resolve, 500));

      // Wait for images to load
      try {
        await waitForImages(reportRef.current);
      } catch (error) {
        console.warn('Image loading failed, continuing anyway:', error);
      }

      console.log('Starting PDF generation...');
      setPdfProgress(0);
      await generatePDF({
        element: reportRef.current,
        filename: `조선업_AI_리포트_${weekNumber}주차_${date}.pdf`,
        onProgress: (progress) => {
          setPdfProgress(progress);
          console.log(`PDF progress: ${progress}%`);
        },
      });
      console.log('PDF generation completed successfully');

      // Restore original transform
      if (reportRef.current) {
        reportRef.current.style.transform = originalTransform;
        reportRef.current.style.transformOrigin = originalTransformOrigin;
      }
    } catch (error) {
      console.error('PDF download failed:', error);
      alert('PDF 다운로드 중 오류가 발생했습니다.');

      // Restore transform on error
      if (reportRef.current) {
        reportRef.current.style.transform = originalTransform;
        reportRef.current.style.transformOrigin = originalTransformOrigin;
      }
    } finally {
      setPdfGenerating(false);
      setPdfProgress(0);
      console.log('=== PDF Generation Ended ===');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: '210mm',
          height: '90vh',
          maxHeight: '90vh',
          aspectRatio: '210 / 297', // A4 비율
        },
      }}
    >
      {/* Toolbar */}
      <Toolbar
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          minHeight: '56px !important',
          px: 2,
          gap: 1,
        }}
      >
        {/* Zoom Controls */}
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          <Tooltip title="축소">
            <IconButton size="small" onClick={handleZoomOut} disabled={scale <= 0.3}>
              <ZoomOutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="확대">
            <IconButton size="small" onClick={handleZoomIn} disabled={scale >= 2}>
              <ZoomInIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Typography variant="body2" sx={{ minWidth: '50px', textAlign: 'center' }}>
            {Math.round(scale * 100)}%
          </Typography>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Page Navigation */}
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          <Tooltip title="첫 페이지">
            <IconButton size="small" onClick={handleFirstPage} disabled={currentPage === 1 || loading}>
              <FirstPageIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="이전 페이지">
            <IconButton size="small" onClick={handlePrevPage} disabled={currentPage === 1 || loading}>
              <KeyboardArrowUpIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Typography variant="body2" sx={{ minWidth: '80px', textAlign: 'center' }}>
            {currentPage} / 8
          </Typography>
          <Tooltip title="다음 페이지">
            <IconButton size="small" onClick={handleNextPage} disabled={currentPage === totalPages || loading}>
              <KeyboardArrowDownIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="마지막 페이지">
            <IconButton size="small" onClick={handleLastPage} disabled={currentPage === totalPages || loading}>
              <LastPageIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* PDF Generation Progress */}
        {pdfGenerating && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
            <Box sx={{ minWidth: 100 }}>
              <LinearProgress variant="determinate" value={pdfProgress} />
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', minWidth: 40 }}>
              {pdfProgress}%
            </Typography>
          </Box>
        )}

        {/* PDF Download Button */}
        <Tooltip title={pdfGenerating ? 'PDF 생성 중...' : 'PDF 다운로드'}>
          <IconButton
            size="small"
            onClick={handleDownloadPDF}
            disabled={loading || error !== null || clusters.length === 0 || pdfGenerating}
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Close Button */}
        <Tooltip title="닫기">
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Toolbar>

      {/* Dialog Content */}
      <DialogContent
        ref={contentRef}
        sx={{
          p: 2,
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          bgcolor: 'grey.200',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'grey.100',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'grey.400',
            borderRadius: '4px',
          },
        }}
      >
        {/* Loading State */}
        {loading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && !loading && (
          <Box sx={{ p: 4 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {/* Report Content - Scaled to fit dialog */}
        {!loading && !error && clusters.length > 0 && (
          <Box
            ref={reportRef}
            className="report-content-wrapper"
            sx={{
              // Scale down to fit in dialog (A4 210mm -> fit in dialog width with padding)
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              width: '210mm',
              my: 0,
              // Add spacing between pages for preview only, remove for PDF
              '& .report-page': {
                marginBottom: pdfGenerating ? '0' : '16px',
                boxShadow: pdfGenerating ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.1)',
              },
              '& .report-page:last-child': {
                marginBottom: 0,
              },
            }}
          >
            {/* Cover Page */}
            <CoverPage
              weekNumber={weekNumber}
              dateRange={dateRange}
              totalNews={totalNews}
              totalIssues={totalIssues}
            />

            {/* Table of Contents */}
            <TableOfContentsPage
              categories={tocCategories}
              isPreview={!pdfGenerating}
              onNavigate={!pdfGenerating ? scrollToPage : undefined}
            />

            {/* Category Summary Pages (1-6) */}
            {(() => {
              let globalPageCounter = 3; // Cover(1) + TOC(2) + start from 3

              return Object.entries(CATEGORY_MAP).map(([categoryId, categoryLabel]) => {
                const allClusters = getTopClustersByCategory(clusters, Number(categoryId), Infinity);
                const catId = Number(categoryId);
                const totalCategoryPages = allClusters.length === 0 ? 1 : Math.ceil(allClusters.length / 3);

                if (pdfGenerating) {
                  // PDF 생성 모드: 모든 페이지 렌더링
                  if (allClusters.length === 0) {
                    const pageNum = globalPageCounter;
                    globalPageCounter += 1;

                    return (
                      <CategorySummaryPage
                        key={`${categoryId}-pdf-empty`}
                        categoryId={catId}
                        categoryLabel={categoryLabel}
                        clusters={[]}
                        currentPage={1}
                        totalPages={1}
                        isPreview={false}
                        globalPageNumber={pageNum}
                        pageId={`report-page-${pageNum}`}
                      />
                    );
                  }

                  const pages = [];
                  for (let i = 0; i < allClusters.length; i += 3) {
                    const pageClusters = allClusters.slice(i, i + 3);
                    const pageNum = Math.floor(i / 3) + 1;
                    const globalPageNum = globalPageCounter;
                    globalPageCounter += 1;

                    pages.push(
                      <CategorySummaryPage
                        key={`${categoryId}-pdf-page-${pageNum}`}
                        categoryId={catId}
                        categoryLabel={categoryLabel}
                        clusters={pageClusters}
                        clusterStartIndex={i}
                        currentPage={pageNum}
                        totalPages={totalCategoryPages}
                        isPreview={false}
                        globalPageNumber={globalPageNum}
                        pageId={`report-page-${globalPageNum}`}
                      />
                    );
                  }
                  return pages;
                } else {
                  // 웹뷰 모드: 현재 페이지만 렌더링
                  const currentCategoryPage = categoryPages[catId] || 1;
                  const startIdx = (currentCategoryPage - 1) * 3;
                  const pageClusters = allClusters.slice(startIdx, startIdx + 3);
                  const pageNum = globalPageCounter;
                  globalPageCounter += 1;

                  return (
                    <CategorySummaryPage
                      key={`${categoryId}-preview`}
                      categoryId={catId}
                      categoryLabel={categoryLabel}
                      clusters={pageClusters}
                      clusterStartIndex={startIdx}
                      currentPage={currentCategoryPage}
                      totalPages={totalCategoryPages}
                      onPageChange={(page) => handleCategoryPageChange(catId, page)}
                      isPreview={true}
                      globalPageNumber={pageNum}
                      pageId={`report-page-${pageNum}`}
                    />
                  );
                }
              });
            })()}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default WeeklyReportDialog;
