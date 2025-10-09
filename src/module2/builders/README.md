## Module2 Builders

This folder contains additive features migrated from sdk2. They do not modify the core SDK builders and can be imported via the `Module2` namespace.

### Included

- personal-encryption.ts
  - `encryptPersonal`, `decryptPersonal`, `decryptPersonalString`, `PersonalEncryptionSession`
- direct-encryption.ts
  - `encryptDirect`, `decryptDirect`, `decryptDirectString`
- group-encryption.ts
  - `encryptGroup`, `decryptGroup`, `decryptGroupString`
- signature-groups.ts
  - `createSignatureGroupMetadata`, `encryptForSignatureGroup`, `decryptForSignatureGroup*`
- portfolio.ts
  - `getAllTokenBalances`
- webhooks.ts
  - `watchLogs`, `watchSignature`, `watchAccountChange`, `watchProgramAccountChange`

### Usage

```ts
import { Module2 } from "@gorbchain/gorb-sdk";

// Personal
const enc = await Module2.encryptPersonal("secret", base58Priv);
const txt = await Module2.decryptPersonalString(enc, base58Priv);

// Direct
const d = await Module2.encryptDirect("hi", senderPriv, recipientPub);
const clear = await Module2.decryptDirectString(d, recipientPriv, senderPub);

// Group
const g = await Module2.encryptGroup("team", senderPriv, [memberPub]);
const msg = await Module2.decryptGroupString(g, memberPriv, senderPub);

// Portfolio
const res = await Module2.getAllTokenBalances(connection, owner);

// Webhooks (wsEndpoint required on Connection)
const unsub = Module2.watchLogs(connection, "all", (e) => console.log(e.logs));
```


