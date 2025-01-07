'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import { AuthProvider } from '@/lib/AuthContext';
import ThemeRegistry from '@/components/ThemeRegistry';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';
import { Box } from '@mui/material';

export default function ClientLayout({ children }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <ThemeRegistry>
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        minHeight: '100vh',
                        pt: { xs: '70px', md: '80px' }
                    }}>
                        <AuthNavbar />
                        <Box component="main" sx={{ flex: 1 }}>
                            {children}
                        </Box>
                        <Footer />
                    </Box>
                </ThemeRegistry>
            </AuthProvider>
        </ThemeProvider>
    );
} 