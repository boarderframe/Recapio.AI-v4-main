import { createQuery } from '../utils/query-builder';
import { withErrorHandling } from '../utils/error-handling';
import { validateRequired, validateTypes, validateEnum, validateRange } from '../utils/validation';
import { withTenantIsolation, addTenantId, verifyTenantAccess } from '../utils/tenant-isolation';

// Constants
const SUBSCRIPTION_STATUS = ['active', 'canceled', 'expired', 'pending'];
const BILLING_CYCLES = ['monthly', 'yearly'];
const TIER_FEATURES = [
    'max_transcripts',
    'max_storage',
    'max_outputs',
    'allowed_output_types',
    'team_members',
    'api_rate_limit'
];

/**
 * Create service tier
 * @param {Object} data - Service tier data
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function createServiceTier(data, tenantId) {
    return withErrorHandling(async () => {
        // Validate required fields
        validateRequired(data, [
            'name',
            'description',
            'price',
            'features',
            'billing_cycle'
        ], 'Service Tier');

        // Validate types
        validateTypes(data, {
            name: 'string',
            description: 'string',
            price: 'number',
            features: 'object',
            billing_cycle: 'string',
            is_public: 'boolean'
        }, 'Service Tier');

        // Validate billing cycle
        validateEnum(data.billing_cycle, BILLING_CYCLES, 'billing_cycle', 'Service Tier');

        // Validate price
        validateRange(data.price, { min: 0 }, 'price', 'Service Tier');

        // Validate features
        Object.keys(data.features).forEach(feature => {
            if (!TIER_FEATURES.includes(feature)) {
                throw new Error(`Invalid feature: ${feature}`);
            }
        });

        // Add tenant ID and create service tier
        const tierData = addTenantId(data, tenantId);
        const { data: tier, error } = await createQuery('service_tiers')
            .getRawQuery()
            .insert(tierData)
            .select()
            .single();

        if (error) throw error;
        return tier;
    }, 'create', 'Service Tier');
}

/**
 * Get service tier
 * @param {string} id - Service tier ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function getServiceTier(id, tenantId) {
    return withErrorHandling(async () => {
        const { data: tier, error } = await withTenantIsolation(
            createQuery('service_tiers')
                .getRawQuery()
                .select()
                .eq('id', id),
            tenantId
        ).single();

        if (error) throw error;
        verifyTenantAccess(tier, tenantId, 'Service Tier');
        return tier;
    }, 'get', 'Service Tier');
}

/**
 * List service tiers
 * @param {Object} filters - Query filters
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function listServiceTiers(filters = {}, tenantId) {
    return withErrorHandling(async () => {
        let query = createQuery('service_tiers').select();

        // Apply filters
        if (filters.billing_cycle) {
            query = query.filter('billing_cycle', '=', filters.billing_cycle);
        }
        if (filters.is_public !== undefined) {
            query = query.filter('is_public', '=', filters.is_public);
        }
        if (filters.price_range) {
            if (filters.price_range.min !== undefined) {
                query = query.filter('price', '>=', filters.price_range.min);
            }
            if (filters.price_range.max !== undefined) {
                query = query.filter('price', '<=', filters.price_range.max);
            }
        }

        // Add tenant isolation
        query = withTenantIsolation(query.getRawQuery(), tenantId);

        // Add ordering
        query = query.orderBy('price', 'asc');

        return await query.execute();
    }, 'list', 'Service Tiers');
}

/**
 * Update service tier
 * @param {string} id - Service tier ID
 * @param {Object} data - Update data
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function updateServiceTier(id, data, tenantId) {
    return withErrorHandling(async () => {
        // Validate types if provided
        if (Object.keys(data).length > 0) {
            validateTypes(data, {
                name: 'string',
                description: 'string',
                price: 'number',
                features: 'object',
                billing_cycle: 'string',
                is_public: 'boolean'
            }, 'Service Tier');
        }

        // Validate billing cycle if provided
        if (data.billing_cycle) {
            validateEnum(data.billing_cycle, BILLING_CYCLES, 'billing_cycle', 'Service Tier');
        }

        // Validate price if provided
        if (data.price !== undefined) {
            validateRange(data.price, { min: 0 }, 'price', 'Service Tier');
        }

        // Validate features if provided
        if (data.features) {
            Object.keys(data.features).forEach(feature => {
                if (!TIER_FEATURES.includes(feature)) {
                    throw new Error(`Invalid feature: ${feature}`);
                }
            });
        }

        // Get existing tier
        const tier = await getServiceTier(id, tenantId);
        
        // Update tier
        const { data: updatedTier, error } = await withTenantIsolation(
            createQuery('service_tiers')
                .getRawQuery()
                .update(data)
                .eq('id', id),
            tenantId
        ).select().single();

        if (error) throw error;
        return updatedTier;
    }, 'update', 'Service Tier');
}

/**
 * Create user subscription
 * @param {Object} data - Subscription data
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function createUserSubscription(data, tenantId) {
    return withErrorHandling(async () => {
        // Validate required fields
        validateRequired(data, [
            'user_id',
            'tier_id',
            'status',
            'start_date'
        ], 'User Subscription');

        // Validate types
        validateTypes(data, {
            user_id: 'string',
            tier_id: 'string',
            status: 'string',
            start_date: 'string',
            end_date: 'string',
            metadata: 'object'
        }, 'User Subscription');

        // Validate status
        validateEnum(data.status, SUBSCRIPTION_STATUS, 'status', 'User Subscription');

        // Verify service tier exists and belongs to tenant
        await getServiceTier(data.tier_id, tenantId);

        // Add tenant ID and create subscription
        const subscriptionData = addTenantId(data, tenantId);
        const { data: subscription, error } = await createQuery('user_subscriptions')
            .getRawQuery()
            .insert(subscriptionData)
            .select()
            .single();

        if (error) throw error;
        return subscription;
    }, 'create', 'User Subscription');
}

/**
 * Get user subscription
 * @param {string} id - Subscription ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function getUserSubscription(id, tenantId) {
    return withErrorHandling(async () => {
        const { data: subscription, error } = await withTenantIsolation(
            createQuery('user_subscriptions')
                .getRawQuery()
                .select(`
                    *,
                    tier:service_tiers(*),
                    user:auth.users(id, email)
                `)
                .eq('id', id),
            tenantId
        ).single();

        if (error) throw error;
        verifyTenantAccess(subscription, tenantId, 'User Subscription');
        return subscription;
    }, 'get', 'User Subscription');
}

/**
 * Get user's active subscription
 * @param {string} userId - User ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function getUserActiveSubscription(userId, tenantId) {
    return withErrorHandling(async () => {
        const { data: subscription, error } = await withTenantIsolation(
            createQuery('user_subscriptions')
                .getRawQuery()
                .select(`
                    *,
                    tier:service_tiers(*)
                `)
                .eq('user_id', userId)
                .eq('status', 'active')
                .order('created_at', { ascending: false }),
            tenantId
        ).single();

        if (error) throw error;
        return subscription;
    }, 'get', 'User Subscription');
}

/**
 * List user subscriptions
 * @param {Object} filters - Query filters
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function listUserSubscriptions(filters = {}, tenantId) {
    return withErrorHandling(async () => {
        let query = createQuery('user_subscriptions')
            .select([
                '*',
                'tier:service_tiers(*)',
                'user:auth.users(id, email)'
            ]);

        // Apply filters
        if (filters.user_id) {
            query = query.filter('user_id', '=', filters.user_id);
        }
        if (filters.tier_id) {
            query = query.filter('tier_id', '=', filters.tier_id);
        }
        if (filters.status) {
            query = query.filter('status', '=', filters.status);
        }

        // Add tenant isolation
        query = withTenantIsolation(query.getRawQuery(), tenantId);

        // Add ordering
        query = query.orderBy('created_at', 'desc');

        return await query.execute();
    }, 'list', 'User Subscriptions');
}

/**
 * Update subscription status
 * @param {string} id - Subscription ID
 * @param {string} status - New status
 * @param {Object} metadata - Additional metadata
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function updateSubscriptionStatus(id, status, metadata = {}, tenantId) {
    return withErrorHandling(async () => {
        // Validate status
        validateEnum(status, SUBSCRIPTION_STATUS, 'status', 'User Subscription');

        // Get existing subscription
        const subscription = await getUserSubscription(id, tenantId);

        // Update status and metadata
        const updateData = {
            status,
            metadata: {
                ...subscription.metadata,
                ...metadata,
                status_updated_at: new Date().toISOString()
            }
        };

        const { data: updatedSubscription, error } = await withTenantIsolation(
            createQuery('user_subscriptions')
                .getRawQuery()
                .update(updateData)
                .eq('id', id),
            tenantId
        ).select().single();

        if (error) throw error;
        return updatedSubscription;
    }, 'update', 'User Subscription');
}

/**
 * Check if user has access to feature
 * @param {string} userId - User ID
 * @param {string} feature - Feature to check
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<boolean>}
 */
export async function checkFeatureAccess(userId, feature, tenantId) {
    return withErrorHandling(async () => {
        // Get user's active subscription
        const subscription = await getUserActiveSubscription(userId, tenantId);
        
        if (!subscription) {
            return false;
        }

        // Check if feature exists in tier features
        return !!subscription.tier.features[feature];
    }, 'check', 'Feature Access');
} 