---
icon: arrow-up
---

# Migration Guide

Guide for upgrading from older versions of OneKey Hardware SDK to the latest version.

## Version 4.x to 5.x

### Breaking Changes

#### 1. Method Name Changes

**Ethereum Methods:**
```javascript
// Old (v4.x)
await HardwareSDK.ethereumGetAddress(params);
await HardwareSDK.ethereumSignTransaction(params);
await HardwareSDK.ethereumSignMessage(params);

// New (v5.x)
await HardwareSDK.evmGetAddress(params);
await HardwareSDK.evmSignTransaction(params);
await HardwareSDK.evmSignMessage(params);
```

#### 2. Initialization Changes

**Web SDK:**
```javascript
// Old (v4.x)
await HardwareSDK.init({
  connectSrc: 'https://connect.onekey.so/',
  manifest: { /* ... */ }
});

// New (v5.x)
await HardwareSDK.init({
  connectSrc: 'https://jssdk.onekey.so/',
  manifest: { /* ... */ }
});
```

#### 3. Response Format Changes

**Error Handling:**
```javascript
// Old (v4.x)
const result = await HardwareSDK.btcGetAddress(params);
if (result.success) {
  // Success
} else {
  console.error(result.error); // Direct error property
}

// New (v5.x)
const result = await HardwareSDK.btcGetAddress(params);
if (result.success) {
  // Success
} else {
  console.error(result.payload.error); // Error in payload
}
```

#### 4. Transport Configuration

**Node.js SDK:**
```javascript
// Old (v4.x)
await HardwareSDK.init({
  transportType: 'usb',
  manifest: { /* ... */ }
});

// New (v5.x)
await HardwareSDK.init({
  transport: { type: 'usb' },
  manifest: { /* ... */ }
});
```

### Migration Steps

#### Step 1: Update Package Version

```bash
# Update to latest version
npm install @onekeyfe/hd-web-sdk@latest
npm install @onekeyfe/hd-common-connect-sdk@latest
npm install @onekeyfe/hd-ble-sdk@latest
```

#### Step 2: Update Method Names

Create a migration helper:

```javascript
// migration-helper.js
export const migrateEthereumMethods = (sdk) => {
  return {
    // Backward compatibility wrappers
    ethereumGetAddress: (params) => sdk.evmGetAddress(params),
    ethereumSignTransaction: (params) => sdk.evmSignTransaction(params),
    ethereumSignMessage: (params) => sdk.evmSignMessage(params),
    ethereumSignTypedData: (params) => sdk.evmSignTypedData(params),
    
    // New methods
    evmGetAddress: (params) => sdk.evmGetAddress(params),
    evmSignTransaction: (params) => sdk.evmSignTransaction(params),
    evmSignMessage: (params) => sdk.evmSignMessage(params),
    evmSignTypedData: (params) => sdk.evmSignTypedData(params),
  };
};

// Usage
import { HardwareSDK } from '@onekeyfe/hd-web-sdk';
import { migrateEthereumMethods } from './migration-helper';

const sdk = migrateEthereumMethods(HardwareSDK);

// Old code still works
const result = await sdk.ethereumGetAddress(params);
```

#### Step 3: Update Error Handling

```javascript
// Create error handling wrapper
const handleResult = (result) => {
  if (result.success) {
    return result.payload;
  } else {
    // Handle both old and new error formats
    const error = result.error || result.payload?.error || 'Unknown error';
    throw new Error(error);
  }
};

// Usage
try {
  const result = await HardwareSDK.btcGetAddress(params);
  const address = handleResult(result);
  console.log('Address:', address.address);
} catch (error) {
  console.error('Error:', error.message);
}
```

#### Step 4: Update Configuration

