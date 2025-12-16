import { useState, useEffect } from "react";
import { Box, Container, CircularProgress, Typography } from "@mui/material";
import Header from "../components/common/Header";
import HeroBanner from "../features/news/HeroBanner";
import NewsCount from "../features/news/NewsCount";
import HeadlineNewsGrid from "../features/news/HeadlineNewsGrid";
import Pagination from "../components/common/Pagination";
import { fetchHeadlineNews } from "../services/newsService";
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

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  useEffect(() => {
    const loadHeadlineNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const KST_OFFSET = 9 * 60 * 60 * 1000; // 9시간
        // const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const yesterdayKST = new Date(
          Date.now() + KST_OFFSET - 24 * 60 * 60 * 1000
        ).toISOString().split('T')[0];
        const categoryId = categoryMap[selectedCategory];
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;

        const response = await fetchHeadlineNews({
          created_at: yesterdayKST, // 백엔드에서 당일 헤드라인을 지원하지 않음
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
      } catch (err) {
        setError("헤드라인 뉴스를 불러오는데 실패했습니다.");
        console.error("Failed to fetch headline news:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHeadlineNews();
  }, [selectedCategory, currentPage]);

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
        onSearch={() => {}} // 검색 기능 비활성화
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
            <HeadlineNewsGrid clusters={clusters} />
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
