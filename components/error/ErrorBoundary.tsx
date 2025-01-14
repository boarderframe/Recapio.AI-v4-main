'use client';

import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { log } from '@/lib/utils/logger';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error
    log.system.error('React error boundary caught error', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 600,
              width: '100%',
              textAlign: 'center'
            }}
          >
            <Typography variant="h5" gutterBottom color="error">
              Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              An unexpected error occurred. Our team has been notified and is working to fix the issue.
            </Typography>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box sx={{ mt: 2, mb: 3, textAlign: 'left' }}>
                <Typography variant="subtitle2" color="error">
                  Error Details:
                </Typography>
                <Typography
                  variant="body2"
                  component="pre"
                  sx={{
                    p: 2,
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    overflow: 'auto',
                    maxHeight: 200
                  }}
                >
                  {this.state.error.stack}
                </Typography>
              </Box>
            )}
            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleReset}
              >
                Try Again
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={this.handleReload}
              >
                Reload Page
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
} 