import { PublicKey } from "@solana/web3.js";
import { BlockchainConfig, GorbchainConfig, SolanaConfig } from "../types";
export declare const GORBCHAIN_PROGRAMS: {
    readonly TOKEN22_PROGRAM: PublicKey;
    readonly ASSOCIATED_TOKEN_PROGRAM: PublicKey;
    readonly SYSTEM_PROGRAM: PublicKey;
};
export declare const SOLANA_PROGRAMS: {
    readonly TOKEN22_PROGRAM: PublicKey;
    readonly ASSOCIATED_TOKEN_PROGRAM: PublicKey;
    readonly SYSTEM_PROGRAM: PublicKey;
};
export declare const GORBCHAIN_CONFIG: GorbchainConfig;
export declare const SOLANA_MAINNET_CONFIG: SolanaConfig;
export declare const SOLANA_DEVNET_CONFIG: SolanaConfig;
export declare const DEFAULT_CONFIGS: {
    readonly gorbchain: GorbchainConfig;
    readonly solana: SolanaConfig;
    readonly "solana-devnet": SolanaConfig;
};
export declare function createBlockchainConfig(tokenProgram: string | PublicKey, associatedTokenProgram: string | PublicKey, rpcUrl: string, options?: {
    wsUrl?: string;
    commitment?: "processed" | "confirmed" | "finalized";
    name?: string;
}): BlockchainConfig;
export declare const GORB: {
    readonly TOKEN22_PROGRAM: PublicKey;
    readonly ASSOCIATED_TOKEN_PROGRAM: PublicKey;
    readonly SYSTEM_PROGRAM: PublicKey;
    readonly CONFIG: GorbchainConfig;
};
//# sourceMappingURL=index.d.ts.map