"use client";

import { Typography, Box, Grid, Paper } from '@mui/material';
import { PageLayout } from '@/components/layout/PageLayout';
import ContentCard from '@/components/ContentCard';

export default function ReportingPage() {
    return (
        <PageLayout
            layout="app"
            title="Reporting"
            subtitle="Analytics and insights from your transcripts"
            toolbar={null}
        >
            <ContentCard>
                <Typography variant="h6" gutterBottom>
                    Overview
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Key metrics and trends from your transcription activities
                </Typography>

                <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6} md={3}>
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
                                0h
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Hours Processed
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
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
                    <Grid item xs={12} sm={6} md={3}>
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
                                Completed Projects
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
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
                                0%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Average Accuracy
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Usage Analytics
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Detailed breakdown of your transcription usage
                    </Typography>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mt: 2,
                            height: '200px',
                            bgcolor: 'background.default',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            Usage analytics chart will be displayed here
                        </Typography>
                    </Paper>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Insights
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        AI-generated insights from your transcripts
                    </Typography>

                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    bgcolor: 'background.default',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2
                                }}
                            >
                                <Typography variant="subtitle1" gutterBottom>
                                    Common Topics
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Topic analysis will be displayed here
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    bgcolor: 'background.default',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2
                                }}
                            >
                                <Typography variant="subtitle1" gutterBottom>
                                    Sentiment Analysis
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Sentiment trends will be displayed here
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </ContentCard>
        </PageLayout>
    );
} 