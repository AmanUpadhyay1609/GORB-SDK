# Examples Module

This module contains comprehensive examples demonstrating how to use the GORB Chain SDK for various blockchain operations. Each example shows the complete flow from transaction building to submission.

## Overview

The examples module provides practical examples for:
- **Token Creation**: Creating SPL tokens with metadata
- **NFT Minting**: Creating and minting NFTs
- **Native SOL Transfers**: Transferring SOL between accounts
- **Token Swaps**: Universal token swapping functionality
- **Error Handling**: Proper error handling patterns
- **Batch Operations**: Multiple transactions in sequence

## Key Features

✅ **Complete Examples**: Full transaction lifecycle examples  
✅ **Multiple Scenarios**: Single signer, dual signer, wallet integration  
✅ **Error Handling**: Comprehensive error handling examples  
✅ **Best Practices**: Production-ready code patterns  
✅ **Type Safe**: Full TypeScript support with proper types  

## Available Examples

### Token Creation Examples

#### 1. `createTokenOnGorbchain()`
Creates a token on Gorbchain with metadata.

```typescript
export async function createTokenOnGorbchain() {
  const sdk = createGorbchainSDK();
  
  const params: CreateTokenParams = {
    name: "Gorb Token",
    symbol: "GORB",
    uri: "https://example.com/metadata.json",
    decimals: 9,
    initialSupply: 1000000,
    freezeAuthority: null,
    mintAuthority: null,
  };

  const result = await sdk.createTokenTransaction(params, payer);
  const signedTx = await sdk.signWithWalletAndKeypair(result.transaction, wallet, result.mintKeypair);
  const submitResult = await sdk.submitTransaction(signedTx);
}
```

#### 2. `createNFTOnGorbchain()`
Creates an NFT on Gorbchain with metadata.

```typescript
export async function createNFTOnGorbchain() {
  const sdk = createGorbchainSDK();
  
  const params: CreateNFTParams = {
    name: "Gorb NFT",
    symbol: "GNFT",
    uri: "https://example.com/nft-metadata.json",
    collection: null,
    uses: null,
    isMutable: true,
    sellerFeeBasisPoints: 500,
  };

  const result = await sdk.createNFTTransaction(params, payer);
  const signedTx = await sdk.signWithWalletAndKeypair(result.transaction, wallet, result.mintKeypair);
  const submitResult = await sdk.submitTransaction(signedTx);
}
```

### Native SOL Transfer Examples

#### 3. `transferSOLSingleSigner()`
Native SOL transfer where sender pays fees.

```typescript
export async function transferSOLSingleSigner() {
  const sdk = createGorbchainSDK();
  
  const params: TransferSOLParams = {
    fromPublicKey: new PublicKey("SenderPublicKey"),
    toPublicKey: new PublicKey("RecipientPublicKey"),
    amountInSOL: 1.5,
    // feePayerPublicKey not provided - sender pays fees
  };

  const result = await sdk.createNativeTransferTransaction(params);
  const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
  const submitResult = await sdk.submitTransaction(signedTx);
}
```

#### 4. `transferSOLDualSigner()`
Native SOL transfer where admin pays fees.

```typescript
export async function transferSOLDualSigner() {
  const sdk = createGorbchainSDK();
  
  const params: TransferSOLParams = {
    fromPublicKey: new PublicKey("SenderPublicKey"),
    toPublicKey: new PublicKey("RecipientPublicKey"),
    amountInSOL: 1.5,
    feePayerPublicKey: new PublicKey("AdminPublicKey"), // Admin pays fees
  };

  const result = await sdk.createNativeTransferTransaction(params);
  const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair, adminKeypair);
  const submitResult = await sdk.submitTransaction(signedTx);
}
```

#### 5. `transferSOLWithWallet()`
Native SOL transfer using wallet adapter.

```typescript
export async function transferSOLWithWallet(wallet: any) {
  const sdk = createGorbchainSDK();
  
  const params: TransferSOLParams = {
    fromPublicKey: wallet.publicKey,
    toPublicKey: new PublicKey("RecipientPublicKey"),
    amountInSOL: 1.5,
  };

  const result = await sdk.createNativeTransferTransaction(params);
  const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet);
  
  // Simulate before submitting
  const simulation = await sdk.simulateTransaction(signedTx);
  if (!simulation.success) {
    throw new Error(`Simulation failed: ${simulation.error}`);
  }

  const submitResult = await sdk.submitTransaction(signedTx);
}
```

