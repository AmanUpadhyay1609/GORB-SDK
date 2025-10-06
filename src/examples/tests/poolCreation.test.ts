/**
 * Pool Creation Examples
 * This file contains all examples related to pool creation functionality
 */

import bs58 from 'bs58';

import {
  createGorbchainSDK,
  Keypair,
  PublicKey,
  CreatePoolParams,
} from "../../core";

// Example 1: Create pool with single signer (sender pays fees)
export async function createPoolSingleSigner() {
  const sdk = createGorbchainSDK();
  
  const poolParams: CreatePoolParams = {
    tokenA: {
      address: "So11111111111111111111111111111111111111112", // Native Gorb
      symbol: "GORB",
      decimals: 9,
      name: "Gorb"
    },
    tokenB: {
      address: "2NMb58LNoGBrM5zgRCywzXRroAyya9TWU3tZCS4kQGeH", // USDC
      symbol: "RMI",
      decimals: 9,
      name: "Redmi Note 7 Pro"
    },
    amountA: 0.1, // 1 SOL
    amountB: 100, // 100 USDC
    fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
    // feePayerPublicKey not provided - sender pays fees
  };

  try {
    // Step 1: Build transaction
    const result = await sdk.createPoolTransaction(poolParams);
    console.log("✅ Pool transaction created");
    console.log("📝 Pool details:", {
      poolPDA: result.poolPDA.toBase58(),
      tokenA: result.tokenA.toBase58(),
      tokenB: result.tokenB.toBase58(),
      lpMintPDA: result.lpMintPDA.toBase58(),
      isNativeSOLPool: result.isNativeSOLPool,
      amountALamports: result.amountALamports.toString(),
      amountBLamports: result.amountBLamports.toString(),
    });

    // Step 2: Sign transaction (adds fresh blockhash)
    const privateKeyBuf = bs58.decode(
      "your private key"
    );
    const senderKeypair = Keypair.fromSecretKey(Uint8Array.from(privateKeyBuf)); // Replace with your actual keypair
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
    console.log("✅ Pool transaction signed");
    console.log("📝 Transaction after signing:");
    console.log("  - recentBlockhash:", signedTx.recentBlockhash);
    console.log("  - lastValidBlockHeight:", signedTx.lastValidBlockHeight);
    console.log("  - signatures count:", signedTx.signatures.length);

    // Step 3: Submit transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    console.log(" Pool creation result:", submitResult);
    if (submitResult.success) {
      console.log("✅ Pool created successfully:", submitResult.signature);
    } else {
      console.error("❌ Pool creation failed:", submitResult.error);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 2: Create pool with dual signer (admin pays fees)
export async function createPoolDualSigner() {
  const sdk = createGorbchainSDK();
  
  const poolParams: CreatePoolParams = {
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
    },
    amountA: 1000, // 1000 USDC
    amountB: 1000, // 1000 USDT
    fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
    feePayerPublicKey: new PublicKey("AdminPublicKey"), // Admin pays fees
  };

  try {
    // Step 1: Build transaction
    const result = await sdk.createPoolTransaction(poolParams);
    console.log("✅ Pool transaction created");

    // Step 2: Sign transaction with dual signers
    const senderKeypair = Keypair.generate(); // Replace with your actual keypair
    const adminKeypair = Keypair.generate(); // Replace with your actual admin keypair
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair, adminKeypair);
    console.log("✅ Pool transaction signed with dual signers");

    // Step 3: Submit transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("✅ Pool created successfully:", submitResult.signature);
    } else {
      console.error("❌ Pool creation failed:", submitResult.error);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 3: Create pool with wallet adapter
export async function createPoolWithWallet(wallet: any) {
  const sdk = createGorbchainSDK();
  
  const poolParams: CreatePoolParams = {
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
    amountA: 2.0, // 2 SOL
    amountB: 200, // 200 USDC
    fromPublicKey: wallet.publicKey,
  };

  try {
    // Step 1: Build transaction
    const result = await sdk.createPoolTransaction(poolParams);
    console.log("✅ Pool transaction created");

    // Step 2: Sign transaction with wallet
    const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet);
    console.log("✅ Pool transaction signed with wallet");

    // Step 3: Simulate before submitting
    const simulation = await sdk.simulateTransaction(signedTx);
    if (!simulation.success) {
      throw new Error(`Simulation failed: ${simulation.error}`);
    }

    // Step 4: Submit transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("✅ Pool created successfully:", submitResult.signature);
    } else {
      console.error("❌ Pool creation failed:", submitResult.error);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 4: Create pool with wallet and admin fee payer
export async function createPoolWithWalletAndAdmin(wallet: any) {
  const sdk = createGorbchainSDK();
  
  const poolParams: CreatePoolParams = {
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
    },
    amountA: 500, // 500 USDC
    amountB: 500, // 500 USDT
    fromPublicKey: wallet.publicKey,
    feePayerPublicKey: new PublicKey("AdminPublicKey"), // Admin pays fees
  };

  try {
    // Step 1: Build transaction
    const result = await sdk.createPoolTransaction(poolParams);
    console.log("✅ Pool transaction created");

    // Step 2: Sign transaction with wallet and admin
    const adminKeypair = Keypair.generate(); // Replace with your actual admin keypair
    const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet, adminKeypair);
    console.log("✅ Pool transaction signed with wallet and admin");

    // Step 3: Submit transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("✅ Pool created successfully:", submitResult.signature);
    } else {
      console.error("❌ Pool creation failed:", submitResult.error);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 5: Universal pool creation example
export async function universalPoolCreationExample() {
  const sdk = createGorbchainSDK();

  // SOL to Token pool
  const poolParams: CreatePoolParams = {
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
    amountA: 1.5, // 1.5 SOL
    amountB: 150, // 150 USDC
    fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
  };

  console.log("🔄 Building pool creation transaction...");
  const result = await sdk.createPoolTransaction(poolParams);
  console.log("✅ Pool creation transaction built:", result.isNativeSOLPool ? "Native SOL" : "Regular");

  // Example of signing the pool creation transaction
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

  console.log("🎉 Universal pool creation examples completed!");
}

// Example 6: Batch pool creations
export async function batchPoolCreations() {
  const sdk = createGorbchainSDK();
  
  const pools = [
    {
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
      amountA: 1.0,
      amountB: 100,
    },
    {
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
      },
      amountA: 50,
      amountB: 50,
    },
  ];

  const results = [];
  for (const pool of pools) {
    const poolParams: CreatePoolParams = {
      ...pool,
      fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
    };

    try {
      const result = await sdk.createPoolTransaction(poolParams);
      const senderKeypair = Keypair.generate(); // Replace with your actual keypair
      const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
      const submitResult = await sdk.submitTransaction(signedTx);
      results.push(submitResult);
    } catch (error: any) {
      console.error("Pool creation failed:", error.message);
      results.push({ success: false, error: error.message });
    }
  }

  console.log(`✅ Created ${results.filter(r => r.success).length} pools out of ${pools.length}`);
}

// Example 7: Pool creation with error handling
export async function createPoolWithErrorHandling() {
  const sdk = createGorbchainSDK();

  try {
    // Test with invalid amounts
    const invalidAmountParams: CreatePoolParams = {
      tokenA: {
        address: "So11111111111111111111111111111111111111112",
        symbol: "SOL",
        decimals: 9,
        name: "Solana"
      },
      tokenB: {
        address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        symbol: "USDC",
        decimals: 6,
        name: "USD Coin"
      },
      amountA: -10, // Invalid negative amount
      amountB: 100,
      fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
    };

    await sdk.createPoolTransaction(invalidAmountParams);
  } catch (error: any) {
    console.error("Expected error for invalid amounts:", error.message);
  }

  try {
    // Test with invalid token address
    const invalidTokenParams: CreatePoolParams = {
      tokenA: {
        address: "InvalidTokenAddress", // Invalid address
        symbol: "INV",
        decimals: 9,
        name: "Invalid Token"
      },
      tokenB: {
        address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        symbol: "USDC",
        decimals: 6,
        name: "USD Coin"
      },
      amountA: 1.0,
      amountB: 100,
      fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
    };

    await sdk.createPoolTransaction(invalidTokenParams);
  } catch (error: any) {
    console.error("Expected error for invalid token address:", error.message);
  }

  console.log("✅ Error handling tests completed!");
}

// Example 8: Pool creation with simulation
export async function createPoolWithSimulation() {
  const sdk = createGorbchainSDK();
  
  const poolParams: CreatePoolParams = {
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
    fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
  };

  try {
    const result = await sdk.createPoolTransaction(poolParams);
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
      console.log("✅ Pool created after successful simulation:", submitResult.signature);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 9: Pool creation with retry logic
export async function createPoolWithRetry() {
  const sdk = createGorbchainSDK();
  
  const poolParams: CreatePoolParams = {
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
    fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
  };

  const maxRetries = 3;
  let attempt = 1;

  while (attempt <= maxRetries) {
    try {
      const result = await sdk.createPoolTransaction(poolParams);
      const senderKeypair = Keypair.generate(); // Replace with your actual keypair
      const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
      const submitResult = await sdk.submitTransaction(signedTx);

      if (submitResult.success) {
        console.log(`✅ Pool created successfully on attempt ${attempt}:`, submitResult.signature);
        return;
      } else {
        throw new Error(`Submission failed: ${submitResult.error}`);
      }
    } catch (error: any) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      if (attempt === maxRetries) {
        console.error("❌ All retry attempts failed");
        return;
      }
      attempt++;
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// Example 10: Pool creation with different token pairs
export async function createPoolWithDifferentTokenPairs() {
  const sdk = createGorbchainSDK();
  
  const tokenPairs = [
    {
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
      amountA: 1.0,
      amountB: 100,
    },
    {
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
      },
      amountA: 50,
      amountB: 50,
    },
    {
      tokenA: {
        address: "So11111111111111111111111111111111111111112", // SOL
        symbol: "SOL",
        decimals: 9,
        name: "Solana"
      },
      tokenB: {
        address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // USDT
        symbol: "USDT",
        decimals: 6,
        name: "Tether USD"
      },
      amountA: 2.0,
      amountB: 200,
    },
  ];

  for (const pair of tokenPairs) {
    try {
      const poolParams: CreatePoolParams = {
        ...pair,
        fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
      };

      const result = await sdk.createPoolTransaction(poolParams);
      const senderKeypair = Keypair.generate(); // Replace with your actual keypair
      const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
      const submitResult = await sdk.submitTransaction(signedTx);

      if (submitResult.success) {
        console.log(`✅ Pool created for ${pair.tokenA.symbol}/${pair.tokenB.symbol}:`, submitResult.signature);
      }
    } catch (error: any) {
      console.error(`❌ Failed to create pool for ${pair.tokenA.symbol}/${pair.tokenB.symbol}:`, error.message);
    }
  }
}

// Export all examples for easy access
export const poolCreationExamples = {
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
};
