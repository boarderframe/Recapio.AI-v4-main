'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { supabase } from './supabaseClient';
import { useAuthStore } from '@/lib/state/stores/authStore';
import { log } from '@/lib/utils/logger';

type Notification = {
    message: string;
    type: 'success' | 'error' | 'info';
    open: boolean;
};

// Extend the User type to include raw_user_meta_data
interface ExtendedUser extends User {
    raw_user_meta_data?: {
        role?: string;
        [key: string]: any;
    };
}

interface AuthContextType {
    user: ExtendedUser | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    signUp: (email: string, password: string, name?: string) => Promise<{ error: Error | null }>;
    resetPassword: (email: string) => Promise<{ error: Error | null }>;
    updateProfile: (data: Partial<ExtendedUser>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, session, isLoading, signIn: authStoreSignIn, signOut: authStoreSignOut } = useAuthStore();
    const [notification, setNotification] = useState<Notification | null>(null);

    // Handle auth state changes
    useEffect(() => {
        if (user && session) {
            log.auth.info('Auth state updated - user authenticated', {
                userId: user.id,
                email: user.email
            });
            
            // Only navigate if we're on an auth page and not during sign in
            const isAuthPage = window.location.pathname.startsWith('/login') || 
                             window.location.pathname.startsWith('/signup');
            
            if (isAuthPage && !window.location.pathname.includes('returnTo')) {
                router.replace('/dashboard');
            }
        }
    }, [user, session, router]);

    const signIn = async (email: string, password: string) => {
        try {
            await authStoreSignIn(email, password);
            
            // Get return URL or default to dashboard
            const returnTo = new URLSearchParams(window.location.search).get('returnTo');
            const destination = returnTo || '/dashboard';
            
            // Navigate immediately after successful sign in
            router.replace(destination);
            
            setNotification({
                message: 'Successfully signed in',
                type: 'success',
                open: true
            });
            return { error: null };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to sign in';
            setNotification({
                message,
                type: 'error',
                open: true
            });
            return { error: error as Error };
        }
    };

    const signOut = async () => {
        try {
            await authStoreSignOut();
            setNotification({
                message: 'Successfully signed out',
                type: 'success',
                open: true
            });
            router.push('/');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error signing out';
            setNotification({
                message,
                type: 'error',
                open: true
            });
        }
    };

    const signUp = async (email: string, password: string, name?: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        display_name: name,
                    }
                }
            });

            if (error) throw error;

            setNotification({
                message: 'Please check your email to verify your account',
                type: 'success',
                open: true
            });
            return { error: null };
        } catch (error) {
            setNotification({
                message: (error as Error).message,
                type: 'error',
                open: true
            });
            return { error: error as Error };
        }
    };

    const resetPassword = async (email: string) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) throw error;
            
            setNotification({
                message: 'Password reset instructions sent to your email',
                type: 'success',
                open: true
            });
            return { error: null };
        } catch (error) {
            setNotification({
                message: (error as Error).message,
                type: 'error',
                open: true
            });
            return { error: error as Error };
        }
    };

    const updateProfile = async (data: Partial<ExtendedUser>) => {
        try {
            const { error } = await supabase.auth.updateUser({
                data: data
            });

            if (error) throw error;

            setNotification({
                message: 'Profile updated successfully',
                type: 'success',
                open: true
            });
            return { error: null };
        } catch (error) {
            setNotification({
                message: (error as Error).message,
                type: 'error',
                open: true
            });
            return { error: error as Error };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user: user as ExtendedUser | null,
                loading: isLoading,
                signIn,
                signOut,
                signUp,
                resetPassword,
                updateProfile,
            }}
        >
            {children}
            <Snackbar
                open={notification?.open}
                autoHideDuration={2000}
                onClose={() => setNotification(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setNotification(null)}
                    severity={notification?.type}
                    sx={{ width: '100%' }}
                >
                    {notification?.message}
                </Alert>
            </Snackbar>
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 