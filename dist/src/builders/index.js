"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokenTransaction = createTokenTransaction;
exports.createNFTTransaction = createNFTTransaction;
exports.createNativeTransferTransaction = createNativeTransferTransaction;
exports.createSwapTransaction = createSwapTransaction;
exports.createPoolTransaction = createPoolTransaction;
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
        // Set up transaction (blockhash will be added during signing)
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
        // Set up transaction (blockhash will be added during signing)
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
async function createNativeTransferTransaction(_connection, _config, params) {
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
        // Create transfer instruction
        const transferInstruction = web3_js_1.SystemProgram.transfer({
            fromPubkey: fromPublicKey,
            toPubkey: toPublicKey,
            lamports: amountInLamports,
        });
        // Create transaction (blockhash will be added during signing)
        const transaction = new web3_js_1.Transaction({
            feePayer: actualFeePayer,
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
// AMM Program constants (these would typically come from your AMM program)
const AMM_PROGRAM_ID = new web3_js_1.PublicKey("11111111111111111111111111111111"); // Placeholder - replace with actual AMM program ID
const NATIVE_SOL_MINT = new web3_js_1.PublicKey("So11111111111111111111111111111111111111112");
const LAMPORTS_PER_SOL = 1000000000;
// Instruction discriminators and data sizes
const INSTRUCTION_DISCRIMINATORS = {
    SWAP: 0x01, // Replace with actual discriminator
    INIT_POOL: 0x02, // Replace with actual discriminator
};
const INSTRUCTION_DATA_SIZES = {
    SWAP: 10, // 1 byte discriminator + 8 bytes amount + 1 byte direction
    INIT_POOL: 17, // 1 byte discriminator + 8 bytes amountA + 8 bytes amountB
};
// Helper function to convert token amount to lamports
function tokenAmountToLamports(amount, decimals) {
    return BigInt(Math.floor(amount * Math.pow(10, decimals)));
}
// Helper function to check if token is native SOL
function isNativeSOL(tokenAddress) {
    return tokenAddress === NATIVE_SOL_MINT.toBase58() || tokenAddress === "So11111111111111111111111111111111111111112";
}
// Helper function to get user token account address
function getUserTokenAccount(mint, user) {
    // For native SOL, return the user's public key
    if (mint.equals(NATIVE_SOL_MINT)) {
        return user;
    }
    // For SPL tokens, derive the associated token account
    return web3_js_1.PublicKey.findProgramAddressSync([user.toBuffer(), new web3_js_1.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL").toBuffer(), mint.toBuffer()], new web3_js_1.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"))[0];
}
// Helper function to derive vault PDA
function deriveVaultPDA(poolPDA, tokenMint, isNativeSOLPool = false) {
    if (isNativeSOLPool && tokenMint.equals(NATIVE_SOL_MINT)) {
        // For native SOL pools, the vault might be the pool PDA itself or a specific derivation
        return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("vault_sol"), poolPDA.toBuffer()], AMM_PROGRAM_ID);
    }
    // For regular SPL tokens
    return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("vault"), poolPDA.toBuffer(), tokenMint.toBuffer()], AMM_PROGRAM_ID);
}
// Helper function to find pool configuration
async function findPoolConfiguration(fromTokenMint, toTokenMint, _connection) {
    // This would use the same logic as your existing findPoolConfiguration function
    // For now, using a placeholder - you'll need to implement the actual pool finding logic
    // Placeholder implementation - replace with actual pool finding logic
    const poolPDA = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("pool"), fromTokenMint.toBuffer(), toTokenMint.toBuffer()], AMM_PROGRAM_ID)[0];
    // Determine direction based on token order (this is a simplified example)
    const directionAtoB = fromTokenMint.toBase58() < toTokenMint.toBase58();
    return {
        poolPDA,
        tokenA: directionAtoB ? fromTokenMint : toTokenMint,
        tokenB: directionAtoB ? toTokenMint : fromTokenMint,
        directionAtoB,
    };
}
// Helper function to get common accounts
function getCommonAccounts(_user) {
    // This would return the common accounts needed for the swap instruction
    // Based on your existing getCommonAccounts function
    return [
        { pubkey: new web3_js_1.PublicKey("11111111111111111111111111111111"), isSigner: false, isWritable: false }, // System Program
        { pubkey: new web3_js_1.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), isSigner: false, isWritable: false }, // Token Program
        { pubkey: new web3_js_1.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"), isSigner: false, isWritable: false }, // Associated Token Program
    ];
}
// Helper function to derive pool PDA
function derivePoolPDA(tokenA, tokenB) {
    return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("pool"), tokenA.toBuffer(), tokenB.toBuffer()], AMM_PROGRAM_ID);
}
// Helper function to derive LP mint PDA
function deriveLPMintPDA(poolPDA, _isNativeSOLPool = false) {
    return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("lp_mint"), poolPDA.toBuffer()], AMM_PROGRAM_ID);
}
/**
 * Creates a universal swap transaction
 * @param connection - Solana connection
 * @param config - Blockchain configuration
 * @param params - Swap parameters
 * @returns Swap transaction result
 */
