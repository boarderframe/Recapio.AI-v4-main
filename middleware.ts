import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });
  const { data: { session } } = await supabase.auth.getSession();

  // Check auth condition
  if (session?.user) {
    // If the user is signed in and tries to access auth pages, redirect to dashboard
    if (request.nextUrl.pathname.startsWith('/signin') || 
        request.nextUrl.pathname.startsWith('/signup')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // For admin routes, check if user has admin role
    if (request.nextUrl.pathname.startsWith('/admin')) {
      // First check user metadata
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user?.app_metadata?.role === 'admin' || user?.user_metadata?.role === 'admin') {
        return response;
      }
      
      // Then check user_roles table as backup
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (userRole?.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  } else {
    // If the user is not signed in and tries to access protected pages
    if (request.nextUrl.pathname.startsWith('/dashboard') || 
        request.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}; 