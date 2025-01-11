import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';

interface RouteGuardProps {
    children: React.ReactNode;
    requiredRoles?: string[];
    requireAuth?: boolean;
}

export function RouteGuard({ 
    children, 
    requiredRoles = [], 
    requireAuth = true 
}: RouteGuardProps) {
    const router = useRouter();
    const { user, isLoading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        // Skip check if loading or on auth pages
        if (isLoading || router.pathname.startsWith('/auth/')) {
            return;
        }

        // Check authentication
        if (requireAuth && !user) {
            router.push('/auth/login');
            return;
        }

        // Check roles if specified
        if (requiredRoles.length > 0 && user) {
            const hasRequiredRole = requiredRoles.some(role => 
                user.user_metadata.roles.includes(role)
            );
            
            if (!hasRequiredRole) {
                router.push('/403'); // Forbidden page
                return;
            }
        }
    }, [user, isLoading, router, requiredRoles, requireAuth]);

    // Show nothing while loading
    if (isLoading) {
        return null;
    }

    // Show children if all checks pass
    return <>{children}</>;
} 