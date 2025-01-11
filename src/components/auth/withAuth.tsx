import { ComponentType } from 'react';
import { RouteGuard } from './RouteGuard';

interface WithAuthOptions {
    requiredRoles?: string[];
    requireAuth?: boolean;
}

export function withAuth<P extends object>(
    WrappedComponent: ComponentType<P>,
    options: WithAuthOptions = {}
) {
    const { requiredRoles, requireAuth = true } = options;

    function WithAuthWrapper(props: P) {
        return (
            <RouteGuard requiredRoles={requiredRoles} requireAuth={requireAuth}>
                <WrappedComponent {...props} />
            </RouteGuard>
        );
    }

    // Set display name for debugging
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    WithAuthWrapper.displayName = `withAuth(${displayName})`;

    return WithAuthWrapper;
} 