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
  reportDate: string; // Added to track the API date parameter
};

// Helper function to generate report dates (every Saturday from 2025-12-07)
function generateReportDates(): string[] {
  const dates: string[] = [];
  const startDate = new Date('2025-12-07');
  const today = new Date();

  let currentDate = new Date(startDate);

  while (currentDate <= today) {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);

    // Add 7 days for next week
    currentDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  }

  return dates.reverse(); // Most recent first
}

// Helper function to get week number from date
function getWeekNumber(dateString: string): number {
  const date = new Date(dateString);
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

// Helper function to get date range (7 days ending on the given date)
function getDateRange(endDateString: string): string {
  const endDate = new Date(endDateString);
  const startDate = new Date(endDate.getTime() - 6 * 24 * 60 * 60 * 1000);

  const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}.${day}`;
  };

  return `2025.${formatDate(startDate)} - ${formatDate(endDate)}`;
}

function WeeklyReportPage() {
  const [activeTab, setActiveTab] = useState('주간 보고서');
  const [reportDataList, setReportDataList] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalReports, setTotalReports] = useState(0);

  // Dialog state for Weekly Report Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReportDate, setSelectedReportDate] = useState<string>('');

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        setError(null);

        const reportDates = generateReportDates();
        const reports: ReportData[] = [];

        // Fetch all reports
        for (const date of reportDates) {
          try {
            const response = await fetchReport({ date });

            if (response.success && response.data) {
              // Extract top 4 keywords by size
              const keywords = extractTopKeywords(response.data, 4);

              // Group issues by category
              const categories = groupIssuesByCategory(response.data);

              // Get max size for normalization
              getMaxIssueSize(response.data);

              // Create report data
              const report: ReportData = {
                weekNumber: getWeekNumber(date),
                dateRange: getDateRange(date),
                keywords,
                categories,
                reportDate: date,
              };

              reports.push(report);
            }
          } catch (err) {
            console.error(`Failed to fetch report for ${date}:`, err);
            // Continue fetching other reports even if one fails
          }
        }

        setReportDataList(reports);
        setTotalReports(reports.length);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
        setError('보고서를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const handleDownload = (weekNumber: number) => {
    console.log(`다운로드: ${weekNumber}주차 리포트`);
  };

  const handleToggle = (reportDate: string) => {
    setSelectedReportDate(reportDate);
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
        {!loading && !error && reportDataList.length > 0 && (
          <Stack spacing={3}>
            {reportDataList.map((report) => (
              <ReportCard
                key={report.reportDate}
                weekNumber={report.weekNumber}
                dateRange={report.dateRange}
                keywords={report.keywords}
                categories={report.categories.map(category => ({
                  ...category,
                  issues: category.issues.map(issue => ({
                    ...issue,
                    // Normalize size relative to maxSize
                    size: issue.size
                  }))
                }))}
                onDownload={() => handleDownload(report.weekNumber)}
                onToggle={() => handleToggle(report.reportDate)}
              />
            ))}
          </Stack>
        )}

        {/* No Reports State */}
        {!loading && !error && reportDataList.length === 0 && (
          <Alert severity="info">
            생성된 주간 보고서가 없습니다.
          </Alert>
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
