import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
    theme: {
        mode: 'light' | 'dark';
        primaryColor: string;
        secondaryColor: string;
    };
    notifications: {
        enabled: boolean;
        sound: boolean;
        desktop: boolean;
    };
    preferences: {
        autoSave: boolean;
        compactView: boolean;
        language: string;
    };
}

const initialState: SettingsState = {
    theme: {
        mode: 'light',
        primaryColor: '#2563eb',
        secondaryColor: '#4f46e5'
    },
    notifications: {
        enabled: true,
        sound: true,
        desktop: true
    },
    preferences: {
        autoSave: true,
        compactView: false,
        language: 'en'
    }
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setThemeMode: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme.mode = action.payload;
        },
        setThemeColors: (state, action: PayloadAction<{ primary?: string; secondary?: string }>) => {
            if (action.payload.primary) {
                state.theme.primaryColor = action.payload.primary;
            }
            if (action.payload.secondary) {
                state.theme.secondaryColor = action.payload.secondary;
            }
        },
        setNotifications: (state, action: PayloadAction<Partial<SettingsState['notifications']>>) => {
            state.notifications = { ...state.notifications, ...action.payload };
        },
        setPreferences: (state, action: PayloadAction<Partial<SettingsState['preferences']>>) => {
            state.preferences = { ...state.preferences, ...action.payload };
        },
        resetSettings: () => initialState
    }
});

export const {
    setThemeMode,
    setThemeColors,
    setNotifications,
    setPreferences,
    resetSettings
} = settingsSlice.actions;

export default settingsSlice.reducer; 