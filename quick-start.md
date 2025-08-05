# Integrate OneKey devices with your project

## Explore OneKey Hardware SDK

OneKey Hardware SDK enables seamless integration of OneKey hardware wallets with third-party applications. Built with a developer-friendly interface, it ensures secure interactions for OneKey users within your applications.

Choose your development environment to get started:

## Quick start

### Choose your environment

Select the appropriate SDK package based on your development environment:

**Environment Selection:**
- 🖥️ **Node.js** - Server applications, CLI tools, Electron main process
- 🌐 **Web** - Web applications and browser extensions
- 📱 **Mobile** - React Native and mobile applications

<details>
<summary><strong>Environment comparison table</strong></summary>

| Environment | Package | Use Case | Connection | Transport |
|-------------|---------|----------|------------|-----------|
| Node.js | `@onekeyfe/hd-core` | Server apps, CLI tools, Electron main | USB/Bridge | Direct |
| Web | `@onekeyfe/hd-web-sdk` | Web apps, browser extensions | USB/Bridge/WebUSB | IFrame |
| Mobile | `@onekeyfe/hd-ble-sdk` | React Native, mobile apps | Bluetooth LE | Native |

</details>

---

## 🖥️ Node.js

**For server-side applications, CLI tools, and Electron main process**

![OneKey SDK Architecture](images/onekey-sdk-architecture.png)

### About

The Node.js SDK provides direct access to OneKey hardware wallets through USB connection or OneKey Bridge. It's designed for server applications, CLI tools, and Electron main processes where you need direct hardware communication.

**Key Features:**
- Direct USB communication
- Bridge transport support
- Full API access
- TypeScript support

<details>
<summary><strong>Quick start guide</strong></summary>

#### 1. Install the package

```bash
npm install @onekeyfe/hd-core
# or
yarn add @onekeyfe/hd-core
```

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

