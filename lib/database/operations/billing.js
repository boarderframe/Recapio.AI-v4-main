import { createQuery } from '../utils/query-builder';
import { withErrorHandling } from '../utils/error-handling';
import { validateRequired, validateTypes, validateEnum, validateRange } from '../utils/validation';
import { withTenantIsolation, addTenantId, verifyTenantAccess } from '../utils/tenant-isolation';

// Constants
const COST_TYPES = ['api_call', 'storage', 'processing'];
const BILLING_STATUS = ['pending', 'completed', 'failed', 'refunded'];
const BILLING_TYPES = ['charge', 'credit', 'refund'];

/**
 * Track API cost
 * @param {Object} data - Cost data
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function trackAPICost(data, tenantId) {
    return withErrorHandling(async () => {
        // Validate required fields
        validateRequired(data, [
            'type',
            'amount',
            'user_id',
            'description'
        ], 'API Cost');

        // Validate types
        validateTypes(data, {
            type: 'string',
            amount: 'number',
            user_id: 'string',
            description: 'string'
        }, 'API Cost');

        // Validate cost type
        validateEnum(data.type, COST_TYPES, 'type', 'API Cost');

        // Validate amount
        validateRange(data.amount, { min: 0 }, 'amount', 'API Cost');

        // Add tenant ID and create cost record
        const costData = addTenantId(data, tenantId);
        const { data: cost, error } = await createQuery('api_costs')
            .getRawQuery()
            .insert(costData)
            .select()
            .single();

        if (error) throw error;
        return cost;
    }, 'create', 'API Cost');
}

/**
 * Get API costs
 * @param {Object} filters - Query filters
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function getAPICosts(filters = {}, tenantId) {
    return withErrorHandling(async () => {
        let query = createQuery('api_costs')
            .select([
                '*',
                'user:auth.users(id, email)'
            ]);

        // Apply filters
        if (filters.type) {
            query = query.filter('type', '=', filters.type);
        }
        if (filters.user_id) {
            query = query.filter('user_id', '=', filters.user_id);
        }
        if (filters.start_date) {
            query = query.filter('created_at', '>=', filters.start_date);
        }
        if (filters.end_date) {
            query = query.filter('created_at', '<=', filters.end_date);
        }

        // Add tenant isolation
        query = withTenantIsolation(query.getRawQuery(), tenantId);

        // Add ordering
        query = query.orderBy('created_at', 'desc');

        return await query.execute();
    }, 'list', 'API Costs');
}

/**
 * Create billing record
 * @param {Object} data - Billing data
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function createBillingRecord(data, tenantId) {
    return withErrorHandling(async () => {
        // Validate required fields
        validateRequired(data, [
            'type',
            'amount',
            'user_id',
            'status',
            'description'
        ], 'Billing Record');

        // Validate types
        validateTypes(data, {
            type: 'string',
            amount: 'number',
            user_id: 'string',
            status: 'string',
            description: 'string'
        }, 'Billing Record');

        // Validate enums
        validateEnum(data.type, BILLING_TYPES, 'type', 'Billing Record');
        validateEnum(data.status, BILLING_STATUS, 'status', 'Billing Record');

        // Validate amount
        validateRange(data.amount, { min: 0 }, 'amount', 'Billing Record');

        // Add tenant ID and create billing record
        const billingData = addTenantId(data, tenantId);
        const { data: record, error } = await createQuery('billing_records')
            .getRawQuery()
            .insert(billingData)
            .select()
            .single();

        if (error) throw error;
        return record;
    }, 'create', 'Billing Record');
}

/**
 * Get billing records
 * @param {Object} filters - Query filters
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function getBillingRecords(filters = {}, tenantId) {
    return withErrorHandling(async () => {
        let query = createQuery('billing_records')
            .select([
                '*',
                'user:auth.users(id, email)'
            ]);

        // Apply filters
        if (filters.type) {
            query = query.filter('type', '=', filters.type);
        }
        if (filters.status) {
            query = query.filter('status', '=', filters.status);
        }
        if (filters.user_id) {
            query = query.filter('user_id', '=', filters.user_id);
        }
        if (filters.start_date) {
            query = query.filter('created_at', '>=', filters.start_date);
        }
        if (filters.end_date) {
            query = query.filter('created_at', '<=', filters.end_date);
        }

        // Add tenant isolation
        query = withTenantIsolation(query.getRawQuery(), tenantId);

        // Add ordering
        query = query.orderBy('created_at', 'desc');

        return await query.execute();
    }, 'list', 'Billing Records');
}

/**
 * Update billing record status
 * @param {string} id - Record ID
 * @param {string} status - New status
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function updateBillingStatus(id, status, tenantId) {
    return withErrorHandling(async () => {
        // Validate status
        validateEnum(status, BILLING_STATUS, 'status', 'Billing Record');

        // Get existing record
        const { data: record, error: getError } = await withTenantIsolation(
            createQuery('billing_records')
                .getRawQuery()
                .select()
                .eq('id', id),
            tenantId
        ).single();

        if (getError) throw getError;
        verifyTenantAccess(record, tenantId, 'Billing Record');

        // Update status
        const { data: updatedRecord, error } = await withTenantIsolation(
            createQuery('billing_records')
                .getRawQuery()
                .update({ status })
                .eq('id', id),
            tenantId
        ).select().single();

        if (error) throw error;
        return updatedRecord;
    }, 'update', 'Billing Record');
}

/**
 * Get billing summary
 * @param {Object} filters - Query filters
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function getBillingSummary(filters = {}, tenantId) {
    return withErrorHandling(async () => {
        let query = `
            billing_summary:billing_records(
                total_amount:sum(amount),
                count:count(*),
                types:types:array_agg(distinct(type))
            )
        `;

        let baseQuery = createQuery('billing_records')
            .getRawQuery()
            .select(query);

        // Apply filters
        if (filters.start_date) {
            baseQuery = baseQuery.gte('created_at', filters.start_date);
        }
        if (filters.end_date) {
            baseQuery = baseQuery.lte('created_at', filters.end_date);
        }
        if (filters.user_id) {
            baseQuery = baseQuery.eq('user_id', filters.user_id);
        }

        // Add tenant isolation
        baseQuery = withTenantIsolation(baseQuery, tenantId);

        const { data, error } = await baseQuery.single();

        if (error) throw error;
        return data?.billing_summary || {
            total_amount: 0,
            count: 0,
            types: []
        };
    }, 'summary', 'Billing');
} 