#### 6. `transferSOLWithWalletAndAdmin()`
Native SOL transfer with wallet and admin fee payer.

```typescript
export async function transferSOLWithWalletAndAdmin(wallet: any) {
  const sdk = createGorbchainSDK();
  
  const params: TransferSOLParams = {
    fromPublicKey: wallet.publicKey,
    toPublicKey: new PublicKey("RecipientPublicKey"),
    amountInSOL: 1.5,
    feePayerPublicKey: new PublicKey("AdminPublicKey"), // Admin pays fees
  };

  const result = await sdk.createNativeTransferTransaction(params);
  const adminKeypair = Keypair.fromSecretKey(/* admin private key */);
  const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet, adminKeypair);
  const submitResult = await sdk.submitTransaction(signedTx);
}
```

### Token Swap Examples

#### 7. `swapTokensSingleSigner()`
Token swap where sender pays fees.

```typescript
export async function swapTokensSingleSigner() {
  const sdk = createGorbchainSDK();
  
  const swapParams: SwapParams = {
    fromTokenAmount: 100,
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
    fromPublicKey: new PublicKey("SenderPublicKey"),
    slippageTolerance: 0.5,
  };

  const result = await sdk.createSwapTransaction(swapParams);
  const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
  const submitResult = await sdk.submitTransaction(signedTx);
}
```

#### 8. `swapTokensDualSigner()`
Token swap where admin pays fees.

```typescript
export async function swapTokensDualSigner() {
  const sdk = createGorbchainSDK();
  
  const swapParams: SwapParams = {
    fromTokenAmount: 1.5,
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
    fromPublicKey: new PublicKey("SenderPublicKey"),
    feePayerPublicKey: new PublicKey("AdminPublicKey"), // Admin pays fees
    slippageTolerance: 1.0,
  };

  const result = await sdk.createSwapTransaction(swapParams);
  const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair, adminKeypair);
  const submitResult = await sdk.submitTransaction(signedTx);
}
```

#### 9. `swapTokensWithWallet()`
Token swap using wallet adapter.

```typescript
export async function swapTokensWithWallet(wallet: any) {
  const sdk = createGorbchainSDK();
  
  const swapParams: SwapParams = {
    fromTokenAmount: 50,
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
    fromPublicKey: wallet.publicKey,
    slippageTolerance: 0.3,
  };

  const result = await sdk.createSwapTransaction(swapParams);
  const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet);
  
  // Simulate before submitting
  const simulation = await sdk.simulateTransaction(signedTx);
  if (!simulation.success) {
    throw new Error(`Simulation failed: ${simulation.error}`);
  }

  const submitResult = await sdk.submitTransaction(signedTx);
}
```

#### 10. `swapTokensWithWalletAndAdmin()`
Token swap with wallet and admin fee payer.

```typescript
export async function swapTokensWithWalletAndAdmin(wallet: any) {
  const sdk = createGorbchainSDK();
  
  const swapParams: SwapParams = {
    fromTokenAmount: 2.0,
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
    fromPublicKey: wallet.publicKey,
    feePayerPublicKey: new PublicKey("AdminPublicKey"), // Admin pays fees
    slippageTolerance: 0.8,
  };

  const result = await sdk.createSwapTransaction(swapParams);
  const adminKeypair = Keypair.fromSecretKey(/* admin private key */);
  const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet, adminKeypair);
  const submitResult = await sdk.submitTransaction(signedTx);
}
```

### Universal Swap Example

#### 11. `universalSwapExample()`
Demonstrates universal swap functionality that automatically detects SOL involvement.

