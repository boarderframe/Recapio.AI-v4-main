import { NavigationItem } from '@/lib/routes/types';
import routes from '@/lib/routes/config';

// Marketing navigation items
export const marketingNavItems: NavigationItem[] = [
  { ...routes.features },
  { ...routes.pricing },
  { ...routes.about },
  { ...routes.contact }
];

// Dashboard navigation items
export const dashboardNavItems: NavigationItem[] = [
  { ...routes.dashboard },
  { ...routes.transcripts },
  { ...routes.settings }
];

// User menu items
export const userMenuItems: NavigationItem[] = [
  { ...routes.profile },
  { ...routes.account },
  { ...routes.billing }
];

// Admin menu items
export const adminMenuItems: NavigationItem[] = [
  { ...routes.admin },
  { ...routes.aiModels },
  { ...routes.users },
  { ...routes.theme },
  { ...routes.testing }
];

// Footer navigation items
export const footerNavItems: NavigationItem[] = [
  { ...routes.about },
  { ...routes.contact },
  { ...routes.pricing },
  { ...routes.features }
];

// Helper function to get active navigation item
export const getActiveNavItem = (items: NavigationItem[], currentPath: string): NavigationItem | undefined => {
  return items.find(item => item.path === currentPath);
};

// Helper function to filter visible navigation items
export const getVisibleNavItems = (items: NavigationItem[]): NavigationItem[] => {
  return items.filter(item => item.isVisible !== false);
};

// Helper function to check if navigation item is accessible
export const isNavItemAccessible = (item: NavigationItem, isAuthenticated: boolean, isAdmin: boolean): boolean => {
  if (item.requiresAuth && !isAuthenticated) return false;
  if (item.requiresAdmin && !isAdmin) return false;
  return true;
}; 