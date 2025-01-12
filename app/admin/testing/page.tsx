"use client";

import {
    Box,
    Typography,
    Paper,
    Divider,
    Container
} from '@mui/material';

export default function TestingPage() {
    return (
        <Container maxWidth="xl">
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                minHeight: 'calc(100vh - 80px)',
                pt: { xs: 4, sm: 6 },
                pb: 6
            }}>
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 4,
                        mb: 4,
                        backgroundColor: 'background.paper',
                        borderRadius: 2
                    }}
                >
                    <Typography variant="h4" component="h1" gutterBottom>
                        Testing Environment
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body1" color="text.secondary" paragraph>
                        This is a sandbox environment for testing UI components and features.
                        Add components below to experiment with different layouts and interactions.
                    </Typography>
                </Paper>

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
            </Box>
        </Container>
    );
} 