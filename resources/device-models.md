---
icon: devices
---

# OneKey Device Models

OneKey SDK supports multiple hardware wallet models, each with different capabilities and features. This guide helps you understand device compatibility and optimize your integration.

## Supported Devices

### OneKey Classic
- **Model ID**: `1`
- **Product Name**: OneKey Classic
- **Release Year**: 2021
- **Screen**: 128x64 OLED
- **Connectivity**: USB-C
- **Secure Element**: Yes

**Features**:
- ✅ All cryptocurrency support
- ✅ PIN protection
- ✅ Passphrase support
- ✅ Recovery seed backup
- ✅ Firmware updates

**SDK Compatibility**:
- ✅ Node.js SDK (USB)
- ✅ Web SDK (WebUSB/Bridge)
- ❌ React Native SDK (No Bluetooth)

### OneKey Touch
- **Model ID**: `2`
- **Product Name**: OneKey Touch
- **Release Year**: 2022
- **Screen**: 240x240 Color LCD
- **Connectivity**: USB-C, Bluetooth
- **Secure Element**: Yes

**Features**:
- ✅ All cryptocurrency support
- ✅ Touch interface
- ✅ PIN protection
- ✅ Passphrase support
- ✅ Recovery seed backup
- ✅ Firmware updates
- ✅ Bluetooth connectivity

**SDK Compatibility**:
- ✅ Node.js SDK (USB/Bluetooth)
- ✅ Web SDK (WebUSB/Bridge)
- ✅ React Native SDK (Bluetooth)

### OneKey Pro
- **Model ID**: `3`
- **Product Name**: OneKey Pro
- **Release Year**: 2023
- **Screen**: 320x240 Color LCD
- **Connectivity**: USB-C, Bluetooth, NFC
- **Secure Element**: Yes

**Features**:
- ✅ All cryptocurrency support
- ✅ Advanced touch interface
- ✅ PIN protection
- ✅ Passphrase support
- ✅ Recovery seed backup
- ✅ Firmware updates
- ✅ Bluetooth connectivity
- ✅ NFC support
- ✅ Advanced security features

**SDK Compatibility**:
- ✅ Node.js SDK (USB/Bluetooth)
- ✅ Web SDK (WebUSB/Bridge)
- ✅ React Native SDK (Bluetooth/NFC)

## Device Detection

### Get Device Model

```javascript
const features = await sdk.getFeatures();
console.log('Device model:', features.model);
console.log('Model ID:', features.model_id);
console.log('Firmware version:', `${features.major_version}.${features.minor_version}.${features.patch_version}`);
```

### Model-Specific Logic

```javascript
function getDeviceCapabilities(features) {
  switch (features.model) {
    case 'OneKey Classic':
      return {
        bluetooth: false,
        nfc: false,
        touchScreen: false,
        colorDisplay: false
      };
    case 'OneKey Touch':
      return {
        bluetooth: true,
        nfc: false,
        touchScreen: true,
        colorDisplay: true
      };
    case 'OneKey Pro':
      return {
        bluetooth: true,
        nfc: true,
        touchScreen: true,
        colorDisplay: true
      };
    default:
      return {
        bluetooth: false,
        nfc: false,
        touchScreen: false,
        colorDisplay: false
      };
  }
}

// Usage
const features = await sdk.getFeatures();
const capabilities = getDeviceCapabilities(features);

if (capabilities.bluetooth) {
  console.log('Device supports Bluetooth');
}
```

## Connectivity Matrix

| Model | USB | WebUSB | Bluetooth | NFC | Bridge |
|-------|-----|--------|-----------|-----|--------|
| Classic | ✅ | ✅ | ❌ | ❌ | ✅ |
| Touch | ✅ | ✅ | ✅ | ❌ | ✅ |
| Pro | ✅ | ✅ | ✅ | ✅ | ✅ |

## Platform Compatibility

### Node.js SDK

| Model | USB/HID | Bluetooth | Bridge |
|-------|---------|-----------|--------|
| Classic | ✅ | ❌ | ✅ |
| Touch | ✅ | ✅ | ✅ |
| Pro | ✅ | ✅ | ✅ |

### Web SDK

| Model | WebUSB | Bridge | Deep Link |
|-------|--------|--------|-----------|
| Classic | ✅ | ✅ | ✅ |
| Touch | ✅ | ✅ | ✅ |
| Pro | ✅ | ✅ | ✅ |

### React Native SDK

| Model | Bluetooth | Deep Link | NFC |
|-------|-----------|-----------|-----|
| Classic | ❌ | ✅ | ❌ |
| Touch | ✅ | ✅ | ❌ |
| Pro | ✅ | ✅ | ✅ |

## Firmware Compatibility

### Minimum Firmware Versions

| Model | Minimum Version | Recommended Version |
|-------|----------------|-------------------|
| Classic | 2.0.0 | Latest |
| Touch | 3.0.0 | Latest |
| Pro | 4.0.0 | Latest |

### Check Firmware Version

```javascript
function checkFirmwareCompatibility(features) {
  const version = `${features.major_version}.${features.minor_version}.${features.patch_version}`;
  
  const minimumVersions = {
    'OneKey Classic': '2.0.0',
    'OneKey Touch': '3.0.0',
    'OneKey Pro': '4.0.0'
  };
  
  const required = minimumVersions[features.model];
  if (!required) {
    return { compatible: false, reason: 'Unknown device model' };
  }
  
  if (compareVersions(version, required) < 0) {
    return { 
      compatible: false, 
      reason: `Firmware ${version} is below minimum required ${required}` 
    };
  }
  
  return { compatible: true };
}

function compareVersions(a, b) {
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);
  
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aPart = aParts[i] || 0;
    const bPart = bParts[i] || 0;
    
    if (aPart < bPart) return -1;
    if (aPart > bPart) return 1;
  }
  
  return 0;
}
```

