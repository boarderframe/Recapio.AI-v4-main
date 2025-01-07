"use client";
// app/Header.js
import React from 'react';
import { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Box,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const pathname = usePathname();

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Features', path: '/features' },
        { label: 'Pricing', path: '/pricing' },
        { label: 'About', path: '/about' },
        { label: 'Contact', path: '/contact' },
    ];

    const authItems = [
        { label: 'Login', path: '/login' },
        { label: 'Sign Up', path: '/signup' },
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2, color: theme => theme.palette.primary.main, fontWeight: 700 }}>
                Recapio.ai
            </Typography>
            <List>
                {[...navItems, ...authItems].map((item) => (
                    <ListItem key={item.path}>
                        <Link href={item.path} style={{ width: '100%', textDecoration: 'none', color: 'inherit' }}>
                            <ListItemText 
                                primary={item.label}
                                sx={{
                                    textAlign: 'center',
                                    color: pathname === item.path ? theme => theme.palette.primary.main : 'inherit'
                                }}
                            />
                        </Link>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <AppBar 
            position="sticky" 
            elevation={0}
            sx={{ 
                backgroundColor: theme => theme.palette.background.paper,
                borderBottom: 1,
                borderColor: 'divider',
                color: theme => theme.palette.text.primary
            }}
        >
            <Toolbar sx={{ py: 1.5 }}>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        flexGrow: 1,
                        fontWeight: 700,
                        color: theme => theme.palette.primary.main,
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                        Recapio.ai
                    </Link>
                </Typography>

                {isMobile ? (
                    <>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            variant="temporary"
                            anchor="right"
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            ModalProps={{
                                keepMounted: true,
                            }}
                            sx={{
                                display: { xs: 'block', sm: 'none' },
                                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </>
                ) : (
                    <>
                        <Box sx={{ display: 'flex', gap: 2, mr: 3 }}>
                            {navItems.map((item) => (
                                <Button
                                    key={item.path}
                                    component={Link}
                                    href={item.path}
                                    sx={{
                                        color: pathname === item.path 
                                            ? theme.palette.primary.main 
                                            : theme.palette.text.secondary,
                                        fontWeight: pathname === item.path ? 700 : 400,
                                        px: 2,
                                        '&:hover': {
                                            color: theme.palette.primary.main,
                                            backgroundColor: `${theme.palette.primary.main}0A`,
                                        },
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {authItems.map((item, index) => (
                                <Button
                                    key={item.path}
                                    component={Link}
                                    href={item.path}
                                    variant={index === 1 ? "contained" : "outlined"}
                                    color="primary"
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}
