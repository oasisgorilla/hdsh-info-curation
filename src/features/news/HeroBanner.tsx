import { Box, Container, Typography, Stack } from "@mui/material";
import SearchBar from "../../components/common/SearchBar";
import CategoryFilter from "../../components/atomic/CategoryFilter";
import { colors } from "../../styles/theme";

type HeroBannerProps = {
  onSearch?: (query: string) => void;
  onCategoryChange?: (category: string) => void;
  selectedCategory?: string;
};

function HeroBanner({
  onSearch,
  onCategoryChange,
  selectedCategory,
}: HeroBannerProps) {
  const categories = [
    "전체",
    "국내 동향",
    "중국 동향",
    "해외 동향",
    "원자재 RISK",
    "기술 R&D",
    "정책 규제",
  ];

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        background: colors.primary.main,
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 8, sm: 10, md: 12 } }}>
        {/* Title section */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h1"
            sx={{ fontWeight: 700, color: "#F7A600", mb: 2 }}
          >
            조선업 정보 큐레이션 AI 시스템
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255, 255, 255, 0.85)" }}
          >
            조선 산업의 최신 뉴스와 주간 이슈 분석을 한눈에
          </Typography>
        </Box>

        {/* Search bar and Category filters */}
        <Box sx={{ maxWidth: 720, mx: "auto" }}>
          {/* Search bar */}
          <Box sx={{ mb: 4 }}>
            <SearchBar onSearch={onSearch} />
          </Box>

          {/* Category filters */}
          <Stack
            direction="row"
            flexWrap="wrap"
            justifyContent="center"
            alignItems="center"
            spacing={1.5}
            sx={{ gap: 1 }}
          >
            {categories.map((category) => (
              <CategoryFilter
                key={category}
                label={category}
                selected={selectedCategory === category}
                onClick={() => onCategoryChange?.(category)}
              />
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default HeroBanner;
