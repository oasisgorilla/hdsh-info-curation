import { useState, useEffect } from 'react';
import { Box, Container, Stack, CircularProgress, Alert } from '@mui/material';
import Header from '../components/common/Header';
import ReportHeroBanner from '../features/report/ReportHeroBanner';
import ReportCount from '../features/report/ReportCount';
import ReportCard, { type CategoryIssue } from '../features/report/ReportCard';
import WeeklyReportDialog from '../features/report/WeeklyReportDialog';
import { fetchReport } from '../services/reportService';
import { extractTopKeywords, groupIssuesByCategory, getMaxIssueSize } from '../utils/reportHelpers';

type ReportData = {
  weekNumber: number;
  dateRange: string;
  keywords: string[];
  categories: CategoryIssue[];
};

function WeeklyReportPage() {
  const [activeTab, setActiveTab] = useState('주간 보고서');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalReports, setTotalReports] = useState(0);

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
          const keywords = extractTopKeywords(response.data, 4);

          // Group issues by category
          const categories = groupIssuesByCategory(response.data);

          // Get max size for normalization
          getMaxIssueSize(response.data);

          // Create report data
          const report: ReportData = {
            weekNumber: 48,
            dateRange: '2025.11.25 - 12.01',
            keywords,
            categories,
          };

          setReportData(report);
          setTotalReports(1); // Currently only 1 report available
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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <ReportHeroBanner />
      <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <ReportCount count={totalReports} withIcon={true} />
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
          <Stack spacing={3}>
            <ReportCard
              weekNumber={reportData.weekNumber}
              dateRange={reportData.dateRange}
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
