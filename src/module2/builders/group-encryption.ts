import { PublicKey } from "@solana/web3.js";
import { bytesToBase58, base58ToBytes } from "../types/base58";
import type {
  EncryptionResult,
  GroupEncryptionMetadata,
  KeyShare,
  EncryptionOptions,
} from "../types/encryption";
import { EncryptionMethod } from "../types/encryption";
import {
  encryptAES,
  decryptAES,
  deriveSymmetricSecret,
  stringToBytes,
  bytesToString,
  generateRandomBytes,
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

/**
 * Group encryption: encrypt once, produce key shares for each recipient.
 * Each recipient derives the shared secret with the sender to decrypt the data key.
 */
export async function encryptGroup(
  data: string | Uint8Array,
  senderPrivateKey: string | Uint8Array,
  recipientPublicKeys: Array<string | Uint8Array>,
  options?: EncryptionOptions,
): Promise<EncryptionResult> {
  let dataBytes = typeof data === "string" ? stringToBytes(data) : data;
  if (options?.compress) dataBytes = await compressData(dataBytes);

  // Generate a random data key to encrypt the payload once
  const dataKey = generateRandomBytes(32);
  const { encrypted, iv, authTag } = encryptAES(dataBytes, dataKey);
  const combined = combineBuffers(iv, authTag, encrypted);

  // Create key shares per recipient by deriving per-recipient secret and wrapping the data key
  const senderPriv = toPrivateKeyBytes(senderPrivateKey);
  const keyShares: KeyShare[] = [];

  for (const recipient of recipientPublicKeys) {
    const recipPub = toPublicKeyBytes(recipient);
    // Deterministic shared secret from public keys for wrapping the data key
    const secret = deriveSymmetricSecret(new PublicKey(senderPriv.slice(-32)).toBytes(), recipPub);
    const wrapped = encryptAES(dataKey, secret);
    const wrappedCombined = combineBuffers(wrapped.iv, wrapped.authTag, wrapped.encrypted);
    keyShares.push({
      recipientPublicKey: bytesToBase58(recipPub),
      encryptedShare: bytesToBase58(wrappedCombined),
      createdAt: getCurrentTimestamp(),
    });
  }

  const metadata: GroupEncryptionMetadata = {
    groupId: bytesToBase58(generateRandomBytes(16)),
    keyShares,
    creatorPublicKey: bytesToBase58(new PublicKey(senderPriv.slice(-32)).toBytes()),
    nonce: bytesToBase58(iv),
    timestamp: getCurrentTimestamp(),
    version: "1.0.0",
  };
  if (options?.compress) (metadata as any).compressed = true;

  return {
    encryptedData: bytesToBase58(combined),
    method: EncryptionMethod.GROUP,
    metadata,
  };
}

export async function decryptGroup(
  encryptionResult: EncryptionResult,
  recipientPrivateKey: string | Uint8Array,
  senderPublicKey: string | Uint8Array,
): Promise<Uint8Array> {
  if (encryptionResult.method !== EncryptionMethod.GROUP) {
    throw new Error("Invalid encryption method for group decryption");
  }

  const meta = encryptionResult.metadata as GroupEncryptionMetadata;
  const combined = base58ToBytes(encryptionResult.encryptedData);
  const [iv, authTag, encrypted] = splitBuffer(combined, IV_SIZE, AUTH_TAG_SIZE);
  if (!iv || !authTag || !encrypted) throw new Error("Malformed payload");

  // Validate nonce
  if (meta.nonce !== bytesToBase58(iv as Uint8Array)) {
    throw new Error("Metadata tampering detected: nonce mismatch");
  }

  // Find this recipient's key share
  const recipPriv = toPrivateKeyBytes(recipientPrivateKey);
  const senderPub = toPublicKeyBytes(senderPublicKey);
  const recipPub58 = bytesToBase58(new PublicKey(recipPriv.slice(-32)).toBytes());
  const share = meta.keyShares.find(s => s.recipientPublicKey === recipPub58);
  if (!share) throw new Error("No key share for recipient");

  // Unwrap data key
  const shareCombined = base58ToBytes(share.encryptedShare);
  const [siv, sauthTag, sdata] = splitBuffer(shareCombined, IV_SIZE, AUTH_TAG_SIZE);
  if (!siv || !sauthTag || !sdata) throw new Error("Malformed key share");
  const secret = deriveSymmetricSecret(new PublicKey(recipPriv.slice(-32)).toBytes(), senderPub);
  const dataKey = decryptAES(sdata as Uint8Array, secret, siv as Uint8Array, sauthTag as Uint8Array);

  // Decrypt payload
  let decrypted = decryptAES(encrypted as Uint8Array, dataKey, iv as Uint8Array, authTag as Uint8Array);
  if ((meta as any).compressed) decrypted = await decompressData(decrypted);
  return decrypted;
}

export async function decryptGroupString(
  encryptionResult: EncryptionResult,
  recipientPrivateKey: string | Uint8Array,
  senderPublicKey: string | Uint8Array,
): Promise<string> {
  const data = await decryptGroup(encryptionResult, recipientPrivateKey, senderPublicKey);
  return bytesToString(data);
}


