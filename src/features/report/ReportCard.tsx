import { useState } from 'react';
import { Card, Box, Typography, IconButton, SvgIcon } from '@mui/material';
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
  onDownload?: () => void;
  onToggle?: () => void;
};

function ReportCard({
  weekNumber,
  dateRange,
  status,
  keywords,
  categories,
  onDownload,
  onToggle
}: ReportCardProps) {
  const [isHovered, setIsHovered] = useState(false);

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
          gap: 3,
        }}
      >
        {/* Left: Week Info */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 3,
            borderRadius: 2,
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
            {onDownload && (
              <IconButton
                onClick={onDownload}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                sx={{
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: colors.grey[100],
                  },
                }}
                aria-label="리포트 다운로드"
              >
                <SvgIcon sx={{ width: 20, height: 20 }}>
                  <svg viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10 2v10M10 12l3-3M10 12l-3-3"
                      stroke={isHovered ? colors.ui.success : colors.grey[600]}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 16h12"
                      stroke={isHovered ? colors.ui.success : colors.grey[600]}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </SvgIcon>
              </IconButton>
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

        {/* Toggle Button */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { md: 'column' },
            alignItems: 'center',
            justifyContent: 'center',
            borderTop: { xs: 1, md: 0 },
            borderLeft: { md: 1 },
            borderColor: 'divider',
          }}
        >
          <IconButton
            onClick={onToggle}
            sx={{
              display: 'flex',
              flexDirection: { md: 'column' },
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              p: { xs: 2, md: 3 },
              width: '100%',
              color: 'text.secondary',
              borderRadius: 0,
              transition: 'all 0.2s',
              '&:hover': {
                color: 'primary.main',
                bgcolor: 'grey.50',
              },
            }}
            aria-label="리포트 열기"
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 500,
                writingMode: { md: 'vertical-rl' },
                textOrientation: { md: 'mixed' },
              }}
            >
              리포트 열기
            </Typography>
            <SvgIcon
              sx={{
                width: 16,
                height: 16,
                transform: { md: 'rotate(90deg)' },
              }}
            >
              <svg viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </SvgIcon>
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
}

export default ReportCard;