```typescript
export async function universalSwapExample() {
  const sdk = createGorbchainSDK();

  // SOL to Token swap
  const solToTokenSwap: SwapParams = {
    fromTokenAmount: 1.0,
    fromToken: {
      address: "So11111111111111111111111111111111111111112", // SOL
      symbol: "Gorb",
      decimals: 9,
      name: "Gorb"
    },
    toToken: {
      address: "4eCdoBMvbUSYZBfvXwqTd7eg9fzzWzQAd54xYFoB8eKf", // USDC
      symbol: "YH!@",
      decimals: 7,
      name: "YH1"
    },
    fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
    slippageTolerance: 0.5,
  };

  console.log("🔄 Building SOL to Token swap...");
  const result = await sdk.createSwapTransaction(solToTokenSwap);
  console.log("✅ SOL to Token swap built:", result.isNativeSOLSwap ? "Native SOL" : "Regular");

  // Example of signing the swap transaction
  // You can use any of these signing methods:

  // Method 1: Single signer (sender pays fees)
  // const senderKeypair = Keypair.generate(); // Replace with your actual keypair
  // const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);

  // Method 2: Dual signer (separate fee payer)
  // const senderKeypair = Keypair.generate(); // Replace with your actual keypair
  // const feePayerKeypair = Keypair.generate(); // Replace with your actual fee payer keypair
  // const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair, feePayerKeypair);

  // Method 3: With wallet adapter
  // const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet);

  // Method 4: With wallet and separate fee payer
  // const feePayerKeypair = Keypair.generate(); // Replace with your actual fee payer keypair
  // const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet, feePayerKeypair);

  console.log("🎉 Universal swap examples completed!");
}
```

### Batch Operations Examples

#### 12. `batchNativeTransfers()`
Demonstrates multiple native transfers in sequence.

```typescript
export async function batchNativeTransfers() {
  const sdk = createGorbchainSDK();
  
  const transfers = [
    { to: "Recipient1", amount: 0.5 },
    { to: "Recipient2", amount: 1.0 },
    { to: "Recipient3", amount: 2.5 },
  ];

  const results = [];
  for (const transfer of transfers) {
    const params: TransferSOLParams = {
      fromPublicKey: senderPubkey,
      toPublicKey: new PublicKey(transfer.to),
      amountInSOL: transfer.amount,
    };

    const result = await sdk.createNativeTransferTransaction(params);
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
    const submitResult = await sdk.submitTransaction(signedTx);
    results.push(submitResult);
  }

  console.log("✅ Batch transfers completed!");
}
```

#### 13. `batchTokenSwaps()`
Demonstrates multiple token swaps in sequence.

```typescript
export async function batchTokenSwaps() {
  const sdk = createGorbchainSDK();
  
  const swaps = [
    {
      fromToken: { address: "USDC_MINT", symbol: "USDC", decimals: 6 },
      toToken: { address: "SOL_MINT", symbol: "SOL", decimals: 9 },
      amount: 25,
    },
    {
      fromToken: { address: "SOL_MINT", symbol: "SOL", decimals: 9 },
      toToken: { address: "USDC_MINT", symbol: "USDC", decimals: 6 },
      amount: 0.5,
    },
  ];

  const results = [];
  for (const swap of swaps) {
    const swapParams: SwapParams = {
      fromTokenAmount: swap.amount,
      fromToken: swap.fromToken,
      toToken: swap.toToken,
      fromPublicKey: senderPubkey,
    };

    const result = await sdk.createSwapTransaction(swapParams);
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
    const submitResult = await sdk.submitTransaction(signedTx);
    results.push(submitResult);
  }

  console.log("✅ Batch swaps completed!");
}
```

### Error Handling Examples

#### 14. `transferSOLWithErrorHandling()`
Demonstrates proper error handling for transfers.

```typescript
export async function transferSOLWithErrorHandling() {
  const sdk = createGorbchainSDK();

  try {
    // Test with invalid amount
    const invalidParams: TransferSOLParams = {
      fromPublicKey: new PublicKey("SenderPublicKey"),
      toPublicKey: new PublicKey("RecipientPublicKey"),
      amountInSOL: -10, // Invalid negative amount
    };

    await sdk.createNativeTransferTransaction(invalidParams);
  } catch (error: any) {
    console.error("Expected error for invalid amount:", error.message);
  }

  try {
    // Test with invalid public key
    const invalidKeyParams: TransferSOLParams = {
      fromPublicKey: new PublicKey("InvalidPublicKey"),
      toPublicKey: new PublicKey("RecipientPublicKey"),
      amountInSOL: 1.0,
    };

    await sdk.createNativeTransferTransaction(invalidKeyParams);
  } catch (error: any) {
    console.error("Expected error for invalid public key:", error.message);
  }

  console.log("✅ Error handling tests completed!");
}
```

#### 15. `swapTokensWithErrorHandling()`
Demonstrates proper error handling for swaps.

