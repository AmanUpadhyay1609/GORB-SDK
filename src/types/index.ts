import { PublicKey, Keypair, Transaction, Connection, TransactionSignature } from "@solana/web3.js";

// Base configuration for any Solana-based blockchain
export interface BlockchainConfig {
  name?: string;
  tokenProgram: PublicKey;
  associatedTokenProgram: PublicKey;
  systemProgram: PublicKey;
  rpcUrl: string;
  wsUrl?: string;
  commitment?: "processed" | "confirmed" | "finalized";
}

// Gorbchain specific configuration
export interface GorbchainConfig extends BlockchainConfig {
  name: "gorbchain";
  version: string;
}

// Solana mainnet configuration
export interface SolanaConfig extends BlockchainConfig {
  name: "solana";
  cluster: "mainnet-beta" | "devnet" | "testnet";
}

// Generic blockchain configuration
export type AnyBlockchainConfig = GorbchainConfig | SolanaConfig | BlockchainConfig;

// Token creation parameters
export interface CreateTokenParams {
  name: string;
  symbol: string;
  supply: string | number;
  decimals: string | number;
  uri: string;
  freezeAuthority?: PublicKey | null;
  mintKeypair?: Keypair; // Optional, will generate if not provided
}

// NFT creation parameters
export interface CreateNFTParams {
  name: string;
  symbol: string;
  uri: string;
  description: string;
  mintKeypair?: Keypair; // Optional, will generate if not provided
}

// Transaction building result
export interface TransactionResult {
  transaction: Transaction;
  mintKeypair: Keypair;
  mintAddress: PublicKey;
  associatedTokenAddress?: PublicKey;
  instructions: any[];
}

// Native transfer parameters
export interface TransferSOLParams {
  fromPublicKey: PublicKey;
  toPublicKey: PublicKey;
  amountInSOL: number;
  feePayerPublicKey?: PublicKey; // Optional, defaults to fromPublicKey
}

// Native transfer transaction result
export interface TransferTransactionResult {
  transaction: Transaction;
  fromPublicKey: PublicKey;
  toPublicKey: PublicKey;
  amountInLamports: number;
  feePayerPublicKey: PublicKey;
  instructions: any[];
}

// Native transfer result
export interface TransferResult {
  success: boolean;
  signature?: TransactionSignature;
  explorerUrl?: string;
  error?: string;
}

// Token information for swaps
export interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
  name?: string;
}

// Swap parameters
export interface SwapParams {
  fromTokenAmount: number;
  fromToken: TokenInfo;
  toToken: TokenInfo;
  fromPublicKey: PublicKey;
  feePayerPublicKey?: PublicKey; // Optional, defaults to fromPublicKey
  slippageTolerance?: number; // Optional, defaults to 0.5%
}

// Swap transaction result
export interface SwapTransactionResult {
  transaction: Transaction;
  fromToken: TokenInfo;
  toToken: TokenInfo;
  fromTokenAmount: number;
  fromTokenAmountLamports: bigint;
  fromPublicKey: PublicKey;
  feePayerPublicKey: PublicKey;
  poolPDA: PublicKey;
  tokenA: PublicKey;
  tokenB: PublicKey;
  vaultA: PublicKey;
  vaultB: PublicKey;
  userFromToken: PublicKey;
  userToToken: PublicKey;
  directionAtoB: boolean;
  isNativeSOLSwap: boolean;
  instructions: any[];
}

// Swap result
export interface SwapResult {
  success: boolean;
  signature?: TransactionSignature;
  explorerUrl?: string;
  error?: string;
}

// Pool creation parameters
export interface CreatePoolParams {
  tokenA: TokenInfo;
  tokenB: TokenInfo;
  amountA: number;
  amountB: number;
  fromPublicKey: PublicKey;
  feePayerPublicKey?: PublicKey;
}

// Pool creation transaction result
export interface CreatePoolTransactionResult {
  transaction: Transaction;
  poolPDA: PublicKey;
  tokenA: PublicKey;
  tokenB: PublicKey;
  lpMintPDA: PublicKey;
  vaultA: PublicKey;
  vaultB: PublicKey;
  isNativeSOLPool: boolean;
  amountALamports: bigint;
  amountBLamports: bigint;
}

