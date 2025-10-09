/**
 * Encryption Examples and Tests
 * Demonstrates personal encryption functionality
 */

import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import {
  encryptPersonal,
  decryptPersonal,
  decryptPersonalString,
  PersonalEncryptionSession,
} from "../../index";
import type { EncryptionResult } from "../../index";

/**
 * Example 1: Basic personal encryption and decryption
 */
export async function basicPersonalEncryption() {
  console.log("🔐 Basic Personal Encryption Example");
  
  // Generate a test keypair
  const keypair = Keypair.generate();
  const privateKey = bs58.encode(keypair.secretKey);
  
  // Data to encrypt
  const sensitiveData = "This is my secret message that only I can decrypt!";
  
  try {
    // Encrypt the data
    console.log("📝 Encrypting data...");
    const encrypted = await encryptPersonal(sensitiveData, privateKey, {
      compress: true,
      customMetadata: { purpose: "test" }
    });
    
    console.log("✅ Encryption successful!");
    console.log("📊 Encryption details:", {
      method: encrypted.method,
      dataLength: encrypted.encryptedData.length,
      timestamp: new Date(encrypted.metadata.timestamp * 1000).toISOString(),
      version: encrypted.metadata.version,
      compressed: (encrypted.metadata as any).compressed,
      customPurpose: (encrypted.metadata as any).purpose
    });
    
    // Decrypt the data
    console.log("🔓 Decrypting data...");
    const decrypted = await decryptPersonalString(encrypted, privateKey);
    
    console.log("✅ Decryption successful!");
    console.log("📝 Original data:", sensitiveData);
    console.log("📝 Decrypted data:", decrypted);
    console.log("✅ Data matches:", sensitiveData === decrypted);
    
  } catch (error: any) {
    console.error("❌ Encryption failed:", error.message);
  }
}

/**
 * Example 2: Personal encryption session for multiple operations
 */
export async function personalEncryptionSession() {
  console.log("\n🔐 Personal Encryption Session Example");
  
  // Generate a test keypair
  const keypair = Keypair.generate();
  const privateKey = bs58.encode(keypair.secretKey);
  
  try {
    // Create encryption session
    console.log("📝 Creating encryption session...");
    const session = new PersonalEncryptionSession(privateKey);
    const sessionInfo = session.getSessionInfo();
    
    console.log("✅ Session created!");
    console.log("📊 Session info:", sessionInfo);
    
    // Encrypt multiple pieces of data
    const messages: string[] = [
      "First secret message",
      "Second secret message", 
      "Third secret message"
    ];
    
    const encryptedMessages: EncryptionResult[] = [];
    
    for (let i = 0; i < messages.length; i++) {
      console.log(`📝 Encrypting message ${i + 1}...`);
      const encrypted = await session.encrypt(messages[i]!);
      encryptedMessages.push(encrypted);
      console.log(`✅ Message ${i + 1} encrypted`);
    }
    
    // Decrypt all messages
    console.log("🔓 Decrypting all messages...");
    for (let i = 0; i < encryptedMessages.length; i++) {
      const decrypted = await decryptPersonalString(encryptedMessages[i]!, privateKey);
      console.log(`📝 Message ${i + 1}:`, decrypted);
      console.log(`✅ Matches original:`, messages[i]! === decrypted);
    }
    
  } catch (error: any) {
    console.error("❌ Session encryption failed:", error.message);
  }
}

/**
 * Example 3: Binary data encryption
 */
export async function binaryDataEncryption() {
  console.log("\n🔐 Binary Data Encryption Example");
  
  // Generate a test keypair
  const keypair = Keypair.generate();
  const privateKey = bs58.encode(keypair.secretKey);
  
  // Create binary data (simulate file content)
  const binaryData = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 255, 0, 128]);
  
  try {
    console.log("📝 Encrypting binary data...");
    console.log("📊 Original data length:", binaryData.length);
    console.log("📊 Original data (first 10 bytes):", Array.from(binaryData.slice(0, 10)));
    
    // Encrypt binary data
    const encrypted = await encryptPersonal(binaryData, privateKey);
    
    console.log("✅ Binary data encrypted!");
    console.log("📊 Encrypted data length:", encrypted.encryptedData.length);
    
    // Decrypt binary data
    console.log("🔓 Decrypting binary data...");
    const decrypted = await decryptPersonal(encrypted, privateKey);
    
    console.log("✅ Binary data decrypted!");
    console.log("📊 Decrypted data length:", decrypted.length);
    console.log("📊 Decrypted data (first 10 bytes):", Array.from(decrypted.slice(0, 10)));
    console.log("✅ Data matches:", 
      binaryData.length === decrypted.length && 
      binaryData.every((byte, i) => byte === decrypted[i])
    );
    
  } catch (error: any) {
    console.error("❌ Binary encryption failed:", error.message);
  }
}

/**
 * Example 4: Error handling and validation
 */
export async function encryptionErrorHandling() {
  console.log("\n🔐 Encryption Error Handling Example");
  
  try {
    // Test with invalid private key
    console.log("📝 Testing with invalid private key...");
    try {
      await encryptPersonal("test data", "invalid-key");
      console.log("❌ Should have failed with invalid key");
    } catch (error: any) {
      console.log("✅ Correctly caught invalid key error:", error.message);
    }
    
    // Test with empty data
    console.log("📝 Testing with empty data...");
  const keypair = Keypair.generate();
  const privateKey = bs58.encode(keypair.secretKey);
    
    const encrypted = await encryptPersonal("", privateKey);
    const decrypted = await decryptPersonalString(encrypted, privateKey);
    console.log("✅ Empty string encryption/decryption works:", decrypted === "");
    
    // Test with very long data
    console.log("📝 Testing with large data...");
    const largeData = "A".repeat(10000); // 10KB string
    const largeEncrypted = await encryptPersonal(largeData, privateKey);
    const largeDecrypted = await decryptPersonalString(largeEncrypted, privateKey);
    console.log("✅ Large data encryption/decryption works:", largeData === largeDecrypted);
    console.log("📊 Compression ratio:", 
      (largeEncrypted.encryptedData.length / largeData.length * 100).toFixed(2) + "%"
    );
    
  } catch (error: any) {
    console.error("❌ Error handling test failed:", error.message);
  }
}

/**
 * Run all encryption examples
 */
export async function runAllEncryptionExamples() {
  console.log("🚀 Starting Module2 Encryption Examples\n");
  
  await basicPersonalEncryption();
  await personalEncryptionSession();
  await binaryDataEncryption();
  await encryptionErrorHandling();
  
  console.log("\n✅ All encryption examples completed!");
}