```typescript
export async function swapTokensWithErrorHandling() {
  const sdk = createGorbchainSDK();

  try {
    // Test with invalid amount
    const invalidSwapParams: SwapParams = {
      fromTokenAmount: -10, // Invalid negative amount
      fromToken: {
        address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        symbol: "USDC",
        decimals: 6,
      },
      toToken: {
        address: "So11111111111111111111111111111111111111112",
        symbol: "SOL",
        decimals: 9,
      },
      fromPublicKey: new PublicKey("SenderPublicKey"),
    };

    await sdk.createSwapTransaction(invalidSwapParams);
  } catch (error: any) {
    console.error("Expected error for invalid amount:", error.message);
  }

  try {
    // Test with invalid token addresses
    const invalidTokenParams: SwapParams = {
      fromTokenAmount: 10,
      fromToken: {
        address: "", // Invalid empty address
        symbol: "USDC",
        decimals: 6,
      },
      toToken: {
        address: "So11111111111111111111111111111111111111112",
        symbol: "SOL",
        decimals: 9,
      },
      fromPublicKey: new PublicKey("SenderPublicKey"),
    };

    await sdk.createSwapTransaction(invalidTokenParams);
  } catch (error: any) {
    console.error("Expected error for invalid token address:", error.message);
  }

  console.log("✅ Error handling tests completed!");
}
```

## Signing Methods Guide

### For Swap Transactions

When signing swap transactions, you have several options:

#### 1. **Single Signer (Sender Pays Fees)**
```typescript
// Using SDK method
const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);

// Using direct function
const signedTx = await signWithDualKeypairs(result.transaction, senderKeypair, connection);
```

#### 2. **Dual Signer (Separate Fee Payer)**
```typescript
// Using SDK method
const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair, feePayerKeypair);

// Using direct function
const signedTx = await signWithDualKeypairs(result.transaction, senderKeypair, connection, feePayerKeypair);
```

#### 3. **Wallet Adapter (Wallet Pays Fees)**
```typescript
// Using SDK method
const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet);

// Using direct function
const signedTx = await signTransferWithWalletAndKeypair(result.transaction, wallet, connection);
```

#### 4. **Wallet + Fee Payer**
```typescript
// Using SDK method
const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet, feePayerKeypair);

// Using direct function
const signedTx = await signTransferWithWalletAndKeypair(result.transaction, wallet, connection, feePayerKeypair);
```

## Running Examples

### Uncomment Examples
To run specific examples, uncomment them in the examples file:

```typescript
// uncomment the function you want to run
// createTokenOnGorbchain();
// createNFTOnGorbchain();
// transferSOLSingleSigner();
// transferSOLDualSigner();
// transferSOLWithWallet(wallet);
// transferSOLWithWalletAndAdmin(wallet);
// batchNativeTransfers();
// transferSOLWithErrorHandling();
// swapTokensSingleSigner();
// swapTokensDualSigner();
// swapTokensWithWallet(wallet);
// swapTokensWithWalletAndAdmin(wallet);
universalSwapExample(); // ← This one is currently active
// batchTokenSwaps();
// swapTokensWithErrorHandling();
```

### Example Usage
```typescript
import { universalSwapExample } from "./examples";

// Run the example
await universalSwapExample();
```

## Best Practices

### 1. **Always Use Simulation**
```typescript
const simulation = await sdk.simulateTransaction(signedTx);
if (!simulation.success) {
  throw new Error(`Simulation failed: ${simulation.error}`);
}
```

### 2. **Handle Errors Gracefully**
```typescript
try {
  const result = await sdk.createSwapTransaction(swapParams);
  const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
  const submitResult = await sdk.submitTransaction(signedTx);
} catch (error) {
  console.error("Transaction failed:", error.message);
}
```

### 3. **Use Appropriate Signing Methods**
- **Single Signer**: When sender can pay fees
- **Dual Signer**: When you have separate fee payer
- **Wallet Adapter**: For frontend integration
- **Combined**: For complex scenarios

### 4. **Validate Inputs**
```typescript
if (params.amountInSOL <= 0) {
  throw new Error("Amount must be greater than 0");
}
```

## Summary

The examples module provides comprehensive, production-ready examples for all SDK functionality. Each example demonstrates the complete transaction lifecycle from building to submission, with proper error handling and best practices.

Use these examples as templates for your own implementations, adapting them to your specific use cases and requirements.
