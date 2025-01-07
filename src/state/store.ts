import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import * as Sentry from '@sentry/react';
import authReducer from './slices/authSlice';
import settingsReducer from './slices/settingsSlice';
import notificationsReducer from './slices/notificationsSlice';

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  // Configure this based on your Sentry needs
  actionTransformer: (action) => {
    if (action.type === 'auth/login') {
      // Don't include sensitive data in Sentry
      return { ...action, payload: { ...action.payload, user: '[Filtered]' } };
    }
    return action;
  },
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/login', 'auth/logout'],
      },
    }),
  enhancers: [sentryReduxEnhancer],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 