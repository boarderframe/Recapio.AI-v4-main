'use client';

import React, { useState } from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Button,
    MenuItem,
    useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useRouter } from 'next/navigation';
import { useThemeSettings } from '../context/ThemeContext';
import { useAuth } from '../lib/AuthContext';
import Logo from './Logo';
import Link from 'next/link';
import type { Route } from '../lib/routes';

interface AuthNavbarProps {
    mainRoutes: Route[];
    userMenuRoutes: Route[];
}

export default function AuthNavbar({ mainRoutes, userMenuRoutes }: AuthNavbarProps) {
    const [anchorElNav, setAnchorElNav] = useState<HTMLElement | null>(null);
    const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);
    const router = useRouter();
    const theme = useTheme();
    const { themeSettings } = useThemeSettings();
    const { user, signOut } = useAuth();

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleMenuItemClick = (route: Route) => {
        handleCloseUserMenu();
        if (route.label === 'Logout') {
            signOut();
        } else {
            router.push(route.path);
        }
    };

    return (
        <AppBar 
            position="fixed" 
            sx={{ 
                backgroundColor: 'background.paper',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                height: '64px',
            }}
        >
            <Box
                sx={{
                    maxWidth: '1200px',
                    width: '100%',
                    mx: 'auto',
                    px: { xs: 2, sm: 3, md: 4 },
                    height: '100%'
                }}
            >
                <Toolbar 
                    disableGutters 
                    sx={{ 
                        minHeight: '64px !important',
                        height: '64px',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Box 
                        sx={{ 
                            width: '200px', 
                            display: { xs: 'none', md: 'flex' },
                            alignItems: 'center',
                            height: '100%',
                            backgroundColor: 'transparent',
                            flexShrink: 0
                        }}
                    >
                        <Logo />
                    </Box>

                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="open menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            sx={{ color: 'text.primary' }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {mainRoutes.map((route) => (
                                <MenuItem 
                                    key={route.path}
                                    onClick={() => handleMenuItemClick(route)}
                                >
                                    <Typography textAlign="center">{route.label}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <Box 
                        sx={{ 
                            flexGrow: 1, 
                            display: { xs: 'none', md: 'flex' }, 
                            justifyContent: 'center',
                            gap: 4,
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 'auto'
                        }}
                    >
                        {mainRoutes.map((route) => (
                            <Button
                                key={route.path}
                                onClick={() => handleMenuItemClick(route)}
                                sx={{
                                    color: 'text.primary',
                                    fontSize: '0.95rem',
                                    px: 2,
                                    py: 0.8,
                                    position: 'relative',
                                    minWidth: 0,
                                    whiteSpace: 'nowrap',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        width: '0',
                                        height: '2px',
                                        bottom: 0,
                                        left: '50%',
                                        backgroundColor: 'primary.main',
                                        transition: 'all 0.3s ease-in-out',
                                        transform: 'translateX(-50%)',
                                    },
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                        '&::after': {
                                            width: '100%',
                                        },
                                    },
                                }}
                            >
                                {route.label}
                            </Button>
                        ))}
                    </Box>

                    <Box 
                        sx={{ 
                            width: '200px', 
                            display: 'flex', 
                            justifyContent: 'flex-end',
                            flexShrink: 0
                        }}
                    >
                        <IconButton
                            onClick={handleOpenUserMenu}
                            sx={{
                                width: 40,
                                height: 40,
                                backgroundColor: 'primary.main',
                                color: 'white',
                                fontSize: '1rem',
                                fontWeight: 600,
                                boxShadow: '0 2px 8px rgba(70, 130, 180, 0.2)',
                                '&:hover': {
                                    backgroundColor: 'primary.dark',
                                    boxShadow: '0 4px 12px rgba(70, 130, 180, 0.3)',
                                    transform: 'translateY(-1px)',
                                },
                                transition: 'all 0.2s ease-in-out',
                            }}
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            sx={{ 
                                mt: '45px',
                                '& .MuiPaper-root': {
                                    borderRadius: 2,
                                    minWidth: 180,
                                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
                                },
                            }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {userMenuRoutes.map((route) => (
                                <MenuItem 
                                    key={route.path}
                                    onClick={() => handleMenuItemClick(route)}
                                    sx={{
                                        py: 1.5,
                                        px: 2.5,
                                        '&:hover': {
                                            backgroundColor: 'action.hover',
                                        },
                                    }}
                                >
                                    <Typography>{route.label}</Typography>
                                </MenuItem>
                            ))}
                            <MenuItem 
                                onClick={() => signOut()}
                                sx={{
                                    py: 1.5,
                                    px: 2.5,
                                    color: 'error.main',
                                    '&:hover': {
                                        backgroundColor: 'error.lighter',
                                    },
                                }}
                            >
                                <Typography>Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Box>
        </AppBar>
    );
} 