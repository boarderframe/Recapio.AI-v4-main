"use client";

import React from 'react';
import { Paper, PaperProps, Box } from '@mui/material';

export interface ContentCardProps extends Omit<PaperProps, 'elevation'> {
    children: React.ReactNode;
    stickyHeader?: React.ReactNode;
    stickyControls?: React.ReactNode;
}

export default function ContentCard({ 
    children, 
    stickyHeader,
    stickyControls,
    sx, 
    ...props 
}: ContentCardProps) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, sm: 3 },
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: '#ffffff',
                position: 'relative',
                ...sx
            }}
            {...props}
        >
            {/* Sticky Header Section */}
            {stickyHeader && (
                <Box
                    sx={{
                        position: 'sticky',
                        top: 0,
                        bgcolor: 'background.paper',
                        zIndex: 2,
                        pt: { xs: 2, sm: 3 },
                        pb: 3
                    }}
                >
                    {stickyHeader}
                </Box>
            )}

            {/* Sticky Controls Section */}
            {stickyControls && (
                <Box
                    sx={{
                        position: 'sticky',
                        top: stickyHeader ? 88 : 0,
                        bgcolor: 'background.paper',
                        zIndex: 1,
                        pb: 2
                    }}
                >
                    {stickyControls}
                </Box>
            )}

            {/* Main Content */}
            <Box>
                {children}
            </Box>
        </Paper>
    );
} 