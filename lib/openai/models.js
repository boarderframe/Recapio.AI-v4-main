import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Path for the models cache file
const MODELS_CACHE_PATH = path.join(process.cwd(), 'data', 'openai-models.json');

/**
 * Fetches available models from OpenAI and caches them
 * @returns {Promise<Array>} Array of available models
 */
export async function fetchAndCacheModels() {
    try {
        console.log('Fetching models from OpenAI...');
        
        // List all models
        const models = await openai.models.list();
        console.log('Models fetched:', models.data.length);

        // Format the models data similar to Python example
        const formattedModels = models.data.map(model => ({
            id: model.id,
            created: model.created,
            owned_by: model.owned_by,
            permissions: model.permission || []
        }));

        // Ensure data directory exists
        await fs.mkdir(path.dirname(MODELS_CACHE_PATH), { recursive: true });

        // Cache the models with timestamp
        const cacheData = {
            timestamp: new Date().toISOString(),
            models: formattedModels
        };

        // Write to cache file
        await fs.writeFile(
            MODELS_CACHE_PATH,
            JSON.stringify(cacheData, null, 2),
            'utf8'
        );
        console.log('Models cached successfully');

        return formattedModels;
    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        throw error;
    }
}

/**
 * Reads cached models from file
 * @returns {Promise<Object>} Cached models data with timestamp
 */
export async function getCachedModels() {
    try {
        console.log('Attempting to read cached models...');
        const data = await fs.readFile(MODELS_CACHE_PATH, 'utf8');
        const parsed = JSON.parse(data);
        console.log('Cache read successfully');
        return parsed;
    } catch (error) {
        console.error('Cache read error:', error.message);
        return null;
    }
}

/**
 * Gets models, either from cache or fresh from API
 * @param {boolean} forceFresh - Whether to force a fresh fetch from API
 * @returns {Promise<Array>} Array of models
 */
export async function getModels(forceFresh = false) {
    console.log('Getting models, forceFresh:', forceFresh);
    
    if (!forceFresh) {
        const cached = await getCachedModels();
        if (cached) {
            // Check if cache is less than 24 hours old
            const cacheAge = new Date() - new Date(cached.timestamp);
            const cacheValid = cacheAge < 24 * 60 * 60 * 1000;
            console.log('Cache age (hours):', cacheAge / (60 * 60 * 1000));
            console.log('Cache valid:', cacheValid);
            
            if (cacheValid) {
                return cached.models;
            }
        }
    }
    
    console.log('Fetching fresh models...');
    return await fetchAndCacheModels();
} 