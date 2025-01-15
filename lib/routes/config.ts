import { Route } from './types';
import { MdDashboard, MdDescription, MdSettings, MdPerson, MdAccountCircle, MdPayment, MdAdminPanelSettings, MdPsychology, MdGroup, MdPalette, MdScience } from 'react-icons/md';

const routes: Record<string, Route> = {
  home: {
    path: '/',
    name: 'home',
    label: 'Home',
    requiresAuth: false,
    group: 'marketing'
  },
  pricing: {
    path: '/pricing',
    name: 'pricing',
    label: 'Pricing',
    requiresAuth: false,
    group: 'marketing'
  },
  features: {
    path: '/features',
    name: 'features',
    label: 'Features',
    requiresAuth: false,
    group: 'marketing'
  },
  about: {
    path: '/about',
    name: 'about',
    label: 'About',
    requiresAuth: false,
    group: 'marketing'
  },
  contact: {
    path: '/contact',
    name: 'contact',
    label: 'Contact',
    requiresAuth: false,
    group: 'marketing'
  },
  // Auth routes
  login: {
    path: '/login',
    name: 'login',
    label: 'Login',
    requiresAuth: false,
    group: 'auth'
  },
  signup: {
    path: '/signup',
    name: 'signup',
    label: 'Sign Up',
    requiresAuth: false,
    group: 'auth'
  },
  forgotPassword: {
    path: '/forgot-password',
    name: 'forgot-password',
    label: 'Forgot Password',
    requiresAuth: false,
    group: 'auth'
  },
  resetPassword: {
    path: '/reset-password',
    name: 'reset-password',
    label: 'Reset Password',
    requiresAuth: false,
    group: 'auth'
  },
  // App routes
  dashboard: {
    path: '/dashboard',
    name: 'dashboard',
    label: 'Dashboard',
    requiresAuth: true,
    group: 'app',
    icon: MdDashboard
  },
  transcripts: {
    path: '/transcripts',
    name: 'transcripts',
    label: 'Transcripts',
    requiresAuth: true,
    group: 'app',
    icon: MdDescription
  },
  settings: {
    path: '/settings',
    name: 'settings',
    label: 'Settings',
    requiresAuth: true,
    group: 'app',
    icon: MdSettings
  },
  // User routes
  profile: {
    path: '/profile',
    name: 'profile',
    label: 'Profile',
    requiresAuth: true,
    group: 'user',
    icon: MdPerson
  },
  account: {
    path: '/account',
    name: 'account',
    label: 'Account',
    requiresAuth: true,
    group: 'user',
    icon: MdAccountCircle
  },
  billing: {
    path: '/billing',
    name: 'billing',
    label: 'Billing',
    requiresAuth: true,
    group: 'user',
    icon: MdPayment
  },
  // Admin routes
  admin: {
    path: '/admin',
    name: 'admin',
    label: 'Admin',
    requiresAuth: true,
    requiresAdmin: true,
    group: 'admin',
    icon: MdAdminPanelSettings
  },
  aiModels: {
    path: '/admin/ai-models',
    name: 'ai-models',
    label: 'AI Models',
    requiresAuth: true,
    requiresAdmin: true,
    group: 'admin',
    icon: MdPsychology
  },
  users: {
    path: '/admin/users',
    name: 'users',
    label: 'Users',
    requiresAuth: true,
    requiresAdmin: true,
    group: 'admin',
    icon: MdGroup
  },
  theme: {
    path: '/admin/theme',
    name: 'theme',
    label: 'Theme',
    requiresAuth: true,
    requiresAdmin: true,
    group: 'admin',
    icon: MdPalette
  },
  testing: {
    path: '/testing',
    name: 'testing',
    label: 'Testing',
    requiresAuth: true,
    requiresAdmin: true,
    group: 'admin',
    icon: MdScience
  }
};

export default routes; 