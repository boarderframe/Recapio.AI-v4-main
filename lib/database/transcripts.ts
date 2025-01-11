import { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseOperations } from './utils/db-operations';
import { BaseRecord, PaginationOptions, QueryResponse } from './utils/query-builder';

interface Transcript extends BaseRecord {
    type: string;
    status: string;
    source_file: string;
    source_language: string;
    target_language: string;
    created_at: string;
    updated_at: string;
}

interface TranscriptStats {
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
}

export class TranscriptsOperations extends DatabaseOperations<Transcript> {
    constructor(client: SupabaseClient, tenantId: string | null = null) {
        super(client, 'transcripts', tenantId);
    }

    async listWithType(type: string, options: PaginationOptions = {}): Promise<QueryResponse<Transcript>> {
        return this.createQuery()
            .filter('type', '=', type)
            .paginateByCursor(options)
            .execute();
    }

    async listByDateRange(
        startDate: string,
        endDate: string,
        options: PaginationOptions = {}
    ): Promise<QueryResponse<Transcript>> {
        return this.createQuery()
            .filter('created_at', '>=', startDate)
            .filter('created_at', '<=', endDate)
            .paginateByCursor(options)
            .execute();
    }

    async listByStatus(
        status: string,
        options: PaginationOptions = {}
    ): Promise<QueryResponse<Transcript>> {
        return this.createQuery()
            .filter('status', '=', status)
            .paginateByCursor(options)
            .execute();
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
        const result = await this.createQuery()
            .select([field])
            .execute();

        return result.data.reduce((acc: Record<string, number>, curr: any) => {
            const value = curr[field];
            acc[value] = (acc[value] || 0) + 1;
            return acc;
        }, {});
    }
} 