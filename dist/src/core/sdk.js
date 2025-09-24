"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaSDK = void 0;
exports.createSDK = createSDK;
exports.createGorbchainSDK = createGorbchainSDK;
exports.createSolanaSDK = createSolanaSDK;
const web3_js_1 = require("@solana/web3.js");
const types_1 = require("../types");
const constants_1 = require("../constants");
const builders_1 = require("../builders");
const signing_1 = require("../signing");
const submission_1 = require("../submission");
/**
 * Main SDK class for Solana-based blockchain operations
 */
class SolanaSDK {
    constructor(config) {
        this.config = config.blockchain;
        this.connection = config.connection || new web3_js_1.Connection(this.config.rpcUrl, {
            commitment: this.config.commitment || "confirmed",
            ...(this.config.wsUrl && { wsEndpoint: this.config.wsUrl }),
        });
    }
    /**
     * Creates a token creation transaction
     * @param params - Token creation parameters
     * @param payer - The public key that will pay for the transaction
     * @returns Transaction result with raw transaction
     */
    async createTokenTransaction(params, payer) {
        return (0, builders_1.createTokenTransaction)(this.connection, this.config, params, payer);
    }
    /**
     * Creates an NFT minting transaction
     * @param params - NFT creation parameters
     * @param payer - The public key that will pay for the transaction
     * @returns Transaction result with raw transaction
     */
    async createNFTTransaction(params, payer) {
        return (0, builders_1.createNFTTransaction)(this.connection, this.config, params, payer);
    }
    /**
     * Creates a native SOL transfer transaction
     * @param params - Transfer parameters
     * @returns Transfer transaction result
     */
    async createNativeTransferTransaction(params) {
        return (0, builders_1.createNativeTransferTransaction)(this.connection, this.config, params);
    }
    /**
     * Signs a transaction with a keypair
     * @param transaction - Transaction to sign
     * @param keypair - Keypair to sign with
     * @returns Signed transaction
     */
    async signWithKeypair(transaction, keypair) {
        if (!(0, signing_1.validateKeypair)(keypair)) {
            throw new types_1.SDKError("Invalid keypair provided");
        }
        return (0, signing_1.signWithKeypair)(transaction, keypair);
    }
    /**
     * Signs a transaction with wallet adapter
     * @param transaction - Transaction to sign
     * @param wallet - Wallet adapter instance
     * @returns Signed transaction
     */
    async signWithWalletAdapter(transaction, wallet) {
        if (!(0, signing_1.validateWallet)(wallet)) {
            throw new types_1.SDKError("Invalid wallet provided");
        }
        return (0, signing_1.signWithWalletAdapter)(transaction, wallet);
    }
    /**
     * Signs a transaction with both wallet and keypair
     * @param transaction - Transaction to sign
     * @param wallet - Wallet adapter instance
     * @param mintKeypair - Mint keypair for partial signing
     * @returns Signed transaction
     */
    async signWithWalletAndKeypair(transaction, wallet, mintKeypair) {
        if (!(0, signing_1.validateWallet)(wallet)) {
            throw new types_1.SDKError("Invalid wallet provided");
        }
        if (!(0, signing_1.validateKeypair)(mintKeypair)) {
            throw new types_1.SDKError("Invalid keypair provided");
        }
        return (0, signing_1.signWithWalletAndKeypair)(transaction, wallet, mintKeypair);
    }
    /**
     * Signs a transaction with dual keypairs (for native transfers)
     * @param transaction - Transaction to sign
     * @param senderKeypair - Sender keypair (always required)
     * @param feePayerKeypair - Fee payer keypair (optional, defaults to sender)
     * @returns Signed transaction
     */
    async signWithDualKeypairs(transaction, senderKeypair, feePayerKeypair) {
        if (!(0, signing_1.validateKeypair)(senderKeypair)) {
            throw new types_1.SDKError("Invalid sender keypair provided");
        }
        if (feePayerKeypair && !(0, signing_1.validateKeypair)(feePayerKeypair)) {
            throw new types_1.SDKError("Invalid fee payer keypair provided");
        }
        return (0, signing_1.signWithDualKeypairs)(transaction, senderKeypair, feePayerKeypair);
    }
    /**
     * Signs a transaction with wallet and optional fee payer keypair (for native transfers)
     * @param transaction - Transaction to sign
     * @param wallet - Wallet adapter instance
     * @param feePayerKeypair - Fee payer keypair (optional)
     * @returns Signed transaction
     */
    async signTransferWithWalletAndKeypair(transaction, wallet, feePayerKeypair) {
        if (!(0, signing_1.validateWallet)(wallet)) {
            throw new types_1.SDKError("Invalid wallet provided");
        }
        if (feePayerKeypair && !(0, signing_1.validateKeypair)(feePayerKeypair)) {
            throw new types_1.SDKError("Invalid fee payer keypair provided");
        }
        return (0, signing_1.signTransferWithWalletAndKeypair)(transaction, wallet, feePayerKeypair);
    }
    /**
     * Submits a signed transaction
     * @param transaction - Signed transaction
     * @param options - Submission options
     * @returns Submission result
     */
    async submitTransaction(transaction, options) {
        return (0, submission_1.submitTransaction)(this.connection, transaction, options);
    }
    /**
     * Simulates a transaction
     * @param transaction - Transaction to simulate
     * @returns Simulation result
     */
    async simulateTransaction(transaction) {
        return (0, submission_1.simulateTransaction)(this.connection, transaction);
    }
    /**
     * Waits for transaction confirmation
     * @param signature - Transaction signature
     * @param commitment - Commitment level
     * @param timeout - Timeout in milliseconds
     * @returns Confirmation result
     */
    async waitForConfirmation(signature, commitment = "confirmed", timeout = 30000) {
        return (0, submission_1.waitForConfirmation)(this.connection, signature, commitment, timeout);
    }
    /**
     * Gets transaction details
     * @param signature - Transaction signature
     * @returns Transaction details
     */
    async getTransactionDetails(signature) {
        return (0, submission_1.getTransactionDetails)(this.connection, signature);
    }
    /**
     * Gets the current blockchain configuration
     * @returns Blockchain configuration
     */
    getConfig() {
        return this.config;
    }
    /**
     * Gets the connection instance
     * @returns Solana connection
     */
    getConnection() {
        return this.connection;
    }
}
exports.SolanaSDK = SolanaSDK;
/**
 * Creates a new SDK instance
 * @param config - SDK configuration
 * @returns SDK instance
 */
function createSDK(config) {
    return new SolanaSDK(config);
}
/**
 * Convenience function to create a Gorbchain SDK instance
 * @param rpcUrl - Optional custom RPC URL
 * @returns Gorbchain SDK instance
 */
function createGorbchainSDK(rpcUrl) {
    const config = rpcUrl
        ? { ...constants_1.GORBCHAIN_CONFIG, rpcUrl }
        : constants_1.GORBCHAIN_CONFIG;
    return new SolanaSDK({ blockchain: config });
}
/**
 * Convenience function to create a Solana SDK instance
 * @param cluster - Solana cluster (mainnet-beta, devnet, testnet)
 * @param rpcUrl - Optional custom RPC URL
 * @returns Solana SDK instance
 */
function createSolanaSDK(cluster = "mainnet-beta", rpcUrl) {
    const config = rpcUrl
        ? { ...constants_1.SOLANA_MAINNET_CONFIG, rpcUrl }
        : cluster === "devnet"
            ? constants_1.SOLANA_DEVNET_CONFIG
            : constants_1.SOLANA_MAINNET_CONFIG;
    return new SolanaSDK({ blockchain: config });
}
//# sourceMappingURL=sdk.js.map