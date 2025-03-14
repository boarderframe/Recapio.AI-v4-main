'use client';

import { Box, Grid, Typography } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import GroupIcon from '@mui/icons-material/Group';
import SpeedIcon from '@mui/icons-material/Speed';
import DevicesIcon from '@mui/icons-material/Devices';

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
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    <TrafficMetric
                        title="Total Visitors"
                        value="45,678"
                        change={12.3}
                        icon={<GroupIcon />}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <TrafficMetric
                        title="Page Views"
                        value="123,456"
                        change={8.7}
                        icon={<TimelineIcon />}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <TrafficMetric
                        title="Avg. Load Time"
                        value="0.8s"
                        change={-15.2}
                        icon={<SpeedIcon />}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <TrafficMetric
                        title="Device Types"
                        value="Mobile 65%"
                        change={5.4}
                        icon={<DevicesIcon />}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ 
                        p: 3,
                        borderRadius: 1,
                        bgcolor: 'background.paper',
                        boxShadow: theme => `0 0 20px ${theme.palette.primary.main}15`,
                        mb: 2
                    }}>
                        <Typography variant="h6" gutterBottom>
                            Traffic Overview
                        </Typography>
                        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography color="text.secondary">
                                Traffic analytics chart will be displayed here
                            </Typography>
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box sx={{ 
                        p: 3,
                        borderRadius: 1,
                        bgcolor: 'background.paper',
                        boxShadow: theme => `0 0 20px ${theme.palette.primary.main}15`,
                        height: '100%'
                    }}>
                        <Typography variant="h6" gutterBottom>
                            Top Pages
                        </Typography>
                        <Typography color="text.secondary">
                            Most visited pages will be listed here
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box sx={{ 
                        p: 3,
                        borderRadius: 1,
                        bgcolor: 'background.paper',
                        boxShadow: theme => `0 0 20px ${theme.palette.primary.main}15`,
                        height: '100%'
                    }}>
                        <Typography variant="h6" gutterBottom>
                            Traffic Sources
                        </Typography>
                        <Typography color="text.secondary">
                            Traffic source breakdown will be displayed here
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
} 