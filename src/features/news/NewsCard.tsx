import { Card, CardMedia, CardContent, Box, Typography } from "@mui/material";
import Tag from "../../components/atomic/Tag";
import type { NewsItem } from "../../types/news";

type TagVariant =
  | "domestic"
  | "overseas"
  | "market"
  | "rnd"
  | "risk"
  | "regulation";

export type NewsCardProps = {
  news: NewsItem;
  onClick?: () => void;
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
  return `${year}-${month}-${day}`;
}

function NewsCard({ news, onClick }: NewsCardProps) {
  const tag = categoryToTag[news.news_category_id] || "domestic";
  const tagLabel = categoryLabels[news.news_category_id] || "";
  const formattedDate = formatDate(news.published_at);
  return (
    <Card
      component="article"
      onClick={onClick}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: 4,
          borderColor: "grey.300",
        },
        "& .MuiCardMedia-root": {
          transition: "transform 0.3s",
        },
        "&:hover .MuiCardMedia-root": {
          transform: "scale(1.05)",
        },
      }}
    >
      {/* Thumbnail */}
      <Box sx={{ overflow: "hidden", bgcolor: "grey.100" }}>
        <CardMedia
          component="img"
          image={
            news.image_url ||
            "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?w=400&h=300&fit=crop"
          }
          alt={news.title}
          sx={{
            aspectRatio: "16 / 9",
            objectFit: "cover",
          }}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </Box>

      {/* Content */}
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            mb: 1,
          }}
        >
          <Tag variant={tag} label={tagLabel} />
          <Typography
            component="time"
            variant="caption"
            sx={{ color: "text.secondary" }}
            dateTime={formattedDate}
          >
            {formattedDate}
          </Typography>
        </Box>

        {/* Title */}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.4,
          }}
        >
          {news.title}
        </Typography>

        {/* Source */}
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", mt: "auto" }}
        >
          {news.provider}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default NewsCard;
