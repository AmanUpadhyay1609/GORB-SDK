"use strict";
/**
 * Examples Index
 * This file imports and exports all example functions from the organized test files
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.universalPoolCreationExample = exports.createPoolWithWalletAndAdmin = exports.createPoolWithWallet = exports.createPoolDualSigner = exports.createPoolSingleSigner = exports.swapTokensWithSimulation = exports.swapTokensWithErrorHandling = exports.batchTokenSwaps = exports.universalSwapExample = exports.swapWithWalletAndAdmin = exports.swapWithWallet = exports.swapWithDualSigner = exports.swapTokenToSOL = exports.swapSOLToToken = exports.swapTokenToToken = exports.transferSOLWithDifferentAmounts = exports.transferSOLWithRetry = exports.transferSOLWithSimulation = exports.transferSOLWithErrorHandling = exports.batchNativeTransfers = exports.universalTransferExample = exports.transferSOLWithWalletAndAdmin = exports.transferSOLWithWallet = exports.transferSOLDualSigner = exports.transferSOLSingleSigner = exports.createNFTWithRetry = exports.createNFTWithDetailedMetadata = exports.createNFTOnSolanaMainnet = exports.createNFTWithSimulation = exports.createNFTWithCustomUpdateAuthority = exports.createNFTWithErrorHandling = exports.batchNFTCreation = exports.createNFTWithDualSigners = exports.createNFTWithWallet = exports.createNFTOnGorbchain = exports.createTokenWithSimulation = exports.createTokenWithCustomUpdateAuthority = exports.createTokenWithErrorHandling = exports.batchTokenCreation = exports.createTokenWithDualSigners = exports.createTokenWithWallet = exports.createTokenOnSolana = exports.createTokenOnGorbchain = exports.addLiquidityExamples = exports.poolCreationExamples = exports.swapExamples = exports.nativeTransferExamples = exports.nftCreationExamples = exports.tokenCreationExamples = exports.examples = void 0;
exports.addLiquidityWithDifferentAmounts = exports.addLiquidityWithRetry = exports.addLiquidityWithSimulation = exports.addLiquidityWithErrorHandling = exports.batchAddLiquidity = exports.universalAddLiquidityExample = exports.addLiquidityWithWalletAndAdmin = exports.addLiquidityWithWallet = exports.addLiquidityDualSigner = exports.addLiquiditySingleSigner = exports.createPoolWithDifferentTokenPairs = exports.createPoolWithRetry = exports.createPoolWithSimulation = exports.createPoolWithErrorHandling = exports.batchPoolCreations = void 0;
exports.runAllExamples = runAllExamples;
// Import all example functions from test files
const tokenCreation_test_1 = require("./tests/tokenCreation.test");
Object.defineProperty(exports, "tokenCreationExamples", { enumerable: true, get: function () { return tokenCreation_test_1.tokenCreationExamples; } });
const nftCreation_test_1 = require("./tests/nftCreation.test");
Object.defineProperty(exports, "nftCreationExamples", { enumerable: true, get: function () { return nftCreation_test_1.nftCreationExamples; } });
const nativeTransfer_test_1 = require("./tests/nativeTransfer.test");
Object.defineProperty(exports, "nativeTransferExamples", { enumerable: true, get: function () { return nativeTransfer_test_1.nativeTransferExamples; } });
const swap_test_1 = require("./tests/swap.test");
Object.defineProperty(exports, "swapExamples", { enumerable: true, get: function () { return swap_test_1.swapExamples; } });
const poolCreation_test_1 = require("./tests/poolCreation.test");
Object.defineProperty(exports, "poolCreationExamples", { enumerable: true, get: function () { return poolCreation_test_1.poolCreationExamples; } });
const addLiquidity_test_1 = require("./tests/addLiquidity.test");
Object.defineProperty(exports, "addLiquidityExamples", { enumerable: true, get: function () { return addLiquidity_test_1.addLiquidityExamples; } });
// Re-export all examples for easy access
exports.examples = {
    tokenCreation: tokenCreation_test_1.tokenCreationExamples,
    nftCreation: nftCreation_test_1.nftCreationExamples,
    nativeTransfer: nativeTransfer_test_1.nativeTransferExamples,
    swap: swap_test_1.swapExamples,
    poolCreation: poolCreation_test_1.poolCreationExamples,
    addLiquidity: addLiquidity_test_1.addLiquidityExamples,
};
// Convenience function to run all examples
async function runAllExamples() {
    console.log("🚀 Running all SDK examples...");
    try {
        console.log("\n📝 Running Token Creation Examples...");
        await exports.examples.tokenCreation.createTokenOnGorbchain();
        console.log("\n🎨 Running NFT Creation Examples...");
        await exports.examples.nftCreation.createNFTOnGorbchain();
        console.log("\n💸 Running Native Transfer Examples...");
        await exports.examples.nativeTransfer.transferSOLSingleSigner();
        console.log("\n🔄 Running Swap Examples...");
        await exports.examples.swap.swapTokenToToken();
        console.log("\n🏊 Running Pool Creation Examples...");
        await exports.examples.poolCreation.createPoolSingleSigner();
        console.log("\n💧 Running Add Liquidity Examples...");
        await exports.examples.addLiquidity.addLiquiditySingleSigner();
        console.log("\n✅ All examples completed successfully!");
    }
    catch (error) {
        console.error("❌ Error running examples:", error.message);
    }
}
// Note: Examples are designed to be called individually
// Functions that require wallet parameters should be called with a wallet object
// Example: await createTokenWithWallet(wallet);
// Export individual example functions for backward compatibility
exports.createTokenOnGorbchain = tokenCreation_test_1.tokenCreationExamples.createTokenOnGorbchain, exports.createTokenOnSolana = tokenCreation_test_1.tokenCreationExamples.createTokenOnSolana, exports.createTokenWithWallet = tokenCreation_test_1.tokenCreationExamples.createTokenWithWallet, exports.createTokenWithDualSigners = tokenCreation_test_1.tokenCreationExamples.createTokenWithDualSigners, exports.batchTokenCreation = tokenCreation_test_1.tokenCreationExamples.batchTokenCreation, exports.createTokenWithErrorHandling = tokenCreation_test_1.tokenCreationExamples.createTokenWithErrorHandling, exports.createTokenWithCustomUpdateAuthority = tokenCreation_test_1.tokenCreationExamples.createTokenWithCustomUpdateAuthority, exports.createTokenWithSimulation = tokenCreation_test_1.tokenCreationExamples.createTokenWithSimulation;
exports.createNFTOnGorbchain = nftCreation_test_1.nftCreationExamples.createNFTOnGorbchain, exports.createNFTWithWallet = nftCreation_test_1.nftCreationExamples.createNFTWithWallet, exports.createNFTWithDualSigners = nftCreation_test_1.nftCreationExamples.createNFTWithDualSigners, exports.batchNFTCreation = nftCreation_test_1.nftCreationExamples.batchNFTCreation, exports.createNFTWithErrorHandling = nftCreation_test_1.nftCreationExamples.createNFTWithErrorHandling, exports.createNFTWithCustomUpdateAuthority = nftCreation_test_1.nftCreationExamples.createNFTWithCustomUpdateAuthority, exports.createNFTWithSimulation = nftCreation_test_1.nftCreationExamples.createNFTWithSimulation, exports.createNFTOnSolanaMainnet = nftCreation_test_1.nftCreationExamples.createNFTOnSolanaMainnet, exports.createNFTWithDetailedMetadata = nftCreation_test_1.nftCreationExamples.createNFTWithDetailedMetadata, exports.createNFTWithRetry = nftCreation_test_1.nftCreationExamples.createNFTWithRetry;
exports.transferSOLSingleSigner = nativeTransfer_test_1.nativeTransferExamples.transferSOLSingleSigner, exports.transferSOLDualSigner = nativeTransfer_test_1.nativeTransferExamples.transferSOLDualSigner, exports.transferSOLWithWallet = nativeTransfer_test_1.nativeTransferExamples.transferSOLWithWallet, exports.transferSOLWithWalletAndAdmin = nativeTransfer_test_1.nativeTransferExamples.transferSOLWithWalletAndAdmin, exports.universalTransferExample = nativeTransfer_test_1.nativeTransferExamples.universalTransferExample, exports.batchNativeTransfers = nativeTransfer_test_1.nativeTransferExamples.batchNativeTransfers, exports.transferSOLWithErrorHandling = nativeTransfer_test_1.nativeTransferExamples.transferSOLWithErrorHandling, exports.transferSOLWithSimulation = nativeTransfer_test_1.nativeTransferExamples.transferSOLWithSimulation, exports.transferSOLWithRetry = nativeTransfer_test_1.nativeTransferExamples.transferSOLWithRetry, exports.transferSOLWithDifferentAmounts = nativeTransfer_test_1.nativeTransferExamples.transferSOLWithDifferentAmounts;
exports.swapTokenToToken = swap_test_1.swapExamples.swapTokenToToken, exports.swapSOLToToken = swap_test_1.swapExamples.swapSOLToToken, exports.swapTokenToSOL = swap_test_1.swapExamples.swapTokenToSOL, exports.swapWithDualSigner = swap_test_1.swapExamples.swapWithDualSigner, exports.swapWithWallet = swap_test_1.swapExamples.swapWithWallet, exports.swapWithWalletAndAdmin = swap_test_1.swapExamples.swapWithWalletAndAdmin, exports.universalSwapExample = swap_test_1.swapExamples.universalSwapExample, exports.batchTokenSwaps = swap_test_1.swapExamples.batchTokenSwaps, exports.swapTokensWithErrorHandling = swap_test_1.swapExamples.swapTokensWithErrorHandling, exports.swapTokensWithSimulation = swap_test_1.swapExamples.swapTokensWithSimulation;
exports.createPoolSingleSigner = poolCreation_test_1.poolCreationExamples.createPoolSingleSigner, exports.createPoolDualSigner = poolCreation_test_1.poolCreationExamples.createPoolDualSigner, exports.createPoolWithWallet = poolCreation_test_1.poolCreationExamples.createPoolWithWallet, exports.createPoolWithWalletAndAdmin = poolCreation_test_1.poolCreationExamples.createPoolWithWalletAndAdmin, exports.universalPoolCreationExample = poolCreation_test_1.poolCreationExamples.universalPoolCreationExample, exports.batchPoolCreations = poolCreation_test_1.poolCreationExamples.batchPoolCreations, exports.createPoolWithErrorHandling = poolCreation_test_1.poolCreationExamples.createPoolWithErrorHandling, exports.createPoolWithSimulation = poolCreation_test_1.poolCreationExamples.createPoolWithSimulation, exports.createPoolWithRetry = poolCreation_test_1.poolCreationExamples.createPoolWithRetry, exports.createPoolWithDifferentTokenPairs = poolCreation_test_1.poolCreationExamples.createPoolWithDifferentTokenPairs;
exports.addLiquiditySingleSigner = addLiquidity_test_1.addLiquidityExamples.addLiquiditySingleSigner, exports.addLiquidityDualSigner = addLiquidity_test_1.addLiquidityExamples.addLiquidityDualSigner, exports.addLiquidityWithWallet = addLiquidity_test_1.addLiquidityExamples.addLiquidityWithWallet, exports.addLiquidityWithWalletAndAdmin = addLiquidity_test_1.addLiquidityExamples.addLiquidityWithWalletAndAdmin, exports.universalAddLiquidityExample = addLiquidity_test_1.addLiquidityExamples.universalAddLiquidityExample, exports.batchAddLiquidity = addLiquidity_test_1.addLiquidityExamples.batchAddLiquidity, exports.addLiquidityWithErrorHandling = addLiquidity_test_1.addLiquidityExamples.addLiquidityWithErrorHandling, exports.addLiquidityWithSimulation = addLiquidity_test_1.addLiquidityExamples.addLiquidityWithSimulation, exports.addLiquidityWithRetry = addLiquidity_test_1.addLiquidityExamples.addLiquidityWithRetry, exports.addLiquidityWithDifferentAmounts = addLiquidity_test_1.addLiquidityExamples.addLiquidityWithDifferentAmounts;
//# sourceMappingURL=index.js.map