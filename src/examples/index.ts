/**
 * Example usage of the Solana SDK
 * This file demonstrates how to use the SDK for different scenarios
 */

import {
  createGorbchainSDK,
  // createSolanaSDK,
  createSDK,
  createBlockchainConfig,
  Keypair,
  PublicKey,
  GORB,
  TokenInfo,
  SwapParams,
} from "../core";
import bs58 from "bs58";

// Example 1: Using Gorbchain SDK
export async function createTokenOnGorbchain() {
  // Create SDK instance for Gorbchain
  const sdk = createGorbchainSDK();

  // Or with custom RPC URL
  // const sdk = createGorbchainSDK("https://custom-gorbchain-rpc.com");

  // Create token parameters
  const tokenParams = {
    name: "My Token",
    symbol: "MTK",
    supply: 1000000,
    decimals: 6,
    uri: "https://img.freepik.com/premium-vector/mtk-letter-logo-design-technology-company-mtk-logo-design-black-white-color-combination-mtk-logo-mtk-vector-mtk-design-mtk-icon-mtk-alphabet-mtk-typography-logo-design_229120-170678.jpg",
    freezeAuthority: null, // Optional
  };

  // Build the complete transaction (includes all steps: create mint, metadata, ATA, and minting)
  const payer = new PublicKey("your public key");
  const result = await sdk.createTokenTransaction(tokenParams, payer);
  
  console.log("✅ Token created successfully!");
  console.log("📍 Token address:", result.mintAddress.toBase58());
  console.log("📍 Associated token address:", result.associatedTokenAddress?.toBase58() || "N/A");
  console.log("📦 Instructions count:", result.instructions.length);
  console.log("🔧 Instructions include: Create mint, Initialize metadata, Create ATA, Mint tokens");
  console.log(`the whole result is ${JSON.stringify(result)}`);

  // Sign the complete transaction (only needs to be signed once!)
  const privateKeyBuf = bs58.decode(
    "your private key"
  );
  const feePayerKeypair = Keypair.fromSecretKey(Uint8Array.from(privateKeyBuf));
  console.log(`the fee payer keypair is ${JSON.stringify(feePayerKeypair)}`);
  const signedTx = await sdk.signWithKeypair(result.transaction, feePayerKeypair);
  console.log(`the signed tx is ${JSON.stringify(signedTx)}`);

  // Or with wallet adapter
  // const wallet = { publicKey: new PublicKey("..."), signTransaction: ... };
  // const signedTx = await sdk.signWithWalletAdapter(result.transaction, wallet);

  // Submit the transaction
  const submitResult = await sdk.submitTransaction(signedTx);
  console.log("Transaction signature:", submitResult);
}

// Example 2: Using Gorbchain SDK
export async function createNFTOnGorbchain() {
  // Create SDK instance for Solana mainnet
  const sdk = createGorbchainSDK();

  // Or for devnet
  // const sdk = createSolanaSDK("devnet");

  // Create NFT parameters
  const nftParams = {
    name: "My NFT",
    symbol: "MNFT",
    uri: "https://cdn-icons-png.flaticon.com/512/6298/6298900.png",
    description: "This is my awesome NFT",
  };

  // Build the transaction
  const payer = new PublicKey("your public key"); // Example payer
  const result = await sdk.createNFTTransaction(nftParams, payer);
  console.log("NFT address:", result.mintAddress.toBase58());

  // Sign and submit
  const privateKeyBuf = bs58.decode(
    "your private key"
  );
  const feePayerKeypair = Keypair.fromSecretKey(Uint8Array.from(privateKeyBuf));
  console.log(`the fee payer keypair is ${JSON.stringify(feePayerKeypair)}`);
  const signedTx = await sdk.signWithKeypair(result.transaction, feePayerKeypair);
  console.log(`the signed tx is ${JSON.stringify(signedTx)}`);
  const submitResult = await sdk.submitTransaction(signedTx);
  console.log("NFT created:", submitResult.signature);
}

