# Universal Token Swap Guide

This guide explains how to use the universal token swap functionality in the GORB Chain SDK.

## Overview

The SDK now supports universal token swaps with flexible fee payment options:
- **Token to Token**: Swap between any SPL tokens
- **SOL to Token**: Swap native SOL to any SPL token
- **Token to SOL**: Swap any SPL token to native SOL
- **Flexible Fee Payment**: Sender or separate fee payer can pay transaction fees
- **Dual Signer Support**: Handle transactions with different signers
- **Wallet Adapter Compatible**: Works with frontend wallet integrations

## Key Features

✅ **Universal Swapping**: Handles all token combinations automatically  
✅ **Native SOL Support**: Seamlessly handles SOL ↔ Token swaps  
✅ **Flexible Fee Payment**: Sender or separate fee payer can pay transaction fees  
✅ **Dual Signer Support**: Handle transactions with different signers  
✅ **Wallet Adapter Compatible**: Works with frontend wallet integrations  
✅ **Type Safe**: Full TypeScript support with proper type definitions  
✅ **Error Handling**: Comprehensive error handling and validation  
✅ **Batch Operations**: Support for multiple swaps  
✅ **Slippage Protection**: Configurable slippage tolerance  

## Types

### TokenInfo
```typescript
interface TokenInfo {
  address: string;        // Token mint address
  symbol: string;         // Token symbol (e.g., "USDC", "SOL")
  decimals: number;       // Token decimals
  name?: string;          // Optional token name
}
```

### SwapParams
```typescript
interface SwapParams {
  fromTokenAmount: number;           // Amount to swap (in token units, not lamports)
  fromToken: TokenInfo;              // Source token info
  toToken: TokenInfo;                // Destination token info
  fromPublicKey: PublicKey;          // Sender's public key
  feePayerPublicKey?: PublicKey;     // Optional fee payer (defaults to sender)
  slippageTolerance?: number;        // Optional slippage tolerance (defaults to 0.5%)
}
```

### SwapTransactionResult
```typescript
interface SwapTransactionResult {
  transaction: Transaction;           // Built transaction
  fromToken: TokenInfo;              // Source token info
  toToken: TokenInfo;                // Destination token info
  fromTokenAmount: number;           // Amount in token units
  fromTokenAmountLamports: bigint;   // Amount in lamports
  fromPublicKey: PublicKey;          // Sender's public key
  feePayerPublicKey: PublicKey;      // Actual fee payer
  poolPDA: PublicKey;                // Pool program derived address
  tokenA: PublicKey;                 // Pool token A
  tokenB: PublicKey;                 // Pool token B
  vaultA: PublicKey;                 // Pool vault A
  vaultB: PublicKey;                 // Pool vault B
  userFromToken: PublicKey;          // User's source token account
  userToToken: PublicKey;            // User's destination token account
  directionAtoB: boolean;            // Swap direction
  isNativeSOLSwap: boolean;          // Whether this involves native SOL
  instructions: any[];               // Transaction instructions
}
```

### SwapResult
```typescript
interface SwapResult {
  success: boolean;                  // Swap success status
  signature?: TransactionSignature;  // Transaction signature
  explorerUrl?: string;              // Explorer URL (if available)
  error?: string;                    // Error message (if failed)
}
```

## Usage Examples

### 1. Token to Token Swap (Single Signer)

```typescript
import { createGorbchainSDK, PublicKey, Keypair, TokenInfo, SwapParams } from '@gorbchain/solana-sdk';
import bs58 from 'bs58';

const sdk = createGorbchainSDK();

// Token information
const fromToken: TokenInfo = {
  address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
  symbol: "USDC",
  decimals: 6,
  name: "USD Coin"
};

const toToken: TokenInfo = {
  address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // USDT
  symbol: "USDT",
  decimals: 6,
  name: "Tether USD"
};

// Swap parameters
const swapParams: SwapParams = {
  fromTokenAmount: 100, // 100 USDC
  fromToken,
  toToken,
  fromPublicKey: new PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"),
  slippageTolerance: 0.5, // 0.5% slippage
};

// Build the transaction
const result = await sdk.createSwapTransaction(swapParams);
console.log("✅ Swap transaction created successfully!");
console.log("🔄 From:", result.fromToken.symbol, result.fromTokenAmount);
console.log("🔄 To:", result.toToken.symbol);
console.log("📍 Pool PDA:", result.poolPDA.toBase58());
console.log("📍 Native SOL Swap:", result.isNativeSOLSwap);

// Sign with sender keypair
const privateKeyBuf = bs58.decode("your sender private key");
const senderKeypair = Keypair.fromSecretKey(Uint8Array.from(privateKeyBuf));
const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);

// Submit the transaction
const submitResult = await sdk.submitTransaction(signedTx);
console.log("Swap signature:", submitResult.signature);
```

