'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/utils';
import {
  CommandLineIcon,
  BugAntIcon,
  BeakerIcon,
  HomeIcon,
  GlobeAltIcon,
  UsersIcon,
  ShieldCheckIcon,
  CircleStackIcon,
} from '@heroicons/react/24/outline';
import { ForwardRefExoticComponent, SVGProps, RefAttributes } from 'react';

type IconType = ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & {
  title?: string;
  titleId?: string;
} & RefAttributes<SVGSVGElement>>;

type NavLink = {
  type?: never;
  name: string;
  href: string;
  icon: IconType;
};

type NavGroup = {
  type: 'group';
  name: string;
  items: NavLink[];
};

type NavigationItem = NavGroup;

const navigation: NavigationItem[] = [
  {
    type: 'group',
    name: 'Quick Access',
    items: [
      { name: 'App', href: '/dashboard', icon: HomeIcon },
      { name: 'Public', href: '/', icon: GlobeAltIcon },
    ],
  },
  {
    type: 'group',
    name: 'Management',
    items: [
      { name: 'Users', href: '/admin/users', icon: UsersIcon },
      { name: 'Roles', href: '/admin/roles', icon: ShieldCheckIcon },
      { name: 'Database', href: '/admin/database', icon: CircleStackIcon },
    ],
  },
  {
    type: 'group',
    name: 'Development',
    items: [
      { name: 'Console', href: '/admin/console', icon: CommandLineIcon },
      { name: 'Debug', href: '/admin/debug', icon: BugAntIcon },
      { name: 'Testing', href: '/admin/testing', icon: BeakerIcon },
    ],
  },
];

export function AdminNavigation() {
  const pathname = usePathname() || '';

  return (
    <nav className="flex-1 space-y-6 px-2 py-4">
      {navigation.map((group) => (
        <div key={group.name} className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {group.name}
          </h3>
          <div className="mt-2 space-y-1">
            {group.items.map((item) => {
              const isActive = pathname === item.href || 
                             (pathname.startsWith(item.href) && item.href !== '/dashboard') ||
                             (item.href === '/dashboard' && pathname === '/');
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    isActive
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive
                        ? 'text-primary-500'
                        : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 h-5 w-5 flex-shrink-0'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
} 