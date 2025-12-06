import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, TextField, Button, Typography, SvgIcon, Alert, CircularProgress } from '@mui/material';
import { authService } from '../services/authService';
import { colors } from '../styles/theme';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.login({ username, password });
      navigate('/main');
    } catch (err: any) {
      if (err.response?.status === 422) {
        setError('입력값을 확인해주세요.');
      } else if (err.response?.status === 401) {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.ui.gradient.primary,
        p: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '100%',
          height: '100%',
          background: colors.ui.gradient.overlay1,
          borderRadius: '50%',
          filter: 'blur(80px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-50%',
          left: '-50%',
          width: '100%',
          height: '100%',
          background: colors.ui.gradient.overlay2,
          borderRadius: '50%',
          filter: 'blur(80px)',
        }}
      />

      <Box sx={{ position: 'relative', width: '100%', maxWidth: 448 }}>
        {/* Logo placeholder */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              bgcolor: 'white',
              borderRadius: 4,
              boxShadow: 3,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                background: colors.ui.gradient.secondary,
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SvgIcon sx={{ width: 28, height: 28, color: 'white' }} aria-hidden="true">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </SvgIcon>
            </Box>
          </Box>
          <Typography
            variant="h5"
            sx={{ color: 'white', fontWeight: 700, letterSpacing: '-0.02em' }}
          >
            현대삼호중공업
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
            정보 큐레이션 시스템
          </Typography>
        </Box>

        {/* Login card */}
        <Card sx={{ borderRadius: 4, boxShadow: 6, p: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            로그인
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            계정 정보를 입력해주세요
          </Typography>

          <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {error}
              </Alert>
            )}

            <Box>
              <Typography
                component="label"
                htmlFor="username"
                variant="body2"
                sx={{ display: 'block', fontWeight: 500, mb: 0.75 }}
              >
                아이디
              </Typography>
              <TextField
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="아이디를 입력하세요"
                required
                autoComplete="username"
                fullWidth
                size="small"
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: colors.primary.main,
                    },
                  },
                }}
              />
            </Box>

            <Box>
              <Typography
                component="label"
                htmlFor="password"
                variant="body2"
                sx={{ display: 'block', fontWeight: 500, mb: 0.75 }}
              >
                비밀번호
              </Typography>
              <TextField
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
                autoComplete="current-password"
                fullWidth
                size="small"
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: colors.primary.main,
                    },
                  },
                }}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 2,
                height: 44,
                bgcolor: colors.primary.main,
                fontWeight: 600,
                fontSize: '0.875rem',
                '&:hover': {
                  bgcolor: colors.primary.light,
                },
                '&:active': {
                  bgcolor: colors.primary.dark,
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                '로그인'
              )}
            </Button>
          </Box>
        </Card>

        {/* Footer */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            © 2025 Hyundai Samho Heavy Industries. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;
