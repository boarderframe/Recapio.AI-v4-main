'use client';

import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import Navigation from '@/components/Navigation';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PageLayout
            layout="auth"
            footer={{ show: false }}
        >
            <Navigation />
            {children}
        </PageLayout>
    );
} 