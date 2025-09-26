import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import {
  BlockchainConfig,
  CreateTokenParams,
  CreateNFTParams,
  TransactionResult,
  TransferSOLParams,
  TransferTransactionResult,
  SwapParams,
  SwapTransactionResult,
  Wallet,
  SDKConfig,
  SDKError,
} from "../types";
import {
  GORBCHAIN_CONFIG,
  SOLANA_MAINNET_CONFIG,
  SOLANA_DEVNET_CONFIG,
} from "../constants";
import {
  createTokenTransaction,
  createNFTTransaction,
  createNativeTransferTransaction,
  createSwapTransaction,
} from "../builders";
import {
  signWithKeypair,
  signWithWalletAdapter,
  signWithWalletAndKeypair,
  signWithDualKeypairs,
  signTransferWithWalletAndKeypair,
  validateWallet,
  validateKeypair,
} from "../signing";
import {
  submitTransaction,
  simulateTransaction,
  waitForConfirmation,
  getTransactionDetails,
} from "../submission";

/**
 * Main SDK class for Solana-based blockchain operations
 */
export class SolanaSDK {
  private connection: Connection;
  private config: BlockchainConfig;

  constructor(config: SDKConfig) {
    this.config = config.blockchain;
    this.connection = config.connection || new Connection(
      this.config.rpcUrl,
      {
        commitment: this.config.commitment || "confirmed",
        ...(this.config.wsUrl && { wsEndpoint: this.config.wsUrl }),
      }
    );
  }

  /**
   * Creates a token creation transaction
   * @param params - Token creation parameters
   * @param payer - The public key that will pay for the transaction
   * @returns Transaction result with raw transaction
   */
  async createTokenTransaction(params: CreateTokenParams, payer: PublicKey): Promise<TransactionResult> {
    return createTokenTransaction(this.connection, this.config, params, payer);
  }

  /**
   * Creates an NFT minting transaction
   * @param params - NFT creation parameters
   * @param payer - The public key that will pay for the transaction
   * @returns Transaction result with raw transaction
   */
  async createNFTTransaction(params: CreateNFTParams, payer: PublicKey): Promise<TransactionResult> {
    return createNFTTransaction(this.connection, this.config, params, payer);
  }

  /**
   * Creates a native SOL transfer transaction
   * @param params - Transfer parameters
   * @returns Transfer transaction result
   */
  async createNativeTransferTransaction(params: TransferSOLParams): Promise<TransferTransactionResult> {
    return createNativeTransferTransaction(this.connection, this.config, params);
  }

  /**
   * Creates a universal swap transaction
   * @param params - Swap parameters
   * @returns Swap transaction result
   */
  async createSwapTransaction(params: SwapParams): Promise<SwapTransactionResult> {
    return createSwapTransaction(this.connection, this.config, params);
  }

  /**
   * Signs a transaction with a keypair
   * @param transaction - Transaction to sign
   * @param keypair - Keypair to sign with
   * @returns Signed transaction
   */
  async signWithKeypair(transaction: Transaction, keypair: Keypair): Promise<Transaction> {
    if (!validateKeypair(keypair)) {
      throw new SDKError("Invalid keypair provided");
    }
    return signWithKeypair(transaction, keypair, this.connection);
  }

  /**
   * Signs a transaction with wallet adapter
   * @param transaction - Transaction to sign
   * @param wallet - Wallet adapter instance
   * @returns Signed transaction
   */
  async signWithWalletAdapter(transaction: Transaction, wallet: Wallet): Promise<Transaction> {
    if (!validateWallet(wallet)) {
      throw new SDKError("Invalid wallet provided");
    }
    return signWithWalletAdapter(transaction, wallet, this.connection);
  }

  /**
   * Signs a transaction with both wallet and keypair
   * @param transaction - Transaction to sign
   * @param wallet - Wallet adapter instance
   * @param mintKeypair - Mint keypair for partial signing
   * @returns Signed transaction
   */
  async signWithWalletAndKeypair(
    transaction: Transaction,
    wallet: Wallet,
    mintKeypair: Keypair
  ): Promise<Transaction> {
    if (!validateWallet(wallet)) {
      throw new SDKError("Invalid wallet provided");
    }
    if (!validateKeypair(mintKeypair)) {
      throw new SDKError("Invalid keypair provided");
    }
    return signWithWalletAndKeypair(transaction, wallet, mintKeypair, this.connection);
  }