**[View complete Node.js example →](https://github.com/OneKeyHQ/OneKey-Hardware-JS-SDK/tree/main/packages/connect-examples/electron-example)**

</details>

---

## 🌐 Web

**For web applications and browser extensions**

![OneKey Web SDK Architecture](images/onekey-web-sdk-architecture.png)

### About

The Web SDK uses an iframe-based architecture to provide secure communication with OneKey devices. The core SDK logic runs in an isolated OneKey Connect service, handling device communication and user interactions like PIN entry and passphrase input.

**Key Features:**
- Iframe-based security isolation
- WebUSB and Bridge transport support
- Cross-origin communication
- Built-in UI for device interactions

<details>
<summary><strong>Quick start guide</strong></summary>

#### 1. Install the package

```bash
npm install @onekeyfe/hd-web-sdk
# or
yarn add @onekeyfe/hd-web-sdk
```

Or include as script tag:

```html
<script src="https://jssdk.onekey.so/1.1.0/onekey-js-sdk.js"></script>
```

#### 2. Initialize the SDK

```typescript
import HardwareWebSDK from '@onekeyfe/hd-web-sdk';

// Initialize with Connect service
await HardwareWebSDK.init({
    debug: false,
    connectSrc: 'https://jssdk.onekey.so/1.1.0/',
    fetchConfig: true
});
```

For script tag usage:
```javascript
const HardwareWebSDK = window.OneKeyHardwareSDK;
await HardwareWebSDK.init({
    debug: false,
    connectSrc: 'https://jssdk.onekey.so/1.1.0/'
});
```

#### 3. Connect to device

```typescript
// Search for devices (will show device selection UI)
const devices = await HardwareWebSDK.searchDevices();

if (devices.success && devices.payload.length > 0) {
    const { connectId, deviceId } = devices.payload[0];
    console.log('Device connected:', connectId);
}
```

#### 4. Call SDK methods

```typescript
// Example: Get Bitcoin address
const result = await HardwareWebSDK.btcGetAddress(connectId, deviceId, {
    path: "m/44'/0'/0'/0/0",
    coin: 'btc',
    showOnOneKey: true // Show address on device
});

if (result.success) {
    console.log('Bitcoin address:', result.payload.address);
} else {
    console.error('Error:', result.payload.error);
}
```

**[Try the interactive playground →](https://hardware-example.onekeytest.com/expo-playground/)**

</details>

---

## 📱 Mobile

**For React Native and mobile applications**

![OneKey BLE SDK Architecture](images/onekey-ble-sdk-architecture.png)

### About

The Mobile SDK enables React Native applications to communicate with OneKey hardware wallets via Bluetooth Low Energy (BLE). It provides the same API as other OneKey SDKs but uses native BLE transport for wireless device communication.

**Key Features:**
- Bluetooth LE communication
- Native mobile integration
- Permission management
- Device discovery and pairing

<details>
<summary><strong>Quick start guide</strong></summary>

#### 1. Install the package

```bash
npm install @onekeyfe/hd-ble-sdk
# or
yarn add @onekeyfe/hd-ble-sdk
```

#### 2. Configure permissions

Add Bluetooth permissions to your app configuration:

**Android** (`android/app/src/main/AndroidManifest.xml`):
```xml
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

**iOS** (`ios/YourApp/Info.plist`):
```xml
<key>NSBluetoothAlwaysUsageDescription</key>
<string>This app needs Bluetooth to connect to OneKey hardware wallet</string>
```

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
}
```

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

**[View React Native example →](https://github.com/OneKeyHQ/OneKey-Hardware-JS-SDK/tree/main/packages/connect-examples/expo-example)**

</details>

---

## Universal Integration Pattern

All OneKey SDKs follow the same integration pattern:

```typescript
// 1. Initialize SDK
await HardwareSDK.init({ debug: false });

// 2. Find devices
const devices = await HardwareSDK.searchDevices();
const { connectId, deviceId } = devices.payload[0];

// 3. Call methods
const result = await HardwareSDK.btcGetAddress(connectId, deviceId, {
    path: "m/44'/0'/0'/0/0",
    coin: 'btc',
    showOnOneKey: false
});
```

## Multi-Chain Support

OneKey SDK supports 25+ blockchains with consistent API:

**Supported Networks:**
- **Bitcoin & Forks** - BTC, BCH, LTC, DOGE, DASH
- **EVM Chains** - Ethereum, BSC, Polygon, Avalanche, Arbitrum
- **Layer 1s** - Solana, Cardano, Polkadot, Cosmos, Near, Aptos
- **Others** - Ripple, Stellar, Tron, Algorand, Filecoin

**Consistent API Pattern:**
```typescript
// Address methods
const address = await HardwareSDK.{blockchain}GetAddress(connectId, deviceId, params);

// Transaction signing
const signed = await HardwareSDK.{blockchain}SignTransaction(connectId, deviceId, params);
```

## What's Next?

### Core Integration
- **[Blockchain APIs](coin-api/README.md)** - Bitcoin, Ethereum, Solana, and 25+ blockchains
- **[Device Management](device-api/README.md)** - Hardware wallet discovery and control
- **[Common Parameters](coin-api/common-params.md)** - Shared configuration across all methods
- **[Error Handling](coin-api/error-code.md)** - Complete error code reference

### Advanced Features
- **[Air Gap SDK](air-gap-sdk/README.md)** - Offline signing with QR codes for maximum security
- **[PIN Management](advanced/pin.md)** - Device PIN handling and security
- **[Passphrase Support](advanced/passphrase.md)** - Multiple wallets on one device
- **[Protocol Details](advanced/onekey-message-protocol.md)** - Low-level communication

### Development Resources
- **[Interactive Playground](https://hardware-example.onekeytest.com/expo-playground/)** - Test SDK methods in your browser
- **[GitHub Examples](https://github.com/OneKeyHQ/OneKey-Hardware-JS-SDK/tree/main/packages/connect-examples)** - Complete implementation examples
- **[Derivation Paths](coin-api/path.md)** - BIP32/BIP44 path specifications
