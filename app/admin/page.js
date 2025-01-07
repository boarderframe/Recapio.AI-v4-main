"use client";

import { Box, Grid, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PaymentsIcon from '@mui/icons-material/Payments';
import DescriptionIcon from '@mui/icons-material/Description';
import TimerIcon from '@mui/icons-material/Timer';
import StorageIcon from '@mui/icons-material/Storage';
import MemoryIcon from '@mui/icons-material/Memory';

const StatCard = ({ title, value, icon, trend, subtitle }) => (
    <Box sx={{ 
        p: 3,
        borderRadius: 1,
        bgcolor: 'background.paper',
        boxShadow: theme => `0 0 20px ${theme.palette.primary.main}15`,
        height: '100%',
    }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" color="text.secondary">
                {title}
            </Typography>
            <Box sx={{ 
                p: 1, 
                borderRadius: 1, 
                bgcolor: 'primary.main', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {icon}
            </Box>
        </Box>
        <Typography variant="h4" component="div" sx={{ mb: 1 }}>
            {value}
        </Typography>
        {trend !== undefined && (
            <Typography variant="body2" color={trend >= 0 ? 'success.main' : 'error.main'}>
                {trend >= 0 ? '+' : ''}{trend}% from last month
            </Typography>
        )}
        {subtitle && (
            <Typography variant="body2" color="text.secondary">
                {subtitle}
            </Typography>
        )}
    </Box>
);

export default function AdminOverview() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
                <Typography variant="h6" gutterBottom>System Performance</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Active Users"
                            value="1,234"
                            icon={<PeopleIcon />}
                            trend={12.5}
                            subtitle="Currently online"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="API Requests"
                            value="42.5K"
                            icon={<SmartToyIcon />}
                            trend={8.3}
                            subtitle="Last 24 hours"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Response Time"
                            value="245ms"
                            icon={<TimerIcon />}
                            trend={-15.7}
                            subtitle="Average latency"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Success Rate"
                            value="99.9%"
                            icon={<TrendingUpIcon />}
                            trend={0.2}
                            subtitle="API calls"
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box>
                <Typography variant="h6" gutterBottom>Resource Usage</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Storage Used"
                            value="856 GB"
                            icon={<StorageIcon />}
                            subtitle="of 1 TB allocated"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Memory Usage"
                            value="75%"
                            icon={<MemoryIcon />}
                            subtitle="16 GB total"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Documents"
                            value="15,678"
                            icon={<DescriptionIcon />}
                            subtitle="Total processed"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Revenue"
                            value="$12,345"
                            icon={<PaymentsIcon />}
                            trend={15.7}
                            subtitle="This month"
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
} 