// Example 3: Using custom blockchain configuration
export async function createTokenOnCustomBlockchain() {
  // Create custom blockchain configuration
  const customConfig = createBlockchainConfig(
    "YourTokenProgramId",
    "YourAssociatedTokenProgramId",
    "https://your-custom-rpc.com",
    {
      wsUrl: "wss://your-custom-ws.com",
      commitment: "confirmed",
      name: "custom-chain",
    }
  );

  // Create SDK with custom config
  const sdk = createSDK({ blockchain: customConfig });

  // Use the SDK normally
  const tokenParams = {
    name: "Custom Token",
    symbol: "CTK",
    supply: 500000,
    decimals: 9,
    uri: "https://custom-metadata.com/token.json",
  };

  const payer = new PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"); // Example payer
  const result = await sdk.createTokenTransaction(tokenParams, payer);
  console.log("Custom token address:", result.mintAddress.toBase58());
}

// Example 4: Complete workflow with wallet adapter
export async function completeTokenCreationWithWallet(wallet: any) {
  const sdk = createGorbchainSDK();

  // Step 1: Build transaction
  const result = await sdk.createTokenTransaction({
    name: "Wallet Token",
    symbol: "WKT",
    supply: 1000000,
    decimals: 6,
    uri: "https://wallet-metadata.com/token.json",
  }, wallet.publicKey);

  // Step 2: Sign with wallet and mint keypair
  const signedTx = await sdk.signWithWalletAndKeypair(
    result.transaction,
    wallet,
    result.mintKeypair
  );

  // Step 4: Simulate before submitting (optional but recommended)
  const simulation = await sdk.simulateTransaction(signedTx);
  if (!simulation.success) {
    throw new Error(`Simulation failed: ${simulation.error}`);
  }

  // Step 5: Submit transaction
  const submitResult = await sdk.submitTransaction(signedTx);
  if (!submitResult.success) {
    throw new Error(`Transaction failed: ${submitResult.error}`);
  }

  // Step 6: Wait for confirmation
  const confirmation = await sdk.waitForConfirmation(submitResult.signature);
  if (!confirmation.success) {
    throw new Error(`Confirmation failed: ${confirmation.error}`);
  }

  console.log("Token created successfully!");
  console.log("Address:", result.mintAddress.toBase58());
  console.log("Signature:", submitResult.signature);
}

// Example 5: Batch operations
export async function createMultipleTokens() {
  const sdk = createGorbchainSDK();
  const tokens = [
    {
      name: "Token 1",
      symbol: "TK1",
      supply: 1000000,
      decimals: 6,
      uri: "https://token1.com",
    },
    {
      name: "Token 2",
      symbol: "TK2",
      supply: 2000000,
      decimals: 9,
      uri: "https://token2.com",
    },
    {
      name: "Token 3",
      symbol: "TK3",
      supply: 500000,
      decimals: 6,
      uri: "https://token3.com",
    },
  ];

  const results = [];
  const payer = new PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"); // Example payer
  for (const token of tokens) {
    const result = await sdk.createTokenTransaction(token, payer);
    results.push(result);
  }

  console.log("Created transactions for", results.length, "tokens");
  return results;
}

// Example 6: Error handling
export async function createTokenWithErrorHandling() {
  const sdk = createGorbchainSDK();

  try {
    const payer = new PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"); // Example payer
    const result = await sdk.createTokenTransaction({
      name: "Error Token",
      symbol: "ERR",
      supply: 1000000,
      decimals: 6,
      uri: "https://error-token.com",
    }, payer);

    // Simulate the transaction first
    const simulation = await sdk.simulateTransaction(result.transaction);
    if (!simulation.success) {
      console.error("Simulation failed:", simulation.error);
      return;
    }

    // Continue with signing and submission...
    console.log("Transaction simulation successful");
  } catch (error: any) {
    console.error("Error creating token:", error.message);

    // Handle specific error types
    if (error.name === "SDKError") {
      console.error("SDK Error:", error.message);
    } else if (error.name === "TransactionError") {
      console.error("Transaction Error:", error.message);
    } else if (error.name === "SigningError") {
      console.error("Signing Error:", error.message);
    }
  }
}

