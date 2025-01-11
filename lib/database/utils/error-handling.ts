export const ErrorCodes = {
    NOT_FOUND: 'NOT_FOUND',
    DUPLICATE: 'DUPLICATE',
    VALIDATION: 'VALIDATION',
    FOREIGN_KEY: 'FOREIGN_KEY',
    PERMISSION: 'PERMISSION',
    TRANSACTION: 'TRANSACTION',
    UNKNOWN: 'UNKNOWN'
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

export class DatabaseError extends Error {
    constructor(
        message: string,
        public code: ErrorCode,
        public cause?: Error
    ) {
        super(message);
        this.name = 'DatabaseError';
    }
} 