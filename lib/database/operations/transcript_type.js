import { createQuery } from '../utils/query-builder.js';
import { withErrorHandling } from '../utils/error-handling.js';
import { validateRequired, validateTypes, validateLength } from '../utils/validation.js';

/**
 * Create transcript type
 * @param {Object} data - Transcript type data
 * @returns {Promise<Object>}
 */
export async function createTranscriptType(data) {
    return withErrorHandling(async () => {
        // Validate required fields
        validateRequired(data, [
            'category',
            'type',
            'sub_type'
        ], 'TranscriptType');

        // Validate types
        validateTypes(data, {
            category: 'string',
            type: 'string',
            sub_type: 'string',
            category_color: 'string',
            category_icon: 'string'
        }, 'TranscriptType');

        // Validate lengths
        validateLength(data.category, { min: 1, max: 100 }, 'category', 'TranscriptType');
        validateLength(data.type, { min: 1, max: 100 }, 'type', 'TranscriptType');
        validateLength(data.sub_type, { min: 1 }, 'sub_type', 'TranscriptType');

        // Check if record already exists
        const { data: existingData } = await createQuery('transcript_types')
            .getRawQuery()
            .select()
            .eq('category', data.category)
            .eq('type', data.type)
            .eq('sub_type', data.sub_type);

        if (existingData && existingData.length > 0) {
            throw new Error('Transcript type already exists');
        }

        // Create transcript type
        const { data: transcriptType, error } = await createQuery('transcript_types')
            .getRawQuery()
            .insert(data)
            .select()
            .single();

        if (error) throw error;
        return transcriptType;
    }, 'create', 'TranscriptType');
}

/**
 * Get transcript type
 * @param {Object} params - Parameters to identify transcript type
 * @returns {Promise<Object>}
 */
export async function getTranscriptType({ category, type, sub_type }) {
    return withErrorHandling(async () => {
        validateRequired({ category, type, sub_type }, [
            'category',
            'type',
            'sub_type'
        ], 'TranscriptType');

        const { data: transcriptType, error } = await createQuery('transcript_types')
            .getRawQuery()
            .select()
            .eq('category', category)
            .eq('type', type)
            .eq('sub_type', sub_type)
            .single();

        if (error) throw error;
        return transcriptType;
    }, 'get', 'TranscriptType');
}

/**
 * List transcript types
 * @param {Object} filters - Query filters
 * @returns {Promise<Object>}
 */
export async function listTranscriptTypes(filters = {}) {
    return withErrorHandling(async () => {
        let query = createQuery('transcript_types')
            .select()
            .orderBy('category')
            .orderBy('type')
            .orderBy('sub_type');

        // Apply filters
        if (filters.category) {
            query = query.filter('category', '=', filters.category);
        }
        if (filters.type) {
            query = query.filter('type', '=', filters.type);
        }
        if (filters.search) {
            query = query.filter('category', 'ilike', `%${filters.search}%`)
                .or(`type.ilike.%${filters.search}%`)
                .or(`sub_type.ilike.%${filters.search}%`);
        }

        return await query.execute();
    }, 'list', 'TranscriptTypes');
}

/**
 * Update transcript type
 * @param {Object} params - Parameters to identify transcript type
 * @param {Object} data - Update data
 * @returns {Promise<Object>}
 */
export async function updateTranscriptType({ category, type, sub_type }, data) {
    return withErrorHandling(async () => {
        validateRequired({ category, type, sub_type }, [
            'category',
            'type',
            'sub_type'
        ], 'TranscriptType');

        // Validate types if provided
        if (Object.keys(data).length > 0) {
            validateTypes(data, {
                category_color: 'string',
                category_icon: 'string'
            }, 'TranscriptType');
        }

        // Update transcript type
        const { data: updatedTranscriptType, error } = await createQuery('transcript_types')
            .getRawQuery()
            .update(data)
            .eq('category', category)
            .eq('type', type)
            .eq('sub_type', sub_type)
            .select()
            .single();

        if (error) throw error;
        return updatedTranscriptType;
    }, 'update', 'TranscriptType');
}

/**
 * Delete transcript type
 * @param {Object} params - Parameters to identify transcript type
 * @returns {Promise<void>}
 */
export async function deleteTranscriptType({ category, type, sub_type }) {
    return withErrorHandling(async () => {
        validateRequired({ category, type, sub_type }, [
            'category',
            'type',
            'sub_type'
        ], 'TranscriptType');

        const { error } = await createQuery('transcript_types')
            .getRawQuery()
            .delete()
            .eq('category', category)
            .eq('type', type)
            .eq('sub_type', sub_type);

        if (error) throw error;
    }, 'delete', 'TranscriptType');
} 