// Example 7: Using the GORB object for backward compatibility
export function demonstrateGORBObject() {
  // Access Gorbchain constants
  console.log("Token22 Program:", GORB.TOKEN22_PROGRAM.toBase58());
  console.log(
    "Associated Token Program:",
    GORB.ASSOCIATED_TOKEN_PROGRAM.toBase58()
  );
  console.log("System Program:", GORB.SYSTEM_PROGRAM.toBase58());
  console.log("RPC URL:", GORB.CONFIG.rpcUrl);

  // Use in custom configurations
  // const customConfig = createBlockchainConfig(
  //   GORB.TOKEN22_PROGRAM.toBase58(),
  //   GORB.ASSOCIATED_TOKEN_PROGRAM.toBase58(),
  //   "https://custom-rpc.com"
  // );
}


// Example 8: Native SOL Transfer with single signer (sender pays fees)
export async function transferSOLSingleSigner() {
  const sdk = createGorbchainSDK();

  // Transfer parameters
  const transferParams = {
    fromPublicKey: new PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"), // Sender
    toPublicKey: new PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"), // Recipient
    amountInSOL: 0.1, // 0.1 SOL
    // feePayerPublicKey not provided, so sender will pay fees
  };

  // Build the transaction
  const result = await sdk.createNativeTransferTransaction(transferParams);
  console.log("✅ Transfer transaction created successfully!");
  console.log("📍 From:", result.fromPublicKey.toBase58());
  console.log("📍 To:", result.toPublicKey.toBase58());
  console.log("💰 Amount:", result.amountInLamports / 1_000_000_000, "SOL");
  console.log("💳 Fee Payer:", result.feePayerPublicKey.toBase58());
  console.log("📦 Instructions count:", result.instructions.length);

  // Sign with sender keypair (since sender is also fee payer)
  const privateKeyBuf = bs58.decode("your sender private key");
  const senderKeypair = Keypair.fromSecretKey(Uint8Array.from(privateKeyBuf));
  
  const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
  console.log("✅ Transaction signed successfully!");

  // Submit the transaction
  const submitResult = await sdk.submitTransaction(signedTx);
  console.log("Transaction signature:", submitResult.signature);
}

// Example 9: Native SOL Transfer with dual signers (admin pays fees)
export async function transferSOLDualSigner() {
  const sdk = createGorbchainSDK();

  // Transfer parameters with separate fee payer
  const transferParams = {
    fromPublicKey: new PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"), // Sender
    toPublicKey: new PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"), // Recipient
    amountInSOL: 0.5, // 0.5 SOL
    feePayerPublicKey: new PublicKey("AdminPublicKeyHere"), // Admin pays fees
  };

  // Build the transaction
  const result = await sdk.createNativeTransferTransaction(transferParams);
  console.log("✅ Transfer transaction created successfully!");
  console.log("📍 From:", result.fromPublicKey.toBase58());
  console.log("📍 To:", result.toPublicKey.toBase58());
  console.log("💰 Amount:", result.amountInLamports / 1_000_000_000, "SOL");
  console.log("💳 Fee Payer:", result.feePayerPublicKey.toBase58());

  // Sign with both sender and fee payer keypairs
  const senderPrivateKeyBuf = bs58.decode("your sender private key");
  const senderKeypair = Keypair.fromSecretKey(Uint8Array.from(senderPrivateKeyBuf));

  const feePayerPrivateKeyBuf = bs58.decode("your admin private key");
  const feePayerKeypair = Keypair.fromSecretKey(Uint8Array.from(feePayerPrivateKeyBuf));

  const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair, feePayerKeypair);
  console.log("✅ Transaction signed with dual signers!");

  // Submit the transaction
  const submitResult = await sdk.submitTransaction(signedTx);
  console.log("Transaction signature:", submitResult.signature);
}

