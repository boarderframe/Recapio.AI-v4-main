'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Snackbar, Alert } from '@mui/material';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const router = useRouter();

    useEffect(() => {
        // Check if user is stored in localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const signIn = async (email, password) => {
        try {
            // Simulate API call
            const mockUser = {
                id: '1',
                email: email,
                firstName: 'Carl',
                lastName: 'Osburn',
                role: 'admin'
            };

            setUser(mockUser);
            localStorage.setItem('user', JSON.stringify(mockUser));
            
            // Show success notification
            setNotification({
                open: true,
                message: 'Successfully logged in',
                severity: 'success'
            });

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (error) {
            console.error('Sign in error:', error);
            setNotification({
                open: true,
                message: 'Failed to log in',
                severity: 'error'
            });
        }
    };

    const signOut = () => {
        setUser(null);
        localStorage.removeItem('user');
        router.push('/');
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    if (loading) {
        return null;
    }

    return (
        <AuthContext.Provider value={{ user, signIn, signOut }}>
            {children}
            <Snackbar
                open={notification.open}
                autoHideDuration={3000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.severity}
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