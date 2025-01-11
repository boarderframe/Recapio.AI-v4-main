import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const DEFAULT_JSON_SCHEMA = {
    type: "object",
    properties: {
        ai_title: {
            type: "string",
            description: "Descriptive, SEO-friendly title capturing the essence of the transcript (50-75 chars)"
        },
        summary: {
            type: "string",
            description: "Concise overview highlighting key points and main takeaways (200-300 chars)"
        },
        themes: {
            type: "array",
            items: { type: "string" },
            minItems: 3,
            maxItems: 7,
            description: "Main topics, concepts, and areas of discussion"
        },
        hashtags: {
            type: "array",
            items: { type: "string" },
            minItems: 5,
            maxItems: 10,
            description: "Relevant hashtags for social media and categorization"
        },
        sentiment_analysis: {
            type: "object",
            properties: {
                overall: {
                    type: "string",
                    description: "General sentiment (positive/negative/neutral) with confidence score"
                },
                sections: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            section: { type: "string" },
                            sentiment: { type: "string" },
                            confidence: { 
                                type: "number",
                                minimum: 0,
                                maximum: 1
                            }
                        },
                        required: ["section", "sentiment", "confidence"]
                    }
                }
            },
            required: ["overall", "sections"]
        },
        category_specific_data: {
            type: "object"
        }
    },
    required: ["ai_title", "summary", "themes", "hashtags", "sentiment_analysis"]
};

const DEFAULT_API_PARAMETERS = {
    model: "gpt-4",
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 0.95,
    frequency_penalty: 0.0,
    presence_penalty: 0.0
};

async function runMigration() {
    try {
        console.log('Starting migration...');

        // Update existing records with default values
        const { data: records, error: fetchError } = await supabase
            .from('transcript_types')
            .select('*');

        if (fetchError) {
            console.error('Error fetching records:', fetchError);
            return;
        }

        console.log(`Found ${records.length} records to update`);

        // Update records in batches
        const batchSize = 10;
        for (let i = 0; i < records.length; i += batchSize) {
            const batch = records.slice(i, i + batchSize);
            const updates = batch.map(record => ({
                id: record.id,
                analysis_instructions: record.summary_prompt || '',
                json_schema: DEFAULT_JSON_SCHEMA,
                api_parameters: DEFAULT_API_PARAMETERS
            }));

            const { error: updateError } = await supabase
                .from('transcript_types')
                .upsert(updates);

            if (updateError) {
                console.error('Error updating batch:', updateError);
                continue;
            }

            console.log(`Updated batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(records.length/batchSize)}`);
            
            // Add a small delay between batches
            if (i + batchSize < records.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        console.log('Migration completed successfully');

    } catch (error) {
        console.error('Migration failed:', error);
    }
}

// Run the migration
runMigration(); 