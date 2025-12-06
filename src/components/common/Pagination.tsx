import { Pagination as MuiPagination, PaginationItem, Box } from '@mui/material';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
};

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const handleChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    onPageChange?.(page);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      component="nav"
      aria-label="페이지네이션"
    >
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        showFirstButton
        showLastButton
        siblingCount={2}
        boundaryCount={1}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            sx={{
              minWidth: 44,
              height: 44,
              border: 'none',
              fontSize: '1.125rem',
              fontWeight: 600,
              transition: 'all 0.2s',
              '&.Mui-selected': {
                backgroundColor: 'transparent',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              },
              '&:not(.Mui-selected)': {
                backgroundColor: 'transparent',
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: 'text.primary',
                },
              },
              '&.Mui-disabled': {
                opacity: 0.3,
                cursor: 'not-allowed',
              },
              '& .MuiSvgIcon-root': {
                fontSize: '1.5rem',
              },
            }}
          />
        )}
      />
    </Box>
  );
}

export default Pagination;
