import { Route } from '../routes/types';

// Layout types
export type LayoutType = 'default' | 'marketing' | 'app' | 'admin' | 'auth';

// Layout configuration interface
export interface LayoutConfig {
    type: LayoutType;
    showHeader: boolean;
    showFooter: boolean;
    showSidebar: boolean;
    showUserMenu: boolean;
    showAdminMenu: boolean;
    showToolbar: boolean;
    maxWidth?: string;
    padding?: string;
}

// Default layout configurations
const defaultLayout: LayoutConfig = {
    type: 'default',
    showHeader: true,
    showFooter: true,
    showSidebar: false,
    showUserMenu: true,
    showAdminMenu: false,
    showToolbar: false,
    maxWidth: '1280px',
    padding: '1rem'
};

const marketingLayout: LayoutConfig = {
    type: 'marketing',
    showHeader: true,
    showFooter: true,
    showSidebar: false,
    showUserMenu: true,
    showAdminMenu: false,
    showToolbar: false,
    maxWidth: '1440px',
    padding: '2rem'
};

const appLayout: LayoutConfig = {
    type: 'app',
    showHeader: true,
    showFooter: false,
    showSidebar: true,
    showUserMenu: true,
    showAdminMenu: false,
    showToolbar: false,
    maxWidth: '100%',
    padding: '1.5rem'
};

const adminLayout: LayoutConfig = {
    type: 'admin',
    showHeader: true,
    showFooter: false,
    showSidebar: true,
    showUserMenu: true,
    showAdminMenu: true,
    showToolbar: true,
    maxWidth: '100%',
    padding: '1.5rem'
};

const authLayout: LayoutConfig = {
    type: 'auth',
    showHeader: false,
    showFooter: false,
    showSidebar: false,
    showUserMenu: false,
    showAdminMenu: false,
    showToolbar: false,
    maxWidth: '480px',
    padding: '2rem'
};

// Map of route groups to layout configurations
const layoutMap: Record<Route['group'], LayoutConfig> = {
    marketing: marketingLayout,
    auth: authLayout,
    app: appLayout,
    user: appLayout,
    admin: adminLayout
};

// Helper function to get layout configuration for a route
export const getLayoutConfig = (route: Route): LayoutConfig => {
    return layoutMap[route.group] || defaultLayout;
};

// Helper function to get layout type for a route
export const getLayoutType = (route: Route): LayoutType => {
    return getLayoutConfig(route).type;
};

// Helper function to check if a route should show specific layout elements
export const shouldShowLayoutElement = (
    route: Route,
    element: keyof Omit<LayoutConfig, 'type' | 'maxWidth' | 'padding'>
): boolean => {
    const config = getLayoutConfig(route);
    return config[element];
}; 