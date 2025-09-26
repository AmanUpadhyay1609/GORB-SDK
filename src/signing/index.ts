import {
  Keypair,
  PublicKey,
  Transaction,
  Connection,
} from "@solana/web3.js";
import {
  SignWithKeypair,
  SignWithWalletAdapter,
  SignWithDualKeypairs,
  SignWithWalletAndKeypair,
  Wallet,
  SigningError,
} from "../types";

// Helper function to get fresh blockhash
async function getFreshBlockhash(connection: Connection): Promise<{ blockhash: string; lastValidBlockHeight: number }> {
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  return { blockhash, lastValidBlockHeight };
}

/**
 * Signs a transaction with a keypair
 * @param transaction - Transaction to sign
 * @param keypair - Keypair to sign with
 * @param connection - Solana connection for fresh blockhash
 * @returns Signed transaction
 */
export const signWithKeypair: SignWithKeypair = async (transaction: Transaction, keypair: Keypair, connection: Connection): Promise<Transaction> => {
  try {
    console.log(`inside signWithKeypair`);
    
    // Get fresh blockhash and lastValidBlockHeight
    const { blockhash, lastValidBlockHeight } = await getFreshBlockhash(connection);
    
    // Set fresh blockhash on transaction
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
    
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
 * @param connection - Solana connection for fresh blockhash
 * @returns Signed transaction
 */
export const signWithWalletAdapter: SignWithWalletAdapter = async (transaction: Transaction, wallet: Wallet, connection: Connection): Promise<Transaction> => {
  try {
    if (!wallet.signTransaction) {
      throw new SigningError("Wallet does not support signTransaction");
    }
    
    // Get fresh blockhash and lastValidBlockHeight
    const { blockhash, lastValidBlockHeight } = await getFreshBlockhash(connection);
    
    // Set fresh blockhash on transaction
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
    
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
 * @param connection - Solana connection for fresh blockhash
 * @returns Array of signed transactions
 */
export async function signAllWithWalletAdapter(
  transactions: Transaction[],
  wallet: Wallet,
  connection: Connection
): Promise<Transaction[]> {
  try {
    if (!wallet.signAllTransactions) {
      throw new SigningError("Wallet does not support signAllTransactions");
    }
    
    // Get fresh blockhash and lastValidBlockHeight
    const { blockhash, lastValidBlockHeight } = await getFreshBlockhash(connection);
    
    // Set fresh blockhash on all transactions
    transactions.forEach(transaction => {
      transaction.recentBlockhash = blockhash;
      transaction.lastValidBlockHeight = lastValidBlockHeight;
    });
    
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
 * @param connection - Solana connection for fresh blockhash
 * @returns Signed transaction
 */
export async function signWithWalletAndKeypair(
  transaction: Transaction,
  wallet: Wallet,
  mintKeypair: Keypair,
  connection: Connection
): Promise<Transaction> {
  try {
    // First sign with wallet (this will add fresh blockhash)
    const walletSignedTx = await signWithWalletAdapter(transaction, wallet, connection);
    
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
  return async (transaction: Transaction, connection: Connection): Promise<Transaction> => {
    return signWithWalletAndKeypair(transaction, wallet, mintKeypair, connection);
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
 * @param connection - Solana connection for fresh blockhash
 * @param feePayerKeypair - Fee payer keypair (optional, defaults to sender)
 * @returns Signed transaction
 */
export const signWithDualKeypairs: SignWithDualKeypairs = async (
  transaction: Transaction,
  senderKeypair: Keypair,
  connection: Connection,
  feePayerKeypair?: Keypair
): Promise<Transaction> => {
  try {
    if (!validateKeypair(senderKeypair)) {
      throw new SigningError("Invalid sender keypair provided");
    }

    // Get fresh blockhash and lastValidBlockHeight
    const { blockhash, lastValidBlockHeight } = await getFreshBlockhash(connection);
    
    // Set fresh blockhash on transaction
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;

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
 * @param connection - Solana connection for fresh blockhash
 * @param feePayerKeypair - Fee payer keypair (optional)
 * @returns Signed transaction
 */
export const signTransferWithWalletAndKeypair: SignWithWalletAndKeypair = async (
  transaction: Transaction,
  wallet: Wallet,
  connection: Connection,
  feePayerKeypair?: Keypair
): Promise<Transaction> => {
  try {
    if (!validateWallet(wallet)) {
      throw new SigningError("Invalid wallet provided");
    }

    // First sign with wallet (this will add fresh blockhash)
    const walletSignedTx = await signWithWalletAdapter(transaction, wallet, connection);

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
  return async (transaction: Transaction, connection: Connection): Promise<Transaction> => {
    return signWithDualKeypairs(transaction, senderKeypair, connection, feePayerKeypair);
  };
}

/**
 * Creates a signing function for native transfers with wallet and fee payer
 * @param wallet - Wallet adapter instance
 * @param feePayerKeypair - Fee payer keypair (optional)
 * @returns Combined signing function
 */
export function createTransferWalletSigner(wallet: Wallet, feePayerKeypair?: Keypair) {
  return async (transaction: Transaction, connection: Connection): Promise<Transaction> => {
    return signTransferWithWalletAndKeypair(transaction, wallet, connection, feePayerKeypair);
  };
}

/**
 * Creates a signing function for swap transactions that handles dual signers
 * @param senderKeypair - Sender keypair
 * @param feePayerKeypair - Fee payer keypair (optional)
 * @returns Combined signing function
 */
export function createSwapSigner(senderKeypair: Keypair, feePayerKeypair?: Keypair) {
  return async (transaction: Transaction, connection: Connection): Promise<Transaction> => {
    return signWithDualKeypairs(transaction, senderKeypair, connection, feePayerKeypair);
  };
}

/**
 * Creates a signing function for swap transactions with wallet and fee payer
 * @param wallet - Wallet adapter instance
 * @param feePayerKeypair - Fee payer keypair (optional)
 * @returns Combined signing function
 */
export function createSwapWalletSigner(wallet: Wallet, feePayerKeypair?: Keypair) {
  return async (transaction: Transaction, connection: Connection): Promise<Transaction> => {
    return signTransferWithWalletAndKeypair(transaction, wallet, connection, feePayerKeypair);
  };
}
