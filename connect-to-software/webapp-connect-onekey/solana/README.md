# Solana Integration

## Overview

OneKey provides comprehensive Solana support through the `window.$onekey.solana` provider. This includes support for Solana mainnet, devnet, testnet, and all standard Solana operations including token transfers, NFT operations, and program interactions.

## Supported Networks

- **Solana Mainnet** (mainnet-beta)
- **Solana Devnet** (devnet)
- **Solana Testnet** (testnet)

## Supported Features

- **SOL Transfers** - Send and receive SOL
- **SPL Token Support** - Transfer SPL tokens
- **NFT Operations** - Transfer and interact with NFTs
- **Program Interactions** - Call Solana programs
- **Message Signing** - Sign arbitrary messages
- **Transaction Signing** - Sign Solana transactions
- **Wallet Standard** - Compatible with Solana Wallet Standard

## Quick Start

### 1. Provider Detection

```javascript
// Check if OneKey Solana provider is available
function getSolanaProvider() {
  if (window.$onekey?.solana) {
    return window.$onekey.solana;
  }

  // Fallback to generic solana provider
  if (window.solana) {
    return window.solana;
  }

  throw new Error('Solana provider not found. Please install OneKey wallet.');
}

// Verify it's OneKey provider
function isOneKeySolanaProvider(provider) {
  return provider.isOneKey === true;
}
```

### 2. Connect to Wallet

```javascript
async function connectSolanaWallet() {
  try {
    const provider = getSolanaProvider();

    // Connect to wallet
    const response = await provider.connect();

    console.log('Connected to Solana wallet:', response.publicKey.toString());
    return response.publicKey;
  } catch (error) {
    console.error('Failed to connect to Solana wallet:', error);
    throw error;
  }
}
```

### 3. Get Account Information

```javascript
async function getSolanaAccountInfo() {
  const provider = getSolanaProvider();

  // Check if already connected
  if (!provider.isConnected) {
    await provider.connect();
  }

  // Get public key
  const publicKey = provider.publicKey;

  // Get network (if supported)
  const network = await provider.request({ method: 'getNetwork' });

  return {
    publicKey: publicKey.toString(),
    network,
    isConnected: provider.isConnected
  };
}
```

## Core Features

### 1. Connection Management

```javascript
// Connect to wallet
const response = await provider.connect();
console.log('Public key:', response.publicKey.toString());

// Disconnect from wallet
await provider.disconnect();

// Check connection status
console.log('Is connected:', provider.isConnected);
console.log('Public key:', provider.publicKey?.toString());
```

### 2. Transaction Signing and Sending

```javascript
import { Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Send SOL
async function sendSOL(toAddress, amount) {
  try {
    const provider = getSolanaProvider();

    if (!provider.isConnected) {
      await provider.connect();
    }

    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey: new PublicKey(toAddress),
        lamports: amount * LAMPORTS_PER_SOL // Convert SOL to lamports
      })
    );

    // Sign and send transaction
    const signature = await provider.signAndSendTransaction(transaction);

    console.log('Transaction sent:', signature);
    return signature;
  } catch (error) {
    console.error('Failed to send SOL:', error);
    throw error;
  }
}

// Example usage
await sendSOL('9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', 0.1); // Send 0.1 SOL
```

### 3. SPL Token Transfers

```javascript
import {
  Transaction,
  PublicKey
} from '@solana/web3.js';
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';

async function sendSPLToken(tokenMintAddress, toAddress, amount, decimals = 9) {
  try {
    const provider = getSolanaProvider();

    if (!provider.isConnected) {
      await provider.connect();
    }

    const mintPublicKey = new PublicKey(tokenMintAddress);
    const toPublicKey = new PublicKey(toAddress);

    // Get associated token accounts
    const fromTokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      provider.publicKey
    );

    const toTokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      toPublicKey
    );

    // Create transfer instruction
    const transferInstruction = createTransferInstruction(
      fromTokenAccount,
      toTokenAccount,
      provider.publicKey,
      amount * Math.pow(10, decimals) // Convert to token's smallest unit
    );

    // Create transaction
    const transaction = new Transaction().add(transferInstruction);

    // Sign and send transaction
    const signature = await provider.signAndSendTransaction(transaction);

    console.log('SPL token transfer sent:', signature);
    return signature;
  } catch (error) {
    console.error('Failed to send SPL token:', error);
    throw error;
  }
}
```

