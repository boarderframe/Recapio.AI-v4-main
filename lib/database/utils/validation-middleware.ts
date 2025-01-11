import { DatabaseError, ErrorCodes } from './error-handling';
import {
    validateRequired,
    validateTypes,
    validateEnum,
    validateRange,
    validateLength,
    validateDateRange,
    validateArrayLength
} from './validation';

export interface ValidationSchema {
    required?: string[];
    types?: Record<string, string>;
    enums?: Record<string, string[]>;
    ranges?: Record<string, { min?: number; max?: number }>;
    lengths?: Record<string, { min?: number; max?: number }>;
    dateRanges?: Record<string, { min?: string; max?: string }>;
    arrayLengths?: Record<string, { min?: number; max?: number }>;
    custom?: Record<string, (value: any) => boolean | Promise<boolean>>;
}

export interface ValidationOptions {
    schema: ValidationSchema;
    resource: string;
    sanitize?: boolean;
    transformers?: Record<string, (value: any) => any>;
}

/**
 * Sanitize data by removing HTML tags and special characters
 * @param {any} value - Value to sanitize
 * @returns {any} Sanitized value
 */
function sanitizeValue(value: any): any {
    if (typeof value === 'string') {
        // Remove HTML tags
        value = value.replace(/<[^>]*>/g, '');
        // Remove special characters but keep basic punctuation
        value = value.replace(/[^\w\s.,!?-]/g, '');
        // Trim whitespace
        value = value.trim();
        // Convert multiple spaces to single space
        value = value.replace(/\s+/g, ' ');
    } else if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
            return value.map(sanitizeValue);
        } else {
            const sanitized: Record<string, any> = {};
            for (const [key, val] of Object.entries(value)) {
                sanitized[key] = sanitizeValue(val);
            }
            return sanitized;
        }
    }
    return value;
}

/**
 * Validate and optionally sanitize data based on schema
 * @param {Record<string, any>} data - Data to validate
 * @param {ValidationOptions} options - Validation options
 * @returns {Promise<Record<string, any>>} Validated and transformed data
 * @throws {DatabaseError}
 */
export async function validateData(
    data: Record<string, any>,
    options: ValidationOptions
): Promise<Record<string, any>> {
    const { schema, resource, sanitize = true, transformers = {} } = options;
    let validatedData = { ...data };

    try {
        // Sanitize input if enabled
        if (sanitize) {
            validatedData = sanitizeValue(validatedData);
        }

        // Required fields validation
        if (schema.required) {
            validateRequired(validatedData, schema.required, resource);
        }

        // Type validation
        if (schema.types) {
            validateTypes(validatedData, schema.types, resource);
        }

        // Enum validation
        if (schema.enums) {
            for (const [field, allowedValues] of Object.entries(schema.enums)) {
                if (validatedData[field] !== undefined) {
                    validateEnum(validatedData[field], allowedValues, field, resource);
                }
            }
        }

        // Range validation
        if (schema.ranges) {
            for (const [field, range] of Object.entries(schema.ranges)) {
                if (validatedData[field] !== undefined) {
                    validateRange(validatedData[field], range, field, resource);
                }
            }
        }

        // Length validation
        if (schema.lengths) {
            for (const [field, length] of Object.entries(schema.lengths)) {
                if (validatedData[field] !== undefined) {
                    validateLength(validatedData[field], length, field, resource);
                }
            }
        }

        // Date range validation
        if (schema.dateRanges) {
            for (const [field, range] of Object.entries(schema.dateRanges)) {
                if (validatedData[field] !== undefined) {
                    validateDateRange(validatedData[field], range, field, resource);
                }
            }
        }

        // Array length validation
        if (schema.arrayLengths) {
            for (const [field, length] of Object.entries(schema.arrayLengths)) {
                if (validatedData[field] !== undefined) {
                    validateArrayLength(validatedData[field], length, field, resource);
                }
            }
        }

        // Custom validation
        if (schema.custom) {
            for (const [field, validator] of Object.entries(schema.custom)) {
                if (validatedData[field] !== undefined) {
                    const isValid = await validator(validatedData[field]);
                    if (!isValid) {
                        throw new DatabaseError(
                            `Custom validation failed for ${field} in ${resource}`,
                            ErrorCodes.VALIDATION
                        );
                    }
                }
            }
        }

        // Apply transformers
        for (const [field, transformer] of Object.entries(transformers)) {
            if (validatedData[field] !== undefined) {
                validatedData[field] = transformer(validatedData[field]);
            }
        }

        return validatedData;
    } catch (error: unknown) {
        if (error instanceof DatabaseError) {
            throw error;
        }
        if (error instanceof Error) {
            throw new DatabaseError(
                `Validation failed for ${resource}: ${error.message}`,
                ErrorCodes.VALIDATION
            );
        }
        throw new DatabaseError(
            `Validation failed for ${resource}: Unknown error`,
            ErrorCodes.VALIDATION
        );
    }
} 