  /**
   * Signs a transaction with dual keypairs (for native transfers)
   * @param transaction - Transaction to sign
   * @param senderKeypair - Sender keypair (always required)
   * @param feePayerKeypair - Fee payer keypair (optional, defaults to sender)
   * @returns Signed transaction
   */
  async signWithDualKeypairs(
    transaction: Transaction,
    senderKeypair: Keypair,
    feePayerKeypair?: Keypair
  ): Promise<Transaction> {
    if (!validateKeypair(senderKeypair)) {
      throw new SDKError("Invalid sender keypair provided");
    }
    if (feePayerKeypair && !validateKeypair(feePayerKeypair)) {
      throw new SDKError("Invalid fee payer keypair provided");
    }
    return signWithDualKeypairs(transaction, senderKeypair, this.connection, feePayerKeypair);
  }

  /**
   * Signs a transaction with wallet and optional fee payer keypair (for native transfers)
   * @param transaction - Transaction to sign
   * @param wallet - Wallet adapter instance
   * @param feePayerKeypair - Fee payer keypair (optional)
   * @returns Signed transaction
   */
  async signTransferWithWalletAndKeypair(
    transaction: Transaction,
    wallet: Wallet,
    feePayerKeypair?: Keypair
  ): Promise<Transaction> {
    if (!validateWallet(wallet)) {
      throw new SDKError("Invalid wallet provided");
    }
    if (feePayerKeypair && !validateKeypair(feePayerKeypair)) {
      throw new SDKError("Invalid fee payer keypair provided");
    }
    return signTransferWithWalletAndKeypair(transaction, wallet, this.connection, feePayerKeypair);
  }

  /**
   * Submits a signed transaction
   * @param transaction - Signed transaction
   * @param options - Submission options
   * @returns Submission result
   */
  async submitTransaction(transaction: Transaction, options?: any): Promise<any> {
    return submitTransaction(this.connection, transaction, options);
  }

  /**
   * Simulates a transaction
   * @param transaction - Transaction to simulate
   * @returns Simulation result
   */
  async simulateTransaction(transaction: Transaction): Promise<any> {
    return simulateTransaction(this.connection, transaction);
  }

  /**
   * Waits for transaction confirmation
   * @param signature - Transaction signature
   * @param commitment - Commitment level
   * @param timeout - Timeout in milliseconds
   * @returns Confirmation result
   */
  async waitForConfirmation(
    signature: string,
    commitment: "processed" | "confirmed" | "finalized" = "confirmed",
    timeout: number = 30000
  ): Promise<any> {
    return waitForConfirmation(this.connection, signature, commitment, timeout);
  }

  /**
   * Gets transaction details
   * @param signature - Transaction signature
   * @returns Transaction details
   */
  async getTransactionDetails(signature: string): Promise<any> {
    return getTransactionDetails(this.connection, signature);
  }


  /**
   * Gets the current blockchain configuration
   * @returns Blockchain configuration
   */
  getConfig(): BlockchainConfig {
    return this.config;
  }

  /**
   * Gets the connection instance
   * @returns Solana connection
   */
  getConnection(): Connection {
    return this.connection;
  }
}

/**
 * Creates a new SDK instance
 * @param config - SDK configuration
 * @returns SDK instance
 */
export function createSDK(config: SDKConfig): SolanaSDK {
  return new SolanaSDK(config);
}

/**
 * Convenience function to create a Gorbchain SDK instance
 * @param rpcUrl - Optional custom RPC URL
 * @returns Gorbchain SDK instance
 */
export function createGorbchainSDK(rpcUrl?: string): SolanaSDK {
  const config = rpcUrl 
    ? { ...GORBCHAIN_CONFIG, rpcUrl }
    : GORBCHAIN_CONFIG;
  
  return new SolanaSDK({ blockchain: config });
}

/**
 * Convenience function to create a Solana SDK instance
 * @param cluster - Solana cluster (mainnet-beta, devnet, testnet)
 * @param rpcUrl - Optional custom RPC URL
 * @returns Solana SDK instance
 */
export function createSolanaSDK(
  cluster: "mainnet-beta" | "devnet" | "testnet" = "mainnet-beta",
  rpcUrl?: string
): SolanaSDK {
  const config = rpcUrl
    ? { ...SOLANA_MAINNET_CONFIG, rpcUrl }
    : cluster === "devnet" 
      ? SOLANA_DEVNET_CONFIG
      : SOLANA_MAINNET_CONFIG;
  
  return new SolanaSDK({ blockchain: config });
}
