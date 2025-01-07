"use client";

import { useState } from 'react';
import { 
    Container, 
    Typography, 
    Box, 
    Paper, 
    Avatar, 
    Grid,
    Button,
    Divider,
    TextField,
    IconButton,
    Alert
} from '@mui/material';
import PageLayout from '@/components/PageLayout';
import { useAuth } from '@/lib/AuthContext';
import { Edit as EditIcon, PhotoCamera } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import ContentCard from '@/components/ContentCard';

export default function ProfilePage() {
    const { user } = useAuth();
    const theme = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });

    const displayName = user?.user_metadata?.display_name || 
        (user?.email ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1) : 'User');
    
    const accountType = user?.user_metadata?.account_type || 'personal';
    const companyName = user?.user_metadata?.company_name;

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setMessage({ type: '', content: '' });
    };

    const handleSave = async () => {
        // TODO: Implement save functionality
        setIsEditing(false);
        setMessage({ type: 'success', content: 'Profile updated successfully!' });
    };

    return (
        <PageLayout
            title="Profile"
            subtitle="Manage your personal information"
        >
            <ContentCard>
                <Box sx={{ py: 2 }}>
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
                        {/* Profile Photo Section */}
                        <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                            <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                <Avatar
                                    sx={{
                                        width: 150,
                                        height: 150,
                                        fontSize: '3rem',
                                        bgcolor: theme.palette.primary.main,
                                        border: `4px solid ${theme.palette.background.paper}`,
                                        boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                                    }}
                                >
                                    {displayName.charAt(0).toUpperCase()}
                                </Avatar>
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        bgcolor: 'background.paper',
                                        boxShadow: 1,
                                        '&:hover': {
                                            bgcolor: 'background.paper',
                                        },
                                    }}
                                >
                                    <PhotoCamera />
                                </IconButton>
                            </Box>
                        </Grid>

                        {/* Profile Info Section */}
                        <Grid item xs={12} md={8}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Profile Information
                                </Typography>
                                <Button
                                    startIcon={<EditIcon />}
                                    onClick={handleEditToggle}
                                    variant={isEditing ? "contained" : "outlined"}
                                >
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </Button>
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Display Name"
                                        defaultValue={displayName}
                                        disabled={!isEditing}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        defaultValue={user?.email}
                                        disabled
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Account Type"
                                        defaultValue={accountType.charAt(0).toUpperCase() + accountType.slice(1)}
                                        disabled
                                        variant="outlined"
                                    />
                                </Grid>
                                {accountType === 'business' && (
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Company Name"
                                            defaultValue={companyName}
                                            disabled={!isEditing}
                                            variant="outlined"
                                        />
                                    </Grid>
                                )}
                            </Grid>

                            {isEditing && (
                                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleSave}
                                        sx={{ minWidth: 120 }}
                                    >
                                        Save Changes
                                    </Button>
                                </Box>
                            )}
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    {/* Account Statistics */}
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Account Statistics
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        bgcolor: 'background.default',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 2
                                    }}
                                >
                                    <Typography variant="h4" color="primary" gutterBottom>
                                        0
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Transcripts Created
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        bgcolor: 'background.default',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 2
                                    }}
                                >
                                    <Typography variant="h4" color="primary" gutterBottom>
                                        0 min
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Processing Time
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        bgcolor: 'background.default',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 2
                                    }}
                                >
                                    <Typography variant="h4" color="primary" gutterBottom>
                                        Pro
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Current Plan
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </ContentCard>
        </PageLayout>
    );
} 