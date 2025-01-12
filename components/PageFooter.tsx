import React from 'react';
import { Box, Container, Divider } from '@mui/material';

interface PageFooterProps {
  children: React.ReactNode;
  sticky?: boolean;
}

export default function PageFooter({ children, sticky = false }: PageFooterProps) {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        mt: 'auto',
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        ...(sticky && {
          position: 'sticky',
          bottom: 0,
          zIndex: 1,
        }),
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {children}
      </Container>
    </Box>
  );
} 