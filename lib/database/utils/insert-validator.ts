import { DatabaseError, ErrorCodes } from './error-handling';
import { validateData, ValidationSchema, ValidationOptions } from './validation-middleware';

export interface InsertValidationSchema extends ValidationSchema {
    uniqueConstraints?: string[];
    foreignKeys?: Record<string, {
        table: string;
        field: string;
    }>;
}

export interface InsertValidationOptions extends ValidationOptions {
    schema: InsertValidationSchema;
    client: any; // Supabase client type will be added later
}

/**
 * Check if a value exists in a table
 * @param {any} client - Database client
 * @param {string} table - Table name
 * @param {string} field - Field name
 * @param {any} value - Value to check
 * @returns {Promise<boolean>} True if value exists
 */
async function checkExists(
    client: any,
    table: string,
    field: string,
    value: any
): Promise<boolean> {
    const { data, error } = await client
        .from(table)
        .select(field)
        .eq(field, value)
        .limit(1);

    if (error) {
        throw new DatabaseError(
            `Failed to check existence in ${table}: ${error.message}`,
            ErrorCodes.VALIDATION
        );
    }

    return data && data.length > 0;
}

/**
 * Check if a value is unique in a table
 * @param {any} client - Database client
 * @param {string} table - Table name
 * @param {string} field - Field name
 * @param {any} value - Value to check
 * @returns {Promise<boolean>} True if value is unique
 */
async function checkUnique(
    client: any,
    table: string,
    field: string,
    value: any
): Promise<boolean> {
    const { data, error } = await client
        .from(table)
        .select(field)
        .eq(field, value)
        .limit(1);

    if (error) {
        throw new DatabaseError(
            `Failed to check uniqueness in ${table}: ${error.message}`,
            ErrorCodes.VALIDATION
        );
    }

    return !data || data.length === 0;
}

/**
 * Validate data for insert operations
 * @param {Record<string, any>} data - Data to validate
 * @param {InsertValidationOptions} options - Validation options
 * @returns {Promise<Record<string, any>>} Validated and transformed data
 * @throws {DatabaseError}
 */
export async function validateInsert(
    data: Record<string, any>,
    options: InsertValidationOptions
): Promise<Record<string, any>> {
    const { schema, client, resource } = options;

    // First, validate using the base validation middleware
    let validatedData = await validateData(data, options);

    try {
        // Check unique constraints
        if (schema.uniqueConstraints) {
            for (const field of schema.uniqueConstraints) {
                if (validatedData[field] !== undefined) {
                    const isUnique = await checkUnique(
                        client,
                        options.resource,
                        field,
                        validatedData[field]
                    );
                    if (!isUnique) {
                        throw new DatabaseError(
                            `Value for ${field} must be unique in ${resource}`,
                            ErrorCodes.VALIDATION
                        );
                    }
                }
            }
        }

        // Check foreign key constraints
        if (schema.foreignKeys) {
            for (const [field, { table, field: foreignField }] of Object.entries(schema.foreignKeys)) {
                if (validatedData[field] !== undefined) {
                    const exists = await checkExists(
                        client,
                        table,
                        foreignField,
                        validatedData[field]
                    );
                    if (!exists) {
                        throw new DatabaseError(
                            `Invalid foreign key reference for ${field} in ${resource}`,
                            ErrorCodes.VALIDATION
                        );
                    }
                }
            }
        }

        // Add automatic timestamps
        validatedData.created_at = new Date().toISOString();
        validatedData.updated_at = new Date().toISOString();

        return validatedData;
    } catch (error: unknown) {
        if (error instanceof DatabaseError) {
            throw error;
        }
        if (error instanceof Error) {
            throw new DatabaseError(
                `Insert validation failed for ${resource}: ${error.message}`,
                ErrorCodes.VALIDATION
            );
        }
        throw new DatabaseError(
            `Insert validation failed for ${resource}: Unknown error`,
            ErrorCodes.VALIDATION
        );
    }
} 