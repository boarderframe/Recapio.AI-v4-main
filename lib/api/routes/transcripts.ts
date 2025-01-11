import { Router } from 'express';
import { ApiHandler } from '../types';
import { NotFoundError, ValidationError } from '../errors';
import { QueryBuilder } from '../../database/utils/query-builder';
import { supabase } from '../../database/client';
import { Database } from '../../database/types';

const router = Router();
const transcripts = new QueryBuilder<'transcripts'>(
    'transcripts',
    supabase
);

// List transcripts
const listTranscripts: ApiHandler = async (req, res) => {
    const { tenantId } = req;
    if (!tenantId) {
        throw new ValidationError('Missing tenant ID');
    }

    const { data, cursor } = await transcripts.list({
        tenantId,
        cursor: req.query.cursor as string,
        limit: Number(req.query.limit) || 10,
        whereConditions: req.query.where as any
    });
    res.json({ data, cursor });
};

// Get transcript by ID
const getTranscriptById: ApiHandler = async (req, res) => {
    const { tenantId } = req;
    if (!tenantId) {
        throw new ValidationError('Missing tenant ID');
    }

    const transcript = await transcripts.getById(req.params.id, tenantId);
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

    const transcript = await transcripts.create({
        ...req.body,
        tenant_id: tenantId
    });
    res.status(201).json(transcript);
};

// Update transcript
const updateTranscript: ApiHandler = async (req, res) => {
    const { tenantId } = req;
    if (!tenantId) {
        throw new ValidationError('Missing tenant ID');
    }

    const transcript = await transcripts.update(req.params.id, req.body, tenantId);
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

    await transcripts.softDelete(req.params.id, tenantId);
    res.status(204).end();
};

// Mount routes
router.get('/', listTranscripts);
router.get('/:id', getTranscriptById);
router.post('/', createTranscript);
router.put('/:id', updateTranscript);
router.delete('/:id', deleteTranscript);

export { router as transcriptRoutes }; 