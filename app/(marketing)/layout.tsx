'use client';

import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PageLayout
            layout="marketing"
            footer={{
                content: <Footer />
            }}
        >
            <Navigation />
            {children}
        </PageLayout>
    );
} 