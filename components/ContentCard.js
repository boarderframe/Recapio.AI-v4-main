"use client";

import { Box } from '@mui/material';
import { useThemeSettings } from '@/context/ThemeContext';

export default function ContentCard({ children, sx = {} }) {
    const { themeSettings } = useThemeSettings();

    return (
        <Box
            sx={{
                p: themeSettings.spacing.cardPadding,
                borderRadius: `${themeSettings.content.borderRadius}px`,
                boxShadow: themeSettings.content.boxShadow || '0 2px 8px rgba(0, 0, 0, 0.05)',
                border: '1px solid',
                borderColor: themeSettings.content.borderColor || 'rgba(0, 0, 0, 0.05)',
                backgroundColor: '#ffffff',
                ...sx
            }}
        >
            {children}
        </Box>
    );
} 