import { Box, Typography, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import type { ExecutiveSummaryPageProps } from '../../types/report';
import { CATEGORY_NAMES, generateCategoryRankingText, generateDiffRatioText, calculateDelta } from '../../utils/reportHelpers';
import { CATEGORY_MAP } from '../../types/report';

function ExecutiveSummaryPage({ data }: ExecutiveSummaryPageProps) {
  // Check if this is the first report (no previous week data)
  const isFirstReport = data.prev_week_issue_count === 0 && data.prev_week_news_count === 0;

  // Calculate deltas for issue and news counts
  const issueDelta = calculateDelta(data.this_week_issue_count, data.prev_week_issue_count);
  const newsDelta = calculateDelta(data.this_week_news_count, data.prev_week_news_count);

  // Generate category ranking texts
  const { top3, bottom3 } = generateCategoryRankingText(data.category_stats);

  // Generate diff ratio texts
  const { increases, decreases } = generateDiffRatioText(data.category_stats);

  return (
    <Box
      id="report-page-3"
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
      {/* Header with logo */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
        }}
      >
        <Box
          component="img"
          src="/logo.png"
          alt="현대삼호중공업 로고"
          sx={{
            height: 20,
          }}
        />
      </Box>

      {/* Section Header */}
      <Box sx={{ mb: 2 }}>
       
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 30,
              bgcolor: 'primary.main',
              borderRadius: 1,
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            Executive Summary
          </Typography>
        </Box>
      </Box>

      {/* Statistical Summary Text */}
      <Box
        sx={{
          bgcolor: 'grey.50',
          p: 3,
          borderRadius: 2,
          mb: 2,
        }}
      >
        {/* Paragraph 1: Issue and news count summary */}
        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.8,
            mb: 2,
          }}
        >
          금주 조선업 주요 이슈는 총 <strong>{data.this_week_issue_count}건</strong>으로 집계되었으며, 관련 뉴스는 총 <strong>{data.this_week_news_count}건</strong> 보도되었습니다.
        </Typography>

        {/* Paragraph 2: Week-over-week comparison (only if previous week data exists) */}
        {!isFirstReport && (
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.8,
              mb: 2,
            }}
          >
            전 주 대비 조선업 이슈는 <strong>{issueDelta.delta}건 {issueDelta.text}</strong> 했으며, 관련 뉴스는 총 <strong>{newsDelta.delta}건 {newsDelta.text}</strong> 했습니다.
          </Typography>
        )}

        {/* Paragraph 3: Category ranking by ratio */}
        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.8,
            mb: (!isFirstReport && (increases || decreases)) ? 2 : 0,
          }}
        >
          {top3} 카테고리 순으로 높은 비중을 차지했고, {bottom3} 카테고리는 상대적으로 낮은 비중을 보였습니다.
        </Typography>

        {/* Paragraph 4: Category diff_ratio analysis (only if there are changes and not first report) */}
        {!isFirstReport && (increases || decreases) && (
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.8,
            }}
          >
            {increases && (
              <span>{increases} 카테고리에서 뉴스 건수 증가가 나타났으며</span>
            )}
            {increases && decreases && ', '}
            {decreases && (
              <span>{decreases} 카테고리는 전주 대비 감소했습니다.</span>
            )}
            {increases && !decreases && '.'}
            {!increases && decreases && (
              <span>{decreases} 카테고리는 전주 대비 감소했습니다.</span>
            )}
          </Typography>
        )}
      </Box>

      {/* Top 4 Issues Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          금주 최다 보도 이슈 4건
        </Typography>
        <Box component="ul" sx={{ pl: 3, m: 0 }}>
          {data.top_clusters_titles.slice(0, 4).map((title, index) => (
            <Typography
              key={index}
              component="li"
              variant="body1"
              sx={{
                mb: 0.5,
                lineHeight: 1.6,
              }}
            >
              {title}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Category Statistics Table */}
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          한 주간 카테고리별 뉴스 분석 통계
        </Typography>
        <TableContainer>
          <Table
            sx={{
              border: '1px solid',
              borderColor: 'grey.300',
            }}
          >
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    border: '1px solid',
                    borderColor: 'grey.300',
                    py: 1.5,
                  }}
                >
                  카테고리
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 700,
                    border: '1px solid',
                    borderColor: 'grey.300',
                    py: 1.5,
                  }}
                >
                  뉴스 건수
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 700,
                    border: '1px solid',
                    borderColor: 'grey.300',
                    py: 1.5,
                  }}
                >
                  전주 대비
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 700,
                    border: '1px solid',
                    borderColor: 'grey.300',
                    py: 1.5,
                  }}
                >
                  비율
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(CATEGORY_MAP).map(([categoryId]) => {
                const stat = data.category_stats[categoryId];
                if (!stat) return null;

                const diffRatio = stat.diff_ratio;
                const isPositive = diffRatio > 0;
                const isNegative = diffRatio < 0;

                return (
                  <TableRow key={categoryId}>
                    <TableCell
                      sx={{
                        border: '1px solid',
                        borderColor: 'grey.300',
                        py: 1.5,
                      }}
                    >
                      {CATEGORY_NAMES[Number(categoryId)]}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        border: '1px solid',
                        borderColor: 'grey.300',
                        py: 1.5,
                        fontWeight: 600,
                      }}
                    >
                      {stat.this_week_count}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        border: '1px solid',
                        borderColor: 'grey.300',
                        py: 1.5,
                      }}
                    >
                      {isFirstReport ? (
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          -
                        </Typography>
                      ) : (
                        <Chip
                          label={`${diffRatio > 0 ? '+' : ''}${Math.round(diffRatio)}%`}
                          size="small"
                          sx={{
                            bgcolor: isPositive
                              ? '#E8F5E9'
                              : isNegative
                              ? '#FFEBEE'
                              : 'grey.200',
                            color: isPositive
                              ? '#2E7D32'
                              : isNegative
                              ? '#C62828'
                              : 'text.secondary',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: '24px',
                            minWidth: '60px',
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        border: '1px solid',
                        borderColor: 'grey.300',
                        py: 1.5,
                        fontWeight: 600,
                      }}
                    >
                      {Math.round(stat.this_week_ratio)}%
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default ExecutiveSummaryPage;
