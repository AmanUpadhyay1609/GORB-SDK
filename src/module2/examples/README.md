## Module2 Examples

Example scripts demonstrating module2 capabilities.

### Tests

- `tests/encryption.test.ts` – Runs personal encryption examples, session usage, binary data, and error handling
- `tests/portfolio.test.ts` – Fetches simple token balances for a wallet

### Running with ts-node

```bash
pnpm add -D ts-node
node -e "require('ts-node').register(); require('./src/module2/examples/tests/encryption.test.ts').runAllEncryptionExamples();"
```

The main project also includes `test-module2.js` to run an end-to-end suite using your keys and the Gorbchain RPC.


