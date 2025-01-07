import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

// Helper function to determine model type and context length
function getModelInfo(modelId) {
    const modelId_lower = modelId.toLowerCase();
    let type = 'Unknown';
    let context_length = null;
    let training_data = null;
    let status = 'Active';

    // GPT-4 models
    if (modelId_lower.includes('gpt-4')) {
        type = 'Chat Completion';
        if (modelId_lower.includes('32k')) {
            context_length = 32768;
        } else if (modelId_lower.includes('preview')) {
            context_length = 128000;
        } else {
            context_length = 8192;
        }
        training_data = 'Up to 2023';
        if (modelId_lower.includes('0314')) {
            training_data = 'Up to Sep 2021';
            status = 'Deprecated';
        }
    }
    // GPT-3.5 models
    else if (modelId_lower.includes('gpt-3.5')) {
        type = 'Chat Completion';
        if (modelId_lower.includes('16k')) {
            context_length = 16384;
        } else {
            context_length = 4096;
        }
        training_data = 'Up to Sep 2021';
    }
    // Text embedding models
    else if (modelId_lower.includes('embedding')) {
        type = 'Embedding';
        context_length = 8191;
        if (modelId_lower.includes('3-')) {
            training_data = 'Up to 2023';
        } else {
            training_data = 'Up to 2021';
        }
    }
    // Image models
    else if (modelId_lower.includes('dall-e')) {
        type = 'Image Generation';
        context_length = null;
        if (modelId_lower.includes('3')) {
            training_data = 'Up to 2023';
        } else {
            training_data = 'Up to 2022';
        }
    }
    // Whisper models
    else if (modelId_lower.includes('whisper')) {
        type = 'Speech to Text';
        context_length = null;
        training_data = 'Up to 2021';
    }
    // TTS models
    else if (modelId_lower.includes('tts')) {
        type = 'Text to Speech';
        context_length = null;
        training_data = 'Up to 2023';
    }
    // Moderation models
    else if (modelId_lower.includes('moderation')) {
        type = 'Moderation';
        context_length = null;
        training_data = 'Up to 2023';
    }

    return { type, context_length, training_data, status };
}

export async function GET() {
    console.log('Starting OpenAI models request...');
    console.log('API Key present:', !!process.env.OPENAI_API_KEY);

    try {
        // Read models from the public data file
        const filePath = path.join(process.cwd(), 'public', 'data', 'openai-models.json');
        const data = await fs.readFile(filePath, 'utf8');
        const fileData = JSON.parse(data);
        const rawModels = fileData.models || fileData; // Handle both new and old format
        
        // Format models with additional information
        const formattedModels = rawModels.map(model => {
            const { type, context_length, training_data, status } = getModelInfo(model.id);
            return {
                id: model.id,
                created: model.created,
                owned_by: model.owned_by,
                type,
                context_length,
                training_data,
                status
            };
        });

        return NextResponse.json({
            success: true,
            models: formattedModels,
            count: formattedModels.length,
            lastUpdated: fileData.lastUpdated
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