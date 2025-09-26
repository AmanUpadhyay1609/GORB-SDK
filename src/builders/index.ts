import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  getAssociatedTokenAddressSync,
  createInitializeMetadataPointerInstruction,
  getMintLen,
  ExtensionType,
  createInitializeInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
} from "@solana/spl-token";
import {
  CreateTokenParams,
  CreateNFTParams,
  TransactionResult,
  BlockchainConfig,
  SDKError,
  TransferSOLParams,
  TransferTransactionResult,
  SwapParams,
  SwapTransactionResult,
} from "../types";

// Helper function to calculate metadata space
function calculateMetadataSpace(name: string, symbol: string, uri: string): number {
  const borshSize =
    32 + // update_authority
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
export async function createTokenTransaction(
  connection: Connection,
  config: BlockchainConfig,
  params: CreateTokenParams,
  payer: PublicKey
): Promise<TransactionResult> {
  try {
    const {
      name,
      symbol,
      supply,
      decimals,
      uri,
      freezeAuthority = null,
      mintKeypair = Keypair.generate(),
    } = params;

    const mint = mintKeypair.publicKey;

    // Calculate requirements
    const extensions: ExtensionType[] = [ExtensionType.MetadataPointer];
    const mintLen = getMintLen(extensions);
    const metadataSpace = calculateMetadataSpace(name, symbol, uri);

    // Get associated token address
    const associatedToken = getAssociatedTokenAddressSync(
      mint,
      payer,
      false,
      config.tokenProgram,
      config.associatedTokenProgram
    );

    // Build single transaction with all instructions
    const transaction = new Transaction();

    // 1. Create mint account (standard mint space only)
    const mintRent = await connection.getMinimumBalanceForRentExemption(mintLen);
    
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: mint,
        lamports: mintRent,
        space: mintLen,
        programId: config.tokenProgram,
      })
    );

    // 2. Initialize metadata pointer
    transaction.add(
      createInitializeMetadataPointerInstruction(
        mint,
        payer,
        mint,
        config.tokenProgram
      )
    );

    // 3. Initialize mint
    transaction.add(
      createInitializeMintInstruction(
        mint,
        Number(decimals),
        payer,
        freezeAuthority,
        config.tokenProgram
      )
    );

    // 4. Add rent for metadata space
    const totalSpace = mintLen + metadataSpace;
    const totalRent = await connection.getMinimumBalanceForRentExemption(totalSpace);
    const additionalRent = totalRent - mintRent;

    if (additionalRent > 0) {
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: payer,
          toPubkey: mint,
          lamports: additionalRent,
        })
      );
    }

    // 5. Add metadata
    transaction.add(
      createInitializeInstruction({
        programId: config.tokenProgram,
        metadata: mint,
        mint: mint,
        mintAuthority: payer,
        updateAuthority: payer,
        name,
        symbol,
        uri,
      })
    );

    // 6. Check if ATA exists and add creation if needed
    const ataInfo = await connection.getAccountInfo(associatedToken);
    if (!ataInfo) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          payer,
          associatedToken,
          payer,
          mint,
          config.tokenProgram,
          config.associatedTokenProgram
        )
      );
    }

    // 7. Mint the tokens
    const mintAmount = BigInt(supply) * BigInt(10 ** Number(decimals));
    transaction.add(
      createMintToInstruction(
        mint,
        associatedToken,
        payer,
        mintAmount,
        [],
        config.tokenProgram
      )
    );

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
  } catch (error: any) {
    throw new SDKError(`Failed to create token transaction: ${error.message}`);
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
export async function createNFTTransaction(
  connection: Connection,
  config: BlockchainConfig,
  params: CreateNFTParams,
  payer: PublicKey
): Promise<TransactionResult> {
  try {
    const {
      name,
      symbol,
      uri,
      mintKeypair = Keypair.generate(),
    } = params;

    const mint = mintKeypair.publicKey;

    // NFTs have supply of 1 and 0 decimals
    const supply = 1;
    const decimals = 0;

    // Calculate space requirements
    const extensions = [ExtensionType.MetadataPointer];
    const mintLen = getMintLen(extensions);
    const metadataSpace = calculateMetadataSpace(name, symbol, uri);
    const mintRent = await connection.getMinimumBalanceForRentExemption(mintLen);
    const totalSpace = mintLen + metadataSpace;
    const totalRent = await connection.getMinimumBalanceForRentExemption(totalSpace);
    const additionalRent = totalRent - mintRent;

    // Get associated token address
    const associatedToken = getAssociatedTokenAddressSync(
      mint,
      payer,
      false,
      config.tokenProgram,
      config.associatedTokenProgram
    );

    // Check if ATA already exists
    const ataInfo = await connection.getAccountInfo(associatedToken);

    // Build single transaction with all instructions
    const transaction = new Transaction();

    // 1. Create mint account with base space
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: mint,
        lamports: mintRent,
        space: mintLen,
        programId: config.tokenProgram,
      })
    );

    // 2. Initialize metadata pointer
    transaction.add(
      createInitializeMetadataPointerInstruction(
        mint,
        payer,
        mint,
        config.tokenProgram
      )
    );

    // 3. Initialize mint
    transaction.add(
      createInitializeMintInstruction(
        mint,
        decimals,
        payer,
        payer,
        config.tokenProgram
      )
    );

    // 4. Add space for metadata
    if (additionalRent > 0) {
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: payer,
          toPubkey: mint,
          lamports: additionalRent,
        })
      );
    }

    // 5. Initialize metadata
    transaction.add(
      createInitializeInstruction({
        programId: config.tokenProgram,
        metadata: mint,
        updateAuthority: payer,
        mint: mint,
        mintAuthority: payer,
        name,
        symbol,
        uri,
      })
    );

    // 6. Create ATA if needed
    if (!ataInfo) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          payer,
          associatedToken,
          payer,
          mint,
          config.tokenProgram,
          config.associatedTokenProgram
        )
      );
    }

    // 7. Mint the NFT
    transaction.add(
      createMintToInstruction(
        mint,
        associatedToken,
        payer,
        BigInt(supply),
        [],
        config.tokenProgram
      )
    );

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
  } catch (error: any) {
    throw new SDKError(`Failed to create NFT transaction: ${error.message}`);
  }
}

