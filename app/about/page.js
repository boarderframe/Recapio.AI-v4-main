"use client";
import React from 'react';

import {
    Box,
    Typography,
    Grid,
    Card,
    CardMedia,
    useTheme,
} from '@mui/material';
import { 
    AutoAwesome,
    Psychology,
    Diversity3,
    Speed
} from '@mui/icons-material';
import PageLayout from '@/components/PageLayout';
import ContentCard from '@/components/ContentCard';

export default function AboutPage() {
    const theme = useTheme();

    const teamMembers = [
        {
            name: 'Sarah Johnson',
            role: 'CEO & Founder',
            bio: 'Visionary leader with 15+ years in AI and machine learning. Previously led AI initiatives at major tech companies.',
            image: 'https://via.placeholder.com/400x300'
        },
        {
            name: 'Michael Chen',
            role: 'CTO',
            bio: 'Expert in natural language processing and cloud architecture. PhD in Computer Science from Stanford.',
            image: 'https://via.placeholder.com/400x300'
        },
        {
            name: 'Emily Rodriguez',
            role: 'Head of Product',
            bio: 'Product strategist focused on user-centric design. Former Product Lead at Google and Amazon.',
            image: 'https://via.placeholder.com/400x300'
        },
        {
            name: 'David Kim',
            role: 'Lead Engineer',
            bio: 'Full-stack developer specializing in scalable solutions. 10+ years experience in enterprise software.',
            image: 'https://via.placeholder.com/400x300'
        }
    ];

    const companyValues = [
        {
            title: 'Innovation',
            description: 'Pushing boundaries with cutting-edge AI technology to transform how we process conversations',
            icon: <AutoAwesome sx={{ fontSize: 40, color: theme => theme.palette.primary.main }} />
        },
        {
            title: 'User-Centric',
            description: 'Building features that enhance and simplify user experience at every step',
            icon: <Psychology sx={{ fontSize: 40, color: theme => theme.palette.primary.main }} />
        },
        {
            title: 'Collaboration',
            description: 'Fostering a culture of teamwork and shared success across our organization',
            icon: <Diversity3 sx={{ fontSize: 40, color: theme => theme.palette.primary.main }} />
        },
        {
            title: 'Excellence',
            description: 'Committed to delivering the highest quality solutions and continuous improvement',
            icon: <Speed sx={{ fontSize: 40, color: theme => theme.palette.primary.main }} />
        }
    ];

    return (
        <PageLayout 
            title="About Us"
            subtitle={
                <>
                    We're on a mission to revolutionize
                    <br />
                    how the world captures and utilizes spoken information
                </>
            }
        >
            {/* Our Story Section */}
            <ContentCard>
                <Typography variant="h6" gutterBottom>
                    Our Story
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Learn about our journey and mission
                </Typography>

                <Grid container spacing={4} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body2" sx={{ 
                            lineHeight: 1.8,
                            color: 'text.secondary',
                            mb: { xs: 2, md: 0 }
                        }}>
                            Founded in 2023, Recapio.ai emerged from a simple yet powerful idea: to make information from spoken conversations as accessible and useful as written text. Our team of experts in AI, machine learning, and natural language processing came together with a shared vision of transforming how organizations handle verbal communication.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ 
                            borderRadius: 2,
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'background.default',
                        }}>
                            <CardMedia
                                component="img"
                                height="300"
                                image="https://via.placeholder.com/800x600"
                                alt="About Recapio.ai"
                            />
                        </Card>
                    </Grid>
                </Grid>
            </ContentCard>

            {/* Values Section */}
            <ContentCard sx={{ mt: theme.spacing.contentGap }}>
                <Typography variant="h6" gutterBottom>
                    Our Values
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    The principles that guide everything we do
                </Typography>

                <Grid container spacing={3} sx={{ mt: 1 }}>
                    {companyValues.map((value, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    p: 3,
                                    bgcolor: 'background.default',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                }}
                            >
                                <Box sx={{ mb: 2 }}>{value.icon}</Box>
                                <Typography 
                                    variant="subtitle1" 
                                    sx={{ 
                                        mb: 1, 
                                        fontWeight: 600 
                                    }}
                                >
                                    {value.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {value.description}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </ContentCard>

            {/* Team Section */}
            <ContentCard sx={{ mt: theme.spacing.contentGap }}>
                <Typography variant="h6" gutterBottom>
                    Meet Our Team
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    The people behind Recapio.ai's innovation
                </Typography>

                <Grid container spacing={3} sx={{ mt: 1 }}>
                    {teamMembers.map((member, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    alignItems: 'center',
                                    p: 3,
                                    bgcolor: 'background.default',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    sx={{
                                        width: { xs: '100%', sm: '160px' },
                                        height: { xs: '200px', sm: '160px' },
                                        objectFit: 'cover',
                                        borderRadius: 1,
                                        mb: { xs: 2, sm: 0 },
                                        mr: { xs: 0, sm: 3 }
                                    }}
                                    image={member.image}
                                    alt={member.name}
                                />
                                <Box>
                                    <Typography 
                                        variant="subtitle1" 
                                        sx={{ 
                                            fontWeight: 600,
                                            mb: 0.5
                                        }}
                                    >
                                        {member.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ 
                                            color: 'primary.main',
                                            mb: 1,
                                            fontWeight: 500,
                                        }}
                                    >
                                        {member.role}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                        {member.bio}
                                    </Typography>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </ContentCard>
        </PageLayout>
    );
} 