import { Router } from 'express';
import { ApiHandler } from '../types';
import { NotFoundError, ValidationError } from '../errors';
import { supabase } from '../../database/client';
import { Database } from '../../database/types';

const router = Router();

// List transcripts
const listTranscripts: ApiHandler = async (req, res) => {
    const { tenantId } = req;
    if (!tenantId) {
        throw new ValidationError('Missing tenant ID');
    }

    const query = supabase
        .from('transcripts')
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

// Get transcript by ID
const getTranscriptById: ApiHandler = async (req, res) => {
    const { tenantId } = req;
    if (!tenantId) {
        throw new ValidationError('Missing tenant ID');
    }

    const { data: transcript, error } = await supabase
        .from('transcripts')
        .select('*')
        .eq('id', req.params.id)
        .eq('tenant_id', tenantId)
        .single();

    if (error) throw error;
    if (!transcript) {
        throw new NotFoundError('Transcript');
    }
    res.json(transcript);
};

// Create transcript
const createTranscript: ApiHandler = async (req, res) => {
    const { tenantId } = req;
    if (!tenantId) {
        throw new ValidationError('Missing tenant ID');
    }

    const { data: transcript, error } = await supabase
        .from('transcripts')
        .insert({
            ...req.body,
            tenant_id: tenantId
        })
        .select()
        .single();

    if (error) throw error;
    res.status(201).json(transcript);
};

// Update transcript
const updateTranscript: ApiHandler = async (req, res) => {
    const { tenantId } = req;
    if (!tenantId) {
        throw new ValidationError('Missing tenant ID');
    }

    const { data: transcript, error } = await supabase
        .from('transcripts')
        .update(req.body)
        .eq('id', req.params.id)
        .eq('tenant_id', tenantId)
        .select()
        .single();

    if (error) throw error;
    if (!transcript) {
        throw new NotFoundError('Transcript');
    }
    res.json(transcript);
};

// Delete transcript
const deleteTranscript: ApiHandler = async (req, res) => {
    const { tenantId } = req;
    if (!tenantId) {
        throw new ValidationError('Missing tenant ID');
    }

    const { error } = await supabase
        .from('transcripts')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', req.params.id)
        .eq('tenant_id', tenantId);

    if (error) throw error;
    res.status(204).end();
};

// Mount routes
router.get('/', listTranscripts);
router.get('/:id', getTranscriptById);
router.post('/', createTranscript);
router.put('/:id', updateTranscript);
router.delete('/:id', deleteTranscript);

export { router as transcriptRoutes }; 