import { Box, Typography, LinearProgress } from '@mui/material';
import { categoryColorMap, colors } from '../../styles/theme';

type IssueBarProps = {
  type: string;
  label: string;
  score: number;
  maxScore?: number;
};

function IssueBar({ type, label, score, maxScore }: IssueBarProps) {
  // Calculate maxScore as the highest score among all issues if not provided
  const effectiveMaxScore = maxScore || 100;
  const percentage = Math.min((score / effectiveMaxScore) * 100, 100);
  const categoryColor = categoryColorMap[type];
  const color = categoryColor ? categoryColor.main : colors.grey[600];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      
      <Box sx={{ flexGrow: label ? 0 : 1, width: label ? 60 : 'auto', position: 'relative', flexShrink: 0 }}>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: 6,
            borderRadius: 1,
            bgcolor: 'grey.100',
            '& .MuiLinearProgress-bar': {
              bgcolor: color,
              borderRadius: 1,
              transition: 'transform 0.3s',
            },
          }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={effectiveMaxScore}
          aria-label={`${label || '이슈'} 점수`}
        />
      </Box>
      <Typography
        variant="caption"
        sx={{
          fontWeight: 700,
          color: 'text.primary',
          fontSize: '0.7rem',
          width: 28,
          textAlign: 'center',
          flexShrink: 0,
        }}
      >
        {score}
      </Typography>
    </Box>
  );
}

export default IssueBar;
