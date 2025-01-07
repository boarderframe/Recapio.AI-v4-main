export interface TranscriptType {
    id: string;
    name: string;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    types: TranscriptType[];
}

export const categories: Category[] = [
    {
        id: 'documents',
        name: 'Documents',
        icon: 'Description',
        types: [
            { id: 'report', name: 'Reports' },
            { id: 'memo', name: 'Memos' },
            { id: 'document', name: 'Other Documents' }
        ]
    },
    {
        id: 'media',
        name: 'Media',
        icon: 'VideoLibrary',
        types: [
            { id: 'video', name: 'Video Recordings' },
            { id: 'audio', name: 'Audio Recordings' },
            { id: 'podcast', name: 'Podcasts' }
        ]
    },
    {
        id: 'presentations',
        name: 'Presentations',
        icon: 'Slideshow',
        types: [
            { id: 'meeting', name: 'Meeting Presentations' },
            { id: 'conference', name: 'Conference Talks' },
            { id: 'workshop', name: 'Workshop Sessions' }
        ]
    }
]; 