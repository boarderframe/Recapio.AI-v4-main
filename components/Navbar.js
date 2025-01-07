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
    useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';
import { useThemeSettings } from '@/context/ThemeContext';

const pages = ['Home', 'Features', 'Pricing', 'About Us', 'Contact Us'];

const getPageRoute = (page) => {
    switch (page) {
        case 'Home':
            return '/';
        case 'About Us':
            return '/about';
        case 'Contact Us':
            return '/contact';
        default:
            return `/${page.toLowerCase()}`;
    }
};

export default function Navbar() {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const router = useRouter();
    const theme = useTheme();
    const { themeSettings } = useThemeSettings();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleNavigation = (page) => {
        handleCloseNavMenu();
        const route = getPageRoute(page);
        router.push(route);
    };

    return (
        <AppBar 
            position="fixed" 
            sx={{ 
                backgroundColor: 'background.paper',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
                    }}
                >
                    {/* Logo */}
                    <Typography
                        variant="h6"
                        component="a"
                        href="/"
                        className="brand-logo"
                        sx={{
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                            mr: 4,
                            cursor: 'pointer',
                            flexGrow: { xs: 1, md: 0 },
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        RECAPIO.AI
                    </Typography>

                    {/* Mobile menu */}
                    <Box sx={{ 
                        display: { xs: 'flex', md: 'none' },
                        alignItems: 'center',
                        height: '100%'
                    }}>
                        <IconButton
                            size="large"
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
                            {[...pages, 'Login'].map((page) => (
                                <MenuItem 
                                    key={page} 
                                    onClick={() => handleNavigation(page)}
                                    sx={{
                                        color: 'text.primary',
                                        '&:hover': {
                                            backgroundColor: 'action.hover',
                                        }
                                    }}
                                >
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* Desktop menu */}
                    <Box sx={{ 
                        flexGrow: 1, 
                        display: { xs: 'none', md: 'flex' }, 
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        gap: 1
                    }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={() => handleNavigation(page)}
                                sx={{
                                    color: 'text.primary',
                                    fontSize: '0.875rem',
                                    px: 1.5,
                                    position: 'relative',
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
                                    '&:hover::after': {
                                        width: '100%',
                                    },
                                }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

                    {/* Auth controls */}
                    <Box sx={{ 
                        display: { xs: 'none', md: 'flex' }, 
                        alignItems: 'center',
                        height: '100%',
                        gap: 1 
                    }}>
                        <Button
                            onClick={() => handleNavigation('Login')}
                            sx={{
                                color: 'text.primary',
                                fontSize: '0.875rem',
                                position: 'relative',
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
                                '&:hover::after': {
                                    width: '100%',
                                },
                            }}
                        >
                            Login
                        </Button>
                        <Button 
                            variant="contained"
                            onClick={() => router.push('/signup')}
                            sx={{ 
                                fontSize: '0.875rem',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Sign Up
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
} 