# Installation & Setup

## Recommended: Web SDK Installation

The **@onekeyfe/hd-web-sdk** is the recommended SDK for most applications. It provides direct WebUSB communication with OneKey hardware wallets in web browsers without requiring additional software.

### Web SDK (Recommended)

```bash
npm install @onekeyfe/hd-web-sdk
# or
yarn add @onekeyfe/hd-web-sdk
```

**Why Web SDK?**
- ✅ **No Bridge Required** - Direct WebUSB communication
- ✅ **Easy Setup** - Works out of the box in modern browsers
- ✅ **Secure** - Direct encrypted communication with devices
- ✅ **Cross-Platform** - Works on Windows, macOS, and Linux
- ✅ **TypeScript Support** - Full type definitions included

### Browser Compatibility

The Web SDK works with browsers that support WebUSB:
- ✅ Chrome 61+
- ✅ Edge 79+
- ✅ Opera 48+
- ✅ Other Chromium-based browsers
- ❌ Firefox (WebUSB not supported)
- ❌ Safari (WebUSB not supported)

### Advanced SDK Options

For specialized use cases, see [Advanced Integration Options](../advanced/README.md):
- **React Native / Mobile Apps** - BLE SDK for mobile integration
- **Desktop Applications** - Common Connect SDK for native apps
- **Server-side** - Core SDK for Node.js environments

## Web SDK Initialization

Initialize the Web SDK before making any API calls:

```typescript
import OneKeyConnect from '@onekeyfe/hd-web-sdk';

await OneKeyConnect.init(params);
```

### Required Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `connectSrc` | `string` | **Yes** | URL of the OneKey Connect iframe |
| `debug` | `boolean` | No | Enable debug logging (default: `false`) |
| `fetchConfig` | `boolean` | No | Query for device version updates over network |
| `lazyLoad` | `boolean` | No | Lazy load core components |
| `preRelease` | `boolean` | No | Use pre-release versions |

### Connect Source URL

The `connectSrc` parameter should point to the official OneKey Connect iframe:

```typescript
// Production (Recommended)
connectSrc: 'https://connect.onekey.so/'

// Specific version (if needed)
connectSrc: 'https://jssdk.onekey.so/1.1.0/'
```

### Web SDK Examples

#### Basic Initialization (Recommended)

```typescript
import OneKeyConnect from '@onekeyfe/hd-web-sdk';

// Simple initialization for most use cases
await OneKeyConnect.init({
    connectSrc: 'https://connect.onekey.so/',
    debug: false
});
```

#### Development Setup

```typescript
import OneKeyConnect from '@onekeyfe/hd-web-sdk';

// Development configuration with debugging
await OneKeyConnect.init({
    connectSrc: 'https://connect.onekey.so/',
    debug: true,
    fetchConfig: true,
    lazyLoad: false
});
```

#### Production Setup

```typescript
import OneKeyConnect from '@onekeyfe/hd-web-sdk';

// Production configuration
await OneKeyConnect.init({
    connectSrc: 'https://connect.onekey.so/',
    debug: false,
    fetchConfig: true,
    lazyLoad: true,
    preRelease: false
});
```

### WebUSB Permissions

The Web SDK uses WebUSB to communicate directly with hardware devices. Users will see a browser permission prompt when first connecting to a device.

**Important Notes:**
- WebUSB requires HTTPS in production
- Users must manually grant device permissions
- Some browsers may block WebUSB in certain contexts

## Verification and First Steps

After initialization, verify the SDK is ready and discover devices:

```typescript
import OneKeyConnect from '@onekeyfe/hd-web-sdk';

// Initialize the SDK
const initResult = await OneKeyConnect.init({
    connectSrc: 'https://connect.onekey.so/',
    debug: false
});

if (initResult.success) {
    console.log('Web SDK initialized successfully');

    // Search for connected devices
    const devices = await OneKeyConnect.searchDevices();

    if (devices.success && devices.payload.length > 0) {
        console.log('Found devices:', devices.payload);

        // Get first device info
        const device = devices.payload[0];
        console.log('Device ID:', device.deviceId);
        console.log('Connect ID:', device.connectId);
    } else {
        console.log('No devices found. Please connect your OneKey device.');
    }
} else {
    console.error('SDK initialization failed:', initResult.payload.error);
}
```

## Complete Setup Example

Here's a complete example showing initialization and first API call:

```typescript
import OneKeyConnect from '@onekeyfe/hd-web-sdk';

async function setupOneKey() {
    try {
        // 1. Initialize SDK
        await OneKeyConnect.init({
            connectSrc: 'https://connect.onekey.so/',
            debug: false
        });

        // 2. Search for devices
        const devices = await OneKeyConnect.searchDevices();
        if (!devices.success || devices.payload.length === 0) {
            throw new Error('No OneKey device found');
        }

        // 3. Get Bitcoin address
        const result = await OneKeyConnect.btcGetAddress({
            path: "m/44'/0'/0'/0/0",
            coin: 'btc',
            showOnOneKey: true
        });

        if (result.success) {
            console.log('Bitcoin address:', result.payload.address);
            return result.payload.address;
        } else {
            throw new Error(result.payload.error);
        }
    } catch (error) {
        console.error('OneKey setup failed:', error);
        throw error;
    }
}

// Use the setup function
setupOneKey()
    .then(address => console.log('Setup complete, address:', address))
    .catch(error => console.error('Setup failed:', error));
```

## Next Steps

After successful initialization:

1. **[Device Discovery](../device-api/search-devices.md)** - Learn about finding and connecting to devices
2. **[Common Parameters](common-params.md)** - Understand connectId, deviceId, and other shared parameters
3. **[Your First API Call](../coin-api/btc/btcgetaddress.md)** - Get a Bitcoin address from your device
4. **[Error Handling](error-codes.md)** - Handle errors and edge cases properly

## Troubleshooting

### Common Issues

1. **WebUSB not supported**: Ensure you're using a compatible browser (Chrome, Edge, Opera)
2. **HTTPS required**: WebUSB requires HTTPS in production environments
3. **Device not detected**: Check USB connection and grant browser permissions
4. **Connect iframe blocked**: Ensure the connectSrc URL is accessible

### Browser Permissions

When first connecting to a device, users will see a WebUSB permission dialog. Make sure to:
- Explain to users why device access is needed
- Handle permission denial gracefully
- Provide clear instructions for granting permissions

For advanced integration scenarios, see [Advanced Integration Options](../advanced/README.md).
