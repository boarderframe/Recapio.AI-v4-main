"use client";

import { useState } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    Grid,
    Button,
    Divider,
    Switch,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Alert
} from '@mui/material';
import { PageLayout } from '@/components/layout/PageLayout';
import ContentCard from '@/components/ContentCard';
import { useAuth } from '@/lib/AuthContext';
import { 
    Notifications as NotificationsIcon,
    Security as SecurityIcon,
    Payment as PaymentIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';

export default function AccountPage() {
    const { user } = useAuth();
    const [message, setMessage] = useState({ type: '', content: '' });

    // Mock data - replace with real data from your backend
    const [settings, setSettings] = useState({
        emailNotifications: true,
        marketingEmails: false,
        twoFactorAuth: false,
        autoRenew: true
    });

    const handleSettingToggle = (setting) => () => {
        setSettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
        setMessage({ 
            type: 'success', 
            content: 'Setting updated successfully!' 
        });
    };

    return (
        <PageLayout
            layout="app"
            title="Account"
            subtitle="Manage your account settings and preferences"
            toolbar={null}
        >
            <ContentCard>
                {message.content && (
                    <Alert 
                        severity={message.type} 
                        sx={{ mb: 3 }}
                        onClose={() => setMessage({ type: '', content: '' })}
                    >
                        {message.content}
                    </Alert>
                )}

                <Grid container spacing={4}>
                    {/* Subscription Section */}
                    <Grid item xs={12}>
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <PaymentIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6">
                                    Subscription
                                </Typography>
                            </Box>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    bgcolor: 'background.default',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2
                                }}
                            >
                                <Typography variant="subtitle1" gutterBottom>
                                    Current Plan: <strong>Pro</strong>
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Your plan renews on January 1, 2024
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Button variant="contained" color="primary">
                                        Upgrade Plan
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        color="primary" 
                                        sx={{ ml: 2 }}
                                    >
                                        View Billing History
                                    </Button>
                                </Box>
                            </Paper>
                        </Box>
                    </Grid>

                    {/* Security Section */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6">
                                    Security
                                </Typography>
                            </Box>
                            <Paper
                                elevation={0}
                                sx={{
                                    bgcolor: 'background.default',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2
                                }}
                            >
                                <List>
                                    <ListItem>
                                        <ListItemText 
                                            primary="Two-Factor Authentication"
                                            secondary="Add an extra layer of security"
                                        />
                                        <ListItemSecondaryAction>
                                            <Switch
                                                edge="end"
                                                checked={settings.twoFactorAuth}
                                                onChange={handleSettingToggle('twoFactorAuth')}
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    <Divider />
                                    <ListItem>
                                        <ListItemText
                                            primary="Change Password"
                                            secondary="Update your password regularly"
                                        />
                                        <ListItemSecondaryAction>
                                            <Button variant="outlined" size="small">
                                                Change
                                            </Button>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </List>
                            </Paper>
                        </Box>
                    </Grid>

                    {/* Notifications Section */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <NotificationsIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6">
                                    Notifications
                                </Typography>
                            </Box>
                            <Paper
                                elevation={0}
                                sx={{
                                    bgcolor: 'background.default',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2
                                }}
                            >
                                <List>
                                    <ListItem>
                                        <ListItemText 
                                            primary="Email Notifications"
                                            secondary="Get notified about your transcripts"
                                        />
                                        <ListItemSecondaryAction>
                                            <Switch
                                                edge="end"
                                                checked={settings.emailNotifications}
                                                onChange={handleSettingToggle('emailNotifications')}
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    <Divider />
                                    <ListItem>
                                        <ListItemText
                                            primary="Marketing Emails"
                                            secondary="Receive updates about new features"
                                        />
                                        <ListItemSecondaryAction>
                                            <Switch
                                                edge="end"
                                                checked={settings.marketingEmails}
                                                onChange={handleSettingToggle('marketingEmails')}
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </List>
                            </Paper>
                        </Box>
                    </Grid>

                    {/* Preferences Section */}
                    <Grid item xs={12}>
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <SettingsIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6">
                                    Preferences
                                </Typography>
                            </Box>
                            <Paper
                                elevation={0}
                                sx={{
                                    bgcolor: 'background.default',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2
                                }}
                            >
                                <List>
                                    <ListItem>
                                        <ListItemText 
                                            primary="Auto-Renew Subscription"
                                            secondary="Automatically renew your subscription"
                                        />
                                        <ListItemSecondaryAction>
                                            <Switch
                                                edge="end"
                                                checked={settings.autoRenew}
                                                onChange={handleSettingToggle('autoRenew')}
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </List>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </ContentCard>
        </PageLayout>
    );
} 