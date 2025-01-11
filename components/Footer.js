"use client";
import React from 'react';
import { Box, Container, Grid, Typography, Link, Stack, IconButton, Divider } from '@mui/material';
import { Facebook, Twitter, LinkedIn, Instagram } from '@mui/icons-material';
import ContentContainer from './ContentContainer';
import { useTheme } from '@mui/material/styles';

export default function Footer() {
    const theme = useTheme();
    
    const footerLinks = {
        'Product': [
            { name: 'Features', href: '/features' },
            { name: 'Pricing', href: '/pricing' },
            { name: 'Use Cases', href: '/use-cases' },
            { name: 'API', href: '/api' },
        ],
        'Company': [
            { name: 'About Us', href: '/about' },
            { name: 'Contact', href: '/contact' },
            { name: 'Careers', href: '/careers' },
            { name: 'Blog', href: '/blog' },
        ],
        'Resources': [
            { name: 'Documentation', href: '/docs' },
            { name: 'Support', href: '/support' },
            { name: 'Status', href: '/status' },
            { name: 'Privacy Policy', href: '/privacy' },
        ],
    };

    const socialLinks = [
        { Icon: Facebook, href: 'https://facebook.com' },
        { Icon: Twitter, href: 'https://twitter.com' },
        { Icon: LinkedIn, href: 'https://linkedin.com' },
        { Icon: Instagram, href: 'https://instagram.com' },
    ];

    return (
        <Box 
            component="footer" 
            sx={{ 
                backgroundColor: 'white',
                pt: 8,
                pb: 4,
                mt: 'auto',
                borderTop: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.08)',
            }}
        >
            <ContentContainer>
                <Grid container spacing={4}>
                    {/* Logo and Description */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ mb: 3 }}>
                            <Typography 
                                variant="h6"
                                component={Link}
                                href="/"
                                className="brand-logo"
                                sx={{ 
                                    mb: 2,
                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                    color: 'inherit'
                                }}
                            >
                                RECAPIO.AI
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Transform your conversations into actionable insights with our advanced AI-powered transcription and summarization platform.
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                {socialLinks.map(({ Icon, href }, index) => (
                                    <IconButton 
                                        key={index}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{ 
                                            color: 'text.secondary',
                                            '&:hover': {
                                                color: theme.palette.primary.main,
                                                backgroundColor: `${theme.palette.primary.main}15`,
                                            }
                                        }}
                                    >
                                        <Icon sx={{ fontSize: 20 }} />
                                    </IconButton>
                                ))}
                            </Stack>
                        </Box>
                    </Grid>

                    {/* Navigation Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <Grid item xs={6} sm={4} md={2.5} key={category}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    color: 'text.primary',
                                    fontWeight: 700,
                                    mb: 2,
                                }}
                            >
                                {category}
                            </Typography>
                            <Stack spacing={1.5}>
                                {links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.href}
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            textDecoration: 'none',
                                            '&:hover': {
                                                color: theme.palette.primary.main,
                                            }
                                        }}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </Stack>
                        </Grid>
                    ))}
                </Grid>

                <Divider sx={{ my: 4 }} />

                {/* Bottom Section */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'center', sm: 'flex-start' },
                        gap: 2,
                    }}
                >
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 1, sm: 3 }}
                        alignItems="center"
                    >
                        <Link
                            href="/terms"
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                textDecoration: 'none',
                                '&:hover': { color: theme.palette.primary.main }
                            }}
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="/privacy"
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                textDecoration: 'none',
                                '&:hover': { color: theme.palette.primary.main }
                            }}
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/cookies"
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                textDecoration: 'none',
                                '&:hover': { color: theme.palette.primary.main }
                            }}
                        >
                            Cookie Policy
                        </Link>
                    </Stack>
                </Box>
            </ContentContainer>
        </Box>
    );
} 