import { Box, Typography, Stack } from '@mui/material';
import type { TableOfContentsPageProps } from '../../types/report';

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
      <Box sx={{ mb: 5 }}>
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

      {/* Title */}
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          color: 'text.primary',
          mb: 5,
        }}
      >
        목차
      </Typography>

      {/* Table of Contents List */}
      <Stack spacing={3} sx={{ maxWidth: '600px' }}>
        {/* Cover Page */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 1.9,
            borderBottom: '1px solid',
            borderColor: 'grey.300',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            표지
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            1
          </Typography>
        </Box>

        {/* TOC Page itself */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 1.9,
            borderBottom: '1px solid',
            borderColor: 'grey.300',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            목차
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            2
          </Typography>
        </Box>

        {/* Category Pages */}
        {categories.map((category) => (
          <Box
            key={category.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 1.9,
              borderBottom: '1px solid',
              borderColor: 'grey.300',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {category.label}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              {category.pageNumber}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export default TableOfContentsPage;
