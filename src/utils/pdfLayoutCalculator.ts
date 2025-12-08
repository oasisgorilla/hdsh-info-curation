import type { ClusteredNewsRead, ClusterPart } from '../types/report';

export const LAYOUT_CONSTANTS = {
  // 페이지 치수
  A4_HEIGHT_PX: 1123,          // 297mm × 3.7795
  A4_WIDTH_PX: 794,            // 210mm × 3.7795

  // 페이지 구조
  PAGE_PADDING_TOP: 32,        // Box p: 4
  PAGE_PADDING_BOTTOM: 32,
  PAGE_PADDING_HORIZONTAL: 32,

  // 헤더 바
  HEADER_HEIGHT: 70,           // 헤더 바 전체 높이

  // 클러스터 카드 구조
  CLUSTER_CARD_PADDING: 16,    // Card p: 2
  CLUSTER_SPACING: 16,         // Stack spacing: 2

  // 클러스터 내부 요소
  CLUSTER_TITLE_HEIGHT: 28,    // 제목 높이
  CLUSTER_INDEX_HEIGHT: 6,     // 인덱스 번호 추가 높이
  CLUSTER_META_HEIGHT: 32,     // 점수 + 규모 칩

  // 요약
  CLUSTER_SUMMARY_BASE_HEIGHT: 24,
  CLUSTER_SUMMARY_CHAR_PER_LINE: 100,
  CLUSTER_SUMMARY_LINE_HEIGHT: 20,
  CLUSTER_SUMMARY_MAX_HEIGHT: 100,

  // 뉴스 아이템 컨테이너
  NEWS_CONTAINER_PADDING: 12,   // p: 1.5
  NEWS_HEADER_HEIGHT: 24,       // "관련 뉴스" 캡션
  NEWS_ITEM_HEIGHT: 28,         // 뉴스 아이템 1개 높이
  NEWS_ITEM_SPACING: 6,         // Stack spacing: 0.75

  // Legacy constants (for backward compatibility)
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

/**
 * 컴포넌트 단위로 정밀하게 클러스터 높이 계산
 */
export function calculateClusterHeight(
  cluster: ClusteredNewsRead | ClusterPart,
  itemCount: number
): number {
  // 1. 제목 + 인덱스
  const titleHeight = LAYOUT_CONSTANTS.CLUSTER_TITLE_HEIGHT +
                      LAYOUT_CONSTANTS.CLUSTER_INDEX_HEIGHT;

  // 2. 메타 칩 (점수 + 규모)
  const metaHeight = LAYOUT_CONSTANTS.CLUSTER_META_HEIGHT;

  // 3. 요약 (텍스트 줄바꿈 추정)
  let summaryHeight = 0;
  if ('summary' in cluster && cluster.summary) {
    const charCount = cluster.summary.length;
    const estimatedLines = Math.ceil(charCount / LAYOUT_CONSTANTS.CLUSTER_SUMMARY_CHAR_PER_LINE);
    summaryHeight = LAYOUT_CONSTANTS.CLUSTER_SUMMARY_BASE_HEIGHT +
                    Math.min(
                      (estimatedLines - 1) * LAYOUT_CONSTANTS.CLUSTER_SUMMARY_LINE_HEIGHT,
                      LAYOUT_CONSTANTS.CLUSTER_SUMMARY_MAX_HEIGHT - LAYOUT_CONSTANTS.CLUSTER_SUMMARY_BASE_HEIGHT
                    );
  }

  // 4. 뉴스 아이템 컨테이너
  let newsContainerHeight = 0;
  if (itemCount > 0) {
    newsContainerHeight =
      LAYOUT_CONSTANTS.NEWS_CONTAINER_PADDING * 2 +
      LAYOUT_CONSTANTS.NEWS_HEADER_HEIGHT +
      (itemCount * LAYOUT_CONSTANTS.NEWS_ITEM_HEIGHT) +
      ((itemCount - 1) * LAYOUT_CONSTANTS.NEWS_ITEM_SPACING);
  }

  // 5. 카드 패딩
  const cardPadding = LAYOUT_CONSTANTS.CLUSTER_CARD_PADDING * 2;

  return titleHeight + metaHeight + summaryHeight + newsContainerHeight + cardPadding;
}

/**
 * 클러스터를 페이지 높이에 맞게 여러 파트로 분할
 */
export function splitCluster(
  cluster: ClusteredNewsRead,
  clusterIndex: number,
  availableHeight: number
): ClusterPart[] {
  const parts: ClusterPart[] = [];

  // 뉴스 아이템 없는 기본 높이
  const baseHeight = calculateClusterHeight(cluster, 0);

  // 연속 페이지 기본 높이 (제목만 축약)
  const continuationBaseHeight =
    LAYOUT_CONSTANTS.CLUSTER_TITLE_HEIGHT +
    LAYOUT_CONSTANTS.CLUSTER_INDEX_HEIGHT +
    LAYOUT_CONSTANTS.NEWS_CONTAINER_PADDING * 2 +
    LAYOUT_CONSTANTS.NEWS_HEADER_HEIGHT +
    LAYOUT_CONSTANTS.CLUSTER_CARD_PADDING * 2;

  // 아이템 1개당 높이
  const itemHeight = LAYOUT_CONSTANTS.NEWS_ITEM_HEIGHT + LAYOUT_CONSTANTS.NEWS_ITEM_SPACING;

  // 첫 페이지 용량
  const firstPartAvailableHeight = availableHeight - baseHeight;
  const firstPartItemCount = Math.max(1, Math.floor(firstPartAvailableHeight / itemHeight));

  // 모든 아이템이 들어가면 분할 불필요
  if (firstPartItemCount >= cluster.items.length) {
    return [{
      originalClusterId: cluster.id,
      category_id: cluster.category_id,
      representative_title: cluster.representative_title,
      score: cluster.score,
      size: cluster.size,
      summary: cluster.summary,
      items: cluster.items,
      isFirstPart: true,
      isContinuation: false,
      partNumber: 1,
      totalParts: 1,
      itemStartIndex: 0,
      itemEndIndex: cluster.items.length,
    }];
  }

  // 첫 페이지 파트
  let currentIndex = 0;
  parts.push({
    originalClusterId: cluster.id,
    category_id: cluster.category_id,
    representative_title: cluster.representative_title,
    score: cluster.score,
    size: cluster.size,
    summary: cluster.summary,
    items: cluster.items.slice(0, firstPartItemCount),
    isFirstPart: true,
    isContinuation: false,
    partNumber: 1,
    totalParts: 0,
    itemStartIndex: 0,
    itemEndIndex: firstPartItemCount,
  });

  currentIndex = firstPartItemCount;
  let partNumber = 2;

  // 연속 페이지 용량
  const continuationItemCapacity = Math.max(1, Math.floor(
    (availableHeight - continuationBaseHeight) / itemHeight
  ));

  // 연속 파트들
  while (currentIndex < cluster.items.length) {
    const endIndex = Math.min(
      currentIndex + continuationItemCapacity,
      cluster.items.length
    );

    parts.push({
      originalClusterId: cluster.id,
      category_id: cluster.category_id,
      representative_title: cluster.representative_title,
      score: cluster.score,
      size: cluster.size,
      summary: '',
      items: cluster.items.slice(currentIndex, endIndex),
      isFirstPart: false,
      isContinuation: true,
      partNumber,
      totalParts: 0,
      itemStartIndex: currentIndex,
      itemEndIndex: endIndex,
    });

    currentIndex = endIndex;
    partNumber++;
  }

  // totalParts 업데이트
  const totalParts = parts.length;
  parts.forEach(part => {
    part.totalParts = totalParts;
  });

  return parts;
}

/**
 * 클러스터 분할을 지원하는 카테고리 페이지 계산
 */
export function calculateCategoryPagesEnhanced(
  categoryId: number,
  clusters: ClusteredNewsRead[],
  startPageIndex: number
): import('../types/report').PageLayoutEnhanced[] {
  const pages: import('../types/report').PageLayoutEnhanced[] = [];

  if (clusters.length === 0) {
    return [{
      pageIndex: startPageIndex,
      clusterParts: [],
      isFirstPage: true,
      estimatedHeight: LAYOUT_CONSTANTS.HEADER_HEIGHT + LAYOUT_CONSTANTS.PAGE_PADDING_TOP,
    }];
  }

  let currentPage: import('../types/report').PageLayoutEnhanced = {
    pageIndex: startPageIndex,
    clusterParts: [],
    isFirstPage: true,
    estimatedHeight: LAYOUT_CONSTANTS.HEADER_HEIGHT + LAYOUT_CONSTANTS.PAGE_PADDING_TOP,
  };

  const maxPageHeight = LAYOUT_CONSTANTS.A4_HEIGHT_PX -
                        LAYOUT_CONSTANTS.PAGE_PADDING_TOP -
                        LAYOUT_CONSTANTS.PAGE_PADDING_BOTTOM;

  for (let clusterIndex = 0; clusterIndex < clusters.length; clusterIndex++) {
    const cluster = clusters[clusterIndex];
    const availableHeight = maxPageHeight - currentPage.estimatedHeight;

    // 클러스터 분할
    const clusterParts = splitCluster(cluster, clusterIndex, availableHeight);

    // 각 파트 처리
    for (const part of clusterParts) {
      const partHeight = calculateClusterHeight(part, part.items.length);

      // 현재 페이지에 들어가는지 확인
      if (currentPage.estimatedHeight + partHeight + LAYOUT_CONSTANTS.CLUSTER_SPACING > maxPageHeight) {
        // 현재 페이지 저장 및 새 페이지 시작
        if (currentPage.clusterParts.length > 0) {
          pages.push(currentPage);
        }

        currentPage = {
          pageIndex: startPageIndex + pages.length,
          clusterParts: [part],
          isFirstPage: false,
          estimatedHeight: LAYOUT_CONSTANTS.PAGE_PADDING_TOP + partHeight,
        };
      } else {
        // 현재 페이지에 추가
        currentPage.clusterParts.push(part);
        currentPage.estimatedHeight += partHeight + LAYOUT_CONSTANTS.CLUSTER_SPACING;
      }
    }
  }

  // 마지막 페이지 추가
  if (currentPage.clusterParts.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}
