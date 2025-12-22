import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import type { ExecutiveSummaryPageProps } from '../../types/report';
import { CATEGORY_NAMES, generateCategoryRankingData, calculateDelta } from '../../utils/reportHelpers';
import { CATEGORY_MAP } from '../../types/report';

function ExecutiveSummaryPage({ data }: ExecutiveSummaryPageProps) {
  // Check if this is the first report (no previous week data)
  const isFirstReport = data.prev_week_issue_count === 0 && data.prev_week_news_count === 0;

  // Calculate deltas for issue and news counts
  const issueDelta = calculateDelta(data.this_week_issue_count, data.prev_week_issue_count);
  const newsDelta = calculateDelta(data.this_week_news_count, data.prev_week_news_count);

  // Generate category ranking data
  const { top3, bottom3 } = generateCategoryRankingData(data.category_stats);

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
          mb: 1,
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
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          개요
        </Typography>
        <Box
          sx={{
            bgcolor: 'grey.100',
            p: 2,
            borderRadius: 1,
          }}
        >
          <Box component="ul" sx={{ pl: 3, m: 0 }}>
            {/* Paragraph 1: Issue and news count summary */}
            <Typography
              component="li"
              variant="body1"
              sx={{
                lineHeight: 1.6,
                mb: 0.5,
              }}
            >
              금주 조선업 관련 뉴스는 총 <strong>{data.this_week_news_count}건</strong> 보도되었으며, 이를 바탕으로 주요 이슈 <strong>{data.this_week_issue_count}건</strong>이 도출되었습니다. 
            </Typography>

            {/* Paragraph 2: Week-over-week comparison (only if previous week data exists) */}
            {!isFirstReport && (
              <Typography
                component="li"
                variant="body1"
                sx={{
                  lineHeight: 1.6,
                  mb: 0.5,
                }}
              >
                지난주 대비 조선업 관련 뉴스는 <strong>{newsDelta.delta}건 {newsDelta.text}</strong> 했으며, 주요 이슈는 <strong>{issueDelta.delta}건 {issueDelta.text}</strong>한 것으로 나타났습니다.
              </Typography>
            )}

            {/* Paragraph 3: Category ranking by ratio */}
            <Typography
              component="li"
              variant="body1"
              sx={{
                lineHeight: 1.6,
                mb: 0.5,
              }}
            >
              카테고리별로는{' '}
              {top3.map((item, idx) => (
                <span key={`top3-${idx}`}>
                  <strong>{item.categoryName}</strong>({Math.round(item.ratio)}%)
                  {idx < top3.length - 1 && ', '}
                </span>
              ))}{' '}
              순으로 높은 비중을 차지했으며,<br />
              {bottom3.map((item, idx) => (
                <span key={`bottom3-${idx}`}>
                  <strong>{item.categoryName}</strong>({Math.round(item.ratio)}%)
                  {idx < bottom3.length - 1 && ', '}
                </span>
              ))}{' '}
              순으로 나타났습니다.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Top Issues Section */}
      {/* Foreign Top Issues */}
      {data.foreign_top_clusters_titles && data.foreign_top_clusters_titles.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
            }}
          >
            주요 해외 이슈 3건
          </Typography>
          <Box
            sx={{
              bgcolor: 'grey.100',
              p: 2,
              borderRadius: 1,
            }}
          >
            <Box component="ul" sx={{ pl: 3, m: 0 }}>
              {data.foreign_top_clusters_titles.map((title, index) => (
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
        </Box>
      )}
      {/* Korean Top Issues */}
      {data.korean_top_clusters_titles && data.korean_top_clusters_titles.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
            }}
          >
            주요 국내 이슈 3건
          </Typography>
          <Box
            sx={{
              bgcolor: 'grey.100',
              p: 2,
              borderRadius: 1,
            }}
          >
            <Box component="ul" sx={{ pl: 3, m: 0 }}>
              {data.korean_top_clusters_titles.map((title, index) => (
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
        </Box>
      )}


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
                    py: 1.2,
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
                    py: 1.2,
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
                    py: 1.2,
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
                    py: 1.2,
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
                        py: 1.2,
                      }}
                    >
                      {CATEGORY_NAMES[Number(categoryId)]}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        border: '1px solid',
                        borderColor: 'grey.300',
                        py: 1.2,
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
                        py: 1.2,
                      }}
                    >
                      {isFirstReport ? (
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          -
                        </Typography>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            color: isPositive
                              ? '#2E7D32'
                              : isNegative
                              ? '#C62828'
                              : 'text.secondary',
                            fontWeight: 700,
                          }}
                        >
                          {diffRatio > 0 ? '+' : ''}{Math.round(diffRatio)}%
                        </Typography>
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
