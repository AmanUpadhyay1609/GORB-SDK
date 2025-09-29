/**
 * Token Creation Examples
 * This file contains all examples related to token creation functionality
 */

import {
  createGorbchainSDK,
  Keypair,
} from "../../core";

// Example 1: Using Gorbchain SDK
export async function createTokenOnGorbchain() {
  // Create SDK instance for Gorbchain
  const sdk = createGorbchainSDK();

  // Create a keypair for the token mint authority
  const mintKeypair = Keypair.generate();

  // Token creation parameters
  const tokenParams = {
    name: "My Test Token",
    symbol: "MTT",
    uri: "https://example.com/metadata.json",
    decimals: 9,
    supply: 1000000, // 1 million tokens
    mintKeypair: mintKeypair,
    updateAuthority: mintKeypair.publicKey,
  };

  try {
    // Step 1: Create token transaction
    const result = await sdk.createTokenTransaction(tokenParams, mintKeypair.publicKey);
    console.log("✅ Token transaction created");
    console.log("📝 Token transaction created successfully");

    // Step 2: Sign transaction
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, mintKeypair);
    console.log("✅ Token transaction signed");

    // Step 3: Submit transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("🎉 Token created successfully:", submitResult.signature);
    } else {
      console.error("❌ Token creation failed:", submitResult.error);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 2: Using Solana SDK with custom config
export async function createTokenOnSolana() {
  // Create SDK instance for Solana
  const sdk = createGorbchainSDK();

  const mintKeypair = Keypair.generate();

  const tokenParams = {
    name: "Solana Test Token",
    symbol: "STT",
    uri: "https://example.com/solana-metadata.json",
    decimals: 6,
    supply: 1000000, // 1 million tokens
    mintKeypair: mintKeypair,
    updateAuthority: mintKeypair.publicKey,
  };

  try {
    const result = await sdk.createTokenTransaction(tokenParams, mintKeypair.publicKey);
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, mintKeypair);
    const submitResult = await sdk.submitTransaction(signedTx);

    if (submitResult.success) {
      console.log("✅ Solana token created:", submitResult.signature);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 3: Token creation with wallet adapter
export async function createTokenWithWallet(wallet: any) {
  const sdk = createGorbchainSDK();
  const mintKeypair = Keypair.generate();

  const tokenParams = {
    name: "Wallet Token",
    symbol: "WLT",
    uri: "https://example.com/wallet-metadata.json",
    decimals: 9,
    supply: 1000000, // 1 million tokens
    mintKeypair: mintKeypair,
    updateAuthority: wallet.publicKey,
  };

  try {
    const result = await sdk.createTokenTransaction(tokenParams, mintKeypair.publicKey);
    const signedTx = await sdk.signWithWalletAndKeypair(result.transaction, wallet, mintKeypair);
    const submitResult = await sdk.submitTransaction(signedTx);

    if (submitResult.success) {
      console.log("✅ Token created with wallet:", submitResult.signature);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 4: Token creation with dual signers
export async function createTokenWithDualSigners() {
  const sdk = createGorbchainSDK();
  const mintKeypair = Keypair.generate();
  const feePayerKeypair = Keypair.generate();

  const tokenParams = {
    name: "Dual Signer Token",
    symbol: "DST",
    uri: "https://example.com/dual-metadata.json",
    decimals: 9,
    supply: 1000000, // 1 million tokens
    mintKeypair: mintKeypair,
    updateAuthority: mintKeypair.publicKey,
  };

  try {
    const result = await sdk.createTokenTransaction(tokenParams, mintKeypair.publicKey);
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, mintKeypair, feePayerKeypair);
    const submitResult = await sdk.submitTransaction(signedTx);

    if (submitResult.success) {
      console.log("✅ Token created with dual signers:", submitResult.signature);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 5: Batch token creation
export async function batchTokenCreation() {
  const sdk = createGorbchainSDK();

  const tokens = [
    {
      name: "Batch Token 1",
      symbol: "BT1",
      uri: "https://example.com/batch1.json",
      decimals: 9,
      supply: 1000000,
    },
    {
      name: "Batch Token 2",
      symbol: "BT2",
      uri: "https://example.com/batch2.json",
      decimals: 6,
      supply: 1000000,
    },
    {
      name: "Batch Token 3",
      symbol: "BT3",
      uri: "https://example.com/batch3.json",
      decimals: 9,
      supply: 1000000,
    },
  ];

  const results = [];
  for (const token of tokens) {
    const mintKeypair = Keypair.generate();
    const tokenParams = {
      ...token,
      mintKeypair: mintKeypair,
      updateAuthority: mintKeypair.publicKey,
    };

    try {
      const result = await sdk.createTokenTransaction(tokenParams, mintKeypair.publicKey);
      const signedTx = await sdk.signWithDualKeypairs(result.transaction, mintKeypair);
      const submitResult = await sdk.submitTransaction(signedTx);
      results.push(submitResult);
    } catch (error: any) {
      console.error(`Token ${token.symbol} creation failed:`, error.message);
      results.push({ success: false, error: error.message });
    }
  }

  console.log(`✅ Created ${results.filter(r => r.success).length} tokens out of ${tokens.length}`);
}

// Example 6: Token creation with error handling
export async function createTokenWithErrorHandling() {
  const sdk = createGorbchainSDK();

  try {
    // Test with invalid parameters
    const invalidParams = {
      name: "", // Invalid empty name
      symbol: "INV",
      uri: "https://example.com/invalid.json",
      decimals: 9,
      supply: 1000000,
      mintKeypair: Keypair.generate(),
      updateAuthority: Keypair.generate().publicKey,
    };

    await sdk.createTokenTransaction(invalidParams, Keypair.generate().publicKey);
  } catch (error: any) {
    console.error("Expected error for invalid name:", error.message);
  }

  try {
    // Test with invalid decimals
    const invalidDecimalsParams = {
      name: "Invalid Decimals Token",
      symbol: "IDT",
      uri: "https://example.com/invalid-decimals.json",
      decimals: -1, // Invalid negative decimals
      supply: 1000000,
      mintKeypair: Keypair.generate(),
      updateAuthority: Keypair.generate().publicKey,
    };

    await sdk.createTokenTransaction(invalidDecimalsParams, Keypair.generate().publicKey);
  } catch (error: any) {
    console.error("Expected error for invalid decimals:", error.message);
  }

  console.log("✅ Error handling tests completed!");
}

// Example 7: Token creation with custom update authority
export async function createTokenWithCustomUpdateAuthority() {
  const sdk = createGorbchainSDK();
  const mintKeypair = Keypair.generate();
  const updateAuthorityKeypair = Keypair.generate(); // Different from mint authority

  const tokenParams = {
    name: "Custom Authority Token",
    symbol: "CAT",
    uri: "https://example.com/custom-authority.json",
    decimals: 9,
    supply: 1000000, // 1 million tokens
    mintKeypair: mintKeypair,
    updateAuthority: updateAuthorityKeypair.publicKey, // Custom update authority
  };

  try {
    const result = await sdk.createTokenTransaction(tokenParams, mintKeypair.publicKey);
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, mintKeypair);
    const submitResult = await sdk.submitTransaction(signedTx);

    if (submitResult.success) {
      console.log("✅ Token created with custom update authority:", submitResult.signature);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 8: Token creation with simulation
export async function createTokenWithSimulation() {
  const sdk = createGorbchainSDK();
  const mintKeypair = Keypair.generate();

  const tokenParams = {
    name: "Simulated Token",
    symbol: "SIM",
    uri: "https://example.com/simulated.json",
    decimals: 9,
    supply: 1000000, // 1 million tokens
    mintKeypair: mintKeypair,
    updateAuthority: mintKeypair.publicKey,
  };

  try {
    const result = await sdk.createTokenTransaction(tokenParams, mintKeypair.publicKey);
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, mintKeypair);

    // Simulate before submitting
    const simulation = await sdk.simulateTransaction(signedTx);
    if (!simulation.success) {
      throw new Error(`Simulation failed: ${simulation.error}`);
    }

    console.log("✅ Simulation successful, proceeding with submission");

    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("✅ Token created after successful simulation:", submitResult.signature);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Export all examples for easy access
export const tokenCreationExamples = {
  createTokenOnGorbchain,
  createTokenOnSolana,
  createTokenWithWallet,
  createTokenWithDualSigners,
  batchTokenCreation,
  createTokenWithErrorHandling,
  createTokenWithCustomUpdateAuthority,
  createTokenWithSimulation,
};
