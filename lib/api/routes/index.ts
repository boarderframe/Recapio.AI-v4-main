import { Router } from 'express';
import { transcriptRoutes } from './transcripts';
import { teamRoutes } from './teams';
import { authRoutes } from './auth';
import { rateLimit } from '../middleware/rate-limiter';
import { errorHandler } from '../middleware/error-handler';
import { validateRequest } from '../middleware/request-validator';
import { requireAuth } from '../middleware/auth';

// Create base router
const router = Router();

// API version prefix
const API_VERSION = '/v1';

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Apply global middleware
router.use(rateLimit);
router.use(validateRequest);

// Mount auth routes (no auth required)
router.use(`${API_VERSION}/auth`, authRoutes);

// Protected routes
router.use(`${API_VERSION}/transcripts`, requireAuth, transcriptRoutes);
router.use(`${API_VERSION}/teams`, requireAuth, teamRoutes);

// Add more resource routes here as we implement them
// router.use(`${API_VERSION}/users`, userRoutes);
// etc...

// Error handling middleware should be last
router.use(errorHandler);

export { router as apiRouter }; 