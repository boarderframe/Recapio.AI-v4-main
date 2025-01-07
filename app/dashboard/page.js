"use client";
import React from 'react';

import { Typography, Box, Grid, Paper } from '@mui/material';
import PageLayout from '@/components/PageLayout';
import ContentCard from '@/components/ContentCard';
import { useAuth } from '@/lib/AuthContext';

export default function DashboardPage() {
    const { user } = useAuth();
    const displayName = user?.user_metadata?.display_name || 
        (user?.email ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1) : 'User');

    return (
        <PageLayout
            title="Dashboard"
            subtitle={`Welcome back, ${displayName}`}
        >
            <ContentCard>
                <Typography variant="h6" gutterBottom>
                    Recent Activity
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Your recent transcripts and activities will appear here
                </Typography>

                <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={4}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                textAlign: 'center',
                                bgcolor: 'background.default',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2
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
                                borderRadius: 2
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
                                borderRadius: 2
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
            </ContentCard>
        </PageLayout>
    );
} 