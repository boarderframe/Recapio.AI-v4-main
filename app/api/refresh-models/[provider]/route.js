import { NextResponse } from 'next/server';
import axios from 'axios';
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

async function refreshOpenAIModels() {
    console.log('Starting OpenAI models refresh...');
    try {
        const response = await axios.get('https://api.openai.com/v1/models', {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
        });
        console.log('OpenAI API response received:', {
            status: response.status,
            modelCount: response.data.data?.length
        });

        const models = response.data.data.map(model => {
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
        console.log('Processed OpenAI models:', models.length);
        return models;
    } catch (error) {
        console.error('Error in refreshOpenAIModels:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
}

async function refreshAnthropicModels() {
    console.log('Starting Anthropic models refresh...');
    try {
        const response = await axios.get('https://api.anthropic.com/v1/models', {
            headers: {
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            }
        });
        console.log('Anthropic API response received:', {
            status: response.status,
            modelCount: response.data.data?.length,
            data: response.data
        });

        // Map the API response to our model format
        const models = response.data.data
            // Filter to keep only the latest version of each model
            .filter(model => {
                // Keep Claude 3.5 latest versions
                if (model.id.includes('claude-3-5')) {
                    return model.display_name.includes('New') || model.id.includes('haiku');
                }
                // Keep Claude 3 base versions
                if (model.id.includes('claude-3-')) {
                    return true;
                }
                // Keep only Claude 2.1 (latest of Claude 2.x)
                if (model.id.includes('claude-2')) {
                    return model.id === 'claude-2.1';
                }
                return false;
            })
            .map(model => ({
                id: model.id,
                created: Math.floor(new Date(model.created_at).getTime() / 1000),
                owned_by: 'anthropic',
                type: model.type === 'model' ? 'Chat Completion' : model.type,
                context_length: 200000, // Default for Claude 3 models
                training_data: 'Up to 2023',
                status: 'Active',
                display_name: model.display_name
            }));

        console.log('Processed Anthropic models:', models.length);
        return models;
    } catch (error) {
        console.error('Error in refreshAnthropicModels:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            stack: error.stack
        });
        
        // Fallback to default models if API call fails
        console.log('Falling back to default Anthropic models...');
        return [
            {
                id: 'claude-3-opus-20240229',
                created: Math.floor(new Date('2024-02-29').getTime() / 1000),
                owned_by: 'anthropic',
                type: 'Chat Completion',
                context_length: 200000,
                training_data: 'Up to 2023',
                status: 'Active',
                display_name: 'Claude 3 Opus'
            },
            {
                id: 'claude-3-sonnet-20240229',
                created: Math.floor(new Date('2024-02-29').getTime() / 1000),
                owned_by: 'anthropic',
                type: 'Chat Completion',
                context_length: 200000,
                training_data: 'Up to 2023',
                status: 'Active',
                display_name: 'Claude 3 Sonnet'
            },
            {
                id: 'claude-3-haiku-20240307',
                created: Math.floor(new Date('2024-03-07').getTime() / 1000),
                owned_by: 'anthropic',
                type: 'Chat Completion',
                context_length: 200000,
                training_data: 'Up to 2023',
                status: 'Active',
                display_name: 'Claude 3 Haiku'
            }
        ];
    }
}

async function refreshGeminiModels() {
    console.log('Starting Gemini models refresh...');
    try {
        const response = await axios.get('https://generativelanguage.googleapis.com/v1/models', {
            headers: {
                'x-goog-api-key': process.env.GOOGLE_API_KEY,
            },
            params: {
                'key': process.env.GOOGLE_API_KEY
            }
        });
        console.log('Gemini API response received:', {
            status: response.status,
            modelCount: response.data.models?.length,
            data: response.data
        });

        const models = (response.data.models || [])
            .filter(model => model.name.includes('gemini'))
            .map(model => ({
                id: model.name.split('/').pop(),
                created: Math.floor(new Date("2023-12-13").getTime() / 1000), // Using launch date as creation time
                owned_by: "google",
                type: "Chat Completion",
                status: model.supportedGenerationMethods?.includes('generateContent') ? "Active" : "Limited",
                context_length: 32768, // Default context length as it's not provided in the API
                training_data: "Up to 2023"
            }));

        console.log('Processed Gemini models:', models.length);
        return models;
    } catch (error) {
        console.error('Error in refreshGeminiModels:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            stack: error.stack
        });
        
        // Fallback to default models if API call fails
        console.log('Falling back to default Gemini models...');
        return [
            {
                id: "gemini-pro",
                created: Math.floor(new Date("2023-12-13").getTime() / 1000),
                owned_by: "google",
                type: "Chat Completion",
                status: "Active",
                context_length: 32768,
                training_data: "Up to 2023"
            },
            {
                id: "gemini-pro-vision",
                created: Math.floor(new Date("2023-12-13").getTime() / 1000),
                owned_by: "google",
                type: "Chat Completion",
                status: "Active",
                context_length: 32768,
                training_data: "Up to 2023"
            }
        ];
    }
}

export async function POST(request, { params }) {
    const { provider } = params;
    
    try {
        let models;
        switch (provider) {
            case 'openai':
                models = await refreshOpenAIModels();
                break;
            case 'anthropic':
                models = await refreshAnthropicModels();
                break;
            case 'gemini':
                models = await refreshGeminiModels();
                break;
            default:
                throw new Error(`Unknown provider: ${provider}`);
        }

        // Save to provider-specific file
        const filePath = path.join(process.cwd(), 'public', 'data', `${provider}-models.json`);
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        const dataToSave = {
            models,
            lastUpdated: new Date().toISOString(),
            count: models.length
        };
        await fs.writeFile(filePath, JSON.stringify(dataToSave, null, 2), 'utf8');

        return NextResponse.json({
            success: true,
            message: `${provider} models refreshed successfully`,
            count: models.length,
            lastUpdated: dataToSave.lastUpdated
        });
    } catch (error) {
        console.error(`Error refreshing ${provider} models:`, error);
        return NextResponse.json({ 
            success: false,
            error: error.message
        }, { status: 500 });
    }
} 