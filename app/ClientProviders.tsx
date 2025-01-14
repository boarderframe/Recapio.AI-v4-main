'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ThemeRegistry from '@/components/ThemeRegistry';
import { AuthProvider } from '@/lib/AuthContext';
import { useAuthStore } from '@/lib/state/stores/authStore';
import { useEffect } from 'react';

const queryClient = new QueryClient();

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore(state => state.initialize);

  useEffect(() => {
    initialize().catch(console.error);
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeRegistry>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeRegistry>
    </QueryClientProvider>
  );
} 