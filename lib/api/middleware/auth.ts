import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    // TODO: Implement proper auth middleware
    // For now, just pass through
    next();
}; 