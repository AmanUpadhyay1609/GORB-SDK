import { Connection, PublicKey } from "@solana/web3.js";
import { CreateTokenParams, CreateNFTParams, TransactionResult, BlockchainConfig, TransferSOLParams, TransferTransactionResult } from "../types";
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
export declare function createNativeTransferTransaction(connection: Connection, _config: BlockchainConfig, params: TransferSOLParams): Promise<TransferTransactionResult>;
//# sourceMappingURL=index.d.ts.map