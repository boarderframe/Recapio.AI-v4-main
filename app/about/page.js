"use client";
import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Avatar,
    useTheme,
} from '@mui/material';
import PageLayout from '../../components/PageLayout';
import ContentCard from '../../components/ContentCard';

export default function AboutPage() {
    const theme = useTheme();

    const team = [
        {
            name: 'Sarah Johnson',
            role: 'CEO & Co-founder',
            bio: 'Former AI research lead with 15+ years experience in machine learning and natural language processing.',
            image: '/team/sarah.jpg'
        },
        {
            name: 'Michael Chen',
            role: 'CTO & Co-founder',
            bio: 'Previously led engineering teams at major tech companies, specializing in scalable cloud architecture.',
            image: '/team/michael.jpg'
        },
        {
            name: 'Emily Rodriguez',
            role: 'Head of Product',
            bio: 'Product strategist with a background in UX design and a passion for creating intuitive user experiences.',
            image: '/team/emily.jpg'
        },
        {
            name: 'David Kim',
            role: 'Lead Engineer',
            bio: 'Full-stack developer with expertise in building enterprise-grade applications and AI integration.',
            image: '/team/david.jpg'
        },
    ];

    const values = [
        {
            title: 'Innovation',
            description: 'We push the boundaries of what is possible with AI and machine learning, constantly evolving our technology to deliver better results.',
        },
        {
            title: 'Accessibility',
            description: 'We believe in making advanced AI technology accessible to everyone, regardless of technical expertise.',
        },
        {
            title: 'Privacy',
            description: 'We prioritize the security and privacy of our users data, maintaining the highest standards of data protection.',
        },
        {
            title: 'Quality',
            description: 'We are committed to delivering the highest quality transcription and analysis services, continuously improving our accuracy.',
        },
    ];

    return (
        <PageLayout
            title="About Us"
            subtitle={
                <>
                    Transforming audio and video content into actionable insights
                    <br />
                    Powered by cutting-edge AI technology
                </>
            }
        >
            <ContentCard>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                    Our Story
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', lineHeight: 1.8 }}>
                    Founded in 2023, Recapio.AI emerged from a simple yet powerful idea: to make audio and video content more accessible and actionable through advanced AI technology. Our team of AI researchers, engineers, and product designers came together with a shared vision of transforming how people interact with and extract value from spoken content.
                </Typography>
                <Typography variant="body1" sx={{ mb: 6, color: 'text.secondary', lineHeight: 1.8 }}>
                    Today, we're proud to serve thousands of users worldwide, from individual content creators to large enterprises, helping them unlock the full potential of their audio and video content through accurate transcription, intelligent summarization, and powerful analytics.
                </Typography>

                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                    Our Values
                </Typography>
                <Grid container spacing={4} sx={{ mb: 6 }}>
                    {values.map((value, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                    {value.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                                    {value.description}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                    Our Team
                </Typography>
                <Grid container spacing={4}>
                    {team.map((member, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Box sx={{ 
                                textAlign: 'center',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                }
                            }}>
                                <Avatar
                                    src={member.image}
                                    alt={member.name}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        mx: 'auto',
                                        mb: 2,
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                                    }}
                                />
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                    {member.name}
                                </Typography>
                                <Typography variant="subtitle2" sx={{ color: 'primary.main', mb: 1 }}>
                                    {member.role}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                                    {member.bio}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </ContentCard>
        </PageLayout>
    );
} 