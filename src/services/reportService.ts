import { apiClient } from '../lib/api';
import type { ReportResponse, ReportParams, ExecutiveSummaryResponse } from '../types/report';

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

export async function fetchExecutiveSummary(
  date: string
): Promise<ExecutiveSummaryResponse> {
  return apiClient.get<ExecutiveSummaryResponse>('/api/report/executive-summary', {
    params: { date }
  });
}
