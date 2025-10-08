# Add Liquidity Guide

This comprehensive guide explains how to use the GORB Chain SDK to add liquidity to existing pools in Automated Market Makers (AMM). The SDK provides a complete solution for adding liquidity with support for both regular token pairs and native SOL pools.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Pool Types](#pool-types)
- [Getting Started](#getting-started)
- [Basic Add Liquidity](#basic-add-liquidity)
- [Advanced Add Liquidity](#advanced-add-liquidity)
- [Signing Methods](#signing-methods)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [Examples](#examples)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

## Overview

The add liquidity functionality allows you to add liquidity to existing pools, earning LP (Liquidity Provider) tokens in return. These LP tokens represent your share of the pool and can be used to withdraw liquidity later.

### What is Adding Liquidity?

Adding liquidity means depositing equal value amounts of two tokens into an existing pool. In return, you receive LP tokens that represent your proportional share of the pool. You earn fees from trading activity proportional to your share.

## Key Features

✅ **Universal Pool Support**: Support for token-to-token and SOL-to-token pools  
✅ **Automatic SOL Handling**: Native SOL pools are automatically detected and configured  
✅ **Flexible Fee Payment**: Sender or separate fee payer can pay transaction fees  
✅ **Fresh Blockhash**: Prevents "block height exceeded" errors  
✅ **Type Safety**: Full TypeScript support with comprehensive validation  
✅ **Error Handling**: Detailed error messages and validation  
✅ **Multiple Signing Methods**: Keypair, wallet adapter, and dual signer support  
✅ **Pool Type Support**: Works with both Pool and DetailedPoolInfo types  

## Pool Types

### 1. **Token-to-Token Pools**
Regular pools between two SPL tokens (e.g., USDC/USDT, ETH/SOL).

```typescript
const pool: Pool = {
  address: "PoolAddressHere", // Replace with actual pool address
  tokenA: {
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin"
  },
  tokenB: {
    address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // USDT
    symbol: "USDT",
    decimals: 6,
    name: "Tether USD"
  }
};
```

### 2. **SOL-to-Token Pools**
Pools involving native SOL and an SPL token (e.g., SOL/USDC, SOL/ETH).

```typescript
const pool: Pool = {
  address: "PoolAddressHere", // Replace with actual pool address
  tokenA: {
    address: "So11111111111111111111111111111111111111112", // SOL
    symbol: "SOL",
    decimals: 9,
    name: "Solana"
  },
  tokenB: {
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin"
  }
};
```

### 3. **Detailed Pool Information**
Using detailed pool information with full token metadata.

```typescript
const detailedPool: DetailedPoolInfo = {
  poolAddress: "PoolAddressHere",
  poolType: "native_sol",
  dataLength: 200,
  rawData: "...",
  tokenA: "So11111111111111111111111111111111111111112",
  tokenB: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  bump: 255,
  reserveA: 1000000000,
  reserveB: 100000000,
  totalLPSupply: 1000000,
  feeCollectedA: 1000,
  feeCollectedB: 100,
  feeTreasury: "TreasuryAddress",
  feeBps: 30,
  feePercentage: 0.3,
  tokenAInfo: {
    mintAddress: "So11111111111111111111111111111111111111112",
    programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    supply: "1000000000",
    decimals: "9",
    name: "Solana",
    symbol: "SOL",
    // ... other metadata
  },
  tokenBInfo: {
    mintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    supply: "100000000000",
    decimals: "6",
    name: "USD Coin",
    symbol: "USDC",
    // ... other metadata
  }
};
```

## Getting Started

### Installation

```bash
npm install @gorbchain/sdk
# or
yarn add @gorbchain/sdk
```

### Basic Setup

```typescript
import { createGorbchainSDK, PublicKey, Keypair } from "@gorbchain/sdk";

// Create SDK instance
const sdk = createGorbchainSDK();

// Your keypair (replace with your actual keypair)
const keypair = Keypair.generate(); // or Keypair.fromSecretKey(yourSecretKey)
```

## Basic Add Liquidity

### Step 1: Define Pool and Parameters

```typescript
const pool: Pool = {
  address: "PoolAddressHere", // Replace with actual pool address
  tokenA: {
    address: "So11111111111111111111111111111111111111112", // SOL
    symbol: "SOL",
    decimals: 9,
    name: "Solana"
  },
  tokenB: {
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin"
  }
};

const addLiquidityParams: AddLiquidityParams = {
  pool,
  amountA: 5.0, // 5 SOL
  amountB: 500, // 500 USDC
  fromPublicKey: keypair.publicKey,
};
```

### Step 2: Create Add Liquidity Transaction

```typescript
// Build transaction (no blockhash added yet)
const result = await sdk.createAddLiquidityTransaction(addLiquidityParams);
console.log("Pool PDA:", result.poolPDA.toBase58());
console.log("LP Mint:", result.lpMintPDA.toBase58());
console.log("Is Native SOL Pool:", result.isNativeSOLPool);
console.log("User Token A:", result.userTokenA.toBase58());
console.log("User Token B:", result.userTokenB.toBase58());
console.log("User LP:", result.userLP.toBase58());
```

### Step 3: Sign Transaction

```typescript
// Sign transaction (adds fresh blockhash)
const signedTx = await sdk.signWithDualKeypairs(result.transaction, keypair);
console.log("Transaction signed with fresh blockhash");
```

### Step 4: Submit Transaction

```typescript
// Submit to blockchain
const submitResult = await sdk.submitTransaction(signedTx);
if (submitResult.success) {
  console.log("✅ Liquidity added successfully:", submitResult.signature);
} else {
  console.error("❌ Add liquidity failed:", submitResult.error);
}
```

### Complete Example

```typescript
import { createGorbchainSDK, PublicKey, Keypair } from "@gorbchain/sdk";

async function addLiquidity() {
  const sdk = createGorbchainSDK();
  const keypair = Keypair.generate(); // Replace with your keypair

  const pool: Pool = {
    address: "PoolAddressHere", // Replace with actual pool address
    tokenA: {
      address: "So11111111111111111111111111111111111111112", // SOL
      symbol: "SOL",
      decimals: 9,
      name: "Solana"
    },
    tokenB: {
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
      symbol: "USDC",
      decimals: 6,
      name: "USD Coin"
    }
  };

  const addLiquidityParams: AddLiquidityParams = {
    pool,
    amountA: 2.0, // 2 SOL
    amountB: 200, // 200 USDC
    fromPublicKey: keypair.publicKey,
  };

  try {
    // Step 1: Build transaction
    const result = await sdk.createAddLiquidityTransaction(addLiquidityParams);
    console.log("✅ Add liquidity transaction created");

    // Step 2: Sign transaction
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, keypair);
    console.log("✅ Add liquidity transaction signed");

    // Step 3: Submit transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("🎉 Liquidity added successfully:", submitResult.signature);
    } else {
      console.error("❌ Add liquidity failed:", submitResult.error);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

addLiquidity();
```

## Advanced Add Liquidity

### Dual Signer (Separate Fee Payer)

When you want someone else to pay the transaction fees:

```typescript
const pool: Pool = {
  address: "PoolAddressHere", // Replace with actual pool address
  tokenA: {
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin"
  },
  tokenB: {
    address: "4eCdoBMvbUSYZBfvXwqTd7eg9fzzWzQAd54xYFoB8eKf", // Custom token
    symbol: "YH!@",
    decimals: 7,
    name: "YH1"
  }
};

const addLiquidityParams: AddLiquidityParams = {
  pool,
  amountA: 100, // 100 USDC
  amountB: 2000, // 2000 YH!@
  fromPublicKey: senderKeypair.publicKey,
  feePayerPublicKey: adminKeypair.publicKey, // Admin pays fees
};

// Build transaction
const result = await sdk.createAddLiquidityTransaction(addLiquidityParams);

// Sign with both signers
const signedTx = await sdk.signWithDualKeypairs(
  result.transaction, 
  senderKeypair, 
  adminKeypair
);

// Submit transaction
const submitResult = await sdk.submitTransaction(signedTx);
```

### Wallet Adapter Integration

For frontend applications using wallet adapters:

```typescript
const pool: Pool = {
  address: "PoolAddressHere", // Replace with actual pool address
  tokenA: {
    address: "So11111111111111111111111111111111111111112", // SOL
    symbol: "SOL",
    decimals: 9,
    name: "Solana"
  },
  tokenB: {
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin"
  }
};

const addLiquidityParams: AddLiquidityParams = {
  pool,
  amountA: 3.0, // 3 SOL
  amountB: 300, // 300 USDC
  fromPublicKey: wallet.publicKey,
};

// Build transaction
const result = await sdk.createAddLiquidityTransaction(addLiquidityParams);

// Sign with wallet
const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet);

// Simulate before submitting
const simulation = await sdk.simulateTransaction(signedTx);
if (!simulation.success) {
  throw new Error(`Simulation failed: ${simulation.error}`);
}

// Submit transaction
const submitResult = await sdk.submitTransaction(signedTx);
```

### Wallet + Admin Fee Payer

Combining wallet adapter with separate fee payer:

```typescript
const pool: Pool = {
  address: "PoolAddressHere", // Replace with actual pool address
  tokenA: {
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin"
  },
  tokenB: {
    address: "4eCdoBMvbUSYZBfvXwqTd7eg9fzzWzQAd54xYFoB8eKf", // Custom token
    symbol: "YH!@",
    decimals: 7,
    name: "YH1"
  }
};

const addLiquidityParams: AddLiquidityParams = {
  pool,
  amountA: 150, // 150 USDC
  amountB: 3000, // 3000 YH!@
  fromPublicKey: wallet.publicKey,
  feePayerPublicKey: adminKeypair.publicKey, // Admin pays fees
};

// Build transaction
const result = await sdk.createAddLiquidityTransaction(addLiquidityParams);

// Sign with wallet and admin
const signedTx = await sdk.signTransferWithWalletAndKeypair(
  result.transaction, 
  wallet, 
  adminKeypair
);

// Submit transaction
const submitResult = await sdk.submitTransaction(signedTx);
```

### Using Detailed Pool Information

When you have detailed pool information with full token metadata:

```typescript
const detailedPool: DetailedPoolInfo = {
  poolAddress: "PoolAddressHere",
  poolType: "native_sol",
  // ... other pool data
  tokenAInfo: {
    mintAddress: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    decimals: "9",
    name: "Solana",
    // ... other metadata
  },
  tokenBInfo: {
    mintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
    decimals: "6",
    name: "USD Coin",
    // ... other metadata
  }
};

const addLiquidityParams: AddLiquidityParams = {
  pool: detailedPool, // Use detailed pool info
  amountA: 1.5, // 1.5 SOL
  amountB: 150, // 150 USDC
  fromPublicKey: keypair.publicKey,
};

// Build transaction
const result = await sdk.createAddLiquidityTransaction(addLiquidityParams);

// Sign and submit
const signedTx = await sdk.signWithDualKeypairs(result.transaction, keypair);
const submitResult = await sdk.submitTransaction(signedTx);
```

## Signing Methods

### 1. Single Signer (Sender Pays Fees)

```typescript
// Using SDK method
const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);

// Using direct function
const signedTx = await signWithDualKeypairs(result.transaction, senderKeypair, connection);
```

### 2. Dual Signer (Separate Fee Payer)

```typescript
// Using SDK method
const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair, feePayerKeypair);

// Using direct function
const signedTx = await signWithDualKeypairs(result.transaction, senderKeypair, connection, feePayerKeypair);
```

### 3. Wallet Adapter (Wallet Pays Fees)

```typescript
// Using SDK method
const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet);

// Using direct function
const signedTx = await signTransferWithWalletAndKeypair(result.transaction, wallet, connection);
```

### 4. Wallet + Fee Payer

```typescript
// Using SDK method
const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet, feePayerKeypair);

// Using direct function
const signedTx = await signTransferWithWalletAndKeypair(result.transaction, wallet, connection, feePayerKeypair);
```

## Error Handling

### Basic Error Handling

```typescript
try {
  const result = await sdk.createAddLiquidityTransaction(addLiquidityParams);
  const signedTx = await sdk.signWithDualKeypairs(result.transaction, keypair);
  const submitResult = await sdk.submitTransaction(signedTx);
  
  if (submitResult.success) {
    console.log("✅ Liquidity added successfully:", submitResult.signature);
  } else {
    console.error("❌ Add liquidity failed:", submitResult.error);
  }
} catch (error) {
  if (error.name === "SDKError") {
    console.error("SDK Error:", error.message);
  } else if (error.name === "TransactionError") {
    console.error("Transaction Error:", error.message);
  } else {
    console.error("Unexpected error:", error.message);
  }
}
```

### Advanced Error Handling

```typescript
async function addLiquidityWithRetry(addLiquidityParams: AddLiquidityParams, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Build transaction
      const result = await sdk.createAddLiquidityTransaction(addLiquidityParams);
      
      // Simulate before signing
      const simulation = await sdk.simulateTransaction(result.transaction);
      if (!simulation.success) {
        throw new Error(`Simulation failed: ${simulation.error}`);
      }
      
      // Sign transaction
      const signedTx = await sdk.signWithDualKeypairs(result.transaction, keypair);
      
      // Submit transaction
      const submitResult = await sdk.submitTransaction(signedTx);
      
      if (submitResult.success) {
        return { success: true, signature: submitResult.signature };
      } else {
        throw new Error(`Submission failed: ${submitResult.error}`);
      }
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        return { success: false, error: error.message };
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}
```

## Best Practices

### 1. **Always Validate Inputs**

```typescript
// Validate amounts
if (addLiquidityParams.amountA <= 0 || addLiquidityParams.amountB <= 0) {
  throw new Error("Liquidity amounts must be greater than 0");
}

// Validate pool address
if (!addLiquidityParams.pool.address) {
  throw new Error("Pool address must be provided");
}
```

### 2. **Use Simulation Before Submission**

```typescript
// Simulate before submitting
const simulation = await sdk.simulateTransaction(signedTx);
if (!simulation.success) {
  throw new Error(`Simulation failed: ${simulation.error}`);
}
```

### 3. **Handle Native SOL Pools Properly**

```typescript
// Check if it's a native SOL pool
if (result.isNativeSOLPool) {
  console.log("Adding liquidity to native SOL pool");
  // Ensure you have enough SOL for the liquidity + fees
  const solBalance = await connection.getBalance(keypair.publicKey);
  const requiredSOL = Number(result.amountALamports) + 0.01 * LAMPORTS_PER_SOL;
  
  if (solBalance < requiredSOL) {
    throw new Error("Insufficient SOL balance");
  }
}
```

### 4. **Use Appropriate Signing Methods**

```typescript
// For simple cases - single signer
const signedTx = await sdk.signWithDualKeypairs(result.transaction, keypair);

// For admin paying fees - dual signer
const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair, adminKeypair);

// For frontend - wallet adapter
const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet);
```

### 5. **Monitor Transaction Status**

```typescript
const submitResult = await sdk.submitTransaction(signedTx);
if (submitResult.success) {
  // Wait for confirmation
  const confirmation = await sdk.waitForConfirmation(submitResult.signature);
  if (confirmation.success) {
    console.log("Liquidity added and confirmed!");
  } else {
    console.error("Confirmation failed:", confirmation.error);
  }
}
```

## Examples

### Example 1: SOL/USDC Pool

```typescript
import { createGorbchainSDK, PublicKey, Keypair } from "@gorbchain/sdk";

async function addLiquidityToSOLUSDCPool() {
  const sdk = createGorbchainSDK();
  const keypair = Keypair.generate(); // Replace with your keypair

  const pool: Pool = {
    address: "PoolAddressHere", // Replace with actual pool address
    tokenA: {
      address: "So11111111111111111111111111111111111111112", // SOL
      symbol: "SOL",
      decimals: 9,
      name: "Solana"
    },
    tokenB: {
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
      symbol: "USDC",
      decimals: 6,
      name: "USD Coin"
    }
  };

  const addLiquidityParams: AddLiquidityParams = {
    pool,
    amountA: 10.0, // 10 SOL
    amountB: 1000, // 1000 USDC
    fromPublicKey: keypair.publicKey,
  };

  try {
    const result = await sdk.createAddLiquidityTransaction(addLiquidityParams);
    console.log("Pool PDA:", result.poolPDA.toBase58());
    console.log("Is Native SOL Pool:", result.isNativeSOLPool);

    const signedTx = await sdk.signWithDualKeypairs(result.transaction, keypair);
    const submitResult = await sdk.submitTransaction(signedTx);
    
    if (submitResult.success) {
      console.log("✅ SOL/USDC liquidity added:", submitResult.signature);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}
```

### Example 2: Token-to-Token Pool with Admin Fee Payer

```typescript
async function addLiquidityWithAdmin() {
  const sdk = createGorbchainSDK();
  const senderKeypair = Keypair.generate(); // Replace with your keypair
  const adminKeypair = Keypair.generate(); // Replace with admin keypair

  const pool: Pool = {
    address: "PoolAddressHere", // Replace with actual pool address
    tokenA: {
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
      symbol: "USDC",
      decimals: 6,
      name: "USD Coin"
    },
    tokenB: {
      address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // USDT
      symbol: "USDT",
      decimals: 6,
      name: "Tether USD"
    }
  };

  const addLiquidityParams: AddLiquidityParams = {
    pool,
    amountA: 500, // 500 USDC
    amountB: 500, // 500 USDT
    fromPublicKey: senderKeypair.publicKey,
    feePayerPublicKey: adminKeypair.publicKey, // Admin pays fees
  };

  try {
    const result = await sdk.createAddLiquidityTransaction(addLiquidityParams);
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair, adminKeypair);
    const submitResult = await sdk.submitTransaction(signedTx);
    
    if (submitResult.success) {
      console.log("✅ USDC/USDT liquidity added:", submitResult.signature);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}
```

### Example 3: Batch Add Liquidity

```typescript
async function addLiquidityToMultiplePools() {
  const sdk = createGorbchainSDK();
  const keypair = Keypair.generate(); // Replace with your keypair

  const pools = [
    {
      pool: {
        address: "PoolAddress1", // Replace with actual pool address
        tokenA: { address: "So11111111111111111111111111111111111111112", symbol: "SOL", decimals: 9, name: "Solana" },
        tokenB: { address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", symbol: "USDC", decimals: 6, name: "USD Coin" },
      },
      amountA: 5.0,
      amountB: 500,
    },
    {
      pool: {
        address: "PoolAddress2", // Replace with actual pool address
        tokenA: { address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", symbol: "USDC", decimals: 6, name: "USD Coin" },
        tokenB: { address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", symbol: "USDT", decimals: 6, name: "Tether USD" },
      },
      amountA: 100,
      amountB: 100,
    },
  ];

  const results = [];
  for (const { pool, amountA, amountB } of pools) {
    const addLiquidityParams: AddLiquidityParams = {
      pool,
      amountA,
      amountB,
      fromPublicKey: keypair.publicKey,
    };

    try {
      const result = await sdk.createAddLiquidityTransaction(addLiquidityParams);
      const signedTx = await sdk.signWithDualKeypairs(result.transaction, keypair);
      const submitResult = await sdk.submitTransaction(signedTx);
      results.push(submitResult);
    } catch (error) {
      console.error("Add liquidity failed:", error.message);
      results.push({ success: false, error: error.message });
    }
  }

  console.log(`✅ Added liquidity to ${results.filter(r => r.success).length} pools`);
}
```

## API Reference

### Types

#### AddLiquidityParams
```typescript
interface AddLiquidityParams {
  pool: Pool | DetailedPoolInfo;
  amountA: number;
  amountB: number;
  fromPublicKey: PublicKey;
  feePayerPublicKey?: PublicKey;
}
```

#### AddLiquidityTransactionResult
```typescript
interface AddLiquidityTransactionResult {
  transaction: Transaction;
  poolPDA: PublicKey;
  tokenA: PublicKey;
  tokenB: PublicKey;
  lpMintPDA: PublicKey;
  vaultA: PublicKey;
  vaultB: PublicKey;
  isNativeSOLPool: boolean;
  amountALamports: bigint;
  amountBLamports: bigint;
  userTokenA: PublicKey;
  userTokenB: PublicKey;
  userLP: PublicKey;
}
```

#### AddLiquidityResult
```typescript
interface AddLiquidityResult {
  success: boolean;
  signature?: TransactionSignature;
  lpTokensReceived?: string;
  error?: string;
}
```

#### Pool
```typescript
interface Pool {
  address: string;
  tokenA: TokenInfo;
  tokenB: TokenInfo;
}
```

#### DetailedPoolInfo
```typescript
interface DetailedPoolInfo {
  poolAddress: string;
  poolType: string;
  dataLength: number;
  rawData: string;
  tokenA: string;
  tokenB: string;
  bump: number;
  reserveA: number;
  reserveB: number;
  totalLPSupply: number;
  feeCollectedA: number;
  feeCollectedB: number;
  feeTreasury: string;
  feeBps: number;
  feePercentage: number;
  tokenAInfo: DetailedTokenInfo;
  tokenBInfo: DetailedTokenInfo;
}
```

### Functions

#### createAddLiquidityTransaction()
```typescript
async function createAddLiquidityTransaction(
  connection: Connection,
  config: BlockchainConfig,
  params: AddLiquidityParams,
  payer: PublicKey
): Promise<AddLiquidityTransactionResult>
```

Creates an add liquidity transaction without signing.

#### signWithDualKeypairs()
```typescript
async function signWithDualKeypairs(
  transaction: Transaction,
  senderKeypair: Keypair,
  connection: Connection,
  feePayerKeypair?: Keypair
): Promise<Transaction>
```

Signs a transaction with dual keypairs and adds fresh blockhash.

#### signTransferWithWalletAndKeypair()
```typescript
async function signTransferWithWalletAndKeypair(
  transaction: Transaction,
  wallet: Wallet,
  connection: Connection,
  feePayerKeypair?: Keypair
): Promise<Transaction>
```

Signs a transaction with wallet adapter and optional fee payer.

#### submitTransaction()
```typescript
async function submitTransaction(
  connection: Connection,
  transaction: Transaction,
  options?: SubmitOptions
): Promise<SubmitResult>
```

Submits a signed transaction to the blockchain.

## Troubleshooting

### Common Issues

#### 1. "Insufficient SOL balance"
**Problem**: Not enough SOL for liquidity addition + fees.
**Solution**: Ensure you have enough SOL for the liquidity amount plus transaction fees.

```typescript
const solBalance = await connection.getBalance(keypair.publicKey);
const requiredSOL = Number(result.amountALamports) + 0.01 * LAMPORTS_PER_SOL;
if (solBalance < requiredSOL) {
  throw new Error("Insufficient SOL balance");
}
```

#### 2. "Invalid pool address"
**Problem**: Pool address is not a valid Solana address.
**Solution**: Validate pool addresses before adding liquidity.

```typescript
try {
  new PublicKey(poolAddress);
} catch (error) {
  throw new Error("Invalid pool address");
}
```

#### 3. "Liquidity amounts must be greater than 0"
**Problem**: One or both liquidity amounts are zero or negative.
**Solution**: Ensure both amounts are positive.

```typescript
if (amountA <= 0 || amountB <= 0) {
  throw new Error("Liquidity amounts must be greater than 0");
}
```

#### 4. "Block height exceeded"
**Problem**: Transaction was submitted too late.
**Solution**: The SDK automatically adds fresh blockhash at signing time to prevent this.

#### 5. "Simulation failed"
**Problem**: Transaction would fail if submitted.
**Solution**: Always simulate before submitting and check the logs.

```typescript
const simulation = await sdk.simulateTransaction(signedTx);
if (!simulation.success) {
  console.log("Simulation logs:", simulation.logs);
  throw new Error(`Simulation failed: ${simulation.error}`);
}
```

### Debug Tips

1. **Enable Logging**: The SDK provides detailed console logs for debugging.
2. **Check Simulation**: Always simulate transactions before submitting.
3. **Validate Inputs**: Ensure all parameters are valid before creating transactions.
4. **Monitor Balance**: Check token balances before adding liquidity.
5. **Use Testnet**: Test on devnet before using mainnet.

### Getting Help

If you encounter issues not covered in this guide:

1. Check the [SDK Documentation](../README.md)
2. Review the [Examples](../src/examples/README.md)
3. Check the [Builders README](../src/builders/README.md)
4. Check the [Signing README](../src/signing/README.md)
5. Check the [Submission README](../src/submission/README.md)

## Summary

The GORB Chain SDK provides a comprehensive solution for adding liquidity to existing pools with support for both regular token pairs and native SOL pools. The SDK handles all the complexity of liquidity addition while providing flexibility in signing methods and fee payment strategies.

Key benefits:
- ✅ Universal pool support for any token pair
- ✅ Automatic native SOL handling
- ✅ Fresh blockhash prevents transaction failures
- ✅ Multiple signing methods for different use cases
- ✅ Comprehensive error handling and validation
- ✅ Type-safe with full TypeScript support
- ✅ Support for both Pool and DetailedPoolInfo types

Start adding liquidity today with the examples provided in this guide!
