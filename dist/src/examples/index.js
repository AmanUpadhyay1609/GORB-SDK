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
// uncomment the function you want to run
// createTokenOnGorbchain();
// createNFTOnGorbchain();
// transferSOLSingleSigner();
// transferSOLDualSigner();
// transferSOLWithWallet(wallet);
// transferSOLWithWalletAndAdmin(wallet);
// batchNativeTransfers();
// transferSOLWithErrorHandling();
//# sourceMappingURL=index.js.map