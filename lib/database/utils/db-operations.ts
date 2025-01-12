import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types';

type TableName = keyof Database['public']['Tables'];
type Row<T extends TableName> = Database['public']['Tables'][T]['Row'];

export interface BaseRecord {
    id: string;
    tenant_id?: string;
    created_at?: string;
    updated_at?: string;
}

export interface PaginationOptions {
    pageSize?: number;
    cursor?: string;
    ascending?: boolean;
}

export interface QueryResponse<T> {
    data: T[];
    metadata: {
        total: number;
        returned: number;
        hasMore: boolean;
    };
}

export abstract class DatabaseOperations<T extends Row<TableName> & BaseRecord> {
    protected readonly client: SupabaseClient<Database>;
    protected readonly table: TableName;
    protected readonly tenantId: string | null;

    constructor(client: SupabaseClient<Database>, table: TableName, tenantId: string | null = null) {
        this.client = client;
        this.table = table;
        this.tenantId = tenantId;
    }

    protected async list(options: PaginationOptions = {}): Promise<QueryResponse<T>> {
        const { pageSize = 10, cursor, ascending = true } = options;
        
        let query = this.client.from(this.table)
            .select('*', { count: 'exact' })
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
            data: data as T[],
            metadata: {
                total: count || 0,
                returned: data.length,
                hasMore: (count || 0) > (cursor ? data.length : pageSize)
            }
        };
    }

    protected async getById(id: string): Promise<T | null> {
        const { data, error } = await this.client.from(this.table)
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as T;
    }

    protected async create(record: Partial<T>): Promise<T> {
        if (this.tenantId) {
            record.tenant_id = this.tenantId;
        }

        const { data, error } = await this.client.from(this.table)
            .insert(record)
            .select()
            .single();

        if (error) throw error;
        return data as T;
    }

    protected async update(id: string, record: Partial<T>): Promise<T> {
        const { data, error } = await this.client.from(this.table)
            .update(record)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as T;
    }

    protected async delete(id: string): Promise<void> {
        const { error } = await this.client.from(this.table)
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
} 