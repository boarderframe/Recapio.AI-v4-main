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
  Cog8ToothIcon,
} from '@heroicons/react/24/outline';
import { ForwardRefExoticComponent, SVGProps, RefAttributes } from 'react';

type IconType = ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & { title?: string; titleId?: string; } & RefAttributes<SVGSVGElement>>;

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
    name: 'Navigation',
    items: [
      { name: 'App', href: '/dashboard', icon: HomeIcon },
      { name: 'Public', href: '/', icon: GlobeAltIcon },
    ],
  },
  {
    type: 'group',
    name: 'Admin',
    items: [
      { name: 'Console', href: '/admin/console', icon: CommandLineIcon },
      { name: 'Debug', href: '/admin/debug', icon: BugAntIcon },
      { name: 'Testing', href: '/admin/testing', icon: BeakerIcon },
    ],
  },
];

export function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-6 px-2 py-4">
      {navigation.map((group) => (
        <div key={group.name}>
          <h3 className="px-3 text-xs font-semibold text-primary-100 uppercase tracking-wider">
            {group.name}
          </h3>
          <div className="mt-2 space-y-1">
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                    isActive
                      ? 'bg-primary-700 text-white'
                      : 'text-primary-100 hover:bg-primary-700/50 hover:text-white'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-white' : 'text-primary-200 group-hover:text-primary-50'
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