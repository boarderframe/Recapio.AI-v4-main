import { createQuery } from '../utils/query-builder';
import { withErrorHandling } from '../utils/error-handling';
import { validateRequired, validateTypes, validateEnum, validateLength } from '../utils/validation';
import { withTenantIsolation, addTenantId, verifyTenantAccess } from '../utils/tenant-isolation';

// Constants
const TRANSCRIPT_STATUS = ['pending', 'processing', 'completed', 'failed'];
const TRANSCRIPT_TYPES = ['audio', 'video', 'text'];
const TRANSCRIPT_LANGUAGES = ['en', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'ja', 'ko', 'zh'];

/**
 * Create transcript
 * @param {Object} data - Transcript data
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function createTranscript(data, tenantId) {
    return withErrorHandling(async () => {
        // Validate required fields
        validateRequired(data, [
            'title',
            'type',
            'status',
            'user_id',
            'content',
            'language'
        ], 'Transcript');

        // Validate types
        validateTypes(data, {
            title: 'string',
            type: 'string',
            status: 'string',
            user_id: 'string',
            content: 'string',
            language: 'string',
            metadata: 'object',
            team_id: 'string'
        }, 'Transcript');

        // Validate enums
        validateEnum(data.type, TRANSCRIPT_TYPES, 'type', 'Transcript');
        validateEnum(data.status, TRANSCRIPT_STATUS, 'status', 'Transcript');
        validateEnum(data.language, TRANSCRIPT_LANGUAGES, 'language', 'Transcript');

        // Validate lengths
        validateLength(data.title, { min: 1, max: 255 }, 'title', 'Transcript');
        validateLength(data.content, { min: 1 }, 'content', 'Transcript');

        // Add tenant ID and create transcript
        const transcriptData = addTenantId(data, tenantId);
        const { data: transcript, error } = await createQuery('transcripts')
            .getRawQuery()
            .insert(transcriptData)
            .select()
            .single();

        if (error) throw error;
        return transcript;
    }, 'create', 'Transcript');
}

/**
 * Get transcript
 * @param {string} id - Transcript ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function getTranscript(id, tenantId) {
    return withErrorHandling(async () => {
        const { data: transcript, error } = await withTenantIsolation(
            createQuery('transcripts')
                .getRawQuery()
                .select(`
                    *,
                    user:auth.users(id, email),
                    team:teams(id, name),
                    outputs:output_files(
                        *,
                        type:output_types(*)
                    )
                `)
                .eq('id', id),
            tenantId
        ).single();

        if (error) throw error;
        verifyTenantAccess(transcript, tenantId, 'Transcript');
        return transcript;
    }, 'get', 'Transcript');
}

/**
 * List transcripts
 * @param {Object} filters - Query filters
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function listTranscripts(filters = {}, tenantId) {
    return withErrorHandling(async () => {
        let query = createQuery('transcripts')
            .select([
                '*',
                'user:auth.users(id, email)',
                'team:teams(id, name)',
                'outputs:output_files(id)'
            ]);

        // Apply filters
        if (filters.user_id) {
            query = query.filter('user_id', '=', filters.user_id);
        }
        if (filters.team_id) {
            query = query.filter('team_id', '=', filters.team_id);
        }
        if (filters.type) {
            query = query.filter('type', '=', filters.type);
        }
        if (filters.status) {
            query = query.filter('status', '=', filters.status);
        }
        if (filters.language) {
            query = query.filter('language', '=', filters.language);
        }
        if (filters.search) {
            query = query.filter('title', 'ilike', `%${filters.search}%`);
        }

        // Add tenant isolation
        query = withTenantIsolation(query.getRawQuery(), tenantId);

        // Add ordering
        query = query.orderBy('created_at', 'desc');

        return await query.execute();
    }, 'list', 'Transcripts');
}

/**
 * Update transcript
 * @param {string} id - Transcript ID
 * @param {Object} data - Update data
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function updateTranscript(id, data, tenantId) {
    return withErrorHandling(async () => {
        // Validate types if provided
        if (Object.keys(data).length > 0) {
            validateTypes(data, {
                title: 'string',
                type: 'string',
                status: 'string',
                content: 'string',
                language: 'string',
                metadata: 'object',
                team_id: 'string'
            }, 'Transcript');
        }

        // Validate enums if provided
        if (data.type) {
            validateEnum(data.type, TRANSCRIPT_TYPES, 'type', 'Transcript');
        }
        if (data.status) {
            validateEnum(data.status, TRANSCRIPT_STATUS, 'status', 'Transcript');
        }
        if (data.language) {
            validateEnum(data.language, TRANSCRIPT_LANGUAGES, 'language', 'Transcript');
        }

        // Validate lengths if provided
        if (data.title) {
            validateLength(data.title, { min: 1, max: 255 }, 'title', 'Transcript');
        }
        if (data.content) {
            validateLength(data.content, { min: 1 }, 'content', 'Transcript');
        }

        // Get existing transcript
        const transcript = await getTranscript(id, tenantId);
        
        // Update transcript
        const { data: updatedTranscript, error } = await withTenantIsolation(
            createQuery('transcripts')
                .getRawQuery()
                .update(data)
                .eq('id', id),
            tenantId
        ).select().single();

        if (error) throw error;
        return updatedTranscript;
    }, 'update', 'Transcript');
}

/**
 * Delete transcript
 * @param {string} id - Transcript ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<void>}
 */
