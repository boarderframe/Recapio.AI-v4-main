export interface Route {
    path: string;
    label: string;
    requiresAuth: boolean;
    requiresAdmin?: boolean;
    group: 'marketing' | 'auth' | 'app' | 'user' | 'admin';
    icon?: string;
}

export type RouteGroup = Route['group'];

export interface NavigationItem {
    route: Route;
    children?: NavigationItem[];
    isActive?: boolean;
} 