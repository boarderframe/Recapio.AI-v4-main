'use client';

import React from 'react';
import { Box, Button, IconButton, Menu, MenuItem, Typography, Stack } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { mainNavigation } from '@/lib/state/config/routes';
import { log } from '@/lib/utils/logger';
import NavbarLayout from './NavbarLayout';
import { useNavigation } from '@/lib/state/stores/navigationStore';

export default function PublicNavbar() {
  const [mobileAnchorEl, setMobileAnchorEl] = React.useState<null | HTMLElement>(null);
  const { navigate } = useNavigation();

  React.useEffect(() => {
    log.ui.debug('PublicNavbar mounted', {
      availableRoutes: mainNavigation.map(route => route.path)
    });
  }, []);

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    log.ui.debug('Opening public mobile menu');
    setMobileAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    log.ui.debug('Closing public mobile menu');
    setMobileAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    log.ui.info('Navigating from public menu', { path });
    handleMobileMenuClose();
    navigate(path);
  };

  return (
    <NavbarLayout>
      {/* Main Navigation */}
      <Stack 
        direction="row" 
        spacing={1}
        sx={{ 
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center'
        }}
      >
        {mainNavigation.map((route) => (
          <Button
            key={route.path}
            onClick={() => handleNavigation(route.path)}
            sx={{
              color: 'text.primary',
              px: 2,
              py: 1,
              fontWeight: 500,
              fontSize: '0.95rem',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            {route.label}
          </Button>
        ))}
      </Stack>

      {/* Auth Buttons */}
      <Stack 
        direction="row" 
        spacing={2}
        sx={{ 
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center'
        }}
      >
        <Button
          onClick={() => handleNavigation('/login')}
          sx={{ 
            color: 'text.primary',
            fontWeight: 500
          }}
        >
          Log In
        </Button>
        <Button
          onClick={() => handleNavigation('/signup')}
          variant="contained"
          color="primary"
          sx={{ fontWeight: 500 }}
        >
          Sign Up
        </Button>
      </Stack>

      {/* Mobile Menu Button */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto' }}>
        <IconButton
          size="large"
          aria-controls="public-menu-mobile"
          aria-haspopup="true"
          onClick={handleMobileMenuOpen}
          sx={{ color: 'text.primary' }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Mobile Menu */}
      <Menu
        id="public-menu-mobile"
        anchorEl={mobileAnchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(mobileAnchorEl)}
        onClose={handleMobileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: 1,
            boxShadow: 'rgb(0 0 0 / 8%) 0px 6px 16px'
          }
        }}
      >
        {mainNavigation.map((route) => (
          <MenuItem 
            key={route.path} 
            onClick={() => handleNavigation(route.path)}
            sx={{ py: 1.5 }}
          >
            <Typography>{route.label}</Typography>
          </MenuItem>
        ))}
        <Box sx={{ 
          borderTop: '1px solid',
          borderColor: 'divider',
          mt: 1,
          pt: 1
        }}>
          <MenuItem onClick={() => handleNavigation('/login')} sx={{ py: 1.5 }}>
            <Typography>Log In</Typography>
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/signup')} sx={{ py: 1.5 }}>
            <Typography fontWeight={500} color="primary">Sign Up</Typography>
          </MenuItem>
        </Box>
      </Menu>
    </NavbarLayout>
  );
} 