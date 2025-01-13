import { Box, Container } from '@mui/material';
import { PageLayoutProps } from './types';
import PageHeader from './PageHeader';
import PageFooter from './PageFooter';
import { getLayoutConfig, LayoutConfig } from '@/lib/layout/config';
import { Route } from '@/lib/routes/types';
import clsx from 'clsx';

export default function PageLayout({
  children,
  title,
  subtitle,
  toolbar,
  layout = 'marketing',
  footer,
  className,
}: PageLayoutProps) {
  // Create a mock route object for layout configuration
  const mockRoute: Route = {
    path: '/',
    label: title || '',
    requiresAuth: false,
    group: layout,
  };

  const layoutConfig: LayoutConfig = getLayoutConfig(mockRoute);
  const showFooter = footer?.show ?? layoutConfig.showFooter;
  const isFooterSticky = footer?.sticky ?? false;

  return (
    <Box
      className={clsx('page-layout', `layout-${layout}`, className)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        bgcolor: 'background.default',
      }}
    >
      <Container
        maxWidth={layoutConfig.maxWidth as any || 'lg'}
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 3, sm: 4 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <PageHeader
          title={title}
          subtitle={subtitle}
          toolbar={toolbar}
        />
        
        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </Box>
      </Container>

      {showFooter && (
        <PageFooter sticky={isFooterSticky}>
          {footer?.content}
        </PageFooter>
      )}
    </Box>
  );
} 