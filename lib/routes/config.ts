import { Route } from './types';

// Define all application routes
export const routes: Record<string, Route> = {
    // Marketing routes
    home: {
        path: '/',
        label: 'Home',
        requiresAuth: false,
        group: 'marketing'
    },
    pricing: {
        path: '/pricing',
        label: 'Pricing',
        requiresAuth: false,
        group: 'marketing'
    },
    features: {
        path: '/features',
        label: 'Features',
        requiresAuth: false,
        group: 'marketing'
    },
    about: {
        path: '/about',
        label: 'About',
        requiresAuth: false,
        group: 'marketing'
    },
    contact: {
        path: '/contact',
        label: 'Contact',
        requiresAuth: false,
        group: 'marketing'
    },

    // Auth routes
    login: {
        path: '/login',
        label: 'Login',
        requiresAuth: false,
        group: 'auth'
    },
    signup: {
        path: '/signup',
        label: 'Sign Up',
        requiresAuth: false,
        group: 'auth'
    },
    forgotPassword: {
        path: '/forgot-password',
        label: 'Forgot Password',
        requiresAuth: false,
        group: 'auth'
    },
    resetPassword: {
        path: '/reset-password',
        label: 'Reset Password',
        requiresAuth: false,
        group: 'auth'
    },

    // Dashboard routes
    dashboard: {
        path: '/dashboard',
        label: 'Dashboard',
        requiresAuth: true,
        group: 'dashboard',
        icon: 'Dashboard'
    },
    transcripts: {
        path: '/transcripts',
        label: 'Transcripts',
        requiresAuth: true,
        group: 'dashboard',
        icon: 'Description'
    },
    settings: {
        path: '/settings',
        label: 'Settings',
        requiresAuth: true,
        group: 'dashboard',
        icon: 'Settings'
    },

    // User routes
    profile: {
        path: '/profile',
        label: 'Profile',
        requiresAuth: true,
        group: 'user',
        icon: 'Person'
    },
    account: {
        path: '/account',
        label: 'Account',
        requiresAuth: true,
        group: 'user',
        icon: 'AccountCircle'
    },
    billing: {
        path: '/billing',
        label: 'Billing',
        requiresAuth: true,
        group: 'user',
        icon: 'Payment'
    },

    // Admin routes
    admin: {
        path: '/admin',
        label: 'Admin',
        requiresAuth: true,
        requiresAdmin: true,
        group: 'admin',
        icon: 'AdminPanelSettings'
    },
    aiModels: {
        path: '/admin/ai-models',
        label: 'AI Models',
        requiresAuth: true,
        requiresAdmin: true,
        group: 'admin',
        icon: 'Psychology'
    },
    users: {
        path: '/admin/users',
        label: 'Users',
        requiresAuth: true,
        requiresAdmin: true,
        group: 'admin',
        icon: 'Group'
    },
    theme: {
        path: '/admin/theme',
        label: 'Theme',
        requiresAuth: true,
        requiresAdmin: true,
        group: 'admin',
        icon: 'Palette'
    },
    testing: {
        path: '/admin/testing',
        label: 'Testing',
        requiresAuth: true,
        requiresAdmin: true,
        group: 'admin',
        icon: 'Science'
    }
};

// Helper functions to get route groups
export const getRoutesByGroup = (group: string): Route[] => 
    Object.values(routes).filter(route => route.group === group);

export const getMarketingRoutes = (): Route[] => getRoutesByGroup('marketing');
export const getAuthRoutes = (): Route[] => getRoutesByGroup('auth');
export const getDashboardRoutes = (): Route[] => getRoutesByGroup('dashboard');
export const getUserRoutes = (): Route[] => getRoutesByGroup('user');
export const getAdminRoutes = (): Route[] => getRoutesByGroup('admin');

// Helper functions for route access
export const getPublicRoutes = (): Route[] => 
    Object.values(routes).filter(route => !route.requiresAuth);

export const getProtectedRoutes = (): Route[] => 
    Object.values(routes).filter(route => route.requiresAuth);

export const getAdminOnlyRoutes = (): Route[] => 
    Object.values(routes).filter(route => route.requiresAdmin);

// Navigation helpers
export const getMainNavRoutes = (): Route[] => 
    Object.values(routes).filter(route => 
        !route.requiresAuth && 
        route.group === 'marketing' &&
        !['/', '/login', '/signup'].includes(route.path)
    );

export const getDashboardNavRoutes = (): Route[] => 
    Object.values(routes).filter(route => 
        route.requiresAuth && 
        route.group === 'dashboard'
    );

export const getUserMenuRoutes = (): Route[] => 
    Object.values(routes).filter(route => 
        route.requiresAuth && 
        route.group === 'user'
    );

export const getAdminMenuRoutes = (): Route[] => 
    Object.values(routes).filter(route => 
        route.requiresAuth && 
        route.requiresAdmin && 
        route.group === 'admin'
    ); 