import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRecord, PaginationOptions, QueryResponse, QueryBuilder, createQuery } from './query-builder';

export abstract class DatabaseOperations<T extends BaseRecord> {
    protected readonly client: SupabaseClient;
    protected readonly table: string;
    protected readonly tenantId: string | null;

    protected constructor(client: SupabaseClient, table: string, tenantId: string | null = null) {
        this.client = client;
        this.table = table;
        this.tenantId = tenantId;
    }

    protected createQuery(): QueryBuilder<T> {
        return createQuery<T>(this.client, this.table, this.tenantId);
    }

    public async getById(id: number): Promise<T | null> {
        const result = await this.createQuery()
            .select()
            .filter('id', '=', id)
            .execute();
        return result.data[0] || null;
    }

    public async list(options: PaginationOptions = {}): Promise<QueryResponse<T>> {
        return this.createQuery()
            .select()
            .paginateByCursor(options)
            .execute();
    }

    public async listByCursor(options: PaginationOptions): Promise<QueryResponse<T>> {
        return this.createQuery()
            .select()
            .paginateByCursor(options)
            .execute();
    }

    public async search(query: string, columns: string[]): Promise<T[]> {
        const result = await this.createQuery()
            .select()
            .filter(columns[0], 'ilike', `%${query}%`)
            .execute();
        return result.data;
    }

    public async count(filters: Record<string, any> = {}): Promise<number> {
        const result = await this.createQuery()
            .select(['count(*)'])
            .filters(filters)
            .execute();
        return result.count || 0;
    }
} 