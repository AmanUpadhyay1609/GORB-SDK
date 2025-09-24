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
// uncomment the function you want to run
// createTokenOnGorbchain();
// createNFTOnGorbchain();
//# sourceMappingURL=index.js.map