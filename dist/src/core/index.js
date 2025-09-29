"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInitializeInstruction = exports.ExtensionType = exports.getMintLen = exports.createInitializeMetadataPointerInstruction = exports.getAssociatedTokenAddressSync = exports.createInitializeMintInstruction = exports.SystemProgram = exports.Transaction = exports.PublicKey = exports.Keypair = exports.Connection = exports.getTransactionDetails = exports.waitForConfirmation = exports.simulateTransaction = exports.submitTransactions = exports.submitTransaction = exports.createSwapWalletSigner = exports.createSwapSigner = exports.createTransferWalletSigner = exports.createTransferSigner = exports.signTransferWithWalletAndKeypair = exports.signWithDualKeypairs = exports.validateKeypair = exports.validateWallet = exports.createCombinedSigner = exports.signWithWalletAndKeypair = exports.signAllWithWalletAdapter = exports.signWithWalletAdapter = exports.signWithKeypair = exports.createAddLiquidityTransaction = exports.createPoolTransaction = exports.createSwapTransaction = exports.createNativeTransferTransaction = exports.createNFTTransaction = exports.createTokenTransaction = exports.GORB = exports.createBlockchainConfig = exports.DEFAULT_CONFIGS = exports.SOLANA_DEVNET_CONFIG = exports.SOLANA_MAINNET_CONFIG = exports.GORBCHAIN_CONFIG = exports.SOLANA_PROGRAMS = exports.GORBCHAIN_PROGRAMS = exports.SigningError = exports.TransactionError = exports.SDKError = exports.createSolanaSDK = exports.createGorbchainSDK = exports.createSDK = exports.SolanaSDK = void 0;
exports.createMintToInstruction = exports.createAssociatedTokenAccountInstruction = void 0;
// Main SDK exports
var sdk_1 = require("./sdk");
Object.defineProperty(exports, "SolanaSDK", { enumerable: true, get: function () { return sdk_1.SolanaSDK; } });
Object.defineProperty(exports, "createSDK", { enumerable: true, get: function () { return sdk_1.createSDK; } });
Object.defineProperty(exports, "createGorbchainSDK", { enumerable: true, get: function () { return sdk_1.createGorbchainSDK; } });
Object.defineProperty(exports, "createSolanaSDK", { enumerable: true, get: function () { return sdk_1.createSolanaSDK; } });
// Error exports
var types_1 = require("../types");
Object.defineProperty(exports, "SDKError", { enumerable: true, get: function () { return types_1.SDKError; } });
Object.defineProperty(exports, "TransactionError", { enumerable: true, get: function () { return types_1.TransactionError; } });
Object.defineProperty(exports, "SigningError", { enumerable: true, get: function () { return types_1.SigningError; } });
// Constants exports
var constants_1 = require("../constants");
Object.defineProperty(exports, "GORBCHAIN_PROGRAMS", { enumerable: true, get: function () { return constants_1.GORBCHAIN_PROGRAMS; } });
Object.defineProperty(exports, "SOLANA_PROGRAMS", { enumerable: true, get: function () { return constants_1.SOLANA_PROGRAMS; } });
Object.defineProperty(exports, "GORBCHAIN_CONFIG", { enumerable: true, get: function () { return constants_1.GORBCHAIN_CONFIG; } });
Object.defineProperty(exports, "SOLANA_MAINNET_CONFIG", { enumerable: true, get: function () { return constants_1.SOLANA_MAINNET_CONFIG; } });
Object.defineProperty(exports, "SOLANA_DEVNET_CONFIG", { enumerable: true, get: function () { return constants_1.SOLANA_DEVNET_CONFIG; } });
Object.defineProperty(exports, "DEFAULT_CONFIGS", { enumerable: true, get: function () { return constants_1.DEFAULT_CONFIGS; } });
Object.defineProperty(exports, "createBlockchainConfig", { enumerable: true, get: function () { return constants_1.createBlockchainConfig; } });
Object.defineProperty(exports, "GORB", { enumerable: true, get: function () { return constants_1.GORB; } });
// Transaction builder exports
var builders_1 = require("../builders");
Object.defineProperty(exports, "createTokenTransaction", { enumerable: true, get: function () { return builders_1.createTokenTransaction; } });
Object.defineProperty(exports, "createNFTTransaction", { enumerable: true, get: function () { return builders_1.createNFTTransaction; } });
Object.defineProperty(exports, "createNativeTransferTransaction", { enumerable: true, get: function () { return builders_1.createNativeTransferTransaction; } });
Object.defineProperty(exports, "createSwapTransaction", { enumerable: true, get: function () { return builders_1.createSwapTransaction; } });
Object.defineProperty(exports, "createPoolTransaction", { enumerable: true, get: function () { return builders_1.createPoolTransaction; } });
Object.defineProperty(exports, "createAddLiquidityTransaction", { enumerable: true, get: function () { return builders_1.createAddLiquidityTransaction; } });
// Signing utility exports
var signing_1 = require("../signing");
Object.defineProperty(exports, "signWithKeypair", { enumerable: true, get: function () { return signing_1.signWithKeypair; } });
Object.defineProperty(exports, "signWithWalletAdapter", { enumerable: true, get: function () { return signing_1.signWithWalletAdapter; } });
Object.defineProperty(exports, "signAllWithWalletAdapter", { enumerable: true, get: function () { return signing_1.signAllWithWalletAdapter; } });
Object.defineProperty(exports, "signWithWalletAndKeypair", { enumerable: true, get: function () { return signing_1.signWithWalletAndKeypair; } });
Object.defineProperty(exports, "createCombinedSigner", { enumerable: true, get: function () { return signing_1.createCombinedSigner; } });
Object.defineProperty(exports, "validateWallet", { enumerable: true, get: function () { return signing_1.validateWallet; } });
Object.defineProperty(exports, "validateKeypair", { enumerable: true, get: function () { return signing_1.validateKeypair; } });
Object.defineProperty(exports, "signWithDualKeypairs", { enumerable: true, get: function () { return signing_1.signWithDualKeypairs; } });
Object.defineProperty(exports, "signTransferWithWalletAndKeypair", { enumerable: true, get: function () { return signing_1.signTransferWithWalletAndKeypair; } });
Object.defineProperty(exports, "createTransferSigner", { enumerable: true, get: function () { return signing_1.createTransferSigner; } });
Object.defineProperty(exports, "createTransferWalletSigner", { enumerable: true, get: function () { return signing_1.createTransferWalletSigner; } });
Object.defineProperty(exports, "createSwapSigner", { enumerable: true, get: function () { return signing_1.createSwapSigner; } });
Object.defineProperty(exports, "createSwapWalletSigner", { enumerable: true, get: function () { return signing_1.createSwapWalletSigner; } });
// Submission utility exports
var submission_1 = require("../submission");
Object.defineProperty(exports, "submitTransaction", { enumerable: true, get: function () { return submission_1.submitTransaction; } });
Object.defineProperty(exports, "submitTransactions", { enumerable: true, get: function () { return submission_1.submitTransactions; } });
Object.defineProperty(exports, "simulateTransaction", { enumerable: true, get: function () { return submission_1.simulateTransaction; } });
Object.defineProperty(exports, "waitForConfirmation", { enumerable: true, get: function () { return submission_1.waitForConfirmation; } });
Object.defineProperty(exports, "getTransactionDetails", { enumerable: true, get: function () { return submission_1.getTransactionDetails; } });
// Re-export commonly used Solana types for convenience
var web3_js_1 = require("@solana/web3.js");
Object.defineProperty(exports, "Connection", { enumerable: true, get: function () { return web3_js_1.Connection; } });
Object.defineProperty(exports, "Keypair", { enumerable: true, get: function () { return web3_js_1.Keypair; } });
Object.defineProperty(exports, "PublicKey", { enumerable: true, get: function () { return web3_js_1.PublicKey; } });
Object.defineProperty(exports, "Transaction", { enumerable: true, get: function () { return web3_js_1.Transaction; } });
Object.defineProperty(exports, "SystemProgram", { enumerable: true, get: function () { return web3_js_1.SystemProgram; } });
// Re-export commonly used SPL Token types for convenience
var spl_token_1 = require("@solana/spl-token");
Object.defineProperty(exports, "createInitializeMintInstruction", { enumerable: true, get: function () { return spl_token_1.createInitializeMintInstruction; } });
Object.defineProperty(exports, "getAssociatedTokenAddressSync", { enumerable: true, get: function () { return spl_token_1.getAssociatedTokenAddressSync; } });
Object.defineProperty(exports, "createInitializeMetadataPointerInstruction", { enumerable: true, get: function () { return spl_token_1.createInitializeMetadataPointerInstruction; } });
Object.defineProperty(exports, "getMintLen", { enumerable: true, get: function () { return spl_token_1.getMintLen; } });
Object.defineProperty(exports, "ExtensionType", { enumerable: true, get: function () { return spl_token_1.ExtensionType; } });
Object.defineProperty(exports, "createInitializeInstruction", { enumerable: true, get: function () { return spl_token_1.createInitializeInstruction; } });
Object.defineProperty(exports, "createAssociatedTokenAccountInstruction", { enumerable: true, get: function () { return spl_token_1.createAssociatedTokenAccountInstruction; } });
Object.defineProperty(exports, "createMintToInstruction", { enumerable: true, get: function () { return spl_token_1.createMintToInstruction; } });
//# sourceMappingURL=index.js.map