# Integrate OneKey devices with your project

{% hint style="info" %}
**Explore OneKey Hardware SDKs**

OneKey Hardware SDK enables seamless integration of OneKey hardware wallets with third-party applications. Built with a developer-friendly interface, it ensures secure interactions for OneKey users within your applications.

This page walks you through installation and lets you explore SDK API for different environments.
{% endhint %}

## Quick start

### Choose your environment

Depending on your environment you need to choose the right package and follow the particular guide:

{% tabs %}
{% tab title="🖥️ Node.js" %}
**For server applications, CLI tools, and Electron main process**

- Direct USB communication
- Bridge transport support
- Full API access  
- TypeScript support

**Use cases:** Server apps, CLI tools, Electron main process

[Quick Start Guide ↓](#nodejs)
{% endtab %}

{% tab title="🌐 Web" %}
**For web applications and browser extensions**

- Iframe-based security isolation
- WebUSB and Bridge transport support
- Cross-origin communication
- Built-in UI for device interactions

**Use cases:** Web apps, browser extensions

[Quick Start Guide ↓](#web)
{% endtab %}

{% tab title="📱 Mobile" %}
**For React Native and mobile applications**

- Bluetooth LE communication
- Native mobile integration
- Permission management
- Device discovery and pairing

**Use cases:** React Native, mobile apps

[Quick Start Guide ↓](#mobile)
{% endtab %}
{% endtabs %}

{% details title="Still unsure? Check the comparison table" %}
| Environment | Package | Use Case | Connection | Transport |
|-------------|---------|----------|------------|-----------|
| Node.js | `@onekeyfe/hd-core` | Server apps, CLI tools, Electron main | USB/Bridge | Direct |
| Web | `@onekeyfe/hd-web-sdk` | Web apps, browser extensions | USB/Bridge/WebUSB | IFrame |
| Mobile | `@onekeyfe/hd-ble-sdk` | React Native, mobile apps | Bluetooth LE | Native |
{% enddetails %}

---

## 🖥️ Node.js

{% hint style="success" %}
**Perfect for:** Server applications, CLI tools, and Electron main process
{% endhint %}

### Architecture

{% tabs %}
{% tab title="USB Connection" %}
![OneKey SDK Architecture](images/onekey-sdk-architecture.png)

Direct connection via USB with full SDK access. The core SDK is loaded as a JavaScript module without any specificities, allowing native or CLI applications to directly interact with OneKey devices.
{% endtab %}

{% tab title="Bridge Connection" %}
![OneKey Bridge Architecture](images/onekey-sdk-architecture.png)

Connection through OneKey Bridge service for environments where direct USB access is limited. The Bridge acts as a communication layer between your application and the hardware wallet.
{% endtab %}
{% endtabs %}

### About

In Node.js the core SDK is loaded as a JavaScript module without any specificities. This allows native or CLI applications to directly interact with OneKey devices.

**Key Features:**
- Direct USB communication
- Bridge transport support
- Full API access
- TypeScript support

### Quick Start Guide

{% details title="Step-by-step installation and usage" %}

#### 1. Installation

{% code-group %}
```bash [npm]
npm install @onekeyfe/hd-core
```

```bash [yarn]
yarn add @onekeyfe/hd-core
```

```bash [pnpm]
pnpm add @onekeyfe/hd-core
```
{% endcode-group %}

#### 2. Initialize the SDK

```typescript
import HardwareSDK from '@onekeyfe/hd-core';

// Initialize with recommended settings
await HardwareSDK.init({
    debug: false,
    fetchConfig: true,
    transportReconnect: true,
    lazyLoad: false
});
```

{% hint style="info" %}
The `lazyLoad: false` parameter ensures the SDK is fully loaded immediately, which is recommended for Node.js environments.
{% endhint %}

#### 3. Connect to device

```typescript
// Search for connected devices
const devices = await HardwareSDK.searchDevices();

if (devices.success && devices.payload.length > 0) {
    const { connectId, deviceId } = devices.payload[0];
    console.log('Device found:', connectId);
} else {
    console.error('No devices found');
}
```

#### 4. Call SDK methods

```typescript
// Example: Get Bitcoin address
const result = await HardwareSDK.btcGetAddress(connectId, deviceId, {
    path: "m/44'/0'/0'/0/0",
    coin: 'btc',
    showOnOneKey: false
});

if (result.success) {
    console.log('Bitcoin address:', result.payload.address);
} else {
    console.error('Error:', result.payload.error);
}
```

{% hint style="info" %}
**Examples:** [Node.js](https://github.com/OneKeyHQ/OneKey-Hardware-JS-SDK/tree/main/packages/connect-examples/node) | [Electron Main Process](https://github.com/OneKeyHQ/OneKey-Hardware-JS-SDK/tree/main/packages/connect-examples/electron-example)
{% endhint %}

{% enddetails %}

---

## 🌐 Web

{% hint style="success" %}
**Perfect for:** Web applications and browser extensions
{% endhint %}

### Architecture

{% tabs %}
{% tab title="Core in Iframe" %}
![OneKey Web SDK Architecture](images/onekey-web-sdk-architecture.png)

`@onekeyfe/hd-web-sdk` imports only a thin layer with API description into your 3rd party application. The core SDK logic is injected into **iframe** where persistent connection between your app and core SDK is kept, so device events or blockchain subscriptions are available.
{% endtab %}

{% tab title="Core in Popup" %}
![OneKey Web SDK Architecture](images/onekey-web-sdk-architecture.png)

Alternative mode where core SDK logic is opened in **popup** (more info in [init method documentation](configuration/installation.md)). User input, such as passphrase or PIN, is handled by the popup page opened on onekey.so, isolated from your application.
{% endtab %}

{% tab title="Auto Mode Selection" %}
![OneKey Web SDK Architecture](images/onekey-web-sdk-architecture.png)

The SDK automatically selects the best mode based on your environment. Iframe mode is preferred for persistent connections, but popup mode is automatically used when iframe doesn't allow WebUSB communication and OneKey Bridge is not running.
{% endtab %}
{% endtabs %}

### About

`@onekeyfe/hd-web-sdk` imports only a thin layer with API description into your 3rd party application. It has two modes of operation: core SDK logic can be either injected into **iframe** or opened in **popup**. However iframe doesn't allow WebUSB communication, so popup is automatically preferred if OneKey Bridge is not running.

**Key Features:**
- Iframe-based security isolation
- WebUSB and Bridge transport support
- Cross-origin communication
- Built-in UI for device interactions

### Quick Start Guide

{% details title="Step-by-step installation and usage" %}

#### 1. Installation

{% code-group %}
```bash [npm]
npm install @onekeyfe/hd-web-sdk
```

```bash [yarn]
yarn add @onekeyfe/hd-web-sdk
```

```bash [pnpm]
pnpm add @onekeyfe/hd-web-sdk
```
{% endcode-group %}

Or include as inline script:

{% code-group %}
```html [CDN]
<script src="https://jssdk.onekey.so/1.1.0/onekey-js-sdk.js"></script>
```

```html [Local]
<script src="./path/to/onekey-js-sdk.js"></script>
```
{% endcode-group %}

#### 2. Initialize the SDK

{% code-group %}
```typescript [ES Module]
import HardwareWebSDK from '@onekeyfe/hd-web-sdk';

// Initialize with Connect service
await HardwareWebSDK.init({
    debug: false,
    connectSrc: 'https://jssdk.onekey.so/1.1.0/',
    fetchConfig: true
});
```

```javascript [Script Tag]
const HardwareWebSDK = window.OneKeyHardwareSDK;
await HardwareWebSDK.init({
    debug: false,
    connectSrc: 'https://jssdk.onekey.so/1.1.0/'
});
```
{% endcode-group %}

#### 3. Connect to device

```typescript
// Search for devices (will show device selection UI)
const devices = await HardwareWebSDK.searchDevices();

if (devices.success && devices.payload.length > 0) {
    const { connectId, deviceId } = devices.payload[0];
    console.log('Device connected:', connectId);
}
```

{% hint style="info" %}
The Web SDK will automatically show a device selection UI when multiple devices are connected.
{% endhint %}

#### 4. Call SDK methods

```typescript
// Example: Get Bitcoin address
const result = await HardwareWebSDK.btcGetAddress(connectId, deviceId, {
    path: "m/44'/0'/0'/0/0",
    coin: 'btc',
    showOnOneKey: true // Show address on device for verification
});

if (result.success) {
    console.log('Bitcoin address:', result.payload.address);
} else {
    console.error('Error:', result.payload.error);
}
```

{% hint style="info" %}
**Examples:** [Web App](https://github.com/OneKeyHQ/OneKey-Hardware-JS-SDK/tree/main/packages/connect-examples/browser-inline-script) | [Browser Extension](https://github.com/OneKeyHQ/OneKey-Hardware-JS-SDK/tree/main/packages/connect-examples/webextension-mv2)
{% endhint %}

{% enddetails %}

---

## 📱 Mobile

{% hint style="success" %}
**Perfect for:** React Native and mobile applications
{% endhint %}

### Architecture

{% tabs %}
{% tab title="Bluetooth LE" %}
![OneKey BLE SDK Architecture](images/onekey-ble-sdk-architecture.png)

`@onekeyfe/hd-ble-sdk` enables React Native applications to communicate with OneKey hardware wallets via Bluetooth Low Energy (BLE). It uses native BLE transport for wireless device communication while maintaining the same API as other OneKey SDKs.
{% endtab %}

{% tab title="Permission Flow" %}
The Mobile SDK requires specific Bluetooth permissions to function properly:

1. **Android**: `BLUETOOTH`, `BLUETOOTH_ADMIN`, `ACCESS_FINE_LOCATION`
2. **iOS**: `NSBluetoothAlwaysUsageDescription`
3. **Runtime Permissions**: The app must request these permissions at runtime
4. **Device Discovery**: BLE scan requires location permissions on Android
{% endtab %}
{% endtabs %}

### About

The Mobile SDK enables React Native applications to communicate with OneKey hardware wallets via Bluetooth Low Energy (BLE). It provides the same API as other OneKey SDKs but uses native BLE transport for wireless device communication.

**Key Features:**
- Bluetooth LE communication
- Native mobile integration
- Permission management
- Device discovery and pairing

### Quick Start Guide

{% details title="Step-by-step installation and usage" %}

#### 1. Installation

{% code-group %}
```bash [npm]
npm install @onekeyfe/hd-ble-sdk
```

```bash [yarn]
yarn add @onekeyfe/hd-ble-sdk
```

```bash [pnpm]
pnpm add @onekeyfe/hd-ble-sdk
```
{% endcode-group %}

#### 2. Configure permissions

Add Bluetooth permissions to your app configuration:

{% code-group %}
```xml [Android]
<!-- android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

<!-- For Android 12+ -->
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
```

```xml [iOS]
<!-- ios/YourApp/Info.plist -->
<key>NSBluetoothAlwaysUsageDescription</key>
<string>This app needs Bluetooth to connect to OneKey hardware wallet</string>
<key>NSBluetoothPeripheralUsageDescription</key>
<string>This app uses Bluetooth to communicate with OneKey devices</string>
```
{% endcode-group %}

{% hint style="warning" %}
**Important:** Make sure to handle runtime permissions in your React Native app. The BLE SDK won't work without proper permissions.
{% endhint %}

#### 3. Initialize the SDK

```typescript
import HardwareBleSDK from '@onekeyfe/hd-ble-sdk';

// Initialize BLE SDK
await HardwareBleSDK.init({
    debug: false,
    transportReconnect: true
});
```

#### 4. Connect to device

```typescript
// Scan for BLE devices (requires permissions)
const devices = await HardwareBleSDK.searchDevices();

if (devices.success && devices.payload.length > 0) {
    const { connectId, deviceId } = devices.payload[0];
    console.log('BLE device found:', connectId);
} else {
    console.error('No BLE devices found');
}
```

{% hint style="info" %}
BLE device discovery may take a few seconds. Make sure your OneKey device is in pairing mode and close to your mobile device.
{% endhint %}

#### 5. Call SDK methods

```typescript
// Example: Get Bitcoin address
const result = await HardwareBleSDK.btcGetAddress(connectId, deviceId, {
    path: "m/44'/0'/0'/0/0",
    coin: 'btc',
    showOnOneKey: true
});

if (result.success) {
    console.log('Bitcoin address:', result.payload.address);
} else {
    console.error('Error:', result.payload.error);
}
```

{% hint style="info" %}
**Examples:** [React Native](https://github.com/OneKeyHQ/OneKey-Hardware-JS-SDK/tree/main/packages/connect-examples/expo-example) | [Expo Example](https://github.com/OneKeyHQ/OneKey-Hardware-JS-SDK/tree/main/packages/connect-examples/expo-example)
{% endhint %}

{% enddetails %}

---

## Universal Integration Pattern

All OneKey SDKs follow the same integration pattern:

{% code-group %}
```typescript [Node.js]
import HardwareSDK from '@onekeyfe/hd-core';

// 1. Initialize SDK
await HardwareSDK.init({ debug: false });

// 2. Find devices
const devices = await HardwareSDK.searchDevices();
const { connectId, deviceId } = devices.payload[0];

// 3. Call methods
const result = await HardwareSDK.btcGetAddress(connectId, deviceId, {
    path: "m/44'/0'/0'/0/0",
    coin: 'btc'
});
```

```typescript [Web]
import HardwareWebSDK from '@onekeyfe/hd-web-sdk';

// 1. Initialize SDK
await HardwareWebSDK.init({ 
    debug: false,
    connectSrc: 'https://jssdk.onekey.so/1.1.0/'
});

// 2. Find devices
const devices = await HardwareWebSDK.searchDevices();
const { connectId, deviceId } = devices.payload[0];

// 3. Call methods (identical API)
const result = await HardwareWebSDK.btcGetAddress(connectId, deviceId, {
    path: "m/44'/0'/0'/0/0",
    coin: 'btc'
});
```

```typescript [Mobile]
import HardwareBleSDK from '@onekeyfe/hd-ble-sdk';

// 1. Initialize SDK
await HardwareBleSDK.init({ debug: false });

// 2. Find devices
const devices = await HardwareBleSDK.searchDevices();
const { connectId, deviceId } = devices.payload[0];

// 3. Call methods (identical API)
const result = await HardwareBleSDK.btcGetAddress(connectId, deviceId, {
    path: "m/44'/0'/0'/0/0",
    coin: 'btc'
});
```
{% endcode-group %}

{% hint style="success" %}
**Key Advantage:** Once you learn one SDK, you know them all! The API is identical across Node.js, Web, and Mobile environments.
{% endhint %}

## Multi-Chain Support

OneKey SDK supports 25+ blockchains with consistent API:

{% tabs %}
{% tab title="Bitcoin & Forks" %}
**Supported:** BTC, BCH, LTC, DOGE, DASH

```typescript
// Bitcoin
await HardwareSDK.btcGetAddress(connectId, deviceId, { path: "m/44'/0'/0'/0/0", coin: 'btc' });
await HardwareSDK.btcSignTransaction(connectId, deviceId, { inputs, outputs });

// Litecoin  
await HardwareSDK.btcGetAddress(connectId, deviceId, { path: "m/44'/2'/0'/0/0", coin: 'ltc' });

// Dogecoin
await HardwareSDK.btcGetAddress(connectId, deviceId, { path: "m/44'/3'/0'/0/0", coin: 'doge' });
```
{% endtab %}

{% tab title="EVM Chains" %}
**Supported:** Ethereum, BSC, Polygon, Avalanche, Arbitrum, Optimism

```typescript
// Ethereum
await HardwareSDK.evmGetAddress(connectId, deviceId, { path: "m/44'/60'/0'/0/0" });
await HardwareSDK.evmSignTransaction(connectId, deviceId, { to, value, data });

// Polygon (same API, different chainId)
await HardwareSDK.evmSignTransaction(connectId, deviceId, { 
    to, value, data, chainId: 137 
});

// BSC (same API, different chainId)
await HardwareSDK.evmSignTransaction(connectId, deviceId, { 
    to, value, data, chainId: 56 
});
```
{% endtab %}

{% tab title="Layer 1s" %}
**Supported:** Solana, Cardano, Polkadot, Cosmos, Near, Aptos, Sui

```typescript
// Solana
await HardwareSDK.solGetAddress(connectId, deviceId, { path: "m/44'/501'/0'/0'" });
await HardwareSDK.solSignTransaction(connectId, deviceId, { rawTx });

// Cardano
await HardwareSDK.cardanoGetAddress(connectId, deviceId, { 
    addressParameters: { addressType: 0, path: "m/44'/1815'/0'/0/0" }
});

// Aptos
await HardwareSDK.aptosGetAddress(connectId, deviceId, { path: "m/44'/637'/0'/0'/0'" });
```
{% endtab %}

{% tab title="Others" %}
**Supported:** Ripple, Stellar, Tron, Algorand, Filecoin, TON, Kaspa

```typescript
// Ripple (XRP)
await HardwareSDK.xrpGetAddress(connectId, deviceId, { path: "m/44'/144'/0'/0/0" });

// Stellar (XLM)
await HardwareSDK.stellarGetAddress(connectId, deviceId, { path: "m/44'/148'/0'" });

// Tron (TRX)
await HardwareSDK.tronGetAddress(connectId, deviceId, { path: "m/44'/195'/0'/0/0" });
```
{% endtab %}
{% endtabs %}

### Consistent API Pattern

All blockchain methods follow the same naming convention:

```typescript
// Address methods
const address = await HardwareSDK.{blockchain}GetAddress(connectId, deviceId, params);

// Transaction signing  
const signed = await HardwareSDK.{blockchain}SignTransaction(connectId, deviceId, params);

// Public key methods (where supported)
const pubkey = await HardwareSDK.{blockchain}GetPublicKey(connectId, deviceId, params);

// Message signing (where supported)
const signature = await HardwareSDK.{blockchain}SignMessage(connectId, deviceId, params);
```

## What's Next?

{% tabs %}
{% tab title="🚀 Core Integration" %}
Start building with OneKey SDK:

- **[Blockchain APIs](coin-api/README.md)** - Bitcoin, Ethereum, Solana, and 25+ blockchains
- **[Device Management](device-api/README.md)** - Hardware wallet discovery and control
- **[Configuration Guide](configuration/README.md)** - Complete setup and configuration reference

{% hint style="info" %}
**Recommended path:** Start with [Configuration Guide](configuration/README.md) to understand common parameters and setup, then explore the [Blockchain APIs](coin-api/README.md) for your specific use case.
{% endhint %}
{% endtab %}

{% tab title="🔧 Advanced Features" %}
Unlock powerful capabilities:

- **[Air Gap SDK](air-gap-sdk/README.md)** - Offline signing with QR codes for maximum security
- **[PIN Management](advanced/pin.md)** - Device PIN handling and security features
- **[Passphrase Support](advanced/passphrase.md)** - Multiple wallets on a single device
- **[Protocol Details](advanced/onekey-message-protocol.md)** - Low-level communication protocols

{% hint style="success" %}
**For production apps:** Implement [PIN Management](advanced/pin.md) and [Passphrase Support](advanced/passphrase.md) to provide a complete user experience.
{% endhint %}
{% endtab %}

{% tab title="📚 Resources & Examples" %}
Learn by example and test your integration:

**🎮 Interactive Tools**
- **[SDK Playground](https://hardware-example.onekeytest.com/expo-playground/)** - Test all SDK methods in your browser
- **[Method Tester](/api-explorer)** - Interactive API explorer with live device testing

**📁 Code Examples**
- **[Node.js Examples](https://github.com/OneKeyHQ/OneKey-Hardware-JS-SDK/tree/main/packages/connect-examples/node)** - Server applications and CLI tools
- **[Web Examples](https://github.com/OneKeyHQ/OneKey-Hardware-JS-SDK/tree/main/packages/connect-examples/browser-inline-script)** - Browser applications
- **[React Native Examples](https://github.com/OneKeyHQ/OneKey-Hardware-JS-SDK/tree/main/packages/connect-examples/expo-example)** - Mobile applications

**📖 References**
- **[Error Codes](configuration/error-codes.md)** - Complete error handling reference
- **[Derivation Paths](configuration/paths.md)** - BIP32/BIP44 path specifications
- **[Common Parameters](configuration/common-params.md)** - Shared configuration parameters

{% hint style="info" %}
**Quick tip:** Use the [SDK Playground](https://hardware-example.onekeytest.com/expo-playground/) to experiment with different methods and parameters before implementing them in your application.
{% endhint %}
{% endtab %}
{% endtabs %}

---

## Try It Out

{% embed url="https://hardware-example.onekeytest.com/expo-playground/" %}
OneKey SDK Interactive Testing Tool - Test hardware wallet interactions directly in your browser
{% endembed %}

## Need Help?

{% hint style="question" %}
**Having trouble getting started?**

- 📖 Check our [Configuration Guide](configuration/README.md) for detailed setup instructions
- 🔍 Browse [Common Issues](configuration/error-codes.md) for troubleshooting tips  
- 💬 Ask questions in our [GitHub Discussions](https://github.com/OneKeyHQ/OneKey-Hardware-JS-SDK/discussions)
- 🐛 Report bugs via [GitHub Issues](https://github.com/OneKeyHQ/OneKey-Hardware-JS-SDK/issues)
{% endhint %}
