"use client";

import { Box } from '@mui/material';
import { useThemeSettings } from '@/context/ThemeContext';

export default function ContentContainer({ children, sx = {} }) {
    const { themeSettings } = useThemeSettings();

    // Default spacing settings
    const spacingDefaults = {
        contentGap: 3,
        containerPadding: 4,
        ...themeSettings?.spacing
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacingDefaults.contentGap * 8,
                p: spacingDefaults.containerPadding,
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto',
                ...sx
            }}
        >
            {children}
        </Box>
    );
} 