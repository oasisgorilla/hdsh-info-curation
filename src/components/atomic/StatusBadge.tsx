import { Chip } from '@mui/material';
import { colors } from '../../styles/theme';

type StatusBadgeProps = {
  status: '완료됨' | '읽음';
};

function StatusBadge({ status }: StatusBadgeProps) {
  const isCompleted = status === '완료됨';
  const statusColors = isCompleted ? colors.status.completed : colors.status.read;

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        backgroundColor: statusColors.background,
        color: statusColors.text,
        border: `1px solid ${statusColors.border}`,
        fontWeight: 500,
        fontSize: '0.75rem',
        height: '24px',
      }}
    />
  );
}

export default StatusBadge;
