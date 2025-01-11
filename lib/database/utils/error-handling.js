/**
 * Custom error class for database operations
 */
export class DatabaseError extends Error {
    constructor(message, code, originalError = null) {
        super(message);
        this.name = 'DatabaseError';
        this.code = code;
        this.originalError = originalError;
    }
}

/**
 * Error codes for database operations
 */
export const ErrorCodes = {
    NOT_FOUND: 'NOT_FOUND',
    DUPLICATE: 'DUPLICATE',
    VALIDATION: 'VALIDATION',
    FOREIGN_KEY: 'FOREIGN_KEY',
    PERMISSION: 'PERMISSION',
    UNKNOWN: 'UNKNOWN'
};

/**
 * Handle database operation errors
 * @param {Error} error - The error to handle
 * @param {string} operation - The operation being performed
 * @param {string} resource - The resource being operated on
 * @returns {DatabaseError}
 */
export function handleDatabaseError(error, operation, resource) {
    console.error(`Database error during ${operation} on ${resource}:`, error);

    if (error instanceof DatabaseError) {
        return error;
    }

    // Handle Supabase specific errors
    if (error.code) {
        switch (error.code) {
            case '23505': // unique_violation
                return new DatabaseError(
                    `Duplicate entry for ${resource}`,
                    ErrorCodes.DUPLICATE,
                    error
                );
            case '23503': // foreign_key_violation
                return new DatabaseError(
                    `Referenced record not found for ${resource}`,
                    ErrorCodes.FOREIGN_KEY,
                    error
                );
            case '42P01': // undefined_table
                return new DatabaseError(
                    `Table not found for ${resource}`,
                    ErrorCodes.NOT_FOUND,
                    error
                );
            case '42501': // insufficient_privilege
                return new DatabaseError(
                    `Permission denied for ${operation} on ${resource}`,
                    ErrorCodes.PERMISSION,
                    error
                );
            default:
                return new DatabaseError(
                    `Unknown error during ${operation} on ${resource}`,
                    ErrorCodes.UNKNOWN,
                    error
                );
        }
    }

    return new DatabaseError(
        error.message || `Error during ${operation} on ${resource}`,
        ErrorCodes.UNKNOWN,
        error
    );
}

/**
 * Wrap a database operation with error handling
 * @param {Function} operation - The database operation to perform
 * @param {string} operationName - The name of the operation
 * @param {string} resource - The resource being operated on
 * @returns {Promise<any>}
 */
export async function withErrorHandling(operation, operationName, resource) {
    try {
        return await operation();
    } catch (error) {
        throw handleDatabaseError(error, operationName, resource);
    }
} 