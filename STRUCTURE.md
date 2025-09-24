# Project Structure

This document describes the new professional folder structure implemented for the GORB Chain SDK.

## New Structure

```
src/
├── core/           # Core SDK functionality
│   ├── sdk.ts      # Main SDK class implementation
│   └── index.ts    # Core exports and main SDK interface
├── types/          # Type definitions
│   └── index.ts    # All TypeScript interfaces and types
├── constants/      # Configuration and constants
│   └── index.ts    # Blockchain configurations and program IDs
├── builders/       # Transaction builders
│   └── index.ts    # Token and NFT transaction building functions
├── signing/        # Signing utilities
│   └── index.ts    # Transaction signing functions
├── submission/     # Transaction submission
│   └── index.ts    # Transaction submission and confirmation utilities
├── examples/       # Example usage
│   └── index.ts    # Example functions demonstrating SDK usage
└── tests/          # Test files
    └── index.ts    # Basic validation and test functions
```

## File Organization

### Core (`src/core/`)
- **`sdk.ts`**: Main SolanaSDK class with all core functionality
- **`index.ts`**: Main exports file that re-exports everything from other modules

### Types (`src/types/`)
- **`index.ts`**: All TypeScript interfaces, types, and error classes
  - BlockchainConfig, GorbchainConfig, SolanaConfig
  - CreateTokenParams, CreateNFTParams, TransactionResult
  - Wallet, SDKConfig, SubmitOptions, SubmitResult
  - SDKError, TransactionError, SigningError

### Constants (`src/constants/`)
- **`index.ts`**: All configuration constants and program IDs
  - GORBCHAIN_PROGRAMS, SOLANA_PROGRAMS
  - GORBCHAIN_CONFIG, SOLANA_MAINNET_CONFIG, SOLANA_DEVNET_CONFIG
  - createBlockchainConfig helper function
  - GORB object for backward compatibility

### Builders (`src/builders/`)
- **`index.ts`**: Transaction building functions
  - createTokenTransaction
  - createNFTTransaction
  - Helper functions for metadata space calculation

### Signing (`src/signing/`)
- **`index.ts`**: Transaction signing utilities
  - signWithKeypair, signWithWalletAdapter
  - signAllWithWalletAdapter, signWithWalletAndKeypair
  - createCombinedSigner, validateWallet, validateKeypair

### Submission (`src/submission/`)
- **`index.ts`**: Transaction submission and confirmation
  - submitTransaction, submitTransactions
  - simulateTransaction, waitForConfirmation
  - getTransactionDetails

### Examples (`src/examples/`)
- **`index.ts`**: Example usage functions
  - createTokenOnGorbchain, createNFTOnGorbchain
  - createTokenOnCustomBlockchain
  - completeTokenCreationWithWallet
  - createMultipleTokens, createTokenWithErrorHandling

### Tests (`src/tests/`)
- **`index.ts`**: Basic validation and test functions
  - SDK creation tests
  - GORB object validation
  - Transaction building tests
  - Type validation tests

## Entry Point

The main `index.ts` file in the root directory now simply re-exports everything from `src/core`, maintaining backward compatibility while providing a clean entry point.

## Benefits of New Structure

1. **Modularity**: Each module has a clear responsibility
2. **Maintainability**: Easy to locate and modify specific functionality
3. **Scalability**: Easy to add new features in appropriate modules
4. **Professional**: Follows industry-standard folder structure
5. **Backward Compatibility**: All existing imports continue to work
6. **Type Safety**: All imports are properly typed and validated

## Import Examples

```typescript
// Main SDK imports (unchanged)
import { createGorbchainSDK, SolanaSDK } from '@gorbchain/solana-sdk';

// Specific module imports (new capability)
import { createTokenTransaction } from '@gorbchain/solana-sdk/src/builders';
import { signWithKeypair } from '@gorbchain/solana-sdk/src/signing';
import { GORBCHAIN_CONFIG } from '@gorbchain/solana-sdk/src/constants';
```

## Build Output

The TypeScript compiler generates a `dist/` folder with the same structure, making it easy to import specific modules if needed while maintaining the main entry point for most use cases.
