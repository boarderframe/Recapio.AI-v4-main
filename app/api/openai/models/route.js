import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

export async function GET() {
    console.log('Starting OpenAI models request...');
    console.log('API Key present:', !!process.env.OPENAI_API_KEY);

    // Add timeout to the request
    const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout after 10s')), 10000)
    );

    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            timeout: 10000, // 10 second timeout
        });

        console.log('OpenAI client initialized, fetching models...');
        
        // Race between the API call and timeout
        const response = await Promise.race([
            openai.models.list(),
            timeoutPromise
        ]);

        console.log('Models fetched successfully');
        
        const formattedModels = response.data.map(model => ({
            id: model.id,
            created: model.created || 'N/A',
            owned_by: model.owned_by || 'N/A',
            permissions: model.permission || []
        }));

        return NextResponse.json({
            success: true,
            data: formattedModels,
            count: formattedModels.length
        });

    } catch (error) {
        console.error('OpenAI API Error:', {
            message: error.message,
            name: error.name,
            code: error.code,
            type: error.type
        });
        
        return NextResponse.json({ 
            success: false,
            error: error.message,
            errorType: error.name
        }, { status: error.status || 500 });
    }
} 