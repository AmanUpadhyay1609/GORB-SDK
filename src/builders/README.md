# Transaction Builders Module

This module contains all the transaction building functions for the GORB Chain SDK. These functions create Solana transactions without signing them, allowing for flexible signing strategies.

## Overview

The builders module provides functions to create different types of transactions:
- **Token Creation**: Create new SPL tokens
- **NFT Minting**: Create and mint NFTs
- **Native SOL Transfers**: Transfer native SOL between accounts
- **Token Swaps**: Universal token swapping functionality
- **Pool Creation**: Create liquidity pools for AMM

## Key Features

✅ **No Blockhash at Build Time**: Transactions are built without blockhash for maximum flexibility  
✅ **Frontend-Backend Compatible**: Can be built anywhere, signed anywhere  
✅ **Type Safe**: Full TypeScript support with proper validation  
✅ **Comprehensive Error Handling**: Detailed error messages and validation  
✅ **Flexible Fee Payment**: Support for different fee payers  

## Functions

### 1. `createTokenTransaction()`

Creates a new SPL token with metadata.

```typescript
async function createTokenTransaction(
  connection: Connection,
  config: BlockchainConfig,
  params: CreateTokenParams,
  payer: PublicKey
): Promise<TransactionResult>
```

**Parameters:**
- `connection`: Solana connection instance
- `config`: Blockchain configuration (Gorbchain/Solana)
- `params`: Token creation parameters
- `payer`: Public key that will pay for the transaction

**Returns:**
- `TransactionResult` containing the transaction, mint keypair, and mint address

**Example:**
```typescript
const params: CreateTokenParams = {
  name: "My Token",
  symbol: "MTK",
  uri: "https://example.com/metadata.json",
  decimals: 9,
  initialSupply: 1000000,
  freezeAuthority: null,
  mintAuthority: null,
};

const result = await createTokenTransaction(connection, config, params, payer);
console.log("Mint Address:", result.mintAddress.toBase58());
```

**What it does:**
1. Creates a new keypair for the mint
2. Calculates required space for metadata
3. Creates mint initialization instruction
4. Creates metadata pointer instruction
5. Creates metadata initialization instruction
6. Creates associated token account instruction
7. Creates mint-to instruction for initial supply
8. Builds transaction with all instructions

### 2. `createNFTTransaction()`

Creates and mints an NFT with metadata.

```typescript
async function createNFTTransaction(
  connection: Connection,
  config: BlockchainConfig,
  params: CreateNFTParams,
  payer: PublicKey
): Promise<TransactionResult>
```

**Parameters:**
- `connection`: Solana connection instance
- `config`: Blockchain configuration (Gorbchain/Solana)
- `params`: NFT creation parameters
- `payer`: Public key that will pay for the transaction

**Returns:**
- `TransactionResult` containing the transaction, mint keypair, and mint address

**Example:**
```typescript
const params: CreateNFTParams = {
  name: "My NFT",
  symbol: "MNFT",
  uri: "https://example.com/nft-metadata.json",
  collection: null,
  uses: null,
  isMutable: true,
  sellerFeeBasisPoints: 500, // 5%
};

const result = await createNFTTransaction(connection, config, params, payer);
console.log("NFT Mint Address:", result.mintAddress.toBase58());
```

**What it does:**
1. Creates a new keypair for the NFT mint
2. Calculates required space for NFT metadata
3. Creates mint initialization instruction (decimals = 0 for NFT)
4. Creates metadata pointer instruction
5. Creates metadata initialization instruction
6. Creates associated token account instruction
7. Creates mint-to instruction (supply = 1 for NFT)
8. Builds transaction with all instructions

### 3. `createNativeTransferTransaction()`

Creates a native SOL transfer transaction.

```typescript
async function createNativeTransferTransaction(
  connection: Connection,
  config: BlockchainConfig,
  params: TransferSOLParams
): Promise<TransferTransactionResult>
```

**Parameters:**
- `connection`: Solana connection instance
- `config`: Blockchain configuration (Gorbchain/Solana)
- `params`: Transfer parameters
- `payer`: Public key that will pay for the transaction

**Returns:**
- `TransferTransactionResult` containing the transaction and transfer details

