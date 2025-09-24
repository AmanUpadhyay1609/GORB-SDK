import {
  Keypair,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import {
  SignWithKeypair,
  SignWithWalletAdapter,
  SignWithDualKeypairs,
  SignWithWalletAndKeypair,
  Wallet,
  SigningError,
} from "../types";

/**
 * Signs a transaction with a keypair
 * @param transaction - Transaction to sign
 * @param keypair - Keypair to sign with
 * @returns Signed transaction
 */
export const signWithKeypair: SignWithKeypair = async (transaction: Transaction, keypair: Keypair): Promise<Transaction> => {
  try {
    console.log(`inside signWithKeypair`);
    transaction.partialSign(keypair);
    console.log(`transaction after partialSign: ${JSON.stringify(transaction)}`);
    return transaction;
  } catch (error: any) {
    throw new SigningError(`Failed to sign transaction with keypair: ${error.message}`);
  }
};

/**
 * Signs a transaction with wallet adapter
 * @param transaction - Transaction to sign
 * @param wallet - Wallet adapter instance
 * @returns Signed transaction
 */
export const signWithWalletAdapter: SignWithWalletAdapter = async (transaction: Transaction, wallet: Wallet): Promise<Transaction> => {
  try {
    if (!wallet.signTransaction) {
      throw new SigningError("Wallet does not support signTransaction");
    }
    
    const signedTransaction = await wallet.signTransaction(transaction);
    return signedTransaction;
  } catch (error: any) {
    throw new SigningError(`Failed to sign transaction with wallet: ${error.message}`);
  }
};

/**
 * Signs multiple transactions with wallet adapter
 * @param transactions - Array of transactions to sign
 * @param wallet - Wallet adapter instance
 * @returns Array of signed transactions
 */
export async function signAllWithWalletAdapter(
  transactions: Transaction[],
  wallet: Wallet
): Promise<Transaction[]> {
  try {
    if (!wallet.signAllTransactions) {
      throw new SigningError("Wallet does not support signAllTransactions");
    }
    
    const signedTransactions = await wallet.signAllTransactions(transactions);
    return signedTransactions;
  } catch (error: any) {
    throw new SigningError(`Failed to sign all transactions with wallet: ${error.message}`);
  }
}

/**
 * Signs a transaction with both wallet and keypair (for mint keypair)
 * @param transaction - Transaction to sign
 * @param wallet - Wallet adapter instance
 * @param mintKeypair - Mint keypair for partial signing
 * @returns Signed transaction
 */
export async function signWithWalletAndKeypair(
  transaction: Transaction,
  wallet: Wallet,
  mintKeypair: Keypair
): Promise<Transaction> {
  try {
    // First sign with wallet
    const walletSignedTx = await signWithWalletAdapter(transaction, wallet);
    
    // Then partially sign with mint keypair
    walletSignedTx.partialSign(mintKeypair);
    
    return walletSignedTx;
  } catch (error: any) {
    throw new SigningError(`Failed to sign transaction with wallet and keypair: ${error.message}`);
  }
}

/**
 * Creates a signing function that combines wallet and keypair signing
 * @param wallet - Wallet adapter instance
 * @param mintKeypair - Mint keypair for partial signing
 * @returns Combined signing function
 */
export function createCombinedSigner(wallet: Wallet, mintKeypair: Keypair) {
  return async (transaction: Transaction): Promise<Transaction> => {
    return signWithWalletAndKeypair(transaction, wallet, mintKeypair);
  };
}

/**
 * Validates that a wallet has the required signing capabilities
 * @param wallet - Wallet to validate
 * @returns True if wallet is valid
 */
export function validateWallet(wallet: any): wallet is Wallet {
  return (
    wallet &&
    wallet.publicKey instanceof PublicKey &&
    typeof wallet.signTransaction === "function"
  );
}

/**
 * Validates that a keypair is valid
 * @param keypair - Keypair to validate
 * @returns True if keypair is valid
 */
export function validateKeypair(keypair: any): keypair is Keypair {
  return (
    keypair &&
    keypair.publicKey instanceof PublicKey &&
    keypair.secretKey instanceof Uint8Array &&
    keypair.secretKey.length === 64
  );
}

/**
 * Signs a transaction with dual keypairs (sender and optional fee payer)
 * @param transaction - Transaction to sign
 * @param senderKeypair - Sender keypair (always required)
 * @param feePayerKeypair - Fee payer keypair (optional, defaults to sender)
 * @returns Signed transaction
 */
export const signWithDualKeypairs: SignWithDualKeypairs = async (
  transaction: Transaction,
  senderKeypair: Keypair,
  feePayerKeypair?: Keypair
): Promise<Transaction> => {
  try {
    if (!validateKeypair(senderKeypair)) {
      throw new SigningError("Invalid sender keypair provided");
    }

    // Always sign with sender keypair
    transaction.partialSign(senderKeypair);

    // If fee payer is different from sender, sign with fee payer keypair too
    if (feePayerKeypair && validateKeypair(feePayerKeypair)) {
      // Check if fee payer is different from sender
      if (!feePayerKeypair.publicKey.equals(senderKeypair.publicKey)) {
        transaction.partialSign(feePayerKeypair);
      }
    }

    return transaction;
  } catch (error: any) {
    throw new SigningError(`Failed to sign transaction with dual keypairs: ${error.message}`);
  }
};

/**
 * Signs a transaction with wallet and optional fee payer keypair
 * @param transaction - Transaction to sign
 * @param wallet - Wallet adapter instance
 * @param feePayerKeypair - Fee payer keypair (optional)
 * @returns Signed transaction
 */
export const signTransferWithWalletAndKeypair: SignWithWalletAndKeypair = async (
  transaction: Transaction,
  wallet: Wallet,
  feePayerKeypair?: Keypair
): Promise<Transaction> => {
  try {
    if (!validateWallet(wallet)) {
      throw new SigningError("Invalid wallet provided");
    }

    // First sign with wallet
    const walletSignedTx = await signWithWalletAdapter(transaction, wallet);

    // If fee payer keypair is provided and different from wallet, sign with it too
    if (feePayerKeypair && validateKeypair(feePayerKeypair)) {
      // Check if fee payer is different from wallet
      if (!feePayerKeypair.publicKey.equals(wallet.publicKey)) {
        walletSignedTx.partialSign(feePayerKeypair);
      }
    }

    return walletSignedTx;
  } catch (error: any) {
    throw new SigningError(`Failed to sign transaction with wallet and keypair: ${error.message}`);
  }
};

/**
 * Creates a signing function for native transfers that handles dual signers
 * @param senderKeypair - Sender keypair
 * @param feePayerKeypair - Fee payer keypair (optional)
 * @returns Combined signing function
 */
export function createTransferSigner(senderKeypair: Keypair, feePayerKeypair?: Keypair) {
  return async (transaction: Transaction): Promise<Transaction> => {
    return signWithDualKeypairs(transaction, senderKeypair, feePayerKeypair);
  };
}

/**
 * Creates a signing function for native transfers with wallet and fee payer
 * @param wallet - Wallet adapter instance
 * @param feePayerKeypair - Fee payer keypair (optional)
 * @returns Combined signing function
 */
export function createTransferWalletSigner(wallet: Wallet, feePayerKeypair?: Keypair) {
  return async (transaction: Transaction): Promise<Transaction> => {
    return signTransferWithWalletAndKeypair(transaction, wallet, feePayerKeypair);
  };
}
