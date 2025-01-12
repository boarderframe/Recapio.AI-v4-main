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
import UserAvatar from './UserAvatar';

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
                        width: '100%',
                        position: 'relative'
                    }}
                >
                    <Box 
                        sx={{ 
                            display: { xs: 'none', md: 'flex' },
                            alignItems: 'center',
                            height: '100%',
                            backgroundColor: 'transparent',
                            flexShrink: 0
                        }}
                    >
                        <Logo />
                    </Box>

                    <Box 
                        sx={{ 
                            display: { xs: 'none', md: 'flex' }, 
                            justifyContent: 'center',
                            gap: 4,
                            flex: 1,
                            mx: 4
                        }}
                    >
                        {mainRoutes.filter(route => 
                            ['Dashboard', 'New Transcript', 'Transcript Library', 'Reporting'].includes(route.label)
                        ).map((route) => (
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
                            display: 'flex', 
                            justifyContent: 'flex-end',
                            flexShrink: 0,
                            alignItems: 'center',
                            height: '100%'
                        }}
                    >
                        <UserAvatar
                            email={user?.email}
                            displayName={user?.user_metadata?.display_name}
                            avatarUrl={user?.user_metadata?.avatar_url}
                            onClick={handleOpenUserMenu}
                        />
                        <Menu
                            sx={{ 
                                mt: '45px',
                                '& .MuiPaper-root': {
                                    borderRadius: 2,
                                    minWidth: 200,
                                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
                                    border: '1px solid',
                                    borderColor: 'divider',
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
                            <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {user?.user_metadata?.display_name || user?.email}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                                    {user?.email}
                                </Typography>
                            </Box>

                            <MenuItem 
                                onClick={() => handleMenuItemClick({ 
                                    path: '/profile', 
                                    label: 'Profile',
                                    requiresAuth: true 
                                })}
                                sx={{
                                    py: 1.5,
                                    px: 2.5,
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                }}
                            >
                                <Typography>Profile</Typography>
                            </MenuItem>

                            <MenuItem 
                                onClick={() => handleMenuItemClick({ 
                                    path: '/billing', 
                                    label: 'Account',
                                    requiresAuth: true 
                                })}
                                sx={{
                                    py: 1.5,
                                    px: 2.5,
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                }}
                            >
                                <Typography>Account</Typography>
                            </MenuItem>

                            <MenuItem 
                                onClick={() => handleMenuItemClick({ 
                                    path: '/settings', 
                                    label: 'Settings',
                                    requiresAuth: true 
                                })}
                                sx={{
                                    py: 1.5,
                                    px: 2.5,
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                }}
                            >
                                <Typography>Settings</Typography>
                            </MenuItem>

                            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 1 }} />

                            <MenuItem 
                                onClick={() => handleMenuItemClick({ 
                                    path: '/admin', 
                                    label: 'Admin',
                                    requiresAuth: true 
                                })}
                                sx={{
                                    py: 1.5,
                                    px: 2.5,
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                }}
                            >
                                <Typography>Admin</Typography>
                            </MenuItem>

                            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 1 }}>
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
                            </Box>
                        </Menu>
                    </Box>
                </Toolbar>
            </Box>
        </AppBar>
    );
} 