---
icon: question
---

# Frequently Asked Questions

Common questions and answers about OneKey SDK.

## General Questions

### What is OneKey SDK?

OneKey SDK is a JavaScript library that allows developers to integrate OneKey hardware wallets into their applications. It provides a unified interface for interacting with OneKey devices across different platforms (Web, Node.js, React Native).

### Which OneKey devices are supported?

OneKey SDK supports all OneKey hardware wallet models:
- **OneKey Classic** - Basic model with OLED screen
- **OneKey Touch** - Touch-enabled model with color display
- **OneKey Pro** - Advanced model with NFC and enhanced features

### What blockchains are supported?

OneKey SDK supports 50+ blockchains including:
- **Bitcoin** and forks (BCH, LTC, DOGE, etc.)
- **Ethereum** and EVM chains (BSC, Polygon, Avalanche, etc.)
- **Solana** and SPL tokens
- **Cardano**, **Polkadot**, **Cosmos**, and many more

See [Supported Cryptocurrencies](supported-coins.md) for the complete list.

## Installation & Setup

### Which package should I install?

Choose based on your platform:
- **Web apps**: `@onekey/hardware-web-sdk`
- **Node.js apps**: `@onekey/hardware-js-sdk`
- **React Native apps**: `@onekey/hardware-react-native-sdk`

### Do I need to install OneKey Bridge?

OneKey Bridge is required for:
- **Firefox and Safari** browsers (no WebUSB support)
- **HTTP websites** (WebUSB requires HTTPS)
- **Older browsers** without WebUSB support

Chrome and Edge with HTTPS can use WebUSB directly without Bridge.

### How do I configure permissions for React Native?

**iOS** - Add to `Info.plist`:
```xml
<key>NSBluetoothAlwaysUsageDescription</key>
<string>Connect to OneKey devices via Bluetooth</string>
```

**Android** - Add to `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

## Development Questions

### How do I handle errors properly?

Always check the `success` field and handle common error codes:

```javascript
try {
  const result = await sdk.btcGetAddress({
    path: "m/44'/0'/0'/0/0",
    showOnDevice: true
  });
  
  if (result.success) {
    console.log('Address:', result.payload.address);
  } else {
    console.error('Error:', result.payload.error);
  }
} catch (error) {
  switch (error.code) {
    case 'User_Cancelled':
      // User cancelled on device
      break;
    case 'Device_NotFound':
      // Device not connected
      break;
    default:
      console.error('Unexpected error:', error);
  }
}
```

### Should I show addresses on the device?

**Yes, for security**. Always use `showOnDevice: true` for:
- First-time address generation
- Address verification
- Important transactions

Only use `showOnDevice: false` for:
- Batch address generation
- Background operations
- Cached address retrieval

### How do I optimize performance?

1. **Cache addresses** to avoid repeated device calls
2. **Batch operations** when possible
3. **Reuse SDK instances** instead of creating new ones
4. **Handle connection state** properly

```javascript
// Good: Batch address generation
const result = await sdk.btcGetAddress({
  bundle: [
    { path: "m/44'/0'/0'/0/0", showOnDevice: false },
    { path: "m/44'/0'/0'/0/1", showOnDevice: false },
    { path: "m/44'/0'/0'/0/2", showOnDevice: false }
  ]
});

// Avoid: Multiple individual calls
for (let i = 0; i < 3; i++) {
  await sdk.btcGetAddress({ path: `m/44'/0'/0'/0/${i}` });
}
```

## Platform-Specific Questions

### Why doesn't WebUSB work in my browser?

WebUSB requires:
- **HTTPS** (except localhost)
- **Supported browser** (Chrome 61+, Edge 79+)
- **User gesture** (must be called from click handler)
- **Device permissions** granted by user

If WebUSB doesn't work, install OneKey Bridge as fallback.

### How do I use OneKey SDK in Electron?

Use the Node.js SDK in the main process and communicate with renderer via IPC:

```javascript
// Main process
const OneKeySDK = require('@onekey/hardware-js-sdk');
const { ipcMain } = require('electron');

const sdk = new OneKeySDK({...});

ipcMain.handle('onekey:getAddress', async (event, params) => {
  return await sdk.btcGetAddress(params);
});

// Renderer process
const result = await ipcRenderer.invoke('onekey:getAddress', {
  path: "m/44'/0'/0'/0/0"
});
```

### Can I use OneKey SDK in a browser extension?

Yes! Use the Web SDK with proper manifest permissions:

**Manifest V3**:
```json
{
  "permissions": ["storage"],
  "host_permissions": ["https://connect.onekey.so/*"]
}
```

### How do I handle deep links in React Native?

Configure deep link handling for OneKey App communication:

```javascript
import { Linking } from 'react-native';

