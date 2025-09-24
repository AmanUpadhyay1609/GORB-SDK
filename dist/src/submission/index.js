"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitTransaction = submitTransaction;
exports.submitTransactions = submitTransactions;
exports.simulateTransaction = simulateTransaction;
exports.waitForConfirmation = waitForConfirmation;
exports.getTransactionDetails = getTransactionDetails;
const types_1 = require("../types");
/**
 * Submits a signed transaction to the network
 * @param connection - Solana connection
 * @param transaction - Signed transaction
 * @param options - Submission options
 * @returns Submission result
 */
async function submitTransaction(connection, transaction, options = {}) {
    try {
        const { skipPreflight = false, maxRetries = 3, commitment = "confirmed", } = options;
        // Serialize the transaction
        const serializedTransaction = transaction.serialize();
        // Send the transaction
        const signature = await connection.sendRawTransaction(serializedTransaction, {
            skipPreflight,
            maxRetries,
        });
        // Wait for confirmation
        const confirmationResult = await connection.confirmTransaction(signature, commitment);
        if (confirmationResult.value.err) {
            throw new types_1.TransactionError(`Transaction failed: ${JSON.stringify(confirmationResult.value.err)}`, signature);
        }
        return {
            signature,
            success: true,
        };
    }
    catch (error) {
        return {
            signature: "",
            success: false,
            error: error.message || error,
        };
    }
}
/**
 * Submits multiple transactions in sequence
 * @param connection - Solana connection
 * @param transactions - Array of signed transactions
 * @param options - Submission options
 * @returns Array of submission results
 */
async function submitTransactions(connection, transactions, options = {}) {
    const results = [];
    for (const transaction of transactions) {
        const result = await submitTransaction(connection, transaction, options);
        results.push(result);
        // If a transaction fails, stop submitting the rest
        if (!result.success) {
            break;
        }
    }
    return results;
}
/**
 * Simulates a transaction before submission
 * @param connection - Solana connection
 * @param transaction - Transaction to simulate
 * @returns Simulation result
 */
async function simulateTransaction(connection, transaction) {
    try {
        const simulationResult = await connection.simulateTransaction(transaction);
        if (simulationResult.value.err) {
            return {
                success: false,
                error: simulationResult.value.err,
                ...(simulationResult.value.logs && { logs: simulationResult.value.logs }),
            };
        }
        return {
            success: true,
            ...(simulationResult.value.logs && { logs: simulationResult.value.logs }),
            ...(simulationResult.value.unitsConsumed && { unitsConsumed: simulationResult.value.unitsConsumed }),
        };
    }
    catch (error) {
        return {
            success: false,
            error: error.message || error,
        };
    }
}
/**
 * Waits for transaction confirmation with timeout
 * @param connection - Solana connection
 * @param signature - Transaction signature
 * @param commitment - Commitment level
 * @param timeout - Timeout in milliseconds
 * @returns Confirmation result
 */
async function waitForConfirmation(connection, signature, commitment = "confirmed", timeout = 30000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        try {
            const status = await connection.getSignatureStatus(signature);
            if (status?.value?.confirmationStatus === commitment ||
                status?.value?.confirmationStatus === "finalized") {
                if (status.value.err) {
                    return {
                        success: false,
                        error: status.value.err,
                        status: status.value,
                    };
                }
                return {
                    success: true,
                    status: status.value,
                };
            }
            // Wait 1 second before next check
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        catch (error) {
            // Continue trying on error
            console.warn("Error checking transaction status:", error.message);
        }
    }
    return {
        success: false,
        error: "Transaction confirmation timeout",
    };
}
/**
 * Gets transaction details after submission
 * @param connection - Solana connection
 * @param signature - Transaction signature
 * @returns Transaction details
 */
async function getTransactionDetails(connection, signature) {
    try {
        const transaction = await connection.getTransaction(signature, {
            commitment: "confirmed",
            maxSupportedTransactionVersion: 0,
        });
        if (!transaction) {
            return {
                success: false,
                error: "Transaction not found",
            };
        }
        return {
            success: true,
            transaction,
        };
    }
    catch (error) {
        return {
            success: false,
            error: error.message || error,
        };
    }
}
//# sourceMappingURL=index.js.map