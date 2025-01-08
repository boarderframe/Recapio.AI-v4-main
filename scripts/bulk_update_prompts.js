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

async function generatePrompt(category, type, sub_type) {
    const systemPrompt = `You are an AI prompt engineer creating concise prompts for transcript summarization.
Create brief, direct prompts that:
1. Start with "Summarize this {type} - {sub_type}"
2. Request a JSON response with standard fields (summary, key_points, action_items)
3. Include category-specific fields in category_specific_data
4. Keep the prompt under 3 lines
5. Focus on essential information only`;

    const userPrompt = `Create a concise summary prompt for:
Category: ${category}
Type: ${type}
Sub-type: ${sub_type}

Format: "Summarize this [type] - [sub-type]. [One sentence about focus]. Format the response as JSON with the following structure: { \"summary\": \"...\", \"key_points\": [...], \"action_items\": [...], \"category_specific_data\": {...} }"

The category_specific_data should include 2-3 fields most relevant to this type of transcript.`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        temperature: 0.5,
        max_tokens: 250
    });

    return completion.choices[0].message.content;
}

async function updatePrompts() {
    try {
        // Fetch all transcript types
        const { data: transcriptTypes, error: fetchError } = await supabase
            .from('transcript_types')
            .select('*')
            .order('category')
            .order('type')
            .order('sub_type');

        if (fetchError) {
            console.error('Error fetching transcript types:', fetchError);
            return;
        }

        console.log(`Found ${transcriptTypes.length} transcript types to update\n`);

        // Process each transcript type
        for (const [index, type] of transcriptTypes.entries()) {
            console.log(`Processing ${index + 1}/${transcriptTypes.length}: ${type.category} - ${type.type} - ${type.sub_type}`);
            
            try {
                // Generate new prompt
                const newPrompt = await generatePrompt(type.category, type.type, type.sub_type);
                
                // Update the record
                const { error: updateError } = await supabase
                    .from('transcript_types')
                    .update({ summary_prompt: newPrompt })
                    .eq('id', type.id);

                if (updateError) {
                    console.error(`Error updating prompt for ${type.category} - ${type.type} - ${type.sub_type}:`, updateError);
                    continue;
                }

                console.log(`✓ Successfully updated prompt for ${type.category} - ${type.type} - ${type.sub_type}\n`);
                
                // Add a small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`Error processing ${type.category} - ${type.type} - ${type.sub_type}:`, error);
            }
        }

        console.log('\nBulk update completed!');
    } catch (error) {
        console.error('Error in bulk update process:', error);
    }
}

// Run the update
updatePrompts(); 