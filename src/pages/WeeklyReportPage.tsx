import { useState, useEffect } from 'react';
import { Box, Container, Stack, CircularProgress, Alert } from '@mui/material';
import Header from '../components/common/Header';
import ReportHeroBanner from '../features/report/ReportHeroBanner';
import ReportCount from '../features/report/ReportCount';
import ReportCard, { type CategoryIssue } from '../features/report/ReportCard';
import Pagination from '../components/common/Pagination';
import WeeklyReportDialog from '../features/report/WeeklyReportDialog';
import { fetchReport } from '../services/reportService';
import { extractTopKeywords, groupIssuesByCategory, getMaxIssueSize } from '../utils/reportHelpers';

type ReportData = {
  weekNumber: number;
  dateRange: string;
  status: '완료됨' | '읽음';
  keywords: string[];
  categories: CategoryIssue[];
};

function WeeklyReportPage() {
  const [activeTab, setActiveTab] = useState('주간 보고서');
  const [currentPage, setCurrentPage] = useState(1);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const totalPages = 12;

  // Dialog state for Weekly Report Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReportDate, setSelectedReportDate] = useState<string>('');

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch report for 2025-12-02 (only available data for now)
        const response = await fetchReport({ date: '2025-12-02' });

        if (response.success && response.data) {
          // Extract top 3 keywords by size
          const keywords = extractTopKeywords(response.data, 3);

          // Group issues by category
          const categories = groupIssuesByCategory(response.data);

          // Get max size for normalization
          getMaxIssueSize(response.data);

          // Create report data
          const report: ReportData = {
            weekNumber: 48,
            dateRange: '2025.11.25 - 12.01',
            status: '완료됨',
            keywords,
            categories,
          };

          setReportData(report);
        } else {
          setError(response.error || '데이터를 불러올 수 없습니다.');
        }
      } catch (err) {
        console.error('Failed to fetch report:', err);
        setError('보고서를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, []);

  const handleDownload = (weekNumber: number) => {
    console.log(`다운로드: ${weekNumber}주차 리포트`);
  };

  const handleToggle = () => {
    // Currently only 2025-12-02 data is available
    setSelectedReportDate('2025-12-02');
    setDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <ReportHeroBanner />
      <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <ReportCount count={48} withIcon={true} />
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Report Data */}
        {!loading && !error && reportData && (
          <>
            <Stack spacing={3}>
              <ReportCard
                weekNumber={reportData.weekNumber}
                dateRange={reportData.dateRange}
                status={reportData.status}
                keywords={reportData.keywords}
                categories={reportData.categories.map(category => ({
                  ...category,
                  issues: category.issues.map(issue => ({
                    ...issue,
                    // Normalize size relative to maxSize
                    size: issue.size
                  }))
                }))}
                onDownload={() => handleDownload(reportData.weekNumber)}
                onToggle={() => handleToggle()}
              />
            </Stack>
            <Box sx={{ mt: 6 }}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </Box>
          </>
        )}
      </Container>

      {/* Weekly Report Dialog */}
      <WeeklyReportDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        date={selectedReportDate}
      />
    </Box>
  );
}

export default WeeklyReportPage;
