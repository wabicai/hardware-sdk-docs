---
description: Choose the right integration path with OneKey and jump to detailed documentation quickly
---

# Developer Guide

Use this guide to decide which OneKey integration path fits your project and to reach the relevant documentation without guesswork.

## Target audience

| Role | Needs |
| --- | --- |
| Hardware SDK engineers | Real-time USB or BLE communication with OneKey devices |
| Air Gap integrators | QR-code based signing in offline or restricted environments |

{% hint style="info" %}
For dApp provider, WalletConnect, or aggregator use cases, see the standalone [OneKey dApp documentation](https://github.com/OneKeyHQ/hardware-js-sdk/tree/main/dapp-docs).
{% endhint %}

## Quick decision tree

### Direct hardware paths

| Method | Ideal use case | Documentation |
| --- | --- | --- |
| Hardware SDK (USB/BLE) | End-to-end device access and multi-chain signing | [Hardware Integration Guide](hardware-integration-developer.md) |
| Low-level transport | Custom transports or native extensions | [Common Connect Transport Guide](../advanced/transports/common-connect.md) |

### Air Gap workflows

| Method | Ideal use case | Documentation |
| --- | --- | --- |
| Air Gap SDK (QR-code) | Offline signing and isolated environments | [QR-code Overview](../advanced/qr-code/README.md) |

## Quick navigation

<div style="display: flex; gap: 16px; margin: 24px 0;">
  <a href="hardware-integration-developer.md" style="flex: 1; padding: 16px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; text-decoration: none; border-radius: 8px; text-align: center; font-weight: bold;">Hardware Integration</a>
  <a href="../advanced/qr-code/README.md" style="flex: 1; padding: 16px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; text-decoration: none; border-radius: 8px; text-align: center; font-weight: bold;">QR-code Signing</a>
</div>

## Tools and playground

| Tool | Purpose | Link |
| --- | --- | --- |
| SDK Playground | Test WebUSB integrations directly in the browser | [Launch playground](https://hardware-example.onekeytest.com/expo-playground/) |

## API reference quick access

### Hardware SDK
- [Basic API](../references/hardware-sdk/api-reference/basic-api/README.md) - Device management
- [Bitcoin and forks](../references/hardware-sdk/api-reference/bitcoin-and-bitcoin-forks/) - BTC signing
- [Ethereum and EVM](../references/hardware-sdk/api-reference/ethereum-and-evm/) - ETH signing
- [Full catalog](../references/hardware-sdk/api-reference/)

### Air Gap SDK
- [Quickstart](../advanced/qr-code/quickstart.md) - QR-code integration
- [API reference](../references/air-gap-sdk/api-reference/) - Offline signing structures

## Troubleshooting

- Hardware SDK APIs: [References](../references/hardware-sdk/api-reference/)
- Air Gap SDK: [References](../references/air-gap-sdk/api-reference/)
- dApp provider resources: [OneKey dApp docs](https://github.com/OneKeyHQ/hardware-js-sdk/tree/main/dapp-docs)

Need help?
- Troubleshooting guide: [Troubleshooting](../explanations/troubleshooting.md)
- Community support: https://github.com/OneKeyHQ/hardware-js-sdk/discussions
- Report issues: https://github.com/OneKeyHQ/hardware-js-sdk/issues

## Glossary

- **connectId** - Session identifier returned by `searchDevices`.
- **deviceId** - Persistent identifier obtained from `getFeatures`.
- **transport** - Communication channel such as WebUSB, BLE, or low-level custom integrations.
- **WebUSB** - Browser-level USB access that requires HTTPS and user consent.
- **env** - Preset runtime value (`webusb`, `react-native`, `lowlevel`, etc.).
- **showOnOneKey** - Determines whether prompts appear on the device screen.
- **passphrase** - Optional secret that unlocks hidden wallets.
- **firmware version** - Reported by `getFeatures`; controls API availability.
