'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/lib/state/stores/navigationStore';
import { PublicNavbar } from '@/components/layout/PublicNavbar';

interface NavigationProviderProps {
  children: React.ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const pathname = usePathname() || '/';
  const { setCurrentPath } = useNavigation();

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname, setCurrentPath]);

  // Don't show navigation on auth pages
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    return <>{children}</>;
  }

  return (
    <>
      <PublicNavbar />
      {children}
    </>
  );
} 