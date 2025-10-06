import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  SYSVAR_RENT_PUBKEY,
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
  CreatePoolParams,
  CreatePoolTransactionResult,
  AddLiquidityParams,
  AddLiquidityTransactionResult,
  TokenInfo,
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

// Gorbchain AMM Program constants
const AMM_PROGRAM_ID = new PublicKey("EtGrXaRpEdozMtfd8tbkbrbDN8LqZNba3xWTdT3HtQWq");
const SPL_TOKEN_PROGRAM_ID = new PublicKey("G22oYgZ6LnVcy7v8eSNi2xpNk1NcZiPD8CVKSTut7oZ6");
const ATA_PROGRAM_ID = new PublicKey("GoATGVNeSXerFerPqTJ8hcED1msPWHHLxao2vwBYqowm");
const NATIVE_SOL_MINT = new PublicKey("So11111111111111111111111111111111111111112");
const LAMPORTS_PER_SOL = 1_000_000_000;

// Seed constants
const SEEDS = {
  POOL: "pool",
  VAULT: "vault",
  MINT: "mint",
} as const;

// Instruction discriminators and data sizes
const INSTRUCTION_DISCRIMINATORS = {
  INIT_POOL: 0,
  ADD_LIQUIDITY: 1,
  REMOVE_LIQUIDITY: 2,
  SWAP: 3,
} as const;

const INSTRUCTION_DATA_SIZES = {
  INIT_POOL: 1 + 8 + 8, // discriminator + amount_a + amount_b
  SWAP: 1 + 8 + 1,      // discriminator + amount_in + direction_a_to_b
  ADD_LIQUIDITY: 1 + 8 + 8, // discriminator + amount_a + amount_b
  REMOVE_LIQUIDITY: 1 + 8,  // discriminator + lp_amount
} as const;

// Helper function to convert token amount to lamports
function tokenAmountToLamports(amount: number, decimals: number): bigint {
  return BigInt(Math.floor(amount * Math.pow(10, decimals)));
}

// Helper function to check if token is native SOL
function isNativeSOL(mint: string): boolean {
  return mint === NATIVE_SOL_MINT.toString();
}

// Helper function to get user token account address
function getUserTokenAccount(mint: PublicKey, user: PublicKey): PublicKey {
  if (isNativeSOL(mint.toString())) {
    return user; // For native SOL, the user's main account is used
  }
  return getAssociatedTokenAddressSync(mint, user, false, SPL_TOKEN_PROGRAM_ID, ATA_PROGRAM_ID);
}

// Helper function to derive vault PDA
function deriveVaultPDA(poolPDA: PublicKey, tokenMint: PublicKey, isNativeSOLPool: boolean): [PublicKey, number] {
  const seed = isNativeSOLPool ? "native_sol_vault" : SEEDS.VAULT;
  return PublicKey.findProgramAddressSync(
    [Buffer.from(seed), poolPDA.toBuffer(), tokenMint.toBuffer()],
    AMM_PROGRAM_ID
  );
}

// Helper function to find pool configuration
async function findPoolConfiguration(
  fromToken: PublicKey,
  toToken: PublicKey,
  _connection: Connection
): Promise<{
  poolPDA: PublicKey;
  tokenA: PublicKey;
  tokenB: PublicKey;
  directionAtoB: boolean;
}> {
  // For now, return a simple configuration
  // In a real implementation, you would query the blockchain for existing pools
  const [poolPDA] = derivePoolPDA(fromToken, toToken);
  return {
    poolPDA,
    tokenA: fromToken,
    tokenB: toToken,
    directionAtoB: true,
  };
}

// Helper function to get common accounts
function getCommonAccounts(_user: PublicKey): Array<{ pubkey: PublicKey, isSigner: boolean, isWritable: boolean }> {
  return [
    { pubkey: SPL_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: ATA_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
  ];
}

// Helper function to derive pool PDA
function derivePoolPDA(tokenA: PublicKey, tokenB: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.POOL), tokenA.toBuffer(), tokenB.toBuffer()],
    AMM_PROGRAM_ID
  );
}