/**
 * Creates a native SOL transfer transaction
 * @param connection - Solana connection
 * @param config - Blockchain configuration
 * @param params - Transfer parameters
 * @returns Transfer transaction result
 */
export async function createNativeTransferTransaction(
  _connection: Connection,
  _config: BlockchainConfig,
  params: TransferSOLParams
): Promise<TransferTransactionResult> {
  try {
    const {
      fromPublicKey,
      toPublicKey,
      amountInSOL,
      feePayerPublicKey,
    } = params;

    // Validate amount
    if (amountInSOL <= 0) {
      throw new SDKError("Invalid SOL amount. Amount must be greater than 0");
    }

    // Convert SOL to lamports
    const LAMPORTS_PER_SOL = 1_000_000_000;
    const amountInLamports = Math.floor(amountInSOL * LAMPORTS_PER_SOL);

    // Determine fee payer (defaults to sender if not provided)
    const actualFeePayer = feePayerPublicKey || fromPublicKey;

    // Create transfer instruction
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: fromPublicKey,
      toPubkey: toPublicKey,
      lamports: amountInLamports,
    });

    // Create transaction (blockhash will be added during signing)
    const transaction = new Transaction({
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
  } catch (error: any) {
    throw new SDKError(`Failed to create native transfer transaction: ${error.message}`);
  }
}

// AMM Program constants (these would typically come from your AMM program)
const AMM_PROGRAM_ID = new PublicKey("11111111111111111111111111111111"); // Placeholder - replace with actual AMM program ID
const NATIVE_SOL_MINT = new PublicKey("So11111111111111111111111111111111111111112");
const LAMPORTS_PER_SOL = 1_000_000_000;

// Instruction discriminators and data sizes
const INSTRUCTION_DISCRIMINATORS = {
  SWAP: 0x01, // Replace with actual discriminator
} as const;

const INSTRUCTION_DATA_SIZES = {
  SWAP: 10, // 1 byte discriminator + 8 bytes amount + 1 byte direction
} as const;

// Helper function to convert token amount to lamports
function tokenAmountToLamports(amount: number, decimals: number): bigint {
  return BigInt(Math.floor(amount * Math.pow(10, decimals)));
}

// Helper function to check if token is native SOL
function isNativeSOL(tokenAddress: string): boolean {
  return tokenAddress === NATIVE_SOL_MINT.toBase58() || tokenAddress === "So11111111111111111111111111111111111111112";
}

