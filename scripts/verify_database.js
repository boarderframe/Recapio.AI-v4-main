import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

// Create Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkDatabaseHealth() {
    try {
        // Try to query any table to verify connection
        const { data, error } = await supabase
            .from('ai_providers')
            .select('*')
            .limit(1);

        if (error) throw error;
        return { isHealthy: true, message: 'Database connection successful' };
    } catch (error) {
        return { 
            isHealthy: false, 
            message: `Database connection failed: ${error.message}` 
        };
    }
}

async function verifyTables() {
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

    const existingTables = [];
    const missingTables = [];

    // Check each table individually
    for (const table of requiredTables) {
        try {
            const { error } = await supabase
                .from(table)
                .select('*')
                .limit(1);
            
            if (!error) {
                existingTables.push(table);
            } else {
                missingTables.push(table);
            }
        } catch (error) {
            missingTables.push(table);
        }
    }

    return {
        exists: missingTables.length === 0,
        missingTables,
        existingTables
    };
}

async function getTableStructure(tableName) {
    try {
        // Get a sample row to understand the structure
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .limit(1);

        if (error) throw error;

        // Convert the first row into structure information
        const structure = data && data[0] ? Object.keys(data[0]).map(column => ({
            column_name: column,
            data_type: typeof data[0][column],
            sample_value: data[0][column]
        })) : [];

        return structure;
    } catch (error) {
        console.error(`Error getting structure for ${tableName}:`, error.message);
        return null;
    }
}

async function verifyForeignKeys() {
    // Since we can't directly query foreign key information,
    // we'll list expected foreign key relationships
    const expectedForeignKeys = [
        { table: 'ai_models', references: 'ai_providers', key: 'provider_id' },
        { table: 'user_subscriptions', references: 'service_tiers', key: 'tier_id' },
        { table: 'playlist_items', references: 'playlists', key: 'playlist_id' },
        { table: 'playlist_items', references: 'output_files', key: 'output_file_id' }
    ];

    return expectedForeignKeys;
}

async function checkTenantIsolation() {
    const tables = await verifyTables();
    const tablesWithTenantId = [];
    const tablesWithoutTenantId = [];

    for (const table of tables.existingTables) {
        const structure = await getTableStructure(table);
        if (structure && structure.some(col => col.column_name === 'tenant_id')) {
            tablesWithTenantId.push(table);
        } else {
            tablesWithoutTenantId.push(table);
        }
    }

    return {
        isConfigured: tablesWithoutTenantId.length === 0,
        tablesWithTenantId,
        tablesWithoutTenantId
    };
}

async function verifyDatabaseSetup() {
    console.log('Starting database verification...\n');

    try {
        // 1. Check Database Health
        console.log('1. Checking database health...');
        const health = await checkDatabaseHealth();
        console.log(health.message);
        if (!health.isHealthy) {
            throw new Error('Database health check failed');
        }

        // 2. Verify Required Tables
        console.log('\n2. Verifying required tables...');
        const tables = await verifyTables();
        if (tables.exists) {
            console.log('All required tables exist');
            console.log('\nExisting tables:', tables.existingTables);
        } else {
            console.log('Missing tables:', tables.missingTables);
            if (tables.existingTables.length > 0) {
                console.log('\nExisting tables:', tables.existingTables);
            }
        }

        // 3. Check Table Structures
        console.log('\n3. Checking table structures...');
        for (const table of tables.existingTables) {
            const structure = await getTableStructure(table);
            if (structure && structure.length > 0) {
                console.log(`\nStructure for ${table}:`);
                console.table(structure);
            }
        }

        // 4. List Expected Foreign Keys
        console.log('\n4. Expected foreign key relationships:');
        const foreignKeys = await verifyForeignKeys();
        console.table(foreignKeys);

        // 5. Check Tenant Isolation
        console.log('\n5. Checking tenant isolation...');
        const tenantIsolation = await checkTenantIsolation();
        if (tenantIsolation.isConfigured) {
            console.log('Tenant isolation is properly configured');
            console.log('\nTables with tenant_id:', tenantIsolation.tablesWithTenantId);
        } else {
            console.log('Tables missing tenant_id:', tenantIsolation.tablesWithoutTenantId);
            if (tenantIsolation.tablesWithTenantId.length > 0) {
                console.log('\nTables with tenant_id:', tenantIsolation.tablesWithTenantId);
            }
        }

    } catch (error) {
        console.error('\nVerification failed:', error.message);
        process.exit(1);
    }
}

verifyDatabaseSetup(); 