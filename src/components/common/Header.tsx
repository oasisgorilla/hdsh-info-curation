import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Box, Button, IconButton } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
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

  const handleTabClick = (tab: string) => {
    onTabChange?.(tab);
    if (tab === '뉴스 검색') {
      navigate('/main');
    } else if (tab === '주간 보고서') {
      navigate('/weekly-report');
    }
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
            sx={{
              height: 35,
              objectFit: 'contain',
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
        >
          <PersonIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
