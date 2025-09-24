"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GORB = exports.DEFAULT_CONFIGS = exports.SOLANA_DEVNET_CONFIG = exports.SOLANA_MAINNET_CONFIG = exports.GORBCHAIN_CONFIG = exports.SOLANA_PROGRAMS = exports.GORBCHAIN_PROGRAMS = void 0;
exports.createBlockchainConfig = createBlockchainConfig;
const web3_js_1 = require("@solana/web3.js");
// Gorbchain program IDs
exports.GORBCHAIN_PROGRAMS = {
    TOKEN22_PROGRAM: new web3_js_1.PublicKey("G22oYgZ6LnVcy7v8eSNi2xpNk1NcZiPD8CVKSTut7oZ6"),
    ASSOCIATED_TOKEN_PROGRAM: new web3_js_1.PublicKey("GoATGVNeSXerFerPqTJ8hcED1msPWHHLxao2vwBYqowm"),
    SYSTEM_PROGRAM: new web3_js_1.PublicKey("11111111111111111111111111111111"),
};
// Solana program IDs
exports.SOLANA_PROGRAMS = {
    TOKEN22_PROGRAM: new web3_js_1.PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"),
    ASSOCIATED_TOKEN_PROGRAM: new web3_js_1.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
    SYSTEM_PROGRAM: new web3_js_1.PublicKey("11111111111111111111111111111111"),
};
// Pre-configured blockchain configurations
exports.GORBCHAIN_CONFIG = {
    name: "gorbchain",
    version: "1.0.0",
    tokenProgram: exports.GORBCHAIN_PROGRAMS.TOKEN22_PROGRAM,
    associatedTokenProgram: exports.GORBCHAIN_PROGRAMS.ASSOCIATED_TOKEN_PROGRAM,
    systemProgram: exports.GORBCHAIN_PROGRAMS.SYSTEM_PROGRAM,
    rpcUrl: "https://rpc.gorbchain.xyz",
    wsUrl: "wss://rpc.gorbchain.xyz/ws/",
    commitment: "confirmed",
};
exports.SOLANA_MAINNET_CONFIG = {
    name: "solana",
    cluster: "mainnet-beta",
    tokenProgram: exports.SOLANA_PROGRAMS.TOKEN22_PROGRAM,
    associatedTokenProgram: exports.SOLANA_PROGRAMS.ASSOCIATED_TOKEN_PROGRAM,
    systemProgram: exports.SOLANA_PROGRAMS.SYSTEM_PROGRAM,
    rpcUrl: "https://api.mainnet-beta.solana.com",
    commitment: "confirmed",
};
exports.SOLANA_DEVNET_CONFIG = {
    name: "solana",
    cluster: "devnet",
    tokenProgram: exports.SOLANA_PROGRAMS.TOKEN22_PROGRAM,
    associatedTokenProgram: exports.SOLANA_PROGRAMS.ASSOCIATED_TOKEN_PROGRAM,
    systemProgram: exports.SOLANA_PROGRAMS.SYSTEM_PROGRAM,
    rpcUrl: "https://api.devnet.solana.com",
    commitment: "confirmed",
};
// Default configurations
exports.DEFAULT_CONFIGS = {
    gorbchain: exports.GORBCHAIN_CONFIG,
    solana: exports.SOLANA_MAINNET_CONFIG,
    "solana-devnet": exports.SOLANA_DEVNET_CONFIG,
};
// Helper function to create custom blockchain configuration
function createBlockchainConfig(tokenProgram, associatedTokenProgram, rpcUrl, options) {
    return {
        name: options?.name || "custom",
        tokenProgram: typeof tokenProgram === "string" ? new web3_js_1.PublicKey(tokenProgram) : tokenProgram,
        associatedTokenProgram: typeof associatedTokenProgram === "string" ? new web3_js_1.PublicKey(associatedTokenProgram) : associatedTokenProgram,
        systemProgram: new web3_js_1.PublicKey("11111111111111111111111111111111"),
        rpcUrl,
        ...(options?.wsUrl && { wsUrl: options.wsUrl }),
        commitment: options?.commitment || "confirmed",
    };
}
// Export the main GORB object for backward compatibility
exports.GORB = {
    TOKEN22_PROGRAM: exports.GORBCHAIN_PROGRAMS.TOKEN22_PROGRAM,
    ASSOCIATED_TOKEN_PROGRAM: exports.GORBCHAIN_PROGRAMS.ASSOCIATED_TOKEN_PROGRAM,
    SYSTEM_PROGRAM: exports.GORBCHAIN_PROGRAMS.SYSTEM_PROGRAM,
    CONFIG: exports.GORBCHAIN_CONFIG,
};
//# sourceMappingURL=index.js.map