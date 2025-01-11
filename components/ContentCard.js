"use client";

import { Box, Paper } from '@mui/material';
import { useThemeSettings } from '@/context/ThemeContext';

export default function ContentCard({ children, sx = {} }) {
    const { themeSettings } = useThemeSettings();
    
    // Default content settings
    const contentDefaults = {
        borderRadius: 12,
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        maxWidth: '100%',
        ...themeSettings?.content
    };

    // Default spacing settings
    const spacingDefaults = {
        cardPadding: 4,
        contentGap: 4,
        ...themeSettings?.spacing
    };
    
    // Convert spacing units to pixels (1 unit = 8px)
    const getSpacing = (value) => {
        if (typeof value !== 'number') return '24px';
        return `${value * 8}px`;
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: getSpacing(spacingDefaults.cardPadding),
                borderRadius: `${contentDefaults.borderRadius}px`,
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                border: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.06)',
                backgroundColor: '#ffffff',
                maxWidth: contentDefaults.maxWidth,
                transform: 'none',
                '&:hover': {
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                    transition: 'box-shadow 0.3s ease-in-out'
                },
                ...sx
            }}
        >
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: getSpacing(spacingDefaults.contentGap)
            }}>
                {children}
            </Box>
        </Paper>
    );
} 