import { useState, useEffect } from 'react';
import { fetchReport } from '../services/reportService';
import type { ClusteredNewsRead } from '../types/report';

/**
 * Custom hook to fetch weekly report data
 * Follows the existing loading/error pattern from WeeklyReportPage
 */
export function useWeeklyReport(date: string) {
  const [clusters, setClusters] = useState<ClusteredNewsRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReportData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch report data with category_id null to get all categories
        const response = await fetchReport({ date, category_id: null });

        if (response.success && response.data) {
          setClusters(response.data);
        } else {
          setError(response.error || '리포트 데이터를 불러올 수 없습니다.');
        }
      } catch (err) {
        console.error('Failed to fetch weekly report:', err);
        setError('리포트를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (date) {
      loadReportData();
    }
  }, [date]);

  return { clusters, loading, error };
}
