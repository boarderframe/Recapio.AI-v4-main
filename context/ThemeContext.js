'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const defaultThemeSettings = {
    spacing: {
        contentGap: 4,
        cardPadding: 2,
        headerSpacing: 2,
        sectionSpacing: 3,
        navHeight: 72,
    },
    header: {
        titleSize: { xs: '1.75rem', md: '2rem' },
        titleWeight: 700,
        titleLineHeight: 1.2,
        subtitleSize: { xs: '0.95rem', md: '1rem' },
        subtitleWeight: 400,
        subtitleLineHeight: 1.4,
        underlineWidth: '40%',
        underlineOpacity: 0.3,
        maxWidth: '600px',
        borderRadius: 8,
        padding: 2,
    },
    content: {
        borderRadius: 8,
        padding: 2,
        maxWidth: '100%',
    },
    navigation: {
        height: 72,
        borderRadius: 0,
    }
};

export function ThemeProvider({ children }) {
    const [themeSettings, setThemeSettings] = useState(defaultThemeSettings);
    const [isLoading, setIsLoading] = useState(true);

    // Load saved settings from the server on mount
    useEffect(() => {
        async function loadSettings() {
            try {
                const response = await fetch('/api/theme');
                const data = await response.json();
                
                // If we have saved settings, merge them with defaults
                if (Object.keys(data).length > 0) {
                    const mergedSettings = {
                        ...defaultThemeSettings,
                        ...data,
                        spacing: {
                            ...defaultThemeSettings.spacing,
                            ...(data.spacing || {}),
                        },
                        header: {
                            ...defaultThemeSettings.header,
                            ...(data.header || {}),
                        },
                        content: {
                            ...defaultThemeSettings.content,
                            ...(data.content || {}),
                        },
                        navigation: {
                            ...defaultThemeSettings.navigation,
                            ...(data.navigation || {}),
                        },
                    };
                    setThemeSettings(mergedSettings);
                }
            } catch (error) {
                console.error('Error loading theme settings:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadSettings();
    }, []);

    const saveToServer = async (settings) => {
        try {
            const response = await fetch('/api/theme', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            });
            
            if (!response.ok) {
                throw new Error('Failed to save theme settings');
            }
        } catch (error) {
            console.error('Error saving theme settings:', error);
            throw error;
        }
    };

    const updateSpacing = async (newSpacing) => {
        const updated = {
            ...themeSettings,
            spacing: {
                ...themeSettings.spacing,
                ...newSpacing
            }
        };
        setThemeSettings(updated);
        await saveToServer(updated);
    };

    const updateHeader = async (newHeader) => {
        const updated = {
            ...themeSettings,
            header: {
                ...themeSettings.header,
                ...newHeader
            }
        };
        setThemeSettings(updated);
        await saveToServer(updated);
    };

    const updateContent = async (newContent) => {
        const updated = {
            ...themeSettings,
            content: {
                ...themeSettings.content,
                ...newContent
            }
        };
        setThemeSettings(updated);
        await saveToServer(updated);
    };

    const resetToDefaults = async () => {
        setThemeSettings(defaultThemeSettings);
        await saveToServer(defaultThemeSettings);
    };

    if (isLoading) {
        return null; // or a loading spinner
    }

    return (
        <ThemeContext.Provider value={{ 
            themeSettings, 
            updateSpacing, 
            updateHeader,
            updateContent,
            resetToDefaults,
            defaultThemeSettings 
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeSettings() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeSettings must be used within a ThemeProvider');
    }
    return context;
} 