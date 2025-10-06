/**
 * Examples Index
 * This file imports and exports all example functions from the organized test files
 */

// Import all example functions from test files
import { tokenCreationExamples } from "./tests/tokenCreation.test";
import { nftCreationExamples } from "./tests/nftCreation.test";
import { nativeTransferExamples } from "./tests/nativeTransfer.test";
import { swapExamples } from "./tests/swap.test";
import { poolCreationExamples } from "./tests/poolCreation.test";
import { addLiquidityExamples } from "./tests/addLiquidity.test";

// Re-export all examples for easy access
export const examples = {
  tokenCreation: tokenCreationExamples,
  nftCreation: nftCreationExamples,
  nativeTransfer: nativeTransferExamples,
  swap: swapExamples,
  poolCreation: poolCreationExamples,
  addLiquidity: addLiquidityExamples,
};

// Individual exports for direct access
export {
  tokenCreationExamples,
  nftCreationExamples,
  nativeTransferExamples,
  swapExamples,
  poolCreationExamples,
  addLiquidityExamples,
};

// Convenience function to run all examples
export async function runAllExamples() {
  console.log("🚀 Running all SDK examples...");
  
  try {
    console.log("\n📝 Running Token Creation Examples...");
    await examples.tokenCreation.createTokenOnGorbchain();
    
    console.log("\n🎨 Running NFT Creation Examples...");
    await examples.nftCreation.createNFTOnGorbchain();
    
    console.log("\n💸 Running Native Transfer Examples...");
    await examples.nativeTransfer.transferSOLSingleSigner();
    
    console.log("\n🔄 Running Swap Examples...");
    await examples.swap.swapTokenToToken();
    
    console.log("\n🏊 Running Pool Creation Examples...");
    await examples.poolCreation.createPoolSingleSigner();
    
    console.log("\n💧 Running Add Liquidity Examples...");
    await examples.addLiquidity.addLiquiditySingleSigner();
    
    console.log("\n✅ All examples completed successfully!");
  } catch (error: any) {
    console.error("❌ Error running examples:", error.message);
  }
}

// Note: Examples are designed to be called individually
// Functions that require wallet parameters should be called with a wallet object
// Example: await createTokenWithWallet(wallet);

// Export individual example functions for backward compatibility
export const {
  createTokenOnGorbchain,
  createTokenOnSolana,
  createTokenWithWallet,
  createTokenWithDualSigners,
  batchTokenCreation,
  createTokenWithErrorHandling,
  createTokenWithCustomUpdateAuthority,
  createTokenWithSimulation,
} = tokenCreationExamples;

export const {
  createNFTOnGorbchain,
  createNFTWithWallet,
  createNFTWithDualSigners,
  batchNFTCreation,
  createNFTWithErrorHandling,
  createNFTWithCustomUpdateAuthority,
  createNFTWithSimulation,
  createNFTOnSolanaMainnet,
  createNFTWithDetailedMetadata,
  createNFTWithRetry,
} = nftCreationExamples;

export const {
  transferSOLSingleSigner,
  transferSOLDualSigner,
  transferSOLWithWallet,
  transferSOLWithWalletAndAdmin,
  universalTransferExample,
  batchNativeTransfers,
  transferSOLWithErrorHandling,
  transferSOLWithSimulation,
  transferSOLWithRetry,
  transferSOLWithDifferentAmounts,
} = nativeTransferExamples;

export const {
  swapTokenToToken,
  swapSOLToToken,
  swapTokenToSOL,
  swapWithDualSigner,
  swapWithWallet,
  swapWithWalletAndAdmin,
  universalSwapExample,
  batchTokenSwaps,
  swapTokensWithErrorHandling,
  swapTokensWithSimulation,
} = swapExamples;

export const {
  createPoolSingleSigner,
  createPoolDualSigner,
  createPoolWithWallet,
  createPoolWithWalletAndAdmin,
  universalPoolCreationExample,
  batchPoolCreations,
  createPoolWithErrorHandling,
  createPoolWithSimulation,
  createPoolWithRetry,
  createPoolWithDifferentTokenPairs,
} = poolCreationExamples;

export const {
  addLiquiditySingleSigner,
  addLiquidityDualSigner,
  addLiquidityWithWallet,
  addLiquidityWithWalletAndAdmin,
  universalAddLiquidityExample,
  batchAddLiquidity,
  addLiquidityWithErrorHandling,
  addLiquidityWithSimulation,
  addLiquidityWithRetry,
  addLiquidityWithDifferentAmounts,
} = addLiquidityExamples;


// createPoolSingleSigner();
// swapTokenToToken();
addLiquiditySingleSigner();