# Migration Guide: From Original Implementation to SDK

This guide shows how to migrate from your original `createTokenWithWallet.ts` and `mint-functions.ts` to the new modular SDK.

## Before (Original Implementation)

```typescript
// Old way - tightly coupled with wallet and signing
import { createTokenWithWallet } from './lib/createTokenWithWallet';
import { mintGorbNFTToken22SingleTx } from './lib/mint-functions';

// Create token
const result = await createTokenWithWallet({
  connection: new Connection("https://rpc.gorbchain.xyz"),
  wallet: walletObject,
  name: "My Token",
  symbol: "MTK",
  supply: 1000000,
  decimals: 6,
  uri: "https://my-metadata.com/token.json",
  freezeAuth: null
});

// Create NFT
const nftResult = await mintGorbNFTToken22SingleTx({
  connection: new Connection("https://rpc.gorbchain.xyz"),
  wallet: walletObject,
  name: "My NFT",
  symbol: "MNFT",
  uri: "https://my-metadata.com/nft.json",
  description: "My awesome NFT"
});
```

## After (New SDK)

```typescript
// New way - modular and flexible
import { createGorbchainSDK, signWithWalletAdapter } from './sdk';

const sdk = createGorbchainSDK();

// Create token transaction (no signing)
const tokenResult = await sdk.createTokenTransaction({
  name: "My Token",
  symbol: "MTK",
  supply: 1000000,
  decimals: 6,
  uri: "https://my-metadata.com/token.json",
  freezeAuthority: null
});

// Update transaction with actual payer
const updatedTx = sdk.updateTransactionPayer(tokenResult.transaction, wallet.publicKey);

// Sign with wallet and mint keypair
const signedTx = await sdk.signWithWalletAndKeypair(updatedTx, wallet, tokenResult.mintKeypair);

// Submit transaction
const submitResult = await sdk.submitTransaction(signedTx);

// Create NFT transaction (no signing)
const nftResult = await sdk.createNFTTransaction({
  name: "My NFT",
  symbol: "MNFT",
  uri: "https://my-metadata.com/nft.json",
  description: "My awesome NFT"
});

// Sign and submit NFT
const updatedNftTx = sdk.updateTransactionPayer(nftResult.transaction, wallet.publicKey);
const signedNftTx = await sdk.signWithWalletAndKeypair(updatedNftTx, wallet, nftResult.mintKeypair);
const nftSubmitResult = await sdk.submitTransaction(signedNftTx);
```

## Key Benefits

### 1. **Separation of Concerns**
- **Transaction Building**: SDK only builds raw transactions
- **Signing**: You choose how to sign (keypair, wallet adapter, etc.)
- **Submission**: You control when and how to submit

### 2. **Multi-Blockchain Support**
```typescript
// Gorbchain
const gorbSDK = createGorbchainSDK();

// Solana mainnet
const solanaSDK = createSolanaSDK("mainnet-beta");

// Solana devnet
const devnetSDK = createSolanaSDK("devnet");

// Custom blockchain
const customSDK = createSDK({
  blockchain: createBlockchainConfig(
    "YourTokenProgramId",
    "YourAssociatedTokenProgramId",
    "https://your-rpc.com"
  )
});
```

### 3. **Flexible Signing Options**
```typescript
// Option 1: Keypair only
const signedTx = await sdk.signWithKeypair(transaction, keypair);

// Option 2: Wallet adapter only
const signedTx = await sdk.signWithWalletAdapter(transaction, wallet);

// Option 3: Both wallet and mint keypair
const signedTx = await sdk.signWithWalletAndKeypair(transaction, wallet, mintKeypair);
```

### 4. **Better Error Handling**
```typescript
import { SDKError, TransactionError, SigningError } from './sdk';

try {
  const result = await sdk.createTokenTransaction(params);
} catch (error) {
  if (error instanceof SDKError) {
    console.error("SDK Error:", error.message);
  } else if (error instanceof TransactionError) {
    console.error("Transaction Error:", error.message);
  } else if (error instanceof SigningError) {
    console.error("Signing Error:", error.message);
  }
}
```

### 5. **Transaction Simulation**
```typescript
// Simulate before submitting
const simulation = await sdk.simulateTransaction(transaction);
if (!simulation.success) {
  console.error("Simulation failed:", simulation.error);
  return;
}

// Then submit
const result = await sdk.submitTransaction(transaction);
```

## Migration Steps

### Step 1: Install Dependencies
```bash
cd sdk
npm install
```

### Step 2: Update Imports
Replace your old imports with the new SDK imports.

### Step 3: Refactor Token Creation
1. Use `createTokenTransaction()` instead of `createTokenWithWallet()`
2. Handle signing separately
3. Handle submission separately

### Step 4: Refactor NFT Creation
1. Use `createNFTTransaction()` instead of `mintGorbNFTToken22SingleTx()`
2. Handle signing separately
3. Handle submission separately

### Step 5: Update Error Handling
Use the new error types for better error handling.

## Backward Compatibility

The SDK maintains backward compatibility through the `GORB` object:

```typescript
import { GORB } from './sdk';

// Still works
console.log(GORB.TOKEN22_PROGRAM);
console.log(GORB.ASSOCIATED_TOKEN_PROGRAM);
console.log(GORB.SYSTEM_PROGRAM);
console.log(GORB.CONFIG);
```

## Advanced Usage

### Batch Operations
```typescript
const tokens = [
  { name: "Token 1", symbol: "TK1", supply: 1000000, decimals: 6, uri: "https://token1.com" },
  { name: "Token 2", symbol: "TK2", supply: 2000000, decimals: 9, uri: "https://token2.com" },
];

const results = [];
for (const token of tokens) {
  const result = await sdk.createTokenTransaction(token);
  results.push(result);
}
```

### Custom Configuration
```typescript
const customConfig = createBlockchainConfig(
  "YourTokenProgramId",
  "YourAssociatedTokenProgramId",
  "https://your-rpc.com",
  {
    wsUrl: "wss://your-ws.com",
    commitment: "confirmed",
    name: "custom-chain"
  }
);

const sdk = createSDK({ blockchain: customConfig });
```

## Testing

The SDK includes comprehensive tests. Run them with:

```bash
cd sdk
npx ts-node test.ts
```

## Conclusion

The new SDK provides:
- ✅ **Modularity**: Separate transaction building, signing, and submission
- ✅ **Flexibility**: Support for multiple blockchains and signing methods
- ✅ **Type Safety**: Full TypeScript support with strict typing
- ✅ **Error Handling**: Comprehensive error types and handling
- ✅ **Backward Compatibility**: GORB object for existing code
- ✅ **Extensibility**: Easy to add new blockchains and features

This migration will make your code more maintainable, testable, and flexible for future blockchain integrations.
