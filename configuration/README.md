# Configuration

Essential setup and configuration information for OneKey Hardware SDK integration.

## Setup Guide

Get your development environment ready:

* **[Installation & Setup](installation.md)** - SDK installation and initialization
* **[Common Parameters](common-params.md)** - Required parameters for all SDK methods

## Reference

Configuration references and troubleshooting:

* **[Derivation Paths](paths.md)** - BIP32/BIP44 path specifications
* **[Error Codes](error-codes.md)** - Complete error handling reference

## Quick Configuration Example

```typescript
import HardwareSDK from '@onekeyfe/hd-core';

// Initialize SDK
await HardwareSDK.init({
    debug: false,
    fetchConfig: true,
    transportReconnect: true
});

// Find devices and get connection parameters
const devices = await HardwareSDK.searchDevices();
const { connectId, deviceId } = devices.payload[0];

// Use common parameters in API calls
const result = await HardwareSDK.btcGetAddress(connectId, deviceId, {
    path: "m/44'/0'/0'/0/0",
    coin: 'btc',
    showOnOneKey: false
});
```

## Next Steps

Once configured, explore the API documentation:

* **[Blockchain APIs](../coin-api/README.md)** - Bitcoin, Ethereum, and 25+ blockchain integrations
* **[Device Management](../device-api/README.md)** - Hardware wallet discovery and control
* **[Advanced Topics](../advanced/README.md)** - PIN, passphrase, and protocol details