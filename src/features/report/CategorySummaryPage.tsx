import { Box, Typography, Card, Stack, Chip } from '@mui/material';
import type { CategorySummaryPageProps } from '../../types/report';

function CategorySummaryPage({ categoryLabel, clusters }: CategorySummaryPageProps) {
  return (
    <Box
      className="report-page"
      sx={{
        width: '210mm',
        height: '297mm',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'grey.50',
        p: 4,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Header Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          pb: 1,
          borderBottom: '2px solid',
          borderColor: 'primary.main',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
          }}
        >
          {categoryLabel}
        </Typography>

        {/* Mini Logo */}
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: 'text.secondary',
            letterSpacing: '0.05em',
          }}
        >
          HD SAMHO
        </Typography>
      </Box>

      {/* Clusters (Top 3 Issues) */}
      <Stack spacing={2}>
        {clusters.length === 0 ? (
          <Card sx={{ p: 2, textAlign: 'center', borderRadius: '5px' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              이 카테고리에는 표시할 이슈가 없습니다.
            </Typography>
          </Card>
        ) : (
          clusters.map((cluster, index) => (
            <Card
              key={cluster.id}
              sx={{
                p: 2,
                borderRadius: '5px',
                bgcolor: 'white',
                boxShadow: 1,
              }}
            >
              {/* Issue Title */}
              <Box sx={{ mb: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: 0.5,
                    fontSize: '0.95rem',
                  }}
                >
                  {index + 1}. {cluster.representative_title}
                </Typography>

                {/* Meta Info (Score + Size) */}
                <Stack direction="row" spacing={0.5} sx={{ mb: 1 }}>
                  {cluster.score !== null && (
                    <Chip
                      label={`점수: ${cluster.score.toFixed(1)}`}
                      size="small"
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: '20px',
                      }}
                    />
                  )}
                  <Chip
                    label={`이슈 규모: ${cluster.size}건`}
                    size="small"
                    sx={{
                      bgcolor: 'secondary.light',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: '20px',
                    }}
                  />
                </Stack>
              </Box>

              {/* Summary */}
              {cluster.summary && (
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    mb: 1.5,
                    lineHeight: 1.5,
                    fontSize: '0.85rem',
                  }}
                >
                  {cluster.summary}
                </Typography>
              )}

              {/* News Items (Max 3) */}
              {cluster.items.length > 0 && (
                <Box
                  sx={{
                    bgcolor: 'grey.50',
                    p: 1.5,
                    borderRadius: '5px',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: 'text.secondary',
                      mb: 1,
                      display: 'block',
                    }}
                  >
                    관련 뉴스 ({Math.min(cluster.items.length, 3)}건)
                  </Typography>

                  <Stack spacing={0.75}>
                    {cluster.items.map((item, itemIndex) => (
                      <Box
                        key={item.news_id}
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 0.5,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            flexShrink: 0,
                            minWidth: '16px',
                            fontSize: '0.75rem',
                          }}
                        >
                          {itemIndex + 1}.
                        </Typography>
                        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.primary',
                              lineHeight: 1.4,
                              fontSize: '0.75rem',
                              flex: 1,
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            component="a"
                            href={`${window.location.origin}/news/${item.news_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              fontSize: '0.7rem',
                              color: 'primary.main',
                              textDecoration: 'none',
                              flexShrink: 0,
                              cursor: 'pointer',
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            바로가기
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Card>
          ))
        )}
      </Stack>
    </Box>
  );
}

export default CategorySummaryPage;
