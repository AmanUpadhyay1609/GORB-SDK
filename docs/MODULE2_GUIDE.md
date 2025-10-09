## Module2 Guide (sdk2 Merge)

This guide documents the features migrated from sdk2 into `src/module2`, how to use them, and working examples. Module2 is additive and does not modify existing builders; import via the `Module2` namespace from the core exports.

### Importing

```ts
import { Module2 } from "@gorbchain/gorb-sdk";

// Or import specific utilities
import { getAllTokenBalances } from "@gorbchain/gorb-sdk/dist/src/module2";
```

### What’s Included

- Encryption
  - Personal encryption (single-key)
  - Direct encryption (sender → recipient)
  - Group encryption (multi-recipient with key shares)
  - Signature groups (group metadata helpers)
- Portfolio
  - Simple balances: `getAllTokenBalances`
- Webhooks
  - `watchLogs`, `watchSignature`, `watchAccountChange`, `watchProgramAccountChange`
- Decoders & Rich Tx
  - `DecoderRegistry`, default decoders (System, Token-2022)
  - `getAndDecodeTransaction`

Note: Token/NFT minting remains in the original SDK per project decision.

---

## Encryption

All encryption returns an `EncryptionResult` with `encryptedData`, `method`, and `metadata`. Decryptors accept the same metadata and appropriate keys.

### Personal Encryption (single key)

```ts
const data = "secret message";
const privateKeyBase58 = "<base58-secret-key>"; // 32 or 64 bytes

const enc = await Module2.encryptPersonal(data, privateKeyBase58, { compress: true });
const dec = await Module2.decryptPersonalString(enc, privateKeyBase58);
```

Session-based personal encryption:

```ts
const session = new Module2.PersonalEncryptionSession(privateKeyBase58);
const enc1 = await session.encrypt("msg1");
const enc2 = await session.encrypt("msg2");
```

### Direct Encryption (sender → recipient)

```ts
// senderPriv: base58 private key; recipientPub: base58 public key
const direct = await Module2.encryptDirect("hello", senderPriv, recipientPub, { compress: true });
const clear  = await Module2.decryptDirectString(direct, recipientPriv, senderPub);
```

Direct encryption uses a deterministic symmetric secret derived from both public keys, ensuring interoperability.

### Group Encryption (multi-recipient)

```ts
const recipients = [recipientPub1, recipientPub2];
const encGroup = await Module2.encryptGroup("team msg", senderPriv, recipients, { compress: true });

// Each recipient can decrypt with their private key and the sender's public key
const dec1 = await Module2.decryptGroupString(encGroup, recipientPriv1, senderPub);
const dec2 = await Module2.decryptGroupString(encGroup, recipientPriv2, senderPub);
``;

### Signature Groups (metadata helpers)

```ts
const meta = Module2.createSignatureGroupMetadata({
  name: "MyGroup",
  creatorPrivateKey: senderPriv,
  members: [{ publicKey: recipientPub, role: "member" }],
  permissions: {
    allowDynamicMembership: true,
    requireSignatureVerification: false,
    maxMembers: 0,
    allowKeyRotation: true,
    autoExpireInactiveMembers: false,
    inactivityThresholdDays: 0,
  },
});

const enc = await Module2.encryptForSignatureGroup("hi", senderPriv, [recipientPub]);
const dec = await Module2.decryptForSignatureGroupString(enc, recipientPriv, senderPub);
```

---

## Portfolio (Simple Balances)

Fetch non-zero token balances for a wallet on Gorbchain (Token-2022 by default):

```ts
import { Connection, PublicKey } from "@solana/web3.js";
import { GORBCHAIN_CONFIG } from "@gorbchain/gorb-sdk/dist/src/constants";

const connection = new Connection(GORBCHAIN_CONFIG.rpcUrl, {
  commitment: GORBCHAIN_CONFIG.commitment,
});

const res = await Module2.getAllTokenBalances(connection, new PublicKey(owner));
console.log(res.summary, res.holdings.slice(0, 5));
```

Options:

```ts
await Module2.getAllTokenBalances(connection, owner, {
  includePrograms: [GORBCHAIN_CONFIG.tokenProgram.toBase58()],
});
```

---

## Webhooks

You must pass the `wsEndpoint` when constructing `Connection`.

```ts
import { Connection } from "@solana/web3.js";
import { GORBCHAIN_CONFIG } from "@gorbchain/gorb-sdk/dist/src/constants";

const connection = new Connection(GORBCHAIN_CONFIG.rpcUrl, {
  commitment: GORBCHAIN_CONFIG.commitment,
  wsEndpoint: GORBCHAIN_CONFIG.wsUrl,
});

const unsubscribe = Module2.watchLogs(connection, "all", (e) => {
  console.log("logs:", e.logs.slice(0, 2));
});

// later
unsubscribe();
```

Other watchers:

```ts
Module2.watchSignature(connection, signature, (e) => { /* ... */ });
Module2.watchAccountChange(connection, pubkey, (e) => { /* ... */ });
Module2.watchProgramAccountChange(connection, programId, (e) => { /* ... */ });
```

---

## Decoders & Rich Transaction Decoding

Create a registry and decode instructions, or use the helper to fetch and decode a transaction.

```ts
import { getAndDecodeTransaction } from "@gorbchain/gorb-sdk/dist/src/module2";
import { Connection, PublicKey } from "@solana/web3.js";
import { GORBCHAIN_CONFIG } from "@gorbchain/gorb-sdk/dist/src/constants";

const connection = new Connection(GORBCHAIN_CONFIG.rpcUrl, { commitment: GORBCHAIN_CONFIG.commitment });
const signatures = await connection.getSignaturesForAddress(new PublicKey(owner), { limit: 1 });
if (signatures.length) {
  const decoded = await getAndDecodeTransaction(connection, signatures[0].signature);
  console.log(decoded?.decoded.map(ix => ({ type: ix.type, program: ix.programId })));
}
```

Default decoders registered:

- System Program (minimal heuristic)
- Token-2022 (Gorbchain program ID) with discriminator-only classification

You can register more decoders via `DecoderRegistry` and pass that into your own decode logic if needed.

---

## End-to-End Tests (Local)

We provide a simple Node test script that uses the `keypair.ts` keys and Gorbchain RPC:

```bash
pnpm run build
node test-module2.js
```

This runs:

- Personal encryption test
- Portfolio balances for your address
- Direct/group encryption tests between your two keys
- Transaction decode on your most recent signature
- Webhook logs connectivity (short run)

---

## Notes & Best Practices

- Keep private keys secure; examples use base58 strings for convenience.
- For webhooks, always provide `wsEndpoint` to `Connection`.
- Decoders are intentionally minimal; extend for richer program-specific decoding.
- Module2 is additive and optional; existing SDK patterns (builders, signing, submission) remain unchanged.


