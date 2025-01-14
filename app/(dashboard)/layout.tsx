'use client';

import React from 'react';
import { Box } from '@mui/material';
import { PageLayout } from '@/components/layout/PageLayout';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
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
        <PageLayout
            layout="dashboard"
            footer={{
                content: <Footer minimal />
            }}
        >
            <Navigation />
            {children}
        </PageLayout>
    );
} 