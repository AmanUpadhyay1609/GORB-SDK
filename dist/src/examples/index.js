"use strict";
/**
 * Example usage of the Solana SDK
 * This file demonstrates how to use the SDK for different scenarios
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokenOnGorbchain = createTokenOnGorbchain;
exports.createNFTOnGorbchain = createNFTOnGorbchain;
exports.createTokenOnCustomBlockchain = createTokenOnCustomBlockchain;
exports.completeTokenCreationWithWallet = completeTokenCreationWithWallet;
exports.createMultipleTokens = createMultipleTokens;
exports.createTokenWithErrorHandling = createTokenWithErrorHandling;
exports.demonstrateGORBObject = demonstrateGORBObject;
exports.transferSOLSingleSigner = transferSOLSingleSigner;
exports.transferSOLDualSigner = transferSOLDualSigner;
exports.transferSOLWithWallet = transferSOLWithWallet;
exports.transferSOLWithWalletAndAdmin = transferSOLWithWalletAndAdmin;
exports.batchNativeTransfers = batchNativeTransfers;
exports.transferSOLWithErrorHandling = transferSOLWithErrorHandling;
exports.swapTokensSingleSigner = swapTokensSingleSigner;
exports.swapTokensDualSigner = swapTokensDualSigner;
exports.swapTokensWithWallet = swapTokensWithWallet;
exports.swapTokensWithWalletAndAdmin = swapTokensWithWalletAndAdmin;
exports.universalSwapExample = universalSwapExample;
exports.batchTokenSwaps = batchTokenSwaps;
exports.swapTokensWithErrorHandling = swapTokensWithErrorHandling;
exports.createPoolSingleSigner = createPoolSingleSigner;
exports.createPoolDualSigner = createPoolDualSigner;
exports.createPoolWithWallet = createPoolWithWallet;
exports.createPoolWithWalletAndAdmin = createPoolWithWalletAndAdmin;
exports.universalPoolCreationExample = universalPoolCreationExample;
exports.batchPoolCreations = batchPoolCreations;
exports.createPoolWithErrorHandling = createPoolWithErrorHandling;
const core_1 = require("../core");
const bs58_1 = __importDefault(require("bs58"));
// Example 1: Using Gorbchain SDK
async function createTokenOnGorbchain() {
    // Create SDK instance for Gorbchain
    const sdk = (0, core_1.createGorbchainSDK)();
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
    const payer = new core_1.PublicKey("your public key");
    const result = await sdk.createTokenTransaction(tokenParams, payer);
    console.log("✅ Token created successfully!");
    console.log("📍 Token address:", result.mintAddress.toBase58());
    console.log("📍 Associated token address:", result.associatedTokenAddress?.toBase58() || "N/A");
    console.log("📦 Instructions count:", result.instructions.length);
    console.log("🔧 Instructions include: Create mint, Initialize metadata, Create ATA, Mint tokens");
    console.log(`the whole result is ${JSON.stringify(result)}`);
    // Sign the complete transaction (only needs to be signed once!)
    const privateKeyBuf = bs58_1.default.decode("your private key");
    const feePayerKeypair = core_1.Keypair.fromSecretKey(Uint8Array.from(privateKeyBuf));
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
async function createNFTOnGorbchain() {
    // Create SDK instance for Solana mainnet
    const sdk = (0, core_1.createGorbchainSDK)();
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
    const payer = new core_1.PublicKey("your public key"); // Example payer
    const result = await sdk.createNFTTransaction(nftParams, payer);
    console.log("NFT address:", result.mintAddress.toBase58());
    // Sign and submit
    const privateKeyBuf = bs58_1.default.decode("your private key");
    const feePayerKeypair = core_1.Keypair.fromSecretKey(Uint8Array.from(privateKeyBuf));
    console.log(`the fee payer keypair is ${JSON.stringify(feePayerKeypair)}`);
    const signedTx = await sdk.signWithKeypair(result.transaction, feePayerKeypair);
    console.log(`the signed tx is ${JSON.stringify(signedTx)}`);
    const submitResult = await sdk.submitTransaction(signedTx);
    console.log("NFT created:", submitResult.signature);
}
// Example 3: Using custom blockchain configuration
async function createTokenOnCustomBlockchain() {
    // Create custom blockchain configuration
    const customConfig = (0, core_1.createBlockchainConfig)("YourTokenProgramId", "YourAssociatedTokenProgramId", "https://your-custom-rpc.com", {
        wsUrl: "wss://your-custom-ws.com",
        commitment: "confirmed",
        name: "custom-chain",
    });
    // Create SDK with custom config
    const sdk = (0, core_1.createSDK)({ blockchain: customConfig });
    // Use the SDK normally
    const tokenParams = {
        name: "Custom Token",
        symbol: "CTK",
        supply: 500000,
        decimals: 9,
        uri: "https://custom-metadata.com/token.json",
    };
    const payer = new core_1.PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"); // Example payer
    const result = await sdk.createTokenTransaction(tokenParams, payer);
    console.log("Custom token address:", result.mintAddress.toBase58());
}
// Example 4: Complete workflow with wallet adapter
async function completeTokenCreationWithWallet(wallet) {
    const sdk = (0, core_1.createGorbchainSDK)();
    // Step 1: Build transaction
    const result = await sdk.createTokenTransaction({
        name: "Wallet Token",
        symbol: "WKT",
        supply: 1000000,
        decimals: 6,
        uri: "https://wallet-metadata.com/token.json",
    }, wallet.publicKey);
    // Step 2: Sign with wallet and mint keypair
    const signedTx = await sdk.signWithWalletAndKeypair(result.transaction, wallet, result.mintKeypair);
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
async function createMultipleTokens() {
    const sdk = (0, core_1.createGorbchainSDK)();
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
    const payer = new core_1.PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"); // Example payer
    for (const token of tokens) {
        const result = await sdk.createTokenTransaction(token, payer);
        results.push(result);
    }
    console.log("Created transactions for", results.length, "tokens");
    return results;
}
// Example 6: Error handling
async function createTokenWithErrorHandling() {
    const sdk = (0, core_1.createGorbchainSDK)();
    try {
        const payer = new core_1.PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"); // Example payer
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
    }
    catch (error) {
        console.error("Error creating token:", error.message);
        // Handle specific error types
        if (error.name === "SDKError") {
            console.error("SDK Error:", error.message);
        }
        else if (error.name === "TransactionError") {
            console.error("Transaction Error:", error.message);
        }
        else if (error.name === "SigningError") {
            console.error("Signing Error:", error.message);
        }
    }
}
// Example 7: Using the GORB object for backward compatibility
function demonstrateGORBObject() {
    // Access Gorbchain constants
    console.log("Token22 Program:", core_1.GORB.TOKEN22_PROGRAM.toBase58());
    console.log("Associated Token Program:", core_1.GORB.ASSOCIATED_TOKEN_PROGRAM.toBase58());
    console.log("System Program:", core_1.GORB.SYSTEM_PROGRAM.toBase58());
    console.log("RPC URL:", core_1.GORB.CONFIG.rpcUrl);
    // Use in custom configurations
    // const customConfig = createBlockchainConfig(
    //   GORB.TOKEN22_PROGRAM.toBase58(),
    //   GORB.ASSOCIATED_TOKEN_PROGRAM.toBase58(),
    //   "https://custom-rpc.com"
    // );
}
// Example 8: Native SOL Transfer with single signer (sender pays fees)
async function transferSOLSingleSigner() {
    const sdk = (0, core_1.createGorbchainSDK)();
    // Transfer parameters
    const transferParams = {
        fromPublicKey: new core_1.PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"), // Sender
        toPublicKey: new core_1.PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"), // Recipient
        amountInSOL: 0.1, // 0.1 SOL
        // feePayerPublicKey not provided, so sender will pay fees
    };
    // Build the transaction
    const result = await sdk.createNativeTransferTransaction(transferParams);
    console.log("✅ Transfer transaction created successfully!");
    console.log("📍 From:", result.fromPublicKey.toBase58());
    console.log("📍 To:", result.toPublicKey.toBase58());
    console.log("💰 Amount:", result.amountInLamports / 1000000000, "SOL");
    console.log("💳 Fee Payer:", result.feePayerPublicKey.toBase58());
    console.log("📦 Instructions count:", result.instructions.length);
    // Sign with sender keypair (since sender is also fee payer)
    const privateKeyBuf = bs58_1.default.decode("your sender private key");
    const senderKeypair = core_1.Keypair.fromSecretKey(Uint8Array.from(privateKeyBuf));
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
    console.log("✅ Transaction signed successfully!");
    // Submit the transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    console.log("Transaction signature:", submitResult.signature);
}
// Example 9: Native SOL Transfer with dual signers (admin pays fees)
async function transferSOLDualSigner() {
    const sdk = (0, core_1.createGorbchainSDK)();
    // Transfer parameters with separate fee payer
    const transferParams = {
        fromPublicKey: new core_1.PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"), // Sender
        toPublicKey: new core_1.PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"), // Recipient
        amountInSOL: 0.5, // 0.5 SOL
        feePayerPublicKey: new core_1.PublicKey("AdminPublicKeyHere"), // Admin pays fees
    };
    // Build the transaction
    const result = await sdk.createNativeTransferTransaction(transferParams);
    console.log("✅ Transfer transaction created successfully!");
    console.log("📍 From:", result.fromPublicKey.toBase58());
    console.log("📍 To:", result.toPublicKey.toBase58());
    console.log("💰 Amount:", result.amountInLamports / 1000000000, "SOL");
    console.log("💳 Fee Payer:", result.feePayerPublicKey.toBase58());
    // Sign with both sender and fee payer keypairs
    const senderPrivateKeyBuf = bs58_1.default.decode("your sender private key");
    const senderKeypair = core_1.Keypair.fromSecretKey(Uint8Array.from(senderPrivateKeyBuf));
    const feePayerPrivateKeyBuf = bs58_1.default.decode("your admin private key");
    const feePayerKeypair = core_1.Keypair.fromSecretKey(Uint8Array.from(feePayerPrivateKeyBuf));
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair, feePayerKeypair);
    console.log("✅ Transaction signed with dual signers!");
    // Submit the transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    console.log("Transaction signature:", submitResult.signature);
}
// Example 10: Native SOL Transfer with wallet adapter
async function transferSOLWithWallet(wallet) {
    const sdk = (0, core_1.createGorbchainSDK)();
    // Transfer parameters
    const transferParams = {
        fromPublicKey: wallet.publicKey, // Wallet is the sender
        toPublicKey: new core_1.PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"), // Recipient
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
async function transferSOLWithWalletAndAdmin(wallet) {
    const sdk = (0, core_1.createGorbchainSDK)();
    // Transfer parameters with admin as fee payer
    const transferParams = {
        fromPublicKey: wallet.publicKey, // Wallet is the sender
        toPublicKey: new core_1.PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"), // Recipient
        amountInSOL: 1.0, // 1.0 SOL
        feePayerPublicKey: new core_1.PublicKey("AdminPublicKeyHere"), // Admin pays fees
    };
    // Build the transaction
    const result = await sdk.createNativeTransferTransaction(transferParams);
    console.log("✅ Transfer transaction created successfully!");
    // Admin keypair for fee payment
    const adminPrivateKeyBuf = bs58_1.default.decode("your admin private key");
    const adminKeypair = core_1.Keypair.fromSecretKey(Uint8Array.from(adminPrivateKeyBuf));
    // Sign with wallet and admin keypair
    const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet, adminKeypair);
    console.log("✅ Transaction signed with wallet and admin!");
    // Submit the transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    console.log("Transaction signature:", submitResult.signature);
}
// Example 12: Batch native transfers
async function batchNativeTransfers() {
    const sdk = (0, core_1.createGorbchainSDK)();
    const transfers = [
        {
            fromPublicKey: new core_1.PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"),
            toPublicKey: new core_1.PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"),
            amountInSOL: 0.1,
        },
        {
            fromPublicKey: new core_1.PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"),
            toPublicKey: new core_1.PublicKey("AnotherRecipientPublicKey"),
            amountInSOL: 0.2,
        },
        {
            fromPublicKey: new core_1.PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"),
            toPublicKey: new core_1.PublicKey("ThirdRecipientPublicKey"),
            amountInSOL: 0.3,
        },
    ];
    const results = [];
    const senderPrivateKeyBuf = bs58_1.default.decode("your sender private key");
    const senderKeypair = core_1.Keypair.fromSecretKey(Uint8Array.from(senderPrivateKeyBuf));
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
async function transferSOLWithErrorHandling() {
    const sdk = (0, core_1.createGorbchainSDK)();
    try {
        // Test with invalid amount
        const invalidTransferParams = {
            fromPublicKey: new core_1.PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"),
            toPublicKey: new core_1.PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"),
            amountInSOL: -0.1, // Invalid negative amount
        };
        await sdk.createNativeTransferTransaction(invalidTransferParams);
    }
    catch (error) {
        console.error("Expected error for invalid amount:", error.message);
    }
    try {
        // Test with zero amount
        const zeroTransferParams = {
            fromPublicKey: new core_1.PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"),
            toPublicKey: new core_1.PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"),
            amountInSOL: 0, // Invalid zero amount
        };
        await sdk.createNativeTransferTransaction(zeroTransferParams);
    }
    catch (error) {
        console.error("Expected error for zero amount:", error.message);
    }
    console.log("✅ Error handling tests completed!");
}
// Example 14: Token Swap with single signer (sender pays fees)
async function swapTokensSingleSigner() {
    const sdk = (0, core_1.createGorbchainSDK)();
    // Token information
    const fromToken = {
        address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
        symbol: "USDC",
        decimals: 6,
        name: "USD Coin"
    };
    const toToken = {
        address: "So11111111111111111111111111111111111111112", // SOL
        symbol: "SOL",
        decimals: 9,
        name: "Solana"
    };
    // Swap parameters
    const swapParams = {
        fromTokenAmount: 100, // 100 USDC
        fromToken,
        toToken,
        fromPublicKey: new core_1.PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"), // Sender
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
    const privateKeyBuf = bs58_1.default.decode("your sender private key");
    const senderKeypair = core_1.Keypair.fromSecretKey(Uint8Array.from(privateKeyBuf));
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
    console.log("✅ Transaction signed successfully!");
    // Submit the transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    console.log("Swap signature:", submitResult.signature);
}
// Example 15: Token Swap with dual signers (admin pays fees)
async function swapTokensDualSigner() {
    const sdk = (0, core_1.createGorbchainSDK)();
    // Token information
    const fromToken = {
        address: "So11111111111111111111111111111111111111112", // SOL
        symbol: "SOL",
        decimals: 9,
        name: "Solana"
    };
    const toToken = {
        address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
        symbol: "USDC",
        decimals: 6,
        name: "USD Coin"
    };
    // Swap parameters with separate fee payer
    const swapParams = {
        fromTokenAmount: 1.5, // 1.5 SOL
        fromToken,
        toToken,
        fromPublicKey: new core_1.PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"), // Sender
        feePayerPublicKey: new core_1.PublicKey("AdminPublicKeyHere"), // Admin pays fees
        slippageTolerance: 1.0, // 1% slippage
    };
    // Build the transaction
    const result = await sdk.createSwapTransaction(swapParams);
    console.log("✅ Swap transaction created successfully!");
    // Sign with both sender and fee payer keypairs
    const senderPrivateKeyBuf = bs58_1.default.decode("your sender private key");
    const senderKeypair = core_1.Keypair.fromSecretKey(Uint8Array.from(senderPrivateKeyBuf));
    const feePayerPrivateKeyBuf = bs58_1.default.decode("your admin private key");
    const feePayerKeypair = core_1.Keypair.fromSecretKey(Uint8Array.from(feePayerPrivateKeyBuf));
    const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair, feePayerKeypair);
    console.log("✅ Transaction signed with dual signers!");
    // Submit the transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    console.log("Swap signature:", submitResult.signature);
}
// Example 16: Token Swap with wallet adapter
async function swapTokensWithWallet(wallet) {
    const sdk = (0, core_1.createGorbchainSDK)();
    // Token information
    const fromToken = {
        address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
        symbol: "USDC",
        decimals: 6,
        name: "USD Coin"
    };
    const toToken = {
        address: "So11111111111111111111111111111111111111112", // SOL
        symbol: "SOL",
        decimals: 9,
        name: "Solana"
    };
    // Swap parameters
    const swapParams = {
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
async function swapTokensWithWalletAndAdmin(wallet) {
    const sdk = (0, core_1.createGorbchainSDK)();
    // Token information
    const fromToken = {
        address: "So11111111111111111111111111111111111111112", // SOL
        symbol: "SOL",
        decimals: 9,
        name: "Solana"
    };
    const toToken = {
        address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
        symbol: "USDC",
        decimals: 6,
        name: "USD Coin"
    };
    // Swap parameters with admin as fee payer
    const swapParams = {
        fromTokenAmount: 2.0, // 2.0 SOL
        fromToken,
        toToken,
        fromPublicKey: wallet.publicKey, // Wallet is the sender
        feePayerPublicKey: new core_1.PublicKey("AdminPublicKeyHere"), // Admin pays fees
        slippageTolerance: 0.8, // 0.8% slippage
    };
    // Build the transaction
    const result = await sdk.createSwapTransaction(swapParams);
    console.log("✅ Swap transaction created successfully!");
    // Admin keypair for fee payment
    const adminPrivateKeyBuf = bs58_1.default.decode("your admin private key");
    const adminKeypair = core_1.Keypair.fromSecretKey(Uint8Array.from(adminPrivateKeyBuf));
    // Sign with wallet and admin keypair
    const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet, adminKeypair);
    console.log("✅ Transaction signed with wallet and admin!");
    // Submit the transaction
    const submitResult = await sdk.submitTransaction(signedTx);
    console.log("Swap signature:", submitResult.signature);
}
// Example 18: Universal Swap (automatically detects SOL involvement)
async function universalSwapExample() {
    const sdk = (0, core_1.createGorbchainSDK)();
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
    const solToTokenSwap = {
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
        fromPublicKey: new core_1.PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
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
    // Method 1: Single signer (sender pays fees)
    const senderPrivateKeyBuf = bs58_1.default.decode("2N4eeFtjsy7XyUG44F3z5Ci4wbEmUujpQ5dMnWDJNruePK6mer8Te57xCLpGVqwWqvy9FLpGTx8tfUfAasV8NEVq");
    const senderKeypair = core_1.Keypair.fromSecretKey(Uint8Array.from(senderPrivateKeyBuf));
    const signedTx = await sdk.signWithKeypair(result2.transaction, senderKeypair);
    console.log("✅ Transaction signed successfully!-->", signedTx);
    const submitResult = await sdk.submitTransaction(signedTx);
    console.log("✅ Transaction submitted successfully!-->", submitResult);
    console.log("🎉 Universal swap examples completed!");
}
// Example 19: Batch token swaps
async function batchTokenSwaps() {
    const sdk = (0, core_1.createGorbchainSDK)();
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
    const senderPrivateKeyBuf = bs58_1.default.decode("your sender private key");
    const senderKeypair = core_1.Keypair.fromSecretKey(Uint8Array.from(senderPrivateKeyBuf));
    for (const swap of swaps) {
        const swapParams = {
            fromTokenAmount: swap.amount,
            fromToken: swap.fromToken,
            toToken: swap.toToken,
            fromPublicKey: new core_1.PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"),
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
async function swapTokensWithErrorHandling() {
    const sdk = (0, core_1.createGorbchainSDK)();
    try {
        // Test with invalid amount
        const invalidSwapParams = {
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
            fromPublicKey: new core_1.PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"),
        };
        await sdk.createSwapTransaction(invalidSwapParams);
    }
    catch (error) {
        console.error("Expected error for invalid amount:", error.message);
    }
    try {
        // Test with invalid token addresses
        const invalidTokenParams = {
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
            fromPublicKey: new core_1.PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"),
        };
        await sdk.createSwapTransaction(invalidTokenParams);
    }
    catch (error) {
        console.error("Expected error for invalid token address:", error.message);
    }
    console.log("✅ Error handling tests completed!");
}
// ============================================================================
// POOL CREATION EXAMPLES
// ============================================================================
// Example 20: Create pool with single signer (sender pays fees)
async function createPoolSingleSigner() {
    const sdk = (0, core_1.createGorbchainSDK)();
    const poolParams = {
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
        fromPublicKey: new core_1.PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
        // feePayerPublicKey not provided - sender pays fees
    };
    try {
        // Build transaction
        const result = await sdk.createPoolTransaction(poolParams);
        console.log("✅ Pool transaction created");
        console.log("📝 Pool details:", {
            poolPDA: result.poolPDA.toBase58(),
            tokenA: result.tokenA.toBase58(),
            tokenB: result.tokenB.toBase58(),
            lpMint: result.lpMintPDA.toBase58(),
            isNativeSOLPool: result.isNativeSOLPool,
        });
        // Sign transaction (adds fresh blockhash)
        const senderKeypair = core_1.Keypair.generate(); // Replace with your actual keypair
        const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
        console.log("✅ Pool transaction signed");
        console.log("📝 Transaction after signing:");
        console.log("  - recentBlockhash:", signedTx.recentBlockhash);
        console.log("  - lastValidBlockHeight:", signedTx.lastValidBlockHeight);
        console.log("  - signatures count:", signedTx.signatures.length);
        // Submit transaction
        const submitResult = await sdk.submitTransaction(signedTx);
        if (submitResult.success) {
            console.log("✅ Pool created successfully:", submitResult.signature);
        }
        else {
            console.error("❌ Pool creation failed:", submitResult.error);
        }
    }
    catch (error) {
        console.error("❌ Error:", error.message);
    }
}
// Example 21: Create pool with dual signer (admin pays fees)
async function createPoolDualSigner() {
    const sdk = (0, core_1.createGorbchainSDK)();
    const poolParams = {
        tokenA: {
            address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
            symbol: "USDC",
            decimals: 6,
            name: "USD Coin"
        },
        tokenB: {
            address: "4eCdoBMvbUSYZBfvXwqTd7eg9fzzWzQAd54xYFoB8eKf", // Custom token
            symbol: "YH!@",
            decimals: 7,
            name: "YH1"
        },
        amountA: 50, // 50 USDC
        amountB: 1000, // 1000 YH!@
        fromPublicKey: new core_1.PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
        feePayerPublicKey: new core_1.PublicKey("AdminPublicKey"), // Admin pays fees
    };
    try {
        // Build transaction
        const result = await sdk.createPoolTransaction(poolParams);
        console.log("✅ Pool transaction created");
        // Sign transaction with dual signers
        const senderKeypair = core_1.Keypair.generate(); // Replace with your actual keypair
        const adminKeypair = core_1.Keypair.generate(); // Replace with your actual admin keypair
        const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair, adminKeypair);
        console.log("✅ Pool transaction signed with dual signers");
        // Submit transaction
        const submitResult = await sdk.submitTransaction(signedTx);
        if (submitResult.success) {
            console.log("✅ Pool created successfully:", submitResult.signature);
        }
        else {
            console.error("❌ Pool creation failed:", submitResult.error);
        }
    }
    catch (error) {
        console.error("❌ Error:", error.message);
    }
}
// Example 22: Create pool with wallet adapter
async function createPoolWithWallet(wallet) {
    const sdk = (0, core_1.createGorbchainSDK)();
    const poolParams = {
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
        // Build transaction
        const result = await sdk.createPoolTransaction(poolParams);
        console.log("✅ Pool transaction created");
        // Sign transaction with wallet
        const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet);
        console.log("✅ Pool transaction signed with wallet");
        // Simulate before submitting
        const simulation = await sdk.simulateTransaction(signedTx);
        if (!simulation.success) {
            throw new Error(`Simulation failed: ${simulation.error}`);
        }
        // Submit transaction
        const submitResult = await sdk.submitTransaction(signedTx);
        if (submitResult.success) {
            console.log("✅ Pool created successfully:", submitResult.signature);
        }
        else {
            console.error("❌ Pool creation failed:", submitResult.error);
        }
    }
    catch (error) {
        console.error("❌ Error:", error.message);
    }
}
// Example 23: Create pool with wallet and admin fee payer
async function createPoolWithWalletAndAdmin(wallet) {
    const sdk = (0, core_1.createGorbchainSDK)();
    const poolParams = {
        tokenA: {
            address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
            symbol: "USDC",
            decimals: 6,
            name: "USD Coin"
        },
        tokenB: {
            address: "4eCdoBMvbUSYZBfvXwqTd7eg9fzzWzQAd54xYFoB8eKf", // Custom token
            symbol: "YH!@",
            decimals: 7,
            name: "YH1"
        },
        amountA: 75, // 75 USDC
        amountB: 1500, // 1500 YH!@
        fromPublicKey: wallet.publicKey,
        feePayerPublicKey: new core_1.PublicKey("AdminPublicKey"), // Admin pays fees
    };
    try {
        // Build transaction
        const result = await sdk.createPoolTransaction(poolParams);
        console.log("✅ Pool transaction created");
        // Sign transaction with wallet and admin
        const adminKeypair = core_1.Keypair.generate(); // Replace with your actual admin keypair
        const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet, adminKeypair);
        console.log("✅ Pool transaction signed with wallet and admin");
        // Submit transaction
        const submitResult = await sdk.submitTransaction(signedTx);
        if (submitResult.success) {
            console.log("✅ Pool created successfully:", submitResult.signature);
        }
        else {
            console.error("❌ Pool creation failed:", submitResult.error);
        }
    }
    catch (error) {
        console.error("❌ Error:", error.message);
    }
}
// Example 24: Universal pool creation example
async function universalPoolCreationExample() {
    const sdk = (0, core_1.createGorbchainSDK)();
    // SOL to Token pool
    const solToTokenPool = {
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
        fromPublicKey: new core_1.PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
    };
    console.log("🔄 Building SOL to Token pool...");
    const result = await sdk.createPoolTransaction(solToTokenPool);
    console.log("✅ SOL to Token pool built:", result.isNativeSOLPool ? "Native SOL" : "Regular");
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
// Example 25: Batch pool creations
async function batchPoolCreations() {
    const sdk = (0, core_1.createGorbchainSDK)();
    const pools = [
        {
            tokenA: { address: "So11111111111111111111111111111111111111112", symbol: "SOL", decimals: 9, name: "Solana" },
            tokenB: { address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", symbol: "USDC", decimals: 6, name: "USD Coin" },
            amountA: 1.0,
            amountB: 100,
        },
        {
            tokenA: { address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", symbol: "USDC", decimals: 6, name: "USD Coin" },
            tokenB: { address: "4eCdoBMvbUSYZBfvXwqTd7eg9fzzWzQAd54xYFoB8eKf", symbol: "YH!@", decimals: 7, name: "YH1" },
            amountA: 50,
            amountB: 1000,
        },
    ];
    const results = [];
    for (const pool of pools) {
        const poolParams = {
            ...pool,
            fromPublicKey: new core_1.PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
        };
        const result = await sdk.createPoolTransaction(poolParams);
        const senderKeypair = core_1.Keypair.generate(); // Replace with your actual keypair
        const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);
        const submitResult = await sdk.submitTransaction(signedTx);
        results.push(submitResult);
    }
    console.log("✅ Batch pool creations completed!");
}
// Example 26: Pool creation with error handling
async function createPoolWithErrorHandling() {
    const sdk = (0, core_1.createGorbchainSDK)();
    try {
        // Test with invalid amounts
        const invalidPoolParams = {
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
            fromPublicKey: new core_1.PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
        };
        await sdk.createPoolTransaction(invalidPoolParams);
    }
    catch (error) {
        console.error("Expected error for invalid amounts:", error.message);
    }
    try {
        // Test with invalid token addresses
        const invalidTokenParams = {
            tokenA: {
                address: "", // Invalid empty address
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
            amountA: 1.0,
            amountB: 100,
            fromPublicKey: new core_1.PublicKey("9x5kYbJgJ6WoHQayADmTYGh94SbLdbnecKP8bRr7x9uM"),
        };
        await sdk.createPoolTransaction(invalidTokenParams);
    }
    catch (error) {
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
// Pool creation examples
// createPoolSingleSigner();
// createPoolDualSigner();
// createPoolWithWallet(wallet);
// createPoolWithWalletAndAdmin(wallet);
// universalPoolCreationExample();
// batchPoolCreations();
// createPoolWithErrorHandling();
//# sourceMappingURL=index.js.map