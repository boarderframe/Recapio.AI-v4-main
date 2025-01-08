import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// Load the AI prompts data
const aiPromptsData = JSON.parse(
    readFileSync(join(__dirname, '../data/AI-Prompts.json'), 'utf8')
);

async function updatePromptsByCategory(category) {
    try {
        // Get all transcript types for the specified category
        const { data: transcriptTypes, error: fetchError } = await supabase
            .from('transcript_types')
            .select('*')
            .eq('category', category);

        if (fetchError) {
            console.error(`Error fetching ${category} transcript types:`, fetchError);
            return;
        }

        console.log(`\nProcessing ${category} category:`);
        console.log(`Found ${transcriptTypes.length} ${category} transcript types`);

        // Find matching prompts and update
        for (const transcriptType of transcriptTypes) {
            const matchingPrompt = aiPromptsData.find(prompt => 
                prompt.category === category &&
                prompt.type === transcriptType.type &&
                prompt.sub_type === transcriptType.sub_type
            );

            if (matchingPrompt) {
                console.log(`Updating prompt for ${transcriptType.type} - ${transcriptType.sub_type}`);
                
                const { error: updateError } = await supabase
                    .from('transcript_types')
                    .update({ summary_prompt: matchingPrompt.ai_prompt })
                    .eq('id', transcriptType.id);

                if (updateError) {
                    console.error(`Error updating ${transcriptType.type} - ${transcriptType.sub_type}:`, updateError);
                } else {
                    console.log(`Successfully updated ${transcriptType.type} - ${transcriptType.sub_type}`);
                }
            } else {
                console.log(`No matching prompt found for ${transcriptType.type} - ${transcriptType.sub_type}`);
            }
        }

        console.log(`${category} prompts update completed`);
    } catch (err) {
        console.error(`Error in update${category}Prompts:`, err);
    }
}

async function updateAllCategories() {
    // Get unique categories from the AI prompts data
    const categories = [...new Set(aiPromptsData.map(prompt => prompt.category))];
    console.log('Found categories:', categories);

    // Process each category
    for (const category of categories) {
        await updatePromptsByCategory(category);
    }

    console.log('\nAll categories have been processed');
}

// Run the update for all categories
updateAllCategories(); 