// Example 10: Native SOL Transfer with wallet adapter
export async function transferSOLWithWallet(wallet: any) {
  const sdk = createGorbchainSDK();

  // Transfer parameters
  const transferParams = {
    fromPublicKey: wallet.publicKey, // Wallet is the sender
    toPublicKey: new PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"), // Recipient
    amountInSOL: 0.25, // 0.25 SOL
    // feePayerPublicKey not provided, so wallet will pay fees
  };

  // Build the transaction
  const result = await sdk.createNativeTransferTransaction(transferParams);
  console.log("✅ Transfer transaction created successfully!");

  // Sign with wallet (since wallet is also fee payer)
  const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet);
  console.log("✅ Transaction signed with wallet!");

  // Simulate before submitting (optional but recommended)
  const simulation = await sdk.simulateTransaction(signedTx);
  if (!simulation.success) {
    throw new Error(`Simulation failed: ${simulation.error}`);
  }

  // Submit the transaction
  const submitResult = await sdk.submitTransaction(signedTx);
  if (!submitResult.success) {
    throw new Error(`Transaction failed: ${submitResult.error}`);
  }

  // Wait for confirmation
  const confirmation = await sdk.waitForConfirmation(submitResult.signature);
  if (!confirmation.success) {
    throw new Error(`Confirmation failed: ${confirmation.error}`);
  }

  console.log("✅ Transfer completed successfully!");
  console.log("Signature:", submitResult.signature);
}

// Example 11: Native SOL Transfer with wallet and admin fee payer
export async function transferSOLWithWalletAndAdmin(wallet: any) {
  const sdk = createGorbchainSDK();

  // Transfer parameters with admin as fee payer
  const transferParams = {
    fromPublicKey: wallet.publicKey, // Wallet is the sender
    toPublicKey: new PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"), // Recipient
    amountInSOL: 1.0, // 1.0 SOL
    feePayerPublicKey: new PublicKey("AdminPublicKeyHere"), // Admin pays fees
  };

  // Build the transaction
  const result = await sdk.createNativeTransferTransaction(transferParams);
  console.log("✅ Transfer transaction created successfully!");

  // Admin keypair for fee payment
  const adminPrivateKeyBuf = bs58.decode("your admin private key");
  const adminKeypair = Keypair.fromSecretKey(Uint8Array.from(adminPrivateKeyBuf));

  // Sign with wallet and admin keypair
  const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet, adminKeypair);
  console.log("✅ Transaction signed with wallet and admin!");

  // Submit the transaction
  const submitResult = await sdk.submitTransaction(signedTx);
  console.log("Transaction signature:", submitResult.signature);
}

// Example 12: Batch native transfers
export async function batchNativeTransfers() {
  const sdk = createGorbchainSDK();

  const transfers = [
    {
      fromPublicKey: new PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"),
      toPublicKey: new PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"),
      amountInSOL: 0.1,
    },
    {
      fromPublicKey: new PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"),
      toPublicKey: new PublicKey("AnotherRecipientPublicKey"),
      amountInSOL: 0.2,
    },
    {
      fromPublicKey: new PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"),
      toPublicKey: new PublicKey("ThirdRecipientPublicKey"),
      amountInSOL: 0.3,
    },
  ];

  const results = [];
  const senderPrivateKeyBuf = bs58.decode("your sender private key");
  const senderKeypair = Keypair.fromSecretKey(Uint8Array.from(senderPrivateKeyBuf));

  for (const transfer of transfers) {
    const result = await sdk.createNativeTransferTransaction(transfer);
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
    const submitResult = await sdk.submitTransaction(signedTx);
    results.push(submitResult);
  }

  console.log("✅ Batch transfers completed!");
  console.log("Results:", results.map(r => r.signature));
}

// Example 13: Error handling for native transfers
export async function transferSOLWithErrorHandling() {
  const sdk = createGorbchainSDK();

  try {
    // Test with invalid amount
    const invalidTransferParams = {
      fromPublicKey: new PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"),
      toPublicKey: new PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"),
      amountInSOL: -0.1, // Invalid negative amount
    };

    await sdk.createNativeTransferTransaction(invalidTransferParams);
  } catch (error: any) {
    console.error("Expected error for invalid amount:", error.message);
  }

  try {
    // Test with zero amount
    const zeroTransferParams = {
      fromPublicKey: new PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"),
      toPublicKey: new PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"),
      amountInSOL: 0, // Invalid zero amount
    };

    await sdk.createNativeTransferTransaction(zeroTransferParams);
  } catch (error: any) {
    console.error("Expected error for zero amount:", error.message);
  }

  console.log("✅ Error handling tests completed!");
}

