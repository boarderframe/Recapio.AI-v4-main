import { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseError, ErrorCodes } from './error-handling';
import { log } from '@/lib/utils/logger';

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
        const transactionId = crypto.randomUUID();

        try {
            log.db.info('Starting transaction', { transactionId });
            await this.client.rpc('begin_transaction');

            for (const operation of operations) {
                log.db.debug('Executing operation in transaction', {
                    transactionId,
                    operationIndex: currentIndex,
                    totalOperations: operations.length
                });

                const result = await operation.execute();
                results.push(result);
                currentIndex++;

                log.db.debug('Operation completed successfully', {
                    transactionId,
                    operationIndex: currentIndex - 1
                });
            }

            log.db.info('Committing transaction', { transactionId });
            await this.client.rpc('commit_transaction');

            log.db.info('Transaction completed successfully', {
                transactionId,
                operationsExecuted: currentIndex
            });

            return results;
        } catch (error) {
            log.db.error('Transaction failed, initiating rollback', {
                transactionId,
                operationIndex: currentIndex,
                error: error instanceof Error ? error.message : String(error)
            });

            await this.client.rpc('rollback_transaction');

            for (let i = currentIndex - 1; i >= 0; i--) {
                const operation = operations[i];
                if (operation.rollback) {
                    try {
                        log.db.debug('Rolling back operation', {
                            transactionId,
                            operationIndex: i
                        });
                        await operation.rollback();
                    } catch (rollbackError) {
                        log.db.error('Rollback failed for operation', {
                            transactionId,
                            operationIndex: i,
                            error: rollbackError instanceof Error ? rollbackError.message : String(rollbackError)
                        });
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
        const transactionId = crypto.randomUUID();
        log.db.info('Beginning transaction', { transactionId });
        await this.client.rpc('begin_transaction');
    }

    /**
     * Commit a transaction
     * @returns {Promise<void>}
     */
    async commit(): Promise<void> {
        log.db.info('Committing transaction');
        await this.client.rpc('commit_transaction');
    }

    /**
     * Rollback a transaction
     * @returns {Promise<void>}
     */
    async rollback(): Promise<void> {
        log.db.info('Rolling back transaction');
        await this.client.rpc('rollback_transaction');
    }
} 