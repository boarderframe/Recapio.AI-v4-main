"use client";

import { Box, Typography, Link, Grid, useTheme } from '@mui/material';
import Logo from './Logo';

export default function Footer() {
    const theme = useTheme();
    const footerSections = {
        product: {
            title: 'Product',
            items: [
                { label: 'Features', href: '/features' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Use Cases', href: '/use-cases' },
                { label: 'API', href: '/api' }
            ]
        },
        company: {
            title: 'Company',
            items: [
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Careers', href: '/careers' },
                { label: 'Blog', href: '/blog' }
            ]
        },
        resources: {
            title: 'Resources',
            items: [
                { label: 'Documentation', href: '/docs' },
                { label: 'Support', href: '/support' },
                { label: 'Status', href: '/status' },
                { label: 'Privacy Policy', href: '/privacy' }
            ]
        }
    };

    return (
        <Box
            component="footer"
            sx={{
                borderTop: '1px solid',
                borderColor: 'divider',
                py: { xs: 6, md: 8 },
                mt: 'auto',
                backgroundColor: 'background.default'
            }}
        >
            <Box
                sx={{
                    maxWidth: '1200px',
                    width: '100%',
                    mx: 'auto',
                    px: { xs: 2, sm: 3, md: 4 }
                }}
            >
                <Grid container spacing={6}>
                    {/* Logo and Description */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ width: '200px', mb: 3 }}>
                            <Logo />
                        </Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ 
                                fontSize: '0.95rem', 
                                lineHeight: 1.7,
                                maxWidth: '300px',
                                opacity: 0.85,
                                textTransform: 'uppercase',
                                letterSpacing: '0.02em'
                            }}
                        >
                            Transform your conversations into actionable insights with our advanced AI-powered transcription and summarization platform.
                        </Typography>
                    </Grid>

                    {/* Navigation Sections */}
                    {Object.entries(footerSections).map(([key, section]) => (
                        <Grid item xs={6} sm={4} md={2.5} key={key}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 700,
                                    mb: 3,
                                    color: 'text.primary',
                                    fontSize: '0.95rem',
                                    letterSpacing: '0.02em',
                                    textTransform: 'uppercase'
                                }}
                            >
                                {section.title}
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2
                                }}
                            >
                                {section.items.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        sx={{
                                            color: 'text.secondary',
                                            textDecoration: 'none',
                                            fontSize: '0.95rem',
                                            opacity: 0.85,
                                            transition: 'all 0.2s ease-in-out',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.02em',
                                            '&:hover': {
                                                color: 'primary.main',
                                                opacity: 1,
                                                transform: 'translateX(4px)'
                                            }
                                        }}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
} 