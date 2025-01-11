/**
 * Query builder class for constructing Supabase queries with built-in tenant isolation
 */
export class QueryBuilder {
    constructor(table, tenantId = null) {
        if (!global.supabase) {
            throw new Error('Supabase client not initialized');
        }
        this.query = global.supabase.from(table);
        this.table = table;
        this.tenantId = tenantId;
        this._count = 0;
        
        // Apply tenant isolation by default if tenantId is provided
        if (this.tenantId) {
            this.filter('tenant_id', '=', this.tenantId);
        }
    }

    /**
     * Select specific columns
     * @param {string[]} columns - Array of column names to select
     * @returns {QueryBuilder}
     */
    select(columns = ['*']) {
        this.query = this.query.select(columns.join(', '));
        return this;
    }

    /**
     * Add a filter condition
     * @param {string} column - Column name
     * @param {string} operator - Comparison operator
     * @param {any} value - Value to compare against
     * @returns {QueryBuilder}
     */
    filter(column, operator, value) {
        switch (operator) {
            case '=':
                this.query = this.query.eq(column, value);
                break;
            case '!=':
                this.query = this.query.neq(column, value);
                break;
            case '>':
                this.query = this.query.gt(column, value);
                break;
            case '>=':
                this.query = this.query.gte(column, value);
                break;
            case '<':
                this.query = this.query.lt(column, value);
                break;
            case '<=':
                this.query = this.query.lte(column, value);
                break;
            case 'like':
                this.query = this.query.like(column, `%${value}%`);
                break;
            case 'ilike':
                this.query = this.query.ilike(column, `%${value}%`);
                break;
            case 'in':
                this.query = this.query.in(column, Array.isArray(value) ? value : [value]);
                break;
            case 'contains':
                this.query = this.query.contains(column, value);
                break;
            case 'containedBy':
                this.query = this.query.containedBy(column, value);
                break;
            case 'rangeGt':
                this.query = this.query.rangeGt(column, value);
                break;
            case 'rangeLt':
                this.query = this.query.rangeLt(column, value);
                break;
            case 'rangeGte':
                this.query = this.query.rangeGte(column, value);
                break;
            case 'rangeLte':
                this.query = this.query.rangeLte(column, value);
                break;
            case 'textSearch':
                this.query = this.query.textSearch(column, value);
                break;
            default:
                throw new Error(`Unsupported operator: ${operator}`);
        }
        return this;
    }

    /**
     * Add multiple filter conditions
     * @param {Object} filters - Object with column names as keys and filter objects as values
     * @returns {QueryBuilder}
     */
    filters(filters) {
        Object.entries(filters).forEach(([column, filter]) => {
            if (typeof filter === 'object' && filter !== null) {
                this.filter(column, filter.operator || '=', filter.value);
            } else {
                this.filter(column, '=', filter);
            }
        });
        return this;
    }

    /**
     * Add an OR condition
     * @param {Function[]} conditions - Array of filter functions
     * @returns {QueryBuilder}
     */
    or(conditions) {
        const orConditions = conditions.map(condition => {
            const builder = new QueryBuilder(this.table, this.tenantId);
            condition(builder);
            return builder.getRawQuery();
        });
        
        this.query = this.query.or(orConditions.map(q => q.toString()).join(','));
        return this;
    }

    /**
     * Add cursor-based pagination
     * @param {Object} options - Pagination options
     * @param {number} options.limit - Number of items per page
     * @param {string} [options.cursor] - Cursor for the next page
     * @param {string} [options.cursorColumn='created_at'] - Column to use for cursor
     * @param {boolean} [options.ascending=false] - Sort direction
     * @returns {QueryBuilder}
     */
    paginateByCursor({ limit, cursor = null, cursorColumn = 'created_at', ascending = false }) {
        this.query = this.query.limit(limit);

        if (cursor) {
            this.query = ascending
                ? this.query.gt(cursorColumn, cursor)
                : this.query.lt(cursorColumn, cursor);
        }

        this.query = this.query.order(cursorColumn, { ascending });
        return this;
    }

    /**
     * Add offset-based pagination
     * @param {number} page - Page number (1-based)
     * @param {number} pageSize - Number of items per page
     * @returns {QueryBuilder}
     */
    paginate(page, pageSize) {
        const start = (page - 1) * pageSize;
        this.query = this.query
            .range(start, start + pageSize - 1)
            .limit(pageSize);
        return this;
    }

    /**
     * Add ordering
     * @param {string|Object} column - Column to order by or object with multiple columns
     * @param {string} [direction='asc'] - Order direction ('asc' or 'desc')
     * @returns {QueryBuilder}
     */
    orderBy(column, direction = 'asc') {
        if (typeof column === 'object') {
            Object.entries(column).forEach(([col, dir]) => {
                this.query = this.query.order(col, { ascending: dir === 'asc' });
            });
        } else {
            this.query = this.query.order(column, { ascending: direction === 'asc' });
        }
        return this;
    }

    /**
     * Add a join condition
     * @param {string} table - Table to join with
     * @param {string} column - Column from the current table
     * @param {string} foreignColumn - Column from the foreign table
     * @returns {QueryBuilder}
     */
    join(table, column, foreignColumn) {
        // Note: Supabase doesn't support direct JOIN operations through the API
        // This is a workaround using foreign key relationships
        this.query = this.query.select(`
            *,
            ${table}:${table}(*)
        `).eq(column, foreignColumn);
        return this;
    }

    /**
     * Execute the query and return results with metadata
     * @returns {Promise<Object>}
     */
    async execute() {
        try {
            // Get total count if not already fetched
            if (!this._count) {
                const countQuery = global.supabase.from(this.table).select('*', { count: 'exact', head: true });
                if (this.tenantId) {
                    countQuery.eq('tenant_id', this.tenantId);
                }
                const { count, error: countError } = await countQuery;
                if (countError) throw countError;
                this._count = count;
            }

            const { data, error } = await this.query;
            
            if (error) throw error;

            return {
                data,
                metadata: {
                    total: this._count,
                    returned: data?.length || 0,
                    hasMore: data?.length > 0 && data.length === this.query._query.limit
                }
            };
        } catch (error) {
            throw new Error(`Query execution failed: ${error.message}`);
        }
    }

    /**
     * Execute the query and stream results
     * @param {Function} callback - Callback function to handle each batch of results
     * @param {number} [batchSize=100] - Number of records to process at a time
     */
    async stream(callback, batchSize = 100) {
        try {
            let lastId = 0;
            let hasMore = true;

            while (hasMore) {
                const query = this.query.gt('id', lastId).limit(batchSize).order('id');
                const { data, error } = await query;

                if (error) throw error;
                if (!data || data.length === 0) break;

                await callback(data);
                lastId = data[data.length - 1].id;
                hasMore = data.length === batchSize;
            }
        } catch (error) {
            throw new Error(`Stream execution failed: ${error.message}`);
        }
    }

    /**
     * Get the raw query object
     * @returns {Object}
     */
    getRawQuery() {
        return this.query;
    }
}

/**
 * Create a new query builder instance
 * @param {string} table - Table name
 * @param {string} [tenantId] - Tenant ID for isolation
 * @returns {QueryBuilder}
 */
export function createQuery(table, tenantId = null) {
    return new QueryBuilder(table, tenantId);
} 