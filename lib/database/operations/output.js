import { createQuery } from '../utils/query-builder';
import { withErrorHandling } from '../utils/error-handling';
import { validateRequired, validateTypes, validateEnum } from '../utils/validation';
import { withTenantIsolation, addTenantId, verifyTenantAccess } from '../utils/tenant-isolation';

// Constants
const OUTPUT_TYPES = ['one_pager', 'slides', 'bytes', 'anchor'];
const OUTPUT_STATUS = ['pending', 'processing', 'completed', 'failed'];
const OUTPUT_FORMATS = ['text', 'html', 'pdf', 'pptx', 'mp3', 'mp4'];

/**
 * Create output type
 * @param {Object} data - Output type data
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function createOutputType(data, tenantId) {
    return withErrorHandling(async () => {
        // Validate required fields
        validateRequired(data, [
            'name',
            'type',
            'format',
            'schema',
            'description'
        ], 'Output Type');

        // Validate types
        validateTypes(data, {
            name: 'string',
            type: 'string',
            format: 'string',
            schema: 'object',
            description: 'string'
        }, 'Output Type');

        // Validate enums
        validateEnum(data.type, OUTPUT_TYPES, 'type', 'Output Type');
        validateEnum(data.format, OUTPUT_FORMATS, 'format', 'Output Type');

        // Add tenant ID and create output type
        const typeData = addTenantId(data, tenantId);
        const { data: outputType, error } = await createQuery('output_types')
            .getRawQuery()
            .insert(typeData)
            .select()
            .single();

        if (error) throw error;
        return outputType;
    }, 'create', 'Output Type');
}

/**
 * Get output type
 * @param {string} id - Output type ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function getOutputType(id, tenantId) {
    return withErrorHandling(async () => {
        const { data: outputType, error } = await withTenantIsolation(
            createQuery('output_types')
                .getRawQuery()
                .select()
                .eq('id', id),
            tenantId
        ).single();

        if (error) throw error;
        verifyTenantAccess(outputType, tenantId, 'Output Type');
        return outputType;
    }, 'get', 'Output Type');
}

/**
 * List output types
 * @param {Object} filters - Query filters
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function listOutputTypes(filters = {}, tenantId) {
    return withErrorHandling(async () => {
        let query = createQuery('output_types').select();

        // Apply filters
        if (filters.type) {
            query = query.filter('type', '=', filters.type);
        }
        if (filters.format) {
            query = query.filter('format', '=', filters.format);
        }

        // Add tenant isolation
        query = withTenantIsolation(query.getRawQuery(), tenantId);

        return await query.execute();
    }, 'list', 'Output Types');
}

/**
 * Create output file
 * @param {Object} data - Output file data
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function createOutputFile(data, tenantId) {
    return withErrorHandling(async () => {
        // Validate required fields
        validateRequired(data, [
            'type_id',
            'transcript_id',
            'status',
            'metadata'
        ], 'Output File');

        // Validate types
        validateTypes(data, {
            type_id: 'string',
            transcript_id: 'string',
            status: 'string',
            metadata: 'object'
        }, 'Output File');

        // Validate status
        validateEnum(data.status, OUTPUT_STATUS, 'status', 'Output File');

        // Verify output type exists and belongs to tenant
        await getOutputType(data.type_id, tenantId);

        // Add tenant ID and create output file
        const fileData = addTenantId(data, tenantId);
        const { data: outputFile, error } = await createQuery('output_files')
            .getRawQuery()
            .insert(fileData)
            .select()
            .single();

        if (error) throw error;
        return outputFile;
    }, 'create', 'Output File');
}

/**
 * Get output file
 * @param {string} id - Output file ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function getOutputFile(id, tenantId) {
    return withErrorHandling(async () => {
        const { data: outputFile, error } = await withTenantIsolation(
            createQuery('output_files')
                .getRawQuery()
                .select(`
                    *,
                    type:output_types(*),
                    transcript:transcripts(*)
                `)
                .eq('id', id),
            tenantId
        ).single();

        if (error) throw error;
        verifyTenantAccess(outputFile, tenantId, 'Output File');
        return outputFile;
    }, 'get', 'Output File');
}

/**
 * List output files
 * @param {Object} filters - Query filters
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function listOutputFiles(filters = {}, tenantId) {
    return withErrorHandling(async () => {
        let query = createQuery('output_files')
            .select([
                '*',
                'type:output_types(*)',
                'transcript:transcripts(id, title)'
            ]);

        // Apply filters
        if (filters.type_id) {
            query = query.filter('type_id', '=', filters.type_id);
        }
        if (filters.transcript_id) {
            query = query.filter('transcript_id', '=', filters.transcript_id);
        }
        if (filters.status) {
            query = query.filter('status', '=', filters.status);
        }

        // Add tenant isolation
        query = withTenantIsolation(query.getRawQuery(), tenantId);

        // Add ordering
        query = query.orderBy('created_at', 'desc');

        return await query.execute();
    }, 'list', 'Output Files');
}

/**
 * Update output file status
 * @param {string} id - Output file ID
 * @param {string} status - New status
 * @param {Object} metadata - Additional metadata
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function updateOutputFileStatus(id, status, metadata = {}, tenantId) {
    return withErrorHandling(async () => {
        // Validate status
        validateEnum(status, OUTPUT_STATUS, 'status', 'Output File');

        // Get existing file
        const outputFile = await getOutputFile(id, tenantId);

        // Update status and metadata
        const updateData = {
            status,
            metadata: {
                ...outputFile.metadata,
                ...metadata,
                status_updated_at: new Date().toISOString()
            }
        };

        const { data: updatedFile, error } = await withTenantIsolation(
            createQuery('output_files')
                .getRawQuery()
                .update(updateData)
                .eq('id', id),
            tenantId
        ).select().single();

        if (error) throw error;
        return updatedFile;
    }, 'update', 'Output File');
}

/**
 * Delete output file
 * @param {string} id - Output file ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<void>}
 */
export async function deleteOutputFile(id, tenantId) {
    return withErrorHandling(async () => {
        // Verify file exists and belongs to tenant
        await getOutputFile(id, tenantId);

        const { error } = await withTenantIsolation(
            createQuery('output_files')
                .getRawQuery()
                .delete()
                .eq('id', id),
            tenantId
        );

        if (error) throw error;
    }, 'delete', 'Output File');
} 