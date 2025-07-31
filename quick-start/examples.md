---
icon: code
---

# Basic Examples

Common usage patterns and code examples to help you integrate OneKey hardware wallets into your application.

## Device Management

### Search and Connect to Devices

```javascript
// Search for available devices
const devices = await HardwareSDK.searchDevices();
console.log('Available devices:', devices);

// Connect to a specific device
if (devices.length > 0) {
    await HardwareSDK.connectDevice(devices[0].path);
    console.log('Connected to device');
}

// Get device features
const features = await HardwareSDK.getFeatures();
console.log('Device info:', features);
```

### Handle Device Events

```javascript
// Listen for device connection events
HardwareSDK.on('device-connect', (device) => {
    console.log('Device connected:', device.label);
});

HardwareSDK.on('device-disconnect', (device) => {
    console.log('Device disconnected:', device.label);
});

// Listen for button requests
HardwareSDK.on('ui-button', (event) => {
    console.log('Please confirm action on device');
});
```

## Getting Addresses

### Bitcoin Address

```javascript
// Get Bitcoin address
const result = await HardwareSDK.btcGetAddress({
    path: "m/44'/0'/0'/0/0",
    showOnDevice: true,
    coin: 'btc'
});

if (result.success) {
    console.log('Bitcoin address:', result.payload.address);
}
```

### Ethereum Address

```javascript
// Get Ethereum address
const result = await HardwareSDK.evmGetAddress({
    path: "m/44'/60'/0'/0/0",
    showOnDevice: true
});

if (result.success) {
    console.log('Ethereum address:', result.payload.address);
}
```

### Multiple Addresses

```javascript
// Get multiple Bitcoin addresses
const result = await HardwareSDK.btcGetAddress({
    bundle: [
        { path: "m/44'/0'/0'/0/0", showOnDevice: false },
        { path: "m/44'/0'/0'/0/1", showOnDevice: false },
        { path: "m/44'/0'/0'/0/2", showOnDevice: false }
    ],
    coin: 'btc'
});

if (result.success) {
    result.payload.forEach((addr, index) => {
        console.log(`Address ${index}:`, addr.address);
    });
}
```

## Signing Transactions

### Bitcoin Transaction

```javascript
// Sign Bitcoin transaction
const result = await HardwareSDK.btcSignTransaction({
    coin: 'btc',
    inputs: [{
        address_n: [44 | 0x80000000, 0 | 0x80000000, 0 | 0x80000000, 0, 0],
        prev_hash: 'previous_transaction_hash',
        prev_index: 0,
        amount: '100000' // in satoshis
    }],
    outputs: [{
        address: 'recipient_address',
        amount: '90000', // amount to send
        script_type: 'PAYTOADDRESS'
    }]
});

if (result.success) {
    console.log('Signed transaction:', result.payload.serializedTx);
}
```

### Ethereum Transaction

```javascript
// Sign Ethereum transaction
const result = await HardwareSDK.evmSignTransaction({
    path: "m/44'/60'/0'/0/0",
    transaction: {
        to: '0x...',
        value: '0x16345785d8a0000', // 0.1 ETH in wei
        gasLimit: '0x5208',
        gasPrice: '0x3b9aca00',
        nonce: '0x0',
        chainId: 1 // Ethereum mainnet
    }
});

if (result.success) {
    console.log('Signed transaction:', result.payload);
}
```

## Message Signing

### Sign Text Message

```javascript
// Sign a text message
const result = await HardwareSDK.btcSignMessage({
    path: "m/44'/0'/0'/0/0",
    message: 'Hello OneKey!',
    coin: 'btc'
});

if (result.success) {
    console.log('Signature:', result.payload.signature);
}
```

### Ethereum Personal Sign

```javascript
// Sign Ethereum personal message
const result = await HardwareSDK.evmSignMessage({
    path: "m/44'/60'/0'/0/0",
    message: 'Hello OneKey!',
    hex: false
});

if (result.success) {
    console.log('Signature:', result.payload.signature);
}
```

## Error Handling

### Basic Error Handling

```javascript
try {
    const result = await HardwareSDK.btcGetAddress({
        path: "m/44'/0'/0'/0/0",
        showOnDevice: true,
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

### Handle Specific Error Types

```javascript
import { ERRORS } from '@onekeyfe/hd-shared';

