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
} from '@mui/material';
import { useAuth } from '@/lib/AuthContext';
import { useTheme } from '@mui/material/styles';
import { Google, GitHub, Visibility, VisibilityOff, EmailOutlined, LockOutlined } from '@mui/icons-material';
import PageLayout from '@/components/PageLayout';
import ContentCard from '@/components/ContentCard';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useAuth();
    const theme = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;
        
        // Start loading state
        setIsLoading(true);
        
        // Basic validation without state updates
        if (!email.trim() || !password) {
            setError(!email.trim() ? 'Email is required' : 'Password is required');
            setIsLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        try {
            const { error: signInError } = await signIn(email, password);
            
            // Handle errors without intermediate state updates
            if (signInError) {
                setError(
                    signInError.message?.toLowerCase().includes('invalid login credentials')
                        ? 'Invalid email or password'
                        : signInError.message?.toLowerCase().includes('email not confirmed')
                        ? 'Please verify your email'
                        : 'Failed to sign in'
                );
                setIsLoading(false);
                return;
            }
        } catch (error) {
            setError('Connection error');
            setIsLoading(false);
        }
    };

    return (
        <PageLayout
            title="Welcome Back"
            subtitle={
                <>
                    Sign in to your account
                    <br />
                    and continue your journey with Recapio.ai
                </>
            }
        >
            <ContentCard>
                <Grid container spacing={0}>
                    {/* Left Column - Main Login Form */}
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
                            method="post"
                            id="login-form"
                        >
                            {error && (
                                <Alert 
                                    severity="error" 
                                    sx={{ 
                                        mb: 1,
                                        '& .MuiAlert-message': {
                                            fontSize: '0.875rem'
                                        }
                                    }}
                                >
                                    {error}
                                </Alert>
                            )}

                            <TextField
                                fullWidth
                                label="Email"
                                variant="outlined"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                error={!!error && error.toLowerCase().includes('email')}
                                name="username"
                                id="username"
                                autoComplete="username email"
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
                                        transition: 'all 0.2s',
                                        '&.Mui-focused fieldset': {
                                            borderColor: theme.palette.primary.main,
                                        },
                                    },
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                variant="outlined"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                error={!!error && error.toLowerCase().includes('password')}
                                name="current-password"
                                id="current-password"
                                autoComplete="current-password"
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
                                                disabled={isLoading}
                                                sx={{ color: theme.palette.text.secondary }}
                                                type="button"
                                                tabIndex="-1"
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
                                        transition: 'all 0.2s',
                                        '&.Mui-focused fieldset': {
                                            borderColor: theme.palette.primary.main,
                                        },
                                    },
                                }}
                            />

                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mt: 0.5,
                                width: '100%'
                            }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={isLoading}
                                    sx={{
                                        bgcolor: theme.palette.primary.main,
                                        color: 'white',
                                        height: '44px',
                                        width: '180px',
                                        borderRadius: '10px',
                                        textTransform: 'none',
                                        fontSize: '0.9375rem',
                                        fontWeight: 600,
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            bgcolor: theme.palette.primary.dark,
                                        },
                                    }}
                                >
                                    {isLoading ? (
                                        <CircularProgress size={20} color="inherit" />
                                    ) : (
                                        'Sign In'
                                    )}
                                </Button>

                                <Link 
                                    href="/forgot-password" 
                                    sx={{ 
                                        color: theme.palette.primary.main,
                                        textDecoration: 'none',
                                        fontWeight: 500,
                                        fontSize: '0.875rem',
                                        '&:hover': {
                                            textDecoration: 'underline',
                                        },
                                    }}
                                >
                                    Forgot password?
                                </Link>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Right Column - Social Login & Sign Up */}
                    <Grid 
                        item 
                        xs={12} 
                        md={5} 
                        sx={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            py: 4,
                            pl: { md: 6 },
                            pr: { md: 4 },
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                left: 0,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                height: '80%',
                                width: '1px',
                                bgcolor: theme.palette.divider,
                                display: { xs: 'none', md: 'block' }
                            }
                        }}
                    >
                        <Box>
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    mb: 3, 
                                    color: 'text.secondary',
                                    fontWeight: 500
                                }}
                            >
                                Or continue with
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<Google />}
                                    disabled={isLoading}
                                    sx={{
                                        borderColor: theme.palette.divider,
                                        color: theme.palette.text.primary,
                                        height: '44px',
                                        borderRadius: '10px',
                                        textTransform: 'none',
                                        fontSize: '0.9375rem',
                                        fontWeight: 500,
                                        justifyContent: 'flex-start',
                                        pl: 3,
                                        pr: 5,
                                        '&:hover': {
                                            borderColor: theme.palette.primary.main,
                                            bgcolor: 'transparent',
                                        },
                                    }}
                                >
                                    Continue with Google
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<GitHub />}
                                    disabled={isLoading}
                                    sx={{
                                        borderColor: theme.palette.divider,
                                        color: theme.palette.text.primary,
                                        height: '44px',
                                        borderRadius: '10px',
                                        textTransform: 'none',
                                        fontSize: '0.9375rem',
                                        fontWeight: 500,
                                        justifyContent: 'flex-start',
                                        pl: 3,
                                        pr: 5,
                                        '&:hover': {
                                            borderColor: theme.palette.primary.main,
                                            bgcolor: 'transparent',
                                        },
                                    }}
                                >
                                    Continue with GitHub
                                </Button>
                            </Box>
                        </Box>

                        <Box sx={{ mt: 4 }}>
                            <Divider />
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Don't have an account?{' '}
                                    <Link
                                        href="/signup"
                                        sx={{ 
                                            color: theme.palette.primary.main, 
                                            textDecoration: 'none',
                                            fontWeight: 600,
                                            '&:hover': {
                                                textDecoration: 'underline',
                                            },
                                        }}
                                    >
                                        Sign up
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </ContentCard>
        </PageLayout>
    );
}