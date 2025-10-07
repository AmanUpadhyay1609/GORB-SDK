/**
 * Add Liquidity Examples
 * This file contains all examples related to add liquidity functionality
 */

import bs58 from 'bs58';

import {
  createGorbchainSDK,
  Keypair,
  PublicKey,
  AddLiquidityParams,
  Pool,
} from "../../core";

// Example 1: Add liquidity with single signer (sender pays fees)
export async function addLiquiditySingleSigner() {
  const sdk = createGorbchainSDK();
  
  const pool: Pool = {
    address: "8K4M2qdXMnCb3LtTEc5G9uhhNdYvXmZH679KUtUxpuLg", // Replace with actual pool address
    tokenA: {
      address: "So11111111111111111111111111111111111111112", // SOL
      symbol: "GORB",
      decimals: 9,
      name: "Gorb"
    },
    tokenB: {
      address: "HYeycCbBNXHbvgCjSUnveLqCQvrgxAjSZHGipRbaD7Dp", // USDC
      symbol: "RMI",
      decimals: 9,
      name: "Redmi Note 7 Pro"
    }
  };

  const addLiquidityParams: AddLiquidityParams = {
    pool,
    amountA: 0.01, // 1 SOL
    amountB: 12454, // 100 USDC
    fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
    // feePayerPublicKey not provided - sender pays fees
  };

  try {
    // Step 1: Build transaction
    const result = await sdk.createAddLiquidityTransaction(addLiquidityParams);
    console.log("✅ Add liquidity transaction created");
    console.log("📝 Add liquidity details:", {
      poolPDA: result.poolPDA.toBase58(),
      tokenA: result.tokenA.toBase58(),
      tokenB: result.tokenB.toBase58(),
      lpMint: result.lpMintPDA.toBase58(),
      isNativeSOLPool: result.isNativeSOLPool,
      userTokenA: result.userTokenA.toBase58(),
      userTokenB: result.userTokenB.toBase58(),
      userLP: result.userLP.toBase58(),
    });

        // Step 2: Sign transaction (adds fresh blockhash)
        const privateKeyBuf = bs58.decode(
          "your private key"
        );
        const senderKeypair = Keypair.fromSecretKey(Uint8Array.from(privateKeyBuf)) // Replace with your actual keypair
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
    console.log("✅ Add liquidity transaction signed");
    console.log("📝 Transaction after signing:");
    console.log("  - recentBlockhash:", signedTx.recentBlockhash);
    console.log("  - lastValidBlockHeight:", signedTx.lastValidBlockHeight);
    console.log("  - signatures count:", signedTx.signatures.length);

    // Step 3: Submit transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("✅ Liquidity added successfully:", submitResult.signature);
    } else {
      console.error("❌ Add liquidity failed:", submitResult.error);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 2: Add liquidity with dual signer (admin pays fees)
export async function addLiquidityDualSigner() {
  const sdk = createGorbchainSDK();
  
  const pool: Pool = {
    address: "PoolAddressHere", // Replace with actual pool address
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
    }
  };

  const addLiquidityParams: AddLiquidityParams = {
    pool,
    amountA: 50, // 50 USDC
    amountB: 50, // 50 USDT
    fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
    feePayerPublicKey: new PublicKey("AdminPublicKey"), // Admin pays fees
  };

  try {
    // Step 1: Build transaction
    const result = await sdk.createAddLiquidityTransaction(addLiquidityParams);
    console.log("✅ Add liquidity transaction created");

    // Step 2: Sign transaction with dual signers
    const senderKeypair = Keypair.generate(); // Replace with your actual keypair
    const adminKeypair = Keypair.generate(); // Replace with your actual admin keypair
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair, adminKeypair);
    console.log("✅ Add liquidity transaction signed with dual signers");

    // Step 3: Submit transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("✅ Liquidity added successfully:", submitResult.signature);
    } else {
      console.error("❌ Add liquidity failed:", submitResult.error);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 3: Add liquidity with wallet adapter
export async function addLiquidityWithWallet(wallet: any) {
  const sdk = createGorbchainSDK();
  
  const pool: Pool = {
    address: "PoolAddressHere", // Replace with actual pool address
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
    }
  };

  const addLiquidityParams: AddLiquidityParams = {
    pool,
    amountA: 2.0, // 2 SOL
    amountB: 200, // 200 USDC
    fromPublicKey: wallet.publicKey,
  };

  try {
    // Step 1: Build transaction
    const result = await sdk.createAddLiquidityTransaction(addLiquidityParams);
    console.log("✅ Add liquidity transaction created");

    // Step 2: Sign transaction with wallet
    const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet);
    console.log("✅ Add liquidity transaction signed with wallet");

    // Step 3: Simulate before submitting
    const simulation = await sdk.simulateTransaction(signedTx);
    if (!simulation.success) {
      throw new Error(`Simulation failed: ${simulation.error}`);
    }

    // Step 4: Submit transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("✅ Liquidity added successfully:", submitResult.signature);
    } else {
      console.error("❌ Add liquidity failed:", submitResult.error);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 4: Add liquidity with wallet and admin fee payer
export async function addLiquidityWithWalletAndAdmin(wallet: any) {
  const sdk = createGorbchainSDK();
  
  const pool: Pool = {
    address: "PoolAddressHere", // Replace with actual pool address
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
    }
  };

  const addLiquidityParams: AddLiquidityParams = {
    pool,
    amountA: 75, // 75 USDC
    amountB: 75, // 75 USDT
    fromPublicKey: wallet.publicKey,
    feePayerPublicKey: new PublicKey("AdminPublicKey"), // Admin pays fees
  };

  try {
    // Step 1: Build transaction
    const result = await sdk.createAddLiquidityTransaction(addLiquidityParams);
    console.log("✅ Add liquidity transaction created");

    // Step 2: Sign transaction with wallet and admin
    const adminKeypair = Keypair.generate(); // Replace with your actual admin keypair
    const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet, adminKeypair);
    console.log("✅ Add liquidity transaction signed with wallet and admin");

    // Step 3: Submit transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("✅ Liquidity added successfully:", submitResult.signature);
    } else {
      console.error("❌ Add liquidity failed:", submitResult.error);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 5: Universal add liquidity example
export async function universalAddLiquidityExample() {
  const sdk = createGorbchainSDK();

  // SOL to Token pool
  const pool: Pool = {
    address: "PoolAddressHere", // Replace with actual pool address
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
    }
  };

  const addLiquidityParams: AddLiquidityParams = {
    pool,
    amountA: 1.5, // 1.5 SOL
    amountB: 150, // 150 USDC
    fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
  };

  console.log("🔄 Building add liquidity transaction...");
  const result = await sdk.createAddLiquidityTransaction(addLiquidityParams);
  console.log("✅ Add liquidity transaction built:", result.isNativeSOLPool ? "Native SOL" : "Regular");

  // Example of signing the add liquidity transaction
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

  console.log("🎉 Universal add liquidity examples completed!");
}

// Example 6: Batch add liquidity
export async function batchAddLiquidity() {
  const sdk = createGorbchainSDK();
  
  const pools = [
    {
      pool: {
        address: "PoolAddress1", // Replace with actual pool address
        tokenA: { address: "So11111111111111111111111111111111111111112", symbol: "SOL", decimals: 9, name: "Solana" },
        tokenB: { address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", symbol: "USDC", decimals: 6, name: "USD Coin" },
      },
      amountA: 1.0,
      amountB: 100,
    },
    {
      pool: {
        address: "PoolAddress2", // Replace with actual pool address
        tokenA: { address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", symbol: "USDC", decimals: 6, name: "USD Coin" },
        tokenB: { address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", symbol: "USDT", decimals: 6, name: "Tether USD" },
      },
      amountA: 50,
      amountB: 50,
    },
  ];

  const results = [];
  for (const { pool, amountA, amountB } of pools) {
    const addLiquidityParams: AddLiquidityParams = {
      pool,
      amountA,
      amountB,
      fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
    };

    try {
      const result = await sdk.createAddLiquidityTransaction(addLiquidityParams);
      const senderKeypair = Keypair.generate(); // Replace with your actual keypair
      const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
      const submitResult = await sdk.submitTransaction(signedTx);
      results.push(submitResult);
    } catch (error: any) {
      console.error("Add liquidity failed:", error.message);
      results.push({ success: false, error: error.message });
    }
  }

  console.log(`✅ Added liquidity to ${results.filter(r => r.success).length} pools out of ${pools.length}`);
}

// Example 7: Add liquidity with error handling
export async function addLiquidityWithErrorHandling() {
  const sdk = createGorbchainSDK();

  try {
    // Test with invalid amounts
    const invalidPool: Pool = {
      address: "PoolAddressHere", // Replace with actual pool address
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
      }
    };

    const invalidAddLiquidityParams: AddLiquidityParams = {
      pool: invalidPool,
      amountA: -10, // Invalid negative amount
      amountB: 100,
      fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
    };

    await sdk.createAddLiquidityTransaction(invalidAddLiquidityParams);
  } catch (error: any) {
    console.error("Expected error for invalid amounts:", error.message);
  }

  try {
    // Test with invalid pool address
    const invalidPool: Pool = {
      address: "", // Invalid empty address
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
      }
    };

    const invalidAddLiquidityParams: AddLiquidityParams = {
      pool: invalidPool,
      amountA: 1.0,
      amountB: 100,
      fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
    };

    await sdk.createAddLiquidityTransaction(invalidAddLiquidityParams);
  } catch (error: any) {
    console.error("Expected error for invalid pool address:", error.message);
  }

  console.log("✅ Error handling tests completed!");
}

// Example 8: Add liquidity with simulation
export async function addLiquidityWithSimulation() {
  const sdk = createGorbchainSDK();
  
  const pool: Pool = {
    address: "PoolAddressHere", // Replace with actual pool address
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
    }
  };

  const addLiquidityParams: AddLiquidityParams = {
    pool,
    amountA: 1.0, // 1 SOL
    amountB: 100, // 100 USDC
    fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
  };

  try {
    const result = await sdk.createAddLiquidityTransaction(addLiquidityParams);
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
      console.log("✅ Liquidity added after successful simulation:", submitResult.signature);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 9: Add liquidity with retry logic
export async function addLiquidityWithRetry() {
  const sdk = createGorbchainSDK();
  
  const pool: Pool = {
    address: "PoolAddressHere", // Replace with actual pool address
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
    }
  };

  const addLiquidityParams: AddLiquidityParams = {
    pool,
    amountA: 1.0, // 1 SOL
    amountB: 100, // 100 USDC
    fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
  };

  const maxRetries = 3;
  let attempt = 1;

  while (attempt <= maxRetries) {
    try {
      const result = await sdk.createAddLiquidityTransaction(addLiquidityParams);
      const senderKeypair = Keypair.generate(); // Replace with your actual keypair
      const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
      const submitResult = await sdk.submitTransaction(signedTx);

      if (submitResult.success) {
        console.log(`✅ Liquidity added successfully on attempt ${attempt}:`, submitResult.signature);
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

// Example 10: Add liquidity with different amounts
export async function addLiquidityWithDifferentAmounts() {
  const sdk = createGorbchainSDK();
  
  const pool: Pool = {
    address: "PoolAddressHere", // Replace with actual pool address
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
    }
  };

  const amounts = [
    { amountA: 0.1, amountB: 10 },
    { amountA: 0.5, amountB: 50 },
    { amountA: 1.0, amountB: 100 },
    { amountA: 2.0, amountB: 200 },
    { amountA: 5.0, amountB: 500 },
  ];

  for (const { amountA, amountB } of amounts) {
    try {
      const addLiquidityParams: AddLiquidityParams = {
        pool,
        amountA,
        amountB,
        fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
      };

      const result = await sdk.createAddLiquidityTransaction(addLiquidityParams);
      const senderKeypair = Keypair.generate(); // Replace with your actual keypair
      const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
      const submitResult = await sdk.submitTransaction(signedTx);

      if (submitResult.success) {
        console.log(`✅ Added ${amountA} SOL and ${amountB} USDC successfully:`, submitResult.signature);
      }
    } catch (error: any) {
      console.error(`❌ Failed to add ${amountA} SOL and ${amountB} USDC:`, error.message);
    }
  }
}

// Export all examples for easy access
export const addLiquidityExamples = {
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
};