**Example:**
```typescript
const params: TransferSOLParams = {
  fromPublicKey: new PublicKey("SenderPublicKey"),
  toPublicKey: new PublicKey("RecipientPublicKey"),
  amountInSOL: 1.5,
  feePayerPublicKey: new PublicKey("FeePayerPublicKey"), // Optional
};

const result = await createNativeTransferTransaction(connection, config, params);
console.log("Transfer Amount:", result.amountInLamports);
console.log("Fee Payer:", result.feePayerPublicKey.toBase58());
```

**What it does:**
1. Validates transfer amount (must be > 0)
2. Converts SOL amount to lamports
3. Determines fee payer (defaults to sender if not provided)
4. Creates SystemProgram.transfer instruction
5. Builds transaction with transfer instruction

### 4. `createSwapTransaction()`

Creates a universal token swap transaction.

```typescript
async function createSwapTransaction(
  connection: Connection,
  config: BlockchainConfig,
  params: SwapParams
): Promise<SwapTransactionResult>
```

**Parameters:**
- `connection`: Solana connection instance
- `config`: Blockchain configuration (Gorbchain/Solana)
- `params`: Swap parameters
- `payer`: Public key that will pay for the transaction

**Returns:**
- `SwapTransactionResult` containing the transaction and swap details

**Example:**
```typescript
const params: SwapParams = {
  fromTokenAmount: 100,
  fromToken: {
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin"
  },
  toToken: {
    address: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    decimals: 9,
    name: "Solana"
  },
  fromPublicKey: new PublicKey("SenderPublicKey"),
  feePayerPublicKey: new PublicKey("FeePayerPublicKey"), // Optional
  slippageTolerance: 0.5, // Optional, defaults to 0.5%
};

const result = await createSwapTransaction(connection, config, params);
console.log("Swap Type:", result.isNativeSOLSwap ? "Native SOL" : "Regular Token");
console.log("Pool PDA:", result.poolPDA.toBase58());
```

**What it does:**
1. Validates swap parameters
2. Determines if swap involves native SOL
3. Finds pool configuration
4. Derives vault addresses
5. Gets user token accounts
6. Converts amount to lamports
7. Creates swap instruction with proper accounts
8. Builds transaction with swap instruction

### 5. `createPoolTransaction()`

Creates a liquidity pool creation transaction.

```typescript
async function createPoolTransaction(
  connection: Connection,
  config: BlockchainConfig,
  params: CreatePoolParams,
  payer: PublicKey
): Promise<CreatePoolTransactionResult>
```

**Parameters:**
- `connection`: Solana connection instance
- `config`: Blockchain configuration (Gorbchain/Solana)
- `params`: Pool creation parameters
- `payer`: Public key that will pay for the transaction

**Returns:**
- `CreatePoolTransactionResult` containing the transaction and pool details

**Example:**
```typescript
const params: CreatePoolParams = {
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
  },
  amountA: 1.0, // 1 SOL
  amountB: 100, // 100 USDC
  fromPublicKey: new PublicKey("SenderPublicKey"),
  feePayerPublicKey: new PublicKey("FeePayerPublicKey"), // Optional
};

const result = await createPoolTransaction(connection, config, params, payer);
console.log("Pool PDA:", result.poolPDA.toBase58());
console.log("LP Mint:", result.lpMintPDA.toBase58());
console.log("Is Native SOL Pool:", result.isNativeSOLPool);
```

**What it does:**
1. Validates pool creation parameters
2. Determines if pool involves native SOL
3. Ensures SOL is always tokenA for native pools
4. Derives pool, LP mint, and vault PDAs
5. Gets user token accounts
6. Converts amounts to lamports
7. Creates InitPool instruction with proper accounts
8. Builds transaction with pool creation instruction

## Transaction Building Process

### 1. **Validation Phase**
- Validates all input parameters
- Checks token addresses and amounts
- Ensures proper configuration

### 2. **Instruction Creation Phase**
- Creates necessary instructions based on transaction type
- Handles different token types (SPL tokens, native SOL)
- Manages metadata and account creation

### 3. **Transaction Assembly Phase**
- Creates transaction object
- Sets fee payer
- Adds all instructions
- **Note**: No blockhash is added at this stage

### 4. **Result Preparation Phase**
- Packages transaction with metadata
- Returns structured result object
- Provides all necessary information for signing

## Error Handling

All builder functions include comprehensive error handling:

