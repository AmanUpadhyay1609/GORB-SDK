# Examples Directory

This directory contains comprehensive examples for all SDK functionality, organized by feature for better maintainability and clarity.

## Directory Structure

```
src/examples/
├── README.md                    # This file
├── index.ts                     # Main index file with all exports
└── tests/                       # Individual test files by feature
    ├── tokenCreation.test.ts    # Token creation examples
    ├── nftCreation.test.ts      # NFT creation examples
    ├── nativeTransfer.test.ts   # Native SOL transfer examples
    ├── swap.test.ts             # Token swap examples
    ├── poolCreation.test.ts     # Pool creation examples
    └── addLiquidity.test.ts     # Add liquidity examples
```

## Overview

The examples are organized into separate test files based on functionality, making it easier to:

- **Find specific examples** - Each feature has its own dedicated file
- **Maintain code** - Changes to one feature don't affect others
- **Import selectively** - Import only the examples you need
- **Scale easily** - Add new features without cluttering existing files

## Available Examples

### 1. Token Creation (`tokenCreation.test.ts`)

Examples for creating SPL tokens with various configurations:

- `createTokenOnGorbchain()` - Basic token creation on Gorbchain
- `createTokenOnSolana()` - Token creation on Solana mainnet
- `createTokenWithWallet()` - Token creation with wallet adapter
- `createTokenWithDualSigners()` - Token creation with separate fee payer
- `batchTokenCreation()` - Create multiple tokens in batch
- `createTokenWithErrorHandling()` - Error handling examples
- `createTokenWithCustomUpdateAuthority()` - Custom update authority
- `createTokenWithSimulation()` - Token creation with simulation

### 2. NFT Creation (`nftCreation.test.ts`)

Examples for creating NFTs with different configurations:

- `createNFTOnGorbchain()` - Basic NFT creation on Gorbchain
- `createNFTWithWallet()` - NFT creation with wallet adapter
- `createNFTWithDualSigners()` - NFT creation with separate fee payer
- `batchNFTCreation()` - Create multiple NFTs in batch
- `createNFTWithErrorHandling()` - Error handling examples
- `createNFTWithCustomUpdateAuthority()` - Custom update authority
- `createNFTWithSimulation()` - NFT creation with simulation
- `createNFTOnSolanaMainnet()` - NFT creation on Solana mainnet
- `createNFTWithDetailedMetadata()` - NFT with detailed metadata
- `createNFTWithRetry()` - NFT creation with retry logic

### 3. Native Transfer (`nativeTransfer.test.ts`)

Examples for transferring native SOL:

- `transferSOLSingleSigner()` - Single signer transfer
- `transferSOLDualSigner()` - Dual signer transfer (separate fee payer)
- `transferSOLWithWallet()` - Transfer with wallet adapter
- `transferSOLWithWalletAndAdmin()` - Transfer with wallet and admin fee payer
- `universalTransferExample()` - Universal transfer example
- `batchNativeTransfers()` - Batch transfer operations
- `transferSOLWithErrorHandling()` - Error handling examples
- `transferSOLWithSimulation()` - Transfer with simulation
- `transferSOLWithRetry()` - Transfer with retry logic
- `transferSOLWithDifferentAmounts()` - Different transfer amounts

### 4. Token Swap (`swap.test.ts`)

Examples for swapping tokens (including native SOL):

- `swapTokenToToken()` - Token to token swap
- `swapSOLToToken()` - SOL to token swap
- `swapTokenToSOL()` - Token to SOL swap
- `swapWithDualSigner()` - Swap with separate fee payer
- `swapWithWallet()` - Swap with wallet adapter
- `swapWithWalletAndAdmin()` - Swap with wallet and admin fee payer
- `universalSwapExample()` - Universal swap example
- `batchTokenSwaps()` - Batch swap operations
- `swapTokensWithErrorHandling()` - Error handling examples
- `swapTokensWithSimulation()` - Swap with simulation

### 5. Pool Creation (`poolCreation.test.ts`)

Examples for creating liquidity pools:

- `createPoolSingleSigner()` - Single signer pool creation
- `createPoolDualSigner()` - Dual signer pool creation (separate fee payer)
- `createPoolWithWallet()` - Pool creation with wallet adapter
- `createPoolWithWalletAndAdmin()` - Pool creation with wallet and admin fee payer
- `universalPoolCreationExample()` - Universal pool creation example
- `batchPoolCreations()` - Batch pool creation operations
- `createPoolWithErrorHandling()` - Error handling examples
- `createPoolWithSimulation()` - Pool creation with simulation
- `createPoolWithRetry()` - Pool creation with retry logic
- `createPoolWithDifferentTokenPairs()` - Different token pair combinations

### 6. Add Liquidity (`addLiquidity.test.ts`)

Examples for adding liquidity to existing pools:

- `addLiquiditySingleSigner()` - Single signer add liquidity
- `addLiquidityDualSigner()` - Dual signer add liquidity (separate fee payer)
- `addLiquidityWithWallet()` - Add liquidity with wallet adapter
- `addLiquidityWithWalletAndAdmin()` - Add liquidity with wallet and admin fee payer
- `universalAddLiquidityExample()` - Universal add liquidity example
- `batchAddLiquidity()` - Batch add liquidity operations
- `addLiquidityWithErrorHandling()` - Error handling examples
- `addLiquidityWithSimulation()` - Add liquidity with simulation
- `addLiquidityWithRetry()` - Add liquidity with retry logic
- `addLiquidityWithDifferentAmounts()` - Different liquidity amounts

