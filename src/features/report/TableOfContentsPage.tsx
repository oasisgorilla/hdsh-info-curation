import { Box, Typography, Stack } from '@mui/material';
import { colors } from '../../styles/colors';

function TableOfContentsPage() {
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
        {[
          { number: 3, label: '국내 조선업 동향', description: '주요 수주 및 기술 개발', page: 3 },
          { number: 4, label: '중국 조선업 동향', description: '경쟁 전략 분석', page: 4 },
          { number: 5, label: '해외 조선업 동향', description: '글로벌 시장 변화', page: 5 },
          { number: 6, label: '원자재·리스크 동향', description: '가격 및 시장 리스크', page: 6 },
          { number: 7, label: '기술·R&D 동향', description: '혁신 기술 개발', page: 7 },
          { number: 8, label: '정책·규제 동향', description: '규제 및 지원 정책', page: 8 },
        ].map((item) => (
          <Box
            key={item.number}
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
                  {item.number}
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {item.label}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: colors.grey[500],
                    mt: 0.3,
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              p. {item.page}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export default TableOfContentsPage;
