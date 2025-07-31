---
description: OneKey Hardware SDK Documentation
---

# OneKey Hardware SDK

Welcome to the OneKey Hardware SDK documentation. This SDK enables secure integration with OneKey hardware wallets across multiple platforms including web browsers, Node.js applications, and mobile apps.

## What is OneKey Hardware SDK?

OneKey Hardware SDK is a comprehensive JavaScript library that provides secure communication with OneKey hardware wallets. It enables developers to build applications that can:

- Generate cryptocurrency addresses securely
- Sign transactions with hardware-level security
- Support multiple blockchain networks
- Provide seamless user experience across platforms

## Key Features

### 🔒 **Security First**
- Private keys never leave the hardware device
- All transactions require user confirmation on device
- Secure element protection
- Open source and auditable

### 🌐 **Multi-Platform**
- Web browsers (Chrome, Edge, Opera)
- Desktop applications (Electron)
- Mobile applications (React Native)
- Server-side applications (Node.js)

### ⚡ **Developer Friendly**
- Simple and intuitive API
- Comprehensive documentation
- TypeScript support
- Extensive examples

### 🔗 **Multi-Chain**
- Support for 50+ cryptocurrencies
- Unified API across different blockchains
- Easy integration with existing wallets
- Regular updates for new chains

## Quick Start

Get started with OneKey Hardware SDK in just a few minutes:

### Installation

Choose the appropriate SDK package for your platform:

```bash
# For web applications
npm install @onekeyfe/hd-web-sdk

# For Node.js/Electron applications
npm install @onekeyfe/hd-common-connect-sdk

# For React Native mobile apps
npm install @onekeyfe/hd-ble-sdk
```

### Basic Usage

```javascript
import { HardwareSDK } from '@onekeyfe/hd-web-sdk';

// Initialize the SDK
await HardwareSDK.init({
  debug: false,
  connectSrc: 'https://jssdk.onekey.so/',
  manifest: {
    email: 'developer@yourapp.com',
    appName: 'Your App Name',
    appUrl: 'https://yourapp.com'
  }
});

// Connect to device
const devices = await HardwareSDK.searchDevices();
await HardwareSDK.connectDevice(devices[0].path);

// Get Bitcoin address
const result = await HardwareSDK.btcGetAddress({
  path: "m/44'/0'/0'/0/0",
  showOnDevice: true,
  coin: 'btc'
});

console.log('Bitcoin address:', result.payload.address);
```

## Platform Support

| Platform | Package | Transport | Status |
|----------|---------|-----------|---------|
| **Web Browser** | `@onekeyfe/hd-web-sdk` | WebUSB | ✅ Stable |
| **Node.js** | `@onekeyfe/hd-common-connect-sdk` | USB/HID, HTTP Bridge | ✅ Stable |
| **Electron** | `@onekeyfe/hd-common-connect-sdk` | USB/HID, HTTP Bridge | ✅ Stable |
| **React Native** | `@onekeyfe/hd-ble-sdk` | Bluetooth | ✅ Stable |

## Supported Blockchains

OneKey Hardware SDK supports a wide range of cryptocurrencies and blockchain networks:

### Bitcoin & Forks
- Bitcoin (BTC)
- Litecoin (LTC)
- Bitcoin Cash (BCH)
- Dogecoin (DOGE)
- Dash (DASH)
- Zcash (ZEC)

### Ethereum & EVM Chains
- Ethereum (ETH)
- Polygon (MATIC)
- Binance Smart Chain (BNB)
- Avalanche (AVAX)
- Fantom (FTM)
- Arbitrum
- Optimism

### Other Blockchains
- **Solana (SOL)** - SPL tokens, staking, program interactions
- **Cardano (ADA)** - Native tokens, staking, smart contracts
- **Polkadot (DOT)** - Parachains, staking, governance
- **Cosmos (ATOM)** - IBC transfers, staking, governance
- **Kusama (KSM)** - Polkadot's canary network
- **Terra (LUNA)** - Terra ecosystem
- **Osmosis (OSMO)** - Cosmos DEX
- **Juno (JUNO)** - Cosmos smart contracts
- **Secret Network (SCRT)** - Privacy-focused blockchain

[View complete list of supported coins →](resources/supported-coins.md)

## Documentation Structure

This documentation is organized into the following sections:

### 🚀 [Quick Start](quick-start/installation.md)
Get up and running with OneKey SDK in minutes with step-by-step installation, first integration, and basic examples.

### 📦 [SDK Packages](sdk/concepts.md)
Learn about the different SDK packages, core concepts, transport layers, and platform-specific implementations.

### 🔗 [Integration Guides](integration/web-browser.md)
Platform-specific integration guides for web browsers, Node.js/Electron, React Native, and best practices.

### 📚 [API Reference](api/device.md)
Complete API documentation with detailed parameters, return values, and examples for all SDK methods.

### 🛠️ [Resources](resources/supported-coins.md)
Additional resources including supported coins, device models, troubleshooting, migration guide, and FAQ.

## Community & Support

### Getting Help
- 📖 **Documentation**: You're reading it!
- 💬 **Discord**: [OneKey Community](https://discord.gg/onekey)
- 🐛 **GitHub Issues**: [Report bugs and request features](https://github.com/OneKeyHQ/hardware-js-sdk/issues)
- 📧 **Email**: developer@onekey.so

### Contributing
We welcome contributions from the community! Please see our [Contributing Guide](https://github.com/OneKeyHQ/hardware-js-sdk/blob/main/CONTRIBUTING.md) for details.

### License
OneKey Hardware SDK is open source software licensed under the [MIT License](https://github.com/OneKeyHQ/hardware-js-sdk/blob/main/LICENSE).

## Next Steps

Ready to start building? Here are some recommended next steps:

1. **[Installation & Setup](quick-start/installation.md)** - Get your development environment ready
2. **[First Integration](quick-start/first-integration.md)** - Build your first OneKey integration
3. **[Basic Examples](quick-start/examples.md)** - See common usage patterns
4. **[Core Concepts](sdk/concepts.md)** - Understand the SDK architecture
5. **[API Reference](api/device.md)** - Explore all available methods

### By Blockchain
- **[Bitcoin & Bitcoin Forks](api/bitcoin.md)** - BTC, LTC, BCH, DOGE, and more
- **[Ethereum & EVM Chains](api/ethereum.md)** - ETH, MATIC, BNB, AVAX, and more
- **[Solana](api/solana.md)** - SOL and SPL tokens
- **[Cardano](api/cardano.md)** - ADA and native tokens
- **[Polkadot](api/polkadot.md)** - DOT, KSM, and parachains
- **[Cosmos](api/cosmos.md)** - ATOM, OSMO, JUNO, and IBC chains

### By Platform
- **[Web Browser](integration/web-browser.md)** - WebUSB and Bridge integration
- **[Electron Desktop](integration/electron.md)** - Native desktop applications
- **[Node.js & Electron](integration/nodejs-electron.md)** - Server and desktop apps
- **[React Native](integration/react-native.md)** - Cross-platform mobile apps
- **[Native Mobile](integration/native-mobile.md)** - iOS and Android native apps
- **[Air Gap](integration/air-gap.md)** - QR code offline signing

---

*OneKey Hardware SDK - Secure, Simple, Universal*
