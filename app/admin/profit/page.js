'use client';

import { Box, Grid, Typography } from '@mui/material';
import ContentCard from '@/components/ContentCard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShowChartIcon from '@mui/icons-material/ShowChart';

const MetricCard = ({ title, value, trend, icon }) => (
    <ContentCard>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {icon}
            <Typography variant="h6" sx={{ ml: 1 }}>{title}</Typography>
        </Box>
        <Typography variant="h4" sx={{ mb: 1 }}>{value}</Typography>
        <Typography 
            variant="body2" 
            color={trend >= 0 ? 'success.main' : 'error.main'}
            sx={{ display: 'flex', alignItems: 'center' }}
        >
            <TrendingUpIcon 
                sx={{ 
                    mr: 0.5, 
                    transform: trend >= 0 ? 'none' : 'rotate(180deg)'
                }} 
            />
            {trend >= 0 ? '+' : ''}{trend}% vs last month
        </Typography>
    </ContentCard>
);

export default function ProfitPage() {
    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    <MetricCard
                        title="Total Revenue"
                        value="$124,567"
                        trend={12.5}
                        icon={<MonetizationOnIcon sx={{ color: 'primary.main' }} />}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <MetricCard
                        title="Net Profit"
                        value="$98,765"
                        trend={8.3}
                        icon={<AccountBalanceWalletIcon sx={{ color: 'success.main' }} />}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <MetricCard
                        title="Profit Margin"
                        value="79.3%"
                        trend={-2.1}
                        icon={<ShowChartIcon sx={{ color: 'info.main' }} />}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <MetricCard
                        title="Monthly Growth"
                        value="15.7%"
                        trend={5.2}
                        icon={<TrendingUpIcon sx={{ color: 'secondary.main' }} />}
                    />
                </Grid>

                <Grid item xs={12}>
                    <ContentCard>
                        <Typography variant="h6" gutterBottom>
                            Revenue Chart
                        </Typography>
                        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography color="text.secondary">
                                Revenue chart will be displayed here
                            </Typography>
                        </Box>
                    </ContentCard>
                </Grid>
            </Grid>
        </Box>
    );
} 