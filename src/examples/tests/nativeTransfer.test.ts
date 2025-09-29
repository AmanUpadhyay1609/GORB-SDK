/**
 * Native Transfer Examples
 * This file contains all examples related to native SOL transfer functionality
 */

import {
  createGorbchainSDK,
  Keypair,
  PublicKey,
} from "../../core";

// Example 1: Native transfer with single signer (sender pays fees)
export async function transferSOLSingleSigner() {
  const sdk = createGorbchainSDK();
  
  const transferParams = {
    toPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
    amountInSOL: 1.5,
    fromPublicKey: new PublicKey("SenderPublicKey"), // Replace with actual sender
    // feePayerPublicKey not provided - sender pays fees
  };

  try {
    // Step 1: Build transaction
    const result = await sdk.createNativeTransferTransaction(transferParams);
    console.log("✅ Transfer transaction created");
    console.log("📝 Transfer details:", {
      to: result.toPublicKey.toBase58(),
      amount: result.amountInLamports.toString(),
      from: result.fromPublicKey.toBase58(),
    });

    // Step 2: Sign transaction (adds fresh blockhash)
    const senderKeypair = Keypair.generate(); // Replace with your actual keypair
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
    console.log("✅ Transfer transaction signed");
    console.log("📝 Transaction after signing:");
    console.log("  - recentBlockhash:", signedTx.recentBlockhash);
    console.log("  - lastValidBlockHeight:", signedTx.lastValidBlockHeight);
    console.log("  - signatures count:", signedTx.signatures.length);

    // Step 3: Submit transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("✅ SOL transferred successfully:", submitResult.signature);
    } else {
      console.error("❌ Transfer failed:", submitResult.error);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 2: Native transfer with dual signer (admin pays fees)
export async function transferSOLDualSigner() {
  const sdk = createGorbchainSDK();
  
  const transferParams = {
    toPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
    amountInSOL: 2.0,
    fromPublicKey: new PublicKey("SenderPublicKey"), // Replace with actual sender
    feePayerPublicKey: new PublicKey("AdminPublicKey"), // Admin pays fees
  };

  try {
    // Step 1: Build transaction
    const result = await sdk.createNativeTransferTransaction(transferParams);
    console.log("✅ Transfer transaction created");

    // Step 2: Sign transaction with dual signers
    const senderKeypair = Keypair.generate(); // Replace with your actual keypair
    const adminKeypair = Keypair.generate(); // Replace with your actual admin keypair
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair, adminKeypair);
    console.log("✅ Transfer transaction signed with dual signers");

    // Step 3: Submit transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("✅ SOL transferred successfully:", submitResult.signature);
    } else {
      console.error("❌ Transfer failed:", submitResult.error);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 3: Native transfer with wallet adapter
export async function transferSOLWithWallet(wallet: any) {
  const sdk = createGorbchainSDK();
  
  const transferParams = {
    toPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
    amountInSOL: 0.5,
    fromPublicKey: wallet.publicKey,
  };

  try {
    // Step 1: Build transaction
    const result = await sdk.createNativeTransferTransaction(transferParams);
    console.log("✅ Transfer transaction created");

    // Step 2: Sign transaction with wallet
    const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet);
    console.log("✅ Transfer transaction signed with wallet");

    // Step 3: Simulate before submitting
    const simulation = await sdk.simulateTransaction(signedTx);
    if (!simulation.success) {
      throw new Error(`Simulation failed: ${simulation.error}`);
    }

    // Step 4: Submit transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("✅ SOL transferred successfully:", submitResult.signature);
    } else {
      console.error("❌ Transfer failed:", submitResult.error);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 4: Native transfer with wallet and admin fee payer
export async function transferSOLWithWalletAndAdmin(wallet: any) {
  const sdk = createGorbchainSDK();
  
  const transferParams = {
    toPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
    amountInSOL: 3.0,
    fromPublicKey: wallet.publicKey,
    feePayerPublicKey: new PublicKey("AdminPublicKey"), // Admin pays fees
  };

  try {
    // Step 1: Build transaction
    const result = await sdk.createNativeTransferTransaction(transferParams);
    console.log("✅ Transfer transaction created");

    // Step 2: Sign transaction with wallet and admin
    const adminKeypair = Keypair.generate(); // Replace with your actual admin keypair
    const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet, adminKeypair);
    console.log("✅ Transfer transaction signed with wallet and admin");

    // Step 3: Submit transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("✅ SOL transferred successfully:", submitResult.signature);
    } else {
      console.error("❌ Transfer failed:", submitResult.error);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 5: Universal native transfer example
export async function universalTransferExample() {
  const sdk = createGorbchainSDK();

  const transferParams = {
    toPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
    amountInSOL: 1.0,
    fromPublicKey: new PublicKey("SenderPublicKey"),
  };

  console.log("🔄 Building transfer transaction...");
  await sdk.createNativeTransferTransaction(transferParams);
  console.log("✅ Transfer transaction built");

  // Example of signing the transfer transaction
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

  console.log("🎉 Universal transfer examples completed!");
}

// Example 6: Batch native transfers
export async function batchNativeTransfers() {
  const sdk = createGorbchainSDK();
  
  const transfers = [
    {
      toPublicKey: new PublicKey("Recipient1PublicKey"),
      amountInSOL: 1.0,
      fromPublicKey: new PublicKey("SenderPublicKey"),
    },
    {
      toPublicKey: new PublicKey("Recipient2PublicKey"),
      amountInSOL: 2.0,
      fromPublicKey: new PublicKey("SenderPublicKey"),
    },
    {
      toPublicKey: new PublicKey("Recipient3PublicKey"),
      amountInSOL: 0.5,
      fromPublicKey: new PublicKey("SenderPublicKey"),
    },
  ];

  const results = [];
  for (const transfer of transfers) {
    try {
      const result = await sdk.createNativeTransferTransaction(transfer);
      const senderKeypair = Keypair.generate(); // Replace with your actual keypair
      const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
      const submitResult = await sdk.submitTransaction(signedTx);
      results.push(submitResult);
    } catch (error: any) {
      console.error("Transfer failed:", error.message);
      results.push({ success: false, error: error.message });
    }
  }

  console.log(`✅ Completed ${results.filter(r => r.success).length} transfers out of ${transfers.length}`);
}

// Example 7: Native transfer with error handling
export async function transferSOLWithErrorHandling() {
  const sdk = createGorbchainSDK();

  try {
    // Test with invalid amount
    const invalidAmountParams = {
      toPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
      amountInSOL: -1.0, // Invalid negative amount
      fromPublicKey: new PublicKey("SenderPublicKey"),
    };

    await sdk.createNativeTransferTransaction(invalidAmountParams);
  } catch (error: any) {
    console.error("Expected error for invalid amount:", error.message);
  }

  try {
    // Test with invalid public key
    const invalidKeyParams = {
      toPublicKey: new PublicKey("InvalidPublicKey"), // Invalid public key
      amountInSOL: 1.0,
      fromPublicKey: new PublicKey("SenderPublicKey"),
    };

    await sdk.createNativeTransferTransaction(invalidKeyParams);
  } catch (error: any) {
    console.error("Expected error for invalid public key:", error.message);
  }

  console.log("✅ Error handling tests completed!");
}

// Example 8: Native transfer with simulation
export async function transferSOLWithSimulation() {
  const sdk = createGorbchainSDK();
  
  const transferParams = {
    toPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
    amountInSOL: 1.0,
    fromPublicKey: new PublicKey("SenderPublicKey"),
  };

  try {
    const result = await sdk.createNativeTransferTransaction(transferParams);
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
      console.log("✅ SOL transferred after successful simulation:", submitResult.signature);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 9: Native transfer with retry logic
export async function transferSOLWithRetry() {
  const sdk = createGorbchainSDK();
  
  const transferParams = {
    toPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
    amountInSOL: 1.0,
    fromPublicKey: new PublicKey("SenderPublicKey"),
  };

  const maxRetries = 3;
  let attempt = 1;

  while (attempt <= maxRetries) {
    try {
      const result = await sdk.createNativeTransferTransaction(transferParams);
      const senderKeypair = Keypair.generate(); // Replace with your actual keypair
      const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
      const submitResult = await sdk.submitTransaction(signedTx);

      if (submitResult.success) {
        console.log(`✅ SOL transferred successfully on attempt ${attempt}:`, submitResult.signature);
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

// Example 10: Native transfer with different amounts
export async function transferSOLWithDifferentAmounts() {
  const sdk = createGorbchainSDK();
  
  const amounts = [0.001, 0.01, 0.1, 1.0, 10.0]; // Different SOL amounts
  const toPublicKey = new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM");
  const fromPublicKey = new PublicKey("SenderPublicKey");

  for (const amount of amounts) {
    try {
      const transferParams = {
        toPublicKey,
        amountInSOL: amount,
        fromPublicKey,
      };

      const result = await sdk.createNativeTransferTransaction(transferParams);
      const senderKeypair = Keypair.generate(); // Replace with your actual keypair
      const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
      const submitResult = await sdk.submitTransaction(signedTx);

      if (submitResult.success) {
        console.log(`✅ Transferred ${amount} SOL successfully:`, submitResult.signature);
      }
    } catch (error: any) {
      console.error(`❌ Failed to transfer ${amount} SOL:`, error.message);
    }
  }
}

// Export all examples for easy access
export const nativeTransferExamples = {
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
};
