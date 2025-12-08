import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { Person as PersonIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { colors } from '../../styles/theme';

type NavItemProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

function NavItem({ label, active = false, onClick }: NavItemProps) {
  return (
    <Button
      onClick={onClick}
      variant={active ? 'contained' : 'text'}
      sx={{
        borderRadius: '5px',
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '0.9375rem',
        px: 2,
        height: '100%',
        transition: 'all 0.2s',
        ...(active ? {
          backgroundColor: 'primary.main',
          color: 'white',
          boxShadow: colors.shadow.button,
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        } : {
          color: 'text.secondary',
          '&:hover': {
            color: 'text.primary',
            backgroundColor: colors.grey[100],
          },
        }),
      }}
    >
      {label}
    </Button>
  );
}

type HeaderProps = {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
};

function Header({ activeTab = '뉴스 검색', onTabChange }: HeaderProps) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleTabClick = (tab: string) => {
    onTabChange?.(tab);
    if (tab === '뉴스 검색') {
      navigate('/main');
    } else if (tab === '주간 보고서') {
      navigate('/weekly-report');
    }
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    // 로그아웃 처리
    localStorage.removeItem('authToken'); // 토큰 제거
    localStorage.removeItem('accessToken'); // 액세스 토큰 제거
    localStorage.removeItem('refreshToken'); // 리프레시 토큰 제거 (있을 경우)
    sessionStorage.clear(); // 세션 스토리지 클리어
    navigate('/login'); // 로그인 페이지로 이동
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ px: 3, minHeight: {sm: 70} }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mr: 4 }}>
          <Box
            component="img"
            src="/logo.png"
            alt="현대삼호중공업 로고"
            onClick={() => navigate('/main')}
            sx={{
              height: 35,
              objectFit: 'contain',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          />

        </Box>

        {/* Navigation */}
        <Box
          component="nav"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, }}
          role="navigation"
        >
          <NavItem
            label="뉴스 검색"
            active={activeTab === '뉴스 검색'}
            onClick={() => handleTabClick('뉴스 검색')}
          />
          <NavItem
            label="주간 보고서"
            active={activeTab === '주간 보고서'}
            onClick={() => handleTabClick('주간 보고서')}
          />
        </Box>

        {/* User menu */}
        <IconButton
          onClick={handleProfileClick}
          sx={{
            width: 36,
            height: 36,
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary',
              backgroundColor: colors.grey[100],
            },
            transition: 'all 0.2s',
          }}
          aria-label="사용자 메뉴"
          aria-controls={open ? 'user-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <PersonIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          sx={{
            mt: 1,
            '& .MuiPaper-root': {
              minWidth: 160,
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
            },
          }}
        >
          <MenuItem
            onClick={handleLogout}
            sx={{
              py: 1.5,
              px: 2,
              gap: 1.5,
              fontSize: '0.9375rem',
              color: 'text.primary',
              '&:hover': {
                backgroundColor: colors.grey[100],
              },
            }}
          >
            <LogoutIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            로그아웃
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
