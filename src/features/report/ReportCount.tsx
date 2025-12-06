import { Box, Typography, SvgIcon } from '@mui/material';

type ReportCountProps = {
  count: number;
  withIcon?: boolean;
};

function ReportCount({ count, withIcon = false }: ReportCountProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {withIcon && (
        <SvgIcon
          sx={{ width: 16, height: 16, color: 'primary.main' }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 16 16" fill="none">
            <rect x="2" y="3" width="12" height="10" stroke="currentColor" strokeWidth="2" fill="none" rx="1" />
            <path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </SvgIcon>
      )}
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        리포트{' '}
        <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {count}
        </Typography>
        건
      </Typography>
    </Box>
  );
}

export default ReportCount;
