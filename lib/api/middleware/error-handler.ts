import { NextFunction } from 'express';
import { ApiRequest, ApiResponse } from '../types';
import { ApiError } from '../errors';

export function errorHandler(
    error: Error,
    req: ApiRequest,
    res: ApiResponse,
    next: NextFunction
): void {
    console.error('Error:', error);

    if (error instanceof ApiError) {
        res.status(error.statusCode).json({
            error: error.message,
            code: error.code,
            details: error.details
        });
        return;
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
        res.status(400).json({
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: error.message
        });
        return;
    }

    // Handle database errors
    if (error.name === 'DatabaseError') {
        res.status(500).json({
            error: 'Database error occurred',
            code: 'DATABASE_ERROR'
        });
        return;
    }

    // Default error response
    res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR'
    });
} 