async function createSwapTransaction(connection, _config, params) {
    try {
        const { fromTokenAmount, fromToken, toToken, fromPublicKey, feePayerPublicKey, slippageTolerance = 0.5, // Default 0.5% slippage
         } = params;
        // Validate inputs
        if (fromTokenAmount <= 0) {
            throw new types_1.SDKError("Invalid token amount. Amount must be greater than 0");
        }
        if (!fromToken.address || !toToken.address) {
            throw new types_1.SDKError("Invalid token addresses");
        }
        // Determine fee payer (defaults to sender if not provided)
        const actualFeePayer = feePayerPublicKey || fromPublicKey;
        const FROM_TOKEN_MINT = new web3_js_1.PublicKey(fromToken.address);
        const TO_TOKEN_MINT = new web3_js_1.PublicKey(toToken.address);
        // Check if this involves native SOL
        const isFromSOL = isNativeSOL(fromToken.address);
        const isToSOL = isNativeSOL(toToken.address);
        const isNativeSOLSwap = isFromSOL || isToSOL;
        console.log("🚀 Building swap transaction:", {
            fromToken: fromToken.symbol,
            toToken: toToken.symbol,
            amount: fromTokenAmount,
            slippageTolerance: `${slippageTolerance}%`,
            isNativeSOLSwap,
            direction: isFromSOL ? "SOL → Token" : isToSOL ? "Token → SOL" : "Token → Token"
        });
        // Find the correct pool configuration
        const { poolPDA, tokenA, tokenB, directionAtoB } = await findPoolConfiguration(FROM_TOKEN_MINT, TO_TOKEN_MINT, connection);
        console.log("✅ Found pool configuration:", {
            poolPDA: poolPDA.toString(),
            tokenA: tokenA.toString(),
            tokenB: tokenB.toString(),
            direction: directionAtoB ? "A to B" : "B to A"
        });
        // Derive vaults based on the actual pool configuration
        const [vaultA] = deriveVaultPDA(poolPDA, tokenA, isNativeSOLSwap);
        const [vaultB] = deriveVaultPDA(poolPDA, tokenB, isNativeSOLSwap);
        console.log("📍 Derived addresses:", {
            poolPDA: poolPDA.toString(),
            tokenA: tokenA.toString(),
            tokenB: tokenB.toString(),
            vaultA: vaultA.toString(),
            vaultB: vaultB.toString(),
            direction: directionAtoB ? "A to B" : "B to A",
            isNativeSOLSwap
        });
        // Get user token accounts
        const userFromToken = getUserTokenAccount(FROM_TOKEN_MINT, fromPublicKey);
        const userToToken = getUserTokenAccount(TO_TOKEN_MINT, fromPublicKey);
        console.log("👤 User token accounts:", {
            userFromToken: userFromToken.toString(),
            userToToken: userToToken.toString()
        });
        // Convert amount to lamports
        const amountInLamports = isFromSOL
            ? BigInt(fromTokenAmount * LAMPORTS_PER_SOL)
            : tokenAmountToLamports(fromTokenAmount, fromToken.decimals);
        console.log("🔄 Swap parameters:", {
            amountIn: fromTokenAmount,
            amountInLamports: amountInLamports.toString(),
            direction: directionAtoB ? "A to B" : "B to A",
            isFromSOL,
            isToSOL
        });
        // Create transaction (blockhash will be added during signing)
        const transaction = new web3_js_1.Transaction({
            feePayer: actualFeePayer,
        });
        // Prepare accounts for Swap (matching Rust program order exactly)
        // Based on Rust: pool_info, token_a_info, token_b_info, vault_a_info, vault_b_info,
        // user_in_info, user_out_info, user_info, token_program_info
        const accounts = [
            { pubkey: poolPDA, isSigner: false, isWritable: true },
            { pubkey: tokenA, isSigner: false, isWritable: false },
            { pubkey: tokenB, isSigner: false, isWritable: false },
            { pubkey: vaultA, isSigner: false, isWritable: true },
            { pubkey: vaultB, isSigner: false, isWritable: true },
            { pubkey: userFromToken, isSigner: false, isWritable: true },
            { pubkey: userToToken, isSigner: false, isWritable: true },
            { pubkey: fromPublicKey, isSigner: true, isWritable: false },
            ...getCommonAccounts(fromPublicKey),
        ];
        // Create instruction data (matching Rust Swap struct: amount_in: u64, direction_a_to_b: bool)
        const data = Buffer.alloc(INSTRUCTION_DATA_SIZES.SWAP);
        data.writeUInt8(INSTRUCTION_DISCRIMINATORS.SWAP, 0);
        data.writeBigUInt64LE(amountInLamports, 1);
        data.writeUInt8(directionAtoB ? 1 : 0, 9);
        console.log("📝 Instruction data:", data.toString('hex'));
        console.log("📋 Account count:", accounts.length);
        console.log("📋 Accounts:", accounts.map((acc, i) => `${i}: ${acc.pubkey.toString()} (signer: ${acc.isSigner}, writable: ${acc.isWritable})`));
        // // Validate that we have the correct number of accounts
        const expectedAccountCount = 12; // Based on Rust program + common accounts
        if (accounts.length !== expectedAccountCount) {
            throw new types_1.SDKError(`Invalid account count. Expected ${expectedAccountCount}, got ${accounts.length}`);
        }
        // Add Swap instruction
        transaction.add({
            keys: accounts,
            programId: AMM_PROGRAM_ID,
            data,
        });
        console.log(`🔄 Added Swap instruction to transaction-->${JSON.stringify(transaction.instructions, null, 2)}`);
        console.log("📤 Swap transaction prepared successfully");
        return {
            transaction,
            fromToken,
            toToken,
            fromTokenAmount,
            fromTokenAmountLamports: amountInLamports,
            fromPublicKey,
            feePayerPublicKey: actualFeePayer,
            poolPDA,
            tokenA,
            tokenB,
            vaultA,
            vaultB,
            userFromToken,
            userToToken,
            directionAtoB,
            isNativeSOLSwap,
            instructions: transaction.instructions,
        };
    }
    catch (error) {
        throw new types_1.SDKError(`Failed to create swap transaction: ${error.message}`);
    }
}
/**
 * Creates a pool creation transaction without signing
 * @param connection - Solana connection
 * @param config - Blockchain configuration
 * @param params - Pool creation parameters
 * @param payer - The public key that will pay for the transaction
 * @returns Pool creation transaction result
 */
