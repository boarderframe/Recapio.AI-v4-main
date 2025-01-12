'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../lib/store';
import { AuthProvider } from '../lib/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '../lib/theme';
import { ThemeProvider as CustomThemeProvider } from '../context/ThemeContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CustomThemeProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </CustomThemeProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
} 