```javascript
// config-migration.js
export const migrateConfig = (oldConfig) => {
  const newConfig = { ...oldConfig };
  
  // Update connectSrc
  if (newConfig.connectSrc === 'https://connect.onekey.so/') {
    newConfig.connectSrc = 'https://jssdk.onekey.so/';
  }
  
  // Update transport configuration
  if (newConfig.transportType) {
    newConfig.transport = { type: newConfig.transportType };
    delete newConfig.transportType;
  }
  
  return newConfig;
};

// Usage
const oldConfig = {
  connectSrc: 'https://connect.onekey.so/',
  transportType: 'usb',
  manifest: { /* ... */ }
};

const newConfig = migrateConfig(oldConfig);
await HardwareSDK.init(newConfig);
```

## Version 3.x to 4.x

### Breaking Changes

#### 1. Package Structure Changes

```javascript
// Old (v3.x)
import OneKeyConnect from '@onekeyfe/js-sdk';

// New (v4.x)
import { HardwareSDK } from '@onekeyfe/hd-web-sdk';
```

#### 2. Initialization Method

```javascript
// Old (v3.x)
OneKeyConnect.init({
  lazyLoad: true,
  manifest: { /* ... */ }
});

// New (v4.x)
await HardwareSDK.init({
  debug: false,
  manifest: { /* ... */ }
});
```

#### 3. Method Signatures

```javascript
// Old (v3.x)
const result = OneKeyConnect.getAddress({
  device: devicePath,
  path: "m/44'/0'/0'/0/0",
  coin: 'btc'
});

// New (v4.x)
const result = await HardwareSDK.btcGetAddress({
  path: "m/44'/0'/0'/0/0",
  coin: 'btc'
});
```

### Migration Steps

#### Step 1: Update Imports

```javascript
// Replace all imports
// Old
import OneKeyConnect from '@onekeyfe/js-sdk';

// New
import { HardwareSDK } from '@onekeyfe/hd-web-sdk';
```

#### Step 2: Update Initialization

```javascript
// Old initialization
OneKeyConnect.init({
  lazyLoad: true,
  manifest: {
    email: 'developer@yourapp.com',
    appName: 'Your App',
    appUrl: 'https://yourapp.com'
  }
});

// New initialization
await HardwareSDK.init({
  debug: process.env.NODE_ENV === 'development',
  connectSrc: 'https://jssdk.onekey.so/',
  manifest: {
    email: 'developer@yourapp.com',
    appName: 'Your App',
    appUrl: 'https://yourapp.com'
  }
});
```

#### Step 3: Update Method Calls

```javascript
// Create migration wrapper
const createV3Wrapper = (sdk) => {
  return {
    getAddress: async (params) => {
      const { device, path, coin, ...rest } = params;
      
      if (device) {
        await sdk.connectDevice(device);
      }
      
      if (coin === 'eth') {
        return await sdk.evmGetAddress({ path, ...rest });
      } else {
        return await sdk.btcGetAddress({ path, coin, ...rest });
      }
    },
    
    signTransaction: async (params) => {
      const { device, coin, ...rest } = params;
      
      if (device) {
        await sdk.connectDevice(device);
      }
      
      if (coin === 'eth') {
        return await sdk.evmSignTransaction(rest);
      } else {
        return await sdk.btcSignTransaction({ coin, ...rest });
      }
    }
  };
};

// Usage
const OneKeyConnect = createV3Wrapper(HardwareSDK);

// Old code works with minimal changes
const result = await OneKeyConnect.getAddress({
  path: "m/44'/0'/0'/0/0",
  coin: 'btc'
});
```

## Common Migration Issues

### 1. Async/Await Requirements

**Issue:** Methods are now async and require await.

**Solution:**
```javascript
// Old (synchronous)
const result = OneKeyConnect.getAddress(params);

// New (asynchronous)
const result = await HardwareSDK.btcGetAddress(params);

// Or with promises
HardwareSDK.btcGetAddress(params)
  .then(result => {
    console.log('Address:', result.payload.address);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### 2. Device Management Changes

**Issue:** Device connection is now handled separately.

**Solution:**
```javascript
// Old (device parameter in each call)
const result = OneKeyConnect.getAddress({
  device: devicePath,
  path: "m/44'/0'/0'/0/0"
});

