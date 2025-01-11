import { Router } from 'express';
import { ApiHandler } from '../types';
import { NotFoundError, ValidationError, ForbiddenError } from '../errors';
import { QueryBuilder } from '../../database/utils/query-builder';
import { supabase } from '../../database/client';
import { Database } from '../../database/types';

const router = Router();
const teams = new QueryBuilder<'teams'>(
    'teams',
    supabase
);
const teamMembers = new QueryBuilder<'team_members'>(
    'team_members',
    supabase
);

// List teams
const listTeams: ApiHandler = async (req, res) => {
    const { tenantId } = req;
    if (!tenantId) {
        throw new ValidationError('Missing tenant ID');
    }

    const { data, cursor } = await teams.list({
        tenantId,
        cursor: req.query.cursor as string,
        limit: Number(req.query.limit) || 10,
        whereConditions: req.query.where as any
    });
    res.json({ data, cursor });
};

// Get team by ID
const getTeamById: ApiHandler = async (req, res) => {
    const { tenantId } = req;
    if (!tenantId) {
        throw new ValidationError('Missing tenant ID');
    }

    const team = await teams.getById(req.params.id, tenantId);
    if (!team) {
        throw new NotFoundError('Team');
    }
    res.json(team);
};

// Create team
const createTeam: ApiHandler = async (req, res) => {
    const { tenantId } = req;
    if (!tenantId) {
        throw new ValidationError('Missing tenant ID');
    }

    const team = await teams.create({
        ...req.body,
        tenant_id: tenantId
    });

    // Create team member record for the creator as owner
    await teamMembers.create({
        team_id: team.id,
        user_id: req.user?.id,
        tenant_id: tenantId,
        role: 'owner'
    });

    res.status(201).json(team);
};

// Update team
const updateTeam: ApiHandler = async (req, res) => {
    const { tenantId } = req;
    if (!tenantId) {
        throw new ValidationError('Missing tenant ID');
    }

    // Check if user is team admin or owner
    const member = await teamMembers.list({
        tenantId,
        whereConditions: [
            { field: 'team_id', operator: 'eq', value: req.params.id },
            { field: 'user_id', operator: 'eq', value: req.user?.id },
            { field: 'role', operator: 'in', value: ['owner', 'admin'] }
        ]
    });

    if (!member.data.length) {
        throw new ForbiddenError('Only team admins can update team settings');
    }

    const team = await teams.update(req.params.id, req.body, tenantId);
    if (!team) {
        throw new NotFoundError('Team');
    }
    res.json(team);
};

// Delete team
const deleteTeam: ApiHandler = async (req, res) => {
    const { tenantId } = req;
    if (!tenantId) {
        throw new ValidationError('Missing tenant ID');
    }

    // Check if user is team owner
    const member = await teamMembers.list({
        tenantId,
        whereConditions: [
            { field: 'team_id', operator: 'eq', value: req.params.id },
            { field: 'user_id', operator: 'eq', value: req.user?.id },
            { field: 'role', operator: 'eq', value: 'owner' }
        ]
    });

    if (!member.data.length) {
        throw new ForbiddenError('Only team owners can delete teams');
    }

    await teams.softDelete(req.params.id, tenantId);
    res.status(204).end();
};

// Add team member
const addTeamMember: ApiHandler = async (req, res) => {
    const { tenantId } = req;
    if (!tenantId) {
        throw new ValidationError('Missing tenant ID');
    }

    // Check if user is team admin or owner
    const member = await teamMembers.list({
        tenantId,
        whereConditions: [
            { field: 'team_id', operator: 'eq', value: req.params.id },
            { field: 'user_id', operator: 'eq', value: req.user?.id },
            { field: 'role', operator: 'in', value: ['owner', 'admin'] }
        ]
    });

    if (!member.data.length) {
        throw new ForbiddenError('Only team admins can add members');
    }

    const newMember = await teamMembers.create({
        team_id: req.params.id,
        user_id: req.body.userId,
        tenant_id: tenantId,
        role: req.body.role || 'member'
    });

    res.status(201).json(newMember);
};

// Update team member role
const updateTeamMember: ApiHandler = async (req, res) => {
    const { tenantId } = req;
    if (!tenantId) {
        throw new ValidationError('Missing tenant ID');
    }

    // Check if user is team owner
    const member = await teamMembers.list({
        tenantId,
        whereConditions: [
            { field: 'team_id', operator: 'eq', value: req.params.id },
            { field: 'user_id', operator: 'eq', value: req.user?.id },
            { field: 'role', operator: 'eq', value: 'owner' }
        ]
    });

    if (!member.data.length) {
        throw new ForbiddenError('Only team owners can update member roles');
    }

    const updatedMember = await teamMembers.update(
        req.params.memberId,
        { role: req.body.role },
        tenantId
    );

    if (!updatedMember) {
        throw new NotFoundError('Team member');
    }

    res.json(updatedMember);
};

// Remove team member
const removeTeamMember: ApiHandler = async (req, res) => {
    const { tenantId } = req;
    if (!tenantId) {
        throw new ValidationError('Missing tenant ID');
    }

    // Check if user is team admin or owner
    const member = await teamMembers.list({
        tenantId,
        whereConditions: [
            { field: 'team_id', operator: 'eq', value: req.params.id },
            { field: 'user_id', operator: 'eq', value: req.user?.id },
            { field: 'role', operator: 'in', value: ['owner', 'admin'] }
        ]
    });

    if (!member.data.length) {
        throw new ForbiddenError('Only team admins can remove members');
    }

    await teamMembers.softDelete(req.params.memberId, tenantId);
    res.status(204).end();
};

// Mount routes
router.get('/', listTeams);
router.get('/:id', getTeamById);
router.post('/', createTeam);
router.put('/:id', updateTeam);
router.delete('/:id', deleteTeam);

// Team member routes
router.post('/:id/members', addTeamMember);
router.put('/:id/members/:memberId', updateTeamMember);
router.delete('/:id/members/:memberId', removeTeamMember);

export { router as teamRoutes }; 