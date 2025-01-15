import type { RouteGroup } from '@/lib/routes/types';

export interface LayoutConfig {
  showHeader: boolean;
  showFooter: boolean;
  showSidebar: boolean;
  showBreadcrumbs: boolean;
  maxWidth?: string | false;
  padding?: number | string;
}

const layoutMap: Record<RouteGroup, LayoutConfig> = {
  marketing: {
    showHeader: true,
    showFooter: true,
    showSidebar: false,
    showBreadcrumbs: false,
    maxWidth: false,
    padding: 0,
  },
  auth: {
    showHeader: false,
    showFooter: false,
    showSidebar: false,
    showBreadcrumbs: false,
    maxWidth: '400px',
    padding: 4,
  },
  app: {
    showHeader: true,
    showFooter: false,
    showSidebar: true,
    showBreadcrumbs: true,
    maxWidth: false,
    padding: 3,
  },
  user: {
    showHeader: true,
    showFooter: false,
    showSidebar: true,
    showBreadcrumbs: true,
    maxWidth: '800px',
    padding: 3,
  },
  admin: {
    showHeader: true,
    showFooter: false,
    showSidebar: true,
    showBreadcrumbs: true,
    maxWidth: false,
    padding: 3,
  },
  dashboard: {
    showHeader: true,
    showFooter: false,
    showSidebar: true,
    showBreadcrumbs: true,
    maxWidth: false,
    padding: 3,
  },
};

export const getLayoutConfig = (group: RouteGroup): LayoutConfig => {
  return layoutMap[group] || layoutMap.app;
}; 