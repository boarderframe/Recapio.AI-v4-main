import { createQuery } from '../utils/query-builder';
import { withErrorHandling } from '../utils/error-handling';
import { validateRequired, validateTypes, validateEnum } from '../utils/validation';
import { withTenantIsolation, addTenantId, verifyTenantAccess } from '../utils/tenant-isolation';

// Constants
const AI_PROVIDER_TYPES = ['openai', 'anthropic', 'google', 'custom'];
const MODEL_TYPES = ['text', 'embedding', 'image', 'audio'];

/**
 * Create a new AI provider
 * @param {Object} data - Provider data
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function createAIProvider(data, tenantId) {
    return withErrorHandling(async () => {
        // Validate required fields
        validateRequired(data, ['name', 'type', 'api_key'], 'AI Provider');
        
        // Validate types
        validateTypes(data, {
            name: 'string',
            type: 'string',
            api_key: 'string'
        }, 'AI Provider');

        // Validate provider type
        validateEnum(data.type, AI_PROVIDER_TYPES, 'type', 'AI Provider');

        // Add tenant ID and create provider
        const providerData = addTenantId(data, tenantId);
        const { data: provider, error } = await createQuery('ai_providers')
            .getRawQuery()
            .insert(providerData)
            .select()
            .single();

        if (error) throw error;
        return provider;
    }, 'create', 'AI Provider');
}

/**
 * Get AI provider by ID
 * @param {string} id - Provider ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function getAIProvider(id, tenantId) {
    return withErrorHandling(async () => {
        const { data: provider, error } = await withTenantIsolation(
            createQuery('ai_providers')
                .getRawQuery()
                .select()
                .eq('id', id),
            tenantId
        ).single();

        if (error) throw error;
        verifyTenantAccess(provider, tenantId, 'AI Provider');
        return provider;
    }, 'get', 'AI Provider');
}

/**
 * List AI providers
 * @param {Object} filters - Query filters
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function listAIProviders(filters = {}, tenantId) {
    return withErrorHandling(async () => {
        let query = createQuery('ai_providers').select();

        // Apply filters
        if (filters.type) {
            query = query.filter('type', '=', filters.type);
        }
        if (filters.active !== undefined) {
            query = query.filter('is_active', '=', filters.active);
        }

        // Add tenant isolation
        query = withTenantIsolation(query.getRawQuery(), tenantId);

        return await query.execute();
    }, 'list', 'AI Providers');
}

/**
 * Update AI provider
 * @param {string} id - Provider ID
 * @param {Object} data - Update data
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function updateAIProvider(id, data, tenantId) {
    return withErrorHandling(async () => {
        // Validate types if provided
        if (Object.keys(data).length > 0) {
            validateTypes(data, {
                name: 'string',
                type: 'string',
                api_key: 'string',
                is_active: 'boolean'
            }, 'AI Provider');
        }

        // Validate provider type if provided
        if (data.type) {
            validateEnum(data.type, AI_PROVIDER_TYPES, 'type', 'AI Provider');
        }

        // Get existing provider
        const provider = await getAIProvider(id, tenantId);
        
        // Update provider
        const { data: updatedProvider, error } = await withTenantIsolation(
            createQuery('ai_providers')
                .getRawQuery()
                .update(data)
                .eq('id', id),
            tenantId
        ).select().single();

        if (error) throw error;
        return updatedProvider;
    }, 'update', 'AI Provider');
}

/**
 * Delete AI provider
 * @param {string} id - Provider ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<void>}
 */
export async function deleteAIProvider(id, tenantId) {
    return withErrorHandling(async () => {
        // Verify provider exists and belongs to tenant
        await getAIProvider(id, tenantId);

        const { error } = await withTenantIsolation(
            createQuery('ai_providers')
                .getRawQuery()
                .delete()
                .eq('id', id),
            tenantId
        );

        if (error) throw error;
    }, 'delete', 'AI Provider');
}

/**
 * Create AI model
 * @param {Object} data - Model data
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function createAIModel(data, tenantId) {
    return withErrorHandling(async () => {
        // Validate required fields
        validateRequired(data, [
            'name',
            'provider_id',
            'type',
            'max_tokens',
            'cost_per_token'
        ], 'AI Model');

        // Validate types
        validateTypes(data, {
            name: 'string',
            provider_id: 'string',
            type: 'string',
            max_tokens: 'number',
            cost_per_token: 'number'
        }, 'AI Model');

        // Validate model type
        validateEnum(data.type, MODEL_TYPES, 'type', 'AI Model');

        // Verify provider exists and belongs to tenant
        await getAIProvider(data.provider_id, tenantId);

        // Add tenant ID and create model
        const modelData = addTenantId(data, tenantId);
        const { data: model, error } = await createQuery('ai_models')
            .getRawQuery()
            .insert(modelData)
            .select()
            .single();

        if (error) throw error;
        return model;
    }, 'create', 'AI Model');
}

/**
 * Get AI model by ID
 * @param {string} id - Model ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function getAIModel(id, tenantId) {
    return withErrorHandling(async () => {
        const { data: model, error } = await withTenantIsolation(
            createQuery('ai_models')
                .getRawQuery()
                .select(`
                    *,
                    provider:ai_providers(*)
                `)
                .eq('id', id),
            tenantId
        ).single();

        if (error) throw error;
        verifyTenantAccess(model, tenantId, 'AI Model');
        return model;
    }, 'get', 'AI Model');
}

/**
 * List AI models
 * @param {Object} filters - Query filters
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function listAIModels(filters = {}, tenantId) {
    return withErrorHandling(async () => {
        let query = createQuery('ai_models')
            .select([
                '*',
                'provider:ai_providers(*)'
            ]);

        // Apply filters
        if (filters.provider_id) {
            query = query.filter('provider_id', '=', filters.provider_id);
        }
        if (filters.type) {
            query = query.filter('type', '=', filters.type);
        }
        if (filters.active !== undefined) {
            query = query.filter('is_active', '=', filters.active);
        }

        // Add tenant isolation
        query = withTenantIsolation(query.getRawQuery(), tenantId);

        return await query.execute();
    }, 'list', 'AI Models');
}

/**
 * Update AI model
 * @param {string} id - Model ID
 * @param {Object} data - Update data
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function updateAIModel(id, data, tenantId) {
    return withErrorHandling(async () => {
        // Validate types if provided
        if (Object.keys(data).length > 0) {
            validateTypes(data, {
                name: 'string',
                type: 'string',
                max_tokens: 'number',
                cost_per_token: 'number',
                is_active: 'boolean'
            }, 'AI Model');
        }

        // Validate model type if provided
        if (data.type) {
            validateEnum(data.type, MODEL_TYPES, 'type', 'AI Model');
        }

        // Get existing model
        const model = await getAIModel(id, tenantId);
        
        // Update model
        const { data: updatedModel, error } = await withTenantIsolation(
            createQuery('ai_models')
                .getRawQuery()
                .update(data)
                .eq('id', id),
            tenantId
        ).select().single();

        if (error) throw error;
        return updatedModel;
    }, 'update', 'AI Model');
}

/**
 * Delete AI model
 * @param {string} id - Model ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<void>}
 */
export async function deleteAIModel(id, tenantId) {
    return withErrorHandling(async () => {
        // Verify model exists and belongs to tenant
        await getAIModel(id, tenantId);

        const { error } = await withTenantIsolation(
            createQuery('ai_models')
                .getRawQuery()
                .delete()
                .eq('id', id),
            tenantId
        );

        if (error) throw error;
    }, 'delete', 'AI Model');
} 