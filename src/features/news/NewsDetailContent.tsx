import {
  Box,
  Card,
  CardMedia,
  Typography,
  Divider,
  Stack,
  Link,
  Chip,
} from "@mui/material";
import {
  OpenInNew as OpenInNewIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  Source as SourceIcon,
} from "@mui/icons-material";
import Tag from "../../components/atomic/Tag";
import type { NewsDetailItem } from "../../types/news";

type TagVariant =
  | "domestic"
  | "overseas"
  | "market"
  | "rnd"
  | "risk"
  | "regulation";

type NewsDetailContentProps = {
  news: NewsDetailItem;
};

const categoryToTag: Record<number, TagVariant> = {
  1: "domestic",
  2: "domestic",
  3: "overseas",
  4: "risk",
  5: "rnd",
  6: "regulation",
};

const categoryLabels: Record<number, string> = {
  1: "국내 동향",
  2: "중국 동향",
  3: "해외 동향",
  4: "원자재 RISK",
  5: "기술 R&D",
  6: "정책 규제",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
}

function NewsDetailContent({ news }: NewsDetailContentProps) {
  const tag = categoryToTag[news.news_category_id] || "domestic";
  const tagLabel = categoryLabels[news.news_category_id] || "";
  const formattedDate = formatDate(news.published_at);

  return (
    <Card sx={{ overflow: "hidden" }}>
      {/* Hero Image */}
      {news.image_url && (
        <CardMedia
          component="img"
          image={news.image_url}
          alt={news.title}
          sx={{
            width: "100%",
            maxHeight: 500,
            objectFit: "cover",
          }}
          referrerPolicy="no-referrer"
        />
      )}

      {/* Content */}
      <Box sx={{ p: { xs: 3, md: 5 } }}>
        {/* Category Tag */}
        <Box sx={{ mb: 2 }}>
          <Tag variant={tag} label={tagLabel} />
        </Box>

        {/* Title */}
        <Typography
          variant="h1"
          component="h1"
          sx={{
            mb: 3,
            fontSize: { xs: "1.75rem", md: "2.25rem" },
            fontWeight: 700,
            lineHeight: 1.3,
            color: "text.primary",
          }}
        >
          {news.title}
        </Typography>

        {/* Metadata */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 3 }}
          divider={<Divider orientation="vertical" flexItem />}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BusinessIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              {news.provider}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              {formattedDate}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SourceIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              {news.source}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Summary */}
        {news.summary && (
          <Box
            sx={{
              p: 3,
              mb: 4,
              bgcolor: "grey.50",
              borderRadius: '5px',
              borderLeft: 4,
              borderColor: "primary.main",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: 1,
                color: "primary.main",
              }}
            >
              요약
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.primary",
                lineHeight: 1.8,
              }}
            >
              {news.summary}
            </Typography>
          </Box>
        )}

        {/* Main Content */}
        <Typography
          variant="body1"
          component="div"
          sx={{
            mb: 4,
            lineHeight: 1.8,
            color: "text.primary",
            whiteSpace: "pre-wrap",
            "& p": {
              mb: 2,
            },
          }}
        >
          {news.content}
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* Original Article Link */}
        {news.origin_url && (
          <Box sx={{ textAlign: "center" }}>
            <Link
              href={news.origin_url}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
            >
              <Chip
                label="원문 기사 보기"
                icon={<OpenInNewIcon sx={{ color: "white !important" }} />}
                clickable
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  fontWeight: 600,
                  px: 2,
                  py: 3,
                  fontSize: "0.9375rem",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              />
            </Link>
          </Box>
        )}
      </Box>
    </Card>
  );
}

export default NewsDetailContent;
