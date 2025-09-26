# Transaction Signing Module

This module contains all the transaction signing functions for the GORB Chain SDK. These functions handle signing transactions with various methods and automatically add fresh blockhash to prevent "block height exceeded" errors.

## Overview

The signing module provides functions to sign transactions using:
- **Keypairs**: Direct keypair signing
- **Wallet Adapters**: Frontend wallet integration
- **Dual Signers**: Sender + fee payer scenarios
- **Combined Signing**: Wallet + keypair combinations

## Key Features

✅ **Fresh Blockhash**: Automatically adds fresh blockhash at signing time  
✅ **Frontend-Backend Compatible**: Works with any architecture  
✅ **Multiple Signing Methods**: Keypair, wallet, and combined signing  
✅ **Dual Signer Support**: Handle sender and fee payer scenarios  
✅ **Type Safe**: Full TypeScript support with proper validation  
✅ **Error Handling**: Comprehensive error handling and validation  

## Core Signing Functions

### 1. `signWithKeypair()`

Signs a transaction with a keypair and adds fresh blockhash.

```typescript
const signWithKeypair: SignWithKeypair = async (
  transaction: Transaction, 
  keypair: Keypair, 
  connection: Connection
): Promise<Transaction>
```

**Parameters:**
- `transaction`: Transaction to sign
- `keypair`: Keypair to sign with
- `connection`: Solana connection for fresh blockhash

**Returns:**
- Signed transaction with fresh blockhash

**Example:**
```typescript
import { signWithKeypair } from "../signing";

const signedTx = await signWithKeypair(transaction, keypair, connection);
console.log("Transaction signed with keypair");
```

**What it does:**
1. Gets fresh blockhash and lastValidBlockHeight from connection
2. Sets blockhash on transaction
3. Signs transaction with keypair
4. Returns signed transaction

### 2. `signWithWalletAdapter()`

Signs a transaction with a wallet adapter and adds fresh blockhash.

```typescript
const signWithWalletAdapter: SignWithWalletAdapter = async (
  transaction: Transaction, 
  wallet: Wallet, 
  connection: Connection
): Promise<Transaction>
```

**Parameters:**
- `transaction`: Transaction to sign
- `wallet`: Wallet adapter instance
- `connection`: Solana connection for fresh blockhash

**Returns:**
- Signed transaction with fresh blockhash

**Example:**
```typescript
import { signWithWalletAdapter } from "../signing";

const signedTx = await signWithWalletAdapter(transaction, wallet, connection);
console.log("Transaction signed with wallet");
```

**What it does:**
1. Validates wallet has signTransaction method
2. Gets fresh blockhash and lastValidBlockHeight from connection
3. Sets blockhash on transaction
4. Signs transaction with wallet
5. Returns signed transaction

### 3. `signAllWithWalletAdapter()`

Signs multiple transactions with a wallet adapter and adds fresh blockhash.

```typescript
async function signAllWithWalletAdapter(
  transactions: Transaction[],
  wallet: Wallet,
  connection: Connection
): Promise<Transaction[]>
```

**Parameters:**
- `transactions`: Array of transactions to sign
- `wallet`: Wallet adapter instance
- `connection`: Solana connection for fresh blockhash

**Returns:**
- Array of signed transactions

**Example:**
```typescript
import { signAllWithWalletAdapter } from "../signing";

const signedTxs = await signAllWithWalletAdapter(transactions, wallet, connection);
console.log(`Signed ${signedTxs.length} transactions`);
```

**What it does:**
1. Validates wallet has signAllTransactions method
2. Gets fresh blockhash and lastValidBlockHeight from connection
3. Sets blockhash on all transactions
4. Signs all transactions with wallet
5. Returns array of signed transactions

### 4. `signWithWalletAndKeypair()`

Signs a transaction with both wallet and keypair (for mint keypairs).

