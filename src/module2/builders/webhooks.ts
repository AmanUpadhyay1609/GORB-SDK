import {
  Connection,
  PublicKey,
  LogsFilter,
  Commitment,
} from "@solana/web3.js";
import type {
  WebhookOptions,
  LogsEvent,
  SignatureEvent,
  AccountChangeEvent,
  ProgramAccountChangeEvent,
} from "../types/webhooks";

export function watchLogs(
  connection: Connection,
  filter: LogsFilter = "all",
  onEvent: (e: LogsEvent) => void,
  options?: WebhookOptions,
): () => void {
  const commitment: Commitment = options?.commitment || "confirmed";
  const id = connection.onLogs(filter, (logInfo) => {
    onEvent({ type: "logs", logs: logInfo.logs, signature: logInfo.signature });
  }, commitment);
  return () => connection.removeOnLogsListener(id);
}

export function watchSignature(
  connection: Connection,
  signature: string,
  onEvent: (e: SignatureEvent) => void,
  options?: WebhookOptions,
): () => void {
  const commitment: Commitment = options?.commitment || "confirmed";
  const id = connection.onSignature(
    signature,
    (res, ctx) => onEvent({ type: "signature", signature, slot: ctx?.slot, err: res.err }),
    commitment,
  );
  return () => connection.removeSignatureListener(id);
}

export function watchAccountChange(
  connection: Connection,
  pubkey: PublicKey,
  onEvent: (e: AccountChangeEvent) => void,
  options?: WebhookOptions,
): () => void {
  const commitment: Commitment = options?.commitment || "confirmed";
  const id = connection.onAccountChange(pubkey, (info) => {
    onEvent({ type: "account-change", pubkey: pubkey.toBase58(), data: info });
  }, commitment);
  return () => connection.removeAccountChangeListener(id);
}

export function watchProgramAccountChange(
  connection: Connection,
  programId: PublicKey,
  onEvent: (e: ProgramAccountChangeEvent) => void,
  options?: WebhookOptions,
): () => void {
  const commitment: Commitment = options?.commitment || "confirmed";
  const id = connection.onProgramAccountChange(programId, (info) => {
    onEvent({ type: "program-account-change", pubkey: info.accountId.toBase58(), data: info.accountInfo });
  }, commitment);
  return () => connection.removeProgramAccountChangeListener(id);
}


