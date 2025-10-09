import bs58 from "bs58";

export function bytesToBase58(bytes: Uint8Array): string {
  return bs58.encode(Buffer.from(bytes));
}

export function base58ToBytes(text: string): Uint8Array {
  return new Uint8Array(bs58.decode(text));
}