### 4. Message Signing

```javascript
// Sign a message
async function signMessage(message) {
  try {
    const provider = getSolanaProvider();

    if (!provider.isConnected) {
      await provider.connect();
    }

    // Convert message to Uint8Array
    const encodedMessage = new TextEncoder().encode(message);

    // Sign message
    const signature = await provider.signMessage(encodedMessage);

    console.log('Message signed:', signature);
    return signature;
  } catch (error) {
    console.error('Failed to sign message:', error);
    throw error;
  }
}

// Example usage
const signature = await signMessage('Hello OneKey Solana!');
```

### 5. Transaction Signing (without sending)

```javascript
// Sign transaction without sending
async function signTransaction(transaction) {
  try {
    const provider = getSolanaProvider();

    if (!provider.isConnected) {
      await provider.connect();
    }

    // Sign transaction
    const signedTransaction = await provider.signTransaction(transaction);

    console.log('Transaction signed');
    return signedTransaction;
  } catch (error) {
    console.error('Failed to sign transaction:', error);
    throw error;
  }
}

// Sign multiple transactions
async function signAllTransactions(transactions) {
  try {
    const provider = getSolanaProvider();

    if (!provider.isConnected) {
      await provider.connect();
    }

    // Sign all transactions
    const signedTransactions = await provider.signAllTransactions(transactions);

    console.log('All transactions signed');
    return signedTransactions;
  } catch (error) {
    console.error('Failed to sign transactions:', error);
    throw error;
  }
}
```

## Event Handling

```javascript
function setupSolanaEventListeners() {
  const provider = getSolanaProvider();

  // Connection events
  provider.on('connect', (publicKey) => {
    console.log('Solana wallet connected:', publicKey.toString());
  });

  provider.on('disconnect', () => {
    console.log('Solana wallet disconnected');
    handleDisconnect();
  });

  // Account changes
  provider.on('accountChanged', (publicKey) => {
    if (publicKey) {
      console.log('Solana account changed:', publicKey.toString());
      updateAccount(publicKey);
    } else {
      console.log('Solana account disconnected');
      handleDisconnect();
    }
  });
}

function handleDisconnect() {
  // Clear user data
  // Update UI to disconnected state
  console.log('Solana wallet disconnected');
}

function updateAccount(publicKey) {
  // Update UI with new account
  console.log('Solana account updated:', publicKey.toString());
}
```

## Advanced Features

### 1. Program Interaction

```javascript
import {
  Transaction,
  TransactionInstruction,
  PublicKey
} from '@solana/web3.js';

async function callProgram(programId, instruction) {
  try {
    const provider = getSolanaProvider();

    if (!provider.isConnected) {
      await provider.connect();
    }

    // Create program instruction
    const programInstruction = new TransactionInstruction({
      keys: instruction.keys,
      programId: new PublicKey(programId),
      data: instruction.data
    });

    // Create transaction
    const transaction = new Transaction().add(programInstruction);

    // Sign and send transaction
    const signature = await provider.signAndSendTransaction(transaction);

    console.log('Program call sent:', signature);
    return signature;
  } catch (error) {
    console.error('Failed to call program:', error);
    throw error;
  }
}
```

### 2. Complete Integration Example

