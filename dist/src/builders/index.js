"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokenTransaction = createTokenTransaction;
exports.createNFTTransaction = createNFTTransaction;
exports.createNativeTransferTransaction = createNativeTransferTransaction;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const types_1 = require("../types");
// Helper function to calculate metadata space
function calculateMetadataSpace(name, symbol, uri) {
    const borshSize = 32 + // update_authority
        32 + // mint
        4 + name.length +
        4 + symbol.length +
        4 + uri.length +
        4; // empty vector
    const tlv = 4;
    return Math.ceil((borshSize + tlv) * 1.1);
}
// Helper function to get recent blockhash
async function getRecentBlockhash(connection) {
    const { blockhash } = await connection.getLatestBlockhash();
    return blockhash;
}
/**
 * Creates a token creation transaction without signing
 * @param connection - Solana connection
 * @param config - Blockchain configuration
 * @param params - Token creation parameters
 * @param payer - The public key that will pay for the transaction
 * @returns Transaction result with raw transaction
 */
async function createTokenTransaction(connection, config, params, payer) {
    try {
        const { name, symbol, supply, decimals, uri, freezeAuthority = null, mintKeypair = web3_js_1.Keypair.generate(), } = params;
        const mint = mintKeypair.publicKey;
        // Calculate requirements
        const extensions = [spl_token_1.ExtensionType.MetadataPointer];
        const mintLen = (0, spl_token_1.getMintLen)(extensions);
        const metadataSpace = calculateMetadataSpace(name, symbol, uri);
        // Get associated token address
        const associatedToken = (0, spl_token_1.getAssociatedTokenAddressSync)(mint, payer, false, config.tokenProgram, config.associatedTokenProgram);
        // Build single transaction with all instructions
        const transaction = new web3_js_1.Transaction();
        // 1. Create mint account (standard mint space only)
        const mintRent = await connection.getMinimumBalanceForRentExemption(mintLen);
        transaction.add(web3_js_1.SystemProgram.createAccount({
            fromPubkey: payer,
            newAccountPubkey: mint,
            lamports: mintRent,
            space: mintLen,
            programId: config.tokenProgram,
        }));
        // 2. Initialize metadata pointer
        transaction.add((0, spl_token_1.createInitializeMetadataPointerInstruction)(mint, payer, mint, config.tokenProgram));
        // 3. Initialize mint
        transaction.add((0, spl_token_1.createInitializeMintInstruction)(mint, Number(decimals), payer, freezeAuthority, config.tokenProgram));
        // 4. Add rent for metadata space
        const totalSpace = mintLen + metadataSpace;
        const totalRent = await connection.getMinimumBalanceForRentExemption(totalSpace);
        const additionalRent = totalRent - mintRent;
        if (additionalRent > 0) {
            transaction.add(web3_js_1.SystemProgram.transfer({
                fromPubkey: payer,
                toPubkey: mint,
                lamports: additionalRent,
            }));
        }
        // 5. Add metadata
        transaction.add((0, spl_token_1.createInitializeInstruction)({
            programId: config.tokenProgram,
            metadata: mint,
            mint: mint,
            mintAuthority: payer,
            updateAuthority: payer,
            name,
            symbol,
            uri,
        }));
        // 6. Check if ATA exists and add creation if needed
        const ataInfo = await connection.getAccountInfo(associatedToken);
        if (!ataInfo) {
            transaction.add((0, spl_token_1.createAssociatedTokenAccountInstruction)(payer, associatedToken, payer, mint, config.tokenProgram, config.associatedTokenProgram));
        }
        // 7. Mint the tokens
        const mintAmount = BigInt(supply) * BigInt(10 ** Number(decimals));
        transaction.add((0, spl_token_1.createMintToInstruction)(mint, associatedToken, payer, mintAmount, [], config.tokenProgram));
        // Get recent blockhash and set up transaction
        const blockhash = await getRecentBlockhash(connection);
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = payer;
        transaction.partialSign(mintKeypair); // Add mint keypair as signer
        return {
            transaction,
            mintKeypair,
            mintAddress: mint,
            associatedTokenAddress: associatedToken,
            instructions: transaction.instructions,
        };
    }
    catch (error) {
        throw new types_1.SDKError(`Failed to create token transaction: ${error.message}`);
    }
}
/**
 * Creates an NFT minting transaction without signing
 * @param connection - Solana connection
 * @param config - Blockchain configuration
 * @param params - NFT creation parameters
 * @param payer - The public key that will pay for the transaction
 * @returns Transaction result with raw transaction
 */
