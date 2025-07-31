---
icon: question-circle
---

# Frequently Asked Questions

Common questions and answers about OneKey Hardware SDK.

## General Questions

### What is OneKey Hardware SDK?

OneKey Hardware SDK is a JavaScript library that enables developers to integrate OneKey hardware wallets into their applications. It provides secure communication with OneKey devices for cryptocurrency operations like address generation, transaction signing, and message signing.

### Which platforms are supported?

OneKey SDK supports:
- **Web browsers** (Chrome, Edge, Opera with WebUSB)
- **Node.js** applications (desktop and server)
- **Electron** desktop applications
- **React Native** mobile applications

### What cryptocurrencies are supported?

OneKey SDK supports 50+ cryptocurrencies including:
- Bitcoin and Bitcoin forks (BTC, LTC, BCH, DOGE, etc.)
- Ethereum and EVM chains (ETH, MATIC, BNB, AVAX, etc.)
- Solana (SOL) and SPL tokens
- Cardano (ADA) and native tokens
- Polkadot (DOT) and Kusama (KSM)
- Cosmos ecosystem (ATOM, OSMO, JUNO, etc.)

See [Supported Coins](supported-coins.md) for the complete list.

## Installation and Setup

### How do I install OneKey SDK?

Choose the appropriate package for your platform:

```bash
# Web applications
npm install @onekeyfe/hd-web-sdk

# Node.js/Electron applications
npm install @onekeyfe/hd-common-connect-sdk

# React Native applications
npm install @onekeyfe/hd-ble-sdk
```

### Do I need to install drivers?

No drivers are required. OneKey SDK uses:
- **WebUSB** for web browsers
- **Native USB/HID** for Node.js/Electron
- **Bluetooth** for React Native

### How do I initialize the SDK?

```javascript
import { HardwareSDK } from '@onekeyfe/hd-web-sdk';

await HardwareSDK.init({
  debug: false,
  connectSrc: 'https://jssdk.onekey.so/',
  manifest: {
    email: 'developer@yourapp.com',
    appName: 'Your App Name',
    appUrl: 'https://yourapp.com'
  }
});
```

## Device Connection

### How do I connect to a OneKey device?

```javascript
// Search for devices
const devices = await HardwareSDK.searchDevices();

// Connect to the first device
if (devices.length > 0) {
  await HardwareSDK.connectDevice(devices[0].path);
}
```

### Why can't I find my device?

Common reasons:
1. **Device not connected** - Ensure USB cable is properly connected
2. **Device locked** - Unlock your OneKey device with PIN
3. **Browser permissions** - Allow USB access when prompted
4. **Outdated firmware** - Update your device firmware
5. **Another app using device** - Close other wallet applications

### How do I handle device disconnection?

```javascript
// Listen for disconnect events
HardwareSDK.on('device-disconnect', (device) => {
  console.log('Device disconnected:', device.path);
  // Handle gracefully - show reconnection UI
});

// Check connection status
const isConnected = await HardwareSDK.getDeviceStatus();
if (!isConnected.connected) {
  // Device is not connected
}
```

## Development

### How do I handle errors?

```javascript
try {
  const result = await HardwareSDK.btcGetAddress({
    path: "m/44'/0'/0'/0/0",
    coin: 'btc'
  });

  if (result.success) {
    console.log('Address:', result.payload.address);
  } else {
    console.error('Error:', result.payload.error);
  }
} catch (error) {
  console.error('SDK Error:', error.message);
}
```

### What are the common error codes?

| Error Code | Description | Solution |
|------------|-------------|----------|
| `Device_NotFound` | Device not connected | Connect device and try again |
| `User_Cancelled` | User cancelled on device | User needs to confirm on device |
| `Invalid_Path` | Invalid derivation path | Check BIP-44 path format |
| `Firmware_NotCompatible` | Outdated firmware | Update device firmware |
| `Permission_Denied` | Browser permission denied | Allow USB access |

### How do I test my integration?

1. **Use testnet networks** for testing
2. **Start with small amounts** on mainnet
3. **Test device disconnection scenarios**
4. **Verify addresses on device screen**
5. **Test with different device models**

```javascript
// Example testnet configuration
const testnetConfig = {
  bitcoin: {
    network: 'testnet',
    path: "m/44'/1'/0'/0/0"
  },
  ethereum: {
    chainId: 5, // Goerli testnet
    rpcUrl: 'https://goerli.infura.io/v3/YOUR_KEY'
  }
};
```

## Security

### Is OneKey SDK secure?

Yes, OneKey SDK is designed with security in mind:
- **Private keys never leave the device**
- **All transactions require device confirmation**
- **Open source and auditable**
- **Uses secure communication protocols**

### How do I verify addresses?

