export interface Route {
    path: string;
    label: string;
    icon?: string;
    requiresAuth: boolean;
    requiresAdmin?: boolean;
}

export const routes: Record<string, Route> = {
    // Public routes
    home: {
        path: '/',
        label: 'Home',
        requiresAuth: false
    },
    features: {
        path: '/features',
        label: 'Features',
        requiresAuth: false
    },
    pricing: {
        path: '/pricing',
        label: 'Pricing',
        requiresAuth: false
    },
    about: {
        path: '/about',
        label: 'About Us',
        requiresAuth: false
    },
    contact: {
        path: '/contact',
        label: 'Contact Us',
        requiresAuth: false
    },
    login: {
        path: '/login',
        label: 'Login',
        requiresAuth: false
    },
    signup: {
        path: '/signup',
        label: 'Sign Up',
        requiresAuth: false
    },

    // Protected routes
    dashboard: {
        path: '/dashboard',
        label: 'Dashboard',
        requiresAuth: true
    },
    newTranscript: {
        path: '/new-transcript',
        label: 'New Transcript',
        requiresAuth: true
    },
    transcripts: {
        path: '/transcripts',
        label: 'Transcript Library',
        requiresAuth: true
    },
    reporting: {
        path: '/reporting',
        label: 'Reporting',
        requiresAuth: true
    },
    settings: {
        path: '/settings',
        label: 'Settings',
        requiresAuth: true
    },
    profile: {
        path: '/profile',
        label: 'Profile',
        requiresAuth: true
    },
    account: {
        path: '/account',
        label: 'Account',
        requiresAuth: true
    },
    billing: {
        path: '/billing',
        label: 'Billing',
        requiresAuth: true
    },
    admin: {
        path: '/admin',
        label: 'Admin',
        requiresAuth: true,
        requiresAdmin: true
    },
    testing: {
        path: '/admin/testing',
        label: 'Testing',
        requiresAuth: true,
        requiresAdmin: true
    }
};

export const getPublicRoutes = (): Route[] => 
    Object.values(routes).filter(route => !route.requiresAuth);

export const getProtectedRoutes = (): Route[] => 
    Object.values(routes).filter(route => route.requiresAuth);

export const getAdminRoutes = (): Route[] =>
    Object.values(routes).filter(route => route.requiresAdmin);

export const getMainNavRoutes = (): Route[] => 
    Object.values(routes).filter(route => 
        !route.requiresAuth && 
        !['/login', '/signup'].includes(route.path)
    );

export const getAuthenticatedNavRoutes = (): Route[] => 
    Object.values(routes).filter(route => 
        route.requiresAuth && 
        !route.requiresAdmin &&
        !['/profile', '/account', '/billing'].includes(route.path)
    );

export const getUserMenuRoutes = (): Route[] => 
    Object.values(routes).filter(route => 
        (route.requiresAuth && ['/profile', '/account', '/billing'].includes(route.path)) ||
        (route.requiresAdmin && ['/admin', '/admin/testing'].includes(route.path))
    ); 