// Example 14: Token Swap with single signer (sender pays fees)
export async function swapTokensSingleSigner() {
  const sdk = createGorbchainSDK();

  // Token information
  const fromToken: TokenInfo = {
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin"
  };

  const toToken: TokenInfo = {
    address: "So11111111111111111111111111111111111111112", // SOL
    symbol: "SOL",
    decimals: 9,
    name: "Solana"
  };

  // Swap parameters
  const swapParams: SwapParams = {
    fromTokenAmount: 100, // 100 USDC
    fromToken,
    toToken,
    fromPublicKey: new PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"), // Sender
    // feePayerPublicKey not provided, so sender will pay fees
    slippageTolerance: 0.5, // 0.5% slippage
  };

  // Build the transaction
  const result = await sdk.createSwapTransaction(swapParams);
  console.log("✅ Swap transaction created successfully!");
  console.log("🔄 From:", result.fromToken.symbol, result.fromTokenAmount);
  console.log("🔄 To:", result.toToken.symbol);
  console.log("📍 Pool PDA:", result.poolPDA.toBase58());
  console.log("📍 Token A:", result.tokenA.toBase58());
  console.log("📍 Token B:", result.tokenB.toBase58());
  console.log("📍 Direction:", result.directionAtoB ? "A to B" : "B to A");
  console.log("📍 Native SOL Swap:", result.isNativeSOLSwap);
  console.log("💳 Fee Payer:", result.feePayerPublicKey.toBase58());

  // Sign with sender keypair (since sender is also fee payer)
  const privateKeyBuf = bs58.decode("your sender private key");
  const senderKeypair = Keypair.fromSecretKey(Uint8Array.from(privateKeyBuf));
  
  const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
  console.log("✅ Transaction signed successfully!");

  // Submit the transaction
  const submitResult = await sdk.submitTransaction(signedTx);
  console.log("Swap signature:", submitResult.signature);
}

// Example 15: Token Swap with dual signers (admin pays fees)
export async function swapTokensDualSigner() {
  const sdk = createGorbchainSDK();

  // Token information
  const fromToken: TokenInfo = {
    address: "So11111111111111111111111111111111111111112", // SOL
    symbol: "SOL",
    decimals: 9,
    name: "Solana"
  };

  const toToken: TokenInfo = {
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin"
  };

  // Swap parameters with separate fee payer
  const swapParams: SwapParams = {
    fromTokenAmount: 1.5, // 1.5 SOL
    fromToken,
    toToken,
    fromPublicKey: new PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"), // Sender
    feePayerPublicKey: new PublicKey("AdminPublicKeyHere"), // Admin pays fees
    slippageTolerance: 1.0, // 1% slippage
  };

  // Build the transaction
  const result = await sdk.createSwapTransaction(swapParams);
  console.log("✅ Swap transaction created successfully!");

  // Sign with both sender and fee payer keypairs
  const senderPrivateKeyBuf = bs58.decode("your sender private key");
  const senderKeypair = Keypair.fromSecretKey(Uint8Array.from(senderPrivateKeyBuf));

  const feePayerPrivateKeyBuf = bs58.decode("your admin private key");
  const feePayerKeypair = Keypair.fromSecretKey(Uint8Array.from(feePayerPrivateKeyBuf));

  const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair, feePayerKeypair);
  console.log("✅ Transaction signed with dual signers!");

  // Submit the transaction
  const submitResult = await sdk.submitTransaction(signedTx);
  console.log("Swap signature:", submitResult.signature);
}

// Example 16: Token Swap with wallet adapter
export async function swapTokensWithWallet(wallet: any) {
  const sdk = createGorbchainSDK();

  // Token information
  const fromToken: TokenInfo = {
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin"
  };

  const toToken: TokenInfo = {
    address: "So11111111111111111111111111111111111111112", // SOL
    symbol: "SOL",
    decimals: 9,
    name: "Solana"
  };

  // Swap parameters
  const swapParams: SwapParams = {
    fromTokenAmount: 50, // 50 USDC
    fromToken,
    toToken,
    fromPublicKey: wallet.publicKey, // Wallet is the sender
    // feePayerPublicKey not provided, so wallet will pay fees
    slippageTolerance: 0.3, // 0.3% slippage
  };

  // Build the transaction
  const result = await sdk.createSwapTransaction(swapParams);
  console.log("✅ Swap transaction created successfully!");

  // Sign with wallet (since wallet is also fee payer)
  const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet);
  console.log("✅ Transaction signed with wallet!");

  // Simulate before submitting (optional but recommended)
  const simulation = await sdk.simulateTransaction(signedTx);
  if (!simulation.success) {
    throw new Error(`Simulation failed: ${simulation.error}`);
  }

  // Submit the transaction
  const submitResult = await sdk.submitTransaction(signedTx);
  if (!submitResult.success) {
    throw new Error(`Transaction failed: ${submitResult.error}`);
  }

  // Wait for confirmation
  const confirmation = await sdk.waitForConfirmation(submitResult.signature);
  if (!confirmation.success) {
    throw new Error(`Confirmation failed: ${confirmation.error}`);
  }

  console.log("✅ Swap completed successfully!");
  console.log("Signature:", submitResult.signature);
}

