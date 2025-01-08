const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Read the JSON file
const transcriptTypesData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/transcriptTypes.json'), 'utf8')
);

// Log environment variables (without sensitive data)
console.log('Environment check:', {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing required environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupTranscriptTypes() {
    try {
        // Clear existing data
        console.log('Clearing existing data...');
        const { error: deleteError } = await supabase
            .from('transcript_types')
            .delete()
            .neq('id', 0);
        
        if (deleteError) {
            console.error('Error clearing data:', deleteError);
            return;
        }

        // Insert new data
        console.log('Inserting new data...');
        const records = [];

        transcriptTypesData[0].transcriptCategories.forEach(category => {
            category.transcriptTypes.forEach(type => {
                // Split the description into individual items
                const subTypes = type.description.split(', ');
                
                // Create a record for each sub_type
                subTypes.forEach(subType => {
                    records.push({
                        category: category.name,
                        category_color: category.color,
                        category_icon: category.icon,
                        type: type.type,
                        sub_type: subType.trim()
                    });
                });
            });
        });

        console.log('Prepared records:', records);

        // Insert records in batches of 50
        for (let i = 0; i < records.length; i += 50) {
            const batch = records.slice(i, i + 50);
            console.log(`Inserting batch ${i/50 + 1}...`);
            const { error: insertError } = await supabase
                .from('transcript_types')
                .insert(batch);

            if (insertError) {
                console.error('Error inserting batch:', insertError);
                return;
            }
        }

        console.log('Successfully populated transcript_types table');
        console.log(`Total records inserted: ${records.length}`);

    } catch (error) {
        console.error('Error in setupTranscriptTypes:', error);
    }
}

setupTranscriptTypes(); 