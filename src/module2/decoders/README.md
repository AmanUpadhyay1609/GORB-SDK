## Module2 Decoders

Lightweight decoder registry and minimal decoders for Gorbchain.

### Files

- `registry.ts` – Simple registry with `register(programId, decoder)` and `decode(ix)`
- `system.ts` – Minimal System Program decoder (heuristic)
- `splToken.ts` – Token-2022 (Gorbchain) discriminator-only classification

### Helper

- `../utils/getAndDecodeTransaction.ts` – Fetches a transaction and decodes compiled instructions using the registry.

### Usage

```ts
import { DecoderRegistry } from "@gorbchain/gorb-sdk/dist/src/module2";
import { decodeSystemInstruction, SystemProgramId } from "@gorbchain/gorb-sdk/dist/src/module2";

const reg = new DecoderRegistry();
reg.register(SystemProgramId, decodeSystemInstruction);
// reg.register(TOKEN22_PROGRAM_ID, decodeSPLTokenInstruction);

const decoded = reg.decode({ programId, data, accounts });
```

Extend by adding new program decoders and registering them in your application.