## Usage

### Import All Examples

```typescript
import { examples } from "./examples";

// Access examples by category
await examples.tokenCreation.createTokenOnGorbchain();
await examples.swap.swapTokenToToken();
await examples.poolCreation.createPoolSingleSigner();
```

### Import Specific Examples

```typescript
import { 
  createTokenOnGorbchain,
  swapTokenToToken,
  createPoolSingleSigner 
} from "./examples";

await createTokenOnGorbchain();
await swapTokenToToken();
await createPoolSingleSigner();
```

### Import by Category

```typescript
import { 
  tokenCreationExamples,
  swapExamples,
  poolCreationExamples 
} from "./examples";

await tokenCreationExamples.createTokenOnGorbchain();
await swapExamples.swapTokenToToken();
await poolCreationExamples.createPoolSingleSigner();
```

### Run All Examples

```typescript
import { runAllExamples, runExamplesByCategory } from "./examples";

// Run all examples
await runAllExamples();

// Run specific category
await runExamplesByCategory("tokenCreation");
await runExamplesByCategory("swap");
```

## Key Features

### 1. **Organized Structure**
- Each feature has its own dedicated file
- Easy to find and maintain specific examples
- Clear separation of concerns

### 2. **Comprehensive Coverage**
- Basic functionality examples
- Advanced usage patterns
- Error handling examples
- Batch operations
- Simulation examples
- Retry logic examples

### 3. **Multiple Signing Methods**
- Single signer (sender pays fees)
- Dual signer (separate fee payer)
- Wallet adapter integration
- Wallet + admin fee payer

### 4. **Real-world Scenarios**
- Different token pairs
- Various amounts
- Error handling
- Batch operations
- Simulation before submission

### 5. **Easy Integration**
- Simple import statements
- Backward compatibility
- Convenience functions
- Category-based organization

## Example Patterns

### Basic Pattern
```typescript
// 1. Build transaction
const result = await sdk.createTokenTransaction(params);

// 2. Sign transaction
const signedTx = await sdk.signWithDualKeypairs(result.transaction, keypair);

// 3. Submit transaction
const submitResult = await sdk.submitTransaction(signedTx);
```

### With Simulation
```typescript
// 1. Build transaction
const result = await sdk.createTokenTransaction(params);

// 2. Sign transaction
const signedTx = await sdk.signWithDualKeypairs(result.transaction, keypair);

// 3. Simulate before submitting
const simulation = await sdk.simulateTransaction(signedTx);
if (!simulation.success) {
  throw new Error(`Simulation failed: ${simulation.error}`);
}

// 4. Submit transaction
const submitResult = await sdk.submitTransaction(signedTx);
```

### With Error Handling
```typescript
try {
  const result = await sdk.createTokenTransaction(params);
  const signedTx = await sdk.signWithDualKeypairs(result.transaction, keypair);
  const submitResult = await sdk.submitTransaction(signedTx);
  
  if (submitResult.success) {
    console.log("✅ Success:", submitResult.signature);
  } else {
    console.error("❌ Failed:", submitResult.error);
  }
} catch (error: any) {
  console.error("❌ Error:", error.message);
}
```

## Best Practices

### 1. **Always Use Simulation**
- Simulate transactions before submitting
- Check simulation results
- Handle simulation failures gracefully

### 2. **Implement Error Handling**
- Wrap operations in try-catch blocks
- Check submission results
- Provide meaningful error messages

### 3. **Use Appropriate Signing Methods**
- Single signer for simple cases
- Dual signer when admin pays fees
- Wallet adapter for frontend integration

### 4. **Validate Inputs**
- Check amounts are positive
- Validate public keys
- Ensure required parameters are provided

### 5. **Handle Retries**
- Implement retry logic for failed operations
- Use exponential backoff
- Set maximum retry attempts

## Testing

To test the examples:

```bash
# Build the project
npm run build

# Run specific examples
node -e "
const { createTokenOnGorbchain } = require('./dist/examples');
createTokenOnGorbchain();
"

# Run all examples
node -e "
const { runAllExamples } = require('./dist/examples');
runAllExamples();
"
```

## Contributing

When adding new examples:

1. **Choose the right file** - Add to the appropriate test file based on functionality
2. **Follow naming conventions** - Use descriptive function names
3. **Include error handling** - Always wrap in try-catch blocks
4. **Add documentation** - Include JSDoc comments
5. **Export the function** - Add to the exports object in the test file
6. **Update this README** - Add the new example to the appropriate section

## Summary

The examples directory provides a comprehensive set of examples for all SDK functionality, organized in a clean and maintainable structure. Each feature has its own dedicated file with multiple examples covering different use cases, signing methods, and scenarios.

Key benefits:
- ✅ **Organized Structure** - Easy to find and maintain
- ✅ **Comprehensive Coverage** - All functionality covered
- ✅ **Multiple Patterns** - Various usage scenarios
- ✅ **Easy Integration** - Simple import statements
- ✅ **Real-world Examples** - Practical usage patterns
- ✅ **Error Handling** - Robust error handling examples
- ✅ **Best Practices** - Following SDK best practices