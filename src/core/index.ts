// Main SDK exports
export { SolanaSDK, createSDK, createGorbchainSDK, createSolanaSDK } from "./sdk";

// Type exports
export type {
  BlockchainConfig,
  GorbchainConfig,
  SolanaConfig,
  AnyBlockchainConfig,
  CreateTokenParams,
  CreateNFTParams,
  TransactionResult,
  TransferSOLParams,
  TransferTransactionResult,
  TransferResult,
  TokenInfo,
  SwapParams,
  SwapTransactionResult,
  SwapResult,
  CreatePoolParams,
  CreatePoolTransactionResult,
  CreatePoolResult,
  AddLiquidityParams,
  AddLiquidityTransactionResult,
  AddLiquidityResult,
  NonNativeTransferParams,
  NonNativeTransferTransactionResult,
  NonNativeTransferResult,
  EnsureTokenAccountsParams,
  EnsureTokenAccountsResult,
  DetailedTokenInfo,
  DetailedPoolInfo,
  Pool,
  Wallet,
  SDKConfig,
  SubmitOptions,
  SubmitResult,
  SignWithKeypair,
  SignWithWalletAdapter,
  SignWithDualKeypairs,
  SignWithWalletAndKeypair,
} from "../types";

// Error exports
export { SDKError, TransactionError, SigningError } from "../types";

// Constants exports
export {
  GORBCHAIN_PROGRAMS,
  SOLANA_PROGRAMS,
  GORBCHAIN_CONFIG,
  SOLANA_MAINNET_CONFIG,
  SOLANA_DEVNET_CONFIG,
  DEFAULT_CONFIGS,
  createBlockchainConfig,
  GORB,
} from "../constants";

// Transaction builder exports
export {
  createTokenTransaction,
  createNFTTransaction,
  createNativeTransferTransaction,
  createSwapTransaction,
  createPoolTransaction,
  createAddLiquidityTransaction,
  createNonNativeTransferTransaction,
  ensureTokenAccountsExist,
} from "../builders";

// Signing utility exports
export {
  signWithKeypair,
  signWithWalletAdapter,
  signAllWithWalletAdapter,
  signWithWalletAndKeypair,
  createCombinedSigner,
  validateWallet,
  validateKeypair,
  signWithDualKeypairs,
  signTransferWithWalletAndKeypair,
  createTransferSigner,
  createTransferWalletSigner,
  createSwapSigner,
  createSwapWalletSigner,
} from "../signing";

// Submission utility exports
export {
  submitTransaction,
  submitTransactions,
  simulateTransaction,
  waitForConfirmation,
  getTransactionDetails,
} from "../submission";

// Re-export commonly used Solana types for convenience
export {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";

// Re-export commonly used SPL Token types for convenience
export {
  createInitializeMintInstruction,
  getAssociatedTokenAddressSync,
  createInitializeMetadataPointerInstruction,
  getMintLen,
  ExtensionType,
  createInitializeInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
} from "@solana/spl-token";

// Module2 exports - Advanced SDK Features
export * as Module2 from "../module2";
