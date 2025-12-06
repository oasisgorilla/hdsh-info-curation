import { Chip } from '@mui/material';
import { colors, type CategoryType } from '../../styles/theme';

type TagVariant = CategoryType;

type TagProps = {
  variant: TagVariant;
  label: string;
};

const tagLabels: Record<TagVariant, string> = {
  domestic: '국내',
  overseas: '해외',
  china: '중국',
  market: '동향',
  rnd: 'R&D',
  risk: '리스크',
  regulation: '규제'
};

function Tag({ variant, label }: TagProps) {
  const categoryColors = colors.category[variant];

  return (
    <Chip
      label={label || tagLabels[variant]}
      size="small"
      sx={{
        backgroundColor: categoryColors.light,
        color: categoryColors.text,
        border: `1px solid ${categoryColors.border}`,
        fontWeight: 500,
        fontSize: '0.75rem',
        height: '24px',
      }}
    />
  );
}

export default Tag;
