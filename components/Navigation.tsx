'use client';

import React from 'react';
import { useAuth } from '../lib/AuthContext';
import Navbar from './Navbar';
import AuthNavbar from './AuthNavbar';
import { getMainNavRoutes, getAuthenticatedNavRoutes, getUserMenuRoutes } from '../lib/routes';

export default function Navigation() {
    const { user, isLoading } = useAuth();
    
    if (isLoading) {
        return null; // Or a loading spinner
    }

    if (user) {
        return <AuthNavbar mainRoutes={getAuthenticatedNavRoutes()} userMenuRoutes={getUserMenuRoutes()} />;
    }
    
    return <Navbar routes={getMainNavRoutes()} />;
} 