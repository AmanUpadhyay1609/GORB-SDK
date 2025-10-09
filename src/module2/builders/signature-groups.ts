import { PublicKey } from "@solana/web3.js";
import { base58ToBytes } from "../types/base58";
import type {
  SignatureGroupMetadata,
  GroupMember,
  MemberRole,
  GroupPermissions,
  EncryptionResult,
  EncryptionOptions,
} from "../types/encryption";
import { generateId } from "../types/encryption-utils";
import { encryptGroup, decryptGroup, decryptGroupString } from "./group-encryption";

export interface CreateSignatureGroupParams {
  name: string;
  creatorPrivateKey: string | Uint8Array;
  members: Array<{ publicKey: string; role: MemberRole }>;
  permissions: GroupPermissions;
}

export function createSignatureGroupMetadata(
  params: CreateSignatureGroupParams,
): SignatureGroupMetadata {
  const creatorPriv = typeof params.creatorPrivateKey === "string" ? base58ToBytes(params.creatorPrivateKey) : params.creatorPrivateKey;
  const creatorPub = new PublicKey(creatorPriv.slice(-32)).toBase58();
  const groupId = generateId(params.name, creatorPub, String(Date.now()));

  const members: GroupMember[] = params.members.map(m => ({
    publicKey: m.publicKey,
    role: m.role,
    joinedAt: Math.floor(Date.now()/1000),
    addedBy: creatorPub,
    permissions: {
      canDecrypt: true,
      canEncrypt: true,
      canAddMembers: m.role !== "viewer",
      canRemoveMembers: m.role === "owner" || m.role === "admin",
      canRotateKeys: m.role === "owner" || m.role === "admin",
    },
  }));

  return {
    groupId,
    groupName: params.name,
    groupSignature: generateId(groupId, params.name),
    members,
    permissions: params.permissions,
    epochs: [],
    keyShares: [],
    creatorPublicKey: creatorPub,
    nonce: "",
    timestamp: Math.floor(Date.now()/1000),
    version: "1.0.0",
  };
}

export async function encryptForSignatureGroup(
  data: string | Uint8Array,
  creatorPrivateKey: string | Uint8Array,
  memberPublicKeys: string[],
  options?: EncryptionOptions,
): Promise<EncryptionResult> {
  // Reuse group encryption; signature metadata is carried in app-level context
  return encryptGroup(data, creatorPrivateKey, memberPublicKeys, options);
}

export const decryptForSignatureGroup = decryptGroup;
export const decryptForSignatureGroupString = decryptGroupString;


