"use client";

import { Typography, Box, Divider } from '@mui/material';
import { PageLayout } from '@/components/layout/PageLayout';
import ContentCard from '@/components/ContentCard';
import { useAuth } from '@/lib/AuthContext';

export default function SettingsPage() {
    const { user } = useAuth();

    return (
        <PageLayout
            layout="app"
            title="Settings"
            subtitle="Manage your account settings and preferences"
            toolbar={null}
        >
            <ContentCard>
                <Typography variant="h6" gutterBottom>
                    Profile Information
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Email: {user?.email}
                </Typography>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="h6" gutterBottom>
                    Preferences
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Account preferences will be displayed here
                </Typography>
            </ContentCard>
        </PageLayout>
    );
} 