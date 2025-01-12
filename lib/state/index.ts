// Redux exports
export { store } from './config';
export type { RootState, AppDispatch } from './config';
export { useAppDispatch, useAppSelector } from './config';

// Zustand store exports
export { useUIStore, useThemeStore, useSettingsStore } from './config';

// Redux slice exports
export {
    setUser,
    setLoading,
    setError,
    logout
} from './slices/authSlice';

export {
    setThemeMode,
    setThemeColors,
    setNotifications,
    setPreferences,
    resetSettings
} from './slices/settingsSlice';

export {
    toggleSidebar,
    setSidebarWidth,
    setHeaderHeight,
    setHeaderFixed,
    openUserMenu,
    closeUserMenu,
    openAdminMenu,
    closeAdminMenu,
    setModalOpen,
    setLoading as setUILoading
} from './slices/uiSlice';

// API hooks exports
export {
    useGetUserQuery,
    useUpdateUserMutation,
    useGetTranscriptsQuery,
    useGetTranscriptByIdQuery,
    useCreateTranscriptMutation,
    useUpdateTranscriptMutation,
    useDeleteTranscriptMutation,
    useGetAIModelsQuery,
    useGetAIModelByIdQuery,
    useCreateAIModelMutation,
    useUpdateAIModelMutation,
    useDeleteAIModelMutation,
} from './api'; 