Always show addresses on the device screen for verification:

```javascript
// GOOD: Show address on device
const result = await HardwareSDK.btcGetAddress({
  path: "m/44'/0'/0'/0/0",
  showOnDevice: true, // User can verify on device
  coin: 'btc'
});

// AVOID: Don't show for receiving addresses
const result = await HardwareSDK.btcGetAddress({
  path: "m/44'/0'/0'/0/0",
  showOnDevice: false, // User cannot verify
  coin: 'btc'
});
```

### What about man-in-the-middle attacks?

OneKey devices protect against MITM attacks by:
- **Displaying transaction details on device screen**
- **Requiring physical confirmation**
- **Using secure communication protocols**
- **Verifying firmware signatures**

## Troubleshooting

### My transaction is not being signed

Check these common issues:
1. **Device is locked** - Unlock with PIN
2. **User cancelled** - Confirm on device
3. **Invalid transaction data** - Verify transaction format
4. **Insufficient funds** - Check account balance
5. **Network issues** - Check internet connection

### WebUSB is not working

WebUSB requirements:
- **HTTPS required** (except localhost)
- **Supported browsers**: Chrome, Edge, Opera
- **User gesture required** - Must be triggered by user action
- **Permissions granted** - Allow USB access when prompted

```javascript
// Check WebUSB support
if (!navigator.usb) {
  console.error('WebUSB not supported in this browser');
}

// Request permissions
try {
  await navigator.usb.requestDevice({
    filters: [{ vendorId: 0x1209 }] // OneKey vendor ID
  });
} catch (error) {
  console.error('USB permission denied');
}
```

### React Native Bluetooth issues

Common Bluetooth issues:
1. **Permissions not granted** - Request Bluetooth permissions
2. **Bluetooth disabled** - Enable Bluetooth on device
3. **Pairing required** - Pair OneKey device first
4. **Range issues** - Keep devices close together

```javascript
// Check Bluetooth permissions (React Native)
import { PermissionsAndroid } from 'react-native';

const requestBluetoothPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
};
```

## Performance

### How can I optimize performance?

1. **Cache device features**
2. **Batch operations when possible**
3. **Use appropriate timeouts**
4. **Handle errors gracefully**
5. **Minimize device interactions**

```javascript
// Cache device features
let deviceFeatures = null;

const getFeatures = async () => {
  if (!deviceFeatures) {
    deviceFeatures = await HardwareSDK.getFeatures();
  }
  return deviceFeatures;
};

// Batch address generation
const generateMultipleAddresses = async (paths) => {
  const addresses = [];

  for (const path of paths) {
    const result = await HardwareSDK.btcGetAddress({
      path,
      coin: 'btc',
      showOnDevice: false // Don't show each address
    });

    if (result.success) {
      addresses.push(result.payload.address);
    }
  }

  return addresses;
};
```

### What are the rate limits?

OneKey devices have built-in rate limiting:
- **Address generation**: ~10 per second
- **Transaction signing**: ~1 per second
- **Device queries**: ~20 per second

Respect these limits to avoid timeouts.

## Migration

### How do I migrate from older versions?

See our [Migration Guide](migration.md) for detailed instructions.

Key changes in recent versions:
- **Method names**: `ethereumGetAddress` → `evmGetAddress`
- **Package names**: Updated to `@onekeyfe/hd-*-sdk`
- **Error handling**: Errors now in `result.payload.error`
- **Initialization**: New `connectSrc` URL

### Are there breaking changes?

Yes, major version updates may include breaking changes. Always:
1. **Read the changelog** before upgrading
2. **Test in development** environment first
3. **Update method names** as needed
4. **Check error handling** patterns

## Support

### Where can I get help?

- **Documentation**: [OneKey SDK Docs](../README.md)
- **GitHub Issues**: [Report bugs](https://github.com/OneKeyHQ/hardware-js-sdk/issues)
- **Discord**: [OneKey Community](https://discord.gg/onekey)
- **Email**: developer@onekey.so

### How do I report a bug?

When reporting bugs, include:
1. **SDK version** and platform
2. **Device model** and firmware version
3. **Steps to reproduce** the issue
4. **Error messages** and logs
5. **Expected vs actual** behavior

### Can I contribute to the SDK?

Yes! OneKey SDK is open source. See our [Contributing Guide](https://github.com/OneKeyHQ/hardware-js-sdk/blob/main/CONTRIBUTING.md) for details.

## Next Steps

- [Installation Guide](../quick-start/installation.md) - Get started with OneKey SDK
- [API Reference](../api/device.md) - Complete API documentation
- [Troubleshooting](troubleshooting.md) - Detailed troubleshooting guide
- [Migration Guide](migration.md) - Upgrade from older versions