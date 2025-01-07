import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export const dynamic = 'force-dynamic'; // Disable caching for this route

export async function GET() {
    console.log('Starting Gemini models request...');
    try {
        // Try to read from the JSON file first
        let models;
        let lastUpdated;
        
        try {
            const filePath = path.join(process.cwd(), 'public', 'data', 'gemini-models.json');
            console.log('Attempting to read from:', filePath);
            const data = await fs.readFile(filePath, 'utf8');
            console.log('Successfully read file');
            const fileData = JSON.parse(data);
            models = fileData.models;
            lastUpdated = fileData.lastUpdated;
            console.log('Parsed data:', { modelCount: models.length, lastUpdated });
        } catch (error) {
            console.log('Error reading file:', error.message);
            console.log('Using default models');
            // If file doesn't exist or can't be read, use default models
            models = [
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
            lastUpdated = new Date().toISOString();

            // Save the default models to file
            const filePath = path.join(process.cwd(), 'public', 'data', 'gemini-models.json');
            console.log('Creating directory and saving default models to:', filePath);
            await fs.mkdir(path.dirname(filePath), { recursive: true });
            await fs.writeFile(filePath, JSON.stringify({
                models,
                lastUpdated,
                count: models.length
            }, null, 2), 'utf8');
            console.log('Successfully saved default models');
        }

        console.log('Sending response with', models.length, 'models');
        return NextResponse.json({
            success: true,
            models,
            count: models.length,
            lastUpdated
        });
    } catch (error) {
        console.error('Error handling Gemini models:', error);
        return NextResponse.json({ 
            success: false,
            error: error.message,
            errorType: error.name
        }, { status: 500 });
    }
} 