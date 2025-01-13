"use client";

import {
    Box,
    Typography,
    Paper
} from '@mui/material';

export default function TestingPage() {
    return (
        <Paper 
            elevation={0}
            sx={{ 
                p: 4,
                flex: 1,
                backgroundColor: 'background.paper',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Typography variant="h6" color="text.secondary" align="center">
                Ready for new components
            </Typography>
        </Paper>
    );
} 