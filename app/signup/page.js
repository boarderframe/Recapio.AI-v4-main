"use client";

import React, { useState } from 'react';
import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    Link,
    Alert,
    InputAdornment,
    IconButton,
    Divider,
    CircularProgress,
    Grid,
    ToggleButtonGroup,
    ToggleButton,
} from '@mui/material';
import { useAuth } from '@/lib/AuthContext';
import { useTheme } from '@mui/material/styles';
import Google from '@mui/icons-material/Google';
import GitHub from '@mui/icons-material/GitHub';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import Person from '@mui/icons-material/Person';
import Business from '@mui/icons-material/Business';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import { PageLayout } from '@/components/layout/PageLayout';
import ContentCard from '@/components/ContentCard';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [accountType, setAccountType] = useState('personal');
    const [companyName, setCompanyName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { signUp } = useAuth();
    const router = useRouter();
    const theme = useTheme();

    const handleAccountTypeChange = (event, newType) => {
        if (newType !== null) {
            setAccountType(newType);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;

        setError('');
        setIsLoading(true);

        try {
            // Input validation
            if (!email.trim()) {
                setError('Email is required');
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setError('Please enter a valid email address');
                return;
            }

            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }

            // Validate password strength
            if (password.length < 8) {
                setError('Password must be at least 8 characters long');
                return;
            }

            // Validate required fields
            if (!firstName || !lastName) {
                setError('First name and last name are required');
                return;
            }

            if (accountType === 'business' && !companyName) {
                setError('Company name is required for business accounts');
                return;
            }

            const userData = {
                firstName,
                lastName,
                accountType,
                companyName: accountType === 'business' ? companyName : null,
            };

            const { data, error: signUpError } = await signUp(email, password, userData);
            
            if (signUpError) {
                console.error('Sign up error:', {
                    message: signUpError.message,
                    status: signUpError.status,
                    details: signUpError.details
                });
                
                // Handle specific error cases
                if (signUpError.message?.toLowerCase().includes('email already registered')) {
                    setError('This email is already registered. Please sign in instead.');
                } else {
                    setError(signUpError.message || 'Failed to sign up. Please try again.');
                }
                return;
            }

            // Show success message
            alert('Please check your email to confirm your account');

            // Redirect to login page
            router.push('/login');
        } catch (err) {
            console.error('Sign up error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageLayout
            layout="auth"
            title="Create Account"
            subtitle="Join thousands of users using Recapio.ai to transform their conversations into insights"
            toolbar={null}
        >
            <ContentCard>
                <Grid container spacing={0}>
                    {/* Left Column - Main Sign Up Form */}
                    <Grid item xs={12} md={7}>
                        <Box 
                            component="form" 
                            onSubmit={handleSubmit} 
                            sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: 2.5,
                                pr: { md: 6 },
                                pl: { md: 4 },
                                py: 4
                            }}
                        >
                            {error && (
                                <Alert severity="error" sx={{ mb: 1 }}>
                                    {error}
                                </Alert>
                            )}

                            <Box sx={{ display: 'flex', width: '100%', mb: 1 }}>
                                <ToggleButtonGroup
                                    value={accountType}
                                    exclusive
                                    onChange={handleAccountTypeChange}
                                    aria-label="account type"
                                    sx={{
                                        width: '100%',
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: 2,
                                        '& .MuiToggleButton-root': {
                                            borderRadius: '10px',
                                            py: 1,
                                            borderColor: theme.palette.divider,
                                            color: theme.palette.text.secondary,
                                            '&.Mui-selected': {
                                                bgcolor: `${theme.palette.primary.main}14`,
                                                color: theme.palette.primary.main,
                                                borderColor: theme.palette.primary.main,
                                            },
                                        },
                                    }}
                                >
                                    <ToggleButton 
                                        value="personal" 
                                        aria-label="personal account"
                                        sx={{ 
                                            gap: 1,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: '44px',
                                            '& .MuiSvgIcon-root': {
                                                color: 'inherit'
                                            }
                                        }}
                                    >
                                        <Person /> Personal
                                    </ToggleButton>
                                    <ToggleButton 
                                        value="business" 
                                        aria-label="business account"
                                        sx={{ 
                                            gap: 1,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: '44px',
                                            '& .MuiSvgIcon-root': {
                                                color: 'inherit'
                                            }
                                        }}
                                    >
                                        <Business /> Business
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        variant="outlined"
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonOutlined sx={{ color: theme.palette.text.secondary }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '10px',
                                                height: '44px',
                                                padding: '0 14px',
                                                paddingLeft: '20px',
                                                '&.Mui-focused fieldset': {
                                                    borderColor: theme.palette.primary.main,
                                                },
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Last Name"
                                        variant="outlined"
                                        required
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonOutlined sx={{ color: theme.palette.text.secondary }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '10px',
                                                height: '44px',
                                                padding: '0 14px',
                                                paddingLeft: '20px',
                                                '&.Mui-focused fieldset': {
                                                    borderColor: theme.palette.primary.main,
                                                },
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            {accountType === 'business' && (
                                <TextField
                                    fullWidth
                                    label="Company Name"
                                    variant="outlined"
                                    required
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Business sx={{ color: theme.palette.text.secondary }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '10px',
                                            height: '44px',
                                            padding: '0 14px',
                                            paddingLeft: '20px',
                                            '&.Mui-focused fieldset': {
                                                borderColor: theme.palette.primary.main,
                                            },
                                        },
                                    }}
                                />
                            )}

                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                variant="outlined"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailOutlined sx={{ color: theme.palette.text.secondary }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        height: '44px',
                                        padding: '0 14px',
                                        paddingLeft: '20px',
                                        '&.Mui-focused fieldset': {
                                            borderColor: theme.palette.primary.main,
                                        },
                                    },
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                variant="outlined"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlined sx={{ color: theme.palette.text.secondary }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        height: '44px',
                                        padding: '0 14px',
                                        paddingLeft: '20px',
                                        '&.Mui-focused fieldset': {
                                            borderColor: theme.palette.primary.main,
                                        },
                                    },
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Confirm Password"
                                type={showPassword ? 'text' : 'password'}
                                variant="outlined"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlined sx={{ color: theme.palette.text.secondary }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        height: '44px',
                                        padding: '0 14px',
                                        paddingLeft: '20px',
                                        '&.Mui-focused fieldset': {
                                            borderColor: theme.palette.primary.main,
                                        },
                                    },
                                }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={isLoading}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 1.5,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                }}
                            >
                                {isLoading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Create Account'
                                )}
                            </Button>

                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Already have an account?{' '}
                                    <Link href="/login" sx={{ textDecoration: 'none' }}>
                                        Sign in
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Right Column - OAuth Providers */}
                    <Grid item xs={12} md={5} sx={{ 
                        borderLeft: { md: `1px solid ${theme.palette.divider}` },
                        borderTop: { xs: `1px solid ${theme.palette.divider}`, md: 'none' },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        p: 4
                    }}>
                        <Typography variant="h6" gutterBottom align="center">
                            Or sign up with
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            <Button
                                variant="outlined"
                                fullWidth
                                startIcon={<Google />}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 1.5,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                }}
                            >
                                Google
                            </Button>
                            <Button
                                variant="outlined"
                                fullWidth
                                startIcon={<GitHub />}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 1.5,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                }}
                            >
                                GitHub
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </ContentCard>
        </PageLayout>
    );
}

