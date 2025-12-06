import { Button } from '@mui/material';
import { colors } from '../../styles/theme';

type CategoryFilterProps = {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md';
  onClick?: () => void;
};

function CategoryFilter({
  label,
  selected = false,
  disabled = false,
  size = 'md',
  onClick
}: CategoryFilterProps) {
  return (
    <Button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      variant={selected ? 'contained' : 'outlined'}
      size={size === 'sm' ? 'small' : 'medium'}
      sx={{
        borderRadius: '30px',
        textTransform: 'none',
        fontWeight: 500,
        fontSize: size === 'sm' ? '0.75rem' : '0.875rem',
        px: size === 'sm' ? 0.9 : 1.8,
        py: size === 'sm' ? 0.65 : 0.8,
        minWidth: 'auto',
        transition: 'all 0.2s',
        ...(selected ? {
          backgroundColor: 'secondary.main',
          color: 'white',
          border: 'none',
          '&:hover': {
            backgroundColor: 'secondary.dark',
          },
          boxShadow: colors.shadow.button,
        } : {
          backgroundColor: colors.background.grey,
          color: 'text.primary',
          border: 'none',
          '&:hover': {
            backgroundColor: colors.grey[200],
          },
        }),
        ...(disabled && {
          opacity: 0.5,
          cursor: 'not-allowed',
          '&:hover': {
            backgroundColor: selected ? 'secondary.main' : colors.background.grey,
          },
        }),
      }}
    >
      {label}
    </Button>
  );
}

export default CategoryFilter;
