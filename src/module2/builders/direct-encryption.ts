import { PublicKey } from "@solana/web3.js";
import { bytesToBase58, base58ToBytes } from "../types/base58";
import type {
  EncryptionResult,
  DirectEncryptionMetadata,
  EncryptionOptions,
} from "../types/encryption";
import { EncryptionMethod } from "../types/encryption";
import {
  encryptAES,
  decryptAES,
  deriveSymmetricSecret,
  stringToBytes,
  bytesToString,
  combineBuffers,
  splitBuffer,
  getCurrentTimestamp,
  compressData,
  decompressData,
  IV_SIZE,
  AUTH_TAG_SIZE,
} from "../types/encryption-utils";

function toPublicKeyBytes(pubkey: string | Uint8Array): Uint8Array {
  if (typeof pubkey === "string") return new PublicKey(pubkey).toBytes();
  return pubkey;
}

function toPrivateKeyBytes(priv: string | Uint8Array): Uint8Array {
  return typeof priv === "string" ? base58ToBytes(priv) : priv;
}

export async function encryptDirect(
  data: string | Uint8Array,
  senderPrivateKey: string | Uint8Array,
  recipientPublicKey: string | Uint8Array,
  options?: EncryptionOptions,
): Promise<EncryptionResult> {
  let dataBytes = typeof data === "string" ? stringToBytes(data) : data;
  if (options?.compress) dataBytes = await compressData(dataBytes);

  const senderPriv = toPrivateKeyBytes(senderPrivateKey);
  const recipientPub = toPublicKeyBytes(recipientPublicKey);

  // Derive shared secret deterministically from public keys for compatibility
  const senderPub = new PublicKey(senderPriv.slice(-32)).toBytes();
  const sharedSecret = deriveSymmetricSecret(senderPub, recipientPub);

  // Encrypt data with shared secret
  const { encrypted, iv, authTag } = encryptAES(dataBytes, sharedSecret);
  const combined = combineBuffers(iv, authTag, encrypted);

  const metadata: DirectEncryptionMetadata = {
    senderPublicKey: bytesToBase58(new PublicKey(senderPriv.slice(-32)).toBytes()),
    recipientPublicKey: bytesToBase58(recipientPub),
    nonce: bytesToBase58(iv),
    timestamp: getCurrentTimestamp(),
    version: "1.0.0",
  };
  if (options?.compress) (metadata as any).compressed = true;

  return {
    encryptedData: bytesToBase58(combined),
    method: EncryptionMethod.DIRECT,
    metadata,
  };
}

export async function decryptDirect(
  encryptionResult: EncryptionResult,
  recipientPrivateKey: string | Uint8Array,
  senderPublicKey: string | Uint8Array,
): Promise<Uint8Array> {
  if (encryptionResult.method !== EncryptionMethod.DIRECT) {
    throw new Error("Invalid encryption method for direct decryption");
  }

  const meta = encryptionResult.metadata as DirectEncryptionMetadata;
  const combined = base58ToBytes(encryptionResult.encryptedData);
  const [iv, authTag, encrypted] = splitBuffer(combined, IV_SIZE, AUTH_TAG_SIZE);
  if (!iv || !authTag || !encrypted) throw new Error("Malformed payload");

  // Validate nonce
  if (meta.nonce !== bytesToBase58(iv as Uint8Array)) {
    throw new Error("Metadata tampering detected: nonce mismatch");
  }

  const recipPriv = toPrivateKeyBytes(recipientPrivateKey);
  let senderPub = toPublicKeyBytes(senderPublicKey);

  // First attempt with provided sender public key
  let sharedSecret = deriveSymmetricSecret(new PublicKey(recipPriv.slice(-32)).toBytes(), senderPub);
  let decrypted: Uint8Array;
  try {
    decrypted = decryptAES(encrypted as Uint8Array, sharedSecret, iv as Uint8Array, authTag as Uint8Array);
  } catch {
    // Retry with metadata senderPublicKey if available
    const metaSender = (meta.senderPublicKey ? toPublicKeyBytes(meta.senderPublicKey) : null);
    if (!metaSender) throw new Error("Decryption failed: Invalid key or corrupted data");
    senderPub = metaSender;
    sharedSecret = deriveSymmetricSecret(new PublicKey(recipPriv.slice(-32)).toBytes(), senderPub);
    decrypted = decryptAES(encrypted as Uint8Array, sharedSecret, iv as Uint8Array, authTag as Uint8Array);
  }
  if ((meta as any).compressed) decrypted = await decompressData(decrypted);
  return decrypted;
}

export async function decryptDirectString(
  encryptionResult: EncryptionResult,
  recipientPrivateKey: string | Uint8Array,
  senderPublicKey: string | Uint8Array,
): Promise<string> {
  const data = await decryptDirect(encryptionResult, recipientPrivateKey, senderPublicKey);
  return bytesToString(data);
}


