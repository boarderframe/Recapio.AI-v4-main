'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/state/stores/authStore';
import { useNavigation } from '@/lib/state/stores/navigationStore';
import { log } from '@/lib/utils/logger';
import { CircularProgress } from '@mui/material';
import AuthNavbar from './AuthNavbar';
import PublicNavbar from './PublicNavbar';

export default function Navigation() {
  const [mounted, setMounted] = useState(false);
  const { user, isLoading, isAdmin } = useAuthStore();
  const { setRoutes } = useNavigation();

  useEffect(() => {
    setMounted(true);
    log.ui.debug('Navigation component mounted', { isLoading, isAuthenticated: !!user, userId: user?.id });
    return () => setMounted(false);
  }, [isLoading, user]);

  useEffect(() => {
    if (mounted) {
      try {
        log.ui.debug('Setting routes in navigation store', { isAuthenticated: !!user, isAdmin });
        setRoutes({ isAuthenticated: !!user, isAdmin: !!isAdmin });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        log.ui.error('Error setting routes:', { error: errorMessage });
      }
    }
  }, [mounted, user, isAdmin, setRoutes]);

  if (!mounted) {
    log.ui.debug('Navigation not mounted yet');
    return null;
  }

  if (isLoading) {
    log.ui.debug('Navigation in loading state');
    return (
      <div className="flex justify-center items-center h-16">
        <CircularProgress size={24} />
      </div>
    );
  }

  log.ui.debug('Rendering navigation', { isAuthenticated: !!user });
  return user ? <AuthNavbar /> : <PublicNavbar />;
} 