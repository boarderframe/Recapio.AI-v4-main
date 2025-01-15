import { ForwardRefExoticComponent, SVGProps, RefAttributes } from 'react';

// Icon type used in navigation items
export type IconType = ForwardRefExoticComponent<
  Omit<SVGProps<SVGSVGElement>, "ref"> & {
    title?: string;
    titleId?: string;
  } & RefAttributes<SVGSVGElement>
>;

// Single navigation link
export type NavLink = {
  type?: never;
  name: string;
  href: string;
  icon: IconType;
};

// Group of navigation links
export type NavGroup = {
  type: 'group';
  name: string;
  items: NavLink[];
};

// Navigation item (currently only groups)
export type NavigationItem = NavGroup;

// Props for navigation components
export interface NavigationProps {
  initialIsAdmin?: boolean;
} 