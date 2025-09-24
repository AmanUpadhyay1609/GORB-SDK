# Native SOL Transfer Guide

This guide explains how to use the native SOL transfer functionality in the GORB Chain SDK.

## Overview

The SDK now supports native SOL transfers with flexible fee payment options:
- **Single Signer**: Sender pays transaction fees
- **Dual Signer**: Separate fee payer (e.g., admin) pays transaction fees
- **Wallet Integration**: Works with wallet adapters and keypairs

## Key Features

✅ **Flexible Fee Payment**: Sender or separate fee payer can pay transaction fees  
✅ **Dual Signer Support**: Handle transactions with different signers  
✅ **Wallet Adapter Compatible**: Works with frontend wallet integrations  
✅ **Type Safe**: Full TypeScript support with proper type definitions  
✅ **Error Handling**: Comprehensive error handling and validation  
✅ **Batch Operations**: Support for multiple transfers  

## Types

### TransferSOLParams
```typescript
interface TransferSOLParams {
  fromPublicKey: PublicKey;        // Sender's public key
  toPublicKey: PublicKey;          // Recipient's public key
  amountInSOL: number;             // Amount to transfer in SOL
  feePayerPublicKey?: PublicKey;   // Optional fee payer (defaults to sender)
}
```

### TransferTransactionResult
```typescript
interface TransferTransactionResult {
  transaction: Transaction;         // Built transaction
  fromPublicKey: PublicKey;        // Sender's public key
  toPublicKey: PublicKey;          // Recipient's public key
  amountInLamports: number;        // Amount in lamports
  feePayerPublicKey: PublicKey;    // Actual fee payer
  instructions: any[];             // Transaction instructions
}
```

### TransferResult
```typescript
interface TransferResult {
  success: boolean;                // Transaction success status
  signature?: TransactionSignature; // Transaction signature
  explorerUrl?: string;            // Explorer URL (if available)
  error?: string;                  // Error message (if failed)
}
```

## Usage Examples

### 1. Single Signer Transfer (Sender Pays Fees)

```typescript
import { createGorbchainSDK, PublicKey, Keypair } from '@gorbchain/solana-sdk';
import bs58 from 'bs58';

const sdk = createGorbchainSDK();

// Transfer parameters
const transferParams = {
  fromPublicKey: new PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"),
  toPublicKey: new PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"),
  amountInSOL: 0.1, // 0.1 SOL
  // feePayerPublicKey not provided, so sender will pay fees
};

// Build transaction
const result = await sdk.createNativeTransferTransaction(transferParams);

// Sign with sender keypair
const privateKeyBuf = bs58.decode("your sender private key");
const senderKeypair = Keypair.fromSecretKey(Uint8Array.from(privateKeyBuf));
const signedTx = await sdk.signWithDualKeypairs(result.transaction, senderKeypair);

// Submit transaction
const submitResult = await sdk.submitTransaction(signedTx);
console.log("Transfer signature:", submitResult.signature);
```

### 2. Dual Signer Transfer (Admin Pays Fees)

```typescript
// Transfer parameters with separate fee payer
const transferParams = {
  fromPublicKey: new PublicKey("F1d15ESiL2qhMotU2Uh4FNUnxexLSpJDpCYVWxaF8XtC"),
  toPublicKey: new PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"),
  amountInSOL: 0.5,
  feePayerPublicKey: new PublicKey("AdminPublicKeyHere"), // Admin pays fees
};

// Build transaction
const result = await sdk.createNativeTransferTransaction(transferParams);

// Sign with both sender and fee payer keypairs
const senderPrivateKeyBuf = bs58.decode("your sender private key");
const senderKeypair = Keypair.fromSecretKey(Uint8Array.from(senderPrivateKeyBuf));

const feePayerPrivateKeyBuf = bs58.decode("your admin private key");
const feePayerKeypair = Keypair.fromSecretKey(Uint8Array.from(feePayerPrivateKeyBuf));

const signedTx = await sdk.signWithDualKeypairs(
  result.transaction, 
  senderKeypair, 
  feePayerKeypair
);

// Submit transaction
const submitResult = await sdk.submitTransaction(signedTx);
```

