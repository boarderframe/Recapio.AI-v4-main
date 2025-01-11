import { useQuery } from '@tanstack/react-query';
import { listTranscripts, getTranscript, searchTranscripts } from '../../lib/database/operations/transcript';
import { useAppSelector, RootState } from '../state/store';
import { BaseRecord } from '../../lib/database/utils/query-builder';

interface Transcript extends BaseRecord {
    type: string;
    status: string;
    content: string;
    universal_metadata: Record<string, any>;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

interface TranscriptType {
    id: string;
    type: string;
    category: string;
    sub_type: string;
    category_color: string;
    category_icon: string;
}

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
        data: response.data,
        metadata: {
            total: response.count || 0,
            returned: response.data.length,
            hasMore: (response.count || 0) > response.data.length
        }
    };
}

export function useTranscripts(filters: TranscriptFilters = {}, pagination: PaginationOptions = {}) {
    const tenantId = useAppSelector((state: RootState) => state.auth.tenantId);

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
        queryKey: ['transcripts', tenantId, filters, pagination],
        queryFn: async () => {
            if (!tenantId) throw new Error('Tenant ID is required');
            const response = await listTranscripts(queryParams, tenantId);
            return transformApiResponse(response as ApiResponse<Transcript & { transcript_types: TranscriptType }>);
        },
        enabled: !!tenantId
    });

    // Search transcripts
    const { data: searchResults, isLoading: isSearching } = useQuery<QueryResponse<Transcript>>({
        queryKey: ['transcripts', 'search', tenantId, filters.search],
        queryFn: async () => {
            if (!tenantId) throw new Error('Tenant ID is required');
            if (!filters.search) throw new Error('Search query is required');
            const response = await searchTranscripts(filters.search, {
                limit: pagination.pageSize || 10
            }, tenantId);
            return transformApiResponse(response as ApiResponse<Transcript>);
        },
        enabled: !!tenantId && !!filters.search
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
    const tenantId = useAppSelector((state: RootState) => state.auth.tenantId);

    const { data, isLoading } = useQuery<QueryResponse<Transcript>>({
        queryKey: ['transcripts', 'recent', tenantId, limit],
        queryFn: async () => {
            if (!tenantId) throw new Error('Tenant ID is required');
            const response = await listTranscripts({ 
                limit,
                orderBy: { created_at: 'desc' }
            }, tenantId);
            return transformApiResponse(response as ApiResponse<Transcript>);
        },
        enabled: !!tenantId
    });

    return {
        recentTranscripts: data?.data || [],
        isLoading
    };
}

export function useTranscriptsByType(type: string, options: PaginationOptions = {}) {
    const tenantId = useAppSelector((state: RootState) => state.auth.tenantId);

    const { data, isLoading } = useQuery<QueryResponse<Transcript>>({
        queryKey: ['transcripts', 'byType', tenantId, type, options],
        queryFn: async () => {
            if (!tenantId) throw new Error('Tenant ID is required');
            const response = await listTranscripts({ 
                type,
                ...options
            }, tenantId);
            return transformApiResponse(response as ApiResponse<Transcript>);
        },
        enabled: !!tenantId && !!type
    });

    return {
        transcripts: data?.data || [],
        metadata: data?.metadata,
        isLoading
    };
}

export function useTranscriptsByStatus(status: string, options: PaginationOptions = {}) {
    const tenantId = useAppSelector((state: RootState) => state.auth.tenantId);

    const { data, isLoading } = useQuery<QueryResponse<Transcript>>({
        queryKey: ['transcripts', 'byStatus', tenantId, status, options],
        queryFn: async () => {
            if (!tenantId) throw new Error('Tenant ID is required');
            const response = await listTranscripts({ 
                status,
                ...options
            }, tenantId);
            return transformApiResponse(response as ApiResponse<Transcript>);
        },
        enabled: !!tenantId && !!status
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
    const tenantId = useAppSelector((state: RootState) => state.auth.tenantId);

    const { data, isLoading } = useQuery<QueryResponse<Transcript>>({
        queryKey: ['transcripts', 'byDateRange', tenantId, startDate, endDate, options],
        queryFn: async () => {
            if (!tenantId) throw new Error('Tenant ID is required');
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
            }, tenantId);
            return transformApiResponse(response as ApiResponse<Transcript>);
        },
        enabled: !!tenantId && !!startDate && !!endDate
    });

    return {
        transcripts: data?.data || [],
        metadata: data?.metadata,
        isLoading
    };
} 