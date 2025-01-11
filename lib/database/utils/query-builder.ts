import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types';

export type WhereCondition = {
    field: string;
    operator: 'eq' | 'gt' | 'lt' | 'gte' | 'lte' | 'like' | 'ilike' | 'in' | 'is';
    value: any;
};

export type ListOptions = {
    tenantId: string;
    cursor?: string;
    limit?: number;
    whereConditions?: WhereCondition[];
};

type TableName = keyof Database['public']['Tables'];
type Row<T extends TableName> = Database['public']['Tables'][T]['Row'];
type Insert<T extends TableName> = Database['public']['Tables'][T]['Insert'];
type Update<T extends TableName> = Database['public']['Tables'][T]['Update'];

export class QueryBuilder<T extends TableName> {
    private readonly tableName: T;
    private readonly client: SupabaseClient<Database>;

    constructor(tableName: T, client: SupabaseClient<Database>) {
        this.tableName = tableName;
        this.client = client;
    }

    async list(options: ListOptions): Promise<{ data: Row<T>[]; cursor: string | null }> {
        const { tenantId, cursor, limit = 10, whereConditions = [] } = options;
        let query = this.client
            .from(this.tableName)
            .select('*')
            .eq('tenant_id', tenantId)
            .is('deleted_at', null);

        // Apply cursor-based pagination
        if (cursor) {
            query = query.gt('id', cursor);
        }

        // Apply where conditions
        whereConditions.forEach(({ field, operator, value }) => {
            switch (operator) {
                case 'eq':
                    query = query.eq(field, value);
                    break;
                case 'gt':
                    query = query.gt(field, value);
                    break;
                case 'lt':
                    query = query.lt(field, value);
                    break;
                case 'gte':
                    query = query.gte(field, value);
                    break;
                case 'lte':
                    query = query.lte(field, value);
                    break;
                case 'like':
                    query = query.like(field, value);
                    break;
                case 'ilike':
                    query = query.ilike(field, value);
                    break;
                case 'in':
                    query = query.in(field, value);
                    break;
                case 'is':
                    query = query.is(field, value);
                    break;
            }
        });

        // Apply limit and order
        query = query.order('id', { ascending: true }).limit(limit);

        const { data, error } = await query;
        if (error) throw error;

        return {
            data: data as Row<T>[],
            cursor: data.length === limit ? data[data.length - 1].id : null
        };
    }

    async getById(id: string | number, tenantId: string): Promise<Row<T> | null> {
        const { data, error } = await this.client
            .from(this.tableName)
            .select('*')
            .eq('id', id)
            .eq('tenant_id', tenantId)
            .is('deleted_at', null)
            .single();

        if (error) throw error;
        return data as Row<T>;
    }

    async create(record: Insert<T>): Promise<Row<T>> {
        const { data, error } = await this.client
            .from(this.tableName)
            .insert(record)
            .select()
            .single();

        if (error) throw error;
        return data as Row<T>;
    }

    async update(id: string | number, record: Update<T>, tenantId: string): Promise<Row<T> | null> {
        const { data, error } = await this.client
            .from(this.tableName)
            .update(record)
            .eq('id', id)
            .eq('tenant_id', tenantId)
            .is('deleted_at', null)
            .select()
            .single();

        if (error) throw error;
        return data as Row<T>;
    }

    async softDelete(id: string | number, tenantId: string): Promise<void> {
        const { error } = await this.client
            .from(this.tableName)
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id)
            .eq('tenant_id', tenantId)
            .is('deleted_at', null);

        if (error) throw error;
    }
} 