// Helper function to get user token account address
function getUserTokenAccount(mint: PublicKey, user: PublicKey): PublicKey {
  // For native SOL, return the user's public key
  if (mint.equals(NATIVE_SOL_MINT)) {
    return user;
  }
  
  // For SPL tokens, derive the associated token account
  return PublicKey.findProgramAddressSync(
    [user.toBuffer(), new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL").toBuffer(), mint.toBuffer()],
    new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL")
  )[0];
}

// Helper function to derive vault PDA
function deriveVaultPDA(poolPDA: PublicKey, tokenMint: PublicKey, isNativeSOLPool: boolean = false): [PublicKey, number] {
  if (isNativeSOLPool && tokenMint.equals(NATIVE_SOL_MINT)) {
    // For native SOL pools, the vault might be the pool PDA itself or a specific derivation
    return PublicKey.findProgramAddressSync(
      [Buffer.from("vault_sol"), poolPDA.toBuffer()],
      AMM_PROGRAM_ID
    );
  }
  
  // For regular SPL tokens
  return PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), poolPDA.toBuffer(), tokenMint.toBuffer()],
    AMM_PROGRAM_ID
  );
}

// Helper function to find pool configuration
async function findPoolConfiguration(
  fromTokenMint: PublicKey,
  toTokenMint: PublicKey,
  _connection: Connection
): Promise<{
  poolPDA: PublicKey;
  tokenA: PublicKey;
  tokenB: PublicKey;
  directionAtoB: boolean;
}> {
  // This would use the same logic as your existing findPoolConfiguration function
  // For now, using a placeholder - you'll need to implement the actual pool finding logic
  
  // Placeholder implementation - replace with actual pool finding logic
  const poolPDA = PublicKey.findProgramAddressSync(
    [Buffer.from("pool"), fromTokenMint.toBuffer(), toTokenMint.toBuffer()],
    AMM_PROGRAM_ID
  )[0];

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
function getCommonAccounts(_user: PublicKey): Array<{ pubkey: PublicKey; isSigner: boolean; isWritable: boolean }> {
  // This would return the common accounts needed for the swap instruction
  // Based on your existing getCommonAccounts function
  return [
    { pubkey: new PublicKey("11111111111111111111111111111111"), isSigner: false, isWritable: false }, // System Program
    { pubkey: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), isSigner: false, isWritable: false }, // Token Program
    { pubkey: new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"), isSigner: false, isWritable: false }, // Associated Token Program
  ];
}

/**
 * Creates a universal swap transaction
 * @param connection - Solana connection
 * @param config - Blockchain configuration
 * @param params - Swap parameters
 * @returns Swap transaction result
 */
export async function createSwapTransaction(
  connection: Connection,
  _config: BlockchainConfig,
  params: SwapParams
): Promise<SwapTransactionResult> {
  try {
    const {
      fromTokenAmount,
      fromToken,
      toToken,
      fromPublicKey,
      feePayerPublicKey,
      slippageTolerance = 0.5, // Default 0.5% slippage
    } = params;

    // Validate inputs
    if (fromTokenAmount <= 0) {
      throw new SDKError("Invalid token amount. Amount must be greater than 0");
    }

    if (!fromToken.address || !toToken.address) {
      throw new SDKError("Invalid token addresses");
    }

    // Determine fee payer (defaults to sender if not provided)
    const actualFeePayer = feePayerPublicKey || fromPublicKey;

    const FROM_TOKEN_MINT = new PublicKey(fromToken.address);
    const TO_TOKEN_MINT = new PublicKey(toToken.address);

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
    const { poolPDA, tokenA, tokenB, directionAtoB } = await findPoolConfiguration(
      FROM_TOKEN_MINT,
      TO_TOKEN_MINT,
      connection
    );

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
    const transaction = new Transaction({
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
      throw new SDKError(`Invalid account count. Expected ${expectedAccountCount}, got ${accounts.length}`);
    }

    // Add Swap instruction
    transaction.add({
      keys: accounts,
      programId: AMM_PROGRAM_ID,
      data,
    });
    console.log(`🔄 Added Swap instruction to transaction-->${JSON.stringify(transaction.instructions,null,2)}`);

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
  } catch (error: any) {
    throw new SDKError(`Failed to create swap transaction: ${error.message}`);
  }
}

