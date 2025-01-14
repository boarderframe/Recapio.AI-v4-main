import { DatabaseOperations, QueryResponse, PaginationOptions } from '../utils/db-operations';
import type { Database } from '@/types/database';
import { supabase } from '../client';

type TranscriptType = Database['public']['Tables']['transcript_types']['Row'];
type TranscriptTypeInsert = Database['public']['Tables']['transcript_types']['Insert'];
type TranscriptTypeUpdate = Database['public']['Tables']['transcript_types']['Update'];

interface TranscriptTypeFilters extends PaginationOptions {
    category?: string;
    subcategory?: string;
    is_global?: boolean;
    search?: string;
}

export class TranscriptTypeOperations extends DatabaseOperations<'transcript_types'> {
    constructor(tenantId: string | null = null) {
        super(supabase, 'transcript_types', tenantId);
    }

    async createType(data: TranscriptTypeInsert): Promise<TranscriptType> {
        // Validate required fields
        if (!data.category || !data.tenant_id || !data.created_by) {
            throw new Error('Missing required fields: category, tenant_id, and created_by are required');
        }

        // Check if record already exists
        const { data: existingData } = await this.client.from(this.table)
            .select()
            .eq('category', data.category)
            .eq('tenant_id', data.tenant_id)
            .eq('subcategory', data.subcategory || '');

        if (existingData && existingData.length > 0) {
            throw new Error('Transcript type already exists');
        }

        return await super.create(data);
    }

    async getByKey(category: string, subcategory: string | null, tenant_id: string): Promise<TranscriptType | null> {
        const { data, error } = await this.client.from(this.table)
            .select()
            .eq('category', category)
            .eq('tenant_id', tenant_id)
            .eq('subcategory', subcategory || '')
            .single();

        if (error) throw error;
        return data as TranscriptType;
    }

    async listTypes(filters: TranscriptTypeFilters = {}): Promise<QueryResponse<TranscriptType>> {
        let query = this.client.from(this.table)
            .select('*', { count: 'exact' })
            .order('category')
            .order('subcategory');

        // Apply filters
        if (filters.category) {
            query = query.eq('category', filters.category);
        }
        if (filters.subcategory) {
            query = query.eq('subcategory', filters.subcategory);
        }
        if (filters.is_global !== undefined) {
            query = query.eq('is_global', filters.is_global);
        }
        if (filters.search) {
            query = query.or(`category.ilike.%${filters.search}%,subcategory.ilike.%${filters.search}%`);
        }

        const { data, error, count } = await query;

        if (error) throw error;

        return {
            data: data as TranscriptType[],
            metadata: {
                total: count || 0,
                returned: data?.length || 0,
                hasMore: false // Not using pagination for transcript types
            }
        };
    }

    async updateType(
        category: string,
        subcategory: string | null,
        tenant_id: string,
        data: TranscriptTypeUpdate
    ): Promise<TranscriptType> {
        const { data: updatedData, error } = await this.client.from(this.table)
            .update(data)
            .eq('category', category)
            .eq('tenant_id', tenant_id)
            .eq('subcategory', subcategory || '')
            .select()
            .single();

        if (error) throw error;
        return updatedData as TranscriptType;
    }

    async deleteType(category: string, subcategory: string | null, tenant_id: string): Promise<void> {
        const { error } = await this.client.from(this.table)
            .delete()
            .eq('category', category)
            .eq('tenant_id', tenant_id)
            .eq('subcategory', subcategory || '');

        if (error) throw error;
    }
} 