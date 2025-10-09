import { Connection, PublicKey } from "@solana/web3.js";
import { GORBCHAIN_CONFIG } from "../../constants";
import type {
  SimpleTokenAccount,
  TokenBalanceResponse,
  PortfolioOptions,
} from "../types/portfolio";

// Helper to safely read nested fields
function safeGet(obj: any, path: string[], fallback: any) {
  let cur = obj;
  for (const p of path) {
    if (cur == null) return fallback;
    cur = cur[p];
  }
  return cur == null ? fallback : cur;
}

export async function getAllTokenBalances(
  connection: Connection,
  owner: PublicKey | string,
  options?: PortfolioOptions,
): Promise<TokenBalanceResponse> {
  const ownerStr = typeof owner === "string" ? owner : owner.toBase58();

  // Determine programs to scan: default to Gorbchain Token-2022
  const programs: string[] = options?.includePrograms?.length
    ? options.includePrograms
    : [GORBCHAIN_CONFIG.tokenProgram.toBase58()];

  const holdings: SimpleTokenAccount[] = [];
  const seenAccounts = new Set<string>();

  for (const programId of programs) {
    try {
      const resp = await connection.getTokenAccountsByOwner(new PublicKey(ownerStr), { programId: new PublicKey(programId) }, { commitment: "confirmed" });
      for (const { pubkey } of resp.value) {
        if (seenAccounts.has(pubkey.toBase58())) continue;
        seenAccounts.add(pubkey.toBase58());

        const parsed = await connection.getParsedAccountInfo(pubkey);
        const info = safeGet(parsed, ["value", "data", "parsed", "info"], null);
        if (!info) continue;

        const mint = String(info.mint);
        const ownerPk = String(info.owner);
        const tokenAmount = info.tokenAmount || {};
        const decimals = Number(tokenAmount.decimals ?? 0);
        const amount = String(tokenAmount.amount ?? "0");
        const uiAmount = Number(tokenAmount.uiAmount ?? 0);
        const uiAmountString = String(tokenAmount.uiAmountString ?? `${uiAmount}`);
        const state = String(info.state ?? "");

        holdings.push({
          tokenAccount: pubkey.toBase58(),
          mint,
          owner: ownerPk,
          decimals,
          balanceRaw: amount,
          balanceUi: uiAmount,
          balanceFormatted: uiAmountString,
          programId,
          isFrozen: state === "frozen",
        });
      }
    } catch (e) {
      // Skip failing program to keep portfolio robust
      continue;
    }
  }

  const nonZero = holdings.filter(h => parseFloat(h.balanceRaw) > 0);
  const uniqueMints = new Set(holdings.map(h => h.mint)).size;

  return {
    holdings: nonZero, // return non-zero balances by default
    summary: {
      totalAccounts: holdings.length,
      nonZeroAccounts: nonZero.length,
      uniqueMints,
    },
  };
}


