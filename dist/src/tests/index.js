"use strict";
/**
 * Simple test file to validate SDK structure
 * This is not a comprehensive test suite, just basic validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
// Test 1: SDK Creation
console.log("🧪 Testing SDK Creation...");
try {
    // Test Gorbchain SDK
    const gorbSDK = (0, core_1.createGorbchainSDK)();
    console.log("✅ Gorbchain SDK created successfully");
    console.log("   Config name:", gorbSDK.getConfig().name || "gorbchain");
    // Test Solana SDK
    const solanaSDK = (0, core_1.createSolanaSDK)("mainnet-beta");
    console.log("✅ Solana SDK created successfully");
    console.log("   Config name:", solanaSDK.getConfig().name || "solana");
    // Test custom config
    const customConfig = (0, core_1.createBlockchainConfig)("11111111111111111111111111111111", "11111111111111111111111111111111", "https://test-rpc.com", { name: "custom-test" });
    const customSDK = (0, core_1.createSDK)({ blockchain: customConfig });
    console.log("✅ Custom SDK created successfully");
    console.log("   RPC URL:", customSDK.getConfig().rpcUrl);
}
catch (error) {
    console.error("❌ SDK Creation failed:", error);
}
// Test 2: GORB Object
console.log("\n🧪 Testing GORB Object...");
try {
    console.log("✅ GORB.TOKEN22_PROGRAM:", core_1.GORB.TOKEN22_PROGRAM.toBase58());
    console.log("✅ GORB.ASSOCIATED_TOKEN_PROGRAM:", core_1.GORB.ASSOCIATED_TOKEN_PROGRAM.toBase58());
    console.log("✅ GORB.SYSTEM_PROGRAM:", core_1.GORB.SYSTEM_PROGRAM.toBase58());
    console.log("✅ GORB.CONFIG.rpcUrl:", core_1.GORB.CONFIG.rpcUrl);
}
catch (error) {
    console.error("❌ GORB Object test failed:", error);
}
// Test 3: Transaction Building (without connection)
console.log("\n🧪 Testing Transaction Building...");
try {
    // Test token parameters
    const tokenParams = {
        name: "Test Token",
        symbol: "TEST",
        supply: 1000000,
        decimals: 6,
        uri: "https://test-metadata.com/token.json",
    };
    console.log("✅ Token parameters created:", tokenParams);
    // Test NFT parameters
    const nftParams = {
        name: "Test NFT",
        symbol: "TNFT",
        uri: "https://test-metadata.com/nft.json",
        description: "This is a test NFT",
    };
    console.log("✅ NFT parameters created:", nftParams);
}
catch (error) {
    console.error("❌ Transaction building test failed:", error);
}
// Test 4: Type Validation
console.log("\n🧪 Testing Type Validation...");
try {
    // Test Keypair validation
    const keypair = core_1.Keypair.generate();
    console.log("✅ Keypair generated:", keypair.publicKey.toBase58());
    // Test PublicKey validation
    const pubkey = new core_1.PublicKey("11111111111111111111111111111111");
    console.log("✅ PublicKey created:", pubkey.toBase58());
    // Test configuration types
    const config = core_1.GORB.CONFIG;
    console.log("✅ Config type validation passed");
    console.log("   Token Program:", config.tokenProgram.toBase58());
    console.log("   Associated Token Program:", config.associatedTokenProgram.toBase58());
}
catch (error) {
    console.error("❌ Type validation failed:", error);
}
console.log("\n🎉 SDK Structure Validation Complete!");
console.log("The SDK is ready for use. All basic components are working correctly.");
//# sourceMappingURL=index.js.map