```typescript
async function signWithWalletAndKeypair(
  transaction: Transaction,
  wallet: Wallet,
  mintKeypair: Keypair,
  connection: Connection
): Promise<Transaction>
```

**Parameters:**
- `transaction`: Transaction to sign
- `wallet`: Wallet adapter instance
- `mintKeypair`: Mint keypair for partial signing
- `connection`: Solana connection for fresh blockhash

**Returns:**
- Signed transaction with both signatures

**Example:**
```typescript
import { signWithWalletAndKeypair } from "../signing";

const signedTx = await signWithWalletAndKeypair(transaction, wallet, mintKeypair, connection);
console.log("Transaction signed with wallet and mint keypair");
```

**What it does:**
1. Signs with wallet (adds fresh blockhash)
2. Partially signs with mint keypair
3. Returns transaction with both signatures

## Dual Signer Functions

### 5. `signWithDualKeypairs()`

Signs a transaction with dual keypairs (sender + optional fee payer).

```typescript
const signWithDualKeypairs: SignWithDualKeypairs = async (
  transaction: Transaction,
  senderKeypair: Keypair,
  connection: Connection,
  feePayerKeypair?: Keypair
): Promise<Transaction>
```

**Parameters:**
- `transaction`: Transaction to sign
- `senderKeypair`: Sender keypair (always required)
- `connection`: Solana connection for fresh blockhash
- `feePayerKeypair`: Fee payer keypair (optional)

**Returns:**
- Signed transaction with appropriate signatures

**Example:**
```typescript
import { signWithDualKeypairs } from "../signing";

// Single signer (sender pays fees)
const signedTx = await signWithDualKeypairs(transaction, senderKeypair, connection);

// Dual signer (separate fee payer)
const signedTx = await signWithDualKeypairs(transaction, senderKeypair, connection, feePayerKeypair);
```

**What it does:**
1. Validates sender keypair
2. Gets fresh blockhash and lastValidBlockHeight from connection
3. Sets blockhash on transaction
4. Signs with sender keypair
5. If fee payer is different from sender, signs with fee payer keypair
6. Returns signed transaction

### 6. `signTransferWithWalletAndKeypair()`

Signs a transaction with wallet and optional fee payer keypair.

```typescript
const signTransferWithWalletAndKeypair: SignWithWalletAndKeypair = async (
  transaction: Transaction,
  wallet: Wallet,
  connection: Connection,
  feePayerKeypair?: Keypair
): Promise<Transaction>
```

**Parameters:**
- `transaction`: Transaction to sign
- `wallet`: Wallet adapter instance
- `connection`: Solana connection for fresh blockhash
- `feePayerKeypair`: Fee payer keypair (optional)

**Returns:**
- Signed transaction with appropriate signatures

**Example:**
```typescript
import { signTransferWithWalletAndKeypair } from "../signing";

// Wallet only (wallet pays fees)
const signedTx = await signTransferWithWalletAndKeypair(transaction, wallet, connection);

// Wallet + fee payer
const signedTx = await signTransferWithWalletAndKeypair(transaction, wallet, connection, feePayerKeypair);
```

**What it does:**
1. Validates wallet
2. Signs with wallet (adds fresh blockhash)
3. If fee payer keypair is provided and different from wallet, signs with it
4. Returns signed transaction

## Helper Functions

### 7. `createCombinedSigner()`

Creates a signing function that combines wallet and keypair signing.

```typescript
function createCombinedSigner(wallet: Wallet, mintKeypair: Keypair) {
  return async (transaction: Transaction, connection: Connection): Promise<Transaction>
}
```

**Example:**
```typescript
import { createCombinedSigner } from "../signing";

const signer = createCombinedSigner(wallet, mintKeypair);
const signedTx = await signer(transaction, connection);
```

### 8. `createTransferSigner()`

Creates a signing function for transfers with dual signers.

```typescript
function createTransferSigner(senderKeypair: Keypair, feePayerKeypair?: Keypair) {
  return async (transaction: Transaction, connection: Connection): Promise<Transaction>
}
```

