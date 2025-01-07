import { useMemo } from 'react';
import transcriptConfig from '../config/transcriptTypes.json';
import type { 
    TranscriptType, 
    TranscriptConfig, 
    TranscriptCategory 
} from '../types/transcript';

export function useTranscriptConfig() {
    const config = useMemo(() => transcriptConfig as TranscriptConfig, []);

    const getTypeConfig = (type: TranscriptType) => {
        return config.types[type] || {
            ...config.default.type,
            label: type.charAt(0).toUpperCase() + type.slice(1),
            category: 'business' as TranscriptCategory,
            description: 'No description available'
        };
    };

    const getCategoryConfig = (category: TranscriptCategory) => {
        return config.categories[category];
    };

    const getTypeColor = (type: TranscriptType) => {
        return getTypeConfig(type).color;
    };

    const getTypeIcon = (type: TranscriptType) => {
        return getTypeConfig(type).icon;
    };

    const getTypesByCategory = (category: TranscriptCategory) => {
        return Object.entries(config.types)
            .filter(([_, typeConfig]) => typeConfig.category === category)
            .map(([type]) => type as TranscriptType);
    };

    const getAllCategories = () => {
        return Object.keys(config.categories) as TranscriptCategory[];
    };

    return {
        config,
        getTypeConfig,
        getCategoryConfig,
        getTypeColor,
        getTypeIcon,
        getTypesByCategory,
        getAllCategories
    };
} 