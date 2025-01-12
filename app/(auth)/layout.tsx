'use client';

import React from 'react';
import { Box } from '@mui/material';
import Navigation from '@/components/Navigation';
import PageLayout from '@/components/PageLayout';

export default function AuthLayout({
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
                    bgcolor: 'background.default',
                }}
            >
                <Navigation />
                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 4,
                    }}
                >
                    {children}
                </Box>
            </Box>
        </PageLayout>
    );
} 