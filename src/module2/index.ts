/**
 * Module2 - Advanced SDK Features
 * Ported from sdk2 with additional functionality
 */

// Encryption types and utilities
export * from "./types/encryption";
export * from "./types/encryption-utils";
export * from "./types/base58";

// Personal encryption builders
export * from "./builders/personal-encryption";

// Portfolio utilities
export * from "./builders/portfolio";
export * from "./types/portfolio";

// Webhooks utilities
export * from "./builders/webhooks";
export * from "./types/webhooks";

// Direct and Group encryption
export * from "./builders/direct-encryption";
export * from "./builders/group-encryption";
export * from "./builders/signature-groups";

// Decoders & rich tx
export * from "./decoders/registry";
export * from "./decoders/system";
export * from "./decoders/splToken";
export * from "./utils/getAndDecodeTransaction";

// Re-export common types from main SDK for convenience
export type { PublicKey, Keypair } from "@solana/web3.js";
