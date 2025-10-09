import { Connection, PublicKey } from "@solana/web3.js";
import { GORBCHAIN_CONFIG } from "../../../constants";
import { getAllTokenBalances } from "../../builders/portfolio";

// Load user public keys from keypair.ts by regex (simple loader)
function loadPublicKeys(): string[] {
  const fs = require('fs');
  const text = fs.readFileSync('keypair.ts','utf8');
  const regex = /"publicKey"\s*:\s*"([1-9A-HJ-NP-Za-km-z]+)"/g;
  const keys: string[] = [];
  let m;
  while ((m = regex.exec(text)) !== null) keys.push(m[1]);
  return keys;
}

export async function runPortfolioExample() {
  console.log("🔎 Module2 Portfolio Example");
  const endpoint = GORBCHAIN_CONFIG.rpcUrl;
  const connection = new Connection(endpoint, { commitment: GORBCHAIN_CONFIG.commitment });

  const [owner] = loadPublicKeys();
  console.log("👤 Using owner:", owner);

  const res = await getAllTokenBalances(connection, new PublicKey(owner));
  console.log("✅ Holdings fetched:", res.summary);
  res.holdings.slice(0, 10).forEach((h, i) => {
    console.log(`#${i+1} mint=${h.mint} balance=${h.balanceFormatted} (decimals=${h.decimals})`);
  });
}