async function createNFTTransaction(connection, config, params, payer) {
    try {
        const { name, symbol, uri, mintKeypair = web3_js_1.Keypair.generate(), } = params;
        const mint = mintKeypair.publicKey;
        // NFTs have supply of 1 and 0 decimals
        const supply = 1;
        const decimals = 0;
        // Calculate space requirements
        const extensions = [spl_token_1.ExtensionType.MetadataPointer];
        const mintLen = (0, spl_token_1.getMintLen)(extensions);
        const metadataSpace = calculateMetadataSpace(name, symbol, uri);
        const mintRent = await connection.getMinimumBalanceForRentExemption(mintLen);
        const totalSpace = mintLen + metadataSpace;
        const totalRent = await connection.getMinimumBalanceForRentExemption(totalSpace);
        const additionalRent = totalRent - mintRent;
        // Get associated token address
        const associatedToken = (0, spl_token_1.getAssociatedTokenAddressSync)(mint, payer, false, config.tokenProgram, config.associatedTokenProgram);
        // Check if ATA already exists
        const ataInfo = await connection.getAccountInfo(associatedToken);
        // Build single transaction with all instructions
        const transaction = new web3_js_1.Transaction();
        // 1. Create mint account with base space
        transaction.add(web3_js_1.SystemProgram.createAccount({
            fromPubkey: payer,
            newAccountPubkey: mint,
            lamports: mintRent,
            space: mintLen,
            programId: config.tokenProgram,
        }));
        // 2. Initialize metadata pointer
        transaction.add((0, spl_token_1.createInitializeMetadataPointerInstruction)(mint, payer, mint, config.tokenProgram));
        // 3. Initialize mint
        transaction.add((0, spl_token_1.createInitializeMintInstruction)(mint, decimals, payer, payer, config.tokenProgram));
        // 4. Add space for metadata
        if (additionalRent > 0) {
            transaction.add(web3_js_1.SystemProgram.transfer({
                fromPubkey: payer,
                toPubkey: mint,
                lamports: additionalRent,
            }));
        }
        // 5. Initialize metadata
        transaction.add((0, spl_token_1.createInitializeInstruction)({
            programId: config.tokenProgram,
            metadata: mint,
            updateAuthority: payer,
            mint: mint,
            mintAuthority: payer,
            name,
            symbol,
            uri,
        }));
        // 6. Create ATA if needed
        if (!ataInfo) {
            transaction.add((0, spl_token_1.createAssociatedTokenAccountInstruction)(payer, associatedToken, payer, mint, config.tokenProgram, config.associatedTokenProgram));
        }
        // 7. Mint the NFT
        transaction.add((0, spl_token_1.createMintToInstruction)(mint, associatedToken, payer, BigInt(supply), [], config.tokenProgram));
        // Get recent blockhash
        const blockhash = await getRecentBlockhash(connection);
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = payer;
        transaction.partialSign(mintKeypair); // Add mint keypair as signer
        return {
            transaction,
            mintKeypair,
            mintAddress: mint,
            associatedTokenAddress: associatedToken,
            instructions: transaction.instructions,
        };
    }
    catch (error) {
        throw new types_1.SDKError(`Failed to create NFT transaction: ${error.message}`);
    }
}
/**
 * Creates a native SOL transfer transaction
 * @param connection - Solana connection
 * @param config - Blockchain configuration
 * @param params - Transfer parameters
 * @returns Transfer transaction result
 */
async function createNativeTransferTransaction(connection, _config, params) {
    try {
        const { fromPublicKey, toPublicKey, amountInSOL, feePayerPublicKey, } = params;
        // Validate amount
        if (amountInSOL <= 0) {
            throw new types_1.SDKError("Invalid SOL amount. Amount must be greater than 0");
        }
        // Convert SOL to lamports
        const LAMPORTS_PER_SOL = 1000000000;
        const amountInLamports = Math.floor(amountInSOL * LAMPORTS_PER_SOL);
        // Determine fee payer (defaults to sender if not provided)
        const actualFeePayer = feePayerPublicKey || fromPublicKey;
        // Get recent blockhash
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
        // Create transfer instruction
        const transferInstruction = web3_js_1.SystemProgram.transfer({
            fromPubkey: fromPublicKey,
            toPubkey: toPublicKey,
            lamports: amountInLamports,
        });
        // Create transaction
        const transaction = new web3_js_1.Transaction({
            feePayer: actualFeePayer,
            blockhash,
            lastValidBlockHeight,
        }).add(transferInstruction);
        return {
            transaction,
            fromPublicKey,
            toPublicKey,
            amountInLamports,
            feePayerPublicKey: actualFeePayer,
            instructions: transaction.instructions,
        };
    }
    catch (error) {
        throw new types_1.SDKError(`Failed to create native transfer transaction: ${error.message}`);
    }
}
//# sourceMappingURL=index.js.map