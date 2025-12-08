import React, { useRef, useState, useEffect, useMemo } from 'react';
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
import { aggregateReportStats, formatWeekInfo, getTopClustersByCategory } from '../../utils/reportHelpers';
import { CATEGORY_MAP } from '../../types/report';
import CoverPage from '../../features/report/CoverPage';
import TableOfContentsPage from '../../features/report/TableOfContentsPage';
import CategorySummaryPage from '../../features/report/CategorySummaryPage';
import { generatePDF } from '../../utils/generatePDF';
import { calculateCategoryPages, type PageLayout } from '../../utils/pdfLayoutCalculator';
import type { WeeklyReportDialogProps } from '../../types/report';

function WeeklyReportDialog({ open, onClose, date }: WeeklyReportDialogProps) {
  const { clusters, loading, error } = useWeeklyReport(date);
  const reportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.62);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate category pages dynamically
  const categoryPages = useMemo(() => {
    if (clusters.length === 0) return [];

    let currentPageIndex = 3; // Cover(1) + TOC(2) = 3부터 시작
    const allPages: Array<{
      categoryId: number;
      categoryLabel: string;
      pageLayouts: PageLayout[];
    }> = [];

    Object.entries(CATEGORY_MAP).forEach(([categoryId, categoryLabel]) => {
      // Get top 3 clusters by score for this category (no item limit for PDF)
      const categoryClusters = getTopClustersByCategory(clusters, Number(categoryId), 3);
      const pageLayouts = calculateCategoryPages(
        Number(categoryId),
        categoryClusters,
        currentPageIndex
      );

      allPages.push({
        categoryId: Number(categoryId),
        categoryLabel,
        pageLayouts
      });

      currentPageIndex += pageLayouts.length;
    });

    return allPages;
  }, [clusters]);

  // Calculate total pages dynamically
  const totalPages = useMemo(() => {
    return 2 + categoryPages.reduce((sum, cat) => sum + cat.pageLayouts.length, 0);
  }, [categoryPages]);

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

  // Format week info
  const { weekNumber, dateRange } = formatWeekInfo(date);

  // Aggregate stats
  const { totalNews, totalIssues } = clusters.length > 0
    ? aggregateReportStats(clusters)
    : { totalNews: 0, totalIssues: 0 };

  // Prepare table of contents categories
  const tocCategories = Object.entries(CATEGORY_MAP).map(([id, label], index) => ({
    id: Number(id),
    label,
    pageNumber: index + 3, // Page 1 = Cover, Page 2 = TOC, Pages 3-8 = Categories
  }));

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

    const pages = reportRef.current.querySelectorAll('.report-page');
    if (pageNumber < 1 || pageNumber > pages.length) return;

    const targetPage = pages[pageNumber - 1];
    if (targetPage) {
      targetPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentPage(pageNumber);
    }
  };

  const handleFirstPage = () => scrollToPage(1);
  const handleLastPage = () => scrollToPage(totalPages);
  const handlePrevPage = () => scrollToPage(Math.max(currentPage - 1, 1));
  const handleNextPage = () => scrollToPage(Math.min(currentPage + 1, totalPages));

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    setPdfGenerating(true);

    // Store original scale
    const originalScale = scale;

    try {
      // Temporarily set scale to 1 for PDF generation (full size)
      setScale(1);

      // Wait for scale change to be applied
      await new Promise(resolve => setTimeout(resolve, 100));

      await generatePDF({
        element: reportRef.current,
        filename: `조선업_AI_리포트_${weekNumber}주차_${date}.pdf`,
      });
    } catch (error) {
      console.error('PDF download failed:', error);
      alert('PDF 다운로드 중 오류가 발생했습니다.');
    } finally {
      // Restore original scale
      setScale(originalScale);
      setPdfGenerating(false);
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
            {currentPage} / {totalPages}
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
            <TableOfContentsPage categories={tocCategories} />

            {/* Category Summary Pages - Dynamic based on content */}
            {pdfGenerating ? (
              // PDF Mode: Multiple pages with dynamic splitting
              categoryPages.map(({ categoryId, categoryLabel, pageLayouts }) => (
                <React.Fragment key={categoryId}>
                  {pageLayouts.map((layout) => (
                    <CategorySummaryPage
                      key={`${categoryId}-${layout.pageIndex}`}
                      categoryId={categoryId}
                      categoryLabel={categoryLabel}
                      clusters={layout.clusters}
                      pdfGenerating={pdfGenerating}
                      showHeader={layout.isFirstPage}
                    />
                  ))}
                </React.Fragment>
              ))
            ) : (
              // Screen Mode: Single page per category with all clusters (no item limit for carousel)
              Object.entries(CATEGORY_MAP).map(([categoryId, categoryLabel]) => {
                const categoryClusters = getTopClustersByCategory(clusters, Number(categoryId), 3);
                return (
                  <CategorySummaryPage
                    key={categoryId}
                    categoryId={Number(categoryId)}
                    categoryLabel={categoryLabel}
                    clusters={categoryClusters}
                    pdfGenerating={false}
                    showHeader={true}
                  />
                );
              })
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default WeeklyReportDialog;
