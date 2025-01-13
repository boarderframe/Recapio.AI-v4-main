'use client';

import { PageLayout } from '@/components/layout/PageLayout';

export default function AdminRootLayout({ children }) {
    return (
        <PageLayout
            layout="admin"
            title="Admin Dashboard"
            footer={{ show: false }}
        >
            {children}
        </PageLayout>
    );
} 