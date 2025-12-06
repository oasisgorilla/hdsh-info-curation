export type NewsSource = 'K' | 'F';

export interface NewsItem {
  news_id: string;
  title: string;
  provider: string;
  image_url: string;
  published_at: string;
  news_category_id: number;
}

export interface NewsListResponse {
  total: number;
  items: NewsItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface NewsListParams {
  start_date?: string | null;
  end_date?: string | null;
  news_category_id?: number | null;
  source?: NewsSource | null;
  offset?: number;
  limit?: number;
}

export interface SearchNewsItem {
  news_id: string;
  title: string;
  summary: string;
  source: string;
  provider: string;
  image_url: string;
  news_category_id: number;
  published_at: string;
  score: number;
}

export interface NewsSearchResponse {
  keyword: string;
  total: number;
  items: SearchNewsItem[];
}

export interface NewsSearchParams {
  q?: string | null;
  limit?: number;
  source?: NewsSource | null;
}

export interface NewsDetailItem {
  news_id: string;
  title: string;
  content: string;
  summary: string;
  source: string;
  provider: string;
  news_category_id: number;
  published_at: string;
  image_url: string;
  origin_url: string;
}
