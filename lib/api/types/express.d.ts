import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { BaseRecord } from '../../database/utils/query-builder';

export interface RequestWithUser extends ExpressRequest {
    user?: {
        id: string;
        email: string;
        tenantId: string;
        roles: string[];
    };
}

export interface ApiRequest<T = any> extends RequestWithUser {
    body: T;
    query: Record<string, string>;
    params: Record<string, string>;
}

export interface ApiResponse<T = any> extends ExpressResponse {
    json: (body: {
        data?: T;
        error?: string;
        message?: string;
        meta?: {
            total?: number;
            page?: number;
            pageSize?: number;
            hasMore?: boolean;
        };
    }) => void;
}

export interface ApiError extends Error {
    statusCode?: number;
    code?: string;
} 