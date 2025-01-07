"use client";

import { Box } from '@mui/material';
import { useThemeSettings } from '@/context/ThemeContext';
import AuthNavbar from './AuthNavbar';
import PageHeader from './PageHeader';

export default function PageLayout({ children, title, subtitle, toolbar }) {
    const { themeSettings } = useThemeSettings();

    // Convert spacing value (0-10) to pixels, multiplied by 4 for more noticeable gaps
    const getSpacing = (value) => value * 4;

    return (
        <>
            <AuthNavbar />
            <Box 
                component="main" 
                sx={{ 
                    minHeight: '100vh',
                    mt: `${themeSettings.navigation.height}px`,
                    pt: getSpacing(themeSettings.spacing.navToHeaderGap),
                    pb: 4,
                    bgcolor: 'background.default'
                }}
            >
                <Box sx={{ 
                    width: '100%', 
                    maxWidth: '1200px', 
                    mx: 'auto', 
                    px: { xs: 2, sm: 3 }
                }}>
                    {/* Content Stack */}
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                    }}>
                        {/* Header Section */}
                        {(title || subtitle) && (
                            <Box sx={{ mb: getSpacing(themeSettings.spacing.headerToToolbarGap) }}>
                                <PageHeader 
                                    title={title} 
                                    subtitle={subtitle} 
                                />
                            </Box>
                        )}

                        {/* Toolbar Section */}
                        {toolbar && (
                            <Box sx={{ mb: getSpacing(themeSettings.spacing.toolbarToContentGap) }}>
                                {toolbar}
                            </Box>
                        )}

                        {/* Content Section */}
                        <Box sx={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            gap: getSpacing(themeSettings.spacing.contentGap)
                        }}>
                            {children}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
} 