```javascript
class SolanaWalletIntegration {
  constructor() {
    this.provider = null;
    this.publicKey = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.provider = getSolanaProvider();

      // Connect to wallet
      const response = await this.provider.connect();
      this.publicKey = response.publicKey;
      this.isConnected = true;

      this.setupEventListeners();

      console.log('Solana wallet connected:', this.publicKey.toString());
      return this.publicKey;
    } catch (error) {
      this.isConnected = false;
      throw error;
    }
  }

  setupEventListeners() {
    this.provider.on('connect', (publicKey) => {
      this.publicKey = publicKey;
      this.isConnected = true;
    });

    this.provider.on('disconnect', () => {
      this.publicKey = null;
      this.isConnected = false;
    });

    this.provider.on('accountChanged', (publicKey) => {
      this.publicKey = publicKey;
      this.isConnected = !!publicKey;
    });
  }

  async sendSOL(toAddress, amount) {
    if (!this.isConnected) throw new Error('Wallet not connected');

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: this.publicKey,
        toPubkey: new PublicKey(toAddress),
        lamports: amount * LAMPORTS_PER_SOL
      })
    );

    return await this.provider.signAndSendTransaction(transaction);
  }

  async signMessage(message) {
    if (!this.isConnected) throw new Error('Wallet not connected');

    const encodedMessage = new TextEncoder().encode(message);
    return await this.provider.signMessage(encodedMessage);
  }

  async disconnect() {
    if (this.provider && this.isConnected) {
      await this.provider.disconnect();
    }
    this.publicKey = null;
    this.isConnected = false;
  }
}

// Usage
const solanaWallet = new SolanaWalletIntegration();
await solanaWallet.connect();
await solanaWallet.sendSOL('9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', 0.1);
```

## Integration Guides

### Step-by-Step Guides
- [Detecting the Provider](detecting-the-provider.md) - Find and verify Solana provider
- [Establishing a Connection](establishing-a-connection.md) - Connect to Solana wallet
- [Sending a Transaction](sending-a-transaction.md) - Send SOL and SPL tokens
- [Signing a Message](signing-a-message.md) - Sign arbitrary messages

## Best Practices

### 1. Error Handling

```javascript
async function safeSolanaCall(operation) {
  try {
    const result = await operation();
    return { success: true, data: result };
  } catch (error) {
    console.error('Solana operation failed:', error);

    // Handle specific error types
    if (error.message?.includes('User rejected')) {
      return { success: false, error: 'User rejected the request' };
    } else if (error.message?.includes('Insufficient funds')) {
      return { success: false, error: 'Insufficient SOL balance' };
    } else {
      return { success: false, error: error.message || 'Unknown error' };
    }
  }
}
```

### 2. Connection State Management

```javascript
// Always check connection before operations
async function ensureConnected(provider) {
  if (!provider.isConnected) {
    await provider.connect();
  }
}

// Use before any wallet operation
await ensureConnected(provider);
const signature = await provider.signAndSendTransaction(transaction);
```

### 3. Amount Handling

```javascript
// Always work with lamports (smallest SOL unit)
const LAMPORTS_PER_SOL = 1000000000;

function solToLamports(sol) {
  return Math.floor(sol * LAMPORTS_PER_SOL);
}

function lamportsToSol(lamports) {
  return lamports / LAMPORTS_PER_SOL;
}

// Send 0.1 SOL
const amount = solToLamports(0.1);
```

## Live Examples

- **[Interactive Demo](https://dapp-example.onekeytest.com/solana)** - Try Solana features live
- **[Solana Standard Demo](https://dapp-example.onekeytest.com/solanaStandard)** - Wallet Standard implementation
- **[GitHub Source](https://github.com/OneKeyHQ/cross-inpage-provider/tree/main/packages/providers/onekey-solana-provider)** - Complete provider source code

## Troubleshooting

### Common Issues

1. **Provider not found**
   ```javascript
   if (!window.$onekey?.solana) {
     alert('Please install OneKey wallet and enable Solana support');
   }
   ```

2. **Connection rejected**
   ```javascript
   try {
     await provider.connect();
   } catch (error) {
     if (error.message.includes('User rejected')) {
       console.log('User rejected connection');
     }
   }
   ```

3. **Insufficient balance**
   ```javascript
   // Check balance before sending
   const balance = await connection.getBalance(provider.publicKey);
   if (balance < amount) {
     throw new Error('Insufficient SOL balance');
   }
   ```

### Getting Help

- [GitHub Issues](https://github.com/OneKeyHQ/cross-inpage-provider/issues)
- [Discord Community](https://discord.gg/onekey)
- [Solana Documentation](https://docs.solana.com/)
- [Developer Documentation](https://developer.onekey.so/)

