import { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseError, ErrorCodes } from './error-handling';

export interface TransactionOperation<T = any> {
    execute: () => Promise<T>;
    rollback?: () => Promise<void>;
}

export class TransactionManager {
    constructor(private client: SupabaseClient) {}

    /**
     * Execute a series of operations in a transaction
     * @param {TransactionOperation[]} operations - Array of operations to execute
     * @returns {Promise<any[]>} Results of operations
     * @throws {DatabaseError}
     */
    async executeTransaction(operations: TransactionOperation[]): Promise<any[]> {
        const results: any[] = [];
        let currentIndex = 0;

        try {
            // Start transaction
            await this.client.rpc('begin_transaction');

            // Execute operations
            for (const operation of operations) {
                const result = await operation.execute();
                results.push(result);
                currentIndex++;
            }

            // Commit transaction
            await this.client.rpc('commit_transaction');

            return results;
        } catch (error) {
            // Rollback transaction
            await this.client.rpc('rollback_transaction');

            // Execute rollback operations in reverse order
            for (let i = currentIndex - 1; i >= 0; i--) {
                const operation = operations[i];
                if (operation.rollback) {
                    try {
                        await operation.rollback();
                    } catch (rollbackError) {
                        console.error('Rollback failed:', rollbackError);
                    }
                }
            }

            if (error instanceof DatabaseError) {
                throw error;
            }
            if (error instanceof Error) {
                throw new DatabaseError(
                    `Transaction failed: ${error.message}`,
                    ErrorCodes.TRANSACTION
                );
            }
            throw new DatabaseError(
                'Transaction failed: Unknown error',
                ErrorCodes.TRANSACTION
            );
        }
    }

    /**
     * Create a transaction operation
     * @param {() => Promise<T>} execute - Execute function
     * @param {() => Promise<void>} [rollback] - Rollback function
     * @returns {TransactionOperation<T>} Transaction operation
     */
    createOperation<T>(
        execute: () => Promise<T>,
        rollback?: () => Promise<void>
    ): TransactionOperation<T> {
        return { execute, rollback };
    }

    /**
     * Begin a transaction
     * @returns {Promise<void>}
     */
    async begin(): Promise<void> {
        await this.client.rpc('begin_transaction');
    }

    /**
     * Commit a transaction
     * @returns {Promise<void>}
     */
    async commit(): Promise<void> {
        await this.client.rpc('commit_transaction');
    }

    /**
     * Rollback a transaction
     * @returns {Promise<void>}
     */
    async rollback(): Promise<void> {
        await this.client.rpc('rollback_transaction');
    }
} 