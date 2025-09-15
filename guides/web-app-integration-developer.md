---
description: Integrate web DApps with OneKey wallet using provider APIs, wallet aggregators, or WalletConnect
---

# 🌐 Web App Integration Guide

> **TL;DR**: Install OneKey → Detect `window.$onekey` → Request accounts → Start building

This guide helps you quickly integrate a web DApp with OneKey using various methods.

## ⚡ Quick Start (5 minutes)

### Step 1: Install OneKey
<div style="padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; margin: 16px 0;">
  <a href="https://onekey.so/download?client=browserExtension" style="color: white; text-decoration: none; font-weight: bold; font-size: 18px;">🚀 Download OneKey Extension</a>
  <div style="color: rgba(255,255,255,0.8); margin-top: 8px;">Browser extension • Desktop app • Mobile app</div>
</div>

### Step 2-5: Integration Steps
| Step | Action | Verify |
|------|--------|--------|
| 2️⃣ | **Detect provider** (EIP-1193) | Check `window.$onekey` exists |
| 3️⃣ | **Request accounts** | User approves connection |
| 4️⃣ | **Call chain APIs** (ETH, Solana, NEAR, etc.) | Transaction signing works |
| 5️⃣ | **Handle events** | Account/network changes |

### 🔍 Quick Test
Once OneKey is installed, open your browser DevTools and check:
```javascript
// This should exist if OneKey is installed
console.log(window.$onekey);
```

## 🎯 Choose Your Integration Path

<table style="width: 100%; border-collapse: collapse;">
<tr>
<td style="border: 2px solid #4CAF50; padding: 20px; border-radius: 8px; margin: 10px; background: linear-gradient(135deg, #a8e6cf 0%, #dcedc1 100%);">
  <h3>🅰️ OneKey Provider (Recommended)</h3>
  <p><strong>Best for:</strong> Direct integration, maximum control</p>
  <p><strong>Supports:</strong> 20+ blockchains</p>
  <div style="margin-top: 16px;">
    <a href="../connect-to-software/webapp-connect-onekey/" style="background: #4CAF50; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-weight: bold;">🚀 Get Started</a>
  </div>
</td>
<td style="border: 2px solid #2196F3; padding: 20px; border-radius: 8px; margin: 10px; background: linear-gradient(135deg, #a3d5ff 0%, #c8e6ff 100%);">
  <h3>📦 Wallet Aggregators</h3>
  <p><strong>Best for:</strong> Multi-wallet support</p>
  <p><strong>Supports:</strong> Web3 Onboard, RainbowKit, Web3Modal</p>
  <div style="margin-top: 16px;">
    <a href="../connect-to-software/support-wallet-kit/" style="background: #2196F3; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-weight: bold;">🌈 Explore Kits</a>
  </div>
</td>
</tr>
<tr>
<td colspan="2" style="border: 2px solid #FF9800; padding: 20px; border-radius: 8px; margin: 10px; background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);">
  <h3>🔗 WalletConnect</h3>
  <p><strong>Best for:</strong> Mobile app connection via QR codes</p>
  <p><strong>Supports:</strong> Cross-platform connectivity</p>
  <div style="margin-top: 16px;">
    <a href="../connect-to-software/using-walletconnect/" style="background: #FF9800; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-weight: bold;">📱 Connect Mobile</a>
  </div>
</td>
</tr>
</table>

## 📝 Minimal Example (Ethereum)

### 🔄 Copy-Paste Integration

```javascript
// 🔍 1) Detect OneKey Provider
const provider = window?.$onekey?.ethereum;
if (!provider) {
  alert('😅 Please install OneKey to continue');
  // Redirect to download page
  window.open('https://onekey.so/download?client=browserExtension', '_blank');
  throw new Error('OneKey provider not found');
}

// 🔑 2) Request Account Access
try {
  await provider.request({ method: 'eth_requestAccounts' });
  console.log('✅ Account access granted');
} catch (error) {
  console.error('❌ User rejected connection:', error);
}

// 📊 3) Get Connected Account
const [account] = await provider.request({ method: 'eth_accounts' });
console.log('🚀 Connected account:', account);

// 🔊 4) Listen to Changes
provider.on('accountsChanged', (accounts) => {
  console.log('🔄 Account changed:', accounts[0]);
  // Update your UI here
});

provider.on('chainChanged', (chainId) => {
  console.log('🌐 Network changed:', chainId);
  // Handle network change
});

// 📡 5) Read Chain Info
const chainId = await provider.request({ method: 'eth_chainId' });
console.log('🌐 Current chain:', chainId);

// 💰 6) Get Balance (Bonus)
const balance = await provider.request({
  method: 'eth_getBalance',
  params: [account, 'latest']
});
console.log('💰 Balance:', parseInt(balance, 16) / 1e18, 'ETH');
```

