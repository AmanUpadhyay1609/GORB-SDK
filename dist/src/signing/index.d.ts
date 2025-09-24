import { Keypair, Transaction } from "@solana/web3.js";
import { SignWithKeypair, SignWithWalletAdapter, Wallet } from "../types";
/**
 * Signs a transaction with a keypair
 * @param transaction - Transaction to sign
 * @param keypair - Keypair to sign with
 * @returns Signed transaction
 */
export declare const signWithKeypair: SignWithKeypair;
/**
 * Signs a transaction with wallet adapter
 * @param transaction - Transaction to sign
 * @param wallet - Wallet adapter instance
 * @returns Signed transaction
 */
export declare const signWithWalletAdapter: SignWithWalletAdapter;
/**
 * Signs multiple transactions with wallet adapter
 * @param transactions - Array of transactions to sign
 * @param wallet - Wallet adapter instance
 * @returns Array of signed transactions
 */
export declare function signAllWithWalletAdapter(transactions: Transaction[], wallet: Wallet): Promise<Transaction[]>;
/**
 * Signs a transaction with both wallet and keypair (for mint keypair)
 * @param transaction - Transaction to sign
 * @param wallet - Wallet adapter instance
 * @param mintKeypair - Mint keypair for partial signing
 * @returns Signed transaction
 */
export declare function signWithWalletAndKeypair(transaction: Transaction, wallet: Wallet, mintKeypair: Keypair): Promise<Transaction>;
/**
 * Creates a signing function that combines wallet and keypair signing
 * @param wallet - Wallet adapter instance
 * @param mintKeypair - Mint keypair for partial signing
 * @returns Combined signing function
 */
export declare function createCombinedSigner(wallet: Wallet, mintKeypair: Keypair): (transaction: Transaction) => Promise<Transaction>;
/**
 * Validates that a wallet has the required signing capabilities
 * @param wallet - Wallet to validate
 * @returns True if wallet is valid
 */
export declare function validateWallet(wallet: any): wallet is Wallet;
/**
 * Validates that a keypair is valid
 * @param keypair - Keypair to validate
 * @returns True if keypair is valid
 */
export declare function validateKeypair(keypair: any): keypair is Keypair;
//# sourceMappingURL=index.d.ts.map