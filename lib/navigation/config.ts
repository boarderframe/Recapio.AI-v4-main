import { NavigationItem } from '../routes/types';
import { routes } from '../routes/config';

// Main navigation configuration
export const mainNavigation: NavigationItem[] = [
    { route: routes.features },
    { route: routes.pricing },
    { route: routes.about },
    { route: routes.contact }
];

// Dashboard navigation configuration
export const dashboardNavigation: NavigationItem[] = [
    { route: routes.dashboard },
    { route: routes.transcripts },
    { route: routes.settings }
];

// User menu navigation configuration
export const userMenuNavigation: NavigationItem[] = [
    { route: routes.profile },
    { route: routes.account },
    { route: routes.billing }
];

// Admin menu navigation configuration
export const adminMenuNavigation: NavigationItem[] = [
    { route: routes.admin },
    { route: routes.aiModels },
    { route: routes.users },
    { route: routes.theme },
    { route: routes.testing }
];

// Footer navigation configuration
export const footerNavigation: NavigationItem[] = [
    { route: routes.about },
    { route: routes.contact },
    { route: routes.pricing },
    { route: routes.features }
];

// Helper function to set active state based on current path
export const setActiveNavigationItems = (
    items: NavigationItem[],
    currentPath: string
): NavigationItem[] => {
    return items.map(item => ({
        ...item,
        isActive: item.route.path === currentPath,
        children: item.children 
            ? setActiveNavigationItems(item.children, currentPath)
            : undefined
    }));
};

// Helper function to filter navigation items based on user role
export const filterNavigationItemsByRole = (
    items: NavigationItem[],
    isAuthenticated: boolean,
    isAdmin: boolean
): NavigationItem[] => {
    return items.filter(item => {
        const { requiresAuth, requiresAdmin } = item.route;
        
        if (requiresAdmin && !isAdmin) return false;
        if (requiresAuth && !isAuthenticated) return false;
        
        return true;
    });
}; 