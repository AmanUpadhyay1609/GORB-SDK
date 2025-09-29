/**
 * Swap Examples
 * This file contains all examples related to token swap functionality
 */

import {
  createGorbchainSDK,
  Keypair,
  PublicKey,
  SwapParams,
} from "../../core";

// Example 1: Token to Token swap
export async function swapTokenToToken() {
  const sdk = createGorbchainSDK();
  
  const swapParams: SwapParams = {
    fromToken: {
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
      symbol: "USDC",
      decimals: 6,
      name: "USD Coin"
    },
    toToken: {
      address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // USDT
      symbol: "USDT",
      decimals: 6,
      name: "Tether USD"
    },
    fromTokenAmount: 100, // 100 USDC
    fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
  };

  try {
    // Step 1: Build transaction
    const result = await sdk.createSwapTransaction(swapParams);
    console.log("✅ Swap transaction created");
    console.log("📝 Swap details:", {
      fromToken: result.fromToken.address,
      toToken: result.toToken.address,
      amountIn: result.fromTokenAmountLamports.toString(),
      poolPDA: result.poolPDA.toBase58(),
    });

    // Step 2: Sign transaction (adds fresh blockhash)
    const senderKeypair = Keypair.generate(); // Replace with your actual keypair
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
    console.log("✅ Swap transaction signed");
    console.log("📝 Transaction after signing:");
    console.log("  - recentBlockhash:", signedTx.recentBlockhash);
    console.log("  - lastValidBlockHeight:", signedTx.lastValidBlockHeight);
    console.log("  - signatures count:", signedTx.signatures.length);

    // Step 3: Submit transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("✅ Swap completed successfully:", submitResult.signature);
    } else {
      console.error("❌ Swap failed:", submitResult.error);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 2: SOL to Token swap
export async function swapSOLToToken() {
  const sdk = createGorbchainSDK();
  
  const swapParams: SwapParams = {
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
    fromTokenAmount: 1.0, // 1 SOL
    fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
  };

  try {
    const result = await sdk.createSwapTransaction(swapParams);
    console.log("✅ SOL to Token swap transaction created");
    console.log("📝 Swap details:", {
      fromToken: result.fromToken.address,
      toToken: result.toToken.address,
      amountIn: result.fromTokenAmountLamports.toString(),
      isNativeSOLSwap: result.isNativeSOLSwap,
    });

    const senderKeypair = Keypair.generate(); // Replace with your actual keypair
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
    const submitResult = await sdk.submitTransaction(signedTx);

    if (submitResult.success) {
      console.log("✅ SOL to Token swap completed:", submitResult.signature);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 3: Token to SOL swap
export async function swapTokenToSOL() {
  const sdk = createGorbchainSDK();
  
  const swapParams: SwapParams = {
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
    fromTokenAmount: 100, // 100 USDC
    fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
  };

  try {
    const result = await sdk.createSwapTransaction(swapParams);
    console.log("✅ Token to SOL swap transaction created");
    console.log("📝 Swap details:", {
      fromToken: result.fromToken.address,
      toToken: result.toToken.address,
      amountIn: result.fromTokenAmountLamports.toString(),
      isNativeSOLSwap: result.isNativeSOLSwap,
    });

    const senderKeypair = Keypair.generate(); // Replace with your actual keypair
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
    const submitResult = await sdk.submitTransaction(signedTx);

    if (submitResult.success) {
      console.log("✅ Token to SOL swap completed:", submitResult.signature);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 4: Swap with dual signer (admin pays fees)
export async function swapWithDualSigner() {
  const sdk = createGorbchainSDK();
  
  const swapParams: SwapParams = {
    fromToken: {
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
      symbol: "USDC",
      decimals: 6,
      name: "USD Coin"
    },
    toToken: {
      address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // USDT
      symbol: "USDT",
      decimals: 6,
      name: "Tether USD"
    },
    fromTokenAmount: 50, // 50 USDC
    fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
    feePayerPublicKey: new PublicKey("AdminPublicKey"), // Admin pays fees
  };

  try {
    const result = await sdk.createSwapTransaction(swapParams);
    console.log("✅ Swap transaction created");

    const senderKeypair = Keypair.generate(); // Replace with your actual keypair
    const adminKeypair = Keypair.generate(); // Replace with your actual admin keypair
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair, adminKeypair);
    console.log("✅ Swap transaction signed with dual signers");

    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("✅ Swap completed successfully:", submitResult.signature);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 5: Swap with wallet adapter
export async function swapWithWallet(wallet: any) {
  const sdk = createGorbchainSDK();
  
  const swapParams: SwapParams = {
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
    fromTokenAmount: 2.0, // 2 SOL
    fromPublicKey: wallet.publicKey,
  };

  try {
    const result = await sdk.createSwapTransaction(swapParams);
    console.log("✅ Swap transaction created");

    const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet);
    console.log("✅ Swap transaction signed with wallet");

    // Simulate before submitting
    const simulation = await sdk.simulateTransaction(signedTx);
    if (!simulation.success) {
      throw new Error(`Simulation failed: ${simulation.error}`);
    }

    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("✅ Swap completed successfully:", submitResult.signature);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 6: Swap with wallet and admin fee payer
export async function swapWithWalletAndAdmin(wallet: any) {
  const sdk = createGorbchainSDK();
  
  const swapParams: SwapParams = {
    fromToken: {
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
      symbol: "USDC",
      decimals: 6,
      name: "USD Coin"
    },
    toToken: {
      address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // USDT
      symbol: "USDT",
      decimals: 6,
      name: "Tether USD"
    },
    fromTokenAmount: 75, // 75 USDC
    fromPublicKey: wallet.publicKey,
    feePayerPublicKey: new PublicKey("AdminPublicKey"), // Admin pays fees
  };

  try {
    const result = await sdk.createSwapTransaction(swapParams);
    console.log("✅ Swap transaction created");

    const adminKeypair = Keypair.generate(); // Replace with your actual admin keypair
    const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet, adminKeypair);
    console.log("✅ Swap transaction signed with wallet and admin");

    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("✅ Swap completed successfully:", submitResult.signature);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 7: Universal swap example
export async function universalSwapExample() {
  const sdk = createGorbchainSDK();

  // SOL to Token swap
  const swapParams: SwapParams = {
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
    fromTokenAmount: 1.5, // 1.5 SOL
    fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
  };

  console.log("🔄 Building swap transaction...");
  const result = await sdk.createSwapTransaction(swapParams);
  console.log("✅ Swap transaction built:", result.isNativeSOLSwap ? "Native SOL" : "Regular");

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

// Example 8: Batch token swaps
export async function batchTokenSwaps() {
  const sdk = createGorbchainSDK();
  
  const swaps = [
    {
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
      fromTokenAmount: 1.0,
    },
    {
      fromToken: {
        address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
        symbol: "USDC",
        decimals: 6,
        name: "USD Coin"
      },
      toToken: {
        address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // USDT
        symbol: "USDT",
        decimals: 6,
        name: "Tether USD"
      },
      fromTokenAmount: 50,
    },
  ];

  const results = [];
  for (const swap of swaps) {
    const swapParams: SwapParams = {
      ...swap,
      fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
    };

    try {
      const result = await sdk.createSwapTransaction(swapParams);
      const senderKeypair = Keypair.generate(); // Replace with your actual keypair
      const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
      const submitResult = await sdk.submitTransaction(signedTx);
      results.push(submitResult);
    } catch (error: any) {
      console.error("Swap failed:", error.message);
      results.push({ success: false, error: error.message });
    }
  }

  console.log(`✅ Completed ${results.filter(r => r.success).length} swaps out of ${swaps.length}`);
}

// Example 9: Swap with error handling
export async function swapTokensWithErrorHandling() {
  const sdk = createGorbchainSDK();

  try {
    // Test with invalid amount
    const invalidAmountParams: SwapParams = {
      fromToken: {
        address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        symbol: "USDC",
        decimals: 6,
        name: "USD Coin"
      },
      toToken: {
        address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
        symbol: "USDT",
        decimals: 6,
        name: "Tether USD"
      },
      fromTokenAmount: -10, // Invalid negative amount
      fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
    };

    await sdk.createSwapTransaction(invalidAmountParams);
  } catch (error: any) {
    console.error("Expected error for invalid amount:", error.message);
  }

  try {
    // Test with invalid token address
    const invalidTokenParams: SwapParams = {
      fromToken: {
        address: "InvalidTokenAddress", // Invalid address
        symbol: "INV",
        decimals: 6,
        name: "Invalid Token"
      },
      toToken: {
        address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
        symbol: "USDT",
        decimals: 6,
        name: "Tether USD"
      },
      fromTokenAmount: 100,
      fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
    };

    await sdk.createSwapTransaction(invalidTokenParams);
  } catch (error: any) {
    console.error("Expected error for invalid token address:", error.message);
  }

  console.log("✅ Error handling tests completed!");
}

// Example 10: Swap with simulation
export async function swapTokensWithSimulation() {
  const sdk = createGorbchainSDK();
  
  const swapParams: SwapParams = {
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
    fromTokenAmount: 1.0, // 1 SOL
    fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
  };

  try {
    const result = await sdk.createSwapTransaction(swapParams);
    const senderKeypair = Keypair.generate(); // Replace with your actual keypair
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);

    // Simulate before submitting
    const simulation = await sdk.simulateTransaction(signedTx);
    if (!simulation.success) {
      throw new Error(`Simulation failed: ${simulation.error}`);
    }

    console.log("✅ Simulation successful, proceeding with submission");

    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("✅ Swap completed after successful simulation:", submitResult.signature);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Export all examples for easy access
export const swapExamples = {
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
};
