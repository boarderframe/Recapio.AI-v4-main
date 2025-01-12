import { Inter } from 'next/font/google';
import ThemeRegistry from '../components/ThemeRegistry';
import { AuthProvider } from '../lib/AuthContext';
import { ThemeProvider as CustomThemeProvider } from '../context/ThemeContext';
import Footer from '../components/Footer';
import { Providers } from './providers';
import Navigation from '../components/Navigation';

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
                    <Providers>
                        <CustomThemeProvider>
                            <AuthProvider>
                                <Navigation />
                                {children}
                                <Footer />
                            </AuthProvider>
                        </CustomThemeProvider>
                    </Providers>
                </ThemeRegistry>
            </body>
        </html>
    );
}
