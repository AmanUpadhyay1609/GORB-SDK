import { PublicKey, Keypair, Transaction, Connection, TransactionSignature } from "@solana/web3.js";
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
export interface TransferSOLParams {
    fromPublicKey: PublicKey;
    toPublicKey: PublicKey;
    amountInSOL: number;
    feePayerPublicKey?: PublicKey;
}
export interface TransferTransactionResult {
    transaction: Transaction;
    fromPublicKey: PublicKey;
    toPublicKey: PublicKey;
    amountInLamports: number;
    feePayerPublicKey: PublicKey;
    instructions: any[];
}
export interface TransferResult {
    success: boolean;
    signature?: TransactionSignature;
    explorerUrl?: string;
    error?: string;
}
export interface TokenInfo {
    address: string;
    symbol: string;
    decimals: number;
    name?: string;
}
export interface SwapParams {
    fromTokenAmount: number;
    fromToken: TokenInfo;
    toToken: TokenInfo;
    fromPublicKey: PublicKey;
    feePayerPublicKey?: PublicKey;
    slippageTolerance?: number;
}
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
export interface SwapResult {
    success: boolean;
    signature?: TransactionSignature;
    explorerUrl?: string;
    error?: string;
}
export type SignWithKeypair = (transaction: Transaction, keypair: Keypair) => Promise<Transaction>;
export type SignWithWalletAdapter = (transaction: Transaction, wallet: any) => Promise<Transaction>;
export type SignWithDualKeypairs = (transaction: Transaction, senderKeypair: Keypair, feePayerKeypair?: Keypair) => Promise<Transaction>;
export type SignWithWalletAndKeypair = (transaction: Transaction, wallet: Wallet, feePayerKeypair?: Keypair) => Promise<Transaction>;
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