import { PublicKey } from "@solana/web3.js";
import { BlockchainConfig, GorbchainConfig, SolanaConfig } from "../types";

// Gorbchain program IDs
export const GORBCHAIN_PROGRAMS = {
  TOKEN22_PROGRAM: new PublicKey("G22oYgZ6LnVcy7v8eSNi2xpNk1NcZiPD8CVKSTut7oZ6"),
  ASSOCIATED_TOKEN_PROGRAM: new PublicKey("GoATGVNeSXerFerPqTJ8hcED1msPWHHLxao2vwBYqowm"),
  SYSTEM_PROGRAM: new PublicKey("11111111111111111111111111111111"),
} as const;

// Solana program IDs
export const SOLANA_PROGRAMS = {
  TOKEN22_PROGRAM: new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"),
  ASSOCIATED_TOKEN_PROGRAM: new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
  SYSTEM_PROGRAM: new PublicKey("11111111111111111111111111111111"),
} as const;

// Pre-configured blockchain configurations
export const GORBCHAIN_CONFIG: GorbchainConfig = {
  name: "gorbchain",
  version: "1.0.0",
  tokenProgram: GORBCHAIN_PROGRAMS.TOKEN22_PROGRAM,
  associatedTokenProgram: GORBCHAIN_PROGRAMS.ASSOCIATED_TOKEN_PROGRAM,
  systemProgram: GORBCHAIN_PROGRAMS.SYSTEM_PROGRAM,
  rpcUrl: "https://rpc.gorbchain.xyz",
  wsUrl: "wss://rpc.gorbchain.xyz/ws/",
  commitment: "confirmed",
};

export const SOLANA_MAINNET_CONFIG: SolanaConfig = {
  name: "solana",
  cluster: "mainnet-beta",
  tokenProgram: SOLANA_PROGRAMS.TOKEN22_PROGRAM,
  associatedTokenProgram: SOLANA_PROGRAMS.ASSOCIATED_TOKEN_PROGRAM,
  systemProgram: SOLANA_PROGRAMS.SYSTEM_PROGRAM,
  rpcUrl: "https://api.mainnet-beta.solana.com",
  commitment: "confirmed",
};

export const SOLANA_DEVNET_CONFIG: SolanaConfig = {
  name: "solana",
  cluster: "devnet",
  tokenProgram: SOLANA_PROGRAMS.TOKEN22_PROGRAM,
  associatedTokenProgram: SOLANA_PROGRAMS.ASSOCIATED_TOKEN_PROGRAM,
  systemProgram: SOLANA_PROGRAMS.SYSTEM_PROGRAM,
  rpcUrl: "https://api.devnet.solana.com",
  commitment: "confirmed",
};

// Default configurations
export const DEFAULT_CONFIGS = {
  gorbchain: GORBCHAIN_CONFIG,
  solana: SOLANA_MAINNET_CONFIG,
  "solana-devnet": SOLANA_DEVNET_CONFIG,
} as const;

// Helper function to create custom blockchain configuration
export function createBlockchainConfig(
  tokenProgram: string | PublicKey,
  associatedTokenProgram: string | PublicKey,
  rpcUrl: string,
  options?: {
    wsUrl?: string;
    commitment?: "processed" | "confirmed" | "finalized";
    name?: string;
  }
): BlockchainConfig {
  return {
    name: options?.name || "custom",
    tokenProgram: typeof tokenProgram === "string" ? new PublicKey(tokenProgram) : tokenProgram,
    associatedTokenProgram: typeof associatedTokenProgram === "string" ? new PublicKey(associatedTokenProgram) : associatedTokenProgram,
    systemProgram: new PublicKey("11111111111111111111111111111111"),
    rpcUrl,
    ...(options?.wsUrl && { wsUrl: options.wsUrl }),
    commitment: options?.commitment || "confirmed",
  };
}

// Export the main GORB object for backward compatibility
export const GORB = {
  TOKEN22_PROGRAM: GORBCHAIN_PROGRAMS.TOKEN22_PROGRAM,
  ASSOCIATED_TOKEN_PROGRAM: GORBCHAIN_PROGRAMS.ASSOCIATED_TOKEN_PROGRAM,
  SYSTEM_PROGRAM: GORBCHAIN_PROGRAMS.SYSTEM_PROGRAM,
  CONFIG: GORBCHAIN_CONFIG,
} as const;
