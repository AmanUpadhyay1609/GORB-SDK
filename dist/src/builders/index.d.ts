import { Connection, PublicKey } from "@solana/web3.js";
import { CreateTokenParams, CreateNFTParams, TransactionResult, BlockchainConfig, TransferSOLParams, TransferTransactionResult, SwapParams, SwapTransactionResult, CreatePoolParams, CreatePoolTransactionResult, AddLiquidityParams, AddLiquidityTransactionResult } from "../types";
/**
 * Creates a token creation transaction without signing
 * @param connection - Solana connection
 * @param config - Blockchain configuration
 * @param params - Token creation parameters
 * @param payer - The public key that will pay for the transaction
 * @returns Transaction result with raw transaction
 */
export declare function createTokenTransaction(connection: Connection, config: BlockchainConfig, params: CreateTokenParams, payer: PublicKey): Promise<TransactionResult>;
/**
 * Creates an NFT minting transaction without signing
 * @param connection - Solana connection
 * @param config - Blockchain configuration
 * @param params - NFT creation parameters
 * @param payer - The public key that will pay for the transaction
 * @returns Transaction result with raw transaction
 */
export declare function createNFTTransaction(connection: Connection, config: BlockchainConfig, params: CreateNFTParams, payer: PublicKey): Promise<TransactionResult>;
/**
 * Creates a native SOL transfer transaction
 * @param connection - Solana connection
 * @param config - Blockchain configuration
 * @param params - Transfer parameters
 * @returns Transfer transaction result
 */
export declare function createNativeTransferTransaction(_connection: Connection, _config: BlockchainConfig, params: TransferSOLParams): Promise<TransferTransactionResult>;
/**
 * Creates a universal swap transaction
 * @param connection - Solana connection
 * @param config - Blockchain configuration
 * @param params - Swap parameters
 * @returns Swap transaction result
 */
export declare function createSwapTransaction(connection: Connection, _config: BlockchainConfig, params: SwapParams): Promise<SwapTransactionResult>;
/**
 * Creates a pool creation transaction without signing
 * @param connection - Solana connection
 * @param config - Blockchain configuration
 * @param params - Pool creation parameters
 * @param payer - The public key that will pay for the transaction
 * @returns Pool creation transaction result
 */
export declare function createPoolTransaction(_connection: Connection, _config: BlockchainConfig, params: CreatePoolParams, _payer: PublicKey): Promise<CreatePoolTransactionResult>;
/**
 * Validate token amounts
 */
export declare function validateTokenAmounts(...amounts: number[]): void;
/**
 * Validate if a string is a valid Solana address
 */
export declare function isValidSolanaAddress(address: string): boolean;
/**
 * Validate Solana address and throw descriptive error if invalid
 */
export declare function validateSolanaAddress(address: string, description?: string): void;
/**
 * Creates an add liquidity transaction without signing
 * @param connection - Solana connection
 * @param config - Blockchain configuration
 * @param params - Add liquidity parameters
 * @param payer - The public key that will pay for the transaction
 * @returns Add liquidity transaction result
 */
export declare function createAddLiquidityTransaction(_connection: Connection, _config: BlockchainConfig, params: AddLiquidityParams, _payer: PublicKey): Promise<AddLiquidityTransactionResult>;
//# sourceMappingURL=index.d.ts.map