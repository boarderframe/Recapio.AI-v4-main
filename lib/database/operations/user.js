import { createQuery } from '../utils/query-builder';
import { withErrorHandling } from '../utils/error-handling';
import { validateRequired, validateTypes, validateEnum, validateRange } from '../utils/validation';
import { withTenantIsolation, addTenantId, verifyTenantAccess } from '../utils/tenant-isolation';

// Constants
const CREDIT_TYPES = ['subscription', 'purchase', 'bonus', 'refund'];
const CREDIT_STATUS = ['active', 'expired', 'used'];
const PREFERENCE_KEYS = [
    'default_language',
    'default_output_type',
    'notification_settings',
    'theme',
    'timezone',
    'date_format'
];

/**
 * Add user credits
 * @param {Object} data - Credit data
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function addUserCredits(data, tenantId) {
    return withErrorHandling(async () => {
        // Validate required fields
        validateRequired(data, [
            'user_id',
            'amount',
            'type',
            'status',
            'expiry_date'
        ], 'User Credits');

        // Validate types
        validateTypes(data, {
            user_id: 'string',
            amount: 'number',
            type: 'string',
            status: 'string',
            expiry_date: 'string',
            metadata: 'object'
        }, 'User Credits');

        // Validate enums
        validateEnum(data.type, CREDIT_TYPES, 'type', 'User Credits');
        validateEnum(data.status, CREDIT_STATUS, 'status', 'User Credits');

        // Validate amount
        validateRange(data.amount, { min: 0 }, 'amount', 'User Credits');

        // Add tenant ID and create credits
        const creditData = addTenantId(data, tenantId);
        const { data: credits, error } = await createQuery('user_credits')
            .getRawQuery()
            .insert(creditData)
            .select()
            .single();

        if (error) throw error;
        return credits;
    }, 'create', 'User Credits');
}

/**
 * Get user credits
 * @param {string} userId - User ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function getUserCredits(userId, tenantId) {
    return withErrorHandling(async () => {
        const { data: credits, error } = await withTenantIsolation(
            createQuery('user_credits')
                .getRawQuery()
                .select()
                .eq('user_id', userId)
                .eq('status', 'active')
                .gt('expiry_date', new Date().toISOString()),
            tenantId
        );

        if (error) throw error;
        return credits;
    }, 'get', 'User Credits');
}

/**
 * Get user credit balance
 * @param {string} userId - User ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<number>}
 */
export async function getUserCreditBalance(userId, tenantId) {
    return withErrorHandling(async () => {
        const credits = await getUserCredits(userId, tenantId);
        return credits.reduce((total, credit) => total + credit.amount, 0);
    }, 'get', 'User Credit Balance');
}

/**
 * Use user credits
 * @param {string} userId - User ID
 * @param {number} amount - Amount to use
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<void>}
 */
export async function useUserCredits(userId, amount, tenantId) {
    return withErrorHandling(async () => {
        // Validate amount
        validateRange(amount, { min: 0 }, 'amount', 'User Credits');

        // Get active credits
        const credits = await getUserCredits(userId, tenantId);
        let remainingAmount = amount;

        // Use credits starting from the earliest expiry date
        const sortedCredits = credits.sort((a, b) => 
            new Date(a.expiry_date) - new Date(b.expiry_date)
        );

        for (const credit of sortedCredits) {
            if (remainingAmount <= 0) break;

            const useAmount = Math.min(credit.amount, remainingAmount);
            const newAmount = credit.amount - useAmount;

            // Update credit
            const { error } = await withTenantIsolation(
                createQuery('user_credits')
                    .getRawQuery()
                    .update({
                        amount: newAmount,
                        status: newAmount === 0 ? 'used' : 'active',
                        metadata: {
                            ...credit.metadata,
                            last_used: new Date().toISOString()
                        }
                    })
                    .eq('id', credit.id),
                tenantId
            );

            if (error) throw error;
            remainingAmount -= useAmount;
        }

        if (remainingAmount > 0) {
            throw new Error('Insufficient credits');
        }
    }, 'use', 'User Credits');
}

/**
 * Get user preferences
 * @param {string} userId - User ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function getUserPreferences(userId, tenantId) {
    return withErrorHandling(async () => {
        const { data: preferences, error } = await withTenantIsolation(
            createQuery('user_preferences')
                .getRawQuery()
                .select()
                .eq('user_id', userId),
            tenantId
        ).single();

        if (error) throw error;
        return preferences?.settings || {};
    }, 'get', 'User Preferences');
}

/**
 * Update user preferences
 * @param {string} userId - User ID
 * @param {Object} settings - Preference settings
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function updateUserPreferences(userId, settings, tenantId) {
    return withErrorHandling(async () => {
        // Validate settings keys
        Object.keys(settings).forEach(key => {
            if (!PREFERENCE_KEYS.includes(key)) {
                throw new Error(`Invalid preference key: ${key}`);
            }
        });

        // Get existing preferences
        const { data: existing, error: getError } = await withTenantIsolation(
            createQuery('user_preferences')
                .getRawQuery()
                .select()
                .eq('user_id', userId),
            tenantId
        ).single();

        if (getError) throw getError;

        // Prepare update data
        const updateData = {
            user_id: userId,
            settings: {
                ...(existing?.settings || {}),
                ...settings
            },
            tenant_id: tenantId
        };

        // Update or insert preferences
        const { data: preferences, error } = await createQuery('user_preferences')
            .getRawQuery()
            .upsert(updateData)
            .select()
            .single();

        if (error) throw error;
        return preferences;
    }, 'update', 'User Preferences');
}

/**
 * Get user usage statistics
 * @param {string} userId - User ID
 * @param {Object} filters - Query filters
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function getUserUsageStats(userId, filters = {}, tenantId) {
    return withErrorHandling(async () => {
        // Build date range filter
        const startDate = filters.start_date || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const endDate = filters.end_date || new Date();

        // Get API costs
        const { data: apiCosts } = await withTenantIsolation(
            createQuery('api_costs')
                .getRawQuery()
                .select('type, sum(amount) as total_cost')
                .eq('user_id', userId)
                .gte('created_at', startDate.toISOString())
                .lte('created_at', endDate.toISOString())
                .group('type'),
            tenantId
        );

        // Get transcript counts
        const { data: transcripts } = await withTenantIsolation(
            createQuery('transcripts')
                .getRawQuery()
                .select('type, count(*) as count')
                .eq('user_id', userId)
                .gte('created_at', startDate.toISOString())
                .lte('created_at', endDate.toISOString())
                .group('type'),
            tenantId
        );

        // Get output counts
        const { data: outputs } = await withTenantIsolation(
            createQuery('output_files')
                .getRawQuery()
                .select('type_id, count(*) as count')
                .eq('user_id', userId)
                .gte('created_at', startDate.toISOString())
                .lte('created_at', endDate.toISOString())
                .group('type_id'),
            tenantId
        );

        return {
            api_costs: apiCosts || [],
            transcripts: transcripts || [],
            outputs: outputs || [],
            date_range: {
                start: startDate,
                end: endDate
            }
        };
    }, 'get', 'User Usage Stats');
} 