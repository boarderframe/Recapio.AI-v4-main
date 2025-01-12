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
import { useAuth } from '../../lib/AuthContext';
import { useTheme } from '@mui/material/styles';
import { Google, GitHub, Visibility, VisibilityOff, EmailOutlined, LockOutlined } from '@mui/icons-material';
import ContentCard from '../../components/ContentCard';

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
        <>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Create Account
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Join thousands of users using Recapio.ai
                    <br />
                    to transform their conversations into insights
                </Typography>
            </Box>
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

                            <TextField
                                fullWidth
                                label={accountType === 'business' ? "Work Email" : "Personal Email"}
                                variant="outlined"
                                type="email"
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
                                                <BusinessOutlined sx={{ color: theme.palette.text.secondary }} />
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
                                label="Password"
                                variant="outlined"
                                type={showPassword ? 'text' : 'password'}
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
                                        '&.Mui-focused fieldset': {
                                            borderColor: theme.palette.primary.main,
                                        },
                                    },
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Confirm Password"
                                variant="outlined"
                                type={showPassword ? 'text' : 'password'}
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

                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                gap: 4,
                                mt: 0.5
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
                                        flexShrink: 0,
                                        '&:hover': {
                                            bgcolor: theme.palette.primary.dark,
                                        },
                                    }}
                                >
                                    {isLoading ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CircularProgress size={16} color="inherit" />
                                            <span>Creating Account...</span>
                                        </Box>
                                    ) : (
                                        'Create Account'
                                    )}
                                </Button>

                                <Typography 
                                    variant="body2" 
                                    color="text.secondary" 
                                    sx={{ 
                                        fontSize: '0.875rem', 
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        minHeight: '44px',
                                        lineHeight: 1.5,
                                        '& > span': {
                                            textAlign: 'right',
                                            fontSize: '0.875rem'
                                        }
                                    }}
                                >
                                    <span>By signing up,</span>
                                    <span>
                                        you agree to our{' '}
                                        <Link 
                                            href="/terms" 
                                            sx={{ 
                                                color: theme.palette.primary.main,
                                                textDecoration: 'none',
                                                '&:hover': { textDecoration: 'underline' }
                                            }}
                                        >
                                            Terms
                                        </Link>
                                        {' '}and{' '}
                                        <Link 
                                            href="/privacy" 
                                            sx={{ 
                                                color: theme.palette.primary.main,
                                                textDecoration: 'none',
                                                '&:hover': { textDecoration: 'underline' }
                                            }}
                                        >
                                            Privacy Policy
                                        </Link>
                                        .
                                    </span>
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Right Column - Social Sign Up & Login Link */}
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
                                    Already have an account?{' '}
                                    <Link
                                        href="/login"
                                        sx={{ 
                                            color: theme.palette.primary.main, 
                                            textDecoration: 'none',
                                            fontWeight: 600,
                                            '&:hover': {
                                                textDecoration: 'underline',
                                            },
                                        }}
                                    >
                                        Sign in
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </ContentCard>
        </>
    );
}