**Example:**
```typescript
import { createTransferSigner } from "../signing";

const signer = createTransferSigner(senderKeypair, feePayerKeypair);
const signedTx = await signer(transaction, connection);
```

### 9. `createTransferWalletSigner()`

Creates a signing function for transfers with wallet and fee payer.

```typescript
function createTransferWalletSigner(wallet: Wallet, feePayerKeypair?: Keypair) {
  return async (transaction: Transaction, connection: Connection): Promise<Transaction>
}
```

**Example:**
```typescript
import { createTransferWalletSigner } from "../signing";

const signer = createTransferWalletSigner(wallet, feePayerKeypair);
const signedTx = await signer(transaction, connection);
```

### 10. `createSwapSigner()`

Creates a signing function for swaps with dual signers.

```typescript
function createSwapSigner(senderKeypair: Keypair, feePayerKeypair?: Keypair) {
  return async (transaction: Transaction, connection: Connection): Promise<Transaction>
}
```

**Example:**
```typescript
import { createSwapSigner } from "../signing";

const signer = createSwapSigner(senderKeypair, feePayerKeypair);
const signedTx = await signer(transaction, connection);
```

### 11. `createSwapWalletSigner()`

Creates a signing function for swaps with wallet and fee payer.

```typescript
function createSwapWalletSigner(wallet: Wallet, feePayerKeypair?: Keypair) {
  return async (transaction: Transaction, connection: Connection): Promise<Transaction>
}
```

**Example:**
```typescript
import { createSwapWalletSigner } from "../signing";

const signer = createSwapWalletSigner(wallet, feePayerKeypair);
const signedTx = await signer(transaction, connection);
```

## Validation Functions

### 12. `validateWallet()`

Validates that a wallet has the required signing capabilities.

```typescript
function validateWallet(wallet: any): wallet is Wallet
```

**Example:**
```typescript
import { validateWallet } from "../signing";

if (validateWallet(wallet)) {
  const signedTx = await signWithWalletAdapter(transaction, wallet, connection);
} else {
  throw new Error("Invalid wallet provided");
}
```

### 13. `validateKeypair()`

Validates that a keypair is properly formatted.

```typescript
function validateKeypair(keypair: any): keypair is Keypair
```

**Example:**
```typescript
import { validateKeypair } from "../signing";

if (validateKeypair(keypair)) {
  const signedTx = await signWithKeypair(transaction, keypair, connection);
} else {
  throw new Error("Invalid keypair provided");
}
```

## Signing Strategies

### 1. **Single Signer (Sender Pays Fees)**
```typescript
// Using keypair
const signedTx = await signWithKeypair(transaction, senderKeypair, connection);

// Using wallet
const signedTx = await signWithWalletAdapter(transaction, wallet, connection);

// Using dual keypairs (sender = fee payer)
const signedTx = await signWithDualKeypairs(transaction, senderKeypair, connection);
```

### 2. **Dual Signer (Separate Fee Payer)**
```typescript
// Keypair + keypair
const signedTx = await signWithDualKeypairs(transaction, senderKeypair, connection, feePayerKeypair);

// Wallet + keypair
const signedTx = await signTransferWithWalletAndKeypair(transaction, wallet, connection, feePayerKeypair);
```

### 3. **Mint Keypair Signing (Token/NFT Creation)**
```typescript
// Wallet + mint keypair
const signedTx = await signWithWalletAndKeypair(transaction, wallet, mintKeypair, connection);
```

## Error Handling

All signing functions include comprehensive error handling:

```typescript
try {
  const signedTx = await signWithDualKeypairs(transaction, senderKeypair, connection, feePayerKeypair);
  // Use signed transaction
} catch (error) {
  if (error.name === "SigningError") {
    console.error("Signing Error:", error.message);
  } else {
    console.error("Unexpected error:", error.message);
  }
}
```

