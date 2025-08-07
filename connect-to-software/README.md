# Connect to Software

## Overview

OneKey provides comprehensive software integration solutions for DApps and web applications through multiple approaches. Whether you're building a simple Ethereum DApp or a complex multi-chain application, OneKey has the tools and APIs you need.

## Integration Options

### 1. Direct Provider Integration

Connect directly to OneKey wallet through injected providers:

- **[DApp Connect to OneKey](webapp-connect-onekey/README.md)** - Direct integration with OneKey providers
- **[MetaMask Compatibility](compatible-with-metamask/README.md)** - Seamless compatibility with existing MetaMask integrations

### 2. Wallet Kit Integration

Use popular wallet connection libraries that support OneKey:

- **[Wallet Kit Support](support-wallet-kit/README.md)** - Integration with popular wallet kits
  - [RainbowKit](support-wallet-kit/rainbowkit.md) - Ethereum wallet connection
  - [Web3Modal](support-wallet-kit/web3modal.md) - Multi-wallet modal
  - [Web3 Onboard](support-wallet-kit/web3-onboard.md) - Comprehensive wallet management
  - [Aptos Wallet Adapter](support-wallet-kit/aptos-wallet-adapter.md) - Aptos ecosystem integration

### 3. WalletConnect Integration

Connect through WalletConnect protocol for mobile and cross-platform support:

- **[WalletConnect Integration](using-walletconnect/README.md)** - WalletConnect protocol support
  - [Ethereum WalletConnect](using-walletconnect/eth.md) - EVM chains via WalletConnect
  - [Aptos WalletConnect](using-walletconnect/aptos/README.md) - Aptos via WalletConnect

## Supported Blockchains

OneKey provides native support for multiple blockchain networks:

### EVM-Compatible Chains
- **Ethereum** - Full EIP-1193 compatibility
- **Polygon** - Layer 2 scaling solution
- **Binance Smart Chain** - High-performance blockchain
- **Arbitrum** - Optimistic rollup
- **Optimism** - Optimistic rollup
- **Avalanche** - High-throughput blockchain
- **And many more...**

### Non-EVM Chains
- **Bitcoin** - Native Bitcoin support with PSBT, Ordinals, and BRC-20
- **Solana** - High-performance blockchain
- **NEAR Protocol** - Developer-friendly blockchain
- **Aptos** - Move-based blockchain
- **Sui** - Move-based blockchain
- **Cosmos** - Interoperable blockchain ecosystem
- **Polkadot** - Multi-chain network
- **Cardano** - Research-driven blockchain
- **Tron** - High-throughput blockchain
- **TON** - Telegram Open Network
- **Lightning Network** - Bitcoin Layer 2
- **Nostr** - Decentralized social protocol

## Quick Start Guide

### 1. Choose Your Integration Method

**For Ethereum/EVM DApps:**
```javascript
// Direct OneKey integration
const provider = window.$onekey?.ethereum || window.ethereum;
await provider.request({ method: 'eth_requestAccounts' });
```

**For Multi-chain DApps:**
```javascript
// Access multiple providers
const providers = {
  ethereum: window.$onekey?.ethereum,
  bitcoin: window.$onekey?.btc,
  solana: window.$onekey?.solana,
  // ... other chains
};
```

**For Wallet Kit Integration:**
```javascript
// Using RainbowKit (example)
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { onekeyWallet } from '@rainbow-me/rainbowkit/wallets';

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [onekeyWallet({ chains })],
  },
]);
```

### 2. Basic Connection Flow

1. **Detect OneKey** - Check if OneKey is installed
2. **Request Connection** - Ask user to connect their wallet
3. **Handle Events** - Listen for account and network changes
4. **Interact** - Send transactions, sign messages, etc.

### 3. Error Handling

Always implement proper error handling:

```javascript
try {
  const accounts = await provider.request({ 
    method: 'eth_requestAccounts' 
  });
} catch (error) {
  if (error.code === 4001) {
    console.log('User rejected the request');
  } else {
    console.error('Error:', error);
  }
}
```

## Best Practices

### 1. Provider Detection

Always check for OneKey-specific providers first:

```javascript
function getProvider(chain = 'ethereum') {
  // Prefer OneKey-specific provider
  if (window.$onekey?.[chain]) {
    return window.$onekey[chain];
  }
  
  // Fallback to generic provider
  return window[chain];
}
```

### 2. Event Handling

Set up proper event listeners:

```javascript
provider.on('accountsChanged', handleAccountsChanged);
provider.on('chainChanged', handleChainChanged);
provider.on('disconnect', handleDisconnect);
```

### 3. User Experience

- **Clear Error Messages** - Provide helpful error messages
- **Loading States** - Show loading indicators during operations
- **Connection Status** - Display current connection state
- **Network Indicators** - Show current network/chain

## Development Resources

### Live Examples
- **[OneKey DApp Example](https://dapp-example.onekeytest.com/)** - Interactive examples for all supported chains
- **[GitHub Repository](https://github.com/OneKeyHQ/cross-inpage-provider)** - Complete source code

### Documentation
- **[API Reference](webapp-connect-onekey/README.md)** - Complete API documentation
- **[Integration Guides](webapp-connect-onekey/README.md)** - Step-by-step integration guides
- **[Best Practices](webapp-connect-onekey/README.md#best-practices)** - Recommended patterns

### Community
- **[GitHub Issues](https://github.com/OneKeyHQ/cross-inpage-provider/issues)** - Report bugs and request features
- **[Discord Community](https://discord.gg/onekey)** - Get help from the community
- **[Developer Portal](https://developer.onekey.so/)** - Official developer resources

## Migration Guides

### From MetaMask
If you're migrating from MetaMask, OneKey provides full compatibility:

```javascript
// Your existing MetaMask code works with OneKey
const provider = window.ethereum;
await provider.request({ method: 'eth_requestAccounts' });

// Or prefer OneKey specifically
const provider = window.$onekey?.ethereum || window.ethereum;
```

### From Other Wallets
OneKey follows standard protocols like EIP-1193, making migration straightforward:

- **EIP-1193** - Ethereum Provider API
- **WalletConnect** - Cross-platform wallet protocol
- **Wallet Standard** - Solana wallet standard

## Troubleshooting

### Common Issues

1. **Provider not found** - Ensure OneKey is installed
2. **Connection rejected** - User declined connection request
3. **Network mismatch** - Wrong network selected
4. **Transaction failed** - Check gas/fees and balances

### Getting Help

1. **Check Documentation** - Review relevant integration guides
2. **Try Examples** - Test with our live examples
3. **Search Issues** - Look for similar problems on GitHub
4. **Ask Community** - Get help on Discord
5. **Report Bugs** - Create GitHub issues for bugs

## Next Steps

1. **Choose Integration Method** - Select the approach that fits your needs
2. **Follow Integration Guide** - Use our step-by-step guides
3. **Test with Examples** - Verify your integration works
4. **Deploy and Monitor** - Launch your DApp and monitor usage

Ready to get started? Choose your integration method above and follow the detailed guides!
