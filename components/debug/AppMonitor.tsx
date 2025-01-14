'use client';

import { useEffect } from 'react';
import { log } from '@/lib/utils/logger';

export function AppMonitor() {
  useEffect(() => {
    // Monitor performance metrics
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'longtask') {
          log.system.warn('Long task detected', {
            duration: entry.duration,
            startTime: entry.startTime,
            name: entry.name
          });
        }
      });
    });

    observer.observe({ entryTypes: ['longtask', 'resource', 'navigation'] });

    // Monitor unhandled errors
    const handleError = (event: ErrorEvent) => {
      log.system.error('Unhandled error:', {
        message: event.message,
        filename: event.filename,
        lineNumber: event.lineno,
        columnNumber: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString()
      });
    };

    // Monitor unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      log.system.error('Unhandled promise rejection:', {
        reason: event.reason,
        timestamp: new Date().toISOString()
      });
    };

    // Monitor network errors
    const handleOnline = () => log.system.info('Network connection restored');
    const handleOffline = () => log.system.warn('Network connection lost');

    // Monitor memory usage periodically
    const memoryInterval = setInterval(() => {
      if (performance.memory) {
        log.system.info('Memory usage:', {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
        });
      }
    }, 30000); // Every 30 seconds

    // Add event listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(memoryInterval);
    };
  }, []);

  return null;
} 