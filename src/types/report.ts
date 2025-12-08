export interface ClusteredNewsItem {
  news_id: string;
  title: string;
  origin_url: string;
}

export interface ClusteredNewsRead {
  id: number;
  category_id: number;
  created_at: string;
  representative_title: string;
  score: number;
  size: number;
  summary: string;
  title: string;
  items: ClusteredNewsItem[];
}

export interface ReportResponse {
  success: boolean;
  data: ClusteredNewsRead[];
  error?: string;
}

export interface ReportParams {
  date: string; // YYYY-MM-DD format
  category_id?: number | null;
}

export const CATEGORY_MAP = {
  1: '국내동향',
  2: '중국동향',
  3: '해외동향',
  4: '원자재·RISK',
  5: '기술·R&D',
  6: '정책·규제',
} as const;

export type CategoryId = keyof typeof CATEGORY_MAP;

// Weekly Report Dialog Props
export interface WeeklyReportDialogProps {
  open: boolean;
  onClose: () => void;
  date: string; // YYYY-MM-DD format
}

// Cover Page Props
export interface CoverPageProps {
  weekNumber: number;
  dateRange: string; // "YYYY.MM.DD ~ YYYY.MM.DD"
  totalNews: number;
  totalIssues: number;
}

// Table of Contents Props
export interface TableOfContentsPageProps {
  categories: Array<{ id: number; label: string; pageNumber: number }>;
}

// Category Summary Page Props
export interface CategorySummaryPageProps {
  categoryId: number;
  categoryLabel: string;
  clusters: ClusteredNewsRead[]; // Already filtered and sorted top 3
}