// Pool creation result
export interface CreatePoolResult {
  success: boolean;
  signature?: TransactionSignature;
  poolInfo?: {
    poolPDA: string;
    tokenA: string;
    tokenB: string;
    lpMint: string;
    vaultA: string;
    vaultB: string;
  };
  error?: string;
}

// Detailed token information
export interface DetailedTokenInfo {
  id?: number;
  mintAddress: string;
  programId: string;
  supply: string;
  decimals: string;
  name: string | null;
  symbol: string | null;
  uri: string | null;
  mintAuthority: string | null;
  freezeAuthority: string | null;
  updateAuthority: string | null;
  isInitialized: boolean;
  isFrozen: boolean;
  metadata: {
    mintInfo: {
      supply: string;
      decimals: number;
      isInitialized: boolean;
      mintAuthority: string | null;
      freezeAuthority: string | null;
    };
    programId: string;
    tokenMetadata: any | null;
  };
  createdAt: string;
  lastUpdated: string;
}

// Detailed pool information
export interface DetailedPoolInfo {
  poolAddress: string;
  poolType: string;
  dataLength: number;
  rawData: string;
  tokenA: string;
  tokenB: string;
  bump: number;
  reserveA: number;
  reserveB: number;
  totalLPSupply: number;
  feeCollectedA: number;
  feeCollectedB: number;
  feeTreasury: string;
  feeBps: number;
  feePercentage: number;
  tokenAInfo: DetailedTokenInfo;
  tokenBInfo: DetailedTokenInfo;
}

// Pool information for add liquidity
export interface Pool {
  address: string;
  tokenA: TokenInfo;
  tokenB: TokenInfo;
}

// Add liquidity parameters
export interface AddLiquidityParams {
  pool: Pool | DetailedPoolInfo;
  amountA: number;
  amountB: number;
  fromPublicKey: PublicKey;
  feePayerPublicKey?: PublicKey;
}

// Add liquidity transaction result
export interface AddLiquidityTransactionResult {
  transaction: Transaction;
  poolPDA: PublicKey;
  tokenA: PublicKey;
  tokenB: PublicKey;
  lpMintPDA: PublicKey;
  vaultA: PublicKey;
  vaultB: PublicKey;
  isNativeSOLPool: boolean;
  amountALamports: bigint;
  amountBLamports: bigint;
  userTokenA: PublicKey;
  userTokenB: PublicKey;
  userLP: PublicKey;
}

// Add liquidity result
export interface AddLiquidityResult {
  success: boolean;
  signature?: TransactionSignature;
  lpTokensReceived?: string;
  error?: string;
}

// Signing function types
export type SignWithKeypair = (transaction: Transaction, keypair: Keypair, connection: Connection) => Promise<Transaction>;
export type SignWithWalletAdapter = (transaction: Transaction, wallet: any, connection: Connection) => Promise<Transaction>;

// Dual signer function types for native transfers
export type SignWithDualKeypairs = (
  transaction: Transaction, 
  senderKeypair: Keypair, 
  connection: Connection,
  feePayerKeypair?: Keypair
) => Promise<Transaction>;

export type SignWithWalletAndKeypair = (
  transaction: Transaction, 
  wallet: Wallet, 
  connection: Connection,
  feePayerKeypair?: Keypair
) => Promise<Transaction>;

// Wallet interface for compatibility
export interface Wallet {
  publicKey: PublicKey;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions?: (transactions: Transaction[]) => Promise<Transaction[]>;
}

// Transaction submission options
export interface SubmitOptions {
  skipPreflight?: boolean;
  maxRetries?: number;
  commitment?: "processed" | "confirmed" | "finalized";
}

// Transaction submission result
export interface SubmitResult {
  signature: string;
  success: boolean;
  error?: any;
}

// SDK configuration
export interface SDKConfig {
  blockchain: AnyBlockchainConfig;
  connection?: Connection;
}

// Error types
export class SDKError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "SDKError";
  }
}

export class TransactionError extends SDKError {
  constructor(message: string, public signature?: string) {
    super(message, "TRANSACTION_ERROR");
    this.name = "TransactionError";
  }
}

export class SigningError extends SDKError {
  constructor(message: string) {
    super(message, "SIGNING_ERROR");
    this.name = "SigningError";
  }
}
