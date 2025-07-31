---
icon: sun
---

# Solana

Solana blockchain operations including address generation, transaction signing, and message signing.

## Overview

Solana is a high-performance blockchain supporting smart contracts and decentralized applications. OneKey provides comprehensive support for Solana operations including:

- Address generation and verification
- Transaction signing with various instruction types
- Message signing for authentication
- Support for SPL tokens and programs

## solGetAddress()

Get Solana address from device.

### Syntax

```javascript
await HardwareSDK.solGetAddress(params)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | BIP-44 derivation path |
| `showOnDevice` | `boolean` | No | Show address on device screen (default: false) |

### Returns

```typescript
Promise<{
  success: boolean;
  payload: {
    address: string;
    path: string;
  }
}>
```

### Examples

```javascript
// Get Solana address
const result = await HardwareSDK.solGetAddress({
  path: "m/44'/501'/0'/0'",
  showOnDevice: true
});

if (result.success) {
  console.log('Solana address:', result.payload.address);
}

// Get multiple addresses
const addresses = await Promise.all([
  HardwareSDK.solGetAddress({ path: "m/44'/501'/0'/0'", showOnDevice: false }),
  HardwareSDK.solGetAddress({ path: "m/44'/501'/1'/0'", showOnDevice: false }),
  HardwareSDK.solGetAddress({ path: "m/44'/501'/2'/0'", showOnDevice: false })
]);

console.log('Generated addresses:', addresses.map(r => r.payload.address));
```

## solSignTransaction()

Sign Solana transaction.

### Syntax

```javascript
await HardwareSDK.solSignTransaction(params)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | BIP-44 derivation path |
| `rawTx` | `string` | Yes | Raw transaction data (hex) |

### Returns

```typescript
Promise<{
  success: boolean;
  payload: {
    signature: string;
  }
}>
```

### Examples

```javascript
// Simple SOL transfer
const transferTx = await HardwareSDK.solSignTransaction({
  path: "m/44'/501'/0'/0'",
  rawTx: "0100020353cd0c1..." // Raw transaction hex
});

if (transferTx.success) {
  console.log('Transaction signature:', transferTx.payload.signature);
}

// SPL Token transfer
const tokenTransferTx = await HardwareSDK.solSignTransaction({
  path: "m/44'/501'/0'/0'",
  rawTx: "0100040753cd0c1..." // SPL token transfer transaction
});

// Program interaction
const programTx = await HardwareSDK.solSignTransaction({
  path: "m/44'/501'/0'/0'",
  rawTx: "0100060953cd0c1..." // Program instruction transaction
});
```

## Derivation Paths

### Standard Solana Paths

```javascript
// Solana uses coin type 501
const solanaPaths = {
  account0: "m/44'/501'/0'/0'",     // First account
  account1: "m/44'/501'/1'/0'",     // Second account
  account2: "m/44'/501'/2'/0'",     // Third account
};

// Solana derivation path format
const getSolanaPath = (account = 0) => {
  return `m/44'/501'/${account}'/0'`;
};
```

## Transaction Types

### SOL Transfer

```javascript
// Build SOL transfer transaction
const buildSolTransfer = async (fromAddress, toAddress, amount) => {
  // Use @solana/web3.js to build transaction
  const { Transaction, SystemProgram, PublicKey } = require('@solana/web3.js');

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: new PublicKey(fromAddress),
      toPubkey: new PublicKey(toAddress),
      lamports: amount * 1000000000 // Convert SOL to lamports
    })
  );

  // Set recent blockhash
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
  transaction.feePayer = new PublicKey(fromAddress);

  // Serialize transaction
  const rawTx = transaction.serialize({ requireAllSignatures: false }).toString('hex');

  return await HardwareSDK.solSignTransaction({
    path: "m/44'/501'/0'/0'",
    rawTx
  });
};
```

### SPL Token Transfer

```javascript
// Build SPL token transfer
const buildTokenTransfer = async (fromAddress, toAddress, tokenMint, amount, decimals) => {
  const { Transaction, PublicKey } = require('@solana/web3.js');
  const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');

  const transaction = new Transaction();

  // Get or create associated token accounts
  const fromTokenAccount = await Token.getAssociatedTokenAddress(
    TOKEN_PROGRAM_ID,
    new PublicKey(tokenMint),
    new PublicKey(fromAddress)
  );

  const toTokenAccount = await Token.getAssociatedTokenAddress(
    TOKEN_PROGRAM_ID,
    new PublicKey(tokenMint),
    new PublicKey(toAddress)
  );

  // Add transfer instruction
  transaction.add(
    Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      fromTokenAccount,
      toTokenAccount,
      new PublicKey(fromAddress),
      [],
      amount * Math.pow(10, decimals)
    )
  );

  // Set transaction details
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
  transaction.feePayer = new PublicKey(fromAddress);

  const rawTx = transaction.serialize({ requireAllSignatures: false }).toString('hex');

  return await HardwareSDK.solSignTransaction({
    path: "m/44'/501'/0'/0'",
    rawTx
  });
};
```

