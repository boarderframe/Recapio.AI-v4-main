"use client";
import React from 'react';

import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Container,
    Button,
    useTheme,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import GroupsIcon from '@mui/icons-material/Groups';
import InsightsIcon from '@mui/icons-material/Insights';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PageLayout from '@/components/PageLayout';
import ContentCard from '@/components/ContentCard';

export default function FeaturesPage() {
    const theme = useTheme();

    const features = [
        {
            title: 'AI-Powered Transcription',
            description: 'Transform your spoken content into accurate, searchable text with our advanced AI technology.',
            details: [
                'Industry-leading accuracy',
                'Multiple language support',
                'Speaker identification',
                'Custom vocabulary',
            ],
            image: 'https://via.placeholder.com/600x400',
            icon: <AutoAwesomeIcon sx={{ fontSize: 40 }} />,
            color: theme.palette.primary.main,
        },
        {
            title: 'Real-Time Collaboration',
            description: 'Work seamlessly with your team, no matter where they are located.',
            details: [
                'Live document editing',
                'Comment and annotation tools',
                'Team workspaces',
                'Version control',
            ],
            image: 'https://via.placeholder.com/600x400',
            icon: <GroupsIcon sx={{ fontSize: 40 }} />,
            color: theme.palette.primary.main,
        },
        {
            title: 'Advanced Analytics',
            description: 'Gain valuable insights from your conversations with powerful analytics tools.',
            details: [
                'Sentiment analysis',
                'Topic detection',
                'Trend identification',
                'Custom reports',
            ],
            image: 'https://via.placeholder.com/600x400',
            icon: <InsightsIcon sx={{ fontSize: 40 }} />,
            color: theme.palette.primary.main,
        },
        {
            title: 'Customizable Workflows',
            description: 'Create and automate workflows that match your unique business processes.',
            details: [
                'Drag-and-drop builder',
                'Integration options',
                'Automated actions',
                'Template library',
            ],
            image: 'https://via.placeholder.com/600x400',
            icon: <SettingsSuggestIcon sx={{ fontSize: 40 }} />,
            color: theme.palette.primary.main,
        },
    ];

    const additionalFeatures = [
        'Enterprise-grade security with end-to-end encryption',
        'Seamless integration with popular tools and platforms',
        'Dedicated customer success team',
        'Regular feature updates and improvements',
        'Mobile apps for iOS and Android',
        'Comprehensive API access',
    ];

    return (
        <PageLayout
            title="Features"
            subtitle={
                <>
                    Discover the powerful features
                    <br />
                    that make Recapio.ai the leading choice for conversation intelligence
                </>
            }
        >
            {/* Main Features Section */}
            <Box sx={{ mb: 12 }}>
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: 240,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="240"
                                        image={feature.image}
                                        alt={feature.title}
                                        sx={{
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                            },
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                                            p: 3,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                borderRadius: '12px',
                                                backgroundColor: feature.color,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                            }}
                                        >
                                            {feature.icon}
                                        </Box>
                                        <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                                            {feature.title}
                                        </Typography>
                                    </Box>
                                </Box>
                                <CardContent sx={{ p: 4, flexGrow: 1 }}>
                                    <Typography variant="body1" sx={{ mb: 3, color: theme.palette.text.secondary, lineHeight: 1.7 }}>
                                        {feature.description}
                                    </Typography>
                                    <List disablePadding>
                                        {feature.details.map((detail, detailIndex) => (
                                            <ListItem key={detailIndex} sx={{ px: 0, py: 0.5 }}>
                                                <ListItemIcon sx={{ minWidth: 32, color: feature.color }}>
                                                    <CheckCircleOutlineIcon sx={{ fontSize: 20 }} />
                                                </ListItemIcon>
                                                <ListItemText 
                                                    primary={detail}
                                                    primaryTypographyProps={{
                                                        variant: 'body2',
                                                        sx: { fontWeight: 500 }
                                                    }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Additional Features Section */}
            <ContentCard sx={{ mt: theme.spacing.contentGap }}>
                <Container maxWidth="md">
                    <Typography variant="h4" sx={{ 
                        textAlign: 'center', 
                        fontWeight: 800, 
                        mb: 2,
                        background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} 90%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        Everything You Need
                    </Typography>
                    <Grid container spacing={3}>
                        {additionalFeatures.map((feature, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        p: 3,
                                        bgcolor: 'white',
                                        borderRadius: 2,
                                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                                        height: '100%',
                                    }}
                                >
                                    <CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {feature}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </ContentCard>

            {/* CTA Section */}
            <ContentCard sx={{ mt: theme.spacing.contentGap }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ 
                        fontWeight: 800, 
                        mb: 2,
                        background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} 90%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        Ready to Get Started?
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                        Join thousands of teams already using Recapio.ai to transform their conversations into actionable insights.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                        href="/signup"
                        sx={{
                            bgcolor: theme.palette.primary.main,
                            px: 4,
                            py: 1.5,
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            boxShadow: `0 4px 12px ${theme.palette.primary.main}33`,
                            '&:hover': {
                                bgcolor: theme.palette.primary.dark,
                                boxShadow: `0 6px 16px ${theme.palette.primary.main}4D`,
                            },
                        }}
                    >
                        Start Free Trial
                    </Button>
                </Box>
            </ContentCard>
        </PageLayout>
    );
}
