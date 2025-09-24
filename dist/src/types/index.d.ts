import { PublicKey, Keypair, Transaction, Connection } from "@solana/web3.js";
export interface BlockchainConfig {
    name?: string;
    tokenProgram: PublicKey;
    associatedTokenProgram: PublicKey;
    systemProgram: PublicKey;
    rpcUrl: string;
    wsUrl?: string;
    commitment?: "processed" | "confirmed" | "finalized";
}
export interface GorbchainConfig extends BlockchainConfig {
    name: "gorbchain";
    version: string;
}
export interface SolanaConfig extends BlockchainConfig {
    name: "solana";
    cluster: "mainnet-beta" | "devnet" | "testnet";
}
export type AnyBlockchainConfig = GorbchainConfig | SolanaConfig | BlockchainConfig;
export interface CreateTokenParams {
    name: string;
    symbol: string;
    supply: string | number;
    decimals: string | number;
    uri: string;
    freezeAuthority?: PublicKey | null;
    mintKeypair?: Keypair;
}
export interface CreateNFTParams {
    name: string;
    symbol: string;
    uri: string;
    description: string;
    mintKeypair?: Keypair;
}
export interface TransactionResult {
    transaction: Transaction;
    mintKeypair: Keypair;
    mintAddress: PublicKey;
    associatedTokenAddress?: PublicKey;
    instructions: any[];
}
export type SignWithKeypair = (transaction: Transaction, keypair: Keypair) => Promise<Transaction>;
export type SignWithWalletAdapter = (transaction: Transaction, wallet: any) => Promise<Transaction>;
export interface Wallet {
    publicKey: PublicKey;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
    signAllTransactions?: (transactions: Transaction[]) => Promise<Transaction[]>;
}
export interface SubmitOptions {
    skipPreflight?: boolean;
    maxRetries?: number;
    commitment?: "processed" | "confirmed" | "finalized";
}
export interface SubmitResult {
    signature: string;
    success: boolean;
    error?: any;
}
export interface SDKConfig {
    blockchain: AnyBlockchainConfig;
    connection?: Connection;
}
export declare class SDKError extends Error {
    code?: string | undefined;
    constructor(message: string, code?: string | undefined);
}
export declare class TransactionError extends SDKError {
    signature?: string | undefined;
    constructor(message: string, signature?: string | undefined);
}
export declare class SigningError extends SDKError {
    constructor(message: string);
}
//# sourceMappingURL=index.d.ts.map