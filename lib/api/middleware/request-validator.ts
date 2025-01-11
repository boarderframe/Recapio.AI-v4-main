import { NextFunction } from 'express';
import { ApiRequest, ApiResponse } from '../types';
import { ValidationError } from '../errors';

export function validateRequest(
    req: ApiRequest,
    res: ApiResponse,
    next: NextFunction
): void {
    // Validate required headers
    if (!req.headers['x-tenant-id']) {
        next(new ValidationError('Missing required header: x-tenant-id'));
        return;
    }

    // Validate content type for POST/PUT/PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && !req.is('application/json')) {
        next(new ValidationError('Content-Type must be application/json'));
        return;
    }

    // Validate request body for POST/PUT/PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && !req.body) {
        next(new ValidationError('Request body is required'));
        return;
    }

    next();
} 