### 2. SOL to Token Swap (Dual Signer)

```typescript
// SOL to Token swap with admin paying fees
const swapParams: SwapParams = {
  fromTokenAmount: 1.5, // 1.5 SOL
  fromToken: {
    address: "So11111111111111111111111111111111111111112", // SOL
    symbol: "SOL",
    decimals: 9,
    name: "Solana"
  },
  toToken: {
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin"
  },
  fromPublicKey: new PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"),
  feePayerPublicKey: new PublicKey("AdminPublicKeyHere"), // Admin pays fees
  slippageTolerance: 1.0, // 1% slippage
};

const result = await sdk.createSwapTransaction(swapParams);

// Sign with both sender and fee payer keypairs
const senderPrivateKeyBuf = bs58.decode("your sender private key");
const senderKeypair = Keypair.fromSecretKey(Uint8Array.from(senderPrivateKeyBuf));

const feePayerPrivateKeyBuf = bs58.decode("your admin private key");
const feePayerKeypair = Keypair.fromSecretKey(Uint8Array.from(feePayerPrivateKeyBuf));

const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair, feePayerKeypair);
const submitResult = await sdk.submitTransaction(signedTx);
```

### 3. Token to SOL Swap (Wallet Integration)

```typescript
// Token to SOL swap with wallet
const swapParams: SwapParams = {
  fromTokenAmount: 50, // 50 USDC
  fromToken: {
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin"
  },
  toToken: {
    address: "So11111111111111111111111111111111111111112", // SOL
    symbol: "SOL",
    decimals: 9,
    name: "Solana"
  },
  fromPublicKey: wallet.publicKey, // Wallet is the sender
  slippageTolerance: 0.3, // 0.3% slippage
};

const result = await sdk.createSwapTransaction(swapParams);

// Sign with wallet
const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet);

// Simulate before submitting (recommended)
const simulation = await sdk.simulateTransaction(signedTx);
if (!simulation.success) {
  throw new Error(`Simulation failed: ${simulation.error}`);
}

// Submit the transaction
const submitResult = await sdk.submitTransaction(signedTx);
```

### 4. Universal Swap Detection

```typescript
// The SDK automatically detects the swap type
const tokenToTokenSwap: SwapParams = {
  fromTokenAmount: 100,
  fromToken: { address: "USDC_MINT", symbol: "USDC", decimals: 6 },
  toToken: { address: "USDT_MINT", symbol: "USDT", decimals: 6 },
  fromPublicKey: new PublicKey("SENDER_PUBKEY"),
};

const result = await sdk.createSwapTransaction(tokenToTokenSwap);
console.log("Swap type:", result.isNativeSOLSwap ? "Native SOL" : "Regular Token");
```

## SDK Methods

### Transaction Building
- `createSwapTransaction(params: SwapParams): Promise<SwapTransactionResult>`

### Signing Methods
- `signWithDualKeypairs(transaction, senderKeypair, feePayerKeypair?): Promise<Transaction>`
- `signTransferWithWalletAndKeypair(transaction, wallet, feePayerKeypair?): Promise<Transaction>`

### Helper Functions
- `createSwapSigner(senderKeypair, feePayerKeypair?): Function`
- `createSwapWalletSigner(wallet, feePayerKeypair?): Function`

## Swap Types

### 1. Token to Token Swaps
- **Description**: Swap between two SPL tokens
- **Example**: USDC → USDT, USDT → BONK
- **Native SOL**: `isNativeSOLSwap = false`

### 2. SOL to Token Swaps
- **Description**: Swap native SOL to any SPL token
- **Example**: SOL → USDC, SOL → BONK
- **Native SOL**: `isNativeSOLSwap = true`

### 3. Token to SOL Swaps
- **Description**: Swap any SPL token to native SOL
- **Example**: USDC → SOL, BONK → SOL
- **Native SOL**: `isNativeSOLSwap = true`

## Pool Configuration

The SDK automatically handles pool configuration:

```typescript
// Pool information is automatically derived
const result = await sdk.createSwapTransaction(swapParams);

console.log("Pool Details:", {
  poolPDA: result.poolPDA.toBase58(),
  tokenA: result.tokenA.toBase58(),
  tokenB: result.tokenB.toBase58(),
  vaultA: result.vaultA.toBase58(),
  vaultB: result.vaultB.toBase58(),
  direction: result.directionAtoB ? "A to B" : "B to A",
  isNativeSOL: result.isNativeSOLSwap
});
```

