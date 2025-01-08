const { createClient } = require('@supabase/supabase-js');
const transcriptTypesData = require('../data/transcriptTypes.json');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function populateTranscriptTypes() {
    try {
        // First, clear existing data
        const { error: deleteError } = await supabase
            .from('transcript_types')
            .delete()
            .neq('id', 0);

        if (deleteError) {
            console.error('Error clearing existing data:', deleteError);
            return;
        }

        console.log('Existing data cleared successfully');

        // Insert new data
        for (const category of transcriptTypesData[0].transcriptCategories) {
            for (const type of category.transcriptTypes) {
                // Split the description into an array of sub-types
                const subTypes = type.description.split(',').map(st => st.trim());
                
                const { error } = await supabase
                    .from('transcript_types')
                    .insert({
                        category: category.name,
                        type: type.type,
                        sub_types: subTypes,  // Store as array
                        color: category.color,
                        icon: category.icon
                    });

                if (error) {
                    console.error(`Error inserting ${category.name} - ${type.type}:`, error);
                } else {
                    console.log(`Successfully inserted ${category.name} - ${type.type}`);
                }
            }
        }

        console.log('Data population completed');
    } catch (err) {
        console.error('Error in population script:', err);
    }
}

// Run the population script
populateTranscriptTypes(); 