## Device-Specific Features

### Screen Capabilities

```javascript
function getScreenInfo(features) {
  switch (features.model) {
    case 'OneKey Classic':
      return {
        width: 128,
        height: 64,
        color: false,
        touch: false
      };
    case 'OneKey Touch':
      return {
        width: 240,
        height: 240,
        color: true,
        touch: true
      };
    case 'OneKey Pro':
      return {
        width: 320,
        height: 240,
        color: true,
        touch: true
      };
    default:
      return null;
  }
}
```

### Input Methods

```javascript
function getInputMethods(features) {
  const capabilities = getDeviceCapabilities(features);
  
  return {
    physicalButtons: true, // All models have physical buttons
    touchScreen: capabilities.touchScreen,
    pinEntry: true, // All models support PIN entry
    passphraseEntry: true // All models support passphrase
  };
}
```

## Performance Characteristics

### Transaction Signing Speed

| Model | Bitcoin TX | Ethereum TX | Complex TX |
|-------|------------|-------------|------------|
| Classic | ~3-5s | ~2-4s | ~5-10s |
| Touch | ~2-4s | ~1-3s | ~3-8s |
| Pro | ~1-3s | ~1-2s | ~2-6s |

### Address Generation Speed

| Model | Single Address | Batch (10) | Batch (100) |
|-------|----------------|------------|-------------|
| Classic | ~1s | ~8s | ~75s |
| Touch | ~0.8s | ~6s | ~55s |
| Pro | ~0.5s | ~4s | ~35s |

## Best Practices

### Device Detection
```javascript
async function initializeForDevice() {
  const features = await sdk.getFeatures();
  const capabilities = getDeviceCapabilities(features);
  
  // Adjust UI based on device capabilities
  if (capabilities.colorDisplay) {
    enableColorTheme();
  }
  
  if (capabilities.touchScreen) {
    enableTouchOptimizations();
  }
  
  // Check firmware compatibility
  const compatibility = checkFirmwareCompatibility(features);
  if (!compatibility.compatible) {
    showFirmwareUpdatePrompt(compatibility.reason);
  }
}
```

### Transport Selection
```javascript
function selectOptimalTransport(features) {
  const capabilities = getDeviceCapabilities(features);
  
  // For React Native
  if (isReactNative()) {
    if (capabilities.bluetooth) {
      return 'bluetooth';
    } else {
      return 'deeplink';
    }
  }
  
  // For Web
  if (isBrowser()) {
    if (supportsWebUSB()) {
      return 'webusb';
    } else {
      return 'bridge';
    }
  }
  
  // For Node.js
  if (capabilities.bluetooth && preferWireless()) {
    return 'bluetooth';
  } else {
    return 'usb';
  }
}
```

### User Experience Optimization
```javascript
function optimizeForDevice(features) {
  const screen = getScreenInfo(features);
  const input = getInputMethods(features);
  
  return {
    // Adjust confirmation timeouts based on input method
    confirmationTimeout: input.touchScreen ? 30000 : 60000,
    
    // Adjust UI instructions based on screen type
    useColorInstructions: screen.color,
    
    // Adjust interaction patterns
    preferTouchInteraction: input.touchScreen,
    
    // Adjust batch sizes based on performance
    maxBatchSize: features.model === 'OneKey Pro' ? 50 : 20
  };
}
```

## Troubleshooting

### Device Not Recognized
```javascript
async function diagnoseDevice() {
  try {
    const features = await sdk.getFeatures();
    console.log('Device detected:', features.model);
    
    const compatibility = checkFirmwareCompatibility(features);
    if (!compatibility.compatible) {
      console.warn('Firmware compatibility issue:', compatibility.reason);
    }
    
    return { success: true, device: features };
  } catch (error) {
    console.error('Device detection failed:', error.message);
    return { success: false, error: error.message };
  }
}
```

### Performance Issues
1. **Slow operations**: Check firmware version and update if needed
2. **Connection timeouts**: Verify transport compatibility
3. **UI responsiveness**: Optimize for device screen capabilities

### Compatibility Issues
1. **Feature not available**: Check device model capabilities
2. **Transport not working**: Verify device connectivity options
3. **Firmware errors**: Update to latest firmware version

## Migration Between Models

### Seed Compatibility
All OneKey models use the same seed format:
- BIP39 mnemonic phrases
- Compatible derivation paths
- Same encryption standards

### Data Migration
```javascript
async function migrateToNewDevice(oldFeatures, newFeatures) {
  console.log(`Migrating from ${oldFeatures.model} to ${newFeatures.model}`);
  
  // Verify seed compatibility
  const oldSeed = await getDeviceSeed(oldFeatures);
  const newSeed = await getDeviceSeed(newFeatures);
  
  if (oldSeed === newSeed) {
    console.log('✅ Devices use the same seed');
    return true;
  } else {
    console.log('❌ Different seeds detected');
    return false;
  }
}
```

## Next Steps

- [Supported Cryptocurrencies](supported-coins.md) - Available blockchain support
- [Transport Layer](../concepts/transport.md) - Connection methods
- [Device Management](../api/device.md) - Device operations
- [Best Practices](../guides/best-practices.md) - Optimization tips
