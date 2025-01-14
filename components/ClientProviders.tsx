'use client';

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from '@/src/state/store';
import { theme } from '@/lib/theme';
import { AuthProvider } from '@/lib/AuthContext';
import ThemeRegistry from '@/components/ThemeRegistry';
import { NavigationLogger } from '@/components/navigation/NavigationLogger';
import { AppMonitor } from '@/components/debug/AppMonitor';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <Provider store={store}>
      <ThemeRegistry>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
              <AppMonitor />
              <NavigationLogger />
              {children}
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ThemeRegistry>
    </Provider>
  );
} 