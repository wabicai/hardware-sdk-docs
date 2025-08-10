# OneKey Hardware SDK

Integrate OneKey hardware wallets with your applications. Built for developers, designed for security.

> This documentation streamlines and modernizes the structure from our previous Hardware Documents, focusing on a clear WebUSB-first integration path and concise, high-signal guidance.


## Quick Start

Choose your development environment:

| Environment | Package | Use Case |
|-------------|---------|----------|
| **Web** | `@onekeyfe/hd-web-sdk` | Web apps, browser extensions |
| **Mobile** | `@onekeyfe/hd-ble-sdk` | React Native, mobile apps |


## SDKs at a Glance

- Hardware SDK
  - Repo: https://github.com/OneKeyHQ/hardware-js-sdk
  - Primary packages: @onekeyfe/hd-web-sdk (WebUSB, browser), @onekeyfe/hd-ble-sdk (React Native)
- Software SDK (cross-inpage provider)
  - Repo: https://github.com/OneKeyHQ/cross-inpage-provider
  - Purpose: dApp-facing provider to connect web apps to OneKey software wallets (extension/app), WalletConnect, etc.
  - See: connect-to-software/ for integration guides

| **Web** | `@onekeyfe/hd-web-sdk` | Web apps, browser extensions |
| **Mobile** | `@onekeyfe/hd-ble-sdk` | React Native, mobile apps |

**[→ Get Started](quick-start.md)**

## Features

- **25+ Blockchains** - Bitcoin, Ethereum, Solana, Cardano, and more
- **Multi-Platform** - Node.js, Web, React Native support
- **Type Safety** - Full TypeScript definitions
- **Hardware Security** - Direct device communication

## Documentation

### Getting Started
- **[Quick Start](quick-start.md)** - Environment setup and first integration (WebUSB)
- **[Connect to Hardware](connect-to-hardware/README.md)** - WebUSB overview and routes to details
- **[Installation & Setup](connect-to-hardware/configuration/installation.md)** - SDK initialization, permissions, compatibility

### API Reference
- **[Blockchain APIs](connect-to-hardware/coin-api/README.md)** - Bitcoin, Ethereum, Solana, and more
- **[Device Management](connect-to-hardware/device-api/README.md)** - Hardware wallet control and features
- **[Air Gap SDK](connect-to-hardware/air-gap-sdk/README.md)** - Offline signing with QR codes

### Advanced Integration
- **[Advanced Topics](advanced/README.md)** - PIN, passphrase, and protocol details
- **[Error Handling](configuration/error-codes.md)** - Complete error code reference
- **[Derivation Paths](configuration/paths.md)** - BIP32/BIP44 path specifications

## Try It Out

**[SDK Playground](https://hardware-example.onekeytest.com/expo-playground/)** - Test hardware wallet interactions in your browser

## Resources

- **[GitHub](https://github.com/OneKeyHQ)** - Source code and issues
- **[Help Center](https://help.onekey.so/hc)** - User support
- **[OneKey Website](https://onekey.so/)** - Official website
