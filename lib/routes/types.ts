import { IconType } from 'react-icons';

export interface Route {
  name: string;
  path: string;
  label: string;
  icon?: IconType;
  children?: Route[];
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
  group?: string;
  isVisible?: boolean;
}

export interface NavigationItem extends Route {
  isActive?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  path: string;
  isActive: boolean;
}

export type RouteGroup = 'marketing' | 'auth' | 'app' | 'user' | 'admin' | 'dashboard'; 