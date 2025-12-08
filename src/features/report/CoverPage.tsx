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
        <Box
          component="img"
          src="/logo.png"
          alt="현대삼호중공업 로고"
          sx={{
            height: 30,
          }}
        />
      </Box>

      {/* Center Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          textAlign: 'left',
        }}
      >
        {/* Week Number Badge */}
        <Box
          sx={{
            mb: 3,
            px: 2,
            py: 1,
            borderRadius: '30px',
            bgcolor: 'primary.main',
            color: 'white',
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            {weekNumber}주차
          </Typography>
        </Box>

        {/* Main Title */}
        <Typography
          variant="h1"
          sx={{
            fontWeight:700,
            fontSize:'3.8rem',
            color: 'text.primary',
            mb: 4,
            lineHeight: 1.3,
          }}
        >
          조선업 정보 <br/>주간 AI 리포트
        </Typography>

        {/* Analysis Period */}
        <Typography
          variant="h5"
          sx={{
            color: 'text.secondary',
            mb: 6,
          }}
        >
          분석 기간 <br/>{dateRange}
        </Typography>

        {/* KPI Cards */}
        <Stack
          direction="row"
          spacing={5}
          sx={{
            width: '100%',
            maxWidth: '800px',
            justifyContent: 'center',
          }}
        >
          {/* Total News Card */}
          <Card
            sx={{
              width: '210px',
              height: '180px',
              p: 3,
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: 2,
              border: '1px solid rgba(0, 0, 0, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
              }}
            >
              {totalNews.toLocaleString()}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                mb: 1,
                fontWeight: 500,
              }}
            >
              분석 뉴스
            </Typography>
          </Card>

          {/* Total Issues Card */}
          <Card
            sx={{
              width: '210px',
              height: '180px',
              p: 3,
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: 2,
              border: '1px solid rgba(0, 0, 0, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 700,
                color: 'secondary.main',
              }}
            >
              {totalIssues.toLocaleString()}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                mb: 1,
                fontWeight: 500,
              }}
            >
              핵심 이슈
            </Typography>
          </Card>

          {/* Analysis Sections Card */}
          <Card
            sx={{
              width: '210px',
              height: '180px',
              p: 3,
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: 2,
              border: '1px solid rgba(0, 0, 0, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              6
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                mb: 1,
                fontWeight: 500,
              }}
            >
              분석 섹션
            </Typography>
          </Card>
        </Stack>
      </Box>
      <hr/>

      {/* Footer */}
      <Box sx={{ mt: 3, textAlign: 'left' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 1.5,
            width: 'fit-content',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
            }}
          >
            Provided by
          </Typography>
          <Box
            component="img"
            src="/cginside-logo.png"
            alt="CG INSIDE 로고"
            sx={{
              height: 40,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default CoverPage;
