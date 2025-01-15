import { DatabaseOperations, PaginationOptions, QueryResponse } from './utils/db-operations';
import type { Database } from '@/types/database';
import { supabase } from './client';

type TranscriptRow = Database['public']['Tables']['transcripts']['Row'];
type TranscriptInsert = Database['public']['Tables']['transcripts']['Insert'];
type TranscriptUpdate = Database['public']['Tables']['transcripts']['Update'];

export interface Transcript extends TranscriptRow {
    type_details?: Database['public']['Tables']['transcript_types']['Row'];
}

export class TranscriptsOperations extends DatabaseOperations<'transcripts'> {
    constructor(tenantId: string | null = null) {
        super(supabase, 'transcripts', tenantId);
    }

    async createTranscript(data: TranscriptInsert): Promise<Transcript> {
        return await super.create<Transcript>(data);
    }

    async getById(id: string): Promise<Transcript | null> {
        const { data, error } = await this.client.from(this.table)
            .select(`
                *,
                type_details:transcript_types(*)
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Transcript;
    }

    async list(options: PaginationOptions = {}): Promise<QueryResponse<Transcript>> {
        const { pageSize = 10, cursor, ascending = true } = options;
        
        let query = this.client.from(this.table)
            .select(`
                *,
                type_details:transcript_types(*)
            `, { count: 'exact' })
            .order('created_at', { ascending });

        if (this.tenantId) {
            query = query.eq('tenant_id', this.tenantId);
        }

        if (cursor) {
            query = query.gt('created_at', cursor);
        }

        query = query.limit(pageSize);

        const { data, error, count } = await query;

        if (error) throw error;

        return {
            data: data as Transcript[],
            metadata: {
                total: count || 0,
                returned: data?.length || 0,
                hasMore: (count || 0) > (cursor ? (data?.length || 0) : pageSize)
            }
        };
    }

    async updateTranscript(id: string, data: TranscriptUpdate): Promise<Transcript> {
        return await super.update<Transcript>(id, data);
    }

    async delete(id: string): Promise<void> {
        await super.delete(id);
    }
} 