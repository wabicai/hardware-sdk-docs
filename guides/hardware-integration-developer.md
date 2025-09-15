---
description: Direct hardware integration guide for native apps using OneKey Hardware SDK and Air Gap SDK
---

# 🔧 Hardware Integration Guide

> **For developers building apps that communicate directly with OneKey hardware devices**

Integrate OneKey hardware wallets directly into your native applications using USB, Bluetooth, or QR code (Air Gap) connections.

## ⚡ Quick Start (5 minutes)

### 🔌 USB/Bluetooth Integration

<div style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); padding: 20px; border-radius: 12px; margin: 16px 0;">
  <h4 style="margin: 0 0 12px 0; color: #2d3748;">🚀 Step-by-Step Setup</h4>
  <ol style="margin: 0; padding-left: 20px; color: #4a5568;">
    <li><strong>Install Hardware Bridge</strong> → <a href="https://onekey.so/download?client=bridge" style="color: #e53e3e; font-weight: bold;">Download Bridge</a></li>
    <li><strong>Connect Device</strong> → USB or Bluetooth</li>
    <li><strong>Test Integration</strong> → <a href="https://hardware-example.onekeytest.com/expo-playground/" style="color: #e53e3e; font-weight: bold;">SDK Playground</a></li>
    <li><strong>Add to Your App</strong> → Install & Initialize SDK</li>
    <li><strong>Handle UI Events</strong> → Prompts & Results</li>
  </ol>
</div>

### 📱 Quick Test
After setup, verify your connection:
```javascript
// Test device connection
import OneKeyConnect from '@onekeyfe/connect';

const result = await OneKeyConnect.getFeatures();
console.log('Device info:', result);
```

## 🎯 Choose Your Integration Path

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
<tr>
<td style="border: 3px solid #38a169; padding: 24px; border-radius: 12px; background: linear-gradient(135deg, #68d391 0%, #9ae6b4 100%); margin: 10px;">
  <h3 style="margin: 0 0 16px 0;">🔧 Hardware SDK</h3>
  <p><strong>Full Device Control</strong></p>
  <div style="margin: 12px 0;">
    <p>✅ USB & Bluetooth connectivity</p>
    <p>✅ Real-time device interaction</p>
    <p>✅ Complete hardware features</p>
    <p>✅ 20+ blockchain support</p>
  </div>
  <div style="margin-top: 20px;">
    <a href="../connect-to-hardware/hardware-sdk/started.md" style="background: #38a169; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">🚀 Get Started</a>
  </div>
</td>
<td style="border: 3px solid #3182ce; padding: 24px; border-radius: 12px; background: linear-gradient(135deg, #63b3ed 0%, #90cdf4 100%); margin: 10px;">
  <h3 style="margin: 0 0 16px 0;">🔐 Air Gap SDK</h3>
  <p><strong>QR Code / Offline Signing</strong></p>
  <div style="margin: 12px 0;">
    <p>✅ Completely offline operation</p>
    <p>✅ QR code communication</p>
    <p>✅ Maximum security</p>
    <p>✅ No network required</p>
  </div>
  <div style="margin-top: 20px;">
    <a href="../connect-to-hardware/air-gap-sdk/started.md" style="background: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">🔐 Go Offline</a>
  </div>
</td>
</tr>
</table>

## 📝 Important Notes & Requirements

<div style="background: #fff3cd; border: 2px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h4 style="margin: 0 0 12px 0; color: #856404;">⚠️ Platform Requirements</h4>
  <ul style="margin: 0; color: #856404;">
    <li><strong>Hardware Bridge</strong> - Required for browser/desktop USB communication</li>
    <li><strong>Bluetooth Support</strong> - Depends on platform capabilities (mobile native apps)</li>
    <li><strong>HTTPS Required</strong> - For web applications using WebUSB</li>
  </ul>
</div>

## 📦 API Reference by Blockchain

### 🔩 Core APIs
- [**Device Management**](../connect-to-hardware/hardware-sdk/api-reference/basic-api/) - Connect, search, features
- [**Common Parameters**](../connect-to-hardware/hardware-sdk/api-reference/common-params.md) - Shared configs
- [**Error Codes**](../connect-to-hardware/hardware-sdk/api-reference/error-code.md) - Troubleshooting

### 🌐 Blockchain APIs

<table style="width: 100%;">
<tr style="background: #f8f9fa;">
  <th style="padding: 12px; text-align: left;">Blockchain</th>
  <th style="padding: 12px; text-align: left;">APIs Available</th>
  <th style="padding: 12px; text-align: left;">Quick Start</th>
</tr>
<tr>
  <td style="padding: 12px;"><strong>🟨 Bitcoin & Forks</strong></td>
  <td style="padding: 12px;">Address, Sign, PSBT, Message</td>
  <td style="padding: 12px;"><a href="../connect-to-hardware/hardware-sdk/api-reference/bitcoin-and-bitcoin-forks/">→ BTC Guide</a></td>
</tr>
<tr style="background: #f8f9fa;">
  <td style="padding: 12px;"><strong>🔵 Ethereum & EVM</strong></td>
  <td style="padding: 12px;">Transaction, TypedData, Message</td>
  <td style="padding: 12px;"><a href="../connect-to-hardware/hardware-sdk/api-reference/ethereum-and-evm/">→ ETH Guide</a></td>
</tr>
<tr>
  <td style="padding: 12px;"><strong>🟬 Solana</strong></td>
  <td style="padding: 12px;">Address, Transaction</td>
  <td style="padding: 12px;"><a href="../connect-to-hardware/hardware-sdk/api-reference/solana/">→ SOL Guide</a></td>
</tr>
<tr style="background: #f8f9fa;">
  <td style="padding: 12px;"><strong>🌊 NEAR</strong></td>
  <td style="padding: 12px;">Address, Transaction</td>
  <td style="padding: 12px;"><a href="../connect-to-hardware/hardware-sdk/api-reference/near/">→ NEAR Guide</a></td>
</tr>
<tr>
  <td style="padding: 12px;"><strong>🐸 More Chains</strong></td>
  <td style="padding: 12px;">Cosmos, Cardano, Algorand...</td>
  <td style="padding: 12px;"><a href="../connect-to-hardware/hardware-sdk/api-reference/">→ All APIs</a></td>
</tr>
</table>

## 🔗 Related Integration Methods

**Need web-based integration instead?**
- 🌐 [**Web App Integration**](web-app-integration-developer.md) - Provider APIs, WalletConnect
- 📦 [**Wallet Kits**](../connect-to-software/support-wallet-kit/) - RainbowKit, Web3Modal
- 🔗 [**WalletConnect**](../connect-to-software/using-walletconnect/) - Cross-platform connectivity

## ❓ Need Help?

- 🚀 [**Getting Started Tutorial**](../connect-to-hardware/hardware-sdk/tutorial.md)
- 📖 [**Advanced Configuration**](../connect-to-hardware/hardware-sdk/advanced/)
- 💬 [**Community Discussions**](https://github.com/OneKeyHQ/hardware-js-sdk/discussions)
- 🐛 [**Report Issues**](https://github.com/OneKeyHQ/hardware-js-sdk/issues)
