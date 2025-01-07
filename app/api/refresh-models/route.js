import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

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
    try {
        const response = await fetch('https://api.openai.com/v1/models', {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch models: ${response.statusText}`);
        }

        const data = await response.json();
        const models = data.data.map(model => {
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

        const filePath = path.join(process.cwd(), 'public', 'data', 'models.json');
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, JSON.stringify(models, null, 2), 'utf8');

        return NextResponse.json({ success: true, message: 'Models fetched and stored successfully.' });
    } catch (error) {
        console.error('Error fetching models:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
} 