'use client';

import React, { useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  TextField, 
  Button, 
  IconButton, 
  InputAdornment, 
  Snackbar, 
  Alert,
  Box,
  useTheme,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuthStore } from '@/lib/state/stores/authStore';
import { log } from '@/lib/utils/debug';
import Logo from '@/components/Logo';
import { PageLayout } from '@/components/layout/PageLayout';
import ContentCard from '@/components/ContentCard';

interface FormData {
  email: string;
  password: string;
}

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export default function LoginPage() {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams?.get('returnTo') || '/dashboard';
  const { signIn, isLoading, error, clearError, user, session, initialize } = useAuthStore();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // Initialize auth state only once when component mounts
  useEffect(() => {
    setMounted(true);
    initialize().catch(err => {
      log.auth.error('Failed to initialize auth:', err);
      setShowSnackbar(true);
    });
    return () => setMounted(false);
  }, [initialize]);

  // Handle navigation after successful auth
  useEffect(() => {
    if (!mounted || !user) return;
    
    log.auth.info('User authenticated, navigating', { 
      userId: user.id,
      returnTo
    });
    
    router.replace(returnTo);
  }, [user, router, returnTo, mounted]);

  // Handle error display
  useEffect(() => {
    if (error) {
      log.auth.error('Authentication error:', error);
      setShowSnackbar(true);
    }
  }, [error]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = useCallback(async (data: FormData) => {
    if (isLoading) return;

    log.auth.info('Attempting sign in');
    
    try {
      await signIn(data.email, data.password);
      log.auth.info('Sign in successful');
      setShowSnackbar(true);
    } catch (err) {
      log.auth.error('Sign in failed:', err);
      setShowSnackbar(true);
      reset();
    }
  }, [signIn, isLoading, reset]);

  const handleCloseSnackbar = useCallback(() => {
    if (!mounted) return;
    
    setShowSnackbar(false);
    if (error) {
      clearError();
    }
  }, [error, clearError, mounted]);

  const togglePassword = useCallback(() => {
    if (!mounted || isLoading) return;
    setShowPassword(prev => !prev);
  }, [mounted, isLoading]);

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PageLayout
      layout="auth"
      title="Sign In"
      subtitle="Welcome back to Recapio.ai"
      toolbar={null}
    >
      <ContentCard>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Logo sx={{ transform: 'scale(1.2)' }} />
          </Box>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email')}
            disabled={isLoading}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password')}
            disabled={isLoading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePassword}
                    edge="end"
                    disabled={isLoading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isLoading}
            sx={{ mb: 2 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <Snackbar
          open={showSnackbar}
          autoHideDuration={2000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={error ? 'error' : 'success'}
            sx={{ width: '100%' }}
          >
            {error || 'Successfully signed in'}
          </Alert>
        </Snackbar>
      </ContentCard>
    </PageLayout>
  );
} 