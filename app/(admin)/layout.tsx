'use client';

import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { AdminNavigation } from '@/components/layout/AdminNavigation';
import Logo from '@/components/Logo';

async function isAdmin(userId: string) {
  'use server';
  
  const supabase = createServerComponentClient({ cookies });
  
  try {
    // First check user metadata
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Error getting user:', userError);
      return false;
    }
    
    console.log('User metadata:', user?.app_metadata, user?.user_metadata);
    
    // Check if user has admin role in metadata
    if (user?.app_metadata?.role === 'admin' || user?.user_metadata?.role === 'admin') {
      return true;
    }
    
    // Then check user_roles table as backup
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
    
    console.log('Admin check result:', { userId, role: data?.role });
    return data?.role === 'admin';
  } catch (error) {
    console.error('Error in isAdmin check:', error);
    return false;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user || error) {
      console.error('No user or error:', error);
      redirect('/signin');
    }

    console.log('Current user:', user);
    const isUserAdmin = await isAdmin(user.id);
    console.log('Is user admin?', isUserAdmin);
    
    if (!isUserAdmin) {
      console.log('User is not admin, redirecting to dashboard');
      redirect('/dashboard');
    }

    return (
      <div className="flex h-screen bg-white">
        {/* Sidebar */}
        <div className="hidden w-64 flex-shrink-0 bg-white border-r border-gray-200 md:block">
          <div className="flex h-full flex-col">
            <div className="flex h-16 flex-shrink-0 items-center justify-center border-b border-gray-200 px-4">
              <Logo size="md" />
            </div>
            <AdminNavigation />
            <div className="flex-shrink-0 border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                    {user.email?.[0].toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user.email}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <div className="fixed inset-0 z-40 flex">
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
              <div className="flex h-16 flex-shrink-0 items-center justify-center border-b border-gray-200 px-4">
                <Logo size="md" />
              </div>
              <div className="h-0 flex-1 overflow-y-auto">
                <AdminNavigation />
              </div>
              <div className="flex-shrink-0 border-t border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                      {user.email?.[0].toUpperCase()}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">{user.email}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in AdminLayout:', error);
    redirect('/dashboard');
  }
} 