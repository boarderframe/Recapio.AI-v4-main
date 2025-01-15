import { cn } from '@/app/utils';

export const getNavigationStyles = {
  nav: "flex-1 space-y-6 px-2 py-4",
  header: "px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider",
  link: (isActive: boolean) =>
    cn(
      isActive
        ? 'bg-primary-100 text-primary-900'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
      'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
    ),
  icon: (isActive: boolean) =>
    cn(
      isActive
        ? 'text-primary-500'
        : 'text-gray-400 group-hover:text-gray-500',
      'mr-3 h-5 w-5 flex-shrink-0'
    ),
};

export const isLinkActive = (pathname: string, href: string) =>
  pathname === href || 
  (pathname.startsWith(href) && href !== '/dashboard') ||
  (href === '/dashboard' && pathname === '/'); 