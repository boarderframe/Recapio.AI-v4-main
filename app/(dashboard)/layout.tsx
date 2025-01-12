'use client';

import React from 'react';
import { Box } from '@mui/material';
import Navigation from '@/components/Navigation';
import PageLayout from '@/components/PageLayout';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    // This is a backup client-side check in addition to middleware
    React.useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            >
                Loading...
            </Box>
        );
    }

    if (!user) {
        return null;
    }

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
                        py: 4,
                        px: { xs: 2, sm: 4 },
                    }}
                >
                    {children}
                </Box>
            </Box>
        </PageLayout>
    );
} 