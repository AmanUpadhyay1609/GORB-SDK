import { Connection, Transaction, TransactionSignature } from "@solana/web3.js";
import { SubmitOptions, SubmitResult } from "../types";
/**
 * Submits a signed transaction to the network
 * @param connection - Solana connection
 * @param transaction - Signed transaction
 * @param options - Submission options
 * @returns Submission result
 */
export declare function submitTransaction(connection: Connection, transaction: Transaction, options?: SubmitOptions): Promise<SubmitResult>;
/**
 * Submits multiple transactions in sequence
 * @param connection - Solana connection
 * @param transactions - Array of signed transactions
 * @param options - Submission options
 * @returns Array of submission results
 */
export declare function submitTransactions(connection: Connection, transactions: Transaction[], options?: SubmitOptions): Promise<SubmitResult[]>;
/**
 * Simulates a transaction before submission
 * @param connection - Solana connection
 * @param transaction - Transaction to simulate
 * @returns Simulation result
 */
export declare function simulateTransaction(connection: Connection, transaction: Transaction): Promise<{
    success: boolean;
    error?: any;
    logs?: string[];
    unitsConsumed?: number;
}>;
/**
 * Waits for transaction confirmation with timeout
 * @param connection - Solana connection
 * @param signature - Transaction signature
 * @param commitment - Commitment level
 * @param timeout - Timeout in milliseconds
 * @returns Confirmation result
 */
export declare function waitForConfirmation(connection: Connection, signature: TransactionSignature, commitment?: "processed" | "confirmed" | "finalized", timeout?: number): Promise<{
    success: boolean;
    error?: any;
    status?: any;
}>;
/**
 * Gets transaction details after submission
 * @param connection - Solana connection
 * @param signature - Transaction signature
 * @returns Transaction details
 */
export declare function getTransactionDetails(connection: Connection, signature: TransactionSignature): Promise<{
    success: boolean;
    transaction?: any;
    error?: any;
}>;
//# sourceMappingURL=index.d.ts.map