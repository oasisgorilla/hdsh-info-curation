import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import NewsCard from './NewsCard';
import type { NewsItem } from '../../types/news';

type NewsGridProps = {
  news: NewsItem[];
};

function NewsGrid({ news }: NewsGridProps) {
  const navigate = useNavigate();

  const handleNewsClick = (newsId: string) => {
    navigate(`/news/${newsId}`);
  };

  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      {news.map((item) => (
        <Grid key={item.news_id} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <NewsCard news={item} onClick={() => handleNewsClick(item.news_id)} />
        </Grid>
      ))}
    </Grid>
  );
}

export default NewsGrid;
