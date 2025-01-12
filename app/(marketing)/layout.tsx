'use client';

import React from 'react';
import { Box } from '@mui/material';
import Navigation from '@/components/Navigation';
import PageLayout from '@/components/PageLayout';
import Footer from '@/components/Footer';

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PageLayout>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                }}
            >
                <Navigation />
                <Box component="main" sx={{ flex: 1 }}>
                    {children}
                </Box>
                <Footer />
            </Box>
        </PageLayout>
    );
} 