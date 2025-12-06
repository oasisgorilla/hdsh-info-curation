import { useState } from 'react';
import { TextField, InputAdornment, IconButton, Box } from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import { colors } from '../../styles/theme';

type SearchBarProps = {
  placeholder?: string;
  onSearch?: (query: string) => void;
};

function SearchBar({ placeholder = '검색어를 입력해 주세요.', onSearch }: SearchBarProps) {
  const [value, setValue] = useState('');

  const handleSearch = () => {
    onSearch?.(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setValue('');
    onSearch?.('');
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 672, mx: 'auto', display: 'flex', gap: 1, alignItems: 'center' }}>
      <TextField
        fullWidth
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        InputProps={{
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClear}
                aria-label="검색어 지우기"
                sx={{
                  color: colors.text.disabled,
                  width: 32,
                  height: 32,
                  '&:hover': {
                    color: colors.grey[500],
                    backgroundColor: colors.grey[100],
                  },
                  transition: 'all 0.2s',
                }}
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            height: 48,
            borderRadius: '5px',
            backgroundColor: 'white',
            boxShadow: colors.shadow.button,
            transition: 'all 0.2s',
            '& fieldset': {
              borderColor: colors.border.main,
            },
            '&:hover fieldset': {
              borderColor: colors.border.dark,
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
              borderWidth: 2,
            },
            '&.Mui-focused': {
              boxShadow: colors.shadow.focus,
            },
          },
          '& .MuiOutlinedInput-input': {
            fontSize: '0.875rem',
            color: 'text.primary',
            '&::placeholder': {
              color: colors.text.disabled,
              opacity: 1,
            },
          },
        }}
        inputProps={{
          'aria-label': '검색어 입력',
        }}
      />
      <IconButton
        onClick={handleSearch}
        aria-label="검색"
        sx={{
          backgroundColor: colors.ui.success,
          color: 'white',
          width: 48,
          height: 48,
          borderRadius: '5px',
          flexShrink: 0,
          '&:hover': {
            backgroundColor: colors.ui.successHover,
          },
          transition: 'all 0.2s',
        }}
      >
        <SearchIcon sx={{ fontSize: 20 }} />
      </IconButton>
    </Box>
  );
}

export default SearchBar;
