import { Box, Container, Typography } from '@mui/material';
import { colors } from '../../styles/theme';

function ReportHeroBanner() {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        background: colors.primary.main,
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 8, sm: 10, md: 12 } }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h1" sx={{ fontWeight: 700, color: "#F7A600", mb: 2 }}>
            조선업 정보 주간 AI 리포트
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
            한 주간의 전세계 조선업 정보와 이슈를 AI가 분석하고 생성합니다.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default ReportHeroBanner;
