import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const defaultsFilePath = path.join(process.cwd(), 'public', 'data', 'default-models.json');

export async function GET() {
    try {
        // Create directory if it doesn't exist
        await fs.mkdir(path.dirname(defaultsFilePath), { recursive: true });

        // Try to read the file
        let defaults = {};
        try {
            const fileContent = await fs.readFile(defaultsFilePath, 'utf8');
            defaults = JSON.parse(fileContent);
        } catch (error) {
            // If file doesn't exist or is invalid, return empty defaults
            console.log('No existing defaults found or invalid file');
        }

        return NextResponse.json({
            success: true,
            defaults
        });
    } catch (error) {
        console.error('Error reading default models:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to read default models'
        }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { defaults } = body;

        if (!defaults) {
            return NextResponse.json({
                success: false,
                error: 'No defaults provided'
            }, { status: 400 });
        }

        // Create directory if it doesn't exist
        await fs.mkdir(path.dirname(defaultsFilePath), { recursive: true });

        // Save the defaults
        await fs.writeFile(
            defaultsFilePath,
            JSON.stringify({
                ...defaults,
                lastUpdated: new Date().toISOString()
            }, null, 2),
            'utf8'
        );

        return NextResponse.json({
            success: true,
            message: 'Default models saved successfully'
        });
    } catch (error) {
        console.error('Error saving default models:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to save default models'
        }, { status: 500 });
    }
} 