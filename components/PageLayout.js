"use client";

import { Box } from '@mui/material';
import { useThemeSettings } from '@/context/ThemeContext';
import PageHeader from './PageHeader';
import AuthNavbar from './AuthNavbar';

export default function PageLayout({ children, title, subtitle }) {
    const { themeSettings } = useThemeSettings();

    // Convert spacing units to pixels (1 unit = 8px)
    const getSpacing = (value) => {
        if (typeof value !== 'number') return '16px';
        return `${value * 8}px`;
    };

    return (
        <>
            <AuthNavbar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minHeight: '100vh',
                    pt: `calc(56px + ${getSpacing(4)})`, // Increased spacing from navbar
                    pb: 4,
                    backgroundColor: 'background.default'
                }}
            >
                <Box
                    sx={{
                        maxWidth: '1200px', // Increased from 800px
                        mx: 'auto',
                        px: { xs: 2, sm: 3, md: 4 }
                    }}
                >
                    <PageHeader title={title} subtitle={subtitle} />
                    <Box
                        sx={{
                            mt: getSpacing(themeSettings?.spacing?.headerToToolbarGap || 2)
                        }}
                    >
                        {children}
                    </Box>
                </Box>
            </Box>
        </>
    );
} 