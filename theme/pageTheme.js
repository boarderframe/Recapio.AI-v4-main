import { Roboto } from 'next/font/google';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

// Define colors to match across themes
const colors = {
    primary: {
        main: '#2563eb',
        light: '#60a5fa',
        dark: '#1d4ed8',
    },
    secondary: {
        main: '#7c3aed',
        light: '#a78bfa',
        dark: '#5b21b6',
    },
};

// Spacing constants
const spacing = {
    contentGap: 4, // Controls the gap between ContentCard components
};

// Create base theme
const baseTheme = createTheme({
    palette: {
        primary: colors.primary,
        secondary: colors.secondary,
        background: {
            default: '#fafafa',
            paper: '#ffffff',
        },
        text: {
            primary: '#212121',
            secondary: '#757575',
        },
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
        fontSize: 13,
        h1: {
            fontSize: { xs: '1.75rem', md: '2rem' },
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: '1.25rem',
            letterSpacing: '-0.01em',
            background: `linear-gradient(135deg, ${colors.primary.dark} 0%, ${colors.primary.main} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        },
        h2: {
            fontSize: { xs: '1.5rem', md: '1.75rem' },
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: '1rem',
            letterSpacing: '-0.01em',
        },
        h3: {
            fontSize: { xs: '1.25rem', md: '1.5rem' },
            fontWeight: 600,
            lineHeight: 1.3,
            marginBottom: '0.875rem',
            letterSpacing: '-0.01em',
        },
        h4: {
            fontSize: { xs: '1.125rem', md: '1.25rem' },
            fontWeight: 600,
            lineHeight: 1.3,
            marginBottom: '0.75rem',
        },
        h5: {
            fontSize: { xs: '1rem', md: '1.125rem' },
            fontWeight: 600,
            lineHeight: 1.3,
            marginBottom: '0.625rem',
        },
        h6: {
            fontSize: { xs: '0.875rem', md: '1rem' },
            fontWeight: 600,
            lineHeight: 1.3,
            marginBottom: '0.5rem',
        },
        subtitle1: {
            fontSize: { xs: '1.125rem', md: '1.25rem' },
            fontWeight: 500,
            lineHeight: 1.4,
            letterSpacing: '0.01em',
            marginBottom: '0.75rem',
        },
        subtitle2: {
            fontSize: { xs: '1rem', md: '1.125rem' },
            fontWeight: 500,
            lineHeight: 1.4,
            letterSpacing: '0.01em',
            marginBottom: '0.625rem',
        },
        body1: {
            fontSize: { xs: '0.875rem', md: '1rem' },
            lineHeight: 1.5,
            marginBottom: '0.75rem',
            '& strong': {
                fontWeight: 600,
            },
        },
        body2: {
            fontSize: { xs: '0.8125rem', md: '0.875rem' },
            lineHeight: 1.5,
            marginBottom: '0.625rem',
            '& strong': {
                fontWeight: 600,
            },
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
            letterSpacing: '0.01em',
            fontSize: '0.875rem',
        },
        caption: {
            fontSize: '0.75rem',
            lineHeight: 1.4,
            letterSpacing: '0.01em',
        },
        overline: {
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            lineHeight: 1.4,
        },
    },
    shape: {
        borderRadius: 8,
    },
});

// Create the full theme
const pageTheme = createTheme({
    ...baseTheme,
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    padding: '6px 16px',
                    borderRadius: '6px',
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    fontSize: '0.8125rem',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                    },
                },
                containedPrimary: {
                    backgroundColor: colors.primary.main,
                    color: '#ffffff',
                    boxShadow: `0 4px 12px ${colors.primary.main}33`,
                    '&:hover': {
                        backgroundColor: colors.primary.dark,
                        boxShadow: `0 6px 16px ${colors.primary.main}4D`,
                        transform: 'scale(1.03)',
                    },
                },
                containedSecondary: {
                    backgroundColor: colors.secondary.main,
                    color: colors.secondary.contrastText,
                    boxShadow: `0 4px 12px ${colors.secondary.main}33`,
                    '&:hover': {
                        backgroundColor: colors.secondary.dark,
                        boxShadow: `0 6px 16px ${colors.secondary.main}4D`,
                        transform: 'scale(1.03)',
                    },
                },
                outlinedPrimary: {
                    borderColor: colors.primary.main,
                    borderWidth: '2px',
                    color: colors.primary.main,
                    '&:hover': {
                        borderWidth: '2px',
                        borderColor: colors.primary.dark,
                        backgroundColor: `${colors.primary.main}08`,
                        transform: 'scale(1.03)',
                    },
                },
                textPrimary: {
                    color: colors.primary.main,
                    '&:hover': {
                        backgroundColor: `${colors.primary.main}08`,
                        transform: 'scale(1.03)',
                    },
                },
            },
            variants: [{
                props: { variant: 'signup' },
                style: {
                    background: `linear-gradient(45deg, ${colors.primary.main} 30%, ${colors.primary.light} 90%)`,
                    color: colors.primary.contrastText,
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    padding: '6px 16px',
                    minWidth: '90px',
                    borderRadius: '6px',
                    transition: 'all 0.3s ease',
                    backgroundSize: '200% auto',
                    backgroundPosition: '0% 50%',
                    boxShadow: `0 2px 8px ${colors.primary.main}33`,
                    '&:hover': {
                        backgroundPosition: '100% 50%',
                        background: `linear-gradient(45deg, ${colors.primary.light} 30%, ${colors.primary.main} 90%)`,
                        boxShadow: `0 4px 12px ${colors.primary.main}4D`,
                        transform: 'translateY(-1px)',
                    },
                },
            }],
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    position: 'relative',
                    backgroundColor: '#ffffff',
                    padding: '1rem',
                    '& .MuiCardContent-root': {
                        padding: '0.75rem',
                        '& .MuiTypography-root': {
                            marginBottom: '0.5rem',
                        },
                        '& .MuiListItem-root': {
                            padding: '0.375rem 0',
                            '& .MuiListItemIcon-root': {
                                minWidth: '32px',
                                marginRight: '0.5rem',
                            },
                            '& .MuiListItemText-root': {
                                margin: 0,
                            },
                        },
                    }
                }
            }
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    '&.brand-logo': {
                        fontWeight: 700,
                        letterSpacing: '.05rem',
                        background: `linear-gradient(45deg, ${colors.secondary.main} 30%, ${colors.primary.main} 90%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textDecoration: 'none',
                        fontSize: '1.25rem',
                        display: 'inline-block',
                        marginTop: '4px'
                    }
                },
            },
        },
    },
    spacing: spacing,
});

export default responsiveFontSizes(pageTheme); 