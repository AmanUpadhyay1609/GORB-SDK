"use strict";
/**
 * Main Examples Index
 * This file provides easy access to all example functions organized by functionality
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXAMPLE_USAGE_GUIDE = exports.GORB = exports.PublicKey = exports.Keypair = exports.createBlockchainConfig = exports.createSDK = exports.createSolanaSDK = exports.createGorbchainSDK = void 0;
// Token Creation Examples
__exportStar(require("./tests/tokenCreation.test"), exports);
// NFT Creation Examples
__exportStar(require("./tests/nftCreation.test"), exports);
// Native Transfer Examples
__exportStar(require("./tests/nativeTransfer.test"), exports);
// Token Swap Examples
__exportStar(require("./tests/swap.test"), exports);
// Pool Creation Examples
__exportStar(require("./tests/poolCreation.test"), exports);
// Add Liquidity Examples
__exportStar(require("./tests/addLiquidity.test"), exports);
// Re-export core SDK for convenience
var core_1 = require("../core");
Object.defineProperty(exports, "createGorbchainSDK", { enumerable: true, get: function () { return core_1.createGorbchainSDK; } });
Object.defineProperty(exports, "createSolanaSDK", { enumerable: true, get: function () { return core_1.createSolanaSDK; } });
Object.defineProperty(exports, "createSDK", { enumerable: true, get: function () { return core_1.createSDK; } });
Object.defineProperty(exports, "createBlockchainConfig", { enumerable: true, get: function () { return core_1.createBlockchainConfig; } });
Object.defineProperty(exports, "Keypair", { enumerable: true, get: function () { return core_1.Keypair; } });
Object.defineProperty(exports, "PublicKey", { enumerable: true, get: function () { return core_1.PublicKey; } });
Object.defineProperty(exports, "GORB", { enumerable: true, get: function () { return core_1.GORB; } });
// Example usage guide
exports.EXAMPLE_USAGE_GUIDE = `
# GORB Chain SDK Examples

This module contains comprehensive examples for all SDK functionality, organized into separate test files:

## 📁 File Structure

- **tokenCreation.test.ts** - Token creation examples
- **nftCreation.test.ts** - NFT creation examples  
- **nativeTransfer.test.ts** - Native SOL transfer examples
- **swap.test.ts** - Token swap examples
- **poolCreation.test.ts** - Pool creation examples
- **addLiquidity.test.ts** - Add liquidity examples

## 🚀 Quick Start

1. Import the examples you need:
   \`\`\`typescript
   import { createTokenOnGorbchain, createNFTOnGorbchain } from './examples';
   \`\`\`

2. Or import from specific test files:
   \`\`\`typescript
   import { createTokenOnGorbchain } from './examples/tests/tokenCreation.test';
   \`\`\`

3. Run the examples:
   \`\`\`typescript
   // Uncomment the function you want to run in the respective test file
   createTokenOnGorbchain();
   \`\`\`

## 📚 Available Examples

### Token Creation
- createTokenOnGorbchain()
- createTokenOnCustomBlockchain()
- completeTokenCreationWithWallet()
- createMultipleTokens()
- createTokenWithErrorHandling()
- demonstrateGORBObject()

### NFT Creation
- createNFTOnGorbchain()
- createNFTWithWallet()
- createMultipleNFTs()
- createNFTWithErrorHandling()
- createNFTCustomMetadata()
- createNFTWithFreezeAuthority()

### Native Transfers
- transferSOLSingleSigner()
- transferSOLDualSigner()
- transferSOLWithWallet()
- transferSOLWithWalletAndAdmin()
- batchNativeTransfers()
- transferSOLWithErrorHandling()
- highValueTransfer()

### Token Swaps
- swapTokensSingleSigner()
- swapTokensDualSigner()
- swapTokensWithWallet()
- swapTokensWithWalletAndAdmin()
- universalSwapExample()
- batchTokenSwaps()
- swapTokensWithErrorHandling()
- highValueSwapWithSlippage()

### Pool Creation
- createPoolSingleSigner()
- createPoolDualSigner()
- createPoolWithWallet()
- createPoolWithWalletAndAdmin()
- universalPoolCreationExample()
- batchPoolCreations()
- createPoolWithErrorHandling()
- createPoolWithCustomFees()
- createMultipleTokenPairPools()

### Add Liquidity
- addLiquiditySingleSigner()
- addLiquidityDualSigner()
- addLiquidityWithWallet()
- addLiquidityWithWalletAndAdmin()
- universalAddLiquidityExample()
- batchAddLiquidity()
- addLiquidityWithErrorHandling()
- addLiquidityWithDetailedPoolInfo()
- highValueAddLiquidity()

## 🔧 Configuration

All examples use placeholder values that need to be replaced with actual values:

- Replace "your public key" with actual public keys
- Replace "your private key" with actual private keys
- Replace "PoolAddressHere" with actual pool addresses
- Replace "AdminPublicKey" with actual admin public keys

## 📖 Documentation

For detailed documentation on each functionality, see:
- NATIVE_TRANSFER_GUIDE.md
- SWAP_GUIDE.md
- POOL_CREATION_GUIDE.md
- ADD_LIQUIDITY_GUIDE.md
- BLOCKHASH_OPTIMIZATION_GUIDE.md

## 🎯 Best Practices

1. **Always simulate transactions** before submitting
2. **Use appropriate commitment levels** for different transaction types
3. **Handle errors gracefully** with try-catch blocks
4. **Validate inputs** before creating transactions
5. **Use fresh blockhashes** for better transaction success rates
6. **Test with small amounts** before high-value operations
`;
// Default export for easy access
exports.default = {
    EXAMPLE_USAGE_GUIDE: exports.EXAMPLE_USAGE_GUIDE,
};
//# sourceMappingURL=index.js.map