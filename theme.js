import { Roboto } from 'next/font/google';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

// Define colors first to avoid circular dependencies
const colors = {
    primary: {
        main: '#4682B4', // Steel Blue
        light: '#5C9DC9', // Lighter Steel Blue
        dark: '#2F5777', // Darker Steel Blue
        contrastText: '#ffffff',
    },
    secondary: {
        main: '#1a1a1a', // Dark Gray
        light: '#424242',
        dark: '#000000',
        contrastText: '#ffffff',
    },
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
        fontSize: 16,
        h1: {
            fontSize: { xs: '2.75rem', md: '3.5rem' },
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '2rem',
            letterSpacing: '-0.02em',
            background: `linear-gradient(135deg, ${colors.primary.dark} 0%, ${colors.primary.main} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        },
        h2: {
            fontSize: { xs: '2.25rem', md: '3rem' },
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: '1.5rem',
            letterSpacing: '-0.01em',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
        },
        h3: {
            fontSize: { xs: '1.875rem', md: '2.5rem' },
            fontWeight: 700,
            lineHeight: 1.3,
            marginBottom: '1.25rem',
            letterSpacing: '-0.01em',
        },
        h4: {
            fontSize: { xs: '1.5rem', md: '2rem' },
            fontWeight: 600,
            lineHeight: 1.4,
            marginBottom: '1rem',
        },
        h5: {
            fontSize: { xs: '1.25rem', md: '1.75rem' },
            fontWeight: 600,
            lineHeight: 1.4,
            marginBottom: '0.75rem',
        },
        h6: {
            fontSize: { xs: '1.125rem', md: '1.5rem' },
            fontWeight: 600,
            lineHeight: 1.5,
            marginBottom: '0.75rem',
        },
        subtitle1: {
            fontSize: { xs: '1.5rem', md: '1.75rem' },
            fontWeight: 500,
            lineHeight: 1.5,
            letterSpacing: '0.01em',
            marginBottom: '1rem',
        },
        subtitle2: {
            fontSize: { xs: '1.25rem', md: '1.5rem' },
            fontWeight: 500,
            lineHeight: 1.5,
            letterSpacing: '0.01em',
            marginBottom: '0.75rem',
        },
        body1: {
            fontSize: { xs: '1.25rem', md: '1.5rem' },
            lineHeight: 1.6,
            marginBottom: '1.25rem',
            '& strong': {
                fontWeight: 600,
            },
        },
        body2: {
            fontSize: { xs: '1.125rem', md: '1.375rem' },
            lineHeight: 1.6,
            marginBottom: '1rem',
            '& strong': {
                fontWeight: 600,
            },
        },
        caption: {
            fontSize: '1rem',
            lineHeight: 1.5,
            letterSpacing: '0.02em',
        },
        overline: {
            fontSize: '0.875rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            lineHeight: 1.5,
        },
    },
    shape: {
        borderRadius: 8,
    },
});

// Create the full theme
const theme = createTheme({
    ...baseTheme,
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    padding: '12px 24px',
                    borderRadius: '8px',
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    fontSize: '1rem',
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
                    fontSize: '1rem',
                    fontWeight: 600,
                    padding: '12px 24px',
                    minWidth: '120px',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    backgroundSize: '200% auto',
                    backgroundPosition: '0% 50%',
                    boxShadow: `0 4px 12px ${colors.primary.main}33`,
                    '&:hover': {
                        backgroundPosition: '100% 50%',
                        background: `linear-gradient(45deg, ${colors.primary.light} 30%, ${colors.primary.main} 90%)`,
                        boxShadow: `0 6px 16px ${colors.primary.main}4D`,
                        transform: 'translateY(-1px)',
                    },
                },
            }],
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    '&.brand-logo': {
                        fontWeight: 700,
                        letterSpacing: '.1rem',
                        background: `linear-gradient(45deg, ${colors.secondary.main} 30%, ${colors.primary.main} 90%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textDecoration: 'none',
                        fontSize: '1.75rem',
                        display: 'inline-block',
                        marginTop: '8px'
                    }
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    overflow: 'visible',
                    position: 'relative',
                    backgroundColor: '#ffffff',
                    padding: '2rem',
                    '& .MuiCardContent-root': {
                        padding: '1.5rem',
                        '& .MuiTypography-root': {
                            marginBottom: '1rem',
                        },
                        '& .MuiListItem-root': {
                            padding: '0.75rem 0',
                            '& .MuiListItemIcon-root': {
                                minWidth: '48px',
                                marginRight: '1rem',
                            },
                            '& .MuiListItemText-root': {
                                margin: 0,
                            },
                        },
                    },
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: 'inherit',
                        border: '2px solid transparent',
                        background: `linear-gradient(135deg, ${colors.primary.main}10 0%, ${colors.primary.light}20 50%, ${colors.secondary.light}20 100%)`,
                        WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        opacity: 0,
                    },
                    '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: `0 16px 32px ${colors.primary.main}20`,
                        '&::before': {
                            opacity: 1,
                        }
                    },
                    '&:active': {
                        transform: 'translateY(-4px) scale(1.01)',
                        boxShadow: `0 8px 16px ${colors.primary.main}15`,
                    }
                }
            }
        },
    },
});

export default responsiveFontSizes(theme);
