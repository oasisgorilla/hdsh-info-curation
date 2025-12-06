import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  CircularProgress,
  Button,
  Alert,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import Header from '../components/common/Header';
import NewsDetailContent from '../features/news/NewsDetailContent';
import { fetchNewsDetail } from '../services/newsService';
import type { NewsDetailItem } from '../types/news';

function NewsDetailPage() {
  const { newsId } = useParams<{ newsId: string }>();
  const navigate = useNavigate();
  const [newsDetail, setNewsDetail] = useState<NewsDetailItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNewsDetail = async () => {
      if (!newsId) {
        setError('뉴스 ID가 없습니다.');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetchNewsDetail(newsId);

        if (response.success && response.data) {
          setNewsDetail(response.data);
        } else {
          setError(response.error || '뉴스를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        setError('뉴스를 불러오는데 실패했습니다.');
        console.error('Failed to fetch news detail:', err);
      } finally {
        setLoading(false);
      }
    };

    loadNewsDetail();
  }, [newsId]);

  const handleBack = () => {
    navigate('/main');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Header activeTab="뉴스 검색" />

      <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
                bgcolor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            뉴스 목록으로 돌아가기
          </Button>
        </Box>

        {/* Content Area */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : newsDetail ? (
          <NewsDetailContent news={newsDetail} />
        ) : null}
      </Container>
    </Box>
  );
}

export default NewsDetailPage;
