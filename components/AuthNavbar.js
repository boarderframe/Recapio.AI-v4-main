"use client";

import React from 'react';
import { useState } from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Button,
    MenuItem,
    Avatar,
    Divider,
    ListItemIcon,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '@/lib/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';
import ProfileMenu from './ProfileMenu';
import { useThemeSettings } from '@/context/ThemeContext';

export default function AuthNavbar() {
    const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
    const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
    const { user, signOut } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const theme = useTheme();
    const { themeSettings } = useThemeSettings();

    // Pre-login navigation items
    const preLoginItems = [
        { label: 'Home', path: '/' },
        { label: 'Features', path: '/features' },
        { label: 'Pricing', path: '/pricing' },
        { label: 'About', path: '/about' },
        { label: 'Contact', path: '/contact' },
    ];

    // Post-login navigation items
    const postLoginItems = [
        { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
        { label: 'New Transcript', path: '/new-transcript' },
        { label: 'Transcript Library', path: '/transcripts' },
        { label: 'Reporting', path: '/reporting' },
        { label: 'Settings', path: '/settings' },
    ];

    const handleMobileMenuOpen = (event) => {
        setMobileMenuAnchor(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMenuAnchor(null);
    };

    const handleProfileMenuOpen = (event) => {
        setProfileMenuAnchor(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setProfileMenuAnchor(null);
    };

    const handleSignOut = async () => {
        handleProfileMenuClose();
        await signOut();
    };

    const handleNavigation = (path) => {
        handleMobileMenuClose();
        handleProfileMenuClose();
        router.replace(path);
    };

    const navItems = user ? postLoginItems : preLoginItems;

    return (
        <AppBar 
            position="fixed" 
            sx={{ 
                backgroundColor: 'background.paper',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                height: `${themeSettings.spacing.navHeight}px`,
            }}
        >
            <Container maxWidth="xl">
                <Toolbar 
                    disableGutters 
                    sx={{ 
                        minHeight: `${themeSettings.spacing.navHeight}px !important`,
                        height: `${themeSettings.spacing.navHeight}px`,
                        display: 'flex',
                        alignItems: 'center',
                        px: 2
                    }}
                >
                    {/* Logo */}
                    <Box 
                        onClick={() => handleNavigation(user ? '/dashboard' : '/')}
                        sx={{ 
                            textDecoration: 'none',
                            cursor: 'pointer',
                            py: 1
                        }}
                    >
                        <Typography
                            variant="h6"
                            className="brand-logo"
                            sx={{
                                fontWeight: 700,
                                letterSpacing: '.1rem',
                                background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} 90%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontSize: '1.75rem',
                                display: 'inline-block',
                            }}
                        >
                            RECAPIO.AI
                        </Typography>
                    </Box>

                    {/* Desktop Navigation */}
                    <Box sx={{ 
                        display: { xs: 'none', md: 'flex' }, 
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 2,
                        flex: 1,
                        mx: 4
                    }}>
                        {navItems.map((item, index) => (
                            <Button 
                                key={`nav-item-desktop-${index}`} 
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    color: pathname === item.path ? 'primary.main' : 'text.primary',
                                    fontWeight: pathname === item.path ? 600 : 500,
                                    fontSize: '0.95rem',
                                    textTransform: 'none',
                                    minHeight: '48px',
                                    px: 2.5,
                                    borderRadius: 1,
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        width: pathname === item.path ? '80%' : '0%',
                                        height: '2px',
                                        bottom: '10px',
                                        left: '10%',
                                        backgroundColor: theme.palette.primary.main,
                                        transition: 'width 0.3s ease-in-out',
                                    },
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                        '&::after': {
                                            width: '80%',
                                        }
                                    }
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>

                    {/* Auth Controls */}
                    <Box sx={{ 
                        display: { xs: 'none', md: 'flex' }, 
                        alignItems: 'center',
                        gap: 2.5,
                        flexShrink: 0,
                    }}>
                        {user ? (
                            <>
                                <IconButton
                                    onClick={handleProfileMenuOpen}
                                    sx={{ 
                                        p: 0.75,
                                        border: '2px solid',
                                        borderColor: 'primary.main',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            backgroundColor: `${theme.palette.primary.main}0A`,
                                            transform: 'scale(1.05)',
                                        }
                                    }}
                                >
                                    <Avatar 
                                        sx={{ 
                                            width: 36, 
                                            height: 36,
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            fontSize: '1.1rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        {user.email ? user.email[0].toUpperCase() : 'U'}
                                    </Avatar>
                                </IconButton>
                                <ProfileMenu 
                                    anchorEl={profileMenuAnchor}
                                    open={Boolean(profileMenuAnchor)}
                                    onClose={handleProfileMenuClose}
                                    user={user}
                                    onSignOut={handleSignOut}
                                    onNavigate={handleNavigation}
                                />
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={() => handleNavigation('/login')}
                                    sx={{
                                        color: 'text.primary',
                                        fontSize: '0.9rem',
                                        fontWeight: 500,
                                        textTransform: 'none',
                                        px: 2,
                                        position: 'relative',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            width: '0%',
                                            height: '2px',
                                            bottom: '6px',
                                            left: '10%',
                                            backgroundColor: theme.palette.primary.main,
                                            transition: 'width 0.3s ease-in-out',
                                        },
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                            '&::after': {
                                                width: '80%',
                                            }
                                        }
                                    }}
                                >
                                    Login
                                </Button>
                                <Button 
                                    variant="contained"
                                    onClick={() => handleNavigation('/signup')}
                                    sx={{ 
                                        fontSize: '0.9rem',
                                        fontWeight: 500,
                                        textTransform: 'none',
                                        px: 3,
                                        py: 1,
                                        borderRadius: '8px',
                                        boxShadow: `0 4px 12px ${theme.palette.primary.main}33`,
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-1px)',
                                            boxShadow: `0 6px 16px ${theme.palette.primary.main}4D`,
                                        },
                                    }}
                                >
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </Box>

                    {/* Mobile Menu Button */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-controls={Boolean(mobileMenuAnchor) ? 'mobile-menu' : undefined}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            sx={{ 
                                color: 'text.primary',
                                '&:hover': {
                                    backgroundColor: `${theme.palette.primary.main}0A`,
                                }
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>

                    {/* Mobile Menu */}
                    <Menu
                        id="mobile-menu"
                        anchorEl={mobileMenuAnchor}
                        open={Boolean(mobileMenuAnchor)}
                        onClose={handleMobileMenuClose}
                        onClick={handleMobileMenuClose}
                        PaperProps={{
                            sx: {
                                mt: 1.5,
                                minWidth: 200,
                                borderRadius: 2,
                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                '& .MuiMenuItem-root': {
                                    px: 2,
                                    py: 1.5,
                                    borderRadius: 1,
                                    mx: 1,
                                    my: 0.5,
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    '&:hover': {
                                        backgroundColor: `${theme.palette.primary.main}0A`,
                                    }
                                }
                            }
                        }}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        {user && (
                            <Box sx={{ px: 2, py: 1.5 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {user.email}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Pro Plan
                                </Typography>
                            </Box>
                        )}
                        <Divider sx={{ display: user ? 'block' : 'none' }} />
                        {navItems.map((item, index) => (
                            <MenuItem 
                                key={`nav-item-mobile-${index}`} 
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    color: pathname === item.path ? 'primary.main' : 'text.primary',
                                    fontWeight: pathname === item.path ? 600 : 400,
                                    py: 1.5,
                                }}
                            >
                                {item.label}
                            </MenuItem>
                        ))}
                        
                        {user ? [
                            <Divider key="divider-signout" />,
                            <MenuItem 
                                key="signout-mobile"
                                onClick={handleSignOut}
                                sx={{ color: 'error.main', py: 1.5 }}
                            >
                                <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
                                Sign Out
                            </MenuItem>
                        ] : [
                            <Divider key="divider-auth" />,
                            <MenuItem 
                                key="login-mobile"
                                onClick={() => handleNavigation('/login')}
                                sx={{ py: 1.5 }}
                            >
                                Login
                            </MenuItem>,
                            <MenuItem 
                                key="signup-mobile"
                                onClick={() => handleNavigation('/signup')}
                                sx={{ py: 1.5 }}
                            >
                                Sign Up
                            </MenuItem>
                        ]}
                    </Menu>
                </Toolbar>
            </Container>
        </AppBar>
    );
} 