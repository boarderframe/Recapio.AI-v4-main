'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/supabase-js';
import { Snackbar, Alert } from '@mui/material';

const supabase = createClientComponentClient();

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: Error | null;
}

interface AuthContextType extends AuthState {
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    signUp: (email: string, password: string, name?: string) => Promise<{ error: Error | null }>;
    resetPassword: (email: string) => Promise<{ error: Error | null }>;
    updateProfile: (data: Partial<User>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isLoading: true,
        error: null
    });
    const [notification, setNotification] = useState<{
        message: string;
        type: 'success' | 'error';
        open: boolean;
    }>({
        message: '',
        type: 'success',
        open: false
    });

    useEffect(() => {
        let mounted = true;

        // Check for existing session
        const checkSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error) throw error;
                if (!mounted) return;

                setAuthState(prev => ({
                    ...prev,
                    user: session?.user || null,
                    isLoading: false
                }));

                // Set up auth state change listener
                const { data: { subscription } } = supabase.auth.onAuthStateChange(
                    async (event, session) => {
                        if (!mounted) return;

                        setAuthState(prev => ({
                            ...prev,
                            user: session?.user || null,
                            isLoading: false
                        }));

                        if (event === 'SIGNED_IN') {
                            setNotification({
                                message: 'Successfully logged in',
                                type: 'success',
                                open: true
                            });
                        } else if (event === 'SIGNED_OUT') {
                            setNotification({
                                message: 'Successfully logged out',
                                type: 'success',
                                open: true
                            });
                        }
                    }
                );

                return () => {
                    mounted = false;
                    subscription.unsubscribe();
                };
            } catch (error) {
                if (!mounted) return;
                setAuthState(prev => ({
                    ...prev,
                    error: error as Error,
                    isLoading: false
                }));
            }
        };

        checkSession();
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
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

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            setNotification({
                message: 'Error signing out',
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

    const updateProfile = async (data: Partial<User>) => {
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

    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    const value = {
        ...authState,
        signIn,
        signOut,
        signUp,
        resetPassword,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {notification.message}
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