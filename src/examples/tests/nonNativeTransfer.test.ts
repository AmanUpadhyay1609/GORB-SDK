/**
 * Non-Native Token Transfer Examples
 * This file contains all examples related to non-native token transfer functionality
 */

import bs58 from 'bs58';

import {
  createGorbchainSDK,
  Keypair,
  PublicKey,
  NonNativeTransferParams,
  EnsureTokenAccountsParams,
} from "../../core";

// Example 1: Non-native token transfer with single signer (sender pays fees)
export async function nonNativeTransferSingleSigner() {
  const sdk = createGorbchainSDK();
  
  const nonNativeTransferParams: NonNativeTransferParams = {
    mintAddress: new PublicKey("8icLSp1mF8WgtZwg5oRhjfqvAjHZ3kLyit2tXGYR4PQY"), // Your token mint
    fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"), // Your sender address
    toPublicKey: new PublicKey("55vMC4msCGgi24KdRETGUUFAebD1KUiboCo2mJcoHFhe"), // Kamran's address
    amount: 123, // Amount in human-readable units
    decimals: 4, // Token decimals
    // feePayerPublicKey not provided - sender pays fees
  };

  try {
    // Step 1: Check if token accounts exist and create if needed
    const ensureParams: EnsureTokenAccountsParams = {
      mintAddress: nonNativeTransferParams.mintAddress,
      fromPublicKey: nonNativeTransferParams.fromPublicKey,
      toPublicKey: nonNativeTransferParams.toPublicKey,
    };

    const privateKeyBuf = bs58.decode(
      "Your-private-key"
    );
    const senderKeypair = Keypair.fromSecretKey(Uint8Array.from(privateKeyBuf));

    const accountResult = await sdk.ensureTokenAccountsExist(ensureParams, senderKeypair);
    console.log("📝 Token account status:", {
      fromAccountExists: accountResult.fromAccountExists,
      toAccountExists: accountResult.toAccountExists,
      createdAccounts: accountResult.createdAccounts.map(acc => acc.toBase58()),
    });

    // If accounts were created, sign and submit the creation transaction first
    if (accountResult.transaction) {
      console.log("🔧 Creating missing token accounts...");
      const createSignedTx = await sdk.signWithDualKeypairs(accountResult.transaction, senderKeypair);
      const createResult = await sdk.submitTransaction(createSignedTx);
      if (createResult.success) {
        console.log("✅ Token accounts created:", createResult.signature);
      } else {
        throw new Error(`Failed to create token accounts: ${createResult.error}`);
      }
    }

    // Step 2: Create transfer transaction
    const result = await sdk.createNonNativeTransferTransaction(nonNativeTransferParams);
    console.log("✅ Non-native transfer transaction created");
    console.log("📝 Transfer details:", {
      mintAddress: result.mintAddress.toBase58(),
      fromPublicKey: result.fromPublicKey.toBase58(),
      toPublicKey: result.toPublicKey.toBase58(),
      amountInSmallestUnits: result.amountInSmallestUnits.toString(),
      fromTokenAccount: result.fromTokenAccount.toBase58(),
      toTokenAccount: result.toTokenAccount.toBase58(),
      feePayerPublicKey: result.feePayerPublicKey.toBase58(),
    });

    // Step 3: Sign transaction (adds fresh blockhash)
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
    console.log("✅ Non-native transfer transaction signed");
    console.log("📝 Transaction after signing:");
    console.log("  - recentBlockhash:", signedTx.recentBlockhash);
    console.log("  - lastValidBlockHeight:", signedTx.lastValidBlockHeight);
    console.log("  - signatures count:", signedTx.signatures.length);

    // Step 4: Submit transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("✅ Non-native transfer successful:", submitResult.signature);
    } else {
      console.error("❌ Non-native transfer failed:", submitResult.error);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 2: Non-native token transfer with dual signer (admin pays fees)
export async function nonNativeTransferDualSigner() {
  const sdk = createGorbchainSDK();
  
  const nonNativeTransferParams: NonNativeTransferParams = {
    mintAddress: new PublicKey("8icLSp1mF8WgtZwg5oRhjfqvAjHZ3kLyit2tXGYR4PQY"), // Replace with actual token mint
    fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"), // Sender
    toPublicKey: new PublicKey("55vMC4msCGgi24KdRETGUUFAebD1KUiboCo2mJcoHFhe"), // Recipient
    amount: 50, // Amount in human-readable units
    decimals: 4, // Token decimals
    feePayerPublicKey: new PublicKey("AdminPublicKey"), // Admin pays fees
  };

  try {
    // Step 1: Build transaction
    const result = await sdk.createNonNativeTransferTransaction(nonNativeTransferParams);
    console.log("✅ Non-native transfer transaction created");

    // Step 2: Sign transaction with dual signers
    const senderKeypair = Keypair.fromSecretKey(bs58.decode("Your-private-key"));
    const adminKeypair = Keypair.generate(); // Replace with your actual admin keypair
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair, adminKeypair);
    console.log("✅ Non-native transfer transaction signed with dual signers");

    // Step 3: Submit transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("✅ Non-native transfer successful:", submitResult.signature);
    } else {
      console.error("❌ Non-native transfer failed:", submitResult.error);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 3: Non-native token transfer with wallet adapter
export async function nonNativeTransferWithWallet(wallet: any) {
  const sdk = createGorbchainSDK();
  
  const nonNativeTransferParams: NonNativeTransferParams = {
    mintAddress: new PublicKey("8icLSp1mF8WgtZwg5oRhjfqvAjHZ3kLyit2tXGYR4PQY"), // Replace with actual token mint
    fromPublicKey: wallet.publicKey,
    toPublicKey: new PublicKey("55vMC4msCGgi24KdRETGUUFAebD1KUiboCo2mJcoHFhe"), // Recipient
    amount: 25, // Amount in human-readable units
    decimals: 4, // Token decimals
  };

  try {
    // Step 1: Check if token accounts exist and create if needed (with wallet)
    const ensureParams: EnsureTokenAccountsParams = {
      mintAddress: nonNativeTransferParams.mintAddress,
      fromPublicKey: nonNativeTransferParams.fromPublicKey,
      toPublicKey: nonNativeTransferParams.toPublicKey,
    };

    const accountResult = await sdk.ensureTokenAccountsExist(ensureParams, wallet);
    console.log("📝 Token account status:", {
      fromAccountExists: accountResult.fromAccountExists,
      toAccountExists: accountResult.toAccountExists,
      createdAccounts: accountResult.createdAccounts.map(acc => acc.toBase58()),
    });

    // If accounts were created, sign and submit the creation transaction first
    if (accountResult.transaction) {
      console.log("🔧 Creating missing token accounts with wallet...");
      const createSignedTx = await sdk.signTransferWithWalletAndKeypair(accountResult.transaction, wallet);
      const createResult = await sdk.submitTransaction(createSignedTx);
      if (createResult.success) {
        console.log("✅ Token accounts created:", createResult.signature);
      } else {
        throw new Error(`Failed to create token accounts: ${createResult.error}`);
      }
    }

    // Step 2: Create transfer transaction
    const result = await sdk.createNonNativeTransferTransaction(nonNativeTransferParams);
    console.log("✅ Non-native transfer transaction created");

    // Step 3: Sign transaction with wallet
    const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet);
    console.log("✅ Non-native transfer transaction signed with wallet");

    // Step 4: Simulate before submitting
    const simulation = await sdk.simulateTransaction(signedTx);
    if (!simulation.success) {
      throw new Error(`Simulation failed: ${simulation.error}`);
    }

    // Step 5: Submit transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("✅ Non-native transfer successful:", submitResult.signature);
    } else {
      console.error("❌ Non-native transfer failed:", submitResult.error);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 4: Non-native token transfer with wallet and admin fee payer
export async function nonNativeTransferWithWalletAndAdmin(wallet: any) {
  const sdk = createGorbchainSDK();
  
  const nonNativeTransferParams: NonNativeTransferParams = {
    mintAddress: new PublicKey("8icLSp1mF8WgtZwg5oRhjfqvAjHZ3kLyit2tXGYR4PQY"), // Replace with actual token mint
    fromPublicKey: wallet.publicKey,
    toPublicKey: new PublicKey("55vMC4msCGgi24KdRETGUUFAebD1KUiboCo2mJcoHFhe"), // Recipient
    amount: 100, // Amount in human-readable units
    decimals: 4, // Token decimals
    feePayerPublicKey: new PublicKey("AdminPublicKey"), // Admin pays fees
  };

  try {
    // Step 1: Build transaction
    const result = await sdk.createNonNativeTransferTransaction(nonNativeTransferParams);
    console.log("✅ Non-native transfer transaction created");

    // Step 2: Sign transaction with wallet and admin
    const adminKeypair = Keypair.generate(); // Replace with your actual admin keypair
    const signedTx = await sdk.signWithWalletAndKeypair(result.transaction, wallet, adminKeypair);
    console.log("✅ Non-native transfer transaction signed with wallet and admin");

    // Step 3: Submit transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("✅ Non-native transfer successful:", submitResult.signature);
    } else {
      console.error("❌ Non-native transfer failed:", submitResult.error);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 5: Non-native token transfer with custom amount and decimals
export async function nonNativeTransferCustomAmount() {
  const sdk = createGorbchainSDK();
  
  const nonNativeTransferParams: NonNativeTransferParams = {
    mintAddress: new PublicKey("8icLSp1mF8WgtZwg5oRhjfqvAjHZ3kLyit2tXGYR4PQY"), // Replace with actual token mint
    fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"), // Sender
    toPublicKey: new PublicKey("55vMC4msCGgi24KdRETGUUFAebD1KUiboCo2mJcoHFhe"), // Recipient
    amount: 0.0001, // Very small amount
    decimals: 6, // 6 decimals (like USDC)
  };

  try {
    // Step 1: Build transaction
    const result = await sdk.createNonNativeTransferTransaction(nonNativeTransferParams);
    console.log("✅ Non-native transfer transaction created");
    console.log("📝 Custom amount transfer details:", {
      humanAmount: nonNativeTransferParams.amount,
      decimals: nonNativeTransferParams.decimals,
      smallestUnits: result.amountInSmallestUnits.toString(),
    });

    // Step 2: Sign transaction
    const senderKeypair = Keypair.fromSecretKey(bs58.decode("Your-private-key"));
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
    console.log("✅ Non-native transfer transaction signed");

    // Step 3: Submit transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("✅ Non-native transfer successful:", submitResult.signature);
    } else {
      console.error("❌ Non-native transfer failed:", submitResult.error);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Example 6: Non-native token transfer with error handling
export async function nonNativeTransferWithErrorHandling() {
  const sdk = createGorbchainSDK();
  
  try {
    // Test with invalid amount
    const invalidParams: NonNativeTransferParams = {
      mintAddress: new PublicKey("8icLSp1mF8WgtZwg5oRhjfqvAjHZ3kLyit2tXGYR4PQY"),
      fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
      toPublicKey: new PublicKey("55vMC4msCGgi24KdRETGUUFAebD1KUiboCo2mJcoHFhe"),
      amount: -1, // Invalid negative amount
      decimals: 4,
    };

    await sdk.createNonNativeTransferTransaction(invalidParams);
  } catch (error: any) {
    console.log("✅ Error handling works correctly:", error.message);
  }

  try {
    // Test with invalid decimals
    const invalidDecimalsParams: NonNativeTransferParams = {
      mintAddress: new PublicKey("8icLSp1mF8WgtZwg5oRhjfqvAjHZ3kLyit2tXGYR4PQY"),
      fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
      toPublicKey: new PublicKey("55vMC4msCGgi24KdRETGUUFAebD1KUiboCo2mJcoHFhe"),
      amount: 100,
      decimals: 15, // Invalid decimals (too high)
    };

    await sdk.createNonNativeTransferTransaction(invalidDecimalsParams);
  } catch (error: any) {
    console.log("✅ Decimals validation works correctly:", error.message);
  }
}

// Example 7: Non-native token transfer with balance checking
export async function nonNativeTransferWithBalanceCheck() {
  const sdk = createGorbchainSDK();
  
  const nonNativeTransferParams: NonNativeTransferParams = {
    mintAddress: new PublicKey("8icLSp1mF8WgtZwg5oRhjfqvAjHZ3kLyit2tXGYR4PQY"), // Replace with actual token mint
    fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"), // Sender
    toPublicKey: new PublicKey("55vMC4msCGgi24KdRETGUUFAebD1KUiboCo2mJcoHFhe"), // Recipient
    amount: 1000000, // Large amount that might exceed balance
    decimals: 4, // Token decimals
  };

  try {
    // Step 1: Check if token accounts exist (without creating)
    const ensureParams: EnsureTokenAccountsParams = {
      mintAddress: nonNativeTransferParams.mintAddress,
      fromPublicKey: nonNativeTransferParams.fromPublicKey,
      toPublicKey: nonNativeTransferParams.toPublicKey,
    };

    const accountResult = await sdk.ensureTokenAccountsExist(ensureParams); // No signer = just check
    console.log("📝 Token account status:", {
      fromAccountExists: accountResult.fromAccountExists,
      toAccountExists: accountResult.toAccountExists,
    });

    if (!accountResult.fromAccountExists || !accountResult.toAccountExists) {
      throw new Error("Token accounts don't exist. Use ensureTokenAccountsExist with signer to create them.");
    }

    // Step 2: Create transfer transaction (this will check balance)
    const result = await sdk.createNonNativeTransferTransaction(nonNativeTransferParams);
    console.log("✅ Non-native transfer transaction created - sufficient balance");

    // Step 3: Sign and submit if balance is sufficient
    const senderKeypair = Keypair.fromSecretKey(bs58.decode("Your-private-key"));
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
    
    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("✅ Non-native transfer successful:", submitResult.signature);
    } else {
      console.error("❌ Non-native transfer failed:", submitResult.error);
    }
  } catch (error: any) {
    if (error.message.includes("Insufficient token balance")) {
      console.log("✅ Balance checking works correctly - insufficient balance detected");
    } else {
      console.error("❌ Unexpected error:", error.message);
    }
  }
}

// Example 8: Simple transfer when accounts already exist (no ATA creation needed)
export async function nonNativeTransferSimple() {
  const sdk = createGorbchainSDK();
  
  const nonNativeTransferParams: NonNativeTransferParams = {
    mintAddress: new PublicKey("8icLSp1mF8WgtZwg5oRhjfqvAjHZ3kLyit2tXGYR4PQY"), // Replace with actual token mint
    fromPublicKey: new PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"), // Sender
    toPublicKey: new PublicKey("55vMC4msCGgi24KdRETGUUFAebD1KUiboCo2mJcoHFhe"), // Recipient
    amount: 50, // Amount in human-readable units
    decimals: 4, // Token decimals
  };

  try {
    // Step 1: Create transfer transaction (assumes accounts exist)
    const result = await sdk.createNonNativeTransferTransaction(nonNativeTransferParams);
    console.log("✅ Non-native transfer transaction created");

    // Step 2: Sign transaction
    const senderKeypair = Keypair.fromSecretKey(bs58.decode("Your-private-key"));
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
    console.log("✅ Non-native transfer transaction signed");

    // Step 3: Submit transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    if (submitResult.success) {
      console.log("✅ Non-native transfer successful:", submitResult.signature);
    } else {
      console.error("❌ Non-native transfer failed:", submitResult.error);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Export all non-native transfer examples
export const nonNativeTransferExamples = {
  nonNativeTransferSingleSigner,
  nonNativeTransferDualSigner,
  nonNativeTransferWithWallet,
  nonNativeTransferWithWalletAndAdmin,
  nonNativeTransferCustomAmount,
  nonNativeTransferWithErrorHandling,
  nonNativeTransferWithBalanceCheck,
  nonNativeTransferSimple,
};
