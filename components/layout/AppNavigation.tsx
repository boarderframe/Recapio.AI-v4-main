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

const baseNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Transcripts', href: '/transcripts', icon: DocumentTextIcon },
  { name: 'Library', href: '/library', icon: FolderIcon },
  { name: 'Reporting', href: '/reporting', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  { name: 'Profile', href: '/profile', icon: UserCircleIcon },
];

export function AppNavigation() {
  const pathname = usePathname() || '';
  const [isAdmin, setIsAdmin] = useState(false);
  const [navigation, setNavigation] = useState(baseNavigation);

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('Current user:', user);
        
        if (userError) {
          console.error('User error:', userError);
          return;
        }
        
        if (user) {
          // Check metadata first
          console.log('User metadata:', user.app_metadata, user.user_metadata);
          if (user.app_metadata?.role === 'admin' || user.user_metadata?.role === 'admin') {
            console.log('User is admin via metadata');
            setIsAdmin(true);
            setNavigation([
              ...baseNavigation,
              { name: 'Admin', href: '/admin/console', icon: CommandLineIcon },
            ]);
            return;
          }
          
          // Check user_roles table as backup
          const { data: userRole, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();
          
          console.log('User role data:', userRole);
          
          if (roleError) {
            console.error('Role error:', roleError);
            return;
          }
          
          // Check if user has admin role
          if (userRole?.role === 'admin') {
            console.log('User is admin via user_roles table');
            setIsAdmin(true);
            setNavigation([
              ...baseNavigation,
              { name: 'Admin', href: '/admin/console', icon: CommandLineIcon },
            ]);
          } else {
            console.log('User is not admin, role:', userRole?.role);
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    }
    
    checkAdminStatus();
  }, []);

  return (
    <nav className="flex-1 space-y-1 px-2 py-4">
      {navigation.map((item) => {
        const isActive = pathname === item.href || 
                        (pathname.startsWith(item.href) && item.href !== '/dashboard') ||
                        (item.href === '/dashboard' && pathname === '/');
        
        // For debugging
        if (item.name === 'Admin') {
          console.log('Admin link:', {
            href: item.href,
            isActive,
            pathname,
            isAdmin,
          });
        }

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
                'mr-3 h-6 w-6 flex-shrink-0'
              )}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
} 