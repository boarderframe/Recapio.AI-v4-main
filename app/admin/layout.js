'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import Footer from '@/components/Footer';

export default function AdminRootLayout({ children }) {
    return (
        <PageLayout
            layout="admin"
            title="Admin Dashboard"
            footer={{
                content: <Footer minimal />
            }}
        >
            {children}
        </PageLayout>
    );
} 