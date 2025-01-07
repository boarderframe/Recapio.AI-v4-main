import React from 'react';
import { Paper } from '@mui/material';

interface ContentCardProps {
    children: React.ReactNode;
}

export default function ContentCard({ children }: ContentCardProps) {
    return (
        <Paper
            elevation={0}
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                p: 3,
                bgcolor: 'background.default'
            }}
        >
            {children}
        </Paper>
    );
} 