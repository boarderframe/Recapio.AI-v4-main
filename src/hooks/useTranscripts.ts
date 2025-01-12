import { useQuery } from '@tanstack/react-query';
import { listTranscripts, getTranscript, searchTranscripts } from '../../lib/database/operations/transcript';
import { Transcript } from '../types/transcript';

export type { Transcript };

interface ApiResponse<T> {
    data: T[];
    error: Error | null;
    count: number | null;
}

interface QueryResponse<T> {
    data: T[];
    metadata: {
        total: number;
        returned: number;
        hasMore: boolean;
    };
}

interface TranscriptType {
    id: string;
    type: string;
    category: string;
    sub_type: string;
    category_color: string;
    category_icon: string;
}

interface TranscriptStats {
    total_count: number;
    completed_count: number;
    processing_count: number;
    failed_count: number;
    avg_processing_time: number;
}

export interface TranscriptFilters {
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
}

export interface PaginationOptions {
    page?: number;
    pageSize?: number;
    cursor?: string;
    cursorColumn?: string;
    ascending?: boolean;
}

function transformApiResponse<T>(response: ApiResponse<T>): QueryResponse<T> {
    return {
        data: response.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            type: item.type,
            date: item.created_at,
            summary: item.content,
            isFavorite: item.favorite || false,
            category: item.category
        })) as T[],
        metadata: {
            total: response.count || 0,
            returned: response.data.length,
            hasMore: (response.count || 0) > response.data.length
        }
    };
}

export function useTranscripts(filters: TranscriptFilters = {}, pagination: PaginationOptions = {}) {
    const mockTenantId = 'default-tenant'; // Mock tenant ID for development

    // Convert filters to query parameters
    const queryParams = {
        ...pagination,
        filters: {
            ...(filters.type && { type: filters.type }),
            ...(filters.status && { status: filters.status }),
            ...(filters.startDate && filters.endDate && {
                created_at: {
                    operator: 'rangeGte',
                    value: filters.startDate
                },
                end_date: {
                    operator: 'rangeLte',
                    value: filters.endDate
                }
            })
        }
    };

    // Fetch transcripts with type information
    const { data, isLoading, error } = useQuery<QueryResponse<Transcript & { transcript_types: TranscriptType }>>({
        queryKey: ['transcripts', filters, pagination],
        queryFn: async () => {
            const response = await listTranscripts(queryParams, mockTenantId);
            return transformApiResponse(response as ApiResponse<Transcript & { transcript_types: TranscriptType }>);
        }
    });

    // Search transcripts
    const { data: searchResults, isLoading: isSearching } = useQuery<QueryResponse<Transcript>>({
        queryKey: ['transcripts', 'search', filters.search],
        queryFn: async () => {
            if (!filters.search) throw new Error('Search query is required');
            const response = await searchTranscripts(filters.search, {
                limit: pagination.pageSize || 10
            }, mockTenantId);
            return transformApiResponse(response as ApiResponse<Transcript>);
        },
        enabled: !!filters.search
    });

    return {
        transcripts: data?.data || [],
        metadata: data?.metadata,
        searchResults: searchResults?.data || [],
        isLoading,
        isSearching,
        error
    };
}

export function useRecentTranscripts(limit = 5) {
    const mockTenantId = 'default-tenant'; // Mock tenant ID for development

    const { data, isLoading } = useQuery<QueryResponse<Transcript>>({
        queryKey: ['transcripts', 'recent', limit],
        queryFn: async () => {
            const response = await listTranscripts({ 
                limit,
                orderBy: { created_at: 'desc' }
            }, mockTenantId);
            return transformApiResponse(response as ApiResponse<Transcript>);
        }
    });

    return {
        recentTranscripts: data?.data || [],
        isLoading
    };
}

export function useTranscriptsByType(type: string, options: PaginationOptions = {}) {
    const mockTenantId = 'default-tenant'; // Mock tenant ID for development

    const { data, isLoading } = useQuery<QueryResponse<Transcript>>({
        queryKey: ['transcripts', 'byType', type, options],
        queryFn: async () => {
            const response = await listTranscripts({ 
                type,
                ...options
            }, mockTenantId);
            return transformApiResponse(response as ApiResponse<Transcript>);
        },
        enabled: !!type
    });

    return {
        transcripts: data?.data || [],
        metadata: data?.metadata,
        isLoading
    };
}

export function useTranscriptsByStatus(status: string, options: PaginationOptions = {}) {
    const mockTenantId = 'default-tenant'; // Mock tenant ID for development

    const { data, isLoading } = useQuery<QueryResponse<Transcript>>({
        queryKey: ['transcripts', 'byStatus', status, options],
        queryFn: async () => {
            const response = await listTranscripts({ 
                status,
                ...options
            }, mockTenantId);
            return transformApiResponse(response as ApiResponse<Transcript>);
        },
        enabled: !!status
    });

    return {
        transcripts: data?.data || [],
        metadata: data?.metadata,
        isLoading
    };
}

export function useTranscriptsByDateRange(
    startDate: string,
    endDate: string,
    options: PaginationOptions = {}
) {
    const mockTenantId = 'default-tenant'; // Mock tenant ID for development

    const { data, isLoading } = useQuery<QueryResponse<Transcript>>({
        queryKey: ['transcripts', 'byDateRange', startDate, endDate, options],
        queryFn: async () => {
            const response = await listTranscripts({ 
                created_at: {
                    operator: 'rangeGte',
                    value: startDate
                },
                end_date: {
                    operator: 'rangeLte',
                    value: endDate
                },
                ...options
            }, mockTenantId);
            return transformApiResponse(response as ApiResponse<Transcript>);
        },
        enabled: !!startDate && !!endDate
    });

    return {
        transcripts: data?.data || [],
        metadata: data?.metadata,
        isLoading
    };
} 