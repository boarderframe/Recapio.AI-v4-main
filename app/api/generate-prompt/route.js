import OpenAI from 'openai';
import { NextResponse } from 'next/server';

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

export async function POST(request) {
    try {
        const { category, type, sub_type } = await request.json();

        if (!category || !type || !sub_type) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Generate analysis instructions
        const systemPrompt = `You are an expert AI prompt engineer specializing in creating detailed, context-aware prompts for transcript analysis and summarization.

Your task is to create clear, focused analysis instructions that will guide an AI model to analyze transcripts and generate insights.
The instructions should be specific to the transcript type while maintaining a consistent output structure.

Create instructions that:
1. Begin with "Analyze and summarize this {type} - {sub_type} transcript"
2. Include specific guidance about what to look for and analyze
3. Emphasize key aspects based on the category and type
4. Request comprehensive analysis while maintaining conciseness
5. Focus on extracting actionable insights

The instructions should be clear and direct, without including JSON structure or format specifications.`;

        const userPrompt = `Create analysis instructions for the following transcript type:

Category: ${category}
Type: ${type}
Sub-type: ${sub_type}

Generate focused analysis instructions that will help extract meaningful insights from this type of transcript.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });

        const analysis_instructions = completion.choices[0].message.content;

        // Return all components
        return NextResponse.json({
            analysis_instructions,
            json_schema: DEFAULT_JSON_SCHEMA,
            api_parameters: DEFAULT_API_PARAMETERS
        });

    } catch (error) {
        console.error('Error generating prompt:', error);
        return NextResponse.json(
            { error: 'Failed to generate prompt' },
            { status: 500 }
        );
    }
} 