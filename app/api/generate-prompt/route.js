import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request) {
    try {
        const { category, type, sub_type } = await request.json();

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

        const generatedPrompt = completion.choices[0].message.content;

        return NextResponse.json({
            success: true,
            prompt: generatedPrompt
        });
    } catch (error) {
        console.error('Error generating prompt:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
} 