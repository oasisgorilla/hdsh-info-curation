import { Box, Typography, SvgIcon } from '@mui/material';

type AISummaryProps = {
  text: string;
  visible?: boolean;
};

function AISummary({ text, visible = true }: AISummaryProps) {
  if (!visible) return null;

  return (
    <Box
      sx={{
        mt: 2,
        p: 2.5,
        background: 'linear-gradient(to bottom right, #EFF6FF, #F0F9FF)',
        borderRadius: 2,
        border: '1px solid',
        borderColor: '#dbeafe',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <SvgIcon
          sx={{
            width: 16,
            height: 16,
            mt: 0.25,
            color: '#2563eb',
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
          </svg>
        </SvgIcon>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            lineHeight: 1.6,
          }}
        >
          {text}
        </Typography>
      </Box>
    </Box>
  );
}

export default AISummary;
