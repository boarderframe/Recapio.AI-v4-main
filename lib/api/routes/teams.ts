import { Router } from 'express';
import { ApiHandler } from '../types';
import { NotFoundError, ValidationError, ForbiddenError, ApiError } from '../errors';
import { supabase } from '../../database/client';
import { Database } from '../../database/types';
import { validateRequest } from '../middleware/request-validator';

const router = Router();

// List teams
const listTeams: ApiHandler = async (req, res) => {
    const { tenantId } = req;
    if (!tenantId) {
        throw new ValidationError('Missing tenant ID');
    }

    const query = supabase
        .from('teams')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .range(0, Number(req.query.limit) || 10);

    if (req.query.cursor) {
        query.lt('created_at', req.query.cursor);
    }

    const { data, error } = await query;
    if (error) throw error;

    const cursor = data.length > 0 ? data[data.length - 1].created_at : null;
    res.json({ data, cursor });
};

// Get team by ID
const getTeamById: ApiHandler = async (req, res) => {
    const { tenantId } = req;
    if (!tenantId) {
        throw new ValidationError('Missing tenant ID');
    }

    const { data: team, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', req.params.id)
        .eq('tenant_id', tenantId)
        .single();

    if (error) throw error;
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

    const { data: team, error } = await supabase
        .from('teams')
        .insert({
            ...req.body,
            tenant_id: tenantId
        })
        .select()
        .single();

    if (error) throw error;

    // Check if user is team admin or owner
    if (!req.user?.id) {
        throw new ApiError('Unauthorized', 401);
    }

    const { error: memberError } = await supabase
        .from('team_members')
        .insert({
            team_id: team.id,
            user_id: req.user.id,
            tenant_id: tenantId,
            role: 'owner'
        });

    if (memberError) throw memberError;

    res.status(201).json(team);
};

// Update team
const updateTeam: ApiHandler = async (req, res) => {
    const { tenantId } = req;
    if (!tenantId) {
        throw new ValidationError('Missing tenant ID');
    }

    // Check if user is team admin or owner
    const { data: members, error: memberError } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', req.params.id)
        .eq('user_id', req.user?.id)
        .in('role', ['owner', 'admin']);

    if (memberError) throw memberError;
    if (!members.length) {
        throw new ForbiddenError('Only team admins can update team settings');
    }

    const { data: team, error } = await supabase
        .from('teams')
        .update(req.body)
        .eq('id', req.params.id)
        .eq('tenant_id', tenantId)
        .select()
        .single();

    if (error) throw error;
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
    const { data: members, error: memberError } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', req.params.id)
        .eq('user_id', req.user?.id)
        .eq('role', 'owner');

    if (memberError) throw memberError;
    if (!members.length) {
        throw new ForbiddenError('Only team owners can delete teams');
    }

    const { error } = await supabase
        .from('teams')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', req.params.id)
        .eq('tenant_id', tenantId);

    if (error) throw error;
    res.status(204).end();
};

// Add team member
const addTeamMember: ApiHandler = async (req, res) => {
    const { tenantId } = req;
    if (!tenantId) {
        throw new ValidationError('Missing tenant ID');
    }

    // Check if user is team admin or owner
    const { data: members, error: memberError } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', req.params.id)
        .eq('user_id', req.user?.id)
        .in('role', ['owner', 'admin']);

    if (memberError) throw memberError;
    if (!members.length) {
        throw new ForbiddenError('Only team admins can add members');
    }

    const { data: newMember, error } = await supabase
        .from('team_members')
        .insert({
            team_id: req.params.id,
            user_id: req.body.userId,
            tenant_id: tenantId,
            role: req.body.role || 'member'
        })
        .select()
        .single();

    if (error) throw error;
    res.status(201).json(newMember);
};

// Update team member role
const updateTeamMember: ApiHandler = async (req, res) => {
    const { tenantId } = req;
    if (!tenantId) {
        throw new ValidationError('Missing tenant ID');
    }

    // Check if user is team owner
    const { data: members, error: memberError } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', req.params.id)
        .eq('user_id', req.user?.id)
        .eq('role', 'owner');

    if (memberError) throw memberError;
    if (!members.length) {
        throw new ForbiddenError('Only team owners can update member roles');
    }

    const { data: updatedMember, error } = await supabase
        .from('team_members')
        .update({ role: req.body.role })
        .eq('id', req.params.memberId)
        .eq('tenant_id', tenantId)
        .select()
        .single();

    if (error) throw error;
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
    const { data: members, error: memberError } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', req.params.id)
        .eq('user_id', req.user?.id)
        .in('role', ['owner', 'admin']);

    if (memberError) throw memberError;
    if (!members.length) {
        throw new ForbiddenError('Only team admins can remove members');
    }

    const { error } = await supabase
        .from('team_members')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', req.params.memberId)
        .eq('tenant_id', tenantId);

    if (error) throw error;
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