import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET() {
    try {
        // Static list of Anthropic models with their capabilities
        const models = [
            {
                id: 'claude-3-opus-20240229',
                created: Math.floor(new Date('2024-02-29').getTime() / 1000),
                owned_by: 'anthropic',
                type: 'Chat Completion',
                context_length: 200000,
                training_data: 'Up to 2023',
                status: 'Active'
            },
            {
                id: 'claude-3-sonnet-20240229',
                created: Math.floor(new Date('2024-02-29').getTime() / 1000),
                owned_by: 'anthropic',
                type: 'Chat Completion',
                context_length: 200000,
                training_data: 'Up to 2023',
                status: 'Active'
            },
            {
                id: 'claude-3-haiku-20240307',
                created: Math.floor(new Date('2024-03-07').getTime() / 1000),
                owned_by: 'anthropic',
                type: 'Chat Completion',
                context_length: 200000,
                training_data: 'Up to 2023',
                status: 'Active'
            },
            {
                id: 'claude-2.1',
                created: Math.floor(new Date('2023-11-21').getTime() / 1000),
                owned_by: 'anthropic',
                type: 'Chat Completion',
                context_length: 200000,
                training_data: 'Up to early 2023',
                status: 'Active'
            },
            {
                id: 'claude-2.0',
                created: Math.floor(new Date('2023-07-11').getTime() / 1000),
                owned_by: 'anthropic',
                type: 'Chat Completion',
                context_length: 100000,
                training_data: 'Up to late 2022',
                status: 'Active'
            },
            {
                id: 'claude-instant-1.2',
                created: Math.floor(new Date('2023-03-14').getTime() / 1000),
                owned_by: 'anthropic',
                type: 'Chat Completion',
                context_length: 100000,
                training_data: 'Up to 2022',
                status: 'Deprecated'
            }
        ];

        // Read last updated timestamp from file if it exists
        let lastUpdated;
        try {
            const filePath = path.join(process.cwd(), 'public', 'data', 'anthropic-models.json');
            const data = await fs.readFile(filePath, 'utf8');
            const fileData = JSON.parse(data);
            lastUpdated = fileData.lastUpdated;
        } catch (error) {
            lastUpdated = new Date().toISOString();
        }

        return NextResponse.json({
            success: true,
            models: models,
            count: models.length,
            lastUpdated
        });
    } catch (error) {
        console.error('Error handling Anthropic models:', error);
        return NextResponse.json({ 
            success: false,
            error: error.message,
            errorType: error.name
        }, { status: 500 });
    }
} 