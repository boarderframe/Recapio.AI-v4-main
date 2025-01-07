import React from 'react';
import { Box, Container, Typography } from '@mui/material';

interface PageLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}

export default function PageLayout({ children, title, subtitle }: PageLayoutProps) {
    return (
        <Container maxWidth="xl">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        {subtitle}
                    </Typography>
                )}
            </Box>
            {children}
        </Container>
    );
} 