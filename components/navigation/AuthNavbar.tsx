'use client';

import React from 'react';
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Avatar,
  Stack,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuthStore } from '@/lib/state/stores/authStore';
import { useNavigation } from '@/lib/state/stores/navigationStore';
import { authenticatedNavigation, userMenuNavigation } from '@/lib/state/config/routes';
import type { Route } from '@/lib/routes/types';
import { log } from '@/lib/utils/logger';
import NavbarLayout from './NavbarLayout';

export default function AuthNavbar() {
  const [mobileAnchorEl, setMobileAnchorEl] = React.useState<null | HTMLElement>(null);
  const [userAnchorEl, setUserAnchorEl] = React.useState<null | HTMLElement>(null);
  const { user, signOut } = useAuthStore();
  const { navigate } = useNavigation();
  
  React.useEffect(() => {
    log.ui.debug('AuthNavbar mounted', {
      hasUser: !!user,
      userEmail: user?.email,
      userMetadata: user?.user_metadata,
      availableRoutes: userMenuNavigation.map((route: Route) => route.path)
    });
  }, [user]);

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    log.ui.debug('Opening mobile menu');
    setMobileAnchorEl(event.currentTarget);
  };
  
  const handleMobileMenuClose = () => {
    log.ui.debug('Closing mobile menu');
    setMobileAnchorEl(null);
  };
  
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    log.ui.debug('Opening user menu');
    setUserAnchorEl(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    log.ui.debug('Closing user menu');
    setUserAnchorEl(null);
  };
  
  const handleNavigation = (path: string) => {
    log.ui.info('Navigating from menu', { path });
    handleMobileMenuClose();
    handleUserMenuClose();
    navigate(path);
  };
  
  const handleSignOut = async () => {
    log.ui.info('User signing out');
    handleUserMenuClose();
    try {
      await signOut();
      log.ui.info('User signed out successfully');
      navigate('/');
    } catch (error: any) {
      log.ui.error('Error signing out', { error: error.message });
    }
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
        {authenticatedNavigation.map((route: Route) => (
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

      {/* User Menu */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <IconButton 
          onClick={handleUserMenuOpen}
          aria-controls="user-menu"
          aria-haspopup="true"
          aria-expanded={Boolean(userAnchorEl)}
          sx={{ 
            p: 0.5,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <Avatar 
            alt={user?.email} 
            src={user?.user_metadata?.avatar_url}
            sx={{ width: 32, height: 32 }}
          />
        </IconButton>
      </Box>

      {/* Mobile Menu Button */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto' }}>
        <IconButton
          size="large"
          aria-controls="menu-mobile"
          aria-haspopup="true"
          onClick={handleMobileMenuOpen}
          sx={{ color: 'text.primary' }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Mobile Navigation Menu */}
      <Menu
        id="menu-mobile"
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
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        {authenticatedNavigation.map((route: Route) => (
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
          <MenuItem onClick={handleSignOut} sx={{ py: 1.5 }}>
            <Typography color="error">Sign Out</Typography>
          </MenuItem>
        </Box>
      </Menu>

      {/* User Menu (Desktop) */}
      <Menu
        id="user-menu"
        anchorEl={userAnchorEl}
        open={Boolean(userAnchorEl)}
        onClose={handleUserMenuClose}
        onClick={handleUserMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
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
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        {userMenuNavigation.map((route: Route) => (
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
          <MenuItem onClick={handleSignOut} sx={{ py: 1.5 }}>
            <Typography color="error">Sign Out</Typography>
          </MenuItem>
        </Box>
      </Menu>
    </NavbarLayout>
  );
} 