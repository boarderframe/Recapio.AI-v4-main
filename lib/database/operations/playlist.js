import { createQuery } from '../utils/query-builder';
import { withErrorHandling } from '../utils/error-handling';
import { validateRequired, validateTypes, validateArrayLength } from '../utils/validation';
import { withTenantIsolation, addTenantId, verifyTenantAccess } from '../utils/tenant-isolation';

/**
 * Create playlist
 * @param {Object} data - Playlist data
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function createPlaylist(data, tenantId) {
    return withErrorHandling(async () => {
        // Validate required fields
        validateRequired(data, [
            'name',
            'description',
            'user_id'
        ], 'Playlist');

        // Validate types
        validateTypes(data, {
            name: 'string',
            description: 'string',
            user_id: 'string',
            is_public: 'boolean'
        }, 'Playlist');

        // Add tenant ID and create playlist
        const playlistData = addTenantId(data, tenantId);
        const { data: playlist, error } = await createQuery('playlists')
            .getRawQuery()
            .insert(playlistData)
            .select()
            .single();

        if (error) throw error;
        return playlist;
    }, 'create', 'Playlist');
}

/**
 * Get playlist
 * @param {string} id - Playlist ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function getPlaylist(id, tenantId) {
    return withErrorHandling(async () => {
        const { data: playlist, error } = await withTenantIsolation(
            createQuery('playlists')
                .getRawQuery()
                .select(`
                    *,
                    items:playlist_items(
                        *,
                        output_file:output_files(
                            *,
                            type:output_types(*)
                        )
                    )
                `)
                .eq('id', id),
            tenantId
        ).single();

        if (error) throw error;
        verifyTenantAccess(playlist, tenantId, 'Playlist');
        return playlist;
    }, 'get', 'Playlist');
}

/**
 * List playlists
 * @param {Object} filters - Query filters
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function listPlaylists(filters = {}, tenantId) {
    return withErrorHandling(async () => {
        let query = createQuery('playlists')
            .select([
                '*',
                'items:playlist_items(id)',
                'user:auth.users(id, email)'
            ]);

        // Apply filters
        if (filters.user_id) {
            query = query.filter('user_id', '=', filters.user_id);
        }
        if (filters.is_public !== undefined) {
            query = query.filter('is_public', '=', filters.is_public);
        }

        // Add tenant isolation
        query = withTenantIsolation(query.getRawQuery(), tenantId);

        // Add ordering
        query = query.orderBy('created_at', 'desc');

        return await query.execute();
    }, 'list', 'Playlists');
}

/**
 * Update playlist
 * @param {string} id - Playlist ID
 * @param {Object} data - Update data
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function updatePlaylist(id, data, tenantId) {
    return withErrorHandling(async () => {
        // Validate types if provided
        if (Object.keys(data).length > 0) {
            validateTypes(data, {
                name: 'string',
                description: 'string',
                is_public: 'boolean'
            }, 'Playlist');
        }

        // Get existing playlist
        const playlist = await getPlaylist(id, tenantId);
        
        // Update playlist
        const { data: updatedPlaylist, error } = await withTenantIsolation(
            createQuery('playlists')
                .getRawQuery()
                .update(data)
                .eq('id', id),
            tenantId
        ).select().single();

        if (error) throw error;
        return updatedPlaylist;
    }, 'update', 'Playlist');
}

/**
 * Delete playlist
 * @param {string} id - Playlist ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<void>}
 */
export async function deletePlaylist(id, tenantId) {
    return withErrorHandling(async () => {
        // Verify playlist exists and belongs to tenant
        await getPlaylist(id, tenantId);

        const { error } = await withTenantIsolation(
            createQuery('playlists')
                .getRawQuery()
                .delete()
                .eq('id', id),
            tenantId
        );

        if (error) throw error;
    }, 'delete', 'Playlist');
}

/**
 * Add items to playlist
 * @param {string} playlistId - Playlist ID
 * @param {Array<Object>} items - Array of items to add
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Array<Object>>}
 */
export async function addPlaylistItems(playlistId, items, tenantId) {
    return withErrorHandling(async () => {
        // Validate items array
        validateArrayLength(items, { min: 1 }, 'items', 'Playlist Items');

        // Verify playlist exists and belongs to tenant
        const playlist = await getPlaylist(playlistId, tenantId);

        // Prepare items data
        const itemsData = items.map((item, index) => ({
            ...item,
            playlist_id: playlistId,
            order: (playlist.items?.length || 0) + index + 1,
            tenant_id: tenantId
        }));

        // Add items
        const { data: addedItems, error } = await createQuery('playlist_items')
            .getRawQuery()
            .insert(itemsData)
            .select();

        if (error) throw error;
        return addedItems;
    }, 'create', 'Playlist Items');
}

/**
 * Remove items from playlist
 * @param {string} playlistId - Playlist ID
 * @param {Array<string>} itemIds - Array of item IDs to remove
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<void>}
 */
export async function removePlaylistItems(playlistId, itemIds, tenantId) {
    return withErrorHandling(async () => {
        // Validate items array
        validateArrayLength(itemIds, { min: 1 }, 'itemIds', 'Playlist Items');

        // Verify playlist exists and belongs to tenant
        await getPlaylist(playlistId, tenantId);

        const { error } = await withTenantIsolation(
            createQuery('playlist_items')
                .getRawQuery()
                .delete()
                .eq('playlist_id', playlistId)
                .in('id', itemIds),
            tenantId
        );

        if (error) throw error;
    }, 'delete', 'Playlist Items');
}

/**
 * Reorder playlist items
 * @param {string} playlistId - Playlist ID
 * @param {Array<{id: string, order: number}>} itemOrders - New item orders
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<void>}
 */
export async function reorderPlaylistItems(playlistId, itemOrders, tenantId) {
    return withErrorHandling(async () => {
        // Validate items array
        validateArrayLength(itemOrders, { min: 1 }, 'itemOrders', 'Playlist Items');

        // Verify playlist exists and belongs to tenant
        await getPlaylist(playlistId, tenantId);

        // Update each item's order
        for (const { id, order } of itemOrders) {
            const { error } = await withTenantIsolation(
                createQuery('playlist_items')
                    .getRawQuery()
                    .update({ order })
                    .eq('id', id)
                    .eq('playlist_id', playlistId),
                tenantId
            );

            if (error) throw error;
        }
    }, 'update', 'Playlist Items');
} 