async function createPoolTransaction(_connection, _config, params, _payer) {
    try {
        const { tokenA, tokenB, amountA, amountB, fromPublicKey, feePayerPublicKey } = params;
        // Validate inputs
        if (amountA <= 0 || amountB <= 0) {
            throw new types_1.SDKError("Pool amounts must be greater than 0");
        }
        if (!tokenA || !tokenB) {
            throw new types_1.SDKError("Both tokens must be provided");
        }
        if (!tokenA.address || !tokenB.address) {
            throw new types_1.SDKError("Token addresses must be provided");
        }
        // Validate token addresses
        let TOKEN_A_MINT;
        let TOKEN_B_MINT;
        try {
            TOKEN_A_MINT = new web3_js_1.PublicKey(tokenA.address);
            TOKEN_B_MINT = new web3_js_1.PublicKey(tokenB.address);
        }
        catch (error) {
            throw new types_1.SDKError(`Invalid token address format: ${error.message}`);
        }
        // Check if this is a native SOL pool
        const isNativeSOLPool = isNativeSOL(TOKEN_A_MINT.toString()) || isNativeSOL(TOKEN_B_MINT.toString());
        // For native SOL pools, ensure SOL is always tokenA
        let finalTokenA = TOKEN_A_MINT;
        let finalTokenB = TOKEN_B_MINT;
        let finalAmountA = amountA;
        let finalAmountB = amountB;
        let finalTokenAInfo = tokenA;
        let finalTokenBInfo = tokenB;
        if (isNativeSOLPool) {
            // Validate that only one token is native SOL
            if (isNativeSOL(TOKEN_A_MINT.toString()) && isNativeSOL(TOKEN_B_MINT.toString())) {
                throw new types_1.SDKError("Cannot create a pool with SOL as both tokens");
            }
            // Ensure SOL is always tokenA
            if (isNativeSOL(TOKEN_B_MINT.toString())) {
                // Swap tokens so SOL is tokenA
                finalTokenA = TOKEN_B_MINT;
                finalTokenB = TOKEN_A_MINT;
                finalAmountA = amountB;
                finalAmountB = amountA;
                finalTokenAInfo = tokenB;
                finalTokenBInfo = tokenA;
            }
        }
        // Derive PDAs
        const [poolPDA] = derivePoolPDA(finalTokenA, finalTokenB);
        const [lpMintPDA] = deriveLPMintPDA(poolPDA, isNativeSOLPool);
        const [vaultA] = deriveVaultPDA(poolPDA, finalTokenA, isNativeSOLPool);
        const [vaultB] = deriveVaultPDA(poolPDA, finalTokenB, isNativeSOLPool);
        // Get user token accounts
        const userTokenA = getUserTokenAccount(finalTokenA, fromPublicKey);
        const userTokenB = getUserTokenAccount(finalTokenB, fromPublicKey);
        const userLP = getUserTokenAccount(lpMintPDA, fromPublicKey);
        // Convert amounts to lamports
        const amountALamports = isNativeSOL(finalTokenA.toString())
            ? BigInt(finalAmountA * LAMPORTS_PER_SOL)
            : tokenAmountToLamports(finalAmountA, finalTokenAInfo.decimals);
        const amountBLamports = isNativeSOL(finalTokenB.toString())
            ? BigInt(finalAmountB * LAMPORTS_PER_SOL)
            : tokenAmountToLamports(finalAmountB, finalTokenBInfo.decimals);
        // Determine fee payer
        const feePayer = feePayerPublicKey || fromPublicKey;
        // Create transaction
        const transaction = new web3_js_1.Transaction();
        transaction.feePayer = feePayer;
        // Prepare accounts for InitPool
        const userWritable = isNativeSOLPool;
        let accounts = [
            { pubkey: poolPDA, isSigner: false, isWritable: true },
            { pubkey: finalTokenA, isSigner: false, isWritable: false },
            { pubkey: finalTokenB, isSigner: false, isWritable: false },
            { pubkey: vaultA, isSigner: false, isWritable: true },
            { pubkey: vaultB, isSigner: false, isWritable: true },
            { pubkey: lpMintPDA, isSigner: false, isWritable: true },
            { pubkey: fromPublicKey, isSigner: true, isWritable: userWritable },
            { pubkey: userTokenA, isSigner: false, isWritable: true },
            { pubkey: userTokenB, isSigner: false, isWritable: true },
            { pubkey: userLP, isSigner: false, isWritable: true },
            ...getCommonAccounts(fromPublicKey),
        ];
        // Add SystemProgram for native SOL operations
        if (isNativeSOLPool) {
            accounts.push({ pubkey: web3_js_1.SystemProgram.programId, isSigner: false, isWritable: false });
        }
        // Create instruction data
        const data = Buffer.alloc(INSTRUCTION_DATA_SIZES.INIT_POOL);
        data.writeUInt8(INSTRUCTION_DISCRIMINATORS.INIT_POOL, 0);
        data.writeBigUInt64LE(amountALamports, 1);
        data.writeBigUInt64LE(amountBLamports, 9);
        // Add InitPool instruction
        transaction.add({
            keys: accounts,
            programId: AMM_PROGRAM_ID,
            data,
        });
        return {
            transaction,
            poolPDA,
            tokenA: finalTokenA,
            tokenB: finalTokenB,
            lpMintPDA,
            vaultA,
            vaultB,
            isNativeSOLPool,
            amountALamports,
            amountBLamports,
        };
    }
    catch (error) {
        throw new types_1.SDKError(`Failed to create pool transaction: ${error.message}`);
    }
}
//# sourceMappingURL=index.js.map