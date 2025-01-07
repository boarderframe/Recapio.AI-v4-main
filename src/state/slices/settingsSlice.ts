import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  theme: 'light' | 'dark';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
  transcriptPreferences: {
    defaultFormat: 'stream' | 'cards' | 'summary';
    autoSave: boolean;
    autoAnalyze: boolean;
  };
}

const loadSettings = (): Partial<SettingsState> => {
  if (typeof window === 'undefined') return {};
  const saved = localStorage.getItem('recapio_settings');
  return saved ? JSON.parse(saved) : {};
};

const initialState: SettingsState = {
  theme: 'light',
  language: 'en',
  notifications: {
    email: true,
    push: true,
    desktop: true,
  },
  transcriptPreferences: {
    defaultFormat: 'stream',
    autoSave: true,
    autoAnalyze: true,
  },
  ...loadSettings(),
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('recapio_settings', JSON.stringify(state));
      }
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('recapio_settings', JSON.stringify(state));
      }
    },
    updateNotificationSettings: (
      state,
      action: PayloadAction<Partial<SettingsState['notifications']>>
    ) => {
      state.notifications = { ...state.notifications, ...action.payload };
      if (typeof window !== 'undefined') {
        localStorage.setItem('recapio_settings', JSON.stringify(state));
      }
    },
    updateTranscriptPreferences: (
      state,
      action: PayloadAction<Partial<SettingsState['transcriptPreferences']>>
    ) => {
      state.transcriptPreferences = {
        ...state.transcriptPreferences,
        ...action.payload,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('recapio_settings', JSON.stringify(state));
      }
    },
    resetSettings: (state) => {
      const newState = { ...initialState };
      delete newState.theme; // Keep the theme setting
      Object.assign(state, newState);
      if (typeof window !== 'undefined') {
        localStorage.setItem('recapio_settings', JSON.stringify(state));
      }
    },
  },
});

export const {
  setTheme,
  setLanguage,
  updateNotificationSettings,
  updateTranscriptPreferences,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer; 