'use client';

import { Box, Typography, Divider } from '@mui/material';
import { useThemeSettings } from '@/context/ThemeContext';

export default function PageHeader({ title, subtitle }) {
    const { themeSettings } = useThemeSettings();

    return (
        <Box
            sx={{
                backgroundColor: 'background.paper',
                borderRadius: '12px',
                padding: '24px 32px',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                border: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.08)',
                transform: 'perspective(1000px) rotateX(2deg)',
                transformOrigin: 'top',
                mb: 3
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    fontSize: { xs: '2rem', sm: '2.4rem' },
                    mb: 2
                }}
            >
                {title}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography
                variant="subtitle1"
                sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    fontSize: { xs: '1.1rem', sm: '1.2rem' }
                }}
            >
                {subtitle}
            </Typography>
        </Box>
    );
} 