export async function deleteTranscript(id, tenantId) {
    return withErrorHandling(async () => {
        // Verify transcript exists and belongs to tenant
        await getTranscript(id, tenantId);

        const { error } = await withTenantIsolation(
            createQuery('transcripts')
                .getRawQuery()
                .delete()
                .eq('id', id),
            tenantId
        );

        if (error) throw error;
    }, 'delete', 'Transcript');
}

/**
 * Update transcript status
 * @param {string} id - Transcript ID
 * @param {string} status - New status
 * @param {Object} metadata - Additional metadata
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function updateTranscriptStatus(id, status, metadata = {}, tenantId) {
    return withErrorHandling(async () => {
        // Validate status
        validateEnum(status, TRANSCRIPT_STATUS, 'status', 'Transcript');

        // Get existing transcript
        const transcript = await getTranscript(id, tenantId);

        // Update status and metadata
        const updateData = {
            status,
            metadata: {
                ...transcript.metadata,
                ...metadata,
                status_updated_at: new Date().toISOString()
            }
        };

        const { data: updatedTranscript, error } = await withTenantIsolation(
            createQuery('transcripts')
                .getRawQuery()
                .update(updateData)
                .eq('id', id),
            tenantId
        ).select().single();

        if (error) throw error;
        return updatedTranscript;
    }, 'update', 'Transcript');
}

/**
 * Search transcripts
 * @param {string} query - Search query
 * @param {Object} filters - Additional filters
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function searchTranscripts(query, filters = {}, tenantId) {
    return withErrorHandling(async () => {
        let searchQuery = createQuery('transcripts')
            .select([
                '*',
                'user:auth.users(id, email)',
                'team:teams(id, name)',
                'outputs:output_files(id)'
            ]);

        // Apply search conditions
        searchQuery = searchQuery.or([
            builder => builder.filter('title', 'ilike', `%${query}%`),
            builder => builder.filter('content', 'ilike', `%${query}%`)
        ]);

        // Apply additional filters
        if (filters.user_id) {
            searchQuery = searchQuery.filter('user_id', '=', filters.user_id);
        }
        if (filters.team_id) {
            searchQuery = searchQuery.filter('team_id', '=', filters.team_id);
        }
        if (filters.type) {
            searchQuery = searchQuery.filter('type', '=', filters.type);
        }
        if (filters.language) {
            searchQuery = searchQuery.filter('language', '=', filters.language);
        }

        // Add tenant isolation
        searchQuery = withTenantIsolation(searchQuery.getRawQuery(), tenantId);

        // Add ordering by relevance (matching title first)
        searchQuery = searchQuery.or([
            builder => builder.filter('title', 'ilike', `%${query}%`).orderBy('created_at', 'desc'),
            builder => builder.filter('content', 'ilike', `%${query}%`).orderBy('created_at', 'desc')
        ]);

        return await searchQuery.execute();
    }, 'search', 'Transcripts');
} 