### Program Interaction

```javascript
// Interact with Solana programs
const buildProgramTransaction = async (programId, instruction, accounts) => {
  const { Transaction, TransactionInstruction, PublicKey } = require('@solana/web3.js');

  const transaction = new Transaction().add(
    new TransactionInstruction({
      keys: accounts.map(account => ({
        pubkey: new PublicKey(account.pubkey),
        isSigner: account.isSigner,
        isWritable: account.isWritable
      })),
      programId: new PublicKey(programId),
      data: Buffer.from(instruction, 'hex')
    })
  );

  const connection = new Connection('https://api.mainnet-beta.solana.com');
  transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
  transaction.feePayer = new PublicKey(accounts[0].pubkey);

  const rawTx = transaction.serialize({ requireAllSignatures: false }).toString('hex');

  return await HardwareSDK.solSignTransaction({
    path: "m/44'/501'/0'/0'",
    rawTx
  });
};
```

## Error Handling

### Common Solana Errors

```javascript
try {
  const result = await HardwareSDK.solGetAddress({
    path: "m/44'/501'/0'/0'",
    showOnDevice: true
  });

  if (!result.success) {
    switch (result.payload.error) {
      case 'Invalid_Path':
        console.error('Invalid Solana derivation path');
        break;
      case 'User_Cancelled':
        console.error('User cancelled operation');
        break;
      case 'Device_NotFound':
        console.error('Device not connected');
        break;
      default:
        console.error('Solana operation failed:', result.payload.error);
    }
  }
} catch (error) {
  console.error('SDK error:', error.message);
}
```

### Transaction Validation

```javascript
const validateSolanaTransaction = (rawTx) => {
  try {
    // Basic hex validation
    if (!/^[0-9a-fA-F]+$/.test(rawTx)) {
      throw new Error('Invalid transaction format');
    }

    // Minimum transaction size check
    if (rawTx.length < 64) {
      throw new Error('Transaction too short');
    }

    return true;
  } catch (error) {
    console.error('Transaction validation failed:', error.message);
    return false;
  }
};
```

## Best Practices

### Address Verification

```javascript
// Always verify addresses on device for receiving funds
const getReceiveAddress = async (account = 0) => {
  const result = await HardwareSDK.solGetAddress({
    path: `m/44'/501'/${account}'/0'`,
    showOnDevice: true // Important: show on device
  });

  if (result.success) {
    // User has verified address on device screen
    return result.payload.address;
  }

  throw new Error('Failed to get verified address');
};
```

### Transaction Building

```javascript
// Helper class for Solana transactions
class SolanaTransactionBuilder {
  constructor(connection) {
    this.connection = connection;
  }

  async buildTransfer(fromPath, fromAddress, toAddress, amount) {
    const { Transaction, SystemProgram, PublicKey } = require('@solana/web3.js');

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(fromAddress),
        toPubkey: new PublicKey(toAddress),
        lamports: amount
      })
    );

    // Set recent blockhash and fee payer
    const { blockhash } = await this.connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = new PublicKey(fromAddress);

    // Serialize and sign
    const rawTx = transaction.serialize({ requireAllSignatures: false }).toString('hex');

    return await HardwareSDK.solSignTransaction({
      path: fromPath,
      rawTx
    });
  }

  async estimateFee(transaction) {
    return await this.connection.getFeeForMessage(transaction.compileMessage());
  }
}
```

### Connection Management

```javascript
// Solana RPC connection management
class SolanaConnection {
  constructor(endpoint = 'https://api.mainnet-beta.solana.com') {
    this.connection = new Connection(endpoint);
  }

  async getBalance(address) {
    const publicKey = new PublicKey(address);
    return await this.connection.getBalance(publicKey);
  }

  async getTokenBalance(address, tokenMint) {
    const publicKey = new PublicKey(address);
    const tokenAccounts = await this.connection.getTokenAccountsByOwner(
      publicKey,
      { mint: new PublicKey(tokenMint) }
    );

    if (tokenAccounts.value.length > 0) {
      const accountInfo = await this.connection.getTokenAccountBalance(
        tokenAccounts.value[0].pubkey
      );
      return accountInfo.value.uiAmount;
    }

    return 0;
  }

  async sendTransaction(signedTransaction) {
    return await this.connection.sendRawTransaction(signedTransaction);
  }
}
```

## Next Steps

- [Cardano](cardano.md) - Cardano blockchain operations
- [Polkadot](polkadot.md) - Polkadot and Substrate chains
- [Cosmos](cosmos.md) - Cosmos ecosystem chains
- [Device Management](device.md) - Device connection and management