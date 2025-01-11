import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables are required');
    process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Table descriptions
const TABLE_DESCRIPTIONS = {
    ai_models: 'Stores information about AI models available in the system',
    ai_providers: 'Stores information about AI service providers (e.g., OpenAI, Anthropic)',
    api_costs: 'Tracks API usage costs for each model interaction',
    billing_records: 'Records all billing transactions in the system',
    output_ai_constraints: 'Defines constraints and prompts for AI model outputs',
    output_files: 'Stores generated output files from transcripts',
    output_pricing: 'Defines credit costs for different output types',
    output_queue: 'Manages the queue of outputs to be generated',
    output_types: 'Defines different types of outputs that can be generated',
    playlist_items: 'Stores items within playlists',
    playlists: 'Manages collections of outputs',
    service_tiers: 'Defines different service tiers available',
    teams: 'Manages team information',
    transcript_types: 'Defines different types of transcripts',
    transcripts: 'Stores transcript content and metadata',
    user_credits: 'Tracks user credit balances',
    user_model_preferences: 'Stores user preferences for AI models',
    user_roles: 'Defines user roles in the system',
    user_subscriptions: 'Tracks user subscriptions to service tiers'
};

async function fetchTableStructure(tableName, supabaseUrl, supabaseKey) {
    try {
        // Get OpenAPI spec
        const response = await fetch(
            `${supabaseUrl}/rest/v1/`,
            {
                method: 'GET',
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        const openApiSpec = await response.json();
        const tableDefinition = openApiSpec.definitions[tableName];

        if (!tableDefinition) {
            console.error(`Table ${tableName} not found in OpenAPI spec`);
            return null;
        }

        // Process columns from OpenAPI spec
        const columns = Object.entries(tableDefinition.properties).map(([name, schema]) => {
            const description = schema.description || '';
            const isPrimaryKey = description.includes('<pk/>');
            const isNotNull = description.includes('<not null>');
            const isIdentity = description.includes('<identity>');
            const foreignKeyMatch = description.match(/<fk table='([^']+)' column='([^']+)'\/>/);
            const defaultMatch = description.match(/default: ([^<]+)/);
            const typeMatch = description.match(/type: ([^<]+)/);

            // Extract length/precision from format or type
            let length = null;
            let precision = null;
            let scale = null;
            if (schema.format === 'character varying' && schema.maxLength) {
                length = schema.maxLength;
            } else if (schema.type === 'number' && schema.format === 'numeric') {
                precision = schema.maximum ? Math.floor(Math.log10(schema.maximum)) + 1 : null;
                scale = schema.multipleOf ? -Math.floor(Math.log10(schema.multipleOf)) : null;
            }

            return {
                name,
                type: typeMatch ? typeMatch[1].trim() : (schema.format || schema.type || 'unknown'),
                length,
                precision,
                scale,
                nullable: !isNotNull,
                default: defaultMatch ? defaultMatch[1].trim() : (schema.default || null),
                is_identity: isIdentity ? 'YES' : '',
                isPrimaryKey,
                description: description
                    .replace(/<[^>]+>/g, '')
                    .replace(/Note:\s*/, '')
                    .trim() || '-',
                position: null,
                check_constraints: []
            };
        });

        // Process relationships from column descriptions
        const relationships = columns
            .map(col => {
                const foreignKeyMatch = col.description.match(/Foreign Key to `([^`]+)\.([^`]+)`/);
                if (foreignKeyMatch) {
                    const [_, targetTable, targetColumn] = foreignKeyMatch;
                    return {
                        type: 'FOREIGN KEY',
                        sourceColumn: col.name,
                        targetTable,
                        targetColumn,
                        onDelete: 'NO ACTION',
                        onUpdate: 'NO ACTION',
                        deferrable: false,
                        deferred: false
                    };
                }
                return null;
            })
            .filter(rel => rel !== null);

        // Add primary key relationships
        columns
            .filter(col => col.isPrimaryKey)
            .forEach(col => {
                relationships.push({
                    type: 'PRIMARY KEY',
                    sourceColumn: col.name,
                    targetTable: tableName,
                    targetColumn: col.name,
                    onDelete: 'NO ACTION',
                    onUpdate: 'NO ACTION',
                    deferrable: false,
                    deferred: false
                });
            });

        return {
            name: tableName,
            description: TABLE_DESCRIPTIONS[tableName] || '',
            columns: columns.sort((a, b) => {
                // Sort primary keys first, then by name
                if (a.isPrimaryKey && !b.isPrimaryKey) return -1;
                if (!a.isPrimaryKey && b.isPrimaryKey) return 1;
                return a.name.localeCompare(b.name);
            }),
            relationships,
            indexes: [],
            triggers: [],
            security_policies: []
        };
    } catch (error) {
        console.error(`Error fetching structure for table ${tableName}:`, error);
        return null;
    }
}

async function fetchCompleteSchema() {
    console.log('Fetching complete database schema...');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase configuration. Please check your .env file.');
        process.exit(1);
    }

    try {
        // Get list of tables from OpenAPI spec
        console.log('Fetching tables from OpenAPI spec...');
        const response = await fetch(
            `${supabaseUrl}/rest/v1/`,
            {
                method: 'GET',
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        const openApiSpec = await response.json();
        const tables = Object.keys(openApiSpec.definitions);

        // Fetch structure for each table
        const schema = {
            lastUpdated: new Date().toISOString(),
            tables: {}
        };

        for (const tableName of tables) {
            console.log(`Fetching structure for ${tableName}...`);
            const tableStructure = await fetchTableStructure(tableName, supabaseUrl, supabaseKey);
            if (tableStructure) {
                schema.tables[tableName] = tableStructure;
            }
        }

        return schema;
    } catch (error) {
        console.error('Error fetching complete schema:', error);
        process.exit(1);
    }
}

function generateMarkdown(schema) {
    let markdown = '# Database Schema Documentation\n\n';
    markdown += 'This document is automatically generated. Do not edit manually.\n\n';
    markdown += `Last Updated: ${schema.lastUpdated}\n\n`;
    
    // Add overview section
    markdown += '## Overview\n\n';
    markdown += `Total Tables: ${Object.keys(schema.tables).length}\n`;
    markdown += `Total Relationships: ${Object.values(schema.tables).reduce((acc, table) => acc + table.relationships.length, 0)}\n\n`;
    
    // Generate table of contents
    markdown += '## Tables\n\n';
    markdown += '### Table of Contents\n\n';
    for (const tableName of Object.keys(schema.tables).sort()) {
        markdown += `- [${tableName}](#${tableName.toLowerCase()})\n`;
    }
    markdown += '\n';

    // Generate detailed table information
    for (const [tableName, table] of Object.entries(schema.tables).sort()) {
        markdown += `### ${tableName}\n\n`;
        
        if (table.description) {
            markdown += `${table.description}\n\n`;
        }

        // Storage parameters
        if (table.storage && Object.keys(table.storage).length > 0) {
            markdown += '#### Storage Parameters\n\n';
            for (const [param, value] of Object.entries(table.storage)) {
                markdown += `- ${param}: ${value}\n`;
            }
            markdown += '\n';
        }

        // Partitioning info
        if (table.partitioning) {
            markdown += '#### Partitioning\n\n';
            markdown += `${table.partitioning}\n\n`;
        }

        // Inheritance info
        if (table.inheritance && table.inheritance.length > 0) {
            markdown += '#### Inheritance\n\n';
            markdown += 'Inherits from:\n';
            for (const parent of table.inheritance) {
                markdown += `- ${parent}\n`;
            }
            markdown += '\n';
        }

        // Columns
        markdown += '#### Columns\n\n';
        markdown += '| Name | Type | Length/Precision | Scale | Nullable | Default | Identity | Primary Key | Description |\n';
        markdown += '|------|------|-----------------|--------|----------|----------|-----------|-------------|-------------|\n';
        for (const column of table.columns.sort((a, b) => (a.position || 0) - (b.position || 0))) {
            const lengthPrecision = column.length || column.precision || '';
            markdown += `| ${column.name} | ${column.type} | ${lengthPrecision} | ${column.scale || ''} | ${column.nullable ? 'YES' : 'NO'} | ${column.default || ''} | ${column.is_identity} | ${column.isPrimaryKey ? '✓' : ''} | ${column.description || '-'} |\n`;
        }
        markdown += '\n';

        // Check constraints
        const columnsWithChecks = table.columns.filter(col => col.check_constraints && col.check_constraints.length > 0);
        if (columnsWithChecks.length > 0) {
            markdown += '#### Check Constraints\n\n';
            for (const column of columnsWithChecks) {
                for (const check of column.check_constraints) {
                    markdown += `- Column \`${column.name}\`: ${check.definition}\n`;
                }
            }
            markdown += '\n';
        }

        // Indexes
        if (table.indexes && table.indexes.length > 0) {
            markdown += '#### Indexes\n\n';
            markdown += '| Name | Columns | Type | Unique | Definition |\n';
            markdown += '|------|---------|------|---------|------------|\n';
            for (const index of table.indexes) {
                markdown += `| ${index.name} | ${index.columns.join(', ')} | ${index.type} | ${index.isUnique ? '✓' : ''} | ${index.definition} |\n`;
            }
            markdown += '\n';
        }

        // Triggers
        if (table.triggers && table.triggers.length > 0) {
            markdown += '#### Triggers\n\n';
            markdown += '| Name | Timing | Events | Definition |\n';
            markdown += '|------|---------|---------|------------|\n';
            for (const trigger of table.triggers) {
                markdown += `| ${trigger.name} | ${trigger.timing} | ${trigger.events.join(', ')} | ${trigger.definition} |\n`;
            }
            markdown += '\n';
        }

        // Security policies
        if (table.security_policies && table.security_policies.length > 0) {
            markdown += '#### Row Level Security Policies\n\n';
            markdown += '| Name | Command | Roles | Using | With Check |\n';
            markdown += '|------|---------|-------|-------|------------|\n';
            for (const policy of table.security_policies) {
                markdown += `| ${policy.policy_name} | ${policy.cmd} | ${policy.roles.join(', ')} | ${policy.qual || '-'} | ${policy.with_check || '-'} |\n`;
            }
            markdown += '\n';
        }

        // Relationships
        if (table.relationships?.length > 0) {
            markdown += '#### Relationships\n\n';
            markdown += '| Type | Column | References | On Delete | On Update | Deferrable |\n';
            markdown += '|------|---------|------------|------------|------------|------------|\n';
            for (const rel of table.relationships) {
                const deferrable = rel.deferrable ? (rel.deferred ? 'INITIALLY DEFERRED' : 'INITIALLY IMMEDIATE') : 'NO';
                markdown += `| ${rel.type} | ${rel.sourceColumn} | ${rel.targetTable}(${rel.targetColumn}) | ${rel.onDelete || '-'} | ${rel.onUpdate || '-'} | ${deferrable} |\n`;
            }
            markdown += '\n';
        }

        markdown += '---\n\n';
    }

    // Add relationships section
    markdown += '## All Relationships\n\n';
    markdown += '### Primary Keys\n\n';
    for (const [tableName, table] of Object.entries(schema.tables)) {
        const primaryKeys = table.relationships.filter(rel => rel.type === 'PRIMARY KEY');
        for (const pk of primaryKeys) {
            markdown += `- \`${tableName}\`: Primary key on column \`${pk.sourceColumn}\`\n`;
        }
    }
    markdown += '\n';

    markdown += '### Foreign Keys\n\n';
    for (const [tableName, table] of Object.entries(schema.tables)) {
        const foreignKeys = table.relationships.filter(rel => rel.type === 'FOREIGN KEY');
        for (const fk of foreignKeys) {
            markdown += `- \`${tableName}.${fk.sourceColumn}\` → \`${fk.targetTable}.${fk.targetColumn}\``;
            if (fk.onDelete !== 'NO ACTION' || fk.onUpdate !== 'NO ACTION') {
                markdown += ` (ON DELETE ${fk.onDelete}, ON UPDATE ${fk.onUpdate})`;
            }
            if (fk.deferrable) {
                markdown += ` [${fk.deferred ? 'DEFERRED' : 'IMMEDIATE'}]`;
            }
            markdown += '\n';
        }
    }
    markdown += '\n';

    return markdown;
}

async function main() {
    try {
        console.log('Fetching complete database schema...');
        
        // Fetch complete schema
        const schema = await fetchCompleteSchema();

        // Generate documentation
        const markdown = generateMarkdown(schema);

        // Save markdown
        const markdownPath = path.join(__dirname, '..', 'app_overview', 'database_schema.md');
        await fs.writeFile(markdownPath, markdown);

        // Save JSON
        const jsonPath = path.join(__dirname, '..', 'app_overview', 'database_schema.json');
        await fs.writeFile(jsonPath, JSON.stringify(schema, null, 2));

        console.log('Schema documentation generated successfully!');
        console.log(`Markdown saved to: ${markdownPath}`);
        console.log(`JSON saved to: ${jsonPath}`);
    } catch (error) {
        console.error('Error generating schema documentation:', error);
        process.exit(1);
    }
}

main(); 