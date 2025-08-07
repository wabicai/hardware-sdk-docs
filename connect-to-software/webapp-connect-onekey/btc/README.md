# Bitcoin Integration

## Overview

OneKey provides comprehensive Bitcoin support through the `window.$onekey.btc` provider. This includes support for Bitcoin mainnet, testnet, and various Bitcoin-based features like Ordinals, BRC-20 tokens, and PSBT (Partially Signed Bitcoin Transactions).

## Supported Networks

- **Bitcoin Mainnet** (livenet)
- **Bitcoin Testnet** (testnet)

## Supported Features

- **Standard Bitcoin Transactions** - Send and receive Bitcoin
- **PSBT Support** - Sign Partially Signed Bitcoin Transactions
- **Message Signing** - Sign messages with Bitcoin addresses
- **Ordinals & Inscriptions** - Support for Bitcoin NFTs
- **BRC-20 Tokens** - Bitcoin-based token standard
- **Multiple Address Types** - P2PKH, P2SH, P2WPKH, P2WSH, P2TR (Taproot)

## Quick Start

### 1. Provider Detection

```javascript
// Check if OneKey Bitcoin provider is available
function getBitcoinProvider() {
  if (window.$onekey?.btc) {
    return window.$onekey.btc;
  }

  throw new Error('OneKey Bitcoin provider not found. Please install OneKey wallet.');
}

// Verify it's OneKey provider
function isOneKeyBitcoinProvider(provider) {
  return provider.isBtcWalletProvider === true;
}
```

### 2. Connect to Wallet

```javascript
async function connectBitcoinWallet() {
  try {
    const provider = getBitcoinProvider();

    // Request account access
    const accounts = await provider.requestAccounts();

    console.log('Connected Bitcoin accounts:', accounts);
    return accounts[0]; // Return primary account
  } catch (error) {
    console.error('Failed to connect to Bitcoin wallet:', error);
    throw error;
  }
}
```

### 3. Get Account Information

```javascript
async function getBitcoinAccountInfo() {
  const provider = getBitcoinProvider();

  // Get connected accounts
  const accounts = await provider.getAccounts();

  // Get current network
  const network = await provider.getNetwork();

  // Get balance for the first account
  const balance = await provider.getBalance();

  // Get public key
  const publicKey = await provider.getPublicKey();

  return {
    accounts,
    network,
    balance,
    publicKey
  };
}
```

## Core Features

### 1. Account Management

```javascript
// Request account access (triggers connection)
const accounts = await provider.requestAccounts();

// Get already connected accounts
const accounts = await provider.getAccounts();

// Get public key for current account
const publicKey = await provider.getPublicKey();
```

### 2. Network Operations

```javascript
// Get current network
const network = await provider.getNetwork(); // 'livenet' or 'testnet'

// Switch network
await provider.switchNetwork('testnet');
```

### 3. Balance and UTXO Management

```javascript
// Get balance
const balance = await provider.getBalance();
// Returns: { confirmed: number, unconfirmed: number, total: number }

// Get UTXOs (if supported)
const utxos = await provider.getUtxos();
```

### 4. Transaction Sending

```javascript
// Send Bitcoin
async function sendBitcoin(toAddress, amount) {
  try {
    const txid = await provider.sendBitcoin({
      to: toAddress,
      value: amount, // in satoshis
      feeRate: 1 // sat/vB
    });

    console.log('Transaction sent:', txid);
    return txid;
  } catch (error) {
    console.error('Failed to send Bitcoin:', error);
    throw error;
  }
}

// Example usage
await sendBitcoin('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 100000); // 0.001 BTC
```

### 5. PSBT (Partially Signed Bitcoin Transactions)

