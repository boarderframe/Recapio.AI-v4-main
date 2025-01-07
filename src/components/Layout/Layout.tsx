import { Box, AppBar, Toolbar, Typography } from '@mui/material';
import Navigation from '@/components/Navigation/Navigation';
import { useTheme as useAppTheme } from '@/components/ThemeProvider';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { mode } = useAppTheme();

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <Navigation />
          <Typography variant="h6" component="div">
            Recapio
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          bgcolor: mode === 'dark' ? 'background.default' : 'grey.50',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
} 