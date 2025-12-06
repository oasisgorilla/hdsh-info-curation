import { useState, useEffect } from "react";
import { Box, Container, CircularProgress, Typography } from "@mui/material";
import Header from "../components/common/Header";
import HeroBanner from "../features/news/HeroBanner";
import NewsCount from "../features/news/NewsCount";
import NewsGrid from "../features/news/NewsGrid";
import Pagination from "../components/common/Pagination";
import { fetchNewsList, searchNews } from "../services/newsService";
import type { NewsItem } from "../types/news";

const ITEMS_PER_PAGE = 50;

const categoryMap: Record<string, number | undefined> = {
  전체: undefined,
  "국내 동향": 1,
  "중국 동향": 2,
  "해외 동향": 3,
  "원자재 RISK": 4,
  "기술 R&D": 5,
  "정책 규제": 6,
};

function MainPage() {
  const [activeTab, setActiveTab] = useState("뉴스 검색");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchMode, setIsSearchMode] = useState(false);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);

        if (isSearchMode && searchQuery) {
          // 검색 모드
          const response = await searchNews({
            q: searchQuery,
            limit: 100,
          });

          // SearchNewsItem을 NewsItem으로 변환
          let convertedItems: NewsItem[] = response.items.map((item) => ({
            news_id: item.news_id,
            title: item.title,
            provider: item.provider,
            image_url: item.image_url,
            published_at: item.published_at,
            news_category_id: item.news_category_id,
          }));

          // 선택된 카테고리로 필터링
          const categoryId = categoryMap[selectedCategory];
          if (categoryId !== undefined) {
            convertedItems = convertedItems.filter(
              (item) => item.news_category_id === categoryId
            );
          }

          setNewsList(convertedItems);
          setTotalCount(convertedItems.length);
        } else {
          // 일반 목록 조회 모드
          const categoryId = categoryMap[selectedCategory];
          const offset = (currentPage - 1) * ITEMS_PER_PAGE;

          const response = await fetchNewsList({
            news_category_id: categoryId,
            offset,
            limit: ITEMS_PER_PAGE,
          });

          if (response.success && response.data) {
            setNewsList(response.data.items);
            setTotalCount(response.data.total);
          } else {
            setError(response.error || "뉴스를 불러오는데 실패했습니다.");
          }
        }
      } catch (err) {
        setError("뉴스를 불러오는데 실패했습니다.");
        console.error("Failed to fetch news:", err);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [selectedCategory, currentPage, isSearchMode, searchQuery]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setSearchQuery(query);
      setIsSearchMode(true);
      setCurrentPage(1);
    } else {
      setSearchQuery("");
      setIsSearchMode(false);
      setCurrentPage(1);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    // 검색 모드일 때는 검색 모드 유지
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
            <NewsGrid news={newsList} />
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

export default MainPage;
