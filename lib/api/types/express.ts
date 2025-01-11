import { Request, Response } from 'express';

export interface User {
    id: string;
    email: string;
    tenantId: string;
    roles: string[];
}

export interface ApiRequest<T = any> extends Request {
    user?: User;
    body: T;
}

export interface ApiResponseBody<T = any> {
    data?: T;
    error?: string;
    message?: string;
    meta?: {
        total?: number;
        page?: number;
        pageSize?: number;
        hasMore?: boolean;
        [key: string]: any;
    };
    code?: string;
}

export interface ApiResponse<T = any> extends Response {
    json(body: ApiResponseBody<T>): this;
    status(code: number): this;
}

export type ApiHandler<T = any> = (
    req: ApiRequest,
    res: ApiResponse<T>,
    next: (error?: any) => void
) => Promise<void>; 