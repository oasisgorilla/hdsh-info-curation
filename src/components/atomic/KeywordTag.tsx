import { Chip } from '@mui/material';
import { colors, type IssueType } from '../../styles/theme';

type KeywordTagProps = {
  label: string;
  issueType?: '주요이슈' | '카테고리' | '기타';
  size?: 'sm' | 'md';
};

const issueTypeMap: Record<'주요이슈' | '카테고리' | '기타', IssueType> = {
  '주요이슈': 'major',
  '카테고리': 'category',
  '기타': 'other',
};

function KeywordTag({ label, issueType = '기타', size = 'md' }: KeywordTagProps) {
  const issueColors = colors.issue[issueTypeMap[issueType]];

  return (
    <Chip
      label={label}
      size={size === 'sm' ? 'small' : 'medium'}
      sx={{
        backgroundColor: issueColors.background,
        color: issueColors.text,
        border: `1px solid ${issueColors.border}`,
        fontWeight: 500,
        fontSize: size === 'sm' ? '0.75rem' : '0.8125rem',
        height: size === 'sm' ? '24px' : '28px',
      }}
    />
  );
}

export default KeywordTag;
