import { apiClient } from '../lib/api';
import type {
  ApiResponse,
  NewsListResponse,
  NewsListParams,
  NewsSearchResponse,
  NewsSearchParams,
  NewsDetailItem
} from '../types/news';

export async function fetchNewsList(
  params?: NewsListParams
): Promise<ApiResponse<NewsListResponse>> {
  return apiClient.get<ApiResponse<NewsListResponse>>('/api/news/', {
    params: {
      start_date: params?.start_date,
      end_date: params?.end_date,
      news_category_id: params?.news_category_id,
      source: params?.source,
      offset: params?.offset,
      limit: params?.limit,
    },
  });
}

export async function searchNews(
  params?: NewsSearchParams
): Promise<NewsSearchResponse> {
  return apiClient.get<NewsSearchResponse>('/api/search/news', {
    params: {
      q: params?.q,
      limit: params?.limit,
      source: params?.source,
    },
  });
}

export async function fetchNewsDetail(
  newsId: string
): Promise<ApiResponse<NewsDetailItem>> {
  return apiClient.get<ApiResponse<NewsDetailItem>>(`/api/news/${newsId}`);
}
