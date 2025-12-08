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

/**
 * 클러스터가 여러 페이지로 분할될 때 각 부분을 나타냄
 */
export interface ClusterPart {
  originalClusterId: number;
  category_id: number;
  representative_title: string;
  score: number;
  size: number;
  summary: string;
  items: ClusteredNewsItem[];

  // 분할 메타데이터
  isFirstPart: boolean;       // 첫 번째 파트인지
  isContinuation: boolean;    // 이전 페이지에서 계속되는 파트인지
  partNumber: number;         // 파트 번호 (1, 2, 3, ...)
  totalParts: number;         // 총 파트 개수
  itemStartIndex: number;     // 원본 클러스터의 아이템 배열에서 시작 인덱스
  itemEndIndex: number;       // 원본 클러스터의 아이템 배열에서 종료 인덱스 (exclusive)
}

/**
 * 향상된 페이지 레이아웃 (클러스터 분할 지원)
 */
export interface PageLayoutEnhanced {
  pageIndex: number;
  clusterParts: ClusterPart[];  // clusters 대신 clusterParts 사용
  isFirstPage: boolean;
  estimatedHeight: number;      // 디버깅용 예상 높이
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
  categoryId?: number;
  categoryLabel: string;
  clusters?: ClusteredNewsRead[]; // 화면 모드용 (하위 호환성)
  clusterParts?: ClusterPart[]; // PDF 모드용 (분할 지원)
  pdfGenerating?: boolean; // PDF generation mode flag
  showHeader?: boolean; // Show header bar (only first page)
}