```javascript
// Sign a PSBT
async function signPSBT(psbtHex) {
  try {
    const signedPsbt = await provider.signPsbt({
      psbtHex: psbtHex,
      options: {
        autoFinalized: true // Automatically finalize if possible
      }
    });

    return signedPsbt;
  } catch (error) {
    console.error('Failed to sign PSBT:', error);
    throw error;
  }
}

// Sign multiple PSBTs
async function signMultiplePSBTs(psbtHexArray) {
  try {
    const signedPsbts = await provider.signPsbts({
      psbtHexs: psbtHexArray,
      options: {
        autoFinalized: true
      }
    });

    return signedPsbts;
  } catch (error) {
    console.error('Failed to sign PSBTs:', error);
    throw error;
  }
}
```

### 6. Message Signing

```javascript
// Sign a message
async function signMessage(message, type = 'ecdsa') {
  try {
    const signature = await provider.signMessage({
      message: message,
      type: type // 'ecdsa' or 'bip322-simple'
    });

    return signature;
  } catch (error) {
    console.error('Failed to sign message:', error);
    throw error;
  }
}

// Example usage
const signature = await signMessage('Hello OneKey!', 'ecdsa');
```

### 7. Ordinals & Inscriptions

```javascript
// Get inscriptions for current account
async function getInscriptions() {
  try {
    const inscriptions = await provider.getInscriptions();

    console.log('Inscriptions:', inscriptions);
    return inscriptions;
  } catch (error) {
    console.error('Failed to get inscriptions:', error);
    throw error;
  }
}

// Send an inscription
async function sendInscription(inscriptionId, toAddress) {
  try {
    const txid = await provider.sendInscription({
      inscriptionId: inscriptionId,
      to: toAddress,
      feeRate: 1
    });

    console.log('Inscription sent:', txid);
    return txid;
  } catch (error) {
    console.error('Failed to send inscription:', error);
    throw error;
  }
}
```

## Event Handling

```javascript
function setupBitcoinEventListeners() {
  const provider = getBitcoinProvider();

  // Account changes
  provider.on('accountsChanged', (accounts) => {
    console.log('Bitcoin accounts changed:', accounts);
    if (accounts.length === 0) {
      handleDisconnect();
    } else {
      updateAccount(accounts[0]);
    }
  });

  // Network changes
  provider.on('networkChanged', (network) => {
    console.log('Bitcoin network changed:', network);
    updateNetwork(network);
  });

  // Connection status
  provider.on('connect', () => {
    console.log('Bitcoin wallet connected');
  });

  provider.on('disconnect', () => {
    console.log('Bitcoin wallet disconnected');
    handleDisconnect();
  });
}
```

## Advanced Features

### 1. Transaction Broadcasting

```javascript
// Push a raw transaction
async function pushTransaction(rawTx) {
  try {
    const txid = await provider.pushTx({
      rawTx: rawTx
    });

    console.log('Transaction broadcasted:', txid);
    return txid;
  } catch (error) {
    console.error('Failed to broadcast transaction:', error);
    throw error;
  }
}

// Push a PSBT
async function pushPSBT(psbtHex) {
  try {
    const txid = await provider.pushPsbt({
      psbtHex: psbtHex
    });

    console.log('PSBT broadcasted:', txid);
    return txid;
  } catch (error) {
    console.error('Failed to broadcast PSBT:', error);
    throw error;
  }
}
```

### 2. Complete Integration Example

```javascript
class BitcoinWalletIntegration {
  constructor() {
    this.provider = null;
    this.account = null;
    this.network = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.provider = getBitcoinProvider();

      // Request accounts
      const accounts = await this.provider.requestAccounts();
      this.account = accounts[0];

      // Get network
      this.network = await this.provider.getNetwork();

      this.isConnected = true;
      this.setupEventListeners();

      console.log('Bitcoin wallet connected:', {
        account: this.account,
        network: this.network
      });

      return this.account;
    } catch (error) {
      this.isConnected = false;
      throw error;
    }
  }

  setupEventListeners() {
    this.provider.on('accountsChanged', (accounts) => {
      this.account = accounts[0] || null;
      this.isConnected = !!this.account;
    });

    this.provider.on('networkChanged', (network) => {
      this.network = network;
    });
  }

  async getBalance() {
    if (!this.isConnected) throw new Error('Wallet not connected');
    return await this.provider.getBalance();
  }

  async sendBitcoin(to, value, feeRate = 1) {
    if (!this.isConnected) throw new Error('Wallet not connected');

    return await this.provider.sendBitcoin({
      to,
      value,
      feeRate
    });
  }

  disconnect() {
    this.account = null;
    this.network = null;
    this.isConnected = false;
  }
}

// Usage
const bitcoinWallet = new BitcoinWalletIntegration();
await bitcoinWallet.connect();
const balance = await bitcoinWallet.getBalance();
console.log('Bitcoin balance:', balance);
```