```typescript
try {
  const result = await createTokenTransaction(connection, config, params, payer);
  // Use result
} catch (error) {
  if (error.name === "SDKError") {
    console.error("SDK Error:", error.message);
  } else {
    console.error("Unexpected error:", error.message);
  }
}
```

**Common Error Types:**
- `SDKError`: SDK-specific errors (invalid parameters, validation failures)
- `TransactionError`: Transaction-related errors
- `SigningError`: Signing-related errors

## Best Practices

### 1. **Parameter Validation**
Always validate parameters before calling builder functions:

```typescript
if (params.amountInSOL <= 0) {
  throw new Error("Amount must be greater than 0");
}
```

### 2. **Error Handling**
Always wrap builder calls in try-catch blocks:

```typescript
try {
  const result = await createSwapTransaction(connection, config, params);
  // Handle success
} catch (error) {
  // Handle error appropriately
}
```

### 3. **Fee Payer Strategy**
Consider your fee payment strategy:

```typescript
// Option 1: Sender pays fees
const params = {
  fromPublicKey: senderPubkey,
  toPublicKey: recipientPubkey,
  amountInSOL: 1.0,
  // feePayerPublicKey not provided - sender will pay
};

// Option 2: Separate fee payer
const params = {
  fromPublicKey: senderPubkey,
  toPublicKey: recipientPubkey,
  amountInSOL: 1.0,
  feePayerPublicKey: adminPubkey, // Admin pays fees
};
```

### 4. **Transaction Lifecycle**
Remember the 3-step process:

```typescript
// Step 1: Build transaction
const result = await createSwapTransaction(connection, config, params);

// Step 2: Sign transaction (adds fresh blockhash)
const signedTx = await signWithDualKeypairs(result.transaction, keypair, connection);

// Step 3: Submit transaction
const submitResult = await submitTransaction(connection, signedTx);
```

## Integration with Other Modules

### With Signing Module
```typescript
import { createTokenTransaction } from "../builders";
import { signWithKeypair } from "../signing";

const result = await createTokenTransaction(connection, config, params, payer);
const signedTx = await signWithKeypair(result.transaction, keypair, connection);
```

### With Submission Module
```typescript
import { createNativeTransferTransaction } from "../builders";
import { submitTransaction } from "../submission";

const result = await createNativeTransferTransaction(connection, config, params);
const signedTx = await signWithDualKeypairs(result.transaction, keypair, connection);
const submitResult = await submitTransaction(connection, signedTx);
```

## Type Definitions

### CreateTokenParams
```typescript
interface CreateTokenParams {
  name: string;
  symbol: string;
  uri: string;
  decimals: number;
  initialSupply: number;
  freezeAuthority?: PublicKey | null;
  mintAuthority?: PublicKey | null;
}
```

### CreateNFTParams
```typescript
interface CreateNFTParams {
  name: string;
  symbol: string;
  uri: string;
  collection?: PublicKey | null;
  uses?: Uses | null;
  isMutable?: boolean;
  sellerFeeBasisPoints?: number;
}
```

### TransferSOLParams
```typescript
interface TransferSOLParams {
  fromPublicKey: PublicKey;
  toPublicKey: PublicKey;
  amountInSOL: number;
  feePayerPublicKey?: PublicKey;
}
```

### SwapParams
```typescript
interface SwapParams {
  fromTokenAmount: number;
  fromToken: TokenInfo;
  toToken: TokenInfo;
  fromPublicKey: PublicKey;
  feePayerPublicKey?: PublicKey;
  slippageTolerance?: number;
}
```

### CreatePoolParams
```typescript
interface CreatePoolParams {
  tokenA: TokenInfo;
  tokenB: TokenInfo;
  amountA: number;
  amountB: number;
  fromPublicKey: PublicKey;
  feePayerPublicKey?: PublicKey;
}
```

### CreatePoolTransactionResult
```typescript
interface CreatePoolTransactionResult {
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
}
```

## Summary

The builders module provides a comprehensive set of functions for creating all types of Solana transactions. By separating transaction building from signing, it enables flexible architectures and prevents common issues like "block height exceeded" errors. All functions are type-safe, well-documented, and include proper error handling.

For signing these transactions, use the functions from the `../signing` module. For submitting them, use the functions from the `../submission` module.
