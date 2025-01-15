'use client';

import { MarketingNavigation } from '@/components/layout/MarketingNavigation';

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen">
            <MarketingNavigation />
            <main className="relative flex-1">{children}</main>
            <footer className="border-t">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex justify-between">
                        <p className="text-sm text-gray-500">
                            © {new Date().getFullYear()} Recapio. All rights reserved.
                        </p>
                        <nav className="flex gap-4">
                            <a href="/privacy" className="text-sm text-gray-500 hover:text-gray-600">
                                Privacy
                            </a>
                            <a href="/terms" className="text-sm text-gray-500 hover:text-gray-600">
                                Terms
                            </a>
                        </nav>
                    </div>
                </div>
            </footer>
        </div>
    );
} 