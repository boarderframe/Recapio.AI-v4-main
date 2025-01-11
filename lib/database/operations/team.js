import { createQuery } from '../utils/query-builder';
import { withErrorHandling } from '../utils/error-handling';
import { validateRequired, validateTypes, validateEnum, validateArrayLength } from '../utils/validation';
import { withTenantIsolation, addTenantId, verifyTenantAccess, verifyRole } from '../utils/tenant-isolation';

// Constants
const TEAM_MEMBER_ROLES = ['owner', 'admin', 'member', 'viewer'];
const TEAM_MEMBER_STATUS = ['active', 'invited', 'suspended'];

/**
 * Create team
 * @param {Object} data - Team data
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function createTeam(data, tenantId) {
    return withErrorHandling(async () => {
        // Validate required fields
        validateRequired(data, [
            'name',
            'owner_id',
            'settings'
        ], 'Team');

        // Validate types
        validateTypes(data, {
            name: 'string',
            owner_id: 'string',
            settings: 'object',
            description: 'string'
        }, 'Team');

        // Add tenant ID and create team
        const teamData = addTenantId(data, tenantId);
        const { data: team, error } = await createQuery('teams')
            .getRawQuery()
            .insert(teamData)
            .select()
            .single();

        if (error) throw error;

        // Add owner as team member
        await addTeamMember({
            team_id: team.id,
            user_id: data.owner_id,
            role: 'owner',
            status: 'active'
        }, tenantId);

        return team;
    }, 'create', 'Team');
}

/**
 * Get team
 * @param {string} id - Team ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function getTeam(id, tenantId) {
    return withErrorHandling(async () => {
        const { data: team, error } = await withTenantIsolation(
            createQuery('teams')
                .getRawQuery()
                .select(`
                    *,
                    members:team_members(
                        *,
                        user:auth.users(id, email)
                    )
                `)
                .eq('id', id),
            tenantId
        ).single();

        if (error) throw error;
        verifyTenantAccess(team, tenantId, 'Team');
        return team;
    }, 'get', 'Team');
}

/**
 * List teams
 * @param {Object} filters - Query filters
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function listTeams(filters = {}, tenantId) {
    return withErrorHandling(async () => {
        let query = createQuery('teams')
            .select([
                '*',
                'members:team_members(id)',
                'owner:auth.users!owner_id(id, email)'
            ]);

        // Apply filters
        if (filters.owner_id) {
            query = query.filter('owner_id', '=', filters.owner_id);
        }

        // Add tenant isolation
        query = withTenantIsolation(query.getRawQuery(), tenantId);

        // Add ordering
        query = query.orderBy('created_at', 'desc');

        return await query.execute();
    }, 'list', 'Teams');
}

/**
 * Update team
 * @param {string} id - Team ID
 * @param {Object} data - Update data
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function updateTeam(id, data, tenantId) {
    return withErrorHandling(async () => {
        // Validate types if provided
        if (Object.keys(data).length > 0) {
            validateTypes(data, {
                name: 'string',
                settings: 'object',
                description: 'string'
            }, 'Team');
        }

        // Get existing team
        const team = await getTeam(id, tenantId);
        
        // Update team
        const { data: updatedTeam, error } = await withTenantIsolation(
            createQuery('teams')
                .getRawQuery()
                .update(data)
                .eq('id', id),
            tenantId
        ).select().single();

        if (error) throw error;
        return updatedTeam;
    }, 'update', 'Team');
}

/**
 * Delete team
 * @param {string} id - Team ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<void>}
 */
export async function deleteTeam(id, tenantId) {
    return withErrorHandling(async () => {
        // Verify team exists and belongs to tenant
        await getTeam(id, tenantId);

        const { error } = await withTenantIsolation(
            createQuery('teams')
                .getRawQuery()
                .delete()
                .eq('id', id),
            tenantId
        );

        if (error) throw error;
    }, 'delete', 'Team');
}