try {
    const result = await HardwareSDK.btcGetAddress({
        path: "m/44'/0'/0'/0/0",
        showOnDevice: true,
        coin: 'btc'
    });
    
    if (!result.success) {
        const error = result.payload.error;
        
        switch (error) {
            case ERRORS.TypedError.Runtime_CallException:
                console.log('Device operation cancelled by user');
                break;
            case ERRORS.TypedError.Device_NotFound:
                console.log('Device not found or disconnected');
                break;
            case ERRORS.TypedError.Device_InitializeFailed:
                console.log('Failed to initialize device');
                break;
            default:
                console.log('Unknown error:', error);
        }
    }
} catch (error) {
    console.error('Unexpected error:', error);
}
```

## Advanced Usage

### Custom Transport Configuration

```javascript
// Initialize with custom transport settings
await HardwareSDK.init({
    debug: true,
    manifest: {
        email: 'developer@yourapp.com',
        appName: 'Your App',
        appUrl: 'https://yourapp.com'
    },
    transportReconnect: true,
    pendingTransportEvent: true,
    connectSrc: 'https://jssdk.onekey.so/'
});
```

### Batch Operations

```javascript
// Perform multiple operations efficiently
const operations = [
    () => HardwareSDK.btcGetAddress({ path: "m/44'/0'/0'/0/0", coin: 'btc' }),
    () => HardwareSDK.evmGetAddress({ path: "m/44'/60'/0'/0/0" }),
    () => HardwareSDK.getFeatures()
];

const results = await Promise.all(operations.map(op => op()));
console.log('All results:', results);
```

### Device State Management

```javascript
class DeviceManager {
    constructor() {
        this.connectedDevice = null;
        this.isInitialized = false;
    }
    
    async initialize() {
        if (this.isInitialized) return;
        
        await HardwareSDK.init({
            debug: false,
            manifest: {
                email: 'developer@yourapp.com',
                appName: 'Your App',
                appUrl: 'https://yourapp.com'
            }
        });
        
        this.isInitialized = true;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        HardwareSDK.on('device-connect', (device) => {
            this.connectedDevice = device;
            console.log('Device connected:', device.label);
        });
        
        HardwareSDK.on('device-disconnect', () => {
            this.connectedDevice = null;
            console.log('Device disconnected');
        });
    }
    
    async ensureConnected() {
        if (!this.connectedDevice) {
            const devices = await HardwareSDK.searchDevices();
            if (devices.length > 0) {
                await HardwareSDK.connectDevice(devices[0].path);
            } else {
                throw new Error('No devices found');
            }
        }
    }
    
    async getAddress(path, coin = 'btc') {
        await this.ensureConnected();
        return await HardwareSDK.btcGetAddress({ path, coin, showOnDevice: true });
    }
}

// Usage
const deviceManager = new DeviceManager();
await deviceManager.initialize();
const result = await deviceManager.getAddress("m/44'/0'/0'/0/0");
```

## Testing Your Integration

### Mock Device for Development

```javascript
// Enable mock mode for testing without hardware
await HardwareSDK.init({
    debug: true,
    env: 'mock', // Use mock device
    manifest: {
        email: 'developer@yourapp.com',
        appName: 'Test App',
        appUrl: 'https://yourapp.com'
    }
});

// Mock device will respond with predictable test data
const result = await HardwareSDK.btcGetAddress({
    path: "m/44'/0'/0'/0/0",
    coin: 'btc'
});
```

### Unit Testing Example

```javascript
// Jest test example
describe('OneKey Integration', () => {
    beforeAll(async () => {
        await HardwareSDK.init({
            env: 'mock',
            manifest: {
                email: 'test@example.com',
                appName: 'Test App',
                appUrl: 'https://test.com'
            }
        });
    });
    
    test('should get Bitcoin address', async () => {
        const result = await HardwareSDK.btcGetAddress({
            path: "m/44'/0'/0'/0/0",
            coin: 'btc'
        });
        
        expect(result.success).toBe(true);
        expect(result.payload.address).toBeDefined();
    });
});
```

## Next Steps

- [SDK Concepts](../sdk/concepts.md) - Learn about the SDK architecture
- [Integration Guides](../integration/web-browser.md) - Platform-specific guides
- [API Reference](../api/device.md) - Complete API documentation

## Common Patterns

For more complex integration patterns and real-world examples, check out:
- [Integration Examples](../integration/best-practices.md) - Production-ready patterns
- [Troubleshooting](../resources/troubleshooting.md) - Common issues and solutions
