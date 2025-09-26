# Transaction Submission Module

This module contains all the transaction submission and confirmation functions for the GORB Chain SDK. These functions handle submitting signed transactions to the blockchain and monitoring their status.

## Overview

The submission module provides functions to:
- **Submit Transactions**: Send signed transactions to the blockchain
- **Batch Submission**: Submit multiple transactions efficiently
- **Simulate Transactions**: Test transactions before submission
- **Wait for Confirmation**: Monitor transaction status
- **Get Transaction Details**: Retrieve transaction information

## Key Features

✅ **Transaction Submission**: Submit signed transactions to the blockchain  
✅ **Batch Operations**: Submit multiple transactions efficiently  
✅ **Simulation Support**: Test transactions before submission  
✅ **Confirmation Monitoring**: Wait for transaction confirmation  
✅ **Error Handling**: Comprehensive error handling and retry logic  
✅ **Type Safe**: Full TypeScript support with proper validation  

## Core Submission Functions

### 1. `submitTransaction()`

Submits a signed transaction to the blockchain.

```typescript
async function submitTransaction(
  connection: Connection,
  transaction: Transaction,
  options?: SubmitOptions
): Promise<SubmitResult>
```

**Parameters:**
- `connection`: Solana connection instance
- `transaction`: Signed transaction to submit
- `options`: Optional submission options

**Returns:**
- `SubmitResult` containing submission status and signature

**Example:**
```typescript
import { submitTransaction } from "../submission";

const result = await submitTransaction(connection, signedTransaction);
if (result.success) {
  console.log("Transaction submitted:", result.signature);
} else {
  console.error("Submission failed:", result.error);
}
```

**What it does:**
1. Validates the signed transaction
2. Sends transaction to the blockchain
3. Returns submission result with signature
4. Handles submission errors gracefully

### 2. `submitTransactions()`

Submits multiple transactions in batch.

```typescript
async function submitTransactions(
  connection: Connection,
  transactions: Transaction[],
  options?: SubmitOptions
): Promise<SubmitResult[]>
```

**Parameters:**
- `connection`: Solana connection instance
- `transactions`: Array of signed transactions to submit
- `options`: Optional submission options

**Returns:**
- Array of `SubmitResult` for each transaction

**Example:**
```typescript
import { submitTransactions } from "../submission";

const results = await submitTransactions(connection, signedTransactions);
results.forEach((result, index) => {
  if (result.success) {
    console.log(`Transaction ${index} submitted:`, result.signature);
  } else {
    console.error(`Transaction ${index} failed:`, result.error);
  }
});
```

**What it does:**
1. Validates all signed transactions
2. Submits each transaction to the blockchain
3. Returns array of results for each transaction
4. Handles individual transaction failures

## Simulation Functions

### 3. `simulateTransaction()`

Simulates a transaction before submission to check for errors.

```typescript
async function simulateTransaction(
  connection: Connection,
  transaction: Transaction,
  options?: SimulateOptions
): Promise<SimulateResult>
```

**Parameters:**
- `connection`: Solana connection instance
- `transaction`: Transaction to simulate
- `options`: Optional simulation options

**Returns:**
- `SimulateResult` containing simulation status and logs

**Example:**
```typescript
import { simulateTransaction } from "../submission";

const simulation = await simulateTransaction(connection, signedTransaction);
if (simulation.success) {
  console.log("Simulation successful, proceeding with submission");
  const result = await submitTransaction(connection, signedTransaction);
} else {
  console.error("Simulation failed:", simulation.error);
  console.log("Logs:", simulation.logs);
}
```

**What it does:**
1. Sends transaction to simulation endpoint
2. Analyzes simulation results
3. Returns success status and detailed logs
4. Helps identify issues before submission

## Confirmation Functions

### 4. `waitForConfirmation()`

Waits for transaction confirmation with timeout.

```typescript
async function waitForConfirmation(
  connection: Connection,
  signature: TransactionSignature,
  options?: ConfirmationOptions
): Promise<ConfirmationResult>
```

**Parameters:**
- `connection`: Solana connection instance
- `signature`: Transaction signature to monitor
- `options`: Optional confirmation options

**Returns:**
- `ConfirmationResult` containing confirmation status

