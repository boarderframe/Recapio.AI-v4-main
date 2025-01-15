'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/utils';
import {
  HomeIcon,
  DocumentTextIcon,
  FolderIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
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

const baseNavigation: NavigationItem[] = [
  {
    type: 'group',
    name: 'Main',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      { name: 'Transcripts', href: '/transcripts', icon: DocumentTextIcon },
      { name: 'Library', href: '/library', icon: FolderIcon },
    ],
  },
  {
    type: 'group',
    name: 'Analytics',
    items: [
      { name: 'Reporting', href: '/reporting', icon: ChartBarIcon },
    ],
  },
  {
    type: 'group',
    name: 'Account',
    items: [
      { name: 'Profile', href: '/profile', icon: UserCircleIcon },
      { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
    ],
  },
];

type AppNavigationProps = {
  initialIsAdmin?: boolean;
};

const adminNav: NavGroup = {
  type: 'group' as const,
  name: 'Admin',
  items: [
    { name: 'Console', href: '/admin/console', icon: CommandLineIcon },
  ],
};

export function AppNavigation({ initialIsAdmin = false }: AppNavigationProps) {
  const pathname = usePathname() || '';
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);
  const [navigation, setNavigation] = useState<NavigationItem[]>(
    initialIsAdmin ? [...baseNavigation, adminNav] : baseNavigation
  );

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('User error:', userError);
          return;
        }

        // Check if user is admin via metadata or roles
        const isAdminUser = 
          user.app_metadata?.role === 'admin' || 
          user.user_metadata?.role === 'admin';

        if (isAdminUser) {
          setIsAdmin(true);
          setNavigation([...baseNavigation, adminNav]);
        } else {
          // Check user_roles table as backup
          const { data: userRole, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

          if (!roleError && userRole?.role === 'admin') {
            setIsAdmin(true);
            setNavigation([...baseNavigation, adminNav]);
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    }

    if (!initialIsAdmin) {
      checkAdminStatus();
    }
  }, [initialIsAdmin]);

  return (
    <nav className="flex-1 space-y-6 px-2 py-4">
      {navigation.map((group) => (
        <div key={group.name}>
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