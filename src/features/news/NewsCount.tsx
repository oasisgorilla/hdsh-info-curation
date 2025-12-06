import { Box, Typography, SvgIcon } from '@mui/material';

type NewsCountProps = {
  count: number;
  withIcon?: boolean;
  size?: 'sm' | 'md';
};

function NewsCount({ count, withIcon = false, size = 'md' }: NewsCountProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      {withIcon && (
        <SvgIcon
          sx={{
            width: 16,
            height: 16,
            color: 'primary.main',
          }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 16 16" fill="none">
            <path
              d="M2 3h12v10H2V3z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </SvgIcon>
      )}
      <Typography
        variant={size === 'sm' ? 'body2' : 'body1'}
        sx={{ color: 'text.secondary' }}
      >
        뉴스{' '}
        <Typography
          component="span"
          sx={{ fontWeight: 700, color: 'text.primary' }}
        >
          {count.toLocaleString()}
        </Typography>
        건
      </Typography>
    </Box>
  );
}

export default NewsCount;
