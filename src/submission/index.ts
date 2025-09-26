import {
  Connection,
  Transaction,
  TransactionSignature,
} from "@solana/web3.js";
import {
  SubmitOptions,
  SubmitResult,
  TransactionError,
} from "../types";

/**
 * Submits a signed transaction to the network
 * @param connection - Solana connection
 * @param transaction - Signed transaction
 * @param options - Submission options
 * @returns Submission result
 */
export async function submitTransaction(
  connection: Connection,
  transaction: Transaction,
  options: SubmitOptions = {}
): Promise<SubmitResult> {
  try {
    console.log("🚀 Submitting transaction...");
    const {
      skipPreflight = false,
      maxRetries = 3,
      commitment = "confirmed",
    } = options;

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
      throw new TransactionError(
        `Transaction failed: ${JSON.stringify(confirmationResult.value.err)}`,
        signature
      );
    }

    return {
      signature,
      success: true,
    };
  } catch (error: any) {
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
export async function submitTransactions(
  connection: Connection,
  transactions: Transaction[],
  options: SubmitOptions = {}
): Promise<SubmitResult[]> {
  const results: SubmitResult[] = [];

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
export async function simulateTransaction(
  connection: Connection,
  transaction: Transaction
): Promise<{
  success: boolean;
  error?: any;
  logs?: string[];
  unitsConsumed?: number;
}> {
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
  } catch (error: any) {
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
export async function waitForConfirmation(
  connection: Connection,
  signature: TransactionSignature,
  commitment: "processed" | "confirmed" | "finalized" = "confirmed",
  timeout: number = 30000
): Promise<{
  success: boolean;
  error?: any;
  status?: any;
}> {
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
    } catch (error: any) {
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
export async function getTransactionDetails(
  connection: Connection,
  signature: TransactionSignature
): Promise<{
  success: boolean;
  transaction?: any;
  error?: any;
}> {
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
  } catch (error: any) {
    return {
      success: false,
      error: error.message || error,
    };
  }
}
