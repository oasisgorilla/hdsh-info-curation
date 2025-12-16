import { apiClient } from '../lib/api';
import type {
  ApiResponse,
  NewsListResponse,
  NewsListParams,
  NewsSearchResponse,
  NewsSearchParams,
  NewsDetailItem,
  HeadlineNewsParams,
  HeadlineNewsClusterResponse
} from '../types/news';

// LEGACY: '뉴스 검색' 탭(MainPage)에서 계속 사용됨. 신규 헤드라인은 fetchHeadlineNews 사용
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

export async function fetchHeadlineNews(
  params?: HeadlineNewsParams
): Promise<ApiResponse<HeadlineNewsClusterResponse>> {
  return apiClient.get<ApiResponse<HeadlineNewsClusterResponse>>('/api/news/headline', {
    params: {
      created_at: params?.created_at,
      start_date: params?.start_date,
      end_date: params?.end_date,
      category_id: params?.category_id,
      offset: params?.offset,
      limit: params?.limit,
    },
  });
}
