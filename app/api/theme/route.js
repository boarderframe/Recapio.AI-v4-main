import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const THEME_FILE_PATH = path.join(process.cwd(), 'data', 'theme-settings.json');

// Ensure the data directory exists
async function ensureDataDirectory() {
    const dataDir = path.join(process.cwd(), 'data');
    try {
        await fs.access(dataDir);
    } catch {
        await fs.mkdir(dataDir, { recursive: true });
    }
}

// GET /api/theme
export async function GET() {
    try {
        await ensureDataDirectory();
        const themeData = await fs.readFile(THEME_FILE_PATH, 'utf-8');
        return NextResponse.json(JSON.parse(themeData));
    } catch (error) {
        if (error.code === 'ENOENT') {
            // If file doesn't exist, return default settings
            return NextResponse.json({});
        }
        console.error('Error reading theme settings:', error);
        return NextResponse.json({ error: 'Failed to load theme settings' }, { status: 500 });
    }
}

// POST /api/theme
export async function POST(request) {
    try {
        const themeSettings = await request.json();
        await ensureDataDirectory();
        await fs.writeFile(THEME_FILE_PATH, JSON.stringify(themeSettings, null, 2));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving theme settings:', error);
        return NextResponse.json({ error: 'Failed to save theme settings' }, { status: 500 });
    }
} 