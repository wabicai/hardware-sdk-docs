# DApp Connect To OneKey

## Overview

OneKey provides comprehensive support for DApp integration through its cross-inpage-provider system. This allows web applications to interact with OneKey wallet across multiple blockchain networks including Ethereum, Bitcoin, Solana, and many others.

## Quick Start

### 1. Basic Setup

To connect your DApp to OneKey, you can use the provider APIs that OneKey injects into the browser:

```javascript
// Check if OneKey is installed
if (window.$onekey) {
  console.log('OneKey is installed!');
} else {
  console.log('Please install OneKey wallet');
}
```

### 2. Ethereum Integration

For Ethereum and EVM-compatible chains:

```javascript
// Get the Ethereum provider
const provider = window.$onekey?.ethereum || window.ethereum;

// Connect to wallet
async function connectWallet() {
  try {
    const accounts = await provider.request({
      method: 'eth_requestAccounts'
    });
    console.log('Connected accounts:', accounts);
    return accounts;
  } catch (error) {
    console.error('Failed to connect:', error);
  }
}
```

### 3. Multi-Chain Support

OneKey supports multiple blockchain networks through dedicated providers:

```javascript
// Available providers
const providers = {
  ethereum: window.$onekey?.ethereum,     // Ethereum & EVM chains
  solana: window.$onekey?.solana,         // Solana
  bitcoin: window.$onekey?.btc,           // Bitcoin
  near: window.$onekey?.near,             // NEAR Protocol
  aptos: window.$onekey?.aptos,           // Aptos
  sui: window.$onekey?.sui,               // Sui
  cosmos: window.$onekey?.cosmos,         // Cosmos
  polkadot: window.$onekey?.polkadot,     // Polkadot
  cardano: window.$onekey?.cardano,       // Cardano
  tron: window.$onekey?.tron,             // Tron
  ton: window.$onekey?.ton,               // TON
  webln: window.$onekey?.webln,           // Lightning Network
  nostr: window.$onekey?.nostr,           // Nostr
};
```

## Integration Guides

Choose the integration method that best fits your needs:

### By Blockchain
- [Ethereum & EVM Chains](eth/README.md)
- [Bitcoin](btc/README.md)
- [Solana](solana/README.md)
- [NEAR Protocol](near/README.md)
- [Lightning Network (WebLN)](webln/README.md)
- [Nostr](nostr/README.md)

### By Use Case
- [Basic Wallet Connection](eth/basic-connection.md)
- [Transaction Signing](eth/transaction-signing.md)
- [Message Signing](eth/message-signing.md)
- [Multi-Chain DApps](../multichain-integration.md)

## Best Practices

### 1. Provider Detection

Always check for OneKey-specific providers first:

```javascript
function getProvider(chain) {
  // Prefer OneKey-specific provider
  const onekeyProvider = window.$onekey?.[chain];
  if (onekeyProvider) {
    return onekeyProvider;
  }

  // Fallback to generic provider
  return window[chain] || window.ethereum;
}
```

### 2. Error Handling

Implement proper error handling for all wallet interactions:

```javascript
async function safeWalletCall(method, params) {
  try {
    const result = await provider.request({ method, params });
    return { success: true, data: result };
  } catch (error) {
    console.error('Wallet error:', error);
    return { success: false, error: error.message };
  }
}
```

### 3. Event Listeners

Listen for important wallet events:

```javascript
// Account changes
provider.on('accountsChanged', (accounts) => {
  console.log('Accounts changed:', accounts);
  // Update UI accordingly
});

// Chain changes
provider.on('chainChanged', (chainId) => {
  console.log('Chain changed:', chainId);
  // Update UI accordingly
});

// Disconnect
provider.on('disconnect', () => {
  console.log('Wallet disconnected');
  // Handle disconnection
});
```

## Live Examples

Explore our comprehensive examples:

- **[OneKey DApp Example](https://dapp-example.onekeytest.com/)** - Interactive examples for all supported chains
- **[GitHub Repository](https://github.com/OneKeyHQ/cross-inpage-provider)** - Complete source code and documentation

## Troubleshooting

### Common Issues

1. **Provider not found**: Ensure OneKey wallet is installed and enabled
2. **Connection rejected**: User may have rejected the connection request
3. **Network mismatch**: Verify the correct network is selected in OneKey
4. **Transaction failed**: Check gas fees and account balance

### Getting Help

- [GitHub Issues](https://github.com/OneKeyHQ/cross-inpage-provider/issues)
- [Discord Community](https://discord.gg/onekey)
- [Developer Documentation](https://developer.onekey.so/)