const sdk = new OneKeySDK({
  deeplinkOpen: (url) => Linking.openURL(url),
  deeplinkCallbackUrl: 'yourapp://onekey-callback'
});

// Handle incoming deep links
Linking.addEventListener('url', handleDeepLink);
```

## Security Questions

### Is it safe to use OneKey SDK?

Yes, OneKey SDK is designed with security in mind:
- **No private keys** are exposed to your application
- **All signing** happens on the device
- **User confirmation** required for sensitive operations
- **Open source** and audited code

### What information does my app receive?

Your app only receives:
- **Public keys** and **addresses**
- **Signed transactions** (not private keys)
- **Device information** (model, firmware version)
- **User confirmations** (approved/cancelled)

Private keys never leave the OneKey device.

### How do I verify transaction details?

Always display transaction details to users before signing:

```javascript
function showTransactionDetails(tx) {
  return {
    to: tx.to,
    amount: formatAmount(tx.value),
    fee: calculateFee(tx),
    total: calculateTotal(tx)
  };
}

// Show confirmation dialog
const details = showTransactionDetails(transaction);
const confirmed = await showConfirmDialog(details);

if (confirmed) {
  const result = await sdk.ethereumSignTransaction({
    path: "m/44'/60'/0'/0/0",
    transaction
  });
}
```

## Troubleshooting

### Device not found or connection issues?

1. **Check device connection** - USB cable, device unlocked
2. **Install drivers** - OneKey Bridge for compatibility
3. **Check permissions** - Browser permissions, udev rules (Linux)
4. **Try different browser** - Chrome/Edge recommended
5. **Restart device** - Disconnect and reconnect

### "User cancelled" errors?

This is normal when users:
- Press cancel on the device
- Don't respond within timeout
- Reject the operation

Don't show error messages for user cancellations.

### Slow performance?

1. **Update firmware** to latest version
2. **Use batch operations** for multiple addresses
3. **Cache results** to avoid repeated calls
4. **Check device model** - newer models are faster

### TypeScript errors?

Install type definitions:
```bash
npm install --save-dev @types/node
```

Or add type declarations:
```typescript
declare module '@onekey/hardware-web-sdk';
```

## Integration Questions

### Can I integrate with existing wallets?

Yes! OneKey SDK can be integrated with:
- **MetaMask-compatible** applications
- **WalletConnect** protocols
- **Custom wallet** implementations
- **DeFi protocols** and **dApps**

### How do I migrate from other hardware wallets?

OneKey uses standard derivation paths compatible with:
- **Ledger** wallets
- **Trezor** wallets
- **Other BIP44** compatible wallets

Users can import existing seeds into OneKey devices.

### Can I build a mobile wallet?

Yes! Use the React Native SDK to build:
- **iOS and Android** wallet apps
- **Cross-platform** solutions
- **Bluetooth connectivity** for wireless use
- **Deep link integration** with OneKey App

## Support & Resources

### Where can I get help?

- 📖 **Documentation**: This guide and API reference
- 🚀 **Playground**: [Interactive examples](https://hardware-example.onekeytest.com/expo-playground/)
- 💬 **GitHub Issues**: [Report bugs and ask questions](https://github.com/OneKeyHQ/hardware-js-sdk/issues)
- 🔧 **Troubleshooting**: [Common issues and solutions](../guides/troubleshooting.md)
- 📧 **Email Support**: [support@onekey.so](mailto:support@onekey.so)

### How do I report bugs?

1. **Search existing issues** on GitHub
2. **Provide reproduction steps** and error logs
3. **Include environment details** (browser, OS, device model)
4. **Share minimal code example** that reproduces the issue

### How do I request new features?

1. **Check roadmap** for planned features
2. **Create feature request** on GitHub with use case
3. **Join community discussions** on Discord
4. **Contribute code** via pull requests

### Is there a community?

Yes! Join our community:
- **Discord**: [OneKey Community](https://discord.gg/onekey)
- **GitHub**: [OneKey Organization](https://github.com/OneKeyHQ)
- **Twitter**: [@OneKeyHQ](https://twitter.com/OneKeyHQ)
- **Telegram**: [OneKey Official](https://t.me/OneKeyHQ)

## Next Steps

- 🚀 **Try the Playground**: [Interactive Examples](https://hardware-example.onekeytest.com/expo-playground/)
- 📖 **Read the Guides**: [Best Practices](../guides/best-practices.md)
- 🔧 **Check Troubleshooting**: [Common Issues](../guides/troubleshooting.md)
- 💻 **View Examples**: [Integration Examples](../examples/integrations.md)