**Common Error Types:**
- `SigningError`: Signing-specific errors (invalid keypair, wallet issues)
- `SDKError`: SDK-specific errors
- `TransactionError`: Transaction-related errors

## Best Practices

### 1. **Always Use Connection Parameter**
```typescript
// ✅ Correct - adds fresh blockhash
const signedTx = await signWithKeypair(transaction, keypair, connection);

// ❌ Incorrect - no fresh blockhash
const signedTx = await signWithKeypair(transaction, keypair);
```

### 2. **Validate Inputs Before Signing**
```typescript
if (!validateKeypair(keypair)) {
  throw new Error("Invalid keypair provided");
}

if (!validateWallet(wallet)) {
  throw new Error("Invalid wallet provided");
}
```

### 3. **Handle Different Signing Scenarios**
```typescript
// For token/NFT creation
const signedTx = await signWithWalletAndKeypair(transaction, wallet, mintKeypair, connection);

// For transfers with separate fee payer
const signedTx = await signWithDualKeypairs(transaction, senderKeypair, connection, feePayerKeypair);

// For swaps with wallet
const signedTx = await signTransferWithWalletAndKeypair(transaction, wallet, connection, feePayerKeypair);
```

### 4. **Use Helper Functions for Reusability**
```typescript
// Create reusable signer
const signer = createTransferSigner(senderKeypair, feePayerKeypair);

// Use multiple times
const signedTx1 = await signer(transaction1, connection);
const signedTx2 = await signer(transaction2, connection);
```

## Integration Examples

### With Builders Module
```typescript
import { createSwapTransaction } from "../builders";
import { signWithDualKeypairs } from "../signing";

// Build transaction
const result = await createSwapTransaction(connection, config, params);

// Sign transaction
const signedTx = await signWithDualKeypairs(result.transaction, senderKeypair, connection, feePayerKeypair);
```

### With Submission Module
```typescript
import { signWithWalletAdapter } from "../signing";
import { submitTransaction } from "../submission";

// Sign transaction
const signedTx = await signWithWalletAdapter(transaction, wallet, connection);

// Submit transaction
const result = await submitTransaction(connection, signedTx);
```

### Complete Flow Example
```typescript
import { createNativeTransferTransaction } from "../builders";
import { signWithDualKeypairs } from "../signing";
import { submitTransaction } from "../submission";

// Step 1: Build transaction
const result = await createNativeTransferTransaction(connection, config, params);

// Step 2: Sign transaction (adds fresh blockhash)
const signedTx = await signWithDualKeypairs(result.transaction, senderKeypair, connection, feePayerKeypair);

// Step 3: Submit transaction
const submitResult = await submitTransaction(connection, signedTx);
```

## Type Definitions

### SignWithKeypair
```typescript
type SignWithKeypair = (transaction: Transaction, keypair: Keypair, connection: Connection) => Promise<Transaction>;
```

### SignWithWalletAdapter
```typescript
type SignWithWalletAdapter = (transaction: Transaction, wallet: Wallet, connection: Connection) => Promise<Transaction>;
```

### SignWithDualKeypairs
```typescript
type SignWithDualKeypairs = (
  transaction: Transaction, 
  senderKeypair: Keypair, 
  connection: Connection,
  feePayerKeypair?: Keypair
) => Promise<Transaction>;
```

### SignWithWalletAndKeypair
```typescript
type SignWithWalletAndKeypair = (
  transaction: Transaction, 
  wallet: Wallet, 
  connection: Connection,
  feePayerKeypair?: Keypair
) => Promise<Transaction>;
```

## Summary

The signing module provides comprehensive transaction signing capabilities with automatic fresh blockhash handling. It supports various signing strategies including single signers, dual signers, wallet integration, and combined signing methods. All functions are type-safe, well-documented, and include proper error handling.

The key advantage is that all signing functions automatically add fresh blockhash at signing time, preventing "block height exceeded" errors and enabling flexible frontend-backend architectures.