// New (connect once, use multiple times)
const devices = await HardwareSDK.searchDevices();
await HardwareSDK.connectDevice(devices[0].path);

const result = await HardwareSDK.btcGetAddress({
  path: "m/44'/0'/0'/0/0"
});
```

### 3. Event Handling Changes

**Issue:** Event system has been updated.

**Solution:**
```javascript
// Old
OneKeyConnect.on('device-connect', handler);

// New
HardwareSDK.on('device-connect', handler);

// Cleanup
HardwareSDK.off('device-connect', handler);
```

## Testing Migration

### 1. Create Test Suite

```javascript
// migration-test.js
import { HardwareSDK } from '@onekeyfe/hd-web-sdk';

const testMigration = async () => {
  try {
    // Test initialization
    await HardwareSDK.init({
      debug: true,
      connectSrc: 'https://jssdk.onekey.so/',
      manifest: {
        email: 'test@example.com',
        appName: 'Migration Test',
        appUrl: 'https://test.com'
      }
    });
    console.log('✅ Initialization successful');
    
    // Test device search
    const devices = await HardwareSDK.searchDevices();
    console.log('✅ Device search successful:', devices.length);
    
    // Test address generation
    if (devices.length > 0) {
      await HardwareSDK.connectDevice(devices[0].path);
      
      const result = await HardwareSDK.btcGetAddress({
        path: "m/44'/0'/0'/0/0",
        coin: 'btc'
      });
      
      if (result.success) {
        console.log('✅ Address generation successful');
      }
    }
    
  } catch (error) {
    console.error('❌ Migration test failed:', error);
  }
};

testMigration();
```

### 2. Gradual Migration

```javascript
// Migrate one feature at a time
const migrateGradually = async () => {
  // Phase 1: Update initialization only
  await HardwareSDK.init(newConfig);
  
  // Phase 2: Update address generation
  const addresses = await getAddressesNewWay();
  
  // Phase 3: Update transaction signing
  const transactions = await signTransactionsNewWay();
  
  // Phase 4: Update event handling
  setupNewEventHandlers();
};
```

## Best Practices for Migration

### 1. Version Compatibility

```javascript
// Check SDK version
const getSDKVersion = () => {
  try {
    return HardwareSDK.version || 'unknown';
  } catch {
    return 'legacy';
  }
};

const version = getSDKVersion();
console.log('SDK Version:', version);
```

### 2. Feature Detection

```javascript
// Check if new methods are available
const hasNewMethods = () => {
  return typeof HardwareSDK.evmGetAddress === 'function';
};

if (hasNewMethods()) {
  // Use new methods
  await HardwareSDK.evmGetAddress(params);
} else {
  // Fallback to old methods
  await HardwareSDK.ethereumGetAddress(params);
}
```

### 3. Error Handling

```javascript
// Robust error handling for migration
const safeApiCall = async (method, params) => {
  try {
    const result = await method(params);
    
    // Handle both old and new response formats
    if (typeof result === 'object' && 'success' in result) {
      return result.success ? result.payload : { error: result.payload?.error };
    }
    
    return result;
  } catch (error) {
    return { error: error.message };
  }
};
```

## Getting Help

If you encounter issues during migration:

1. **Check the changelog** for detailed breaking changes
2. **Review the examples** in the new documentation
3. **Test in a development environment** before production
4. **Report migration issues** on GitHub

## Next Steps

- [API Reference](../api/device.md) - Complete API documentation
- [Examples](../quick-start/examples.md) - Updated code examples
- [Troubleshooting](troubleshooting.md) - Common issues and solutions
- [FAQ](faq.md) - Frequently asked questions
