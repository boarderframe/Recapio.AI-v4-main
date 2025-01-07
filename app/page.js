"use client";
import React from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Stack,
    Container,
    Avatar,
    Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    AutoAwesome,
    Speed,
    Psychology,
    Timeline,
    ArrowForward,
    CheckCircle,
    PlayArrow,
    Security,
    CloudDone,
    Groups,
} from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';
import ContentContainer from '@/components/ContentContainer';
import PageLayout from '@/components/PageLayout';

export default function Home() {
    const theme = useTheme();
    
    const features = [
        {
            icon: <AutoAwesome sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
            title: 'AI-Powered Summaries',
            description: 'Get instant, accurate summaries of your transcripts powered by advanced AI.',
            benefits: ['Automated summarization', 'Key points extraction', 'Topic identification'],
        },
        {
            icon: <Speed sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
            title: 'Real-Time Processing',
            description: 'Process your content in real-time with lightning-fast results.',
            benefits: ['Instant transcription', 'Live captioning', 'Quick exports'],
        },
        {
            icon: <Psychology sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
            title: 'Smart Insights',
            description: 'Extract key insights and patterns from your transcripts automatically.',
            benefits: ['Sentiment analysis', 'Trend detection', 'Action items'],
        },
        {
            icon: <Timeline sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
            title: 'Analytics Dashboard',
            description: 'Visualize your data with comprehensive analytics and reporting.',
            benefits: ['Custom reports', 'Data visualization', 'Export options'],
        },
    ];

    const stats = [
        { number: '10M+', label: 'Minutes Processed' },
        { number: '50K+', label: 'Active Users' },
        { number: '99.9%', label: 'Accuracy Rate' },
        { number: '24/7', label: 'Support' },
    ];

    const steps = [
        {
            title: 'Upload Your Content',
            description: 'Upload any audio or video file, or connect your live stream.',
            icon: <CloudDone sx={{ fontSize: 32 }} />,
        },
        {
            title: 'AI Processing',
            description: 'Our advanced AI analyzes and transcribes your content in real-time.',
            icon: <AutoAwesome sx={{ fontSize: 32 }} />,
        },
        {
            title: 'Get Insights',
            description: 'Receive detailed transcripts, summaries, and actionable insights.',
            icon: <Psychology sx={{ fontSize: 32 }} />,
        },
    ];

    const testimonials = [
        {
            quote: "Recapio.ai has transformed how we handle our meeting recordings. It's an indispensable tool for our team.",
            author: "Sarah Chen",
            role: "Product Manager at TechCorp",
            avatar: "https://via.placeholder.com/64",
        },
        {
            quote: "The accuracy and speed of the transcriptions are impressive. The insights feature saves us hours of analysis.",
            author: "Michael Rodriguez",
            role: "CEO at StartupX",
            avatar: "https://via.placeholder.com/64",
        },
    ];

    return (
        <PageLayout>
            <Box>
                {/* Hero Section */}
                <Box
                    sx={{
                        background: 'linear-gradient(180deg, #f8f9fa 0%, rgba(248, 249, 250, 0.8) 100%)',
                        pt: { xs: 0.5, md: 1 },
                        pb: { xs: 8, md: 12 },
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <ContentContainer>
                        <Grid container spacing={6} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <Box sx={{ position: 'relative', zIndex: 2 }}>
                                    <Chip
                                        label="New: AI-Powered Analytics"
                                        color="primary"
                                        size="small"
                                        sx={{
                                            mb: 2,
                                            bgcolor: `${theme.palette.primary.main}15`,
                                            color: theme.palette.primary.main,
                                            fontWeight: 600,
                                        }}
                                    />
                                    <Typography
                                        component="h1"
                                        variant="h2"
                                        sx={{
                                            fontWeight: 800,
                                            mb: 2,
                                            fontSize: { xs: '2.5rem', md: '3.75rem' },
                                            background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} 90%)`,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        Transform Your Conversations into Insights
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            mb: 4,
                                            color: theme.palette.text.secondary,
                                            lineHeight: 1.6,
                                            maxWidth: '540px',
                                        }}
                                    >
                                        Automatically transcribe, summarize, and extract insights from your meetings, interviews, and podcasts with our advanced AI.
                                    </Typography>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                        <Button
                                            component={Link}
                                            href="/signup"
                                            variant="contained"
                                            size="large"
                                            endIcon={<ArrowForward />}
                                            sx={{
                                                bgcolor: theme.palette.primary.main,
                                                py: 1.5,
                                                px: 4,
                                                borderRadius: 2,
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
                                        <Button
                                            component={Link}
                                            href="#demo"
                                            variant="outlined"
                                            size="large"
                                            startIcon={<PlayArrow />}
                                            sx={{
                                                borderColor: theme.palette.primary.main,
                                                color: theme.palette.primary.main,
                                                py: 1.5,
                                                px: 4,
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                borderWidth: 2,
                                                '&:hover': {
                                                    borderWidth: 2,
                                                    borderColor: theme.palette.primary.dark,
                                                    bgcolor: `${theme.palette.primary.main}08`,
                                                },
                                            }}
                                        >
                                            Watch Demo
                                        </Button>
                                    </Stack>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: { xs: '300px', md: '500px' },
                                        width: '100%',
                                    }}
                                >
                                    {/* Replace with your actual hero image */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            width: '100%',
                                            height: '100%',
                                            bgcolor: `${theme.palette.primary.main}15`,
                                            borderRadius: 4,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Typography variant="h6" color="text.secondary">
                                            Hero Image Placeholder
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </ContentContainer>
                </Box>

                {/* Stats Section */}
                <Box sx={{ py: 6, bgcolor: 'white' }}>
                    <ContentContainer>
                        <Grid container spacing={4} justifyContent="center">
                            {stats.map((stat, index) => (
                                <Grid item xs={6} md={3} key={index}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography
                                            variant="h3"
                                            sx={{
                                                fontWeight: 700,
                                                color: theme.palette.primary.main,
                                                mb: 1,
                                            }}
                                        >
                                            {stat.number}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: theme.palette.text.secondary,
                                                fontWeight: 500,
                                            }}
                                        >
                                            {stat.label}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </ContentContainer>
                </Box>

                {/* Features Section */}
                <Box sx={{ py: 12, bgcolor: '#f8f9fa' }}>
                    <ContentContainer>
                        <Box sx={{ textAlign: 'center', mb: 8 }}>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 800,
                                    mb: 2,
                                    background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} 90%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Why Choose Recapio.ai
                            </Typography>
                            <Typography
                                variant="h6"
                                color="text.secondary"
                                sx={{ maxWidth: '800px', mx: 'auto' }}
                            >
                                Powerful features designed to help you get the most out of your audio and video content
                            </Typography>
                        </Box>

                        <Grid container spacing={4}>
                            {features.map((feature, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            borderRadius: 3,
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)',
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 4, flexGrow: 1 }}>
                                            <Box
                                                sx={{
                                                    width: 56,
                                                    height: 56,
                                                    borderRadius: '12px',
                                                    bgcolor: `${theme.palette.primary.main}08`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mb: 3,
                                                }}
                                            >
                                                {feature.icon}
                                            </Box>
                                            <Typography
                                                variant="h6"
                                                sx={{ fontWeight: 700, mb: 2 }}
                                            >
                                                {feature.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ mb: 3 }}
                                            >
                                                {feature.description}
                                            </Typography>
                                            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                                                {feature.benefits.map((benefit, benefitIndex) => (
                                                    <Box
                                                        component="li"
                                                        key={benefitIndex}
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1,
                                                            mb: 1,
                                                        }}
                                                    >
                                                        <CheckCircle
                                                            sx={{
                                                                fontSize: 16,
                                                                color: theme.palette.primary.main,
                                                            }}
                                                        />
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ fontWeight: 500 }}
                                                        >
                                                            {benefit}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </ContentContainer>
                </Box>

                {/* How It Works Section */}
                <Box sx={{ py: 12, bgcolor: 'white' }}>
                    <ContentContainer>
                        <Box sx={{ textAlign: 'center', mb: 8 }}>
                            <Typography 
                                variant="h3" 
                                sx={{ 
                                    fontWeight: 800, 
                                    mb: 2,
                                    background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} 90%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                How It Works
                            </Typography>
                            <Typography
                                variant="h6"
                                color="text.secondary"
                                sx={{ maxWidth: '800px', mx: 'auto' }}
                            >
                                Get started in minutes with our simple three-step process
                            </Typography>
                        </Box>

                        <Grid container spacing={4}>
                            {steps.map((step, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <Box
                                        sx={{
                                            textAlign: 'center',
                                            px: 4,
                                            position: 'relative',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: '20px',
                                                bgcolor: theme => `${theme.palette.primary.main}08`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mb: 3,
                                                mx: 'auto',
                                                color: theme => theme.palette.primary.main,
                                            }}
                                        >
                                            {step.icon}
                                        </Box>
                                        <Typography 
                                            variant="h5" 
                                            sx={{ 
                                                fontWeight: 700, 
                                                mb: 2,
                                                color: theme => theme.palette.text.primary
                                            }}
                                        >
                                            {step.title}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            {step.description}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </ContentContainer>
                </Box>

                {/* Testimonials Section */}
                <Box sx={{ py: 12, bgcolor: '#f8f9fa' }}>
                    <ContentContainer>
                        <Box sx={{ textAlign: 'center', mb: 8 }}>
                            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                                What Our Users Say
                            </Typography>
                            <Typography
                                variant="h6"
                                color="text.secondary"
                                sx={{ maxWidth: '800px', mx: 'auto' }}
                            >
                                Join thousands of satisfied users who trust Recapio.ai
                            </Typography>
                        </Box>

                        <Grid container spacing={4} justifyContent="center">
                            {testimonials.map((testimonial, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            p: 4,
                                            borderRadius: 3,
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                        }}
                                    >
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                mb: 4,
                                                fontSize: '1.1rem',
                                                fontStyle: 'italic',
                                                color: 'text.secondary',
                                            }}
                                        >
                                            "{testimonial.quote}"
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar
                                                src={testimonial.avatar}
                                                sx={{ width: 48, height: 48 }}
                                            />
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                    {testimonial.author}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {testimonial.role}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </ContentContainer>
                </Box>

                {/* CTA Section */}
                <Box
                    sx={{
                        py: 12,
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                        textAlign: 'center',
                    }}
                >
                    <ContentContainer>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 3 }}>
                            Ready to Get Started?
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                mb: 4,
                                maxWidth: '800px',
                                mx: 'auto',
                                opacity: 0.9,
                                fontWeight: 'normal',
                            }}
                        >
                            Join thousands of teams already using Recapio.ai to transform their conversations into actionable insights.
                        </Typography>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            justifyContent="center"
                        >
                            <Button
                                component={Link}
                                href="/signup"
                                variant="contained"
                                size="large"
                                sx={{
                                    bgcolor: 'white',
                                    color: theme.palette.primary.main,
                                    py: 1.5,
                                    px: 4,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                                    },
                                }}
                            >
                                Start Free Trial
                            </Button>
                            <Button
                                component={Link}
                                href="/contact"
                                variant="outlined"
                                size="large"
                                sx={{
                                    borderColor: 'white',
                                    color: 'white',
                                    py: 1.5,
                                    px: 4,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    borderWidth: 2,
                                    '&:hover': {
                                        borderWidth: 2,
                                        borderColor: 'white',
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                }}
                            >
                                Contact Sales
                            </Button>
                        </Stack>
                    </ContentContainer>
                </Box>
            </Box>
        </PageLayout>
    );
}
