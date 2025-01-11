"use client";

import React, { useState } from 'react';
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
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useAuth } from '@/lib/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import { useThemeSettings } from '@/context/ThemeContext';
import ProfileMenu from './ProfileMenu';

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
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'New Transcript', path: '/new-transcript' },
        { label: 'Library', path: '/transcripts' },
        { label: 'Reports', path: '/reporting' },
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
        router.push(path);
    };

    const navItems = user ? postLoginItems : preLoginItems;

    return (
        <AppBar 
            position="fixed" 
            sx={{ 
                background: '#ffffff',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                height: '64px',
                borderBottom: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.06)'
            }}
        >
            <Box
                sx={{
                    maxWidth: '1200px',
                    width: '100%',
                    mx: 'auto',
                    px: { xs: 2, sm: 3, md: 4 }
                }}
            >
                <Toolbar 
                    disableGutters 
                    sx={{ 
                        minHeight: '64px !important',
                        height: '64px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 3
                    }}
                >
                    {/* Logo */}
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        width: '200px' 
                    }}>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                fontFamily: 'inherit',
                                fontWeight: 700,
                                fontSize: '1.4rem',
                                letterSpacing: '0.02em',
                                color: theme.palette.primary.main,
                                textDecoration: 'none',
                                textTransform: 'uppercase',
                                display: 'flex',
                                alignItems: 'center',
                                height: '100%',
                                textShadow: 'none'
                            }}
                        >
                            Recapio.ai
                        </Typography>
                    </Box>

                    {/* Desktop Navigation */}
                    <Box sx={{ 
                        display: { xs: 'none', md: 'flex' }, 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        flex: 1,
                        maxWidth: '800px',
                        mx: 'auto'
                    }}>
                        {user ? (
                            <>
                                {navItems.map((item, index) => (
                                    <Button
                                        key={`nav-item-${index}`}
                                        onClick={() => handleNavigation(item.path)}
                                        sx={{
                                            color: pathname === item.path ? 'primary.main' : 'text.secondary',
                                            fontWeight: pathname === item.path ? 600 : 500,
                                            fontSize: '0.9rem',
                                            textTransform: 'none',
                                            px: 2,
                                            py: 0.8,
                                            minWidth: '120px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            borderRadius: 1.5,
                                            backgroundColor: pathname === item.path ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                                            '&:hover': {
                                                backgroundColor: pathname === item.path 
                                                    ? 'rgba(25, 118, 210, 0.12)' 
                                                    : 'rgba(0, 0, 0, 0.04)',
                                                color: pathname === item.path ? 'primary.main' : 'text.primary'
                                            }
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                ))}
                            </>
                        ) : (
                            <>
                                {preLoginItems.map((item, index) => (
                                    <Button
                                        key={`nav-item-${index}`}
                                        onClick={() => handleNavigation(item.path)}
                                        sx={{
                                            color: pathname === item.path ? 'primary.main' : 'text.secondary',
                                            fontWeight: pathname === item.path ? 600 : 500,
                                            fontSize: '0.9rem',
                                            textTransform: 'none',
                                            px: 2,
                                            py: 0.8,
                                            minWidth: '120px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            borderRadius: 1.5,
                                            backgroundColor: pathname === item.path ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                                            '&:hover': {
                                                backgroundColor: pathname === item.path 
                                                    ? 'rgba(25, 118, 210, 0.12)' 
                                                    : 'rgba(0, 0, 0, 0.04)',
                                                color: pathname === item.path ? 'primary.main' : 'text.primary'
                                            }
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                ))}
                            </>
                        )}
                    </Box>

                    {/* Right Section - Auth Controls or Profile */}
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        width: '200px',
                        justifyContent: 'flex-end',
                        gap: 1
                    }}>
                        {user ? (
                            <IconButton
                                onClick={handleProfileMenuOpen}
                                size="small"
                                aria-label="account menu"
                                aria-controls="profile-menu"
                                aria-haspopup="true"
                                aria-expanded={Boolean(profileMenuAnchor)}
                            >
                                <Avatar sx={{ width: 36, height: 36 }}>
                                    {user?.email?.charAt(0).toUpperCase()}
                                </Avatar>
                            </IconButton>
                        ) : (
                            <>
                                <Button
                                    onClick={() => handleNavigation('/login')}
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: '0.9rem',
                                        fontWeight: 500,
                                        textTransform: 'none',
                                        px: 2,
                                        py: 0.8,
                                        borderRadius: 1.5,
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                            color: 'text.primary'
                                        }
                                    }}
                                >
                                    Sign in
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => handleNavigation('/register')}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        fontSize: '0.9rem',
                                        px: 2.5,
                                        py: 0.8,
                                        borderRadius: 1.5,
                                        boxShadow: 'none',
                                        backgroundColor: 'primary.main',
                                        '&:hover': {
                                            boxShadow: 'none',
                                            backgroundColor: 'primary.dark'
                                        }
                                    }}
                                >
                                    Get Started
                                </Button>
                            </>
                        )}
                    </Box>

                    {/* Mobile Menu Button */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show navigation menu"
                            aria-controls="mobile-menu"
                            aria-haspopup="true"
                            aria-expanded={Boolean(mobileMenuAnchor)}
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>

                    {/* Mobile Menu */}
                    <Menu
                        id="mobile-menu"
                        anchorEl={mobileMenuAnchor}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(mobileMenuAnchor)}
                        onClose={handleMobileMenuClose}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                        }}
                    >
                        {navItems.map((item, index) => (
                            <MenuItem 
                                key={`nav-item-mobile-${index}`}
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    color: pathname === item.path ? 'primary.main' : 'text.primary',
                                    fontWeight: pathname === item.path ? 600 : 500,
                                }}
                            >
                                {item.label}
                            </MenuItem>
                        ))}
                    </Menu>
                </Toolbar>
            </Box>
        </AppBar>
    );
} 