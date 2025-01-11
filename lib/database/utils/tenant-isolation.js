import { DatabaseError, ErrorCodes } from './error-handling';

/**
 * Get the current tenant ID from the session
 * @param {Object} session - The current session object
 * @returns {string}
 * @throws {DatabaseError}
 */
export function getCurrentTenantId(session) {
    if (!session?.user?.app_metadata?.tenant_id) {
        throw new DatabaseError(
            'No tenant ID found in session',
            ErrorCodes.PERMISSION
        );
    }
    return session.user.app_metadata.tenant_id;
}

/**
 * Add tenant isolation to a query
 * @param {Object} query - The Supabase query object
 * @param {string} tenantId - The tenant ID
 * @returns {Object}
 */
export function withTenantIsolation(query, tenantId) {
    return query.eq('tenant_id', tenantId);
}

/**
 * Add tenant ID to data object
 * @param {Object} data - The data object
 * @param {string} tenantId - The tenant ID
 * @returns {Object}
 */
export function addTenantId(data, tenantId) {
    return {
        ...data,
        tenant_id: tenantId
    };
}

/**
 * Verify tenant access
 * @param {Object} data - The data object
 * @param {string} tenantId - The tenant ID
 * @param {string} resource - Resource name for error messages
 * @throws {DatabaseError}
 */
export function verifyTenantAccess(data, tenantId, resource) {
    if (!data) {
        throw new DatabaseError(
            `${resource} not found`,
            ErrorCodes.NOT_FOUND
        );
    }

    if (data.tenant_id !== tenantId) {
        throw new DatabaseError(
            `Access denied to ${resource}`,
            ErrorCodes.PERMISSION
        );
    }
}

/**
 * Check if user has admin access in tenant
 * @param {Object} session - The current session object
 * @param {string} tenantId - The tenant ID
 * @returns {boolean}
 */
export function hasAdminAccess(session, tenantId) {
    return session?.user?.app_metadata?.roles?.includes('admin') &&
           session?.user?.app_metadata?.tenant_id === tenantId;
}

/**
 * Get user's role in tenant
 * @param {Object} session - The current session object
 * @param {string} tenantId - The tenant ID
 * @returns {string|null}
 */
export function getUserRole(session, tenantId) {
    if (session?.user?.app_metadata?.tenant_id !== tenantId) {
        return null;
    }
    return session?.user?.app_metadata?.roles?.[0] || null;
}

/**
 * Check if user has required role
 * @param {Object} session - The current session object
 * @param {string} tenantId - The tenant ID
 * @param {string[]} requiredRoles - Array of allowed roles
 * @returns {boolean}
 */
export function hasRole(session, tenantId, requiredRoles) {
    const userRole = getUserRole(session, tenantId);
    return userRole && requiredRoles.includes(userRole);
}

/**
 * Verify user has required role
 * @param {Object} session - The current session object
 * @param {string} tenantId - The tenant ID
 * @param {string[]} requiredRoles - Array of allowed roles
 * @param {string} resource - Resource name for error messages
 * @throws {DatabaseError}
 */
export function verifyRole(session, tenantId, requiredRoles, resource) {
    if (!hasRole(session, tenantId, requiredRoles)) {
        throw new DatabaseError(
            `Insufficient permissions for ${resource}`,
            ErrorCodes.PERMISSION
        );
    }
} 