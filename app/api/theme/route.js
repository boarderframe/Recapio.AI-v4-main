import { NextResponse } from 'next/server';

const defaultThemeSettings = {
    spacing: {
        contentGap: 3,
        cardPadding: 3,
        headerSpacing: 2,
        sectionSpacing: 3,
        navHeight: 56,
        navToHeaderGap: 2,
        headerToToolbarGap: 2,
        toolbarToContentGap: 2
    },
    header: {
        titleSize: { xs: '1.75rem', md: '2rem' },
        titleWeight: 700,
        titleLineHeight: 1.2,
        subtitleSize: { xs: '0.95rem', md: '1rem' },
        subtitleWeight: 400,
        subtitleLineHeight: 1.4,
        underlineWidth: '40%',
        underlineOpacity: 0.3,
        maxWidth: '600px',
        borderRadius: 12,
        padding: 3,
    },
    content: {
        borderRadius: 12,
        padding: 3,
        maxWidth: '100%',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        borderColor: 'rgba(0, 0, 0, 0.08)'
    },
    navigation: {
        height: 56,
        borderRadius: 0,
    }
};

export async function GET() {
    return NextResponse.json(defaultThemeSettings);
}

export async function POST(request) {
    const body = await request.json();
    // In a real app, you would save this to a database
    return NextResponse.json(body);
} 