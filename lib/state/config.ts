import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { create, SetState } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

// Redux store configuration
import authReducer from './slices/authSlice';
import settingsReducer from './slices/settingsSlice';
import uiReducer from './slices/uiSlice';
import { api } from './api';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        settings: settingsReducer,
        ui: uiReducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
    devTools: process.env.NODE_ENV !== 'production',
});

// Enable listener behavior for RTK-Query
setupListeners(store.dispatch);

// Redux types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Redux hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Zustand store types
interface UIStore {
    isSidebarOpen: boolean;
    isUserMenuOpen: boolean;
    isAdminMenuOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    setIsUserMenuOpen: (isOpen: boolean) => void;
    setIsAdminMenuOpen: (isOpen: boolean) => void;
    toggleSidebar: () => void;
    toggleUserMenu: () => void;
    toggleAdminMenu: () => void;
}

interface ThemeStore {
    mode: 'light' | 'dark';
    setMode: (mode: 'light' | 'dark') => void;
    toggleMode: () => void;
}

interface SettingsStore {
    notifications: boolean;
    autoSave: boolean;
    compactView: boolean;
    setNotifications: (enabled: boolean) => void;
    setAutoSave: (enabled: boolean) => void;
    setCompactView: (enabled: boolean) => void;
}

// Zustand store creators with types
const createUIStore = (set: SetState<UIStore>): UIStore => ({
    isSidebarOpen: false,
    isUserMenuOpen: false,
    isAdminMenuOpen: false,
    setIsSidebarOpen: (isOpen: boolean) => set({ isSidebarOpen: isOpen }),
    setIsUserMenuOpen: (isOpen: boolean) => set({ isUserMenuOpen: isOpen }),
    setIsAdminMenuOpen: (isOpen: boolean) => set({ isAdminMenuOpen: isOpen }),
    toggleSidebar: () => set((state: UIStore) => ({ isSidebarOpen: !state.isSidebarOpen })),
    toggleUserMenu: () => set((state: UIStore) => ({ isUserMenuOpen: !state.isUserMenuOpen })),
    toggleAdminMenu: () => set((state: UIStore) => ({ isAdminMenuOpen: !state.isAdminMenuOpen })),
});

const createThemeStore = (set: SetState<ThemeStore>): ThemeStore => ({
    mode: 'light',
    setMode: (mode: 'light' | 'dark') => set({ mode }),
    toggleMode: () => set((state: ThemeStore) => ({ mode: state.mode === 'light' ? 'dark' : 'light' })),
});

const createSettingsStore = (set: SetState<SettingsStore>): SettingsStore => ({
    notifications: true,
    autoSave: true,
    compactView: false,
    setNotifications: (enabled: boolean) => set({ notifications: enabled }),
    setAutoSave: (enabled: boolean) => set({ autoSave: enabled }),
    setCompactView: (enabled: boolean) => set({ compactView: enabled }),
});

// Zustand store persistence configuration
type ThemePersist = PersistOptions<ThemeStore>;
type SettingsPersist = PersistOptions<SettingsStore>;

const themePersistConfig: ThemePersist = {
    name: 'theme-storage',
};

const settingsPersistConfig: SettingsPersist = {
    name: 'settings-storage',
};

// Export Zustand stores
export const useUIStore = create<UIStore>()(createUIStore);

export const useThemeStore = create<ThemeStore>()(
    persist(createThemeStore, themePersistConfig)
);

export const useSettingsStore = create<SettingsStore>()(
    persist(createSettingsStore, settingsPersistConfig)
); 