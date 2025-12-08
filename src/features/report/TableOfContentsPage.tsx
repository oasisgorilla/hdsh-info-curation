import { Box, Typography, Stack } from '@mui/material';
import { colors } from '../../styles/colors';

export type TOCCategory = {
  id: number;
  label: '국내동향' | '해외동향' | '중국동향' | '원자재·RISK' | '기술·R&D' | '정책·규제';
  pageNumber: number;
};

type TableOfContentsPageProps = {
  categories: TOCCategory[];
};

// 카테고리별 설명 매핑
const getCategoryDescription = (label: TOCCategory['label']): string => {
  const descriptionMap: Record<TOCCategory['label'], string> = {
    '국내동향': '주요 수주 및 기술 개발',
    '중국동향': '경쟁 전략 분석',
    '해외동향': '글로벌 시장 변화',
    '원자재·RISK': '가격 및 시장 리스크',
    '기술·R&D': '혁신 기술 개발',
    '정책·규제': '규제 및 지원 정책',
  };
  return descriptionMap[label] || '';
};

// 카테고리별 표시 이름 매핑
const getCategoryDisplayName = (label: TOCCategory['label']): string => {
  const displayNameMap: Record<TOCCategory['label'], string> = {
    '국내동향': '국내 조선업 동향',
    '중국동향': '중국 조선업 동향',
    '해외동향': '해외 조선업 동향',
    '원자재·RISK': '원자재·리스크 동향',
    '기술·R&D': '기술·R&D 동향',
    '정책·규제': '정책·규제 동향',
  };
  return displayNameMap[label] || label;
};

function TableOfContentsPage({ categories }: TableOfContentsPageProps) {
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
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        {/* 목차 with left bar decoration */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        </Box>

        {/* Logo on the right */}
        <Box
          component="img"
          src="/logo.png"
          alt="현대삼호중공업 로고"
          sx={{
            height: 20,
          }}
        />
      </Box>

      {/* 목차 텍스트 */}
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          gap: 1
        }}
      >
        <Box
          sx={{
            width: 6,
            height: 40,
            bgcolor: 'primary.main',
            borderRadius: 1,
          }}
        />
        <Typography
          variant="h1"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
          }}
        >
          목차
        </Typography>
      </Box>

      {/* Table of Contents List */}
      <Stack spacing={3} sx={{ maxWidth: '700px' }}>
        {/* Cover Page */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 1.9,
            borderBottom: '1px dashed',
            borderColor: 'grey.400',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 35,
                height: 35,
                borderRadius: '50%',
                bgcolor: colors.category.overseas.light,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: colors.text.primary,
                }}
              >
                1
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              표지
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            p. 1
          </Typography>
        </Box>

        {/* TOC Page itself */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 1.9,
            borderBottom: '1px dashed',
            borderColor: 'grey.400',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 35,
                height: 35,
                borderRadius: '50%',
                bgcolor: colors.category.overseas.light,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: colors.text.primary,
                }}
              >
                2
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              목차
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            p. 2
          </Typography>
        </Box>

        {/* Category Pages */}
        {categories.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 1.9,
              borderBottom: '1px dashed',
              borderColor: 'grey.400',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 35,
                  height: 35,
                  borderRadius: '50%',
                  bgcolor: colors.category.overseas.light,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: colors.text.primary,
                  }}
                >
                  {item.id}
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {getCategoryDisplayName(item.label)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: colors.grey[500],
                    mt: 0.3,
                  }}
                >
                  {getCategoryDescription(item.label)}
                </Typography>
              </Box>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              p. {item.pageNumber}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export default TableOfContentsPage;
