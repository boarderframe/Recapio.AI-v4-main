'use client';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <a href="/" className="text-2xl font-bold text-primary">
                        Recapio
                    </a>
                </div>
            </div>
            {children}
        </div>
    );
} 