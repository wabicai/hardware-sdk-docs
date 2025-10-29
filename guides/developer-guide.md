---
description: Choose the right integration path with OneKey and jump to detailed documentation quickly
---

# 🚀 Developer Guide

> **Quick Start**: Select your integration path below to get started immediately

This guide helps you choose the right integration path with OneKey and jump to the detailed docs quickly.

## 👨‍💻 Target Audience

<table>
<tr>
<td>🔧 <strong>Hardware SDK Engineers</strong></td>
<td>📱 <strong>Air Gap Integrators</strong></td>
</tr>
<tr>
<td>Need real-time USB/BLE communication with OneKey hardware wallets</td>
<td>Need QR-based signing in offline or restricted environments</td>
</tr>
</table>

{% hint style="info" %}
For web dApp providers, WalletConnect, or wallet aggregator integrations, head to the standalone [OneKey dApp documentation](https://github.com/OneKeyHQ/hardware-js-sdk/tree/main/dapp-docs).
{% endhint %}

## 🎯 Quick Decision Tree

### 🔧 Direct Hardware Paths

| Integration Method | Ideal Use Case | Get Started |
|-------------------|----------------|-------------|
| **Hardware SDK** (USB/BLE) | End-to-end device access and multi-chain signing | [**→ Hardware Guide**](hardware-integration-developer.md) |
| **Low-level Transport** | Custom transport layers or native extensions | [**→ Hardware Guide**](hardware-integration-developer.md#low-level-transport) |

### 📱 Air Gap Workflows

| Integration Method | Ideal Use Case | Get Started |
|-------------------|----------------|-------------|
| **Air Gap SDK** (QR) | Offline signing and isolated environments | [**→ Air Gap Quick Start**](../connect-to-hardware/air-gap-sdk/started.md) |

---

## 🎯 Quick Navigation

<div style="display: flex; gap: 16px; margin: 24px 0;">
  <a href="hardware-integration-developer.md" style="flex: 1; padding: 16px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; text-decoration: none; border-radius: 8px; text-align: center; font-weight: bold;">🔧 Hardware Integration</a>
  <a href="../connect-to-hardware/air-gap-sdk/README.md" style="flex: 1; padding: 16px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; text-decoration: none; border-radius: 8px; text-align: center; font-weight: bold;">📱 Air Gap SDK</a>
</div>

## 🛠️ Tools & Playground

| Tool | Purpose | Link |
|------|---------|------|
| **SDK Playground** | Try Hardware SDK WebUSB integrations directly in the browser | [**Try Now →**](https://hardware-example.onekeytest.com/expo-playground/) |

## 🔍 API Reference Quick Access

### 🔧 Hardware SDK APIs
- [**Basic API**](../connect-to-hardware/hardware-sdk/api-reference/basic-api/) - Device management
- [**Bitcoin & Forks**](../connect-to-hardware/hardware-sdk/api-reference/bitcoin-and-bitcoin-forks/) - BTC signing
- [**Ethereum & EVM**](../connect-to-hardware/hardware-sdk/api-reference/ethereum-and-evm/) - ETH signing
- [**All Supported Chains →**](../connect-to-hardware/hardware-sdk/api-reference/)

### 🔐 Air Gap SDK
- [**Getting Started**](../connect-to-hardware/air-gap-sdk/started.md) - QR code integration
- [**API Reference**](../connect-to-hardware/air-gap-sdk/api-reference/) - Offline signing

## ❓ Troubleshooting

**Can't find a specific API?** Navigate by category:

- 🔧 **Hardware SDK APIs**: [Connect to Hardware](../connect-to-hardware/hardware-sdk/api-reference/)
- 🔐 **Air Gap SDK**: [Air Gap Reference](../connect-to-hardware/air-gap-sdk/api-reference/)
- 🌐 **dApp Provider**: Visit the [OneKey dApp docs](https://github.com/OneKeyHQ/hardware-js-sdk/tree/main/dapp-docs)

**Need Help?**
- 📖 [**Troubleshooting Guide**](../troubleshooting.md)
- 💬 [**Community Support**](https://github.com/OneKeyHQ/hardware-js-sdk/discussions)
- 🐛 [**Report Issues**](https://github.com/OneKeyHQ/hardware-js-sdk/issues)

## 📚 Glossary {#common-terms}

- **connectId**: Session identifier returned by `searchDevices`, used for the current device connection.
- **deviceId**: Persistent identifier retrieved via `getFeatures`; required for certain device or chain actions.
- **transport**: Communication channel (WebUSB / BLE / low-level). Web uses WebUSB, React Native uses BLE, native apps can adopt low-level plugins.
- **WebUSB**: Browser-level USB protocol that provides device access in HTTPS contexts with user consent.
- **env**: Preset runtime environment such as `webusb`, `react-native`, or `lowlevel`.
- **showOnOneKey**: Determines whether confirmation is displayed on the device screen.
- **passphrase**: Optional additional secret that protects an independent wallet space; see Advanced docs for details.
- **firmware version**: Device firmware build which controls API availability and behavior, accessible via `getFeatures`.