// Example 17: Token Swap with wallet and admin fee payer
export async function swapTokensWithWalletAndAdmin(wallet: any) {
  const sdk = createGorbchainSDK();

  // Token information
  const fromToken: TokenInfo = {
    address: "So11111111111111111111111111111111111111112", // SOL
    symbol: "SOL",
    decimals: 9,
    name: "Solana"
  };

  const toToken: TokenInfo = {
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin"
  };

  // Swap parameters with admin as fee payer
  const swapParams: SwapParams = {
    fromTokenAmount: 2.0, // 2.0 SOL
    fromToken,
    toToken,
    fromPublicKey: wallet.publicKey, // Wallet is the sender
    feePayerPublicKey: new PublicKey("AdminPublicKeyHere"), // Admin pays fees
    slippageTolerance: 0.8, // 0.8% slippage
  };

  // Build the transaction
  const result = await sdk.createSwapTransaction(swapParams);
  console.log("✅ Swap transaction created successfully!");

  // Admin keypair for fee payment
  const adminPrivateKeyBuf = bs58.decode("your admin private key");
  const adminKeypair = Keypair.fromSecretKey(Uint8Array.from(adminPrivateKeyBuf));

  // Sign with wallet and admin keypair
  const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet, adminKeypair);
  console.log("✅ Transaction signed with wallet and admin!");

  // Submit the transaction
  const submitResult = await sdk.submitTransaction(signedTx);
  console.log("Swap signature:", submitResult.signature);
}

// Example 18: Universal Swap (automatically detects SOL involvement)
export async function universalSwapExample() {
  const sdk = createGorbchainSDK();

  // Example 1: Token to Token swap
  // const tokenToTokenSwap: SwapParams = {
  //   fromTokenAmount: 100,
  //   fromToken: {
  //     address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
  //     symbol: "USDC",
  //     decimals: 6,
  //     name: "USD Coin"
  //   },
  //   toToken: {
  //     address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // USDT
  //     symbol: "USDT",
  //     decimals: 6,
  //     name: "Tether USD"
  //   },
  //   fromPublicKey: new PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"),
  //   slippageTolerance: 0.5,
  // };

  // Example 2: SOL to Token swap
  const solToTokenSwap: SwapParams = {
    fromTokenAmount: 1.0, // 1 SOL
    fromToken: {
      address: "So11111111111111111111111111111111111111112", // SOL
      symbol: "Gorb",
      decimals: 9,
      name: "Gorb"
    },
    toToken: {
      address: "4eCdoBMvbUSYZBfvXwqTd7eg9fzzWzQAd54xYFoB8eKf", // USDC
      symbol: "YH!@",
      decimals: 7,
      name: "YH1"
    },
    fromPublicKey: new PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"),
    slippageTolerance: 0.5,
  };

  // Example 3: Token to SOL swap
  // const tokenToSolSwap: SwapParams = {
  //   fromTokenAmount: 50,
  //   fromToken: {
  //     address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
  //     symbol: "USDC",
  //     decimals: 6,
  //     name: "USD Coin"
  //   },
  //   toToken: {
  //     address: "So11111111111111111111111111111111111111112", // SOL
  //     symbol: "SOL",
  //     decimals: 9,
  //     name: "Solana"
  //   },
  //   fromPublicKey: new PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"),
  //   slippageTolerance: 0.5,
  // };

  // console.log("🔄 Building Token to Token swap...");
  // const result1 = await sdk.createSwapTransaction(tokenToTokenSwap);
  // console.log("✅ Token to Token swap built:", result1.isNativeSOLSwap ? "Native SOL" : "Regular");

  console.log("🔄 Building SOL to Token swap...");
  const result2 = await sdk.createSwapTransaction(solToTokenSwap);
  console.log("✅ SOL to Token swap built:", result2.isNativeSOLSwap ? "Native SOL" : "Regular");

  // console.log("🔄 Building Token to SOL swap...");
  // const result3 = await sdk.createSwapTransaction(tokenToSolSwap);
  // console.log("✅ Token to SOL swap built:", result3.isNativeSOLSwap ? "Native SOL" : "Regular");

  console.log("🎉 Universal swap examples completed!");
}

