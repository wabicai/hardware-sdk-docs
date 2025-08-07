# Connect to Hardware

## Overview

OneKey Hardware SDK provides comprehensive support for integrating with OneKey hardware wallets. This includes direct device communication, transaction signing, and advanced features like air-gap functionality.

## Integration Options

### 1. Direct Hardware Integration

Connect directly to OneKey hardware devices:

- **[Hardware SDK](configuration/README.md)** - Direct device communication
- **[Blockchain APIs](coin-api/README.md)** - Comprehensive blockchain support
- **[Device Management](device-api/README.md)** - Device control and management

### 2. Air Gap Integration

Secure air-gap communication for enhanced security:

- **[Air Gap SDK](air-gap-sdk/README.md)** - QR code-based communication
- **[Wallet Integration](air-gap-sdk/tutorial-wallet-integration.md)** - Step-by-step integration guide

### 3. Advanced Features

Advanced hardware wallet functionality:

- **[Advanced Topics](advanced/README.md)** - PIN, passphrase, and protocol details
- **[Transport Plugins](advanced/low-level-transport-plugin.md)** - Custom transport implementations

## Supported Blockchains

OneKey Hardware SDK supports 30+ blockchain networks:

### Major Networks
- **Bitcoin** - Native Bitcoin support with advanced features
- **Ethereum** - Full EVM compatibility
- **Solana** - High-performance blockchain
- **Cardano** - Research-driven blockchain
- **Polkadot** - Multi-chain network
- **Cosmos** - Interoperable ecosystem
- **NEAR Protocol** - Developer-friendly blockchain
- **Aptos** - Move-based blockchain
- **Sui** - Move-based blockchain

### Additional Networks
- **Tron** - High-throughput blockchain
- **Stellar** - Cross-border payments
- **Ripple** - Enterprise blockchain
- **TON** - Telegram Open Network
- **FileCoin** - Decentralized storage
- **Kaspa** - High-speed blockchain
- **Algorand** - Pure proof-of-stake
- **Conflux** - High-performance blockchain
- **Nostr** - Decentralized social protocol
- **And many more...**

## Quick Start

### 1. Installation

```bash
# For web applications
npm install @onekeyfe/hd-web-sdk

# For React Native applications
npm install @onekeyfe/hd-ble-sdk
```

### 2. Basic Setup

```javascript
import OneKeyConnect from '@onekeyfe/hd-web-sdk';

// Initialize the SDK
OneKeyConnect.init({
  connectSrc: 'https://connect.onekey.so/',
  debug: false
});

// Get Bitcoin address
const result = await OneKeyConnect.btcGetAddress({
  path: "m/44'/0'/0'/0/0",
  coin: 'btc'
});

if (result.success) {
  console.log('Bitcoin address:', result.payload.address);
}
```

### 3. Transaction Signing

```javascript
// Sign Bitcoin transaction
const signResult = await OneKeyConnect.btcSignTransaction({
  inputs: [{
    address_n: [44 | 0x80000000, 0 | 0x80000000, 0 | 0x80000000, 0, 0],
    prev_hash: 'prev_tx_hash',
    prev_index: 0,
    amount: '100000'
  }],
  outputs: [{
    address: 'recipient_address',
    amount: '90000'
  }],
  coin: 'btc'
});

if (signResult.success) {
  console.log('Signed transaction:', signResult.payload.serializedTx);
}
```

## Key Features

### 1. Multi-Platform Support

- **Web Applications** - Browser-based integration
- **Desktop Applications** - Electron and native apps
- **Mobile Applications** - React Native support
- **Node.js** - Server-side integration

### 2. Multiple Transport Methods

- **WebUSB** - Direct USB communication in browsers
- **Bridge** - OneKey Bridge application
- **Bluetooth** - Wireless communication (mobile)
- **HTTP** - Network-based communication

### 3. Advanced Security

- **PIN Protection** - Device PIN management
- **Passphrase Support** - Additional security layer
- **Secure Communication** - Encrypted device communication
- **Air Gap Mode** - QR code-based signing

### 4. Developer-Friendly

