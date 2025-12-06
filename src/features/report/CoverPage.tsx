import { Box, Typography, Card, Stack } from '@mui/material';
import type { CoverPageProps } from '../../types/report';

function CoverPage({ weekNumber, dateRange, totalNews, totalIssues }: CoverPageProps) {
  return (
    <Box
      className="report-page"
      sx={{
        width: '210mm',
        height: '297mm',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'white',
        p: 6,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Header / Logo Area */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            letterSpacing: '0.1em',
          }}
        >
          HD HYUNDAI SAMHO
        </Typography>
      </Box>

      {/* Center Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Week Number Badge */}
        <Box
          sx={{
            mb: 3,
            px: 3,
            py: 1.5,
            borderRadius: '8px',
            bgcolor: 'primary.main',
            color: 'white',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {weekNumber}주차
          </Typography>
        </Box>

        {/* Main Title */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 4,
            lineHeight: 1.3,
          }}
        >
          조선업 정보 주간 AI 리포트
        </Typography>

        {/* Analysis Period */}
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            mb: 6,
          }}
        >
          분석 기간: {dateRange}
        </Typography>

        {/* KPI Cards */}
        <Stack
          direction="row"
          spacing={3}
          sx={{
            width: '100%',
            maxWidth: '800px',
            justifyContent: 'center',
          }}
        >
          {/* Total News Card */}
          <Card
            sx={{
              flex: 1,
              p: 3,
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: 2,
              border: '1px solid rgba(0, 0, 0, 0.12)',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mb: 1,
                fontWeight: 500,
              }}
            >
              분석 뉴스
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
              }}
            >
              {totalNews.toLocaleString()}
            </Typography>
          </Card>

          {/* Total Issues Card */}
          <Card
            sx={{
              flex: 1,
              p: 3,
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: 2,
              border: '1px solid rgba(0, 0, 0, 0.12)',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mb: 1,
                fontWeight: 500,
              }}
            >
              핵심 이슈
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: 'secondary.main',
              }}
            >
              {totalIssues.toLocaleString()}
            </Typography>
          </Card>

          {/* Analysis Sections Card */}
          <Card
            sx={{
              flex: 1,
              p: 3,
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: 2,
              border: '1px solid rgba(0, 0, 0, 0.12)',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mb: 1,
                fontWeight: 500,
              }}
            >
              분석 섹션
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              6
            </Typography>
          </Card>
        </Stack>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
          }}
        >
          Provided by CG INSIDE
        </Typography>
      </Box>
    </Box>
  );
}

export default CoverPage;
