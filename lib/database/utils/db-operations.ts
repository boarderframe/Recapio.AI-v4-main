import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { log } from '@/lib/utils/logger';

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
        
        log.db.info('Listing records', {
            table: this.table,
            tenantId: this.tenantId,
            pageSize,
            cursor,
            ascending
        });
        
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

        try {
            const { data, error, count } = await query;

            if (error) {
                log.db.error('Error listing records', {
                    table: this.table,
                    error: error.message,
                    code: error.code
                });
                throw error;
            }

            log.db.info('Records listed successfully', {
                table: this.table,
                count: count || 0,
                returned: data?.length || 0
            });

            return {
                data: data as Row<T>[],
                metadata: {
                    total: count || 0,
                    returned: data?.length || 0,
                    hasMore: (count || 0) > (cursor ? (data?.length || 0) : pageSize)
                }
            };
        } catch (error) {
            log.db.error('Error listing records', {
                table: this.table,
                error: error instanceof Error ? error.message : String(error)
            });
            throw error;
        }
    }

    protected async getById(id: string): Promise<Row<T> | null> {
        log.db.info('Getting record by ID', {
            table: this.table,
            id,
            tenantId: this.tenantId
        });

        try {
            const { data, error } = await this.client.from(this.table)
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                log.db.error('Error getting record by ID', {
                    table: this.table,
                    id,
                    error: error.message,
                    code: error.code
                });
                throw error;
            }

            log.db.info('Record retrieved successfully', {
                table: this.table,
                id,
                found: !!data
            });

            return data as Row<T>;
        } catch (error) {
            log.db.error('Error getting record by ID', {
                table: this.table,
                id,
                error: error instanceof Error ? error.message : String(error)
            });
            throw error;
        }
    }

    protected async create<R extends Row<T>>(record: Insert<T>): Promise<R> {
        log.db.info('Creating record', {
            table: this.table,
            tenantId: this.tenantId
        });

        const insertData = this.tenantId ? { ...record, tenant_id: this.tenantId } : record;

        try {
            const { data, error } = await this.client.from(this.table)
                .insert(insertData)
                .select()
                .single();

            if (error) {
                log.db.error('Error creating record', {
                    table: this.table,
                    error: error.message,
                    code: error.code
                });
                throw error;
            }

            log.db.info('Record created successfully', {
                table: this.table,
                id: (data as any).id
            });

            return data as R;
        } catch (error) {
            log.db.error('Error creating record', {
                table: this.table,
                error: error instanceof Error ? error.message : String(error)
            });
            throw error;
        }
    }

    protected async update<R extends Row<T>>(id: string, record: Update<T>): Promise<R> {
        log.db.info('Updating record', {
            table: this.table,
            id,
            tenantId: this.tenantId
        });

        try {
            const { data, error } = await this.client.from(this.table)
                .update(record)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                log.db.error('Error updating record', {
                    table: this.table,
                    id,
                    error: error.message,
                    code: error.code
                });
                throw error;
            }

            log.db.info('Record updated successfully', {
                table: this.table,
                id
            });

            return data as R;
        } catch (error) {
            log.db.error('Error updating record', {
                table: this.table,
                id,
                error: error instanceof Error ? error.message : String(error)
            });
            throw error;
        }
    }

    protected async delete(id: string): Promise<void> {
        log.db.info('Deleting record', {
            table: this.table,
            id,
            tenantId: this.tenantId
        });

        try {
            const { error } = await this.client.from(this.table)
                .delete()
                .eq('id', id);

            if (error) {
                log.db.error('Error deleting record', {
                    table: this.table,
                    id,
                    error: error.message,
                    code: error.code
                });
                throw error;
            }

            log.db.info('Record deleted successfully', {
                table: this.table,
                id
            });
        } catch (error) {
            log.db.error('Error deleting record', {
                table: this.table,
                id,
                error: error instanceof Error ? error.message : String(error)
            });
            throw error;
        }
    }
} 