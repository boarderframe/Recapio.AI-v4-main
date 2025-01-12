import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { appConfig } from '@/lib/config';
import { getAdminRoutes } from '@/lib/routes';

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard', '/settings', '/profile', '/transcripts'];
const adminOnlyRoutes = getAdminRoutes().map(route => route.path);
const publicRoutes = ['/login', '/signup', '/reset-password'];

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req: request, res });

  try {
    // Check if we have a session
    const { data: { session }, error } = await supabase.auth.getSession();

    // Handle rate limiting for API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit', appConfig.RATE_LIMIT_MAX_REQUESTS.toString());
      return response;
    }

    // Check if the route requires authentication
    const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));
    const isAdminRoute = adminOnlyRoutes.some(route => request.nextUrl.pathname.startsWith(route));
    const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route));

    // If no session and trying to access protected route, redirect to login
    if (!session && isProtectedRoute) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If session exists and trying to access public route, redirect to dashboard
    if (session && isPublicRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If trying to access admin route, check if user is admin
    if (isAdminRoute) {
      const isAdmin = session?.user?.app_metadata?.role === 'admin' || session?.user?.user_metadata?.role === 'admin';
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

// Configure which routes use this middleware
export const config = {
    matcher: [
        // Protected routes
        '/dashboard/:path*',
        '/settings/:path*',
        '/profile/:path*',
        '/admin/:path*',
        '/transcripts/:path*',
        '/billing/:path*',
        // Auth routes
        '/login',
        '/signup',
        '/forgot-password',
        '/reset-password',
        // API routes
        '/api/:path*'
    ]
}; 