**Example:**
```typescript
import { waitForConfirmation } from "../submission";

const result = await submitTransaction(connection, signedTransaction);
if (result.success) {
  const confirmation = await waitForConfirmation(connection, result.signature);
  if (confirmation.success) {
    console.log("Transaction confirmed!");
  } else {
    console.error("Confirmation failed:", confirmation.error);
  }
}
```

**What it does:**
1. Monitors transaction status using signature
2. Waits for confirmation with configurable timeout
3. Returns confirmation status
4. Handles timeout and error scenarios

### 5. `getTransactionDetails()`

Retrieves detailed information about a transaction.

```typescript
async function getTransactionDetails(
  connection: Connection,
  signature: TransactionSignature,
  options?: TransactionDetailsOptions
): Promise<TransactionDetailsResult>
```

**Parameters:**
- `connection`: Solana connection instance
- `signature`: Transaction signature to retrieve
- `options`: Optional details options

**Returns:**
- `TransactionDetailsResult` containing transaction details

**Example:**
```typescript
import { getTransactionDetails } from "../submission";

const details = await getTransactionDetails(connection, signature);
if (details.success) {
  console.log("Transaction details:", details.transaction);
  console.log("Block time:", details.blockTime);
  console.log("Slot:", details.slot);
} else {
  console.error("Failed to get details:", details.error);
}
```

**What it does:**
1. Retrieves transaction from blockchain
2. Parses transaction details
3. Returns structured transaction information
4. Handles retrieval errors

## Complete Submission Flow

### Basic Flow
```typescript
import { submitTransaction, waitForConfirmation } from "../submission";

// Submit transaction
const result = await submitTransaction(connection, signedTransaction);

if (result.success) {
  // Wait for confirmation
  const confirmation = await waitForConfirmation(connection, result.signature);
  
  if (confirmation.success) {
    console.log("Transaction confirmed!");
  } else {
    console.error("Confirmation failed:", confirmation.error);
  }
} else {
  console.error("Submission failed:", result.error);
}
```

### With Simulation
```typescript
import { simulateTransaction, submitTransaction, waitForConfirmation } from "../submission";

// Simulate first
const simulation = await simulateTransaction(connection, signedTransaction);

if (simulation.success) {
  // Submit if simulation successful
  const result = await submitTransaction(connection, signedTransaction);
  
  if (result.success) {
    // Wait for confirmation
    const confirmation = await waitForConfirmation(connection, result.signature);
    console.log("Transaction confirmed!");
  }
} else {
  console.error("Simulation failed:", simulation.error);
}
```

### Batch Submission
```typescript
import { submitTransactions, waitForConfirmation } from "../submission";

// Submit multiple transactions
const results = await submitTransactions(connection, signedTransactions);

// Wait for all confirmations
const confirmations = await Promise.all(
  results
    .filter(result => result.success)
    .map(result => waitForConfirmation(connection, result.signature))
);

console.log(`Confirmed ${confirmations.filter(c => c.success).length} transactions`);
```

## Error Handling

All submission functions include comprehensive error handling:

```typescript
try {
  const result = await submitTransaction(connection, signedTransaction);
  // Handle success
} catch (error) {
  if (error.name === "TransactionError") {
    console.error("Transaction Error:", error.message);
  } else if (error.name === "SubmissionError") {
    console.error("Submission Error:", error.message);
  } else {
    console.error("Unexpected error:", error.message);
  }
}
```

**Common Error Types:**
- `TransactionError`: Transaction-related errors
- `SubmissionError`: Submission-specific errors
- `ConfirmationError`: Confirmation-related errors
- `SimulationError`: Simulation-specific errors

## Configuration Options

### SubmitOptions
```typescript
interface SubmitOptions {
  skipPreflight?: boolean;        // Skip preflight checks
  preflightCommitment?: Commitment; // Preflight commitment level
  maxRetries?: number;            // Maximum retry attempts
  retryDelay?: number;            // Delay between retries
}
```

### SimulateOptions
```typescript
interface SimulateOptions {
  commitment?: Commitment;        // Commitment level
  sigVerify?: boolean;           // Verify signatures
  replaceRecentBlockhash?: boolean; // Replace recent blockhash
}
```

