import { Component, ErrorInfo, ReactNode } from 'react';
import { log } from '@/lib/utils/logger';
import { Button, Typography, Box, Paper } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    log.system.error('React error boundary caught error:', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Paper sx={{ p: 3, m: 2 }}>
          <Typography variant="h6" color="error" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {this.state.error?.message}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              onClick={() => window.location.reload()}
              sx={{ mr: 1 }}
            >
              Reload Page
            </Button>
            <Button 
              variant="outlined"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try Again
            </Button>
          </Box>
        </Paper>
      );
    }

    return this.props.children;
  }
} 