'use client';

import { Box, Grid, Typography } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import GroupIcon from '@mui/icons-material/Group';
import SpeedIcon from '@mui/icons-material/Speed';
import DevicesIcon from '@mui/icons-material/Devices';
import { PageLayout } from '@/components/layout/PageLayout';
import ContentCard from '@/components/ContentCard';

const TrafficMetric = ({ title, value, change, icon }) => (
    <Box sx={{ 
        p: 3,
        borderRadius: 1,
        bgcolor: 'background.paper',
        boxShadow: theme => `0 0 20px ${theme.palette.primary.main}15`,
        height: '100%'
    }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ 
                p: 1, 
                borderRadius: 1, 
                bgcolor: 'primary.main', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
            }}>
                {icon}
            </Box>
            <Box>
                <Typography color="text.secondary" variant="body2">
                    {title}
                </Typography>
                <Typography variant="h6">
                    {value}
                </Typography>
            </Box>
        </Box>
        <Typography 
            variant="body2" 
            color={change >= 0 ? 'success.main' : 'error.main'}
        >
            {change >= 0 ? '+' : ''}{change}% from last week
        </Typography>
    </Box>
);

export default function TrafficPage() {
    return (
        <PageLayout
            layout="admin"
            title="Traffic Analytics"
            subtitle="Monitor user activity and engagement"
            toolbar={null}
        >
            <ContentCard>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={3}>
                        <TrafficMetric
                            title="Total Visitors"
                            value="12,345"
                            change={8.5}
                            icon={<GroupIcon />}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <TrafficMetric
                            title="Page Views"
                            value="45,678"
                            change={12.3}
                            icon={<TimelineIcon />}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <TrafficMetric
                            title="Avg. Load Time"
                            value="0.8s"
                            change={-15.2}
                            icon={<SpeedIcon />}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <TrafficMetric
                            title="Device Types"
                            value="Mobile 65%"
                            change={5.7}
                            icon={<DevicesIcon />}
                        />
                    </Grid>
                </Grid>
            </ContentCard>
        </PageLayout>
    );
} 