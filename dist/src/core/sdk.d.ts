import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { BlockchainConfig, CreateTokenParams, CreateNFTParams, TransactionResult, TransferSOLParams, TransferTransactionResult, SwapParams, SwapTransactionResult, CreatePoolParams, CreatePoolTransactionResult, Wallet, SDKConfig } from "../types";
/**
 * Main SDK class for Solana-based blockchain operations
 */
export declare class SolanaSDK {
    private connection;
    private config;
    constructor(config: SDKConfig);
    /**
     * Creates a token creation transaction
     * @param params - Token creation parameters
     * @param payer - The public key that will pay for the transaction
     * @returns Transaction result with raw transaction
     */
    createTokenTransaction(params: CreateTokenParams, payer: PublicKey): Promise<TransactionResult>;
    /**
     * Creates an NFT minting transaction
     * @param params - NFT creation parameters
     * @param payer - The public key that will pay for the transaction
     * @returns Transaction result with raw transaction
     */
    createNFTTransaction(params: CreateNFTParams, payer: PublicKey): Promise<TransactionResult>;
    /**
     * Creates a native SOL transfer transaction
     * @param params - Transfer parameters
     * @returns Transfer transaction result
     */
    createNativeTransferTransaction(params: TransferSOLParams): Promise<TransferTransactionResult>;
    /**
     * Creates a universal swap transaction
     * @param params - Swap parameters
     * @returns Swap transaction result
     */
    createSwapTransaction(params: SwapParams): Promise<SwapTransactionResult>;
    /**
     * Creates a pool creation transaction
     * @param params - Pool creation parameters
     * @returns Pool creation transaction result
     */
    createPoolTransaction(params: CreatePoolParams): Promise<CreatePoolTransactionResult>;
    /**
     * Signs a transaction with a keypair
     * @param transaction - Transaction to sign
     * @param keypair - Keypair to sign with
     * @returns Signed transaction
     */
    signWithKeypair(transaction: Transaction, keypair: Keypair): Promise<Transaction>;
    /**
     * Signs a transaction with wallet adapter
     * @param transaction - Transaction to sign
     * @param wallet - Wallet adapter instance
     * @returns Signed transaction
     */
    signWithWalletAdapter(transaction: Transaction, wallet: Wallet): Promise<Transaction>;
    /**
     * Signs a transaction with both wallet and keypair
     * @param transaction - Transaction to sign
     * @param wallet - Wallet adapter instance
     * @param mintKeypair - Mint keypair for partial signing
     * @returns Signed transaction
     */
    signWithWalletAndKeypair(transaction: Transaction, wallet: Wallet, mintKeypair: Keypair): Promise<Transaction>;
    /**
     * Signs a transaction with dual keypairs (for native transfers)
     * @param transaction - Transaction to sign
     * @param senderKeypair - Sender keypair (always required)
     * @param feePayerKeypair - Fee payer keypair (optional, defaults to sender)
     * @returns Signed transaction
     */
    signWithDualKeypairs(transaction: Transaction, senderKeypair: Keypair, feePayerKeypair?: Keypair): Promise<Transaction>;
    /**
     * Signs a transaction with wallet and optional fee payer keypair (for native transfers)
     * @param transaction - Transaction to sign
     * @param wallet - Wallet adapter instance
     * @param feePayerKeypair - Fee payer keypair (optional)
     * @returns Signed transaction
     */
    signTransferWithWalletAndKeypair(transaction: Transaction, wallet: Wallet, feePayerKeypair?: Keypair): Promise<Transaction>;
    /**
     * Submits a signed transaction
     * @param transaction - Signed transaction
     * @param options - Submission options
     * @returns Submission result
     */
    submitTransaction(transaction: Transaction, options?: any): Promise<any>;
    /**
     * Simulates a transaction
     * @param transaction - Transaction to simulate
     * @returns Simulation result
     */
    simulateTransaction(transaction: Transaction): Promise<any>;
    /**
     * Waits for transaction confirmation
     * @param signature - Transaction signature
     * @param commitment - Commitment level
     * @param timeout - Timeout in milliseconds
     * @returns Confirmation result
     */
    waitForConfirmation(signature: string, commitment?: "processed" | "confirmed" | "finalized", timeout?: number): Promise<any>;
    /**
     * Gets transaction details
     * @param signature - Transaction signature
     * @returns Transaction details
     */
    getTransactionDetails(signature: string): Promise<any>;
    /**
     * Gets the current blockchain configuration
     * @returns Blockchain configuration
     */
    getConfig(): BlockchainConfig;
    /**
     * Gets the connection instance
     * @returns Solana connection
     */
    getConnection(): Connection;
}
/**
 * Creates a new SDK instance
 * @param config - SDK configuration
 * @returns SDK instance
 */
export declare function createSDK(config: SDKConfig): SolanaSDK;
/**
 * Convenience function to create a Gorbchain SDK instance
 * @param rpcUrl - Optional custom RPC URL
 * @returns Gorbchain SDK instance
 */
export declare function createGorbchainSDK(rpcUrl?: string): SolanaSDK;
/**
 * Convenience function to create a Solana SDK instance
 * @param cluster - Solana cluster (mainnet-beta, devnet, testnet)
 * @param rpcUrl - Optional custom RPC URL
 * @returns Solana SDK instance
 */
export declare function createSolanaSDK(cluster?: "mainnet-beta" | "devnet" | "testnet", rpcUrl?: string): SolanaSDK;
//# sourceMappingURL=sdk.d.ts.map