# Configuration

Essential setup and configuration information for OneKey Hardware SDK integration.

## Getting Started with Web SDK

The recommended path for most developers:

* **[Installation & Setup](installation.md)** - Web SDK installation with WebUSB
* **[Common Parameters](common-params.md)** - Required parameters for all SDK methods

## Reference Documentation

Configuration references and troubleshooting:

* **[Derivation Paths](paths.md)** - BIP32/BIP44 path specifications
* **[Error Codes](error-codes.md)** - Complete error handling reference

## Quick Start Example

```typescript
import HardwareSDK from '@onekeyfe/hd-web-sdk';

// Initialize Web SDK with WebUSB
await HardwareSDK.init({
    connectSrc: 'https://connect.onekey.so/',
    debug: false
});

// Find connected devices
const devices = await HardwareSDK.searchDevices();
if (devices.success && devices.payload.length > 0) {
    console.log('Found OneKey device:', devices.payload[0]);
}

// Get Bitcoin address (no connectId/deviceId needed for Web SDK)
const result = await HardwareSDK.btcGetAddress({
    path: "m/44'/0'/0'/0/0",
    coin: 'btc',
    showOnOneKey: true
});

if (result.success) {
    console.log('Bitcoin address:', result.payload.address);
}
```

## Why Web SDK?

The Web SDK is recommended because:

- ✅ **Simplified API** - No need to manage connectId/deviceId parameters
- ✅ **Direct Communication** - WebUSB eliminates the need for OneKey Bridge
- ✅ **Better UX** - Users don't need to install additional software
- ✅ **Cross-Platform** - Works on Windows, macOS, and Linux
- ✅ **Secure** - Direct encrypted communication with hardware devices

## Next Steps

Once configured, explore the API documentation:

* **[Blockchain APIs](../coin-api/README.md)** - Bitcoin, Ethereum, and 25+ blockchain integrations
* **[Device Management](../device-api/README.md)** - Hardware wallet discovery and control
* **[Advanced Topics](../advanced/README.md)** - PIN, passphrase, and protocol details