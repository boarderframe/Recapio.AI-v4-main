import React from 'react';
import { Box, Typography, Stack, Breadcrumbs, Link } from '@mui/material';
import NextLink from 'next/link';

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  actions?: React.ReactNode;
}

export default function PageHeader({ 
  title, 
  description, 
  breadcrumbs,
  actions 
}: PageHeaderProps) {
  return (
    <Box
      sx={{
        py: 3,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          maxWidth: 'lg',
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {breadcrumbs && (
          <Breadcrumbs sx={{ mb: 2 }}>
            {breadcrumbs.map((crumb, index) => (
              crumb.href ? (
                <Link
                  key={index}
                  component={NextLink}
                  href={crumb.href}
                  color="inherit"
                  underline="hover"
                >
                  {crumb.label}
                </Link>
              ) : (
                <Typography key={index} color="text.primary">
                  {crumb.label}
                </Typography>
              )
            ))}
          </Breadcrumbs>
        )}
        
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
        >
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
            {description && (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                {description}
              </Typography>
            )}
          </Box>
          {actions && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {actions}
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
} 