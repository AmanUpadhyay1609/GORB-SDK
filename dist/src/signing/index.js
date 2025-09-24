"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signTransferWithWalletAndKeypair = exports.signWithDualKeypairs = exports.signWithWalletAdapter = exports.signWithKeypair = void 0;
exports.signAllWithWalletAdapter = signAllWithWalletAdapter;
exports.signWithWalletAndKeypair = signWithWalletAndKeypair;
exports.createCombinedSigner = createCombinedSigner;
exports.validateWallet = validateWallet;
exports.validateKeypair = validateKeypair;
exports.createTransferSigner = createTransferSigner;
exports.createTransferWalletSigner = createTransferWalletSigner;
const web3_js_1 = require("@solana/web3.js");
const types_1 = require("../types");
/**
 * Signs a transaction with a keypair
 * @param transaction - Transaction to sign
 * @param keypair - Keypair to sign with
 * @returns Signed transaction
 */
const signWithKeypair = async (transaction, keypair) => {
    try {
        console.log(`inside signWithKeypair`);
        transaction.partialSign(keypair);
        console.log(`transaction after partialSign: ${JSON.stringify(transaction)}`);
        return transaction;
    }
    catch (error) {
        throw new types_1.SigningError(`Failed to sign transaction with keypair: ${error.message}`);
    }
};
exports.signWithKeypair = signWithKeypair;
/**
 * Signs a transaction with wallet adapter
 * @param transaction - Transaction to sign
 * @param wallet - Wallet adapter instance
 * @returns Signed transaction
 */
const signWithWalletAdapter = async (transaction, wallet) => {
    try {
        if (!wallet.signTransaction) {
            throw new types_1.SigningError("Wallet does not support signTransaction");
        }
        const signedTransaction = await wallet.signTransaction(transaction);
        return signedTransaction;
    }
    catch (error) {
        throw new types_1.SigningError(`Failed to sign transaction with wallet: ${error.message}`);
    }
};
exports.signWithWalletAdapter = signWithWalletAdapter;
/**
 * Signs multiple transactions with wallet adapter
 * @param transactions - Array of transactions to sign
 * @param wallet - Wallet adapter instance
 * @returns Array of signed transactions
 */
async function signAllWithWalletAdapter(transactions, wallet) {
    try {
        if (!wallet.signAllTransactions) {
            throw new types_1.SigningError("Wallet does not support signAllTransactions");
        }
        const signedTransactions = await wallet.signAllTransactions(transactions);
        return signedTransactions;
    }
    catch (error) {
        throw new types_1.SigningError(`Failed to sign all transactions with wallet: ${error.message}`);
    }
}
/**
 * Signs a transaction with both wallet and keypair (for mint keypair)
 * @param transaction - Transaction to sign
 * @param wallet - Wallet adapter instance
 * @param mintKeypair - Mint keypair for partial signing
 * @returns Signed transaction
 */
async function signWithWalletAndKeypair(transaction, wallet, mintKeypair) {
    try {
        // First sign with wallet
        const walletSignedTx = await (0, exports.signWithWalletAdapter)(transaction, wallet);
        // Then partially sign with mint keypair
        walletSignedTx.partialSign(mintKeypair);
        return walletSignedTx;
    }
    catch (error) {
        throw new types_1.SigningError(`Failed to sign transaction with wallet and keypair: ${error.message}`);
    }
}
/**
 * Creates a signing function that combines wallet and keypair signing
 * @param wallet - Wallet adapter instance
 * @param mintKeypair - Mint keypair for partial signing
 * @returns Combined signing function
 */
function createCombinedSigner(wallet, mintKeypair) {
    return async (transaction) => {
        return signWithWalletAndKeypair(transaction, wallet, mintKeypair);
    };
}
/**
 * Validates that a wallet has the required signing capabilities
 * @param wallet - Wallet to validate
 * @returns True if wallet is valid
 */
function validateWallet(wallet) {
    return (wallet &&
        wallet.publicKey instanceof web3_js_1.PublicKey &&
        typeof wallet.signTransaction === "function");
}
/**
 * Validates that a keypair is valid
 * @param keypair - Keypair to validate
 * @returns True if keypair is valid
 */
function validateKeypair(keypair) {
    return (keypair &&
        keypair.publicKey instanceof web3_js_1.PublicKey &&
        keypair.secretKey instanceof Uint8Array &&
        keypair.secretKey.length === 64);
}
/**
 * Signs a transaction with dual keypairs (sender and optional fee payer)
 * @param transaction - Transaction to sign
 * @param senderKeypair - Sender keypair (always required)
 * @param feePayerKeypair - Fee payer keypair (optional, defaults to sender)
 * @returns Signed transaction
 */
const signWithDualKeypairs = async (transaction, senderKeypair, feePayerKeypair) => {
    try {
        if (!validateKeypair(senderKeypair)) {
            throw new types_1.SigningError("Invalid sender keypair provided");
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
    }
    catch (error) {
        throw new types_1.SigningError(`Failed to sign transaction with dual keypairs: ${error.message}`);
    }
};
exports.signWithDualKeypairs = signWithDualKeypairs;
/**
 * Signs a transaction with wallet and optional fee payer keypair
 * @param transaction - Transaction to sign
 * @param wallet - Wallet adapter instance
 * @param feePayerKeypair - Fee payer keypair (optional)
 * @returns Signed transaction
 */
const signTransferWithWalletAndKeypair = async (transaction, wallet, feePayerKeypair) => {
    try {
        if (!validateWallet(wallet)) {
            throw new types_1.SigningError("Invalid wallet provided");
        }
        // First sign with wallet
        const walletSignedTx = await (0, exports.signWithWalletAdapter)(transaction, wallet);
        // If fee payer keypair is provided and different from wallet, sign with it too
        if (feePayerKeypair && validateKeypair(feePayerKeypair)) {
            // Check if fee payer is different from wallet
            if (!feePayerKeypair.publicKey.equals(wallet.publicKey)) {
                walletSignedTx.partialSign(feePayerKeypair);
            }
        }
        return walletSignedTx;
    }
    catch (error) {
        throw new types_1.SigningError(`Failed to sign transaction with wallet and keypair: ${error.message}`);
    }
};
exports.signTransferWithWalletAndKeypair = signTransferWithWalletAndKeypair;
/**
 * Creates a signing function for native transfers that handles dual signers
 * @param senderKeypair - Sender keypair
 * @param feePayerKeypair - Fee payer keypair (optional)
 * @returns Combined signing function
 */
function createTransferSigner(senderKeypair, feePayerKeypair) {
    return async (transaction) => {
        return (0, exports.signWithDualKeypairs)(transaction, senderKeypair, feePayerKeypair);
    };
}
/**
 * Creates a signing function for native transfers with wallet and fee payer
 * @param wallet - Wallet adapter instance
 * @param feePayerKeypair - Fee payer keypair (optional)
 * @returns Combined signing function
 */
function createTransferWalletSigner(wallet, feePayerKeypair) {
    return async (transaction) => {
        return (0, exports.signTransferWithWalletAndKeypair)(transaction, wallet, feePayerKeypair);
    };
}
//# sourceMappingURL=index.js.map