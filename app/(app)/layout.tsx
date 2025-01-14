import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { AppNavigation } from '@/components/layout/AppNavigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Logo from '@/components/Logo';

async function getUserRole(userId: string) {
  const supabase = createServerComponentClient({ cookies });
  
  // First check user metadata
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error('Error getting user:', userError);
    return 'User';
  }
  
  // Check if user has admin role in metadata
  if (user?.app_metadata?.role === 'admin' || user?.user_metadata?.role === 'admin') {
    return 'Admin';
  }
  
  // Then check user_roles table
  const { data: userRole, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();
  
  if (roleError) {
    console.error('Error checking role:', roleError);
    return 'User';
  }
  
  return userRole?.role?.charAt(0).toUpperCase() + userRole?.role?.slice(1) || 'User';
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user || error) {
    redirect('/signin');
  }

  const userRole = await getUserRole(user.id);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden w-64 flex-shrink-0 bg-white shadow-sm md:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 flex-shrink-0 items-center px-4">
            <Logo size="md" />
          </div>
          <AppNavigation />
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                  {user.email?.[0].toUpperCase()}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.email}</p>
                <p className="text-xs text-gray-500">{userRole}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="fixed inset-0 z-40 flex">
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
            <div className="flex h-16 flex-shrink-0 items-center px-4">
              <Logo size="md" />
            </div>
            <div className="h-0 flex-1 overflow-y-auto">
              <AppNavigation />
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
                  <p className="text-xs text-gray-500">{userRole}</p>
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
} 