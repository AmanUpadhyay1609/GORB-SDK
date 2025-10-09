import type { Commitment } from "@solana/web3.js";

export type WebhookEventType =
  | "signature"
  | "account-change"
  | "program-account-change"
  | "logs";

export interface WebhookOptions {
  commitment?: Commitment;
  pollIntervalMs?: number; // for polling-based watchers
  maxEvents?: number; // auto-stop after this many events (optional)
}

export interface SignatureEvent {
  type: "signature";
  signature: string;
  slot?: number;
  err?: any;
}

export interface AccountChangeEvent<T = any> {
  type: "account-change";
  pubkey: string;
  data: T;
}

export interface ProgramAccountChangeEvent<T = any> {
  type: "program-account-change";
  pubkey: string;
  data: T;
}

export interface LogsEvent {
  type: "logs";
  logs: string[];
  signature?: string;
}

export type WebhookEvent =
  | SignatureEvent
  | AccountChangeEvent
  | ProgramAccountChangeEvent
  | LogsEvent;


