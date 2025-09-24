"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signWithWalletAdapter = exports.signWithKeypair = void 0;
exports.signAllWithWalletAdapter = signAllWithWalletAdapter;
exports.signWithWalletAndKeypair = signWithWalletAndKeypair;
exports.createCombinedSigner = createCombinedSigner;
exports.validateWallet = validateWallet;
exports.validateKeypair = validateKeypair;
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
//# sourceMappingURL=index.js.map