# Connect to Hardware

## Overview

OneKey Hardware SDK provides comprehensive support for integrating with OneKey hardware wallets. The **Web SDK** is the recommended solution for most applications, offering direct WebUSB communication with hardware devices in web browsers.

## Recommended Integration: Web SDK

### Web SDK (Recommended)

The **@onekeyfe/hd-web-sdk** is the primary and recommended way to integrate with OneKey hardware wallets:

- **[Getting Started](configuration/README.md)** - Quick setup and configuration
- **[Installation Guide](configuration/installation.md)** - Web SDK installation and initialization
- **[Blockchain APIs](coin-api/README.md)** - Complete API reference for 30+ blockchains
- **[Device Management](device-api/README.md)** - Device discovery and control

**Key Features:**
- **WebUSB Support** - Direct USB communication in modern browsers
- **No Additional Software** - Works natively via WebUSB in supported browsers
- **TypeScript Support** - Full type definitions included
- **Cross-Platform** - Works on all modern web browsers
- **Secure** - Direct device communication with encryption

### Quick Start with Web SDK

```bash
# Install the Web SDK
npm install @onekeyfe/hd-web-sdk
```

```javascript
import HardwareSDK from '@onekeyfe/hd-web-sdk';

// Initialize with WebUSB
await HardwareSDK.init({
  connectSrc: 'https://connect.onekey.so/',
  debug: false
});

// Get Bitcoin address
const result = await HardwareSDK.btcGetAddress({
  path: "m/44'/0'/0'/0/0",
  coin: 'btc'
});
```

> Note on WebUSB user gesture requirement
>
> Browsers require a user gesture (e.g., a button click) to trigger navigator.usb.requestDevice(). When using searchDevices in hd-web-sdk, ensure the call is initiated within a trusted user interaction handler; otherwise the permission prompt will be blocked.



```typescript
// Minimal connect button example (requires user gesture)
import HardwareSDK from '@onekeyfe/hd-web-sdk';
import { ONEKEY_WEBUSB_FILTER } from '@onekeyfe/hd-shared';

document.getElementById('connect')?.addEventListener('click', async () => {
  try {
    // 1) Ask for WebUSB permission first
    await window?.navigator?.usb?.requestDevice({ filters: ONEKEY_WEBUSB_FILTER });

    // 2) Then query devices via SDK
    const res = await HardwareSDK.searchDevice();
    if (res.success) console.log('devices:', res.payload);
  } catch (e) {
    console.error('Permission/search error:', e);
  }
});
```

## Advanced Integration Options

For specialized use cases, OneKey provides additional SDKs:

### Air Gap Integration

Secure air-gap communication for enhanced security:

- **[Air Gap SDK](air-gap-sdk/README.md)** - QR code-based communication
- **[Wallet Integration](air-gap-sdk/tutorial-wallet-integration.md)** - Step-by-step integration guide

### Advanced SDKs

For mobile and specialized environments:

- **[Advanced Integration Options](advanced/README.md)** - BLE SDK, Common Connect SDK, and custom transports
- **[Mobile Integration](advanced/common-sdk-guide.md)** - React Native and mobile app integration
- **[Transport Plugins](advanced/low-level-transport-plugin.md)** - Custom transport implementations

## Supported Blockchains

OneKey Hardware SDK supports 25+ blockchains. See the complete list and details in [Blockchain APIs](coin-api/README.md).

## Minimal Example

### Install and Initialize

```bash
npm install @onekeyfe/hd-web-sdk
```

```typescript
import HardwareSDK from '@onekeyfe/hd-web-sdk';
await HardwareSDK.init({ connectSrc: 'https://connect.onekey.so/', debug: false }); // init first
```

### First call

```typescript
const res = await HardwareSDK.btcGetAddress({
  path: "m/44'/0'/0'/0/0",
  coin: 'btc',
  showOnOneKey: true,
});
if (res.success) console.log(res.payload.address);
```

For more examples, see [Quick Start](../../quick-start.md).

## Why Web SDK

- WebUSB in modern browsers (no additional software)
- TypeScript types included
- Cross-browser (Chromium-based)
- Secure device communication

## Next steps

- Installation & Setup: [configuration/installation.md](configuration/installation.md)
- Device discovery: [device-api/search-devices.md](device-api/search-devices.md)
- First API call: [coin-api/btc/btcgetaddress.md](coin-api/btc/btcgetaddress.md)
- Full API reference: [coin-api/README.md](coin-api/README.md)
- Advanced options: [advanced/README.md](advanced/README.md)



## Development Resources

### Documentation
- **[Configuration Guide](configuration/README.md)** - Setup and configuration
- **[API Reference](coin-api/README.md)** - Complete API documentation
- **[Error Codes](configuration/error-codes.md)** - Error handling reference

### Examples
- **[GitHub Examples](https://github.com/OneKeyHQ/hardware-js-sdk/tree/main/packages/connect-examples)** - Complete example applications
- **[Live Demo](https://connect.onekey.so/)** - Interactive API testing

### Community
- **[GitHub Issues](https://github.com/OneKeyHQ/hardware-js-sdk/issues)** - Report bugs and request features
- **[Discord Community](https://discord.gg/onekey)** - Get help from the community
- **[Developer Portal](https://developer.onekey.so/)** - Official developer resources

## Migration Guides

### From Trezor Connect
OneKey SDK is based on Trezor Connect with additional features:

```javascript
// Trezor Connect code works with minimal changes
import HardwareSDK from '@onekeyfe/hd-web-sdk';

// Same API, enhanced features
const result = await HardwareSDK.btcGetAddress({
  path: "m/44'/0'/0'/0/0",
  coin: 'btc'
});
```

### From Other Hardware SDKs
OneKey provides compatibility layers and migration guides for popular hardware wallet SDKs.

## Troubleshooting

### Common Issues

1. **Device not detected** - Check USB connection and WebUSB permissions
2. **WebUSB not supported** - Use a compatible browser (Chrome, Edge, Opera)
3. **Permission denied** - Grant necessary browser permissions for device access
4. **Firmware outdated** - Update device firmware through OneKey app

### Getting Help

1. **Check Documentation** - Review relevant integration guides
2. **Try Examples** - Test with provided examples
3. **Search Issues** - Look for similar problems on GitHub
4. **Ask Community** - Get help on Discord
5. **Report Bugs** - Create GitHub issues for bugs

## Next Steps

1. **Choose Integration Method** - Select the approach that fits your needs
2. **Follow Setup Guide** - Complete installation and configuration
3. **Test with Examples** - Verify your integration works
4. **Deploy and Monitor** - Launch your application and monitor usage

Ready to get started? Choose your integration method above and follow the detailed guides!
