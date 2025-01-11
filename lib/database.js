import { supabase } from './supabase';

/**
 * Database health check
 * @returns {Promise<{isHealthy: boolean, message: string}>}
 */
export async function checkDatabaseHealth() {
    try {
        const { data, error } = await supabase
            .from('ai_providers')
            .select('count')
            .single();

        if (error) throw error;
        return { isHealthy: true, message: 'Database connection successful' };
    } catch (error) {
        return { 
            isHealthy: false, 
            message: `Database connection failed: ${error.message}` 
        };
    }
}

/**
 * Verify table existence and structure
 * @returns {Promise<{exists: boolean, missingTables: string[]}>}
 */
export async function verifyTables() {
    const requiredTables = [
        'ai_providers',
        'ai_models',
        'api_costs',
        'billing_records',
        'output_types',
        'output_files',
        'playlists',
        'playlist_items',
        'service_tiers',
        'user_subscriptions',
        'teams',
        'user_roles',
        'transcripts',
        'transcript_types',
        'user_credits',
        'user_model_preferences',
        'output_ai_constraints'
    ];

    const { data: tables, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

    if (error) {
        throw new Error(`Failed to fetch tables: ${error.message}`);
    }

    const existingTables = tables.map(t => t.table_name);
    const missingTables = requiredTables.filter(
        table => !existingTables.includes(table)
    );

    return {
        exists: missingTables.length === 0,
        missingTables
    };
}

/**
 * Get table structure
 * @param {string} tableName
 * @returns {Promise<Array>}
 */
export async function getTableStructure(tableName) {
    const { data, error } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_schema', 'public')
        .eq('table_name', tableName);

    if (error) {
        throw new Error(`Failed to fetch table structure: ${error.message}`);
    }

    return data;
}

/**
 * Verify foreign key constraints
 * @returns {Promise<Array>}
 */
export async function verifyForeignKeys() {
    const { data, error } = await supabase
        .from('information_schema.table_constraints')
        .select(`
            constraint_name,
            table_name,
            constraint_type
        `)
        .eq('table_schema', 'public')
        .eq('constraint_type', 'FOREIGN KEY');

    if (error) {
        throw new Error(`Failed to fetch foreign keys: ${error.message}`);
    }

    return data;
}

/**
 * Check if tenant isolation is properly configured
 * @returns {Promise<{isConfigured: boolean, tablesWithoutTenantId: string[]}>}
 */
export async function checkTenantIsolation() {
    const { data: tables, error } = await supabase
        .from('information_schema.columns')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('column_name', 'tenant_id');

    if (error) {
        throw new Error(`Failed to check tenant isolation: ${error.message}`);
    }

    const tablesWithTenantId = tables.map(t => t.table_name);
    const allTables = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

    const tablesWithoutTenantId = allTables.data
        .map(t => t.table_name)
        .filter(table => !tablesWithTenantId.includes(table));

    return {
        isConfigured: tablesWithoutTenantId.length === 0,
        tablesWithoutTenantId
    };
} 