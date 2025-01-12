"use client";

import { Box } from '@mui/material';
import { useThemeSettings } from '../context/ThemeContext';
import PageHeader from './PageHeader';

export default function PageLayout({ children, title, subtitle }) {
    const { themeSettings } = useThemeSettings();

    // Convert spacing units to pixels (1 unit = 8px)
    const getSpacing = (value) => {
        if (typeof value !== 'number') return '16px';
        return `${value * 8}px`;
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: 'background.default'
        }}>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    pt: `calc(${themeSettings?.spacing?.navHeight || 64}px + ${getSpacing(4)})`,
                    pb: 6,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Box
                    sx={{
                        maxWidth: '1200px',
                        width: '100%',
                        mx: 'auto',
                        px: { xs: 2, sm: 3, md: 4 },
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <PageHeader title={title} subtitle={subtitle} />
                    <Box
                        sx={{
                            mt: getSpacing(themeSettings?.spacing?.headerToToolbarGap || 2),
                            flex: 1
                        }}
                    >
                        {children}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
} 