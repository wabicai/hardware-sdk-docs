---
icon: microchip
layout:
  width: default
  title:
    visible: true
  description:
    visible: false
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
  metadata:
    visible: true
---

# OneKey Hardware SDK

{% hint style="info" %}
**OneKey SDK** is a JavaScript library for integrating OneKey hardware wallets into web applications, desktop apps, and mobile applications. Build secure, user-friendly crypto experiences with hardware-level security.
{% endhint %}

## Why OneKey SDK?

- 🔒 **Hardware Security** - Private keys never leave the device
- 🌐 **Universal Support** - Works in browsers, Node.js, and mobile apps
- ⚡ **Easy Integration** - Get started in minutes with simple APIs
- 🔗 **Multi-Chain** - Support for Bitcoin, Ethereum, and 50+ blockchains
- 📱 **Cross-Platform** - One SDK for all your development needs

## Quick Start

Get up and running with OneKey SDK in under 5 minutes:

{% tabs %}
{% tab title="Web Browser" %}
```bash
npm install @onekey/hardware-web-sdk
```

```javascript
import OneKeySDK from '@onekey/hardware-web-sdk';

const sdk = new OneKeySDK({
  manifest: {
    email: 'developer@yourapp.com',
    appName: 'Your App',
    appUrl: 'https://yourapp.com'
  }
});

// Get Bitcoin address
const result = await sdk.btcGetAddress({
  path: "m/44'/0'/0'/0/0",
  showOnDevice: true
});

console.log('Address:', result.payload.address);
```

[Web Integration Guide →](platforms/web.md)
{% endtab %}

{% tab title="Node.js" %}
```bash
npm install @onekey/hardware-js-sdk
```

```javascript
const OneKeySDK = require('@onekey/hardware-js-sdk');

const sdk = new OneKeySDK({
  manifest: {
    email: 'developer@yourapp.com',
    appName: 'Your App',
    appUrl: 'https://yourapp.com'
  }
});

// Connect device
const devices = await sdk.searchDevices();
await sdk.connectDevice(devices[0].path);

// Get Bitcoin address
const result = await sdk.btcGetAddress({
  path: "m/44'/0'/0'/0/0",
  showOnDevice: true
});

console.log('Address:', result.payload.address);
```

[Node.js Integration Guide →](platforms/nodejs.md)
{% endtab %}

{% tab title="React Native" %}
```bash
npm install @onekey/hardware-react-native-sdk
```

```javascript
import OneKeySDK from '@onekey/hardware-react-native-sdk';
import { Linking } from 'react-native';

const sdk = new OneKeySDK({
  manifest: {
    email: 'developer@yourapp.com',
    appName: 'Your App',
    appUrl: 'https://yourapp.com'
  },
  deeplinkOpen: (url) => Linking.openURL(url),
  deeplinkCallbackUrl: 'yourapp://onekey-callback'
});

// Get Bitcoin address
const result = await sdk.btcGetAddress({
  path: "m/44'/0'/0'/0/0",
  showOnDevice: true
});

console.log('Address:', result.payload.address);
```

[React Native Integration Guide →](platforms/react-native.md)
{% endtab %}
{% endtabs %}

## How It Works

OneKey SDK provides a unified interface to interact with OneKey hardware wallets across different platforms:

![OneKey SDK Architecture](assets/diagrams/simple-architecture.png)

### Connection Methods

| Platform | Connection | Description |
|----------|------------|-------------|
| **Web Browser** | WebUSB / Bridge / Deep Link | Automatic fallback for maximum compatibility |
| **Node.js** | USB / Bluetooth / Bridge | Direct device communication |
| **React Native** | Bluetooth / Deep Link | Mobile-optimized connections |
| **Electron** | USB / WebUSB | Desktop app integration |

### Supported Features

- ✅ **Address Generation** - Get addresses for 50+ cryptocurrencies
- ✅ **Transaction Signing** - Sign transactions with hardware security
- ✅ **Message Signing** - Sign arbitrary messages and typed data
- ✅ **Device Management** - Update firmware, change settings
- ✅ **Multi-Account** - Support for multiple accounts and derivation paths

## Next Steps

<table data-view="cards"><thead><tr><th></th><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><strong>📚 Learn Core Concepts</strong></td><td>Understand transport layers, paths, and events</td><td></td><td><a href="concepts/overview.md">overview.md</a></td></tr><tr><td><strong>🔧 API Reference</strong></td><td>Complete method documentation</td><td></td><td><a href="api/init.md">init.md</a></td></tr><tr><td><strong>📖 Integration Guides</strong></td><td>Platform-specific implementation guides</td><td></td><td><a href="platforms/web.md">web.md</a></td></tr><tr><td><strong>💡 Best Practices</strong></td><td>Security and performance recommendations</td><td></td><td><a href="guides/best-practices.md">best-practices.md</a></td></tr></tbody></table>

## Support

- 📖 [Documentation](getting-started/quick-start.md)
- 💬 [GitHub Issues](https://github.com/OneKeyHQ/hardware-js-sdk/issues)
- 🗨️ [Discord Community](https://discord.gg/onekey)
- 📧 [Developer Support](mailto:developer@onekey.so)
