"use client";

import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { 
    Description as TranscriptIcon,
    Psychology as AIIcon,
    Palette as ThemeIcon,
    Science as TestingIcon 
} from '@mui/icons-material';

export default function AdminOverviewPage() {
    const stats = [
        {
            title: 'Transcript Types',
            count: '5',
            icon: <TranscriptIcon sx={{ fontSize: 40 }} />,
            color: 'primary.main'
        },
        {
            title: 'AI Models',
            count: '3',
            icon: <AIIcon sx={{ fontSize: 40 }} />,
            color: 'secondary.main'
        },
        {
            title: 'Theme Settings',
            count: '12',
            icon: <ThemeIcon sx={{ fontSize: 40 }} />,
            color: 'success.main'
        },
        {
            title: 'Test Cases',
            count: '24',
            icon: <TestingIcon sx={{ fontSize: 40 }} />,
            color: 'info.main'
        }
    ];

    return (
        <Grid container spacing={3}>
            {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card>
                        <CardContent sx={{ 
                            textAlign: 'center',
                            '&:last-child': { pb: 3 }
                        }}>
                            <Box sx={{ 
                                mb: 2,
                                color: stat.color,
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                {stat.icon}
                            </Box>
                            <Typography variant="h4" gutterBottom>
                                {stat.count}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                {stat.title}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
} 