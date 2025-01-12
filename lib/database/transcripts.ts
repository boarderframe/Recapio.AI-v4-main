import { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseOperations, PaginationOptions, QueryResponse } from './utils/db-operations';
import { Database } from './types';

type TranscriptRow = Database['public']['Tables']['transcripts']['Row'];

export interface Transcript extends Omit<TranscriptRow, 'type'> {
    type: 'audio' | 'video' | 'text';
    content: string;
    language: string;
    metadata?: Record<string, any>;
    title: string;
    date: string;
    summary?: string;
    isFavorite?: boolean;
}

interface TranscriptStats {
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
}

export class TranscriptsOperations extends DatabaseOperations<Transcript> {
    constructor(client: SupabaseClient<Database>, tenantId: string | null = null) {
        super(client, 'transcripts', tenantId);
    }

    async listWithType(type: string, options: PaginationOptions = {}): Promise<QueryResponse<Transcript>> {
        const { pageSize = 10, cursor, ascending = true } = options;
        let query = this.createQuery().eq('type', type);

        if (cursor) {
            query = ascending
                ? query.gt('id', cursor)
                : query.lt('id', cursor);
        }

        const { data, error } = await query
            .order('id', { ascending })
            .limit(pageSize);

        if (error) throw error;

        return {
            data: data as Transcript[],
            metadata: {
                total: data.length,
                returned: data.length,
                hasMore: data.length === pageSize
            }
        };
    }

    async listByDateRange(
        startDate: string,
        endDate: string,
        options: PaginationOptions = {}
    ): Promise<QueryResponse<Transcript>> {
        const { pageSize = 10, cursor, ascending = true } = options;
        let query = this.createQuery()
            .gte('created_at', startDate)
            .lte('created_at', endDate);

        if (cursor) {
            query = ascending
                ? query.gt('id', cursor)
                : query.lt('id', cursor);
        }

        const { data, error } = await query
            .order('id', { ascending })
            .limit(pageSize);

        if (error) throw error;

        return {
            data: data as Transcript[],
            metadata: {
                total: data.length,
                returned: data.length,
                hasMore: data.length === pageSize
            }
        };
    }

    async listByStatus(
        status: string,
        options: PaginationOptions = {}
    ): Promise<QueryResponse<Transcript>> {
        const { pageSize = 10, cursor, ascending = true } = options;
        let query = this.createQuery().eq('status', status);

        if (cursor) {
            query = ascending
                ? query.gt('id', cursor)
                : query.lt('id', cursor);
        }

        const { data, error } = await query
            .order('id', { ascending })
            .limit(pageSize);

        if (error) throw error;

        return {
            data: data as Transcript[],
            metadata: {
                total: data.length,
                returned: data.length,
                hasMore: data.length === pageSize
            }
        };
    }

    async search(query: string, columns: string[] = ['title']): Promise<Transcript[]> {
        const { data, error } = await this.createQuery()
            .or(columns.map(col => `${col}.ilike.%${query}%`).join(','));

        if (error) throw error;
        return data as Transcript[];
    }

    async getStats(): Promise<TranscriptStats> {
        const total = await this.count();
        const byStatus = await this.getStatsByField('status');
        const byType = await this.getStatsByField('type');

        return {
            total,
            byStatus,
            byType
        };
    }

    private async getStatsByField(field: string): Promise<Record<string, number>> {
        const { data, error } = await this.createQuery();

        if (error) throw error;

        return (data as Transcript[]).reduce((acc: Record<string, number>, curr: Transcript) => {
            const value = curr[field as keyof Transcript];
            if (typeof value === 'string') {
                acc[value] = (acc[value] || 0) + 1;
            }
            return acc;
        }, {});
    }
} 