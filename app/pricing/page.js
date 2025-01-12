"use client";

import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Button,
    useTheme,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PageLayout from '../../components/PageLayout';
import ContentCard from '../../components/ContentCard';

export default function PricingPage() {
    const theme = useTheme();

    const plans = [
        {
            title: 'Basic',
            price: '$29',
            period: '/month',
            description: 'Perfect for individuals and small teams',
            features: [
                'Up to 10 hours of transcription per month',
                'Basic analytics and insights',
                'Email support',
                'Standard API access',
                'Mobile app access',
            ],
            buttonText: 'Get Started',
            highlighted: false,
        },
        {
            title: 'Professional',
            price: '$99',
            period: '/month',
            description: 'Ideal for growing businesses',
            features: [
                'Up to 50 hours of transcription per month',
                'Advanced analytics and insights',
                'Priority email and chat support',
                'Full API access',
                'Team collaboration features',
                'Custom vocabulary',
                'Enhanced security features',
            ],
            buttonText: 'Try Professional',
            highlighted: true,
        },
        {
            title: 'Enterprise',
            price: 'Custom',
            period: '',
            description: 'For large organizations with specific needs',
            features: [
                'Unlimited transcription hours',
                'Custom analytics and reporting',
                '24/7 dedicated support',
                'Custom API solutions',
                'Advanced team management',
                'Custom integrations',
                'Enterprise-grade security',
                'Service level agreement',
            ],
            buttonText: 'Contact Sales',
            highlighted: false,
        },
    ];

    return (
        <PageLayout
            title="Pricing"
            subtitle={
                <>
                    Choose the plan that's right for you
                    <br />
                    Simple, transparent pricing with no hidden fees
                </>
            }
        >
            <ContentCard>
                <Grid container spacing={4} sx={{ mb: 8 }}>
                    {plans.map((plan, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    boxShadow: plan.highlighted 
                                        ? '0 8px 24px rgba(0, 0, 0, 0.12)'
                                        : '0 4px 12px rgba(0, 0, 0, 0.08)',
                                    borderRadius: 2,
                                    transition: 'all 0.3s ease',
                                    border: plan.highlighted 
                                        ? `2px solid ${theme.palette.primary.main}`
                                        : '1px solid rgba(0, 0, 0, 0.12)',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 12px 48px rgba(0, 0, 0, 0.12)',
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 4, flexGrow: 1 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                        {plan.title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                                        <Typography variant="h3" sx={{ fontWeight: 800 }}>
                                            {plan.price}
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ color: 'text.secondary', ml: 1 }}>
                                            {plan.period}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                                        {plan.description}
                                    </Typography>
                                    <List disablePadding>
                                        {plan.features.map((feature, featureIndex) => (
                                            <ListItem key={featureIndex} sx={{ px: 0, py: 0.5 }}>
                                                <ListItemIcon sx={{ minWidth: 32, color: theme.palette.primary.main }}>
                                                    <CheckCircleOutlineIcon sx={{ fontSize: 20 }} />
                                                </ListItemIcon>
                                                <ListItemText 
                                                    primary={feature}
                                                    primaryTypographyProps={{
                                                        variant: 'body2',
                                                        sx: { fontWeight: 500 }
                                                    }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                                <Box sx={{ p: 4, pt: 0 }}>
                                    <Button
                                        variant={plan.highlighted ? "contained" : "outlined"}
                                        fullWidth
                                        size="large"
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 1.5,
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                        }}
                                    >
                                        {plan.buttonText}
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </ContentCard>
        </PageLayout>
    );
}
