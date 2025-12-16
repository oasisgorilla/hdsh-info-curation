import { useState, useEffect, useMemo } from "react";
import { Box, Container, CircularProgress, Typography } from "@mui/material";
import Header from "../components/common/Header";
import HeroBanner from "../features/news/HeroBanner";
import NewsCount from "../features/news/NewsCount";
import HeadlineNewsGrid from "../features/news/HeadlineNewsGrid";
import Pagination from "../components/common/Pagination";
import { fetchHeadlineNews, searchHeadlineNews } from "../services/newsService";
import type { HeadlineNewsCluster } from "../types/news";

const ITEMS_PER_PAGE = 50;

const categoryMap: Record<string, number | undefined> = {
  전체: undefined,
  "국내 동향": 1,
  "중국 동향": 2,
  "해외 동향": 3,
  "원자재·RISK": 4,
  "기술·R&D": 5,
  "정책·규제": 6,
};

function HeadlineNewsPage() {
  const [activeTab, setActiveTab] = useState("뉴스");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const [clusters, setClusters] = useState<HeadlineNewsCluster[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [allSearchResults, setAllSearchResults] = useState<HeadlineNewsCluster[]>([]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // 현재 페이지에 표시할 데이터 계산
  const displayedClusters = useMemo(() => {
    if (isSearchMode) {
      // 검색 모드: 클라이언트 측 페이지네이션
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      return allSearchResults.slice(startIndex, endIndex);
    }
    // 일반 모드: 서버에서 이미 페이지별 데이터 받음
    return clusters;
  }, [isSearchMode, allSearchResults, clusters, currentPage]);

  useEffect(() => {
    const loadHeadlineNews = async () => {
      try {
        setLoading(true);
        setError(null);

        if (isSearchMode && searchQuery) {
          // === 검색 모드 ===
          const response = await searchHeadlineNews({
            q: searchQuery,
            limit: 200, // 백엔드 최대값
          });

          if (response.success && response.data) {
            let filteredClusters = response.data.items;

            // 카테고리 필터링 (클라이언트 측)
            const categoryId = categoryMap[selectedCategory];
            if (categoryId !== undefined) {
              filteredClusters = filteredClusters.filter(
                (cluster) => cluster.category_id === categoryId
              );
            }

            setAllSearchResults(filteredClusters);
            setTotalCount(filteredClusters.length);
          } else {
            setError(response.error || "검색에 실패했습니다.");
          }
        } else {
          // === 일반 모드 (기존 코드 유지) ===
          
          // const KST_OFFSET = 9 * 60 * 60 * 1000; // 9시간
          // const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
          // const yesterdayKST = new Date(
          //   Date.now() + KST_OFFSET - 24 * 60 * 60 * 1000
          // ).toISOString().split('T')[0];

          const categoryId = categoryMap[selectedCategory];
          const offset = (currentPage - 1) * ITEMS_PER_PAGE;

          const response = await fetchHeadlineNews({
            // created_at: yesterdayKST, // 해당 날짜의 헤드라인만 요청
            category_id: categoryId,
            offset,
            limit: ITEMS_PER_PAGE,
          });

          if (response.success && response.data) {
            setClusters(response.data.items);
            setTotalCount(response.data.total);
          } else {
            setError(response.error || "헤드라인 뉴스를 불러오는데 실패했습니다.");
          }
        }
      } catch (err) {
        setError("데이터를 불러오는데 실패했습니다.");
        console.error("Failed to load headline news:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHeadlineNews();
  }, [selectedCategory, currentPage, searchQuery, isSearchMode]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setSearchQuery(query);
      setIsSearchMode(true);
      setCurrentPage(1);
    } else {
      // 빈 검색어 -> 일반 모드로 복귀
      setSearchQuery("");
      setIsSearchMode(false);
      setCurrentPage(1);
      setAllSearchResults([]);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <HeroBanner
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
      />
      <Container component="main" maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <NewsCount count={totalCount} withIcon={true} />
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <>
            <HeadlineNewsGrid clusters={displayedClusters} />
            {totalPages > 0 && (
              <Box sx={{ mt: 6 }}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

export default HeadlineNewsPage;
