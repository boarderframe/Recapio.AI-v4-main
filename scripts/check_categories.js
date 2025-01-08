import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing required environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCategories() {
    try {
        // Get all transcript types
        const { data: transcriptTypes, error: fetchError } = await supabase
            .from('transcript_types')
            .select('category')
            .order('category', { ascending: true });

        if (fetchError) {
            console.error('Error fetching transcript types:', fetchError);
            return;
        }

        // Get unique categories
        const categories = [...new Set(transcriptTypes.map(t => t.category))];
        console.log('Categories in database:', categories);

        // Count records per category
        const categoryCounts = transcriptTypes.reduce((acc, type) => {
            acc[type.category] = (acc[type.category] || 0) + 1;
            return acc;
        }, {});

        console.log('\nRecords per category:');
        Object.entries(categoryCounts).forEach(([category, count]) => {
            console.log(`${category}: ${count} records`);
        });

    } catch (err) {
        console.error('Error checking categories:', err);
    }
}

// Run the check
checkCategories(); 