# Non-Native Token Transfer Guide

## Table of Contents
1. [Overview](#overview)
2. [Understanding Associated Token Accounts (ATAs)](#understanding-associated-token-accounts-atas)
3. [Why Check ATA Existence?](#why-check-ata-existence)
4. [SDK Architecture](#sdk-architecture)
5. [Basic Usage](#basic-usage)
6. [Advanced Usage Patterns](#advanced-usage-patterns)
7. [Error Handling](#error-handling)
8. [Best Practices](#best-practices)
9. [Examples](#examples)
10. [Troubleshooting](#troubleshooting)

## Overview

Non-native token transfers in the Gorbchain SDK allow you to transfer SPL tokens between accounts. Unlike native SOL transfers, SPL token transfers require **Associated Token Accounts (ATAs)** to exist before the transfer can occur.

This guide explains the ATA system, why we check for their existence, and how to use the SDK's non-native transfer functionality effectively.

## Understanding Associated Token Accounts (ATAs)

### What are ATAs?

An **Associated Token Account (ATA)** is a special type of account that holds tokens for a specific user and token mint. Each user needs a separate ATA for each token they want to hold or transfer.

### Key Concepts

```
User Wallet: 9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM
Token Mint: 8icLSp1mF8WgtZwg5oRhjfqvAjHZ3kLyit2tXGYR4PQY
ATA Address: CArFDAYgYxvkprpWPnpjGxf89Guu5WBsnnxbu4tzESu
```

### ATA Derivation

ATAs are derived deterministically using:
- **Owner**: The user's wallet address
- **Mint**: The token mint address
- **Program IDs**: Token program and ATA program

```typescript
const ata = getAssociatedTokenAddressSync(
  mintAddress,      // Token mint
  ownerAddress,     // User's wallet
  false,            // Allow owner off curve
  tokenProgramId,   // Gorbchain token program
  ataProgramId      // Gorbchain ATA program
);
```

### Why ATAs Matter

1. **Token Storage**: ATAs store the actual token balances
2. **Transfer Requirements**: All token transfers must go through ATAs
3. **Account Creation**: ATAs must exist before any token operations
4. **Gas Costs**: Creating ATAs requires transaction fees

## Why Check ATA Existence?

### The Problem

When you try to transfer tokens, the transaction will fail if:
- The sender's ATA doesn't exist (no tokens to send)
- The recipient's ATA doesn't exist (nowhere to receive tokens)

### The Solution

Our SDK provides two functions to handle this:

1. **`ensureTokenAccountsExist()`** - Checks and optionally creates ATAs
2. **`createNonNativeTransferTransaction()`** - Creates the transfer transaction

### Flow Diagram

```
┌─────────────────┐    ┌──────────────────────┐    ┌─────────────────────┐
│ Check ATAs      │ -> │ Create ATAs (if      │ -> │ Create Transfer     │
│ Exist?          │    │ needed)              │    │ Transaction         │
└─────────────────┘    └──────────────────────┘    └─────────────────────┘
         │                        │                           │
         v                        v                           v
┌─────────────────┐    ┌──────────────────────┐    ┌─────────────────────┐
│ Sign & Submit   │    │ Sign & Submit        │    │ Sign & Submit       │
│ ATA Creation    │    │ ATA Creation         │    │ Transfer            │
│ Transaction     │    │ Transaction          │    │ Transaction         │
└─────────────────┘    └──────────────────────┘    └─────────────────────┘
```

## SDK Architecture

### Two-Step Process

The SDK follows a clean separation of concerns:

#### Step 1: Account Management
```typescript
const accountResult = await sdk.ensureTokenAccountsExist(
  {
    mintAddress: new PublicKey("8icLSp1mF8WgtZwg5oRhjfqvAjHZ3kLyit2tXGYR4PQY"),
    fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
    toPublicKey: new PublicKey("55vMC4msCGgi24KdRETGUUFAebD1KUiboCo2mJcoHFhe"),
  },
  signer // Optional: keypair or wallet
);
```

#### Step 2: Transfer Transaction
```typescript
const transferResult = await sdk.createNonNativeTransferTransaction({
  mintAddress: new PublicKey("8icLSp1mF8WgtZwg5oRhjfqvAjHZ3kLyit2tXGYR4PQY"),
  fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
  toPublicKey: new PublicKey("55vMC4msCGgi24KdRETGUUFAebD1KUiboCo2mJcoHFhe"),
  amount: 123,
  decimals: 4,
});
```

### Signer Flexibility

The SDK supports multiple signing patterns:

#### Backend/Server (Keypair)
```typescript
const accountResult = await sdk.ensureTokenAccountsExist(params, keypair);
```

#### Frontend (Wallet Adapter)
```typescript
const accountResult = await sdk.ensureTokenAccountsExist(params, wallet);
```

#### Check Only (No Creation)
```typescript
const accountResult = await sdk.ensureTokenAccountsExist(params); // No signer
```

## Basic Usage

### Simple Transfer (Accounts Already Exist)

```typescript
import { createGorbchainSDK, PublicKey } from "@gorbchain/solana-sdk";

const sdk = createGorbchainSDK();

// Step 1: Create transfer transaction
const result = await sdk.createNonNativeTransferTransaction({
  mintAddress: new PublicKey("8icLSp1mF8WgtZwg5oRhjfqvAjHZ3kLyit2tXGYR4PQY"),
  fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
  toPublicKey: new PublicKey("55vMC4msCGgi24KdRETGUUFAebD1KUiboCo2mJcoHFhe"),
  amount: 123,
  decimals: 4,
});

// Step 2: Sign and submit
const signedTx = await sdk.signWithDualKeypairs(result.transaction, keypair);
const submitResult = await sdk.submitTransaction(signedTx);
```

### Complete Transfer with ATA Creation

```typescript
import { createGorbchainSDK, PublicKey, Keypair } from "@gorbchain/solana-sdk";
import bs58 from "bs58";

const sdk = createGorbchainSDK();
const keypair = Keypair.fromSecretKey(bs58.decode("Your-private-key"));

// Step 1: Ensure token accounts exist
const accountResult = await sdk.ensureTokenAccountsExist({
  mintAddress: new PublicKey("8icLSp1mF8WgtZwg5oRhjfqvAjHZ3kLyit2tXGYR4PQY"),
  fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
  toPublicKey: new PublicKey("55vMC4msCGgi24KdRETGUUFAebD1KUiboCo2mJcoHFhe"),
}, keypair);

// Step 2: Create ATAs if needed
if (accountResult.transaction) {
  const createTx = await sdk.signWithDualKeypairs(accountResult.transaction, keypair);
  await sdk.submitTransaction(createTx);
  console.log("✅ Token accounts created");
}

// Step 3: Create and submit transfer
const transferResult = await sdk.createNonNativeTransferTransaction({
  mintAddress: new PublicKey("8icLSp1mF8WgtZwg5oRhjfqvAjHZ3kLyit2tXGYR4PQY"),
  fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
  toPublicKey: new PublicKey("55vMC4msCGgi24KdRETGUUFAebD1KUiboCo2mJcoHFhe"),
  amount: 123,
  decimals: 4,
});

const signedTx = await sdk.signWithDualKeypairs(transferResult.transaction, keypair);
const submitResult = await sdk.submitTransaction(signedTx);
```

## Advanced Usage Patterns

### Frontend with Wallet Adapter

```typescript
// Step 1: Check/create ATAs with wallet
const accountResult = await sdk.ensureTokenAccountsExist({
  mintAddress: new PublicKey("8icLSp1mF8WgtZwg5oRhjfqvAjHZ3kLyit2tXGYR4PQY"),
  fromPublicKey: wallet.publicKey,
  toPublicKey: new PublicKey("55vMC4msCGgi24KdRETGUUFAebD1KUiboCo2mJcoHFhe"),
}, wallet);

// Step 2: Create ATAs if needed (wallet popup)
if (accountResult.transaction) {
  const createTx = await sdk.signTransferWithWalletAndKeypair(accountResult.transaction, wallet);
  await sdk.submitTransaction(createTx);
}

// Step 3: Transfer (wallet popup)
const transferResult = await sdk.createNonNativeTransferTransaction({
  mintAddress: new PublicKey("8icLSp1mF8WgtZwg5oRhjfqvAjHZ3kLyit2tXGYR4PQY"),
  fromPublicKey: wallet.publicKey,
  toPublicKey: new PublicKey("55vMC4msCGgi24KdRETGUUFAebD1KUiboCo2mJcoHFhe"),
  amount: 123,
  decimals: 4,
});

const signedTx = await sdk.signTransferWithWalletAndKeypair(transferResult.transaction, wallet);
await sdk.submitTransaction(signedTx);
```

### Dual Signer (Admin Pays Fees)

```typescript
const transferResult = await sdk.createNonNativeTransferTransaction({
  mintAddress: new PublicKey("8icLSp1mF8WgtZwg5oRhjfqvAjHZ3kLyit2tXGYR4PQY"),
  fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
  toPublicKey: new PublicKey("55vMC4msCGgi24KdRETGUUFAebD1KUiboCo2mJcoHFhe"),
  amount: 123,
  decimals: 4,
  feePayerPublicKey: new PublicKey("AdminPublicKey"), // Admin pays fees
});

const signedTx = await sdk.signWithDualKeypairs(transferResult.transaction, senderKeypair, adminKeypair);
await sdk.submitTransaction(signedTx);
```

### Batch Operations

```typescript
// Check multiple token accounts at once
const tokens = [
  { mint: "8icLSp1mF8WgtZwg5oRhjfqvAjHZ3kLyit2tXGYR4PQY", amount: 123 },
  { mint: "AnotherTokenMint", amount: 456 },
];

for (const token of tokens) {
  const accountResult = await sdk.ensureTokenAccountsExist({
    mintAddress: new PublicKey(token.mint),
    fromPublicKey: userPublicKey,
    toPublicKey: recipientPublicKey,
  }, keypair);

  if (accountResult.transaction) {
    const createTx = await sdk.signWithDualKeypairs(accountResult.transaction, keypair);
    await sdk.submitTransaction(createTx);
  }

  const transferResult = await sdk.createNonNativeTransferTransaction({
    mintAddress: new PublicKey(token.mint),
    fromPublicKey: userPublicKey,
    toPublicKey: recipientPublicKey,
    amount: token.amount,
    decimals: 4,
  });

  const signedTx = await sdk.signWithDualKeypairs(transferResult.transaction, keypair);
  await sdk.submitTransaction(signedTx);
}
```

## Error Handling

### Common Error Scenarios

#### 1. Insufficient Token Balance
```typescript
try {
  const result = await sdk.createNonNativeTransferTransaction({
    // ... params
    amount: 1000000, // Large amount
  });
} catch (error) {
  if (error.message.includes("Insufficient token balance")) {
    console.log("❌ Not enough tokens to transfer");
  }
}
```

#### 2. Token Account Doesn't Exist
```typescript
try {
  const result = await sdk.createNonNativeTransferTransaction(params);
} catch (error) {
  if (error.message.includes("Account does not exist")) {
    console.log("❌ Token account doesn't exist. Create it first.");
    // Use ensureTokenAccountsExist() to create the account
  }
}
```

#### 3. Invalid Token Amount
```typescript
try {
  const result = await sdk.createNonNativeTransferTransaction({
    // ... params
    amount: -1, // Invalid negative amount
  });
} catch (error) {
  if (error.message.includes("Invalid token amount")) {
    console.log("❌ Amount must be greater than 0");
  }
}
```

### Robust Error Handling Pattern

```typescript
async function safeTokenTransfer(params) {
  try {
    // Step 1: Check account existence
    const accountResult = await sdk.ensureTokenAccountsExist({
      mintAddress: params.mintAddress,
      fromPublicKey: params.fromPublicKey,
      toPublicKey: params.toPublicKey,
    });

    // Step 2: Create accounts if needed
    if (accountResult.transaction) {
      console.log("🔧 Creating missing token accounts...");
      const createTx = await sdk.signWithDualKeypairs(accountResult.transaction, keypair);
      const createResult = await sdk.submitTransaction(createTx);
      
      if (!createResult.success) {
        throw new Error(`Failed to create token accounts: ${createResult.error}`);
      }
    }

    // Step 3: Create transfer transaction
    const transferResult = await sdk.createNonNativeTransferTransaction(params);

    // Step 4: Sign and submit
    const signedTx = await sdk.signWithDualKeypairs(transferResult.transaction, keypair);
    const submitResult = await sdk.submitTransaction(signedTx);

    if (submitResult.success) {
      console.log("✅ Transfer successful:", submitResult.signature);
      return { success: true, signature: submitResult.signature };
    } else {
      throw new Error(`Transfer failed: ${submitResult.error}`);
    }

  } catch (error) {
    console.error("❌ Transfer error:", error.message);
    return { success: false, error: error.message };
  }
}
```

## Best Practices

### 1. Always Check Account Existence First

```typescript
// ✅ Good: Check first
const accountResult = await sdk.ensureTokenAccountsExist(params, signer);
if (accountResult.transaction) {
  // Create accounts
}

// ❌ Bad: Assume accounts exist
const result = await sdk.createNonNativeTransferTransaction(params);
```

### 2. Handle Decimal Precision Correctly

```typescript
// ✅ Good: Use proper decimal handling
const amount = 1.5; // Human-readable amount
const decimals = 6;  // Token decimals
// SDK converts to: 1500000 smallest units

// ❌ Bad: Manual conversion
const amount = 1500000; // Already in smallest units
```

### 3. Use Appropriate Signing Methods

```typescript
// ✅ Backend: Use keypair
const signedTx = await sdk.signWithDualKeypairs(tx, keypair);

// ✅ Frontend: Use wallet adapter
const signedTx = await sdk.signTransferWithWalletAndKeypair(tx, wallet);
```

### 4. Implement Proper Error Handling

```typescript
// ✅ Good: Comprehensive error handling
try {
  const result = await sdk.createNonNativeTransferTransaction(params);
  // ... handle success
} catch (error) {
  if (error.message.includes("Insufficient")) {
    // Handle insufficient balance
  } else if (error.message.includes("Account does not exist")) {
    // Handle missing account
  } else {
    // Handle other errors
  }
}
```

### 5. Optimize for User Experience

```typescript
// ✅ Good: Check accounts without creating first
const accountResult = await sdk.ensureTokenAccountsExist(params); // No signer

if (!accountResult.fromAccountExists) {
  console.log("⚠️ Sender doesn't have this token");
  return;
}

if (!accountResult.toAccountExists) {
  console.log("ℹ️ Recipient will need to create a token account");
  // Proceed with creation
}
```

## Examples

### Example 1: Basic Transfer

```typescript
import { createGorbchainSDK, PublicKey, Keypair } from "@gorbchain/solana-sdk";
import bs58 from "bs58";

async function basicTransfer() {
  const sdk = createGorbchainSDK();
  const keypair = Keypair.fromSecretKey(bs58.decode("Your-private-key"));

  const params = {
    mintAddress: new PublicKey("8icLSp1mF8WgtZwg5oRhjfqvAjHZ3kLyit2tXGYR4PQY"),
    fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
    toPublicKey: new PublicKey("55vMC4msCGgi24KdRETGUUFAebD1KUiboCo2mJcoHFhe"),
    amount: 123,
    decimals: 4,
  };

  // Ensure accounts exist
  const accountResult = await sdk.ensureTokenAccountsExist(params, keypair);
  if (accountResult.transaction) {
    const createTx = await sdk.signWithDualKeypairs(accountResult.transaction, keypair);
    await sdk.submitTransaction(createTx);
  }

  // Create and submit transfer
  const result = await sdk.createNonNativeTransferTransaction(params);
  const signedTx = await sdk.signWithDualKeypairs(result.transaction, keypair);
  const submitResult = await sdk.submitTransaction(signedTx);

  console.log("Transfer result:", submitResult);
}

basicTransfer();
```

### Example 2: Frontend Integration

```typescript
import { createGorbchainSDK, PublicKey } from "@gorbchain/solana-sdk";

async function frontendTransfer(wallet) {
  const sdk = createGorbchainSDK();

  const params = {
    mintAddress: new PublicKey("8icLSp1mF8WgtZwg5oRhjfqvAjHZ3kLyit2tXGYR4PQY"),
    fromPublicKey: wallet.publicKey,
    toPublicKey: new PublicKey("55vMC4msCGgi24KdRETGUUFAebD1KUiboCo2mJcoHFhe"),
    amount: 123,
    decimals: 4,
  };

  try {
    // Check/create accounts with wallet
    const accountResult = await sdk.ensureTokenAccountsExist(params, wallet);
    if (accountResult.transaction) {
      const createTx = await sdk.signTransferWithWalletAndKeypair(accountResult.transaction, wallet);
      await sdk.submitTransaction(createTx);
    }

    // Transfer with wallet
    const result = await sdk.createNonNativeTransferTransaction(params);
    const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet);
    const submitResult = await sdk.submitTransaction(signedTx);

    return { success: true, signature: submitResult.signature };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### Example 3: Batch Transfers

```typescript
async function batchTransfers(transfers) {
  const sdk = createGorbchainSDK();
  const keypair = Keypair.fromSecretKey(bs58.decode("Your-private-key"));

  const results = [];

  for (const transfer of transfers) {
    try {
      // Ensure accounts exist
      const accountResult = await sdk.ensureTokenAccountsExist({
        mintAddress: new PublicKey(transfer.mint),
        fromPublicKey: new PublicKey(transfer.from),
        toPublicKey: new PublicKey(transfer.to),
      }, keypair);

      if (accountResult.transaction) {
        const createTx = await sdk.signWithDualKeypairs(accountResult.transaction, keypair);
        await sdk.submitTransaction(createTx);
      }

      // Transfer
      const result = await sdk.createNonNativeTransferTransaction({
        mintAddress: new PublicKey(transfer.mint),
        fromPublicKey: new PublicKey(transfer.from),
        toPublicKey: new PublicKey(transfer.to),
        amount: transfer.amount,
        decimals: transfer.decimals,
      });

      const signedTx = await sdk.signWithDualKeypairs(result.transaction, keypair);
      const submitResult = await sdk.submitTransaction(signedTx);

      results.push({ success: true, signature: submitResult.signature });
    } catch (error) {
      results.push({ success: false, error: error.message });
    }
  }

  return results;
}

// Usage
const transfers = [
  {
    mint: "8icLSp1mF8WgtZwg5oRhjfqvAjHZ3kLyit2tXGYR4PQY",
    from: "9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM",
    to: "55vMC4msCGgi24KdRETGUUFAebD1KUiboCo2mJcoHFhe",
    amount: 123,
    decimals: 4,
  },
  // ... more transfers
];

const results = await batchTransfers(transfers);
```

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: "Account does not exist"
**Problem**: Trying to transfer tokens when the ATA doesn't exist.

**Solution**: Use `ensureTokenAccountsExist()` first:
```typescript
const accountResult = await sdk.ensureTokenAccountsExist(params, signer);
if (accountResult.transaction) {
  // Create the account
}
```

#### Issue 2: "Insufficient token balance"
**Problem**: Not enough tokens in the sender's ATA.

**Solution**: Check balance before transferring:
```typescript
const balance = await connection.getTokenAccountBalance(ata);
if (BigInt(balance.value.amount) < requiredAmount) {
  console.log("Insufficient balance");
}
```

#### Issue 3: "Invalid amount"
**Problem**: Amount is negative or zero.

**Solution**: Validate amounts:
```typescript
if (amount <= 0) {
  throw new Error("Amount must be greater than 0");
}
```

#### Issue 4: "Transaction failed"
**Problem**: Transaction simulation or submission fails.

**Solution**: Check transaction details:
```typescript
const simulation = await sdk.simulateTransaction(signedTx);
if (!simulation.success) {
  console.log("Simulation failed:", simulation.error);
}
```

### Debug Information

Enable detailed logging:
```typescript
// The SDK automatically logs:
// - Token account status
// - Transfer parameters
// - Account addresses
// - Transaction details
```

### Network-Specific Issues

#### Gorbchain vs Solana
- **Program IDs**: Gorbchain uses different program IDs
- **RPC Endpoints**: Use Gorbchain-specific endpoints
- **Token Standards**: Ensure compatibility with Gorbchain token program

#### Connection Issues
```typescript
// Use proper Gorbchain connection
const sdk = createGorbchainSDK("https://rpc.gorbchain.xyz");
```

### Performance Optimization

#### Batch Account Creation
```typescript
// Create multiple ATAs in one transaction
const instructions = [];
for (const token of tokens) {
  const ata = getAssociatedTokenAddressSync(token.mint, user, false, tokenProgram, ataProgram);
  const ix = createAssociatedTokenAccountInstruction(payer, ata, user, token.mint, tokenProgram, ataProgram);
  instructions.push(ix);
}

const tx = new Transaction().add(...instructions);
```

#### Pre-check Account Existence
```typescript
// Check without creating first
const accountResult = await sdk.ensureTokenAccountsExist(params); // No signer
console.log("From account exists:", accountResult.fromAccountExists);
console.log("To account exists:", accountResult.toAccountExists);
```

## Conclusion

The non-native transfer functionality in the Gorbchain SDK provides a robust, flexible way to handle SPL token transfers. By understanding ATAs and following the two-step process (account management + transfer), you can build reliable token transfer features for both backend and frontend applications.

Key takeaways:
- Always check ATA existence before transferring
- Use the appropriate signing method for your environment
- Handle errors gracefully with proper error messages
- Optimize for user experience with pre-checks and batch operations

For more examples and advanced usage patterns, refer to the SDK's example files in `src/examples/tests/nonNativeTransfer.test.ts`.
