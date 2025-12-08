import type { ClusteredNewsRead } from '../types/report';

export const LAYOUT_CONSTANTS = {
  A4_HEIGHT_PX: 1053, // 297mm - 64px(padding) ≈ 1053px
  HEADER_HEIGHT: 80, // Header Bar 높이
  CLUSTER_BASE_HEIGHT: 120, // 제목 + 메타정보 + 요약 기본 높이
  NEWS_ITEM_HEIGHT: 30, // 뉴스 아이템 1개 높이
  STACK_SPACING: 16, // 클러스터 간 간격
  PAGE_PADDING: 64, // 상하 padding (32*2)
};

export interface PageLayout {
  pageIndex: number; // 전체 리포트 내 페이지 번호
  clusters: ClusteredNewsRead[]; // 해당 페이지에 포함될 클러스터들
  isFirstPage: boolean; // Header Bar 포함 여부
}

/**
 * 클러스터의 예상 높이 계산
 * @param cluster 클러스터 데이터
 * @param includeAllItems true: 모든 뉴스 아이템 포함, false: 최대 3개만
 * @returns 예상 높이 (px)
 */
export function estimateClusterHeight(
  cluster: ClusteredNewsRead,
  includeAllItems: boolean = true
): number {
  const itemCount = includeAllItems
    ? cluster.items.length
    : Math.min(cluster.items.length, 3);

  // 요약 텍스트 높이 추정 (대략 80자당 20px, 최대 100px)
  const summaryHeight = cluster.summary
    ? Math.min(cluster.summary.length / 80 * 20, 100)
    : 0;

  const totalHeight =
    LAYOUT_CONSTANTS.CLUSTER_BASE_HEIGHT +
    summaryHeight +
    (itemCount * LAYOUT_CONSTANTS.NEWS_ITEM_HEIGHT) +
    32; // Card padding

  // 클러스터가 페이지 높이를 초과하는 경우 경고
  if (totalHeight > LAYOUT_CONSTANTS.A4_HEIGHT_PX - LAYOUT_CONSTANTS.PAGE_PADDING) {
    console.warn(
      `Cluster ${cluster.id} exceeds single page height (${totalHeight}px). ` +
      `Content may be clipped.`
    );
    // 최대 높이로 제한 (오버플로우 허용)
    return LAYOUT_CONSTANTS.A4_HEIGHT_PX - LAYOUT_CONSTANTS.PAGE_PADDING - 50;
  }

  return totalHeight;
}

/**
 * 카테고리별 페이지 분할 계산
 * 클러스터 통째로 한 페이지에 유지하는 방식
 * @param _categoryId 카테고리 ID (현재 미사용)
 * @param clusters 해당 카테고리의 클러스터 목록
 * @param startPageIndex 시작 페이지 번호
 * @returns 페이지 레이아웃 배열
 */
export function calculateCategoryPages(
  _categoryId: number,
  clusters: ClusteredNewsRead[],
  startPageIndex: number
): PageLayout[] {
  const pages: PageLayout[] = [];

  // 빈 카테고리 처리
  if (clusters.length === 0) {
    return [
      {
        pageIndex: startPageIndex,
        clusters: [],
        isFirstPage: true,
      },
    ];
  }

  let currentPage: PageLayout = {
    pageIndex: startPageIndex,
    clusters: [],
    isFirstPage: true,
  };

  // 첫 페이지는 Header Bar 포함
  let currentHeight = LAYOUT_CONSTANTS.HEADER_HEIGHT + LAYOUT_CONSTANTS.PAGE_PADDING;

  for (const cluster of clusters) {
    const clusterHeight = estimateClusterHeight(cluster, true); // 모든 아이템 포함

    // 클러스터 통째로 페이지에 들어가는지 체크
    if (currentHeight + clusterHeight > LAYOUT_CONSTANTS.A4_HEIGHT_PX) {
      // 현재 페이지 완료 (클러스터가 있는 경우에만)
      if (currentPage.clusters.length > 0) {
        pages.push(currentPage);
      }

      // 새 페이지 시작 (Header Bar 없음)
      currentPage = {
        pageIndex: startPageIndex + pages.length,
        clusters: [cluster],
        isFirstPage: false,
      };
      currentHeight = LAYOUT_CONSTANTS.PAGE_PADDING + clusterHeight;
    } else {
      // 현재 페이지에 클러스터 추가
      currentPage.clusters.push(cluster);
      currentHeight += clusterHeight + LAYOUT_CONSTANTS.STACK_SPACING;
    }
  }

  // 마지막 페이지 추가
  if (currentPage.clusters.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}