// Example 19: Batch token swaps
export async function batchTokenSwaps() {
  const sdk = createGorbchainSDK();

  const swaps = [
    {
      fromToken: {
        address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        symbol: "USDC",
        decimals: 6,
        name: "USD Coin"
      },
      toToken: {
        address: "So11111111111111111111111111111111111111112",
        symbol: "SOL",
        decimals: 9,
        name: "Solana"
      },
      amount: 25, // 25 USDC
    },
    {
      fromToken: {
        address: "So11111111111111111111111111111111111111112",
        symbol: "SOL",
        decimals: 9,
        name: "Solana"
      },
      toToken: {
        address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        symbol: "USDC",
        decimals: 6,
        name: "USD Coin"
      },
      amount: 0.5, // 0.5 SOL
    },
  ];

  const results = [];
  const senderPrivateKeyBuf = bs58.decode("your sender private key");
  const senderKeypair = Keypair.fromSecretKey(Uint8Array.from(senderPrivateKeyBuf));

  for (const swap of swaps) {
    const swapParams: SwapParams = {
      fromTokenAmount: swap.amount,
      fromToken: swap.fromToken,
      toToken: swap.toToken,
      fromPublicKey: new PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"),
    };

    const result = await sdk.createSwapTransaction(swapParams);
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
    const submitResult = await sdk.submitTransaction(signedTx);
    results.push(submitResult);
  }

  console.log("✅ Batch swaps completed!");
  console.log("Results:", results.map(r => r.signature));
}

// Example 20: Error handling for token swaps
export async function swapTokensWithErrorHandling() {
  const sdk = createGorbchainSDK();

  try {
    // Test with invalid amount
    const invalidSwapParams: SwapParams = {
      fromTokenAmount: -10, // Invalid negative amount
      fromToken: {
        address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        symbol: "USDC",
        decimals: 6,
      },
      toToken: {
        address: "So11111111111111111111111111111111111111112",
        symbol: "SOL",
        decimals: 9,
      },
      fromPublicKey: new PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"),
    };

    await sdk.createSwapTransaction(invalidSwapParams);
  } catch (error: any) {
    console.error("Expected error for invalid amount:", error.message);
  }

  try {
    // Test with invalid token addresses
    const invalidTokenParams: SwapParams = {
      fromTokenAmount: 10,
      fromToken: {
        address: "", // Invalid empty address
        symbol: "USDC",
        decimals: 6,
      },
      toToken: {
        address: "So11111111111111111111111111111111111111112",
        symbol: "SOL",
        decimals: 9,
      },
      fromPublicKey: new PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"),
    };

    await sdk.createSwapTransaction(invalidTokenParams);
  } catch (error: any) {
    console.error("Expected error for invalid token address:", error.message);
  }

  console.log("✅ Error handling tests completed!");
}

// uncomment the function you want to run
// createTokenOnGorbchain();
// createNFTOnGorbchain();
// transferSOLSingleSigner();
// transferSOLDualSigner();
// transferSOLWithWallet(wallet);
// transferSOLWithWalletAndAdmin(wallet);
// batchNativeTransfers();
// transferSOLWithErrorHandling();
// swapTokensSingleSigner();
// swapTokensDualSigner();
// swapTokensWithWallet(wallet);
// swapTokensWithWalletAndAdmin(wallet);
universalSwapExample();
// batchTokenSwaps();
// swapTokensWithErrorHandling();