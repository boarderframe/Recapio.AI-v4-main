'use client';

import { Box, Typography } from '@mui/material';
import PageLayout from '@/components/PageLayout';
import ContentCard from '@/components/ContentCard';

export default function TestingPage() {
    return (
        <PageLayout
            title="UI Testing Environment"
            subtitle="A sandbox environment for testing UI components and layouts before implementation"
        >
            <ContentCard>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Testing Environment
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        This space is dedicated to testing and previewing UI components before implementation.
                    </Typography>
                </Box>
                
                {/* Testing Area */}
                <Box sx={{ 
                    p: 4, 
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    bgcolor: 'background.default'
                }}>
                    <Typography variant="subtitle1" color="text.secondary" textAlign="center">
                        Testing Area - Add components here
                    </Typography>
                </Box>
            </ContentCard>
        </PageLayout>
    );
} 