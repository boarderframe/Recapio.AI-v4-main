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

async function checkPrompts() {
    try {
        // Get all transcript types
        const { data: transcriptTypes, error: fetchError } = await supabase
            .from('transcript_types')
            .select('*')
            .order('category', { ascending: true })
            .order('type', { ascending: true })
            .order('sub_type', { ascending: true });

        if (fetchError) {
            console.error('Error fetching transcript types:', fetchError);
            return;
        }

        console.log(`Found ${transcriptTypes.length} total transcript types\n`);

        // Group by category and check prompts
        const byCategory = transcriptTypes.reduce((acc, type) => {
            if (!acc[type.category]) {
                acc[type.category] = {
                    missing: [],
                    notMatching: []
                };
            }

            // Find matching prompt in our JSON file
            const matchingPrompt = aiPromptsData.find(prompt => 
                prompt.category === type.category &&
                prompt.type === type.type &&
                prompt.sub_type === type.sub_type
            );

            if (!type.summary_prompt) {
                acc[type.category].missing.push({
                    type: type.type,
                    sub_type: type.sub_type,
                    id: type.id
                });
            } else if (matchingPrompt && type.summary_prompt !== matchingPrompt.ai_prompt) {
                acc[type.category].notMatching.push({
                    type: type.type,
                    sub_type: type.sub_type,
                    id: type.id
                });
            }
            return acc;
        }, {});

        // Print results
        let totalMissing = 0;
        let totalNotMatching = 0;

        for (const [category, status] of Object.entries(byCategory)) {
            if (status.missing.length > 0) {
                console.log(`\n${category} category - Missing ${status.missing.length} prompts:`);
                status.missing.forEach(item => {
                    console.log(`- ${item.type} - ${item.sub_type} (ID: ${item.id})`);
                    totalMissing++;
                });
            }
            if (status.notMatching.length > 0) {
                console.log(`\n${category} category - ${status.notMatching.length} prompts not matching AI-Prompts.json:`);
                status.notMatching.forEach(item => {
                    console.log(`- ${item.type} - ${item.sub_type} (ID: ${item.id})`);
                    totalNotMatching++;
                });
            }
        }

        console.log(`\nSummary:`);
        console.log(`- Total records missing prompts: ${totalMissing}`);
        console.log(`- Total records with non-matching prompts: ${totalNotMatching}`);
    } catch (err) {
        console.error('Error checking prompts:', err);
    }
}

// Run the check
checkPrompts(); 