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

// Helper function to get recent blockhash
async function getRecentBlockhash(connection: Connection): Promise<string> {
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
  } catch (error: any) {
    throw new SDKError(`Failed to create NFT transaction: ${error.message}`);
  }
}