### 3. Wallet Adapter Integration

```typescript
// Transfer with wallet (wallet pays fees)
const transferParams = {
  fromPublicKey: wallet.publicKey, // Wallet is the sender
  toPublicKey: new PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"),
  amountInSOL: 0.25,
  // feePayerPublicKey not provided, so wallet will pay fees
};

const result = await sdk.createNativeTransferTransaction(transferParams);
const signedTx = await sdk.signTransferWithWalletAndKeypair(result.transaction, wallet);
const submitResult = await sdk.submitTransaction(signedTx);
```

### 4. Wallet + Admin Fee Payer

```typescript
// Transfer with wallet as sender and admin as fee payer
const transferParams = {
  fromPublicKey: wallet.publicKey,
  toPublicKey: new PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"),
  amountInSOL: 1.0,
  feePayerPublicKey: new PublicKey("AdminPublicKeyHere"), // Admin pays fees
};

const result = await sdk.createNativeTransferTransaction(transferParams);

// Admin keypair for fee payment
const adminPrivateKeyBuf = bs58.decode("your admin private key");
const adminKeypair = Keypair.fromSecretKey(Uint8Array.from(adminPrivateKeyBuf));

// Sign with wallet and admin keypair
const signedTx = await sdk.signTransferWithWalletAndKeypair(
  result.transaction, 
  wallet, 
  adminKeypair
);

const submitResult = await sdk.submitTransaction(signedTx);
```

## SDK Methods

### Transaction Building
- `createNativeTransferTransaction(params: TransferSOLParams): Promise<TransferTransactionResult>`

### Signing Methods
- `signWithDualKeypairs(transaction, senderKeypair, feePayerKeypair?): Promise<Transaction>`
- `signTransferWithWalletAndKeypair(transaction, wallet, feePayerKeypair?): Promise<Transaction>`

### Helper Functions
- `createTransferSigner(senderKeypair, feePayerKeypair?): Function`
- `createTransferWalletSigner(wallet, feePayerKeypair?): Function`

## Error Handling

The SDK provides comprehensive error handling:

```typescript
try {
  const result = await sdk.createNativeTransferTransaction({
    fromPublicKey: new PublicKey("invalid"),
    toPublicKey: new PublicKey("invalid"),
    amountInSOL: -0.1, // Invalid negative amount
  });
} catch (error) {
  if (error.name === "SDKError") {
    console.error("SDK Error:", error.message);
  } else if (error.name === "TransactionError") {
    console.error("Transaction Error:", error.message);
  } else if (error.name === "SigningError") {
    console.error("Signing Error:", error.message);
  }
}
```

## Validation

The SDK automatically validates:
- ✅ Amount must be greater than 0
- ✅ Public keys must be valid
- ✅ Keypairs must be valid (64-byte secret keys)
- ✅ Wallet adapters must have required methods

## Best Practices

1. **Always simulate transactions** before submitting:
   ```typescript
   const simulation = await sdk.simulateTransaction(signedTx);
   if (!simulation.success) {
     throw new Error(`Simulation failed: ${simulation.error}`);
   }
   ```

2. **Use proper error handling** for production applications

3. **Validate amounts** before creating transactions

4. **Use batch operations** for multiple transfers to save on fees

5. **Consider using separate fee payers** for better user experience

## Integration with Existing Code

The native transfer functionality integrates seamlessly with existing SDK features:

- Uses the same connection and configuration system
- Compatible with existing submission and confirmation methods
- Follows the same error handling patterns
- Works with all supported blockchains (Gorbchain, Solana)

## Migration from Custom Transfer Code

If you have existing custom transfer code, you can easily migrate:

```typescript
// Old way (custom implementation)
const connection = new Connection(rpcUrl, "confirmed");
const transaction = new Transaction();
// ... manual transaction building

// New way (using SDK)
const sdk = createGorbchainSDK();
const result = await sdk.createNativeTransferTransaction({
  fromPublicKey: senderPubkey,
  toPublicKey: recipientPubkey,
  amountInSOL: amount,
  feePayerPublicKey: feePayerPubkey, // Optional
});
```

The SDK handles all the complexity of transaction building, signing, and submission while providing a clean, type-safe API.
