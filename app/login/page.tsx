'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Link as MuiLink,
    Alert,
    InputAdornment,
    IconButton,
    CircularProgress,
} from '@mui/material';
import { useAuth } from '@/lib/AuthContext';
import { useTheme } from '@mui/material/styles';
import {
    Visibility,
    VisibilityOff,
    EmailOutlined,
    LockOutlined
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import PageBody from '@/components/PageBody';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { signIn, user } = useAuth();
    const theme = useTheme();
    const router = useRouter();

    // Redirect if already logged in
    useEffect(() => {
        if (!isLoading && user) {
            const params = new URLSearchParams(window.location.search);
            const redirectTo = params.get('redirectTo') || '/dashboard';
            router.push(redirectTo);
        }
    }, [user, isLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isLoading) return;
        
        setIsLoading(true);
        setError('');
        
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
            
            if (signInError) {
                setError(
                    signInError.message?.toLowerCase().includes('invalid login credentials')
                        ? 'Invalid email or password'
                        : signInError.message?.toLowerCase().includes('email not confirmed')
                        ? 'Please verify your email'
                        : 'Failed to sign in'
                );
            }
        } catch (error) {
            setError('Connection error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageLayout>
            <PageBody>
                <Box sx={{ maxWidth: 'sm', mx: 'auto', py: 8 }}>
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Welcome Back
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            Sign in to your account
                            <br />
                            and continue your journey with Recapio.ai
                        </Typography>
                    </Box>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2.5,
                        }}
                    >
                        {error && (
                            <Alert
                                severity="error"
                                sx={{
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
                                        <EmailOutlined />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Password"
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
                                        <LockOutlined />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            disabled={isLoading}
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isLoading}
                                sx={{ minWidth: 120 }}
                            >
                                {isLoading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Sign In'
                                )}
                            </Button>

                            <MuiLink
                                component={Link}
                                href="/forgot-password"
                                variant="body2"
                                sx={{ textDecoration: 'none' }}
                            >
                                Forgot password?
                            </MuiLink>
                        </Box>

                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Don't have an account?{' '}
                                <MuiLink
                                    component={Link}
                                    href="/signup"
                                    sx={{ textDecoration: 'none' }}
                                >
                                    Sign up
                                </MuiLink>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </PageBody>
        </PageLayout>
    );
} 