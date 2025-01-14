'use client';

import { Box, Grid, Typography, Button } from '@mui/material';
import ContentCard from '@/components/ContentCard';
import PaymentsIcon from '@mui/icons-material/Payments';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { PageLayout } from '@/components/layout/PageLayout';

export default function BillingPage() {
    return (
        <PageLayout
            layout="admin"
            title="Billing Management"
            subtitle="Manage payment methods and billing history"
            toolbar={
                <Button
                    variant="contained"
                    startIcon={<PaymentsIcon />}
                >
                    Add Payment Method
                </Button>
            }
        >
            <ContentCard>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <Box sx={{ 
                            p: 3,
                            borderRadius: 1,
                            bgcolor: 'background.paper',
                            boxShadow: theme => `0 0 20px ${theme.palette.primary.main}15`,
                            mb: 2
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <PaymentsIcon sx={{ fontSize: 24, mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6">Payment Methods</Typography>
                            </Box>
                            <Typography color="text.secondary" sx={{ mb: 2 }}>
                                Manage your payment methods and billing information
                            </Typography>
                            <Button variant="contained" color="primary">
                                Add Payment Method
                            </Button>
                        </Box>

                        <Box sx={{ 
                            p: 3,
                            borderRadius: 1,
                            bgcolor: 'background.paper',
                            boxShadow: theme => `0 0 20px ${theme.palette.primary.main}15`,
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <ReceiptIcon sx={{ fontSize: 24, mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6">Billing History</Typography>
                            </Box>
                            <Typography color="text.secondary">
                                Your recent billing history will appear here
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Box sx={{ 
                            p: 3,
                            borderRadius: 1,
                            bgcolor: 'background.paper',
                            boxShadow: theme => `0 0 20px ${theme.palette.primary.main}15`,
                            height: '100%'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <AccountBalanceIcon sx={{ fontSize: 24, mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6">Current Plan</Typography>
                            </Box>
                            <Typography variant="h4" sx={{ mb: 1 }}>Pro Plan</Typography>
                            <Typography variant="h6" color="primary.main" sx={{ mb: 2 }}>
                                $49/month
                            </Typography>
                            <Button variant="outlined" color="primary" fullWidth>
                                Upgrade Plan
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </ContentCard>
        </PageLayout>
    );
} 