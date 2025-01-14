import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

type TableName = keyof Database['public']['Tables'];
type Row<T extends TableName> = Database['public']['Tables'][T]['Row'];
type Insert<T extends TableName> = Database['public']['Tables'][T]['Insert'];
type Update<T extends TableName> = Database['public']['Tables'][T]['Update'];

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

export abstract class DatabaseOperations<T extends TableName> {
    protected readonly client: SupabaseClient<Database>;
    protected readonly table: T;
    protected readonly tenantId: string | null;

    constructor(client: SupabaseClient<Database>, table: T, tenantId: string | null = null) {
        this.client = client;
        this.table = table;
        this.tenantId = tenantId;
    }

    protected async list(options: PaginationOptions = {}): Promise<QueryResponse<Row<T>>> {
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
            data: data as Row<T>[],
            metadata: {
                total: count || 0,
                returned: data?.length || 0,
                hasMore: (count || 0) > (cursor ? (data?.length || 0) : pageSize)
            }
        };
    }

    protected async getById(id: string): Promise<Row<T> | null> {
        const { data, error } = await this.client.from(this.table)
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Row<T>;
    }

    protected async create<R extends Row<T>>(record: Insert<T>): Promise<R> {
        const insertData = this.tenantId ? { ...record, tenant_id: this.tenantId } : record;

        const { data, error } = await this.client.from(this.table)
            .insert(insertData)
            .select()
            .single();

        if (error) throw error;
        return data as R;
    }

    protected async update<R extends Row<T>>(id: string, record: Update<T>): Promise<R> {
        const { data, error } = await this.client.from(this.table)
            .update(record)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as R;
    }

    protected async delete(id: string): Promise<void> {
        const { error } = await this.client.from(this.table)
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
} 