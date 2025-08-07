# Connect to Hardware

## Overview

OneKey Hardware SDK provides comprehensive support for integrating with OneKey hardware wallets. The **Web SDK** is the recommended solution for most applications, offering direct WebUSB communication with hardware devices in web browsers.

## Recommended Integration: Web SDK

### Web SDK (Recommended)

The **@onekeyfe/hd-web-sdk** is the primary and recommended way to integrate with OneKey hardware wallets:

- **[Getting Started](configuration/README.md)** - Quick setup and configuration
- **[Installation Guide](configuration/installation.md)** - Web SDK installation and initialization
- **[Blockchain APIs](coin-api/README.md)** - Complete API reference for 30+ blockchains
- **[Device Management](device-api/README.md)** - Device discovery and control

**Key Features:**
- **WebUSB Support** - Direct USB communication in modern browsers
- **No Bridge Required** - Works without additional software installation
- **TypeScript Support** - Full type definitions included
- **Cross-Platform** - Works on all modern web browsers
- **Secure** - Direct device communication with encryption

### Quick Start with Web SDK

```bash
# Install the Web SDK
npm install @onekeyfe/hd-web-sdk
```

```javascript
import OneKeyConnect from '@onekeyfe/hd-web-sdk';

// Initialize with WebUSB
await OneKeyConnect.init({
  connectSrc: 'https://connect.onekey.so/',
  debug: false
});

// Get Bitcoin address
const result = await OneKeyConnect.btcGetAddress({
  path: "m/44'/0'/0'/0/0",
  coin: 'btc'
});
```

## Advanced Integration Options

For specialized use cases, OneKey provides additional SDKs:

### Air Gap Integration

Secure air-gap communication for enhanced security:

- **[Air Gap SDK](air-gap-sdk/README.md)** - QR code-based communication
- **[Wallet Integration](air-gap-sdk/tutorial-wallet-integration.md)** - Step-by-step integration guide

### Advanced SDKs

For mobile and specialized environments:

- **[Advanced Integration Options](advanced/README.md)** - BLE SDK, Common Connect SDK, and custom transports
- **[Mobile Integration](advanced/common-sdk-guide.md)** - React Native and mobile app integration
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

## Complete Integration Example

### 1. Installation

```bash
# Install Web SDK (Recommended)
npm install @onekeyfe/hd-web-sdk
```

### 2. Initialize and Connect

```javascript
import OneKeyConnect from '@onekeyfe/hd-web-sdk';

// Initialize with WebUSB support
await OneKeyConnect.init({
  connectSrc: 'https://connect.onekey.so/',
  debug: false
});

// Search for connected devices
const devices = await OneKeyConnect.searchDevices();
console.log('Found devices:', devices);
```

### 3. Get Address

```javascript
// Get Bitcoin address
const result = await OneKeyConnect.btcGetAddress({
  path: "m/44'/0'/0'/0/0",
  coin: 'btc',
  showOnOneKey: true
});

if (result.success) {
  console.log('Bitcoin address:', result.payload.address);
}
```

### 4. Sign Transaction

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

### 1. Web SDK Advantages

- **WebUSB Support** - Direct USB communication in modern browsers
- **No Additional Software** - Works without OneKey Bridge installation
- **Cross-Browser Compatibility** - Chrome, Edge, Opera, and other Chromium-based browsers
- **TypeScript Ready** - Full type definitions included
- **Secure Communication** - End-to-end encrypted device communication

### 2. Advanced Options Available

- **Mobile Support** - React Native integration via BLE SDK
- **Desktop Applications** - Electron and native app support
- **Air Gap Mode** - QR code-based signing for enhanced security
- **Custom Transports** - Extensible transport layer

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

### Getting Started (Recommended Path)
- **[Web SDK Setup](configuration/installation.md)** - Quick start with WebUSB
- **[Configuration Guide](configuration/README.md)** - Essential setup information
- **[Device Discovery](device-api/search-devices.md)** - Find and connect to devices
- **[First API Call](coin-api/btc/btcgetaddress.md)** - Get your first address

### By Blockchain
- [Bitcoin Integration](coin-api/btc/README.md)
- [Ethereum Integration](coin-api/evm/README.md)
- [Solana Integration](coin-api/solana/README.md)
- [Cardano Integration](coin-api/cardano/README.md)
- [All Supported Chains](coin-api/README.md)

### Advanced Integration
- [Mobile Apps (React Native)](advanced/common-sdk-guide.md)
- [Desktop Applications](advanced/common-sdk-guide.md)
- [Air Gap Integration](air-gap-sdk/README.md)
- [Custom Transport Plugins](advanced/low-level-transport-plugin.md)

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

1. **Device not detected** - Check USB connection and WebUSB permissions
2. **WebUSB not supported** - Use a compatible browser (Chrome, Edge, Opera)
3. **Permission denied** - Grant necessary browser permissions for device access
4. **Firmware outdated** - Update device firmware through OneKey app

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