// Helper function to derive LP mint PDA
function deriveLPMintPDA(poolPDA: PublicKey, isNativeSOLPool: boolean): [PublicKey, number] {
  const seed = isNativeSOLPool ? "native_sol_lp_mint" : SEEDS.MINT;
  return PublicKey.findProgramAddressSync(
    [Buffer.from(seed), poolPDA.toBuffer()],
    AMM_PROGRAM_ID
  );
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

/**
 * Creates a pool creation transaction without signing
 * @param connection - Solana connection
 * @param config - Blockchain configuration
 * @param params - Pool creation parameters
 * @param payer - The public key that will pay for the transaction
 * @returns Pool creation transaction result
 */
export async function createPoolTransaction(
  _connection: Connection,
  _config: BlockchainConfig,
  params: CreatePoolParams,
  _payer: PublicKey
): Promise<CreatePoolTransactionResult> {
  try {
    const { tokenA, tokenB, amountA, amountB, fromPublicKey, feePayerPublicKey } = params;

    // Validate inputs
    if (amountA <= 0 || amountB <= 0) {
      throw new SDKError("Pool amounts must be greater than 0");
    }

    if (!tokenA || !tokenB) {
      throw new SDKError("Both tokens must be provided");
    }

    if (!tokenA.address || !tokenB.address) {
      throw new SDKError("Token addresses must be provided");
    }

    // Validate token addresses
    let TOKEN_A_MINT: PublicKey;
    let TOKEN_B_MINT: PublicKey;

    try {
      TOKEN_A_MINT = new PublicKey(tokenA.address);
      TOKEN_B_MINT = new PublicKey(tokenB.address);
    } catch (error: any) {
      throw new SDKError(`Invalid token address format: ${error.message}`);
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
        throw new SDKError("Cannot create a pool with SOL as both tokens");
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
    const transaction = new Transaction();
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
      accounts.push({ pubkey: SystemProgram.programId, isSigner: false, isWritable: false });
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
  } catch (error: any) {
    throw new SDKError(`Failed to create pool transaction: ${error.message}`);
  }
}

/**
 * Creates an add liquidity transaction without signing
 * @param connection - Solana connection
 * @param config - Blockchain configuration
 * @param params - Add liquidity parameters
 * @param payer - The public key that will pay for the transaction
 * @returns Add liquidity transaction result
 */
export async function createAddLiquidityTransaction(
  _connection: Connection,
  _config: BlockchainConfig,
  params: AddLiquidityParams,
  _payer: PublicKey
): Promise<AddLiquidityTransactionResult> {
  try {
    const { pool, amountA, amountB, fromPublicKey, feePayerPublicKey } = params;

    // Validate inputs
    if (amountA <= 0 || amountB <= 0) {
      throw new SDKError("Liquidity amounts must be greater than 0");
    }

    if (!pool) {
      throw new SDKError("Pool information must be provided");
    }

    // Handle both Pool and DetailedPoolInfo types
    let poolAddress: string;
    let tokenA: TokenInfo;
    let tokenB: TokenInfo;

    if ('poolAddress' in pool) {
      // DetailedPoolInfo
      poolAddress = pool.poolAddress;
      tokenA = {
        address: pool.tokenA,
        symbol: pool.tokenAInfo.symbol || `Token${pool.tokenA.slice(-4)}`,
        decimals: parseInt(pool.tokenAInfo.decimals),
        name: pool.tokenAInfo.name || `Token${pool.tokenA.slice(-4)}`
      };
      tokenB = {
        address: pool.tokenB,
        symbol: pool.tokenBInfo.symbol || `Token${pool.tokenB.slice(-4)}`,
        decimals: parseInt(pool.tokenBInfo.decimals),
        name: pool.tokenBInfo.name || `Token${pool.tokenB.slice(-4)}`
      };
    } else {
      // Pool
      poolAddress = pool.address;
      tokenA = pool.tokenA;
      tokenB = pool.tokenB;
    }

    // Validate addresses
    let TOKEN_A_MINT: PublicKey;
    let TOKEN_B_MINT: PublicKey;

    try {
      TOKEN_A_MINT = new PublicKey(tokenA.address);
      TOKEN_B_MINT = new PublicKey(tokenB.address);
    } catch (error: any) {
      throw new SDKError(`Invalid token address format: ${error.message}`);
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
        throw new SDKError("Cannot add liquidity to a pool with SOL as both tokens");
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
    const poolPDA = new PublicKey(poolAddress);
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
    const transaction = new Transaction();
    transaction.feePayer = feePayer;

    // Prepare accounts for AddLiquidity
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
      accounts.push({ pubkey: SystemProgram.programId, isSigner: false, isWritable: false });
    }

    // Create instruction data
    const data = Buffer.alloc(INSTRUCTION_DATA_SIZES.ADD_LIQUIDITY);
    data.writeUInt8(INSTRUCTION_DISCRIMINATORS.ADD_LIQUIDITY, 0);
    data.writeBigUInt64LE(amountALamports, 1);
    data.writeBigUInt64LE(amountBLamports, 9);

    // Add AddLiquidity instruction
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
      userTokenA,
      userTokenB,
      userLP,
    };
  } catch (error: any) {
    throw new SDKError(`Failed to create add liquidity transaction: ${error.message}`);
  }
}

