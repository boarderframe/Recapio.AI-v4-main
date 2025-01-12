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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';
import { useThemeSettings } from '../context/ThemeContext';
import Logo from './Logo';
import Link from 'next/link';
import type { Route } from '../lib/routes';

interface NavbarProps {
    routes: Route[];
}

export default function Navbar({ routes }: NavbarProps) {
    const [anchorElNav, setAnchorElNav] = useState<HTMLElement | null>(null);
    const router = useRouter();
    const { themeSettings } = useThemeSettings();

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
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
                        justifyContent: 'space-between',
                    }}
                >
                    <Box 
                        sx={{ 
                            width: '200px', 
                            display: { xs: 'none', md: 'flex' },
                            alignItems: 'center',
                            height: '100%',
                            backgroundColor: 'transparent',
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
                            {routes.map((route) => (
                                <MenuItem 
                                    key={route.path} 
                                    component={Link}
                                    href={route.path}
                                    onClick={handleCloseNavMenu}
                                >
                                    <Typography textAlign="center">{route.label}</Typography>
                                </MenuItem>
                            ))}
                            <MenuItem 
                                key="login-mobile" 
                                onClick={handleCloseNavMenu}
                                sx={{ 
                                    color: 'text.primary',
                                    textTransform: 'none',
                                    '& a': {
                                        color: 'inherit',
                                        textDecoration: 'none',
                                        width: '100%',
                                        display: 'block'
                                    }
                                }}
                            >
                                <Link href="/login">Login</Link>
                            </MenuItem>
                            <MenuItem 
                                key="signup-mobile"
                                onClick={handleCloseNavMenu}
                                sx={{ 
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    textTransform: 'none',
                                    borderRadius: 1.5,
                                    my: 1,
                                    mx: 2,
                                    '&:hover': {
                                        bgcolor: 'primary.dark'
                                    },
                                    '& a': {
                                        color: 'inherit',
                                        textDecoration: 'none',
                                        width: '100%',
                                        display: 'block'
                                    }
                                }}
                            >
                                <Link href="/signup">Sign Up</Link>
                            </MenuItem>
                        </Menu>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: 2 }}>
                        {routes.map((route) => (
                            <Button
                                key={route.path}
                                component={Link}
                                href={route.path}
                                onClick={handleCloseNavMenu}
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

                    <Box sx={{ width: '200px', display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
                        <Link 
                            href="/login"
                            style={{ textDecoration: 'none' }}
                        >
                            <Button
                                sx={{
                                    color: 'text.primary',
                                    fontSize: '0.95rem',
                                    textTransform: 'none',
                                    letterSpacing: '0.02em',
                                    '&:hover': {
                                        background: 'transparent',
                                        '&::after': {
                                            width: '100%'
                                        }
                                    },
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: '2px',
                                        left: '0',
                                        width: '0%',
                                        height: '2px',
                                        backgroundColor: 'primary.main',
                                        transition: 'width 0.2s ease-in-out'
                                    }
                                }}
                            >
                                Login
                            </Button>
                        </Link>
                        <Link 
                            href="/signup"
                            style={{ textDecoration: 'none' }}
                        >
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    textTransform: 'none',
                                    fontSize: '0.95rem',
                                    px: 3,
                                    py: 0.8,
                                    borderRadius: 1.5,
                                    boxShadow: '0 2px 8px rgba(70, 130, 180, 0.2)',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark',
                                        boxShadow: '0 4px 12px rgba(70, 130, 180, 0.3)',
                                        transform: 'translateY(-1px)',
                                    },
                                    transition: 'all 0.2s ease-in-out',
                                }}
                            >
                                Sign Up
                            </Button>
                        </Link>
                    </Box>
                </Toolbar>
            </Box>
        </AppBar>
    );
} 