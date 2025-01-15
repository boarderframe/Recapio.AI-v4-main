'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Box, Typography, IconButton, FormControl, InputLabel, Select, MenuItem, Stack, Paper, Alert, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ClearIcon from '@mui/icons-material/Clear';
import RefreshIcon from '@mui/icons-material/Refresh';
import { LogLevel, LogNamespace, LogEntry } from '@/lib/utils/logger';

const POLL_INTERVAL = 2000; // 2 seconds
const MAX_RETRIES = 3;

export default function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'all'>('all');
  const [selectedNamespace, setSelectedNamespace] = useState<LogNamespace | 'all'>('all');
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const lastFetchRef = useRef<number>(Date.now());

  // Fetch logs
  const fetchLogs = useCallback(async () => {
    try {
      const response = await fetch('/api/debug/logs');
      if (!response.ok) {
        throw new Error(`Failed to fetch logs: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setLogs(data);
      setError(null);
      setRetryCount(0);
      lastFetchRef.current = Date.now();

      // Auto-scroll to bottom unless paused
      if (!isPaused && logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch logs');
      
      // Implement retry logic
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        setTimeout(fetchLogs, 1000 * (retryCount + 1)); // Exponential backoff
      }
    }
  }, [isPaused, retryCount]);

  // Set up polling
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    // Initial fetch
    fetchLogs();

    // Set up polling if not paused
    if (!isPaused) {
      intervalId = setInterval(() => {
        // Check if we've missed too many polls
        const now = Date.now();
        if (now - lastFetchRef.current > POLL_INTERVAL * 2) {
          console.warn('Missed polls detected, reconnecting...');
          fetchLogs();
        } else {
          fetchLogs();
        }
      }, POLL_INTERVAL);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPaused, fetchLogs]);

  // Generate test logs
  const generateTestLogs = async () => {
    try {
      const response = await fetch('/api/debug/test-log');
      if (!response.ok) {
        throw new Error('Failed to generate test logs');
      }
      const data = await response.json();
      if (data.success) {
        fetchLogs(); // Immediately fetch new logs
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate test logs');
    }
  };

  // Clear logs
  const clearLogs = async () => {
    try {
      setLogs([]);
      await fetch('/api/debug/logs', { method: 'DELETE' });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to clear logs');
    }
  };

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const levelMatch = selectedLevel === 'all' || log.level === selectedLevel;
    const namespaceMatch = selectedNamespace === 'all' || log.namespace === selectedNamespace;
    return levelMatch && namespaceMatch;
  });

  // Get log text color based on level
  const getLogColor = (level: LogLevel) => {
    switch (level) {
      case LogLevel.ERROR:
        return 'error.main';
      case LogLevel.WARN:
        return 'warning.main';
      case LogLevel.INFO:
        return 'success.main';
      case LogLevel.HTTP:
        return 'info.main';
      default:
        return 'text.primary';
    }
  };

  // Format metadata
  const formatMeta = (meta: any) => {
    if (!meta) return '';
    try {
      return Object.entries(meta)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join(', ');
    } catch (error) {
      console.error('Error formatting metadata:', error);
      return '[Error formatting metadata]';
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <Stack direction="row" spacing={2} alignItems="center">
        <IconButton 
          onClick={() => setIsPaused(!isPaused)} 
          color={isPaused ? 'error' : 'primary'}
          title={isPaused ? 'Resume log updates' : 'Pause log updates'}
        >
          {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
        </IconButton>
        <IconButton 
          onClick={clearLogs} 
          color="warning"
          title="Clear all logs"
        >
          <ClearIcon />
        </IconButton>
        <IconButton 
          onClick={fetchLogs}
          color="primary"
          title="Refresh logs"
        >
          <RefreshIcon />
        </IconButton>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={generateTestLogs}
          title="Generate test logs"
        >
          Generate Test Logs
        </Button>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Level</InputLabel>
          <Select
            value={selectedLevel}
            label="Level"
            onChange={(e) => setSelectedLevel(e.target.value as LogLevel | 'all')}
          >
            <MenuItem value="all">All Levels</MenuItem>
            {Object.values(LogLevel).map((level) => (
              <MenuItem key={level} value={level}>{level}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Namespace</InputLabel>
          <Select
            value={selectedNamespace}
            label="Namespace"
            onChange={(e) => setSelectedNamespace(e.target.value as LogNamespace | 'all')}
          >
            <MenuItem value="all">All Namespaces</MenuItem>
            {Object.values(LogNamespace).map((namespace) => (
              <MenuItem key={namespace} value={namespace}>{namespace}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body2" color="text.secondary">
          {`${filteredLogs.length} logs`}
        </Typography>
      </Stack>

      <Paper 
        ref={logContainerRef}
        sx={{ 
          flex: 1, 
          overflow: 'auto',
          p: 2,
          backgroundColor: 'background.default',
          fontFamily: 'monospace'
        }}
      >
        {filteredLogs.length === 0 ? (
          <Typography color="text.secondary" align="center">
            No logs to display. Try generating some test logs.
          </Typography>
        ) : (
          filteredLogs.map((log, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography
                component="div"
                variant="body2"
                sx={{
                  color: getLogColor(log.level),
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                {`${new Date(log.timestamp).toLocaleTimeString()} [${log.namespace}] ${log.level.toUpperCase()}: ${log.message}`}
                {log.meta && (
                  <Box component="span" sx={{ color: 'text.secondary', ml: 1 }}>
                    {formatMeta(log.meta)}
                  </Box>
                )}
              </Typography>
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
} 