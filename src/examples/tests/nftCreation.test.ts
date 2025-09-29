/**
 * NFT Creation Examples
 * This file contains all examples related to NFT creation functionality
 */

import {
  createGorbchainSDK,
  Keypair,
} from "../../core";

// Example 1: Basic NFT creation on Gorbchain
export async function createNFTOnGorbchain() {
  const sdk = createGorbchainSDK();
  const mintKeypair = Keypair.generate();

  const nftParams = {
    name: "My Awesome NFT",
    symbol: "MAN",
    description: "A test NFT for demonstration purposes",
    uri: "https://example.com/nft-metadata.json",
    mintKeypair: mintKeypair,
    updateAuthority: mintKeypair.publicKey,
  };

  try {
    // Step 1: Create NFT transaction
    const result = await sdk.createNFTTransaction(nftParams, mintKeypair.publicKey);
    console.log("✅ NFT transaction created");
    console.log("📝 NFT transaction created successfully");

    // Step 2: Sign transaction
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, mintKeypair);
    console.log("✅ NFT transaction signed");

    // Step 3: Submit transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("🎉 NFT created successfully:", submitResult.signature);
    } else {
      console.error("❌ NFT creation failed:", submitResult.error);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 2: NFT creation with wallet adapter
export async function createNFTWithWallet(wallet: any) {
  const sdk = createGorbchainSDK();
  const mintKeypair = Keypair.generate();

  const nftParams = {
    name: "Wallet NFT",
    symbol: "WNF",
    description: "An NFT created using wallet adapter",
    uri: "https://example.com/wallet-nft.json",
    mintKeypair: mintKeypair,
    updateAuthority: wallet.publicKey,
  };

  try {
    const result = await sdk.createNFTTransaction(nftParams, mintKeypair.publicKey);
    const signedTx = await sdk.signWithWalletAndKeypair(result.transaction, wallet, mintKeypair);
    const submitResult = await sdk.submitTransaction(signedTx);

    if (submitResult.success) {
      console.log("✅ NFT created with wallet:", submitResult.signature);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 3: NFT creation with dual signers
export async function createNFTWithDualSigners() {
  const sdk = createGorbchainSDK();
  const mintKeypair = Keypair.generate();
  const feePayerKeypair = Keypair.generate();

  const nftParams = {
    name: "Dual Signer NFT",
    symbol: "DSN",
    description: "An NFT created with dual signers",
    uri: "https://example.com/dual-nft.json",
    mintKeypair: mintKeypair,
    updateAuthority: mintKeypair.publicKey,
  };

  try {
    const result = await sdk.createNFTTransaction(nftParams, mintKeypair.publicKey);
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, mintKeypair, feePayerKeypair);
    const submitResult = await sdk.submitTransaction(signedTx);

    if (submitResult.success) {
      console.log("✅ NFT created with dual signers:", submitResult.signature);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 4: Batch NFT creation
export async function batchNFTCreation() {
  const sdk = createGorbchainSDK();

  const nfts = [
    {
      name: "Collection NFT 1",
      symbol: "CN1",
      description: "First NFT in the collection",
      uri: "https://example.com/collection1.json",
    },
    {
      name: "Collection NFT 2",
      symbol: "CN2",
      description: "Second NFT in the collection",
      uri: "https://example.com/collection2.json",
    },
    {
      name: "Collection NFT 3",
      symbol: "CN3",
      description: "Third NFT in the collection",
      uri: "https://example.com/collection3.json",
    },
  ];

  const results = [];
  for (const nft of nfts) {
    const mintKeypair = Keypair.generate();
    const nftParams = {
      ...nft,
      mintKeypair: mintKeypair,
      updateAuthority: mintKeypair.publicKey,
    };

    try {
      const result = await sdk.createNFTTransaction(nftParams, mintKeypair.publicKey);
      const signedTx = await sdk.signWithDualKeypairs(result.transaction, mintKeypair);
      const submitResult = await sdk.submitTransaction(signedTx);
      results.push(submitResult);
    } catch (error: any) {
      console.error(`NFT ${nft.symbol} creation failed:`, error.message);
      results.push({ success: false, error: error.message });
    }
  }

  console.log(`✅ Created ${results.filter(r => r.success).length} NFTs out of ${nfts.length}`);
}

// Example 5: NFT creation with error handling
export async function createNFTWithErrorHandling() {
  const sdk = createGorbchainSDK();

  try {
    // Test with invalid parameters
    const invalidParams = {
      name: "", // Invalid empty name
      symbol: "INV",
      description: "Invalid NFT",
      uri: "https://example.com/invalid-nft.json",
      mintKeypair: Keypair.generate(),
      updateAuthority: Keypair.generate().publicKey,
    };

    await sdk.createNFTTransaction(invalidParams, Keypair.generate().publicKey);
  } catch (error: any) {
    console.error("Expected error for invalid name:", error.message);
  }

  try {
    // Test with invalid URI
    const invalidUriParams = {
      name: "Invalid URI NFT",
      symbol: "IUN",
      description: "NFT with invalid URI",
      uri: "", // Invalid empty URI
      mintKeypair: Keypair.generate(),
      updateAuthority: Keypair.generate().publicKey,
    };

    await sdk.createNFTTransaction(invalidUriParams, Keypair.generate().publicKey);
  } catch (error: any) {
    console.error("Expected error for invalid URI:", error.message);
  }

  console.log("✅ Error handling tests completed!");
}

// Example 6: NFT creation with custom update authority
export async function createNFTWithCustomUpdateAuthority() {
  const sdk = createGorbchainSDK();
  const mintKeypair = Keypair.generate();
  const updateAuthorityKeypair = Keypair.generate(); // Different from mint authority

  const nftParams = {
    name: "Custom Authority NFT",
    symbol: "CAN",
    description: "An NFT with custom update authority",
    uri: "https://example.com/custom-authority-nft.json",
    mintKeypair: mintKeypair,
    updateAuthority: updateAuthorityKeypair.publicKey, // Custom update authority
  };

  try {
    const result = await sdk.createNFTTransaction(nftParams, mintKeypair.publicKey);
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, mintKeypair);
    const submitResult = await sdk.submitTransaction(signedTx);

    if (submitResult.success) {
      console.log("✅ NFT created with custom update authority:", submitResult.signature);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 7: NFT creation with simulation
export async function createNFTWithSimulation() {
  const sdk = createGorbchainSDK();
  const mintKeypair = Keypair.generate();

  const nftParams = {
    name: "Simulated NFT",
    symbol: "SNF",
    description: "An NFT created with simulation",
    uri: "https://example.com/simulated-nft.json",
    mintKeypair: mintKeypair,
    updateAuthority: mintKeypair.publicKey,
  };

  try {
    const result = await sdk.createNFTTransaction(nftParams, mintKeypair.publicKey);
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, mintKeypair);

    // Simulate before submitting
    const simulation = await sdk.simulateTransaction(signedTx);
    if (!simulation.success) {
      throw new Error(`Simulation failed: ${simulation.error}`);
    }

    console.log("✅ Simulation successful, proceeding with submission");

    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("✅ NFT created after successful simulation:", submitResult.signature);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 8: NFT creation on Solana mainnet
export async function createNFTOnSolanaMainnet() {
  // Use Gorbchain SDK for this example
  const sdk = createGorbchainSDK();
  const mintKeypair = Keypair.generate();

  const nftParams = {
    name: "Solana Mainnet NFT",
    symbol: "SMN",
    description: "An NFT created on Solana mainnet",
    uri: "https://example.com/solana-mainnet-nft.json",
    mintKeypair: mintKeypair,
    updateAuthority: mintKeypair.publicKey,
  };

  try {
    const result = await sdk.createNFTTransaction(nftParams, mintKeypair.publicKey);
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, mintKeypair);
    const submitResult = await sdk.submitTransaction(signedTx);

    if (submitResult.success) {
      console.log("✅ NFT created on Solana mainnet:", submitResult.signature);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 9: NFT creation with detailed metadata
export async function createNFTWithDetailedMetadata() {
  const sdk = createGorbchainSDK();
  const mintKeypair = Keypair.generate();

  const nftParams = {
    name: "Detailed Metadata NFT",
    symbol: "DMN",
    description: "An NFT with detailed metadata",
    uri: "https://example.com/detailed-metadata.json", // This should contain detailed metadata
    mintKeypair: mintKeypair,
    updateAuthority: mintKeypair.publicKey,
  };

  try {
    const result = await sdk.createNFTTransaction(nftParams, mintKeypair.publicKey);
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, mintKeypair);
    const submitResult = await sdk.submitTransaction(signedTx);

    if (submitResult.success) {
      console.log("✅ NFT with detailed metadata created:", submitResult.signature);
      console.log("📝 Metadata URI:", nftParams.uri);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 10: NFT creation with retry logic
export async function createNFTWithRetry() {
  const sdk = createGorbchainSDK();
  const mintKeypair = Keypair.generate();

  const nftParams = {
    name: "Retry NFT",
    symbol: "RNT",
    description: "An NFT created with retry logic",
    uri: "https://example.com/retry-nft.json",
    mintKeypair: mintKeypair,
    updateAuthority: mintKeypair.publicKey,
  };

  const maxRetries = 3;
  let attempt = 1;

  while (attempt <= maxRetries) {
    try {
      const result = await sdk.createNFTTransaction(nftParams, mintKeypair.publicKey);
      const signedTx = await sdk.signWithDualKeypairs(result.transaction, mintKeypair);
      const submitResult = await sdk.submitTransaction(signedTx);

      if (submitResult.success) {
        console.log(`✅ NFT created successfully on attempt ${attempt}:`, submitResult.signature);
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

// Export all examples for easy access
export const nftCreationExamples = {
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
};
