import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { RootState } from '@/state/store';
import {
    loginUser,
    signUpUser,
    logoutUser,
    loginWithProvider,
    resetPassword,
    updatePassword,
    updateProfile,
} from '@/state/slices/authSlice';
import type { SignUpData, UpdateProfileData, AuthProvider } from '@/types/auth';

export function useAuth() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { user, isLoading, error, session } = useSelector((state: RootState) => state.auth);

    const login = useCallback(async (email: string, password: string) => {
        try {
            await dispatch(loginUser({ email, password })).unwrap();
            router.push('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }, [dispatch, router]);

    const signup = useCallback(async (data: SignUpData) => {
        try {
            await dispatch(signUpUser(data)).unwrap();
            router.push('/dashboard');
        } catch (error) {
            console.error('Signup failed:', error);
            throw error;
        }
    }, [dispatch, router]);

    const logout = useCallback(async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            router.push('/auth/login');
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    }, [dispatch, router]);

    const loginWithOAuth = useCallback(async (provider: AuthProvider) => {
        try {
            await dispatch(loginWithProvider(provider)).unwrap();
            // OAuth will handle redirect
        } catch (error) {
            console.error('OAuth login failed:', error);
            throw error;
        }
    }, [dispatch]);

    const requestPasswordReset = useCallback(async (email: string) => {
        try {
            await dispatch(resetPassword(email)).unwrap();
            return true;
        } catch (error) {
            console.error('Password reset request failed:', error);
            throw error;
        }
    }, [dispatch]);

    const changePassword = useCallback(async (newPassword: string) => {
        try {
            await dispatch(updatePassword(newPassword)).unwrap();
            return true;
        } catch (error) {
            console.error('Password change failed:', error);
            throw error;
        }
    }, [dispatch]);

    const updateUserProfile = useCallback(async (data: UpdateProfileData) => {
        try {
            await dispatch(updateProfile(data)).unwrap();
            return true;
        } catch (error) {
            console.error('Profile update failed:', error);
            throw error;
        }
    }, [dispatch]);

    return {
        user,
        isLoading,
        error,
        session,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        loginWithOAuth,
        requestPasswordReset,
        changePassword,
        updateUserProfile,
    };
} 