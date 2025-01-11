import { Request, Response } from 'express';

export interface User {
    id: string;
    email: string;
    name?: string;
    tenantId: string;
    roles: string[];
}

export interface ApiRequest extends Request {
    tenantId?: string;
    user?: User;
}

export interface ApiResponse extends Response {
    json(body: any): this;
}

export type ApiHandler = (
    req: ApiRequest,
    res: ApiResponse
) => Promise<void> | void; 