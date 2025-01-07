import { Inter } from 'next/font/google';
import ThemeRegistry from '@/components/ThemeRegistry';
import { AuthProvider } from '@/lib/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Recapio.ai',
    description: 'AI-powered transcription and analysis',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ThemeRegistry>
                    <ThemeProvider>
                        <AuthProvider>
                            {children}
                        </AuthProvider>
                    </ThemeProvider>
                </ThemeRegistry>
            </body>
        </html>
    );
}
