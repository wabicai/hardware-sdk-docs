# Installation & Setup

## SDK Installation

Choose the appropriate package based on your development environment:

### Node.js / Electron Main Process
```bash
npm install @onekeyfe/hd-core
# or
yarn add @onekeyfe/hd-core
```

### Web Browser / Browser Extensions
```bash
npm install @onekeyfe/hd-web-sdk
# or
yarn add @onekeyfe/hd-web-sdk
```

### React Native / Mobile Apps
```bash
npm install @onekeyfe/hd-ble-sdk
# or
yarn add @onekeyfe/hd-ble-sdk
```

## SDK Initialization

Initialize the SDK before making any method calls:

```typescript
await HardwareSDK.init(params);
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `debug` | `boolean` | No | Enable debug logging (default: `false`) |
| `fetchConfig` | `boolean` | No | Query for device version updates over network |
| `connectSrc` | `string` | Web only | URL of the iframe page for web SDK |
| `transportReconnect` | `boolean` | No | Auto-reconnect transport on failure |
| `lazyLoad` | `boolean` | No | Lazy load core components |
| `preRelease` | `boolean` | No | Use pre-release versions |
| `env` | `string` | No | Environment type (auto-detected) |

### Environment-Specific Examples

#### Node.js
```typescript
import HardwareSDK from '@onekeyfe/hd-core';

await HardwareSDK.init({
    debug: false,
    fetchConfig: true,
    transportReconnect: true,
    lazyLoad: false
});
```

#### Web
```typescript
import HardwareWebSDK from '@onekeyfe/hd-web-sdk';

await HardwareWebSDK.init({
    debug: false,
    connectSrc: 'https://jssdk.onekey.so/1.1.0/',
    fetchConfig: true,
    preRelease: false
});
```

#### React Native
```typescript
import HardwareBleSDK from '@onekeyfe/hd-ble-sdk';

await HardwareBleSDK.init({
    debug: false,
    transportReconnect: true
});
```

#### Web Browser
```typescript
import HardwareWebSDK from '@onekeyfe/hd-web-sdk';

await HardwareWebSDK.init({
    debug: false,
    fetchConfig: true,
    connectSrc: 'https://jssdk.onekey.so/1.1.0/',
    env: 'web'
});
```

#### React Native
```typescript
import HardwareBleSDK from '@onekeyfe/hd-ble-sdk';

await HardwareBleSDK.init({
    debug: false,
    env: 'react-native'
});
```

## Verification

After initialization, verify the SDK is ready:

```typescript
const initResult = await HardwareSDK.init({ debug: false });
if (initResult.success) {
    console.log('SDK initialized successfully');
    // Proceed with device discovery
    const devices = await HardwareSDK.searchDevices();
} else {
    console.error('SDK initialization failed:', initResult.payload.error);
}
```

## Next Steps

After successful initialization:
1. **[Search for devices](../device-api/search-devices.md)** - Discover connected OneKey hardware wallets
2. **[Get device features](../device-api/get-features.md)** - Retrieve device information and capabilities
3. **[Understand common parameters](common-params.md)** - Learn about connectId, deviceId, and other shared parameters
