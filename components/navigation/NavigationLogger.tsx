'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { log } from '@/lib/utils/logger';

export function NavigationLogger() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    log.system.info('Page navigation', {
      path: pathname,
      query: searchParams ? Object.fromEntries(searchParams.entries()) : {},
      timestamp: new Date().toISOString()
    });
  }, [pathname, searchParams]);

  return null;
} 