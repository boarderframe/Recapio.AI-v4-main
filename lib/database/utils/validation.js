import { DatabaseError, ErrorCodes } from './error-handling.js';

/**
 * Validate required fields in data object
 * @param {Object} data - Data to validate
 * @param {string[]} requiredFields - Array of required field names
 * @param {string} resource - Resource name for error messages
 * @throws {DatabaseError}
 */
export function validateRequired(data, requiredFields, resource) {
    const missingFields = requiredFields.filter(field => {
        const value = data[field];
        return value === undefined || value === null || value === '';
    });

    if (missingFields.length > 0) {
        throw new DatabaseError(
            `Missing required fields for ${resource}: ${missingFields.join(', ')}`,
            ErrorCodes.VALIDATION
        );
    }
}

/**
 * Validate field types in data object
 * @param {Object} data - Data to validate
 * @param {Object} typeDefinitions - Object mapping field names to expected types
 * @param {string} resource - Resource name for error messages
 * @throws {DatabaseError}
 */
export function validateTypes(data, typeDefinitions, resource) {
    const typeErrors = [];

    Object.entries(typeDefinitions).forEach(([field, expectedType]) => {
        if (data[field] !== undefined && data[field] !== null) {
            const actualType = typeof data[field];
            if (actualType !== expectedType) {
                typeErrors.push(`${field} (expected ${expectedType}, got ${actualType})`);
            }
        }
    });

    if (typeErrors.length > 0) {
        throw new DatabaseError(
            `Type validation failed for ${resource}: ${typeErrors.join(', ')}`,
            ErrorCodes.VALIDATION
        );
    }
}

/**
 * Validate enum values
 * @param {string} value - Value to validate
 * @param {string[]} allowedValues - Array of allowed values
 * @param {string} field - Field name for error messages
 * @param {string} resource - Resource name for error messages
 * @throws {DatabaseError}
 */
export function validateEnum(value, allowedValues, field, resource) {
    if (!allowedValues.includes(value)) {
        throw new DatabaseError(
            `Invalid ${field} for ${resource}. Allowed values: ${allowedValues.join(', ')}`,
            ErrorCodes.VALIDATION
        );
    }
}

/**
 * Validate numeric range
 * @param {number} value - Value to validate
 * @param {Object} range - Object with min and max values
 * @param {string} field - Field name for error messages
 * @param {string} resource - Resource name for error messages
 * @throws {DatabaseError}
 */
export function validateRange(value, { min, max }, field, resource) {
    if (min !== undefined && value < min) {
        throw new DatabaseError(
            `${field} must be at least ${min} for ${resource}`,
            ErrorCodes.VALIDATION
        );
    }
    if (max !== undefined && value > max) {
        throw new DatabaseError(
            `${field} must be at most ${max} for ${resource}`,
            ErrorCodes.VALIDATION
        );
    }
}

/**
 * Validate string length
 * @param {string} value - Value to validate
 * @param {Object} length - Object with min and max lengths
 * @param {string} field - Field name for error messages
 * @param {string} resource - Resource name for error messages
 * @throws {DatabaseError}
 */
export function validateLength(value, { min, max }, field, resource) {
    if (min !== undefined && value.length < min) {
        throw new DatabaseError(
            `${field} must be at least ${min} characters for ${resource}`,
            ErrorCodes.VALIDATION
        );
    }
    if (max !== undefined && value.length > max) {
        throw new DatabaseError(
            `${field} must be at most ${max} characters for ${resource}`,
            ErrorCodes.VALIDATION
        );
    }
}

/**
 * Validate date range
 * @param {Date} date - Date to validate
 * @param {Object} range - Object with min and max dates
 * @param {string} field - Field name for error messages
 * @param {string} resource - Resource name for error messages
 * @throws {DatabaseError}
 */
export function validateDateRange(date, { min, max }, field, resource) {
    const dateValue = new Date(date).getTime();
    
    if (min && dateValue < new Date(min).getTime()) {
        throw new DatabaseError(
            `${field} must be after ${min} for ${resource}`,
            ErrorCodes.VALIDATION
        );
    }
    if (max && dateValue > new Date(max).getTime()) {
        throw new DatabaseError(
            `${field} must be before ${max} for ${resource}`,
            ErrorCodes.VALIDATION
        );
    }
}

/**
 * Validate array length
 * @param {Array} array - Array to validate
 * @param {Object} length - Object with min and max lengths
 * @param {string} field - Field name for error messages
 * @param {string} resource - Resource name for error messages
 * @throws {DatabaseError}
 */
export function validateArrayLength(array, { min, max }, field, resource) {
    if (min !== undefined && array.length < min) {
        throw new DatabaseError(
            `${field} must have at least ${min} items for ${resource}`,
            ErrorCodes.VALIDATION
        );
    }
    if (max !== undefined && array.length > max) {
        throw new DatabaseError(
            `${field} must have at most ${max} items for ${resource}`,
            ErrorCodes.VALIDATION
        );
    }
} 