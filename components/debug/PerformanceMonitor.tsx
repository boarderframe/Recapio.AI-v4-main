'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { performance } from '@/lib/utils/performance';
import { log } from '@/lib/utils/logger';

interface PerformanceData {
  pageLoad: {
    dnsLookup: number;
    tcpConnection: number;
    serverResponse: number;
    domLoad: number;
    pageLoad: number;
    totalDuration: number;
  };
  resources: Array<{
    name: string;
    duration: number;
    size?: number;
    type: string;
  }>;
  memory: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null;
  network: {
    metrics: Array<{
      url: string;
      method: string;
      status: number;
      duration: number;
      size: number;
      success: boolean;
      timestamp: number;
    }>;
    stats: {
      totalRequests: number;
      successfulRequests: number;
      failedRequests: number;
      averageDuration: number;
      totalSize: number;
      slowRequests: number;
    };
  };
}

export default function PerformanceMonitor() {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const updateMetrics = () => {
    try {
      // Get navigation timing
      const navEntries = window.performance.getEntriesByType('navigation');
      if (navEntries.length > 0) {
        const nav = navEntries[0] as PerformanceNavigationTiming;
        setData({
          pageLoad: {
            dnsLookup: nav.domainLookupEnd - nav.domainLookupStart,
            tcpConnection: nav.connectEnd - nav.connectStart,
            serverResponse: nav.responseEnd - nav.requestStart,
            domLoad: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
            pageLoad: nav.loadEventEnd - nav.loadEventStart,
            totalDuration: nav.duration
          },
          resources: window.performance.getEntriesByType('resource').map(entry => {
            const resource = entry as PerformanceResourceTiming;
            return {
              name: resource.name,
              duration: resource.duration,
              size: resource.transferSize,
              type: resource.initiatorType
            };
          }),
          memory: performance.getMemoryMetrics(),
          network: {
            metrics: performance.getNetworkMetrics(),
            stats: performance.getNetworkStats()
          }
        });
        setLastUpdate(new Date().toLocaleTimeString());
      }
    } catch (error) {
      log.system.error('Failed to update performance metrics', { error: String(error) });
    }
  };

  useEffect(() => {
    updateMetrics();
    // Start memory monitoring
    performance.startMemoryMonitoring(5000); // Check every 5 seconds
    
    return () => {
      performance.stopMemoryMonitoring();
    };
  }, []);

  const formatDuration = (ms: number) => `${ms.toFixed(2)}ms`;
  const formatSize = (bytes?: number) => {
    if (bytes === undefined) return 'N/A';
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Performance Metrics</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Last updated: {lastUpdate}
          </Typography>
          <IconButton onClick={updateMetrics} size="small" title="Refresh metrics">
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {data && (
        <>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Page Load Timing
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Metric</TableCell>
                    <TableCell align="right">Duration</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>DNS Lookup</TableCell>
                    <TableCell align="right">{formatDuration(data.pageLoad.dnsLookup)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>TCP Connection</TableCell>
                    <TableCell align="right">{formatDuration(data.pageLoad.tcpConnection)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Server Response</TableCell>
                    <TableCell align="right">{formatDuration(data.pageLoad.serverResponse)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>DOM Load</TableCell>
                    <TableCell align="right">{formatDuration(data.pageLoad.domLoad)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Page Load</TableCell>
                    <TableCell align="right">{formatDuration(data.pageLoad.pageLoad)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Total Duration</strong></TableCell>
                    <TableCell align="right"><strong>{formatDuration(data.pageLoad.totalDuration)}</strong></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Resource Timing
            </Typography>
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Resource</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Size</TableCell>
                    <TableCell align="right">Duration</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.resources.map((resource, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {resource.name}
                      </TableCell>
                      <TableCell>{resource.type}</TableCell>
                      <TableCell align="right">{formatSize(resource.size)}</TableCell>
                      <TableCell align="right">{formatDuration(resource.duration)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {data?.memory && (
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Memory Usage
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Metric</TableCell>
                      <TableCell align="right">Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Used Heap</TableCell>
                      <TableCell align="right">{formatSize(data.memory.usedJSHeapSize)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Heap</TableCell>
                      <TableCell align="right">{formatSize(data.memory.totalJSHeapSize)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Heap Limit</TableCell>
                      <TableCell align="right">{formatSize(data.memory.jsHeapSizeLimit)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Usage Percentage</strong></TableCell>
                      <TableCell align="right">
                        <strong>
                          {((data.memory.usedJSHeapSize / data.memory.jsHeapSizeLimit) * 100).toFixed(1)}%
                        </strong>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Network Performance
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Summary
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell>Total Requests</TableCell>
                      <TableCell align="right">{data.network.stats.totalRequests}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Successful Requests</TableCell>
                      <TableCell align="right">{data.network.stats.successfulRequests}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Failed Requests</TableCell>
                      <TableCell align="right">{data.network.stats.failedRequests}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Average Duration</TableCell>
                      <TableCell align="right">{formatDuration(data.network.stats.averageDuration)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Data Transferred</TableCell>
                      <TableCell align="right">{formatSize(data.network.stats.totalSize)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Slow Requests ({'>'}1s)</TableCell>
                      <TableCell align="right">{data.network.stats.slowRequests}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              Recent Requests
            </Typography>
            <TableContainer sx={{ maxHeight: 300 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>URL</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">Duration</TableCell>
                    <TableCell align="right">Size</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.network.metrics.map((metric, index) => (
                    <TableRow 
                      key={index}
                      sx={{ 
                        backgroundColor: metric.success ? 'inherit' : 'error.main',
                        '&:hover': { backgroundColor: metric.success ? 'action.hover' : 'error.dark' }
                      }}
                    >
                      <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {metric.url}
                      </TableCell>
                      <TableCell>{metric.method}</TableCell>
                      <TableCell align="right">{metric.status}</TableCell>
                      <TableCell align="right">{formatDuration(metric.duration)}</TableCell>
                      <TableCell align="right">{formatSize(metric.size)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
    </Box>
  );
} 