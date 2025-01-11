import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

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

async function main() {
    try {
        // Read the SQL file
        const sqlPath = path.join(__dirname, 'create_rpc_functions.sql');
        const sql = await fs.readFile(sqlPath, 'utf-8');

        // Execute the SQL
        const { data, error } = await supabase.rpc('exec_sql', { sql });

        if (error) {
            throw error;
        }

        console.log('RPC functions created successfully!');
    } catch (error) {
        console.error('Error creating RPC functions:', error);
        process.exit(1);
    }
}

main(); 