import { Connection } from "@solana/web3.js";
import { DecoderRegistry } from "../decoders/registry";
import { decodeSystemInstruction, SystemProgramId } from "../decoders/system";
import { decodeSPLTokenInstruction, TOKEN22_PROGRAM_ID } from "../decoders/splToken";

export async function getAndDecodeTransaction(
  connection: Connection,
  signature: string,
) {
  const tx = await connection.getTransaction(signature, { maxSupportedTransactionVersion: 0, commitment: "confirmed" });
  if (!tx) return null;

  const registry = new DecoderRegistry();
  registry.register(SystemProgramId, decodeSystemInstruction);
  registry.register(TOKEN22_PROGRAM_ID, decodeSPLTokenInstruction);

  const accountKeys = tx.transaction.message.getAccountKeys().staticAccountKeys.map(k => k.toBase58());
  const decoded = (tx.transaction.message.compiledInstructions || []).map((ci: any) => {
    const programId = String(accountKeys[ci.programIdIndex] ?? "unknown");
    const data = ci.data instanceof Uint8Array ? ci.data : Buffer.from(ci.data, 'base64');
    const accounts = (ci.accountKeyIndexes || ci.accounts || []).map((i: number) => accountKeys[i]);
    return registry.decode({ programId, data, accounts });
  });

  return {
    slot: tx.slot,
    meta: tx.meta,
    decoded,
  };
}


