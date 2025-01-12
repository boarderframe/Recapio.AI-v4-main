'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../lib/store';
import { AuthProvider } from '../lib/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '../lib/theme';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
} 