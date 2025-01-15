import type { Route } from '@/lib/routes/types';

// Public routes
export const publicRoutes: Route[] = [
  {
    name: 'home',
    path: '/',
    label: 'Home',
    group: 'marketing'
  },
  {
    name: 'features',
    path: '/features',
    label: 'Features',
    group: 'marketing'
  },
  {
    name: 'pricing',
    path: '/pricing',
    label: 'Pricing',
    group: 'marketing'
  },
  {
    name: 'about',
    path: '/about',
    label: 'About',
    group: 'marketing'
  },
  {
    name: 'contact',
    path: '/contact',
    label: 'Contact',
    group: 'marketing'
  },
  {
    name: 'login',
    path: '/login',
    label: 'Login',
    group: 'auth'
  },
  {
    name: 'signup',
    path: '/signup',
    label: 'Sign Up',
    group: 'auth'
  }
];

// Filter public routes for main navigation (excluding auth pages)
export const mainNavigation = publicRoutes.filter(route => route.group === 'marketing');

// Protected routes (require authentication)
export const protectedRoutes: Route[] = [
  {
    name: 'dashboard',
    path: '/dashboard',
    label: 'Dashboard',
    requiresAuth: true,
    group: 'dashboard'
  },
  {
    name: 'transcripts',
    path: '/transcripts',
    label: 'Transcripts',
    requiresAuth: true,
    group: 'app'
  },
  {
    name: 'new-transcript',
    path: '/transcripts/new',
    label: 'New Transcript',
    requiresAuth: true,
    group: 'app'
  },
  {
    name: 'reporting',
    path: '/reporting',
    label: 'Reporting',
    requiresAuth: true,
    group: 'app'
  },
  {
    name: 'settings',
    path: '/settings',
    label: 'Settings',
    requiresAuth: true,
    group: 'user',
    children: [
      {
        name: 'profile',
        path: '/settings/profile',
        label: 'Profile',
        requiresAuth: true,
        group: 'user'
      },
      {
        name: 'account',
        path: '/settings/account',
        label: 'Account',
        requiresAuth: true,
        group: 'user'
      },
      {
        name: 'billing',
        path: '/settings/billing',
        label: 'Billing',
        requiresAuth: true,
        group: 'user'
      },
    ],
  },
];

// Admin routes
export const adminRoutes: Route[] = [
  {
    name: 'admin',
    path: '/admin',
    label: 'Admin',
    requiresAuth: true,
    requiresAdmin: true,
    group: 'admin'
  },
  {
    name: 'admin-users',
    path: '/admin/users',
    label: 'Users',
    requiresAuth: true,
    requiresAdmin: true,
    group: 'admin'
  },
  {
    name: 'admin-settings',
    path: '/admin/settings',
    label: 'Settings',
    requiresAuth: true,
    requiresAdmin: true,
    group: 'admin'
  },
];

export const authenticatedNavigation = protectedRoutes.filter(route => !route.requiresAdmin);

export const userMenuNavigation = protectedRoutes.filter(route => route.group === 'user'); 