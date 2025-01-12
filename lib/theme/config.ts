import { createTheme, ThemeOptions } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

// Theme mode type
export type ThemeMode = PaletteMode;

// Theme settings interface
export interface ThemeSettings {
    mode: ThemeMode;
    primaryColor: string;
    secondaryColor: string;
    spacing: number;
    borderRadius: number;
    headerHeight: number;
    sidebarWidth: number;
    footerHeight: number;
}

// Default theme settings
export const defaultThemeSettings: ThemeSettings = {
    mode: 'light',
    primaryColor: '#2563eb', // Blue 600
    secondaryColor: '#4f46e5', // Indigo 600
    spacing: 8,
    borderRadius: 8,
    headerHeight: 64,
    sidebarWidth: 240,
    footerHeight: 64
};

// Light theme palette
const lightPalette = {
    mode: 'light' as const,
    primary: {
        main: defaultThemeSettings.primaryColor,
        light: '#60a5fa', // Blue 400
        dark: '#1d4ed8', // Blue 700
        contrastText: '#ffffff'
    },
    secondary: {
        main: defaultThemeSettings.secondaryColor,
        light: '#818cf8', // Indigo 400
        dark: '#4338ca', // Indigo 700
        contrastText: '#ffffff'
    },
    background: {
        default: '#f8fafc', // Slate 50
        paper: '#ffffff'
    },
    text: {
        primary: '#0f172a', // Slate 900
        secondary: '#475569', // Slate 600
        disabled: '#94a3b8' // Slate 400
    }
};

// Dark theme palette
const darkPalette = {
    mode: 'dark' as const,
    primary: {
        main: defaultThemeSettings.primaryColor,
        light: '#60a5fa', // Blue 400
        dark: '#1d4ed8', // Blue 700
        contrastText: '#ffffff'
    },
    secondary: {
        main: defaultThemeSettings.secondaryColor,
        light: '#818cf8', // Indigo 400
        dark: '#4338ca', // Indigo 700
        contrastText: '#ffffff'
    },
    background: {
        default: '#0f172a', // Slate 900
        paper: '#1e293b' // Slate 800
    },
    text: {
        primary: '#f8fafc', // Slate 50
        secondary: '#cbd5e1', // Slate 300
        disabled: '#64748b' // Slate 500
    }
};

// Common theme options
const commonOptions: Partial<ThemeOptions> = {
    spacing: defaultThemeSettings.spacing,
    shape: {
        borderRadius: defaultThemeSettings.borderRadius
    },
    typography: {
        fontFamily: [
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif'
        ].join(','),
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            lineHeight: 1.2
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 700,
            lineHeight: 1.2
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
            lineHeight: 1.2
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: 1.2
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 600,
            lineHeight: 1.2
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.2
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5
        },
        button: {
            textTransform: 'none',
            fontWeight: 500
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: defaultThemeSettings.borderRadius,
                    padding: '0.5rem 1rem'
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: defaultThemeSettings.borderRadius,
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
                }
            }
        }
    }
};

// Create theme function
export const createAppTheme = (mode: ThemeMode = defaultThemeSettings.mode) => {
    return createTheme({
        ...commonOptions,
        palette: mode === 'light' ? lightPalette : darkPalette
    });
};

// Helper function to get theme settings
export const getThemeSettings = (settings?: Partial<ThemeSettings>): ThemeSettings => {
    return {
        ...defaultThemeSettings,
        ...settings
    };
}; 