/**
 * Add team member
 * @param {Object} data - Team member data
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function addTeamMember(data, tenantId) {
    return withErrorHandling(async () => {
        // Validate required fields
        validateRequired(data, [
            'team_id',
            'user_id',
            'role',
            'status'
        ], 'Team Member');

        // Validate types
        validateTypes(data, {
            team_id: 'string',
            user_id: 'string',
            role: 'string',
            status: 'string',
            metadata: 'object'
        }, 'Team Member');

        // Validate enums
        validateEnum(data.role, TEAM_MEMBER_ROLES, 'role', 'Team Member');
        validateEnum(data.status, TEAM_MEMBER_STATUS, 'status', 'Team Member');

        // Verify team exists and belongs to tenant
        await getTeam(data.team_id, tenantId);

        // Add tenant ID and create team member
        const memberData = addTenantId(data, tenantId);
        const { data: member, error } = await createQuery('team_members')
            .getRawQuery()
            .insert(memberData)
            .select()
            .single();

        if (error) throw error;
        return member;
    }, 'create', 'Team Member');
}

/**
 * Get team member
 * @param {string} teamId - Team ID
 * @param {string} userId - User ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function getTeamMember(teamId, userId, tenantId) {
    return withErrorHandling(async () => {
        const { data: member, error } = await withTenantIsolation(
            createQuery('team_members')
                .getRawQuery()
                .select(`
                    *,
                    user:auth.users(*)
                `)
                .eq('team_id', teamId)
                .eq('user_id', userId),
            tenantId
        ).single();

        if (error) throw error;
        verifyTenantAccess(member, tenantId, 'Team Member');
        return member;
    }, 'get', 'Team Member');
}

/**
 * List team members
 * @param {string} teamId - Team ID
 * @param {Object} filters - Query filters
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function listTeamMembers(teamId, filters = {}, tenantId) {
    return withErrorHandling(async () => {
        let query = createQuery('team_members')
            .select([
                '*',
                'user:auth.users(id, email)'
            ])
            .filter('team_id', '=', teamId);

        // Apply filters
        if (filters.role) {
            query = query.filter('role', '=', filters.role);
        }
        if (filters.status) {
            query = query.filter('status', '=', filters.status);
        }

        // Add tenant isolation
        query = withTenantIsolation(query.getRawQuery(), tenantId);

        return await query.execute();
    }, 'list', 'Team Members');
}

/**
 * Update team member
 * @param {string} teamId - Team ID
 * @param {string} userId - User ID
 * @param {Object} data - Update data
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function updateTeamMember(teamId, userId, data, tenantId) {
    return withErrorHandling(async () => {
        // Validate types if provided
        if (Object.keys(data).length > 0) {
            validateTypes(data, {
                role: 'string',
                status: 'string',
                metadata: 'object'
            }, 'Team Member');
        }

        // Validate enums if provided
        if (data.role) {
            validateEnum(data.role, TEAM_MEMBER_ROLES, 'role', 'Team Member');
        }
        if (data.status) {
            validateEnum(data.status, TEAM_MEMBER_STATUS, 'status', 'Team Member');
        }

        // Get existing member
        const member = await getTeamMember(teamId, userId, tenantId);
        
        // Update member
        const { data: updatedMember, error } = await withTenantIsolation(
            createQuery('team_members')
                .getRawQuery()
                .update(data)
                .eq('team_id', teamId)
                .eq('user_id', userId),
            tenantId
        ).select().single();

        if (error) throw error;
        return updatedMember;
    }, 'update', 'Team Member');
}

/**
 * Remove team member
 * @param {string} teamId - Team ID
 * @param {string} userId - User ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<void>}
 */
export async function removeTeamMember(teamId, userId, tenantId) {
    return withErrorHandling(async () => {
        // Verify member exists and belongs to tenant
        const member = await getTeamMember(teamId, userId, tenantId);

        // Prevent removing the owner
        if (member.role === 'owner') {
            throw new Error('Cannot remove team owner');
        }

        const { error } = await withTenantIsolation(
            createQuery('team_members')
                .getRawQuery()
                .delete()
                .eq('team_id', teamId)
                .eq('user_id', userId),
            tenantId
        );

        if (error) throw error;
    }, 'delete', 'Team Member');
}

/**
 * Get user's teams
 * @param {string} userId - User ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>}
 */
export async function getUserTeams(userId, tenantId) {
    return withErrorHandling(async () => {
        const { data: teams, error } = await withTenantIsolation(
            createQuery('team_members')
                .getRawQuery()
                .select(`
                    team:teams(
                        *,
                        members:team_members(
                            *,
                            user:auth.users(id, email)
                        )
                    )
                `)
                .eq('user_id', userId)
                .eq('status', 'active'),
            tenantId
        );

        if (error) throw error;
        return teams?.map(t => t.team) || [];
    }, 'list', 'User Teams');
}

/**
 * Check if user has team role
 * @param {string} teamId - Team ID
 * @param {string} userId - User ID
 * @param {string[]} roles - Allowed roles
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<boolean>}
 */
export async function checkTeamRole(teamId, userId, roles, tenantId) {
    return withErrorHandling(async () => {
        const member = await getTeamMember(teamId, userId, tenantId);
        return member && roles.includes(member.role);
    }, 'check', 'Team Role');
} 