### ConfirmationOptions
```typescript
interface ConfirmationOptions {
  commitment?: Commitment;        // Commitment level
  timeout?: number;              // Timeout in milliseconds
  pollingInterval?: number;      // Polling interval in milliseconds
}
```

## Best Practices

### 1. **Always Simulate Before Submission**
```typescript
// ✅ Good practice
const simulation = await simulateTransaction(connection, signedTransaction);
if (simulation.success) {
  const result = await submitTransaction(connection, signedTransaction);
}

// ❌ Risky - no simulation
const result = await submitTransaction(connection, signedTransaction);
```

### 2. **Handle Submission Errors Gracefully**
```typescript
const result = await submitTransaction(connection, signedTransaction);
if (!result.success) {
  console.error("Submission failed:", result.error);
  // Handle error appropriately
  return;
}
```

### 3. **Use Appropriate Commitment Levels**
```typescript
// For critical transactions
const confirmation = await waitForConfirmation(connection, signature, {
  commitment: "confirmed"
});

// For fast transactions
const confirmation = await waitForConfirmation(connection, signature, {
  commitment: "processed"
});
```

### 4. **Implement Retry Logic**
```typescript
const result = await submitTransaction(connection, signedTransaction, {
  maxRetries: 3,
  retryDelay: 1000
});
```

### 5. **Monitor Transaction Status**
```typescript
const result = await submitTransaction(connection, signedTransaction);
if (result.success) {
  const confirmation = await waitForConfirmation(connection, result.signature);
  if (confirmation.success) {
    console.log("Transaction confirmed!");
  } else {
    console.error("Confirmation timeout or failed");
  }
}
```

## Integration Examples

### With Builders and Signing Modules
```typescript
import { createSwapTransaction } from "../builders";
import { signWithDualKeypairs } from "../signing";
import { submitTransaction, waitForConfirmation } from "../submission";

// Complete flow
const result = await createSwapTransaction(connection, config, params);
const signedTx = await signWithDualKeypairs(result.transaction, senderKeypair, connection, feePayerKeypair);
const submitResult = await submitTransaction(connection, signedTx);

if (submitResult.success) {
  const confirmation = await waitForConfirmation(connection, submitResult.signature);
  console.log("Swap completed successfully!");
}
```

### With Error Handling
```typescript
import { simulateTransaction, submitTransaction, waitForConfirmation } from "../submission";

async function submitWithRetry(connection: Connection, transaction: Transaction, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Simulate first
      const simulation = await simulateTransaction(connection, transaction);
      if (!simulation.success) {
        throw new Error(`Simulation failed: ${simulation.error}`);
      }

      // Submit transaction
      const result = await submitTransaction(connection, transaction);
      if (!result.success) {
        throw new Error(`Submission failed: ${result.error}`);
      }

      // Wait for confirmation
      const confirmation = await waitForConfirmation(connection, result.signature);
      if (!confirmation.success) {
        throw new Error(`Confirmation failed: ${confirmation.error}`);
      }

      return { success: true, signature: result.signature };
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      if (attempt === maxRetries) {
        return { success: false, error: error.message };
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}
```

## Type Definitions

### SubmitResult
```typescript
interface SubmitResult {
  success: boolean;
  signature?: TransactionSignature;
  error?: string;
}
```

### SimulateResult
```typescript
interface SimulateResult {
  success: boolean;
  logs?: string[];
  error?: string;
}
```

### ConfirmationResult
```typescript
interface ConfirmationResult {
  success: boolean;
  signature?: TransactionSignature;
  slot?: number;
  blockTime?: number;
  error?: string;
}
```

### TransactionDetailsResult
```typescript
interface TransactionDetailsResult {
  success: boolean;
  transaction?: any;
  slot?: number;
  blockTime?: number;
  error?: string;
}
```

## Summary

The submission module provides comprehensive transaction submission and monitoring capabilities. It includes functions for submitting transactions, simulating them before submission, waiting for confirmation, and retrieving transaction details. All functions are type-safe, well-documented, and include proper error handling.

The module is designed to work seamlessly with the builders and signing modules to provide a complete transaction lifecycle management solution.
