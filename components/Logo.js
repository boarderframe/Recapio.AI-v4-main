"use client";

import { Box, Typography, useTheme } from '@mui/material';

export default function Logo({ sx = {} }) {
    const theme = useTheme();
    
    return (
        <Box
            component="a"
            href="/"
            sx={{
                textDecoration: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: 0,
                margin: 0,
                lineHeight: 0,
                height: 'fit-content',
                backgroundColor: 'transparent',
                ...sx
            }}
        >
            <Typography
                variant="h6"
                component="span"
                sx={{
                    fontWeight: 700,
                    color: '#212121',
                    fontSize: '1.9rem',
                    letterSpacing: '0.02em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    lineHeight: 1,
                    padding: 0,
                    margin: 0,
                    height: 'fit-content',
                    WebkitTextFillColor: '#212121',
                }}
            >
                RECAPIO
            </Typography>
            <Typography
                variant="h6"
                component="span"
                sx={{
                    fontWeight: 700,
                    fontSize: '1.9rem',
                    letterSpacing: '0.02em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    lineHeight: 1,
                    padding: 0,
                    margin: 0,
                    height: 'fit-content',
                    color: '#4682B4',
                    WebkitTextFillColor: '#4682B4',
                }}
            >
                .AI
            </Typography>
        </Box>
    );
} 