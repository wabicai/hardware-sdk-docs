---
icon: download
---

# Installation & Setup

Get started with OneKey Hardware SDK in minutes. Choose the right SDK package for your platform and follow the setup guide.

## Choose Your SDK Package

OneKey provides different SDK packages optimized for different environments:

| Package | Environment | Use Case |
|---------|-------------|----------|
| `@onekeyfe/hd-web-sdk` | Web Browser | Web applications, browser extensions |
| `@onekeyfe/hd-common-connect-sdk` | Node.js/Electron | Desktop applications, CLI tools |
| `@onekeyfe/hd-ble-sdk` | React Native | Mobile applications |

## Web Browser Installation

For web applications and browser-based projects:

```bash
npm install @onekeyfe/hd-web-sdk
# or
yarn add @onekeyfe/hd-web-sdk
```

### Basic Setup

```javascript
import { HardwareSDK } from '@onekeyfe/hd-web-sdk';

// Initialize the SDK
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

## Node.js/Electron Installation

For desktop applications and server-side projects:

```bash
npm install @onekeyfe/hd-common-connect-sdk
# or
yarn add @onekeyfe/hd-common-connect-sdk
```

### Basic Setup

```javascript
const { HardwareSDK } = require('@onekeyfe/hd-common-connect-sdk');

// Initialize the SDK
await HardwareSDK.init({
  debug: false,
  manifest: {
    email: 'developer@yourapp.com',
    appName: 'Your Desktop App',
    appUrl: 'https://yourapp.com'
  }
});
```

## React Native Installation

For mobile applications:

```bash
npm install @onekeyfe/hd-ble-sdk
# or
yarn add @onekeyfe/hd-ble-sdk
```

### Additional Setup

React Native requires additional permissions and setup:

#### iOS Setup

Add to `ios/YourApp/Info.plist`:

```xml
<key>NSBluetoothAlwaysUsageDescription</key>
<string>This app needs Bluetooth to communicate with OneKey hardware wallet</string>
<key>NSBluetoothPeripheralUsageDescription</key>
<string>This app needs Bluetooth to communicate with OneKey hardware wallet</string>
```

#### Android Setup

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

### Basic Setup

```javascript
import { HardwareSDK } from '@onekeyfe/hd-ble-sdk';
import { Linking } from 'react-native';

// Initialize the SDK
await HardwareSDK.init({
  debug: false,
  manifest: {
    email: 'developer@yourapp.com',
    appName: 'Your Mobile App',
    appUrl: 'https://yourapp.com'
  },
  deeplinkOpen: (url) => Linking.openURL(url),
  deeplinkCallbackUrl: 'yourapp://onekey-callback'
});
```

## Configuration Options

### Manifest Configuration

The manifest object identifies your application to OneKey devices:

```javascript
const manifest = {
  email: 'developer@yourapp.com',    // Your contact email
  appName: 'Your App Name',          // Display name for your app
  appUrl: 'https://yourapp.com'      // Your app's website
};
```

### Debug Mode

Enable debug mode for development:

```javascript
await HardwareSDK.init({
  debug: true,  // Enable detailed logging
  // ... other options
});
```

### Transport Configuration

For advanced use cases, you can configure transport options:

```javascript
await HardwareSDK.init({
  transportReconnect: true,    // Auto-reconnect on disconnect
  pendingTransportEvent: true, // Handle pending transport events
  // ... other options
});
```

## Verification

Test your installation with a simple device detection:

```javascript
// Check if SDK is properly initialized
const devices = await HardwareSDK.searchDevices();
console.log('Found devices:', devices);
```

## Next Steps

- [First Integration](first-integration.md) - Build your first integration
- [Basic Examples](examples.md) - See common usage patterns
- [SDK Packages](../sdk/concepts.md) - Learn about core concepts

## Troubleshooting

### Common Issues

**"SDK not initialized" error:**
- Make sure to call `HardwareSDK.init()` before using any other methods
- Check that your manifest configuration is correct

**Device not found:**
- Ensure your OneKey device is connected and unlocked
- Check USB/Bluetooth permissions
- Try different transport methods

**CORS errors (Web only):**
- Make sure you're using the correct `connectSrc` URL
- Check your Content Security Policy settings

For more troubleshooting tips, see [Troubleshooting Guide](../resources/troubleshooting.md).
