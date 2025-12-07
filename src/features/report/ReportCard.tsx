import { Card, Box, Typography, Button, SvgIcon } from '@mui/material';
import StatusBadge from '../../components/atomic/StatusBadge';
import KeywordTag from '../../components/atomic/KeywordTag';
import IssueBar from './IssueBar';
import { colors } from '../../styles/theme';

export type CategoryIssue = {
  categoryId: number;
  categoryName: string;
  issues: Array<{
    id: number;
    title: string;
    size: number;
  }>;
};

export type ReportCardProps = {
  weekNumber: number;
  dateRange: string;
  status: '완료됨' | '읽음';
  keywords: string[];
  categories: CategoryIssue[];
  onToggle?: () => void;
};

function ReportCard({
  weekNumber,
  dateRange,
  status,
  keywords,
  categories,
  onToggle
}: ReportCardProps) {

  return (
    <Card
      component="article"
      sx={{
        overflow: 'hidden',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Left: Week Info */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 3,
            borderRadius: '5px',
            background: colors.ui.gradient.weekBadge,
            flexShrink: 0,
            width: { xs: '100%', md: '200px' },
          }}
        >
          <SvgIcon sx={{ width: 32, height: 32, color: 'white' }} aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path
                d="M6 8h20v16H6V8z"
                stroke="white"
                strokeWidth="2"
                fill="none"
                strokeLinejoin="round"
              />
              <path
                d="M10 12h12M10 16h8M10 20h10"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </SvgIcon>
          <Box sx={{ display: 'flex', flexDirection: 'column', color: 'white' }}>
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, lineHeight: 1.2 }}>
              {weekNumber} 주차
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)' }}>
              {dateRange}
            </Typography>
          </Box>
        </Box>

        {/* Content */}
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2.5, md: 3 },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { sm: 'center' },
                gap: { xs: 1, sm: 1.5 },
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                조선업 정보 주간 AI 리포트
              </Typography>
              <StatusBadge status={status} />
            </Box>
            {onToggle && (
              <Button
                variant="contained"
                color="primary"
                onClick={onToggle}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 2.5,
                  py: 1,
                }}
              >
                리포트 열기
              </Button>
            )}
          </Box>

          {/* Keywords */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {keywords.map((keyword, index) => (
              <KeywordTag key={index} label={keyword} />
            ))}
          </Box>

          {/* Categories */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' },
              gap: 2,
              mb: 3
            }}
          >
            {categories.map((category) => (
              <Box key={category.categoryId}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    fontSize: '0.75rem',
                    color: 'text.primary'
                  }}
                >
                  {category.categoryName}
                </Typography>
                <IssueBar
                  type={category.categoryName}
                  label={category.issues[0]?.title || ''}
                  score={category.issues[0]?.size || 0}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

export default ReportCard;
