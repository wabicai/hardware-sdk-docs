---
description: Choose the right integration path with OneKey and jump to detailed documentation quickly
---

# 🚀 Developer Guide

> **Quick Start**: Select your integration path below to get started immediately

This guide helps you choose the right integration path with OneKey and jump to the detailed docs quickly.

## 👨‍💻 Who is this for

<table>
<tr>
<td>🌐 <strong>Web DApp Developers</strong></td>
<td>📱 <strong>Native App Developers</strong></td>
</tr>
<tr>
<td>Integrating wallet connectivity in web applications</td>
<td>Building native or cross-platform apps with hardware integration</td>
</tr>
</table>

## 🎯 Quick Decision Tree

### 🌐 Web DApp Integration

| Integration Method | Best For | Get Started |
|-------------------|----------|-------------|
| **OneKey Provider** (EIP-1193) | Direct provider integration | [**→ OneKey Provider**](../connect-to-software/webapp-connect-onekey/) |
| **Wallet Aggregators** | Web3 Onboard, RainbowKit, Web3Modal | [**→ Wallet Kits**](../connect-to-software/support-wallet-kit/) |
| **WalletConnect** | Mobile/desktop connectivity | [**→ WalletConnect**](../connect-to-software/using-walletconnect/) |

### 🔧 Hardware Direct Integration

| Integration Method | Best For | Get Started |
|-------------------|----------|-------------|
| **Hardware SDK** (USB/BLE) | Direct hardware communication | [**→ Hardware Guide**](hardware-integration-developer.md) |
| **Air Gap SDK** (QR) | Fully offline signing | [**→ Hardware Guide**](hardware-integration-developer.md) |

---

## 🎯 Quick Navigation

<div style="display: flex; gap: 16px; margin: 24px 0;">
  <a href="web-app-integration-developer.md" style="flex: 1; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; text-align: center; font-weight: bold;">🌐 Web App Integration</a>
  <a href="hardware-integration-developer.md" style="flex: 1; padding: 16px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; text-decoration: none; border-radius: 8px; text-align: center; font-weight: bold;">🔧 Hardware Integration</a>
</div>

## 🛠️ Tools & Playground

| Tool | Purpose | Link |
|------|---------|------|
| **SDK Playground** | Test hardware integration online with WebUSB | [**Try Now →**](https://hardware-example.onekeytest.com/expo-playground/) |

## 🔍 API Reference Quick Access

### 🌐 Web Provider APIs
- [**Ethereum & EVM**](../connect-to-software/webapp-connect-onekey/eth/) - ETH, BSC, Polygon, etc.
- [**Bitcoin**](../connect-to-software/webapp-connect-onekey/btc/) - BTC, DOGE, LTC
- [**Solana**](../connect-to-software/webapp-connect-onekey/solana/) - SOL ecosystem
- [**NEAR**](../connect-to-software/webapp-connect-onekey/near/) - NEAR Protocol
- [**More Chains →**](../connect-to-software/webapp-connect-onekey/)

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

- 🌐 **Web Provider APIs**: [Connect to Software](../connect-to-software/webapp-connect-onekey/)
- 🔧 **Hardware SDK APIs**: [Connect to Hardware](../connect-to-hardware/hardware-sdk/api-reference/)
- 🔐 **Air Gap SDK**: [Air Gap Reference](../connect-to-hardware/air-gap-sdk/api-reference/)

**Need Help?**
- 📖 [**Troubleshooting Guide**](../troubleshooting.md)
- 💬 [**Community Support**](https://github.com/OneKeyHQ/hardware-js-sdk/discussions)
- 🐛 [**Report Issues**](https://github.com/OneKeyHQ/hardware-js-sdk/issues)

## 📚 术语表（Common Terms） {#common-terms}

- **connectId**: 与设备当前会话的连接标识，来源于 `searchDevices` 返回结果。
- **deviceId**: 设备的持久标识，通过 `getFeatures` 获取，某些链或设备操作会使用。
- **transport**: 通讯方式（WebUSB / BLE / Lowlevel）。Web 通过 WebUSB 直接通信，React Native 通过 BLE，原生可用 Lowlevel 插件。
- **WebUSB**: 浏览器原生 USB 通信协议，允许 Web 应用直接访问 USB 设备，需要 HTTPS 环境和用户授权。
- **env**: SDK 运行环境预设，例如 `webusb`、`react-native`、`lowlevel`。
- **showOnOneKey**: 是否在设备上弹出确认并显示信息。
- **passphrase**: 可选的额外口令，保护独立钱包空间，详见高级文档。
- **firmware version**: 设备固件版本，决定功能可用性与 API 行为，通过 `getFeatures` 获取。

