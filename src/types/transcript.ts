export type TranscriptType = 'meeting' | 'lecture' | 'interview' | 'presentation' | 'workshop';
export type TranscriptCategory = 'business' | 'education';

export interface TranscriptTypeConfig {
    label: string;
    color: string;
    description: string;
    icon: string;
    category: TranscriptCategory;
}

export interface CategoryConfig {
    label: string;
    description: string;
    icon: string;
}

export interface DefaultConfig {
    type: {
        color: string;
        icon: string;
    };
}

export interface TranscriptConfig {
    types: Record<TranscriptType, TranscriptTypeConfig>;
    categories: Record<TranscriptCategory, CategoryConfig>;
    default: DefaultConfig;
}

export interface Transcript {
    id: string;
    title: string;
    type: TranscriptType;
    date: string;
    summary?: string;
    isFavorite: boolean;
    category?: TranscriptCategory;
} 