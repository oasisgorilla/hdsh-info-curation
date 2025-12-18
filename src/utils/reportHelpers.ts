import type { ClusteredNewsRead, CategoryStat } from '../types/report';
import type { CategoryIssue } from '../features/report/ReportCard';

const CATEGORY_NAMES: Record<number, string> = {
  1: '국내동향',
  2: '중국동향',
  3: '해외동향',
  4: '원자재·RISK',
  5: '기술·R&D',
  6: '정책·규제',
};

export { CATEGORY_NAMES };

/**
 * Extract top 3 keywords (representative_title) with the highest size across all categories
 */
export function extractTopKeywords(data: ClusteredNewsRead[], topN: number = 3): string[] {
  // Sort all issues by size in descending order
  const sortedBySize = [...data].sort((a, b) => b.size - a.size);

  // Get top N representative titles
  return sortedBySize.slice(0, topN).map(item => item.representative_title);
}

/**
 * Group issues by category_id and organize them for display
 */
export function groupIssuesByCategory(data: ClusteredNewsRead[]): CategoryIssue[] {
  // Group data by category_id
  const grouped = data.reduce((acc, item) => {
    if (!acc[item.category_id]) {
      acc[item.category_id] = [];
    }
    acc[item.category_id].push(item);
    return acc;
  }, {} as Record<number, ClusteredNewsRead[]>);

  // Convert to CategoryIssue array with issue count as size
  return Object.entries(grouped).map(([categoryId, issues]) => ({
    categoryId: Number(categoryId),
    categoryName: CATEGORY_NAMES[Number(categoryId)] || '기타',
    issues: [
      {
        id: Number(categoryId),
        title: '',
        size: issues.length,
      }
    ],
  }));
}

/**
 * Calculate the max issue count across all categories for normalization
 */
export function getMaxIssueSize(data: ClusteredNewsRead[]): number {
  // Group by category and count issues per category
  const grouped = data.reduce((acc, item) => {
    acc[item.category_id] = (acc[item.category_id] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Return the maximum count
  return Math.max(...Object.values(grouped), 1);
}

/**
 * Format date to week number and date range
 * Calculates week number from the start of the year
 * Returns date range as 7 days ending on the given date
 */
export function formatWeekInfo(dateString: string): { weekNumber: number; dateRange: string } {
  const date = new Date(dateString);

  // Calculate week number
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);

  // Calculate date range (7 days ending on the given date)
  const endDate = new Date(dateString);
  const startDate = new Date(endDate.getTime() - 6 * 24 * 60 * 60 * 1000);

  const formatDate = (d: Date) => {
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${month}.${day}`;
  };

  const dateRange = `2025.${formatDate(startDate)} - ${formatDate(endDate)}`;

  return { weekNumber, dateRange };
}

/**
 * Aggregate total news and issues from clusters
 */
export function aggregateReportStats(clusters: ClusteredNewsRead[]): { totalNews: number; totalIssues: number } {
  const totalNews = clusters.reduce((sum, cluster) => sum + cluster.items.length, 0);
  const totalIssues = clusters.length;
  return { totalNews, totalIssues };
}

/**
 * Get top N clusters for a specific category, sorted by score
 * Optionally limits news items per cluster
 */
export function getTopClustersByCategory(
  clusters: ClusteredNewsRead[],
  categoryId: number,
  limit: number = 3,
  maxItemsPerCluster?: number
): ClusteredNewsRead[] {
  return clusters
    .filter(c => c.category_id === categoryId)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, limit)
    .map(cluster => ({
      ...cluster,
      items: maxItemsPerCluster ? cluster.items.slice(0, maxItemsPerCluster) : cluster.items
    }));
}

/**
 * Generate category ranking text sorted by this_week_ratio descending
 * Returns: { top3: "국내동향(29%), 해외동향(23%), 중국동향(20%)", bottom3: "기술·R&D(16%), 정책·규제(12%)" }
 */
export function generateCategoryRankingText(
  categoryStats: Record<string, CategoryStat>
): { top3: string; bottom3: string } {
  // Convert to array and sort by this_week_ratio descending
  const sorted = Object.entries(categoryStats)
    .map(([categoryId, stat]) => ({
      categoryId: Number(categoryId),
      categoryName: CATEGORY_NAMES[Number(categoryId)] || '기타',
      ratio: stat.this_week_ratio,
    }))
    .sort((a, b) => b.ratio - a.ratio);

  // Format top 3
  const top3 = sorted
    .slice(0, 3)
    .map(item => `${item.categoryName}(${Math.round(item.ratio)}%)`)
    .join(', ');

  // Format bottom 3
  const bottom3 = sorted
    .slice(-3)
    .reverse()
    .map(item => `${item.categoryName}(${Math.round(item.ratio)}%)`)
    .join(', ');

  return { top3, bottom3 };
}

/**
 * Generate increase/decrease mention text
 * Only includes categories where diff_ratio !== 0
 * Returns: { increases: "국내동향(+15%)과 중국동향(+12%)", decreases: "정책·규제(+5%) 원자재·리스크(-3%)" }
 */
export function generateDiffRatioText(
  categoryStats: Record<string, CategoryStat>
): { increases: string; decreases: string } {
  // Filter increases (diff_ratio > 0)
  const increases = Object.entries(categoryStats)
    .filter(([, stat]) => stat.diff_ratio > 0)
    .map(([categoryId, stat]) => ({
      categoryName: CATEGORY_NAMES[Number(categoryId)] || '기타',
      ratio: stat.diff_ratio,
    }))
    .sort((a, b) => b.ratio - a.ratio);

  // Filter decreases (diff_ratio < 0)
  const decreases = Object.entries(categoryStats)
    .filter(([, stat]) => stat.diff_ratio < 0)
    .map(([categoryId, stat]) => ({
      categoryName: CATEGORY_NAMES[Number(categoryId)] || '기타',
      ratio: stat.diff_ratio,
    }))
    .sort((a, b) => a.ratio - b.ratio);

  // Format increases text
  const increasesText = increases.length > 0
    ? increases
        .map((item, index) => {
          const connector = index === increases.length - 1 && increases.length > 1 ? '' : index === increases.length - 2 ? '과 ' : ', ';
          return `${item.categoryName}(${item.ratio > 0 ? '+' : ''}${Math.round(item.ratio)}%)${connector}`;
        })
        .join('')
        .replace(/, $/, '')
    : '';

  // Format decreases text
  const decreasesText = decreases.length > 0
    ? decreases
        .map((item, index) => {
          const connector = index === decreases.length - 1 && decreases.length > 1 ? '' : index === decreases.length - 2 ? ' ' : ', ';
          return `${item.categoryName}(${Math.round(item.ratio)}%)${connector}`;
        })
        .join('')
        .replace(/, $/, '')
    : '';

  return { increases: increasesText, decreases: decreasesText };
}

/**
 * Calculate issue/news count delta and determine "증가" or "감소"
 */
export function calculateDelta(current: number, previous: number): {
  delta: number;
  text: string;
} {
  const delta = current - previous;
  const absDelta = Math.abs(delta);
  const text = delta >= 0 ? '증가' : '감소';
  return { delta: absDelta, text };
}
