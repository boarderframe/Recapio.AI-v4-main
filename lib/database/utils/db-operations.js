import { createQuery } from './query-builder';

/**
 * Base class for database operations with tenant isolation
 */
export class DatabaseOperations {
    constructor(table, tenantId = null) {
        this.table = table;
        this.tenantId = tenantId;
    }

    /**
     * Create a new query builder instance
     * @returns {QueryBuilder}
     */
    createQuery() {
        return createQuery(this.table, this.tenantId);
    }

    /**
     * Fetch a single record by ID
     * @param {string|number} id - Record ID
     * @returns {Promise<Object>}
     */
    async getById(id) {
        const { data, metadata } = await this.createQuery()
            .filter('id', '=', id)
            .execute();
        return data?.[0] || null;
    }

    /**
     * Fetch records with pagination
     * @param {Object} options - Query options
     * @param {number} [options.page=1] - Page number for offset pagination
     * @param {number} [options.pageSize=10] - Items per page
     * @param {Object} [options.filters={}] - Filter conditions
     * @param {Object|string} [options.orderBy] - Ordering configuration
     * @param {string} [options.orderDirection='asc'] - Order direction
     * @returns {Promise<Object>}
     */
    async list({
        page = 1,
        pageSize = 10,
        filters = {},
        orderBy = 'created_at',
        orderDirection = 'desc'
    } = {}) {
        const query = this.createQuery().filters(filters);

        if (typeof orderBy === 'object') {
            query.orderBy(orderBy);
        } else {
            query.orderBy(orderBy, orderDirection);
        }

        return await query.paginate(page, pageSize).execute();
    }

    /**
     * Fetch records with cursor-based pagination
     * @param {Object} options - Query options
     * @param {number} options.limit - Items per page
     * @param {string} [options.cursor] - Cursor for the next page
     * @param {string} [options.cursorColumn='created_at'] - Column to use for cursor
     * @param {boolean} [options.ascending=false] - Sort direction
     * @param {Object} [options.filters={}] - Filter conditions
     * @returns {Promise<Object>}
     */
    async listByCursor({
        limit,
        cursor = null,
        cursorColumn = 'created_at',
        ascending = false,
        filters = {}
    }) {
        const query = this.createQuery().filters(filters);
        return await query
            .paginateByCursor({ limit, cursor, cursorColumn, ascending })
            .execute();
    }

    /**
     * Search records with full-text search
     * @param {Object} options - Search options
     * @param {string} options.query - Search query
     * @param {string[]} options.columns - Columns to search in
     * @param {number} [options.limit=10] - Maximum number of results
     * @param {Object} [options.filters={}] - Additional filters
     * @returns {Promise<Object>}
     */
    async search({ query, columns, limit = 10, filters = {} }) {
        const searchQuery = this.createQuery().filters(filters);

        columns.forEach(column => {
            searchQuery.filter(column, 'textSearch', query);
        });

        return await searchQuery.limit(limit).execute();
    }

    /**
     * Stream records in batches
     * @param {Object} options - Stream options
     * @param {Function} options.callback - Callback function for each batch
     * @param {number} [options.batchSize=100] - Number of records per batch
     * @param {Object} [options.filters={}] - Filter conditions
     * @returns {Promise<void>}
     */
    async stream({ callback, batchSize = 100, filters = {} }) {
        const query = this.createQuery().filters(filters);
        await query.stream(callback, batchSize);
    }

    /**
     * Count records with optional filters
     * @param {Object} [filters={}] - Filter conditions
     * @returns {Promise<number>}
     */
    async count(filters = {}) {
        const { metadata } = await this.createQuery()
            .filters(filters)
            .execute();
        return metadata.total;
    }
}

/**
 * Create a new database operations instance
 * @param {string} table - Table name
 * @param {string} [tenantId] - Tenant ID for isolation
 * @returns {DatabaseOperations}
 */
export function createDbOperations(table, tenantId = null) {
    return new DatabaseOperations(table, tenantId);
} 