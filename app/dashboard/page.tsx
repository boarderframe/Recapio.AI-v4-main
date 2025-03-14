'use client';

import React from 'react';
import { Typography, Box, Grid, Paper, Button } from '@mui/material';
import { useAuth } from '@/lib/AuthContext';
import PageHeader from '@/components/PageHeader';
import PageBody from '@/components/PageBody';
import PageLayout from '@/components/PageLayout';
import PageFooter from '@/components/PageFooter';
import { Add as AddIcon } from '@mui/icons-material';
import Link from 'next/link';

export default function DashboardPage() {
    const { user } = useAuth();
    const displayName = user?.user_metadata?.display_name || 
        (user?.email ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1) : 'User');

    const headerActions = (
        <Button
            component={Link}
            href="/transcripts/new"
            variant="contained"
            startIcon={<AddIcon />}
        >
            New Transcript
        </Button>
    );

    return (
        <PageLayout>
            <PageHeader
                title={`Welcome back, ${displayName}`}
                description="View and manage your transcripts and analytics"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Dashboard' }
                ]}
                actions={headerActions}
            />
            
            <PageBody>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                textAlign: 'center',
                                bgcolor: 'background.default',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                }
                            }}
                        >
                            <Typography variant="h4" color="primary" gutterBottom>
                                0
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Transcripts
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                textAlign: 'center',
                                bgcolor: 'background.default',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                }
                            }}
                        >
                            <Typography variant="h4" color="primary" gutterBottom>
                                0
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Hours Processed
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                textAlign: 'center',
                                bgcolor: 'background.default',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                }
                            }}
                        >
                            <Typography variant="h4" color="primary" gutterBottom>
                                0
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Active Projects
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Recent Activity
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Your recent transcripts and activities will appear here
                    </Typography>
                </Box>
            </PageBody>

            <PageFooter>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        component={Link}
                        href="/transcripts"
                        variant="outlined"
                        color="primary"
                    >
                        View All Transcripts
                    </Button>
                </Box>
            </PageFooter>
        </PageLayout>
    );
} 