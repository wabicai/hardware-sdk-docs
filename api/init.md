---
icon: play
---

# Initialization

Initialize OneKey SDK to start interacting with hardware wallets.

## Constructor

```javascript
new OneKeySDK(options)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `options` | `Object` | Yes | Configuration options |

### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `manifest` | `Object` | Yes | Application identification |
| `debug` | `boolean` | No | Enable debug logging |
| `connectSrc` | `string` | No | Connect service URL (Web only) |
| `transport` | `Object` | No | Transport configuration (Node.js only) |

### Manifest

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | `string` | Yes | Developer contact email |
| `appName` | `string` | Yes | Application name |
| `appUrl` | `string` | Yes | Application URL |

## Platform Examples

### Web Browser

```javascript
import OneKeySDK from '@onekey/hardware-web-sdk';

const sdk = new OneKeySDK({
  manifest: {
    email: 'developer@yourapp.com',
    appName: 'Your Web App',
    appUrl: 'https://yourapp.com'
  },
  debug: true // Enable for development
});
```

### Node.js

```javascript
const OneKeySDK = require('@onekey/hardware-js-sdk');

const sdk = new OneKeySDK({
  manifest: {
    email: 'developer@yourapp.com',
    appName: 'Your Node App',
    appUrl: 'https://yourapp.com'
  },
  transport: {
    type: 'auto' // auto, usb, bluetooth, bridge
  }
});
```

### React Native

```javascript
import OneKeySDK from '@onekey/hardware-react-native-sdk';
import { Linking } from 'react-native';

const sdk = new OneKeySDK({
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

### Debug Mode

Enable debug logging for development:

```javascript
const sdk = new OneKeySDK({
  debug: true,
  manifest: { /* ... */ }
});
```

### Custom Connect Service (Web)

Use a custom Connect service URL:

```javascript
const sdk = new OneKeySDK({
  connectSrc: 'https://your-connect-service.com',
  manifest: { /* ... */ }
});
```

### Transport Configuration (Node.js)

Configure transport layer:

```javascript
const sdk = new OneKeySDK({
  transport: {
    type: 'usb',        // Force USB connection
    timeout: 5000       // Connection timeout
  },
  manifest: { /* ... */ }
});
```

### Timeouts

Configure operation timeouts:

```javascript
const sdk = new OneKeySDK({
  timeout: {
    call: 30000,      // Method call timeout
    transport: 5000,  // Transport connection timeout
    device: 10000     // Device response timeout
  },
  manifest: { /* ... */ }
});
```

## Error Handling

Handle initialization errors:

```javascript
try {
  const sdk = new OneKeySDK({
    manifest: {
      email: 'invalid-email',
      appName: '',
      appUrl: 'invalid-url'
    }
  });
} catch (error) {
  switch (error.code) {
    case 'Invalid_Manifest':
      console.error('Invalid manifest configuration');
      break;
    case 'Invalid_Email':
      console.error('Invalid email format');
      break;
    default:
      console.error('Initialization failed:', error.message);
  }
}
```

## Environment Detection

Automatically detect and configure for different environments:

```javascript
function createSDK() {
  const isNode = typeof window === 'undefined';
  const isBrowser = typeof window !== 'undefined';
  const isReactNative = typeof navigator !== 'undefined' && 
                        navigator.product === 'ReactNative';
  
  const manifest = {
    email: 'developer@yourapp.com',
    appName: 'Universal App',
    appUrl: 'https://yourapp.com'
  };
  
  if (isNode) {
    const OneKeySDK = require('@onekey/hardware-js-sdk');
    return new OneKeySDK({ manifest });
  } else if (isReactNative) {
    const OneKeySDK = require('@onekey/hardware-react-native-sdk');
    return new OneKeySDK({ 
      manifest,
      deeplinkOpen: (url) => Linking.openURL(url),
      deeplinkCallbackUrl: 'yourapp://onekey-callback'
    });
  } else if (isBrowser) {
    const OneKeySDK = require('@onekey/hardware-web-sdk');
    return new OneKeySDK({ manifest });
  }
}
```

## Verification

Verify SDK initialization:

```javascript
const sdk = new OneKeySDK({
  manifest: { /* ... */ }
});

// Check SDK version
console.log('SDK Version:', sdk.version);

// Test basic functionality
try {
  const features = await sdk.getFeatures();
  console.log('SDK initialized successfully');
} catch (error) {
  console.log('Waiting for device connection...');
}
```

## Next Steps

After initialization, you can:

- [Connect to devices](device.md) (Node.js only)
- [Get device information](device.md#getfeatures)
- [Generate addresses](bitcoin.md#btcgetaddress)
- [Sign transactions](bitcoin.md#btcsigntransaction)

## Related

- [Device Management](device.md)
- [Platform Guides](../platforms/web.md)
- [Error Handling](../concepts/errors.md)
