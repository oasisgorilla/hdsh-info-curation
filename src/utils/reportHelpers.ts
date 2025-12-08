import type { ClusteredNewsRead } from '../types/report';
import type { CategoryIssue } from '../features/report/ReportCard';

const CATEGORY_NAMES: Record<number, string> = {
  1: '국내동향',
  2: '중국동향',
  3: '해외동향',
  4: '원자재RISK',
  5: '기술R&D',
  6: '정책규제',
};

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
 * For now, returns static values since we only have 2025-12-02 data
 */
export function formatWeekInfo(_date: string): { weekNumber: number; dateRange: string } {
  // TODO: Implement proper week calculation when more data is available
  // For now, return week 48 for 2025-12-02
  return {
    weekNumber: 48,
    dateRange: '2025.11.25 - 12.01',
  };
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
