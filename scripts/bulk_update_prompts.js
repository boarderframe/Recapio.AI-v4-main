import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
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

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

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

async function generateAnalysisInstructions(transcriptTypes) {
    const systemPrompt = `You are an expert AI prompt engineer specializing in creating detailed, context-aware prompts for transcript analysis and summarization.

Your task is to create analysis instructions that will guide an AI model to analyze transcripts and generate insights.
Each instruction set should be specific to its transcript type.

For each transcript type in the provided list, create clear, focused instructions that:
1. Begin with "Analyze and summarize this {type} - {sub_type} transcript"
2. Include specific guidance about what to look for and analyze
3. Emphasize key aspects based on the category and type
4. Request comprehensive analysis while maintaining conciseness
5. Focus on extracting actionable insights

The instructions should be clear and direct, without including JSON structure or format specifications.`;

    const userPrompt = `Create analysis instructions for the following transcript types:

${transcriptTypes.map(type => `
Category: ${type.category}
Type: ${type.type}
Sub-type: ${type.sub_type}
---`).join('\n')}

For each transcript type, generate focused analysis instructions.
Return the results as a JSON array where each item has:
{
    "id": "transcript type ID",
    "instructions": "analysis instructions"
}`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        top_p: 0.95,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
    });

    try {
        const response = JSON.parse(completion.choices[0].message.content);
        return response;
    } catch (error) {
        console.error('Error parsing GPT response:', error);
        return null;
    }
}

async function updatePrompts() {
    try {
        console.log('Initializing bulk update process for Corporate category...');
        console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
        console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
        console.log('OpenAI Key exists:', !!process.env.OPENAI_API_KEY);

        // Fetch Corporate transcript types
        const { data: transcriptTypes, error: fetchError } = await supabase
            .from('transcript_types')
            .select('*')
            .eq('category', 'Corporate')
            .order('type')
            .order('sub_type');

        if (fetchError) {
            console.error('Error fetching transcript types:', fetchError);
            return;
        }

        if (!transcriptTypes || transcriptTypes.length === 0) {
            console.error('No Corporate transcript types found in the database');
            return;
        }

        console.log(`Found ${transcriptTypes.length} Corporate transcript types to update\n`);

        // Process in batches of 5
        const batchSize = 5;
        for (let i = 0; i < transcriptTypes.length; i += batchSize) {
            const batch = transcriptTypes.slice(i, i + batchSize);
            console.log(`\nProcessing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(transcriptTypes.length/batchSize)}`);
            
            try {
                // Generate analysis instructions for the batch
                console.log('Generating analysis instructions...');
                const instructions = await generateAnalysisInstructions(batch);
                
                if (!instructions) {
                    console.error('Failed to generate instructions for batch');
                    continue;
                }

                // Update records in bulk
                console.log('Updating records in Supabase...');
                const updates = instructions.map(item => ({
                    id: item.id,
                    analysis_instructions: item.instructions,
                    json_schema: DEFAULT_JSON_SCHEMA,
                    api_parameters: DEFAULT_API_PARAMETERS,
                    updated_at: new Date().toISOString()
                }));

                const { data: updateData, error: updateError } = await supabase
                    .from('transcript_types')
                    .upsert(updates)
                    .select();

                if (updateError) {
                    console.error('Error updating prompts:', updateError);
                    continue;
                }

                console.log(`✓ Successfully updated ${updateData.length} transcript types`);
                
                // Add a small delay between batches
                if (i + batchSize < transcriptTypes.length) {
                    console.log('Waiting 5 seconds before next batch...\n');
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            } catch (error) {
                console.error('Error processing batch:', error);
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

        console.log('\nBulk update completed for Corporate category!');
        
        // Verify updates
        console.log('\nVerifying Corporate updates...');
        const { data: verifyData, error: verifyError } = await supabase
            .from('transcript_types')
            .select('id, category, type, sub_type, analysis_instructions')
            .eq('category', 'Corporate')
            .is('analysis_instructions', null);

        if (verifyError) {
            console.error('Error verifying updates:', verifyError);
            return;
        }

        if (verifyData && verifyData.length > 0) {
            console.error(`Found ${verifyData.length} Corporate records with missing instructions:`, verifyData);
        } else {
            console.log('All Corporate records have been successfully updated with instructions');
        }

    } catch (error) {
        console.error('Error in bulk update process:', error);
    }
}

// Run the update
updatePrompts().then(() => {
    console.log('Script execution completed');
}).catch(error => {
    console.error('Script execution failed:', error);
}); 