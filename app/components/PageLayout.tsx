"use client";

import React from 'react';
import { Box, Container } from '@mui/material';

interface PageLayoutProps {
    children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
    return (
        <Container maxWidth="xl">
            <Box sx={{ 
                py: { xs: 2, sm: 3, md: 4 },
                px: { xs: 2, sm: 3 },
                minHeight: '100vh'
            }}>
                {children}
            </Box>
        </Container>
    );
} 