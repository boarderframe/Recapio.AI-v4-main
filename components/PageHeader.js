'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useThemeSettings } from '@/context/ThemeContext';

export default function PageHeader({ title, subtitle, sx = {} }) {
    const theme = useTheme();
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
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'flex-start',
            }}>
                <Typography 
                    variant="h1" 
                    sx={{ 
                        fontSize: themeSettings.header.titleSize,
                        fontWeight: themeSettings.header.titleWeight,
                        lineHeight: 1.2,
                        color: 'text.primary',
                        mb: 1.5,
                        position: 'relative',
                        pb: 1,
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: themeSettings.header.underlineWidth,
                            height: '2px',
                            background: `linear-gradient(90deg, 
                                ${theme.palette.primary.main}${Math.round(themeSettings.header.underlineOpacity * 100)} 0%, 
                                transparent 100%
                            )`,
                        }
                    }}
                >
                    {title}
                </Typography>
                {subtitle && (
                    <Typography 
                        variant="subtitle1" 
                        sx={{ 
                            color: 'text.secondary',
                            fontSize: themeSettings.header.subtitleSize,
                            lineHeight: 1.4,
                            fontWeight: themeSettings.header.subtitleWeight,
                            letterSpacing: '0.01em',
                            mt: 0.5
                        }}
                    >
                        {subtitle}
                    </Typography>
                )}
            </Box>
        </Box>
    );
} 