### 🎨 Interactive Demo

<div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
  <p><strong>🚀 Want to try it live?</strong></p>
  <p>Open your browser console and paste the code above after installing OneKey!</p>
</div>


## 📦 Supported Clients

<table style="width: 100%;">
<tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
  <th style="padding: 12px;">Platform</th>
  <th style="padding: 12px;">Client</th>
  <th style="padding: 12px;">Integration Method</th>
  <th style="padding: 12px;">Download</th>
</tr>
<tr>
  <td style="padding: 12px;">🌐 Browser</td>
  <td style="padding: 12px;">Chrome Extension</td>
  <td style="padding: 12px;">Direct Provider API</td>
  <td style="padding: 12px;"><a href="https://chrome.google.com/webstore/category/extensions" style="color: #4285f4;">→ Chrome Store</a></td>
</tr>
<tr style="background: #f8f9fa;">
  <td style="padding: 12px;">🌐 Browser</td>
  <td style="padding: 12px;">Edge Extension</td>
  <td style="padding: 12px;">Direct Provider API</td>
  <td style="padding: 12px;"><a href="https://microsoftedge.microsoft.com/addons/category/Extension" style="color: #0078d4;">→ Edge Store</a></td>
</tr>
<tr>
  <td style="padding: 12px;">🖥️ Desktop</td>
  <td style="padding: 12px;">OneKey App (Win/Mac/Linux)</td>
  <td style="padding: 12px;">Built-in Browser</td>
  <td style="padding: 12px;"><a href="https://onekey.so/download" style="color: #00d4aa;">→ Download App</a></td>
</tr>
<tr style="background: #f8f9fa;">
  <td style="padding: 12px;">📱 Mobile</td>
  <td style="padding: 12px;">OneKey App (iOS/Android)</td>
  <td style="padding: 12px;">Built-in Browser + WalletConnect</td>
  <td style="padding: 12px;"><a href="https://onekey.so/download" style="color: #00d4aa;">→ Download App</a></td>
</tr>
</table>

## ❓ Troubleshooting & Next Steps

### 🔧 Common Issues

<details>
<summary><strong>❌ Provider not detected</strong></summary>

**Solutions:**
- ✅ Ensure OneKey extension is installed and enabled
- ✅ Check if OneKey app is unlocked
- ✅ Refresh the page after installation
- ✅ Check browser console for errors

**Debug Code:**
```javascript
// Check all available providers
console.log('Available providers:', {
  onekey: !!window.$onekey,
  ethereum: !!window.ethereum,
  metamask: !!window.ethereum?.isMetaMask
});
```
</details>

<details>
<summary><strong>❌ Connection rejected</strong></summary>

**Solutions:**
- ✅ Handle user rejection gracefully
- ✅ Provide clear instructions
- ✅ Show "Try Again" button

**Example:**
```javascript
try {
  await provider.request({ method: 'eth_requestAccounts' });
} catch (error) {
  if (error.code === 4001) {
    // User rejected
    showUserFriendlyMessage('Please approve the connection');
  }
}
```
</details>

### 📦 Chain-Specific Guides

| Blockchain | Provider API | Examples | Advanced |
|------------|-------------|----------|----------|
| **Ethereum & EVM** | [ETH Provider](../connect-to-software/webapp-connect-onekey/eth/) | Transactions, Signing | [EIP Standards](../connect-to-software/webapp-connect-onekey/eth/signing-data.md) |
| **Bitcoin** | [BTC Provider](../connect-to-software/webapp-connect-onekey/btc/) | PSBT, Inscriptions | [Ordinals Support](../connect-to-software/webapp-connect-onekey/btc/api-reference/getinscriptions.md) |
| **Solana** | [SOL Provider](../connect-to-software/webapp-connect-onekey/solana/) | Transactions, Messages | [Solana Web3.js](../connect-to-software/webapp-connect-onekey/solana/sending-a-transaction.md) |
| **NEAR** | [NEAR Provider](../connect-to-software/webapp-connect-onekey/near/) | Function Calls | [NEAR SDK](../connect-to-software/webapp-connect-onekey/near/integrating/) |

### 🔗 Advanced Integration

**Need more features?**
- 🌈 [**Wallet Aggregators**](../connect-to-software/support-wallet-kit/) - Multi-wallet support
- 📱 [**WalletConnect**](../connect-to-software/using-walletconnect/) - Mobile connectivity
- 🔧 [**Hardware SDK**](../connect-to-hardware/hardware-sdk/) - Direct hardware control

**Community & Support:**
- 📖 [**Full Documentation**](../README.md)
- 💬 [**GitHub Discussions**](https://github.com/OneKeyHQ/hardware-js-sdk/discussions)
- 🐛 [**Report Issues**](https://github.com/OneKeyHQ/hardware-js-sdk/issues)