- **TypeScript Support** - Full type definitions
- **Comprehensive Documentation** - Detailed guides and examples
- **Error Handling** - Clear error messages and codes
- **Event System** - Real-time device events

## Integration Guides

### By Platform
- [Web Integration](configuration/installation.md#web-integration)
- [Desktop Integration](configuration/installation.md#desktop-integration)
- [Mobile Integration](configuration/installation.md#mobile-integration)
- [Node.js Integration](configuration/installation.md#nodejs-integration)

### By Blockchain
- [Bitcoin Integration](coin-api/btc/README.md)
- [Ethereum Integration](coin-api/evm/README.md)
- [Solana Integration](coin-api/solana/README.md)
- [Cardano Integration](coin-api/cardano/README.md)
- [All Supported Chains](coin-api/README.md)

### By Use Case
- [Basic Address Generation](coin-api/README.md#address-generation)
- [Transaction Signing](coin-api/README.md#transaction-signing)
- [Message Signing](coin-api/README.md#message-signing)
- [Device Management](device-api/README.md)

## Best Practices

### 1. Error Handling

```javascript
try {
  const result = await OneKeyConnect.btcGetAddress({
    path: "m/44'/0'/0'/0/0",
    coin: 'btc'
  });
  
  if (result.success) {
    // Handle success
    console.log('Address:', result.payload.address);
  } else {
    // Handle error
    console.error('Error:', result.payload.error);
  }
} catch (error) {
  console.error('SDK Error:', error);
}
```

### 2. Device Connection

```javascript
// Listen for device events
OneKeyConnect.on('device-connect', (device) => {
  console.log('Device connected:', device);
});

OneKeyConnect.on('device-disconnect', (device) => {
  console.log('Device disconnected:', device);
});
```

### 3. User Experience

- **Clear Instructions** - Guide users through device interactions
- **Loading States** - Show progress during operations
- **Error Messages** - Provide helpful error information
- **Device Status** - Display connection and device state

## Development Resources

### Documentation
- **[Configuration Guide](configuration/README.md)** - Setup and configuration
- **[API Reference](coin-api/README.md)** - Complete API documentation
- **[Error Codes](configuration/error-codes.md)** - Error handling reference

### Examples
- **[GitHub Examples](https://github.com/OneKeyHQ/hardware-js-sdk/tree/main/packages/connect-examples)** - Complete example applications
- **[Live Demo](https://connect.onekey.so/)** - Interactive API testing

### Community
- **[GitHub Issues](https://github.com/OneKeyHQ/hardware-js-sdk/issues)** - Report bugs and request features
- **[Discord Community](https://discord.gg/onekey)** - Get help from the community
- **[Developer Portal](https://developer.onekey.so/)** - Official developer resources

## Migration Guides

### From Trezor Connect
OneKey SDK is based on Trezor Connect with additional features:

```javascript
// Trezor Connect code works with minimal changes
import OneKeyConnect from '@onekeyfe/hd-web-sdk';

// Same API, enhanced features
const result = await OneKeyConnect.btcGetAddress({
  path: "m/44'/0'/0'/0/0",
  coin: 'btc'
});
```

### From Other Hardware SDKs
OneKey provides compatibility layers and migration guides for popular hardware wallet SDKs.

## Troubleshooting

### Common Issues

1. **Device not detected** - Check USB connection and permissions
2. **Bridge not running** - Install and start OneKey Bridge
3. **Permission denied** - Grant necessary browser permissions
4. **Firmware outdated** - Update device firmware

### Getting Help

1. **Check Documentation** - Review relevant integration guides
2. **Try Examples** - Test with provided examples
3. **Search Issues** - Look for similar problems on GitHub
4. **Ask Community** - Get help on Discord
5. **Report Bugs** - Create GitHub issues for bugs

## Next Steps

1. **Choose Integration Method** - Select the approach that fits your needs
2. **Follow Setup Guide** - Complete installation and configuration
3. **Test with Examples** - Verify your integration works
4. **Deploy and Monitor** - Launch your application and monitor usage

Ready to get started? Choose your integration method above and follow the detailed guides!