## Error Handling

The SDK provides comprehensive error handling:

```typescript
try {
  const result = await sdk.createSwapTransaction({
    fromTokenAmount: -10, // Invalid negative amount
    fromToken: { address: "USDC_MINT", symbol: "USDC", decimals: 6 },
    toToken: { address: "SOL_MINT", symbol: "SOL", decimals: 9 },
    fromPublicKey: new PublicKey("SENDER_PUBKEY"),
  });
} catch (error) {
  if (error.name === "SDKError") {
    console.error("SDK Error:", error.message);
  } else if (error.name === "TransactionError") {
    console.error("Transaction Error:", error.message);
  } else if (error.name === "SigningError") {
    console.error("Signing Error:", error.message);
  }
}
```

## Validation

The SDK automatically validates:
- ✅ Amount must be greater than 0
- ✅ Token addresses must be valid Solana addresses
- ✅ Public keys must be valid
- ✅ Keypairs must be valid (64-byte secret keys)
- ✅ Wallet adapters must have required methods
- ✅ Pool configuration must be valid

## Best Practices

1. **Always simulate transactions** before submitting:
   ```typescript
   const simulation = await sdk.simulateTransaction(signedTx);
   if (!simulation.success) {
     throw new Error(`Simulation failed: ${simulation.error}`);
   }
   ```

2. **Use appropriate slippage tolerance**:
   ```typescript
   const swapParams: SwapParams = {
     // ... other params
     slippageTolerance: 0.5, // 0.5% for stablecoins
     // slippageTolerance: 2.0, // 2% for volatile tokens
   };
   ```

3. **Handle different swap types appropriately**:
   ```typescript
   const result = await sdk.createSwapTransaction(swapParams);
   
   if (result.isNativeSOLSwap) {
     console.log("This is a native SOL swap");
     // Handle SOL-specific logic if needed
   } else {
     console.log("This is a regular token swap");
     // Handle token-specific logic if needed
   }
   ```

4. **Use batch operations** for multiple swaps to save on fees

5. **Consider using separate fee payers** for better user experience

## Integration with Existing Code

The swap functionality integrates seamlessly with existing SDK features:

- Uses the same connection and configuration system
- Compatible with existing submission and confirmation methods
- Follows the same error handling patterns
- Works with all supported blockchains (Gorbchain, Solana)

## Migration from Custom Swap Code

If you have existing custom swap code, you can easily migrate:

```typescript
// Old way (custom implementation)
const connection = new Connection(rpcUrl, "confirmed");
const transaction = new Transaction();
// ... manual transaction building

// New way (using SDK)
const sdk = createGorbchainSDK();
const result = await sdk.createSwapTransaction({
  fromTokenAmount: amount,
  fromToken: { address: fromTokenMint, symbol: "FROM", decimals: 6 },
  toToken: { address: toTokenMint, symbol: "TO", decimals: 9 },
  fromPublicKey: senderPubkey,
  feePayerPublicKey: feePayerPubkey, // Optional
  slippageTolerance: 0.5, // Optional
});
```

## Advanced Usage

### Custom Pool Configuration

```typescript
// The SDK handles pool configuration automatically
// But you can access pool details after transaction creation
const result = await sdk.createSwapTransaction(swapParams);

// Access pool information
console.log("Pool Configuration:", {
  poolPDA: result.poolPDA.toBase58(),
  tokenA: result.tokenA.toBase58(),
  tokenB: result.tokenB.toBase58(),
  vaultA: result.vaultA.toBase58(),
  vaultB: result.vaultB.toBase58(),
  direction: result.directionAtoB ? "A to B" : "B to A"
});
```

### Batch Swaps

```typescript
const swaps = [
  { fromToken: USDC, toToken: SOL, amount: 100 },
  { fromToken: SOL, toToken: USDT, amount: 1.5 },
  { fromToken: USDT, toToken: BONK, amount: 50 },
];

const results = [];
for (const swap of swaps) {
  const result = await sdk.createSwapTransaction({
    fromTokenAmount: swap.amount,
    fromToken: swap.fromToken,
    toToken: swap.toToken,
    fromPublicKey: senderPubkey,
  });
  
  const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
  const submitResult = await sdk.submitTransaction(signedTx);
  results.push(submitResult);
}
```

The SDK handles all the complexity of transaction building, pool configuration, signing, and submission while providing a clean, type-safe API for universal token swapping! 🎉