## API Reference

### Complete Method Documentation
- [requestAccounts](api-reference/requestaccounts.md) - Request account access
- [getAccounts](api-reference/getaccounts.md) - Get connected accounts
- [getBalance](api-reference/getbalance.md) - Get account balance
- [getNetwork](api-reference/getnetwork.md) - Get current network
- [switchNetwork](api-reference/switchnetwork.md) - Switch between networks
- [sendBitcoin](api-reference/sendbitcoin.md) - Send Bitcoin transactions
- [signPsbt](api-reference/signpsbt.md) - Sign PSBT
- [signPsbts](api-reference/signpsbts.md) - Sign multiple PSBTs
- [signMessage](api-reference/signmessage.md) - Sign messages
- [getInscriptions](api-reference/getinscriptions.md) - Get Ordinals inscriptions
- [sendInscription](api-reference/sendinscription.md) - Send inscriptions
- [pushTx](api-reference/pushtx.md) - Broadcast raw transactions
- [pushPsbt](api-reference/pushpsbt.md) - Broadcast PSBT

### Events
- [Event Handling](event.md) - Complete event reference

### Integration Guide
- [Step-by-Step Guide](guide.md) - Detailed integration walkthrough

## Live Examples

- **[Interactive Demo](https://dapp-example.onekeytest.com/btcUnitsat)** - Try Bitcoin features live
- **[GitHub Source](https://github.com/OneKeyHQ/cross-inpage-provider/tree/main/packages/providers/onekey-btc-provider)** - Complete provider source code

## Best Practices

### 1. Error Handling

```javascript
async function safeBitcoinCall(method, params) {
  try {
    const provider = getBitcoinProvider();
    const result = await provider[method](params);
    return { success: true, data: result };
  } catch (error) {
    console.error(`Bitcoin ${method} failed:`, error);
    return { success: false, error: error.message };
  }
}
```

### 2. Fee Estimation

```javascript
// Always specify appropriate fee rates
const feeRates = {
  slow: 1,     // 1 sat/vB
  normal: 5,   // 5 sat/vB
  fast: 10     // 10 sat/vB
};

await provider.sendBitcoin({
  to: address,
  value: amount,
  feeRate: feeRates.normal
});
```

### 3. Amount Handling

```javascript
// Always work with satoshis (smallest Bitcoin unit)
const BTC_TO_SATOSHI = 100000000;

function btcToSatoshi(btc) {
  return Math.floor(btc * BTC_TO_SATOSHI);
}

function satoshiToBtc(satoshi) {
  return satoshi / BTC_TO_SATOSHI;
}

// Send 0.001 BTC
await provider.sendBitcoin({
  to: address,
  value: btcToSatoshi(0.001),
  feeRate: 5
});
```

## Troubleshooting

### Common Issues

1. **Provider not found**
   ```javascript
   if (!window.$onekey?.btc) {
     alert('Please install OneKey wallet and enable Bitcoin support');
   }
   ```

2. **Insufficient balance**
   ```javascript
   const balance = await provider.getBalance();
   if (balance.total < amount) {
     throw new Error('Insufficient Bitcoin balance');
   }
   ```

3. **Network mismatch**
   ```javascript
   const currentNetwork = await provider.getNetwork();
   if (currentNetwork !== 'livenet') {
     await provider.switchNetwork('livenet');
   }
   ```

### Getting Help

- [GitHub Issues](https://github.com/OneKeyHQ/cross-inpage-provider/issues)
- [Discord Community](https://discord.gg/onekey)
- [Developer Documentation](https://developer.onekey.so/)

