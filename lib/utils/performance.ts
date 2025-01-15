import { log } from './logger';

interface PerformanceMetric {
  name: string;
  startTime: number;
  duration: number;
  metadata?: Record<string, any>;
}

interface ResourceMetric {
  name: string;
  duration: number;
  size?: number;
  type: string;
}

interface MemoryMetrics {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface NetworkMetric {
  url: string;
  method: string;
  status: number;
  duration: number;
  size: number;
  success: boolean;
  timestamp: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetric> = new Map();
  private networkMetrics: NetworkMetric[] = [];
  private readonly THRESHOLD_MS = 1000; // Log warning if operation takes longer than 1 second
  private readonly MAX_NETWORK_METRICS = 100;

  private constructor() {
    // Initialize performance observer for long tasks
    if (typeof window !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          log.system.warn('Long task detected', {
            name: entry.name,
            duration: `${entry.duration}ms`,
            startTime: entry.startTime,
            entryType: entry.entryType
          });
        });
      });

      try {
        observer.observe({ entryTypes: ['longtask'] });
      } catch (error) {
        log.system.warn('PerformanceObserver not supported', { error: String(error) });
      }

      // Monitor route changes
      this.setupRouteChangeMonitoring();

      if (typeof window !== 'undefined') {
        this.setupNetworkMonitoring();
      }
    }
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private setupRouteChangeMonitoring() {
    if (typeof window === 'undefined') return;

    // Monitor navigation timing
    window.addEventListener('load', () => {
      setTimeout(() => {
        const entries = window.performance.getEntriesByType('navigation');
        if (entries.length > 0) {
          const navigation = entries[0] as PerformanceNavigationTiming;
          log.system.info('Page load performance', {
            dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
            tcpConnection: navigation.connectEnd - navigation.connectStart,
            serverResponse: navigation.responseEnd - navigation.requestStart,
            domLoad: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            pageLoad: navigation.loadEventEnd - navigation.loadEventStart,
            totalDuration: navigation.duration,
            url: window.location.pathname
          });
        }
      }, 0);
    });
  }

  public startTimer(name: string, metadata?: Record<string, any>) {
    const startTime = window.performance.now();
    this.metrics.set(name, {
      name,
      startTime,
      duration: 0,
      metadata
    });
  }

  public endTimer(name: string, additionalMetadata?: Record<string, any>) {
    const metric = this.metrics.get(name);
    if (!metric) {
      log.system.warn('Attempted to end timer that was not started', { name });
      return;
    }

    const endTime = window.performance.now();
    const duration = endTime - metric.startTime;

    // Combine original and additional metadata
    const metadata = {
      ...metric.metadata,
      ...additionalMetadata
    };

    // Log based on duration
    if (duration > this.THRESHOLD_MS) {
      log.system.warn('Slow operation detected', {
        operation: name,
        duration: `${duration.toFixed(2)}ms`,
        ...metadata
      });
    } else {
      log.system.debug('Operation timing', {
        operation: name,
        duration: `${duration.toFixed(2)}ms`,
        ...metadata
      });
    }

    this.metrics.delete(name);
    return duration;
  }

  public measureAsync<T>(name: string, fn: () => Promise<T>, metadata?: Record<string, any>): Promise<T> {
    this.startTimer(name, metadata);
    return fn().finally(() => {
      this.endTimer(name);
    });
  }

  public measure<T>(name: string, fn: () => T, metadata?: Record<string, any>): T {
    this.startTimer(name, metadata);
    try {
      const result = fn();
      this.endTimer(name);
      return result;
    } catch (error) {
      this.endTimer(name, { error: String(error) });
      throw error;
    }
  }

  public logResourceMetrics() {
    if (typeof window === 'undefined') return;

    const resources = window.performance.getEntriesByType('resource');
    const metrics: ResourceMetric[] = resources.map(entry => {
      const resourceTiming = entry as PerformanceResourceTiming;
      return {
        name: resourceTiming.name,
        duration: resourceTiming.duration,
        size: resourceTiming.transferSize,
        type: resourceTiming.initiatorType
      };
    });

    log.system.info('Resource metrics', { resources: metrics });
  }

  public getMemoryMetrics(): MemoryMetrics | null {
    if (typeof window === 'undefined' || !('performance' in window) || !('memory' in (window.performance as any))) {
      return null;
    }

    const memory = (window.performance as any).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit
    };
  }

  public startMemoryMonitoring(intervalMs: number = 30000) {
    if (typeof window === 'undefined') return;

    const monitorMemory = () => {
      const metrics = this.getMemoryMetrics();
      if (metrics) {
        const usedPercentage = (metrics.usedJSHeapSize / metrics.jsHeapSizeLimit) * 100;
        
        if (usedPercentage > 80) {
          log.system.warn('High memory usage detected', {
            usedPercentage: `${usedPercentage.toFixed(1)}%`,
            used: `${(metrics.usedJSHeapSize / (1024 * 1024)).toFixed(1)}MB`,
            total: `${(metrics.totalJSHeapSize / (1024 * 1024)).toFixed(1)}MB`,
            limit: `${(metrics.jsHeapSizeLimit / (1024 * 1024)).toFixed(1)}MB`
          });
        } else {
          log.system.debug('Memory usage metrics', {
            usedPercentage: `${usedPercentage.toFixed(1)}%`,
            used: `${(metrics.usedJSHeapSize / (1024 * 1024)).toFixed(1)}MB`,
            total: `${(metrics.totalJSHeapSize / (1024 * 1024)).toFixed(1)}MB`,
            limit: `${(metrics.jsHeapSizeLimit / (1024 * 1024)).toFixed(1)}MB`
          });
        }
      }
    };

    // Initial check
    monitorMemory();
    
    // Set up interval
    const intervalId = setInterval(monitorMemory, intervalMs);
    
    // Store interval ID for cleanup
    if (typeof window !== 'undefined') {
      (window as any).__memoryMonitorInterval = intervalId;
    }
  }

  public stopMemoryMonitoring() {
    if (typeof window !== 'undefined' && (window as any).__memoryMonitorInterval) {
      clearInterval((window as any).__memoryMonitorInterval);
      delete (window as any).__memoryMonitorInterval;
    }
  }

  private setupNetworkMonitoring() {
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const startTime = window.performance.now();
      const url = typeof input === 'string' ? input : input instanceof Request ? input.url : input.toString();
      
      try {
        const response = await originalFetch(input, init);
        const endTime = window.performance.now();
        const duration = endTime - startTime;
        
        const metric: NetworkMetric = {
          url,
          method: init?.method || 'GET',
          status: response.status,
          duration,
          size: parseInt(response.headers.get('content-length') || '0'),
          success: response.ok,
          timestamp: Date.now()
        };

        this.addNetworkMetric(metric);
        
        if (duration > this.THRESHOLD_MS) {
          log.system.warn('Slow network request detected', {
            url,
            duration: `${duration.toFixed(2)}ms`,
            status: response.status
          });
        }

        return response;
      } catch (error) {
        const endTime = window.performance.now();
        const metric: NetworkMetric = {
          url,
          method: init?.method || 'GET',
          status: 0,
          duration: endTime - startTime,
          size: 0,
          success: false,
          timestamp: Date.now()
        };

        this.addNetworkMetric(metric);
        log.system.error('Network request failed', {
          url,
          error: String(error)
        });
        
        throw error;
      }
    };
  }

  private addNetworkMetric(metric: NetworkMetric) {
    this.networkMetrics.push(metric);
    if (this.networkMetrics.length > this.MAX_NETWORK_METRICS) {
      this.networkMetrics.shift();
    }
  }

  public getNetworkMetrics() {
    return [...this.networkMetrics];
  }

  public getNetworkStats() {
    const stats = {
      totalRequests: this.networkMetrics.length,
      successfulRequests: 0,
      failedRequests: 0,
      averageDuration: 0,
      totalSize: 0,
      slowRequests: 0
    };

    if (this.networkMetrics.length === 0) {
      return stats;
    }

    let totalDuration = 0;
    this.networkMetrics.forEach(metric => {
      if (metric.success) {
        stats.successfulRequests++;
      } else {
        stats.failedRequests++;
      }
      totalDuration += metric.duration;
      stats.totalSize += metric.size;
      if (metric.duration > this.THRESHOLD_MS) {
        stats.slowRequests++;
      }
    });

    stats.averageDuration = totalDuration / this.networkMetrics.length;
    return stats;
  }
}

// Export singleton instance
export const performance = PerformanceMonitor.getInstance(); 