import { apiClient } from '../lib/api';
import type { ReportResponse, ReportParams } from '../types/report';

export async function fetchReport(
  params: ReportParams
): Promise<ReportResponse> {
  return apiClient.get<ReportResponse>('/api/report', {
    params: {
      date: params.date,
      category_id: params.category_id,
    },
  });
}
