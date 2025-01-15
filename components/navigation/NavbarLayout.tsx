import React from 'react';
import { AppBar, Container, Toolbar, Box } from '@mui/material';
import Logo from '@/components/Logo';

interface NavbarLayoutProps {
  children: React.ReactNode;
}

export default function NavbarLayout({ children }: NavbarLayoutProps) {
  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar 
          disableGutters 
          sx={{ 
            minHeight: { xs: 64, md: 72 },
            gap: { xs: 1, md: 2 }
          }}
        >
          {/* Logo */}
          <Logo 
            sx={{ 
              display: 'flex',
              mr: { xs: 1, md: 4 },
              cursor: 'pointer'
            }} 
          />

          {/* Navigation Content */}
          <Box sx={{ 
            display: 'flex', 
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {children}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
} 