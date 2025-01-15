import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/types/store';

interface SettingsState {
  theme: 'light' | 'dark';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
}

const initialState: SettingsState = {
  theme: 'light',
  language: 'en',
  notifications: {
    email: true,
    push: true,
  },
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setNotifications: (state, action: PayloadAction<{ email?: boolean; push?: boolean }>) => {
      state.notifications = {
        ...state.notifications,
        ...action.payload,
      };
    },
    resetSettings: () => initialState,
  },
});

export const {
  setTheme,
  setLanguage,
  setNotifications,
  resetSettings,
} = settingsSlice.actions;

export const selectSettings = (state: RootState) => state.settings;
export const selectTheme = (state: RootState) => state.settings.theme;
export const selectLanguage = (state: RootState) => state.settings.language;
export const selectNotifications = (state: RootState) => state.settings.notifications;

export default settingsSlice.reducer; 