# Solana SDK

A modular, type-safe SDK for Solana-based blockchain operations. This SDK supports Gorbchain, Solana mainnet, devnet, and any other Solana fork by providing configurable blockchain settings.

## Features

- 🚀 **Modular Design**: Separate transaction building, signing, and submission
- 🔧 **Multi-Blockchain Support**: Works with Solana, Gorbchain, and custom Solana forks
- 🔐 **Flexible Signing**: Support for keypairs, wallet adapters, and custom signing methods
- 📦 **TypeScript First**: Fully typed with comprehensive interfaces
- 🛡️ **Error Handling**: Robust error handling with specific error types
- ⚡ **Transaction Simulation**: Built-in transaction simulation before submission
- 🔄 **Batch Operations**: Support for multiple transaction operations

## Installation

```bash
npm install @gorbchain/gorb-sdk
```

## Quick Start

### Basic Usage

```typescript
import { createGorbchainSDK, Keypair } from '@gorbchain/gorb-sdk';

// Create SDK instance
const sdk = createGorbchainSDK();

// Create token parameters
const tokenParams = {
  name: "My Token",
  symbol: "MTK",
  supply: 1000000,
  decimals: 6,
  uri: "https://my-metadata-uri.com/token.json",
};

// Build complete transaction (includes create mint, metadata, ATA, and minting)
const payer = new PublicKey("your-payer-public-key");
const result = await sdk.createTokenTransaction(tokenParams, payer);

// Sign the complete transaction (only needs to be signed once!)
const keypair = Keypair.generate();
const signedTx = await sdk.signWithKeypair(result.transaction, keypair);

// Submit transaction
const submitResult = await sdk.submitTransaction(signedTx);
console.log("Token created:", submitResult.signature);
```

### Using Wallet Adapter

```typescript
import { createGorbchainSDK } from '@gorbchain/gorb-sdk';

const sdk = createGorbchainSDK();

// Build transaction
const result = await sdk.createTokenTransaction({
  name: "Wallet Token",
  symbol: "WKT",
  supply: 1000000,
  decimals: 6,
  uri: "https://wallet-metadata.com/token.json",
});

// Update transaction with actual payer
const updatedTx = sdk.updateTransactionPayer(result.transaction, wallet.publicKey);

// Sign with wallet and mint keypair
const signedTx = await sdk.signWithWalletAndKeypair(updatedTx, wallet, result.mintKeypair);

// Submit
const submitResult = await sdk.submitTransaction(signedTx);
```

### Node.js import examples

- CommonJS:
```js
const { createGorbchainSDK } = require('@gorbchain/solana-sdk');
```
- ESM/TypeScript:
```ts
import { createGorbchainSDK } from '@gorbchain/solana-sdk';
```

## Supported Blockchains

### Gorbchain
```typescript
import { createGorbchainSDK } from '@gorbchain/solana-sdk';

const sdk = createGorbchainSDK();
// or with custom RPC
const sdk = createGorbchainSDK("https://custom-gorbchain-rpc.com");
```

### Solana
```typescript
import { createSolanaSDK } from '@gorbchain/solana-sdk';

// Mainnet
const sdk = createSolanaSDK("mainnet-beta");

// Devnet
const sdk = createSolanaSDK("devnet");
```

### Custom Blockchain
```typescript
import { createSDK, createBlockchainConfig } from '@gorbchain/solana-sdk';

const customConfig = createBlockchainConfig(
  "YourTokenProgramId",
  "YourAssociatedTokenProgramId", 
  "https://your-rpc.com"
);

const sdk = createSDK({ blockchain: customConfig });
```

## API Reference

### Core Functions

#### `createTokenTransaction(params)`
Creates a token creation transaction.

**Parameters:**
- `name: string` - Token name
- `symbol: string` - Token symbol
- `supply: string | number` - Token supply
- `decimals: string | number` - Token decimals
- `uri: string` - Metadata URI
- `freezeAuthority?: PublicKey | null` - Optional freeze authority
- `mintKeypair?: Keypair` - Optional mint keypair (generated if not provided)

**Returns:** `TransactionResult`

#### `createNFTTransaction(params)`
Creates an NFT minting transaction.

**Parameters:**
- `name: string` - NFT name
- `symbol: string` - NFT symbol
- `uri: string` - Metadata URI
- `description: string` - NFT description
- `mintKeypair?: Keypair` - Optional mint keypair (generated if not provided)

**Returns:** `TransactionResult`

### Signing Functions

#### `signWithKeypair(transaction, keypair)`
Signs a transaction with a keypair.

#### `signWithWalletAdapter(transaction, wallet)`
Signs a transaction with wallet adapter.

#### `signWithWalletAndKeypair(transaction, wallet, mintKeypair)`
Signs a transaction with both wallet and mint keypair.

### Submission Functions

#### `submitTransaction(transaction, options?)`
Submits a signed transaction.

#### `simulateTransaction(transaction)`
Simulates a transaction before submission.

#### `waitForConfirmation(signature, commitment?, timeout?)`
Waits for transaction confirmation.

## Configuration

### GORB Object (Backward Compatibility)

```typescript
import { GORB } from '@gorbchain/solana-sdk';

console.log(GORB.TOKEN22_PROGRAM);
console.log(GORB.ASSOCIATED_TOKEN_PROGRAM);
console.log(GORB.SYSTEM_PROGRAM);
console.log(GORB.CONFIG);
```

### Custom Configuration

```typescript
import { createBlockchainConfig } from '@gorbchain/solana-sdk';

const config = createBlockchainConfig(
  "TokenProgramId",
  "AssociatedTokenProgramId",
  "https://rpc.example.com",
  {
    wsUrl: "wss://ws.example.com",
    commitment: "confirmed",
    name: "custom-chain"
  }
);
```

## Error Handling

The SDK provides specific error types for better error handling:

```typescript
import { SDKError, TransactionError, SigningError } from '@gorbchain/solana-sdk';

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

## Examples

See `src/examples` in the repository for comprehensive usage examples including:
- Basic token creation
- NFT minting
- Wallet adapter integration
- Custom blockchain configuration
- Error handling
- Batch operations

## Development

### Building

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Type Checking

The SDK is built with strict TypeScript configuration for maximum type safety.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
