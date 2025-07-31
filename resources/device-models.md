---
icon: microchip
---

# Device Models

Information about supported OneKey hardware wallet models and their capabilities.

## Overview

OneKey produces several hardware wallet models, each designed for different user needs and security requirements. This page provides detailed information about each model and their compatibility with the OneKey SDK.

## Supported Models

### OneKey Classic 1S

**The flagship hardware wallet with premium security features**

#### Specifications
- **Display**: 1.54" color IPS screen (240×240)
- **Connectivity**: USB-C
- **Security**: Secure Element (CC EAL6+)
- **Processor**: ARM Cortex-M4
- **Storage**: 512KB Flash
- **Dimensions**: 64×39×9.6mm
- **Weight**: 30g

#### Features
- ✅ Hardware-based random number generation
- ✅ PIN protection with anti-tampering
- ✅ Recovery seed backup (12/18/24 words)
- ✅ Passphrase support (BIP39)
- ✅ Multi-signature support
- ✅ U2F/FIDO2 authentication
- ✅ Open source firmware

#### SDK Compatibility
```javascript
// Detect OneKey Classic 1S
const devices = await HardwareSDK.searchDevices();
const classic = devices.find(d => d.features.model === 'T');

if (classic) {
  console.log('OneKey Classic 1S detected');
  console.log('Firmware:', classic.features.major_version + '.' + classic.features.minor_version);
}
```

### OneKey Mini

**Ultra-portable hardware wallet for mobile users**

#### Specifications
- **Display**: None (uses companion app)
- **Connectivity**: USB-C, Bluetooth 5.0
- **Security**: Secure Element (CC EAL5+)
- **Processor**: ARM Cortex-M0+
- **Battery**: 200mAh rechargeable
- **Dimensions**: 85×54×2.4mm (credit card size)
- **Weight**: 12g

#### Features
- ✅ Bluetooth Low Energy connectivity
- ✅ NFC support (planned)
- ✅ Companion mobile app
- ✅ Ultra-portable design
- ✅ Touch-sensitive buttons
- ✅ Wireless charging (planned)
- ✅ IP54 water resistance

#### SDK Compatibility
```javascript
// Detect OneKey Mini
const devices = await HardwareSDK.searchDevices();
const mini = devices.find(d => d.features.model === 'mini');

if (mini) {
  console.log('OneKey Mini detected');

  // Check battery status
  const battery = await HardwareSDK.getBatteryStatus();
  console.log('Battery level:', battery.percentage + '%');
}
```

### OneKey Touch

**Next-generation hardware wallet with full Android OS**

#### Specifications
- **Display**: 4" color touchscreen (480×800)
- **Connectivity**: USB-C, Bluetooth 5.0, WiFi 6
- **Security**: Secure Element + TEE
- **Processor**: ARM Cortex-A55 Quad-core
- **Storage**: 64GB internal + microSD
- **RAM**: 4GB
- **Battery**: 3000mAh
- **OS**: OneKey OS (Android-based)

#### Features
- ✅ Full-featured crypto wallet
- ✅ DApp browser with Web3 support
- ✅ NFT gallery and marketplace
- ✅ Multi-account management
- ✅ Air-gapped transactions
- ✅ Camera for QR codes
- ✅ Fingerprint authentication
- ✅ App ecosystem

#### SDK Compatibility
```javascript
// Detect OneKey Touch
const devices = await HardwareSDK.searchDevices();
const touch = devices.find(d => d.features.model === 'touch');

if (touch) {
  console.log('OneKey Touch detected');

  // Check WiFi status
  const wifi = await HardwareSDK.getWiFiStatus();
  console.log('WiFi connected:', wifi.connected);
}
```

## Feature Comparison

| Feature | Classic 1S | Mini | Touch |
|---------|------------|------|-------|
| **Display** | 1.54" Color IPS | None | 4" Color Touch |
| **Connectivity** | USB-C | USB-C, BLE | USB-C, BLE, WiFi |
| **Battery** | None | 200mAh | 3000mAh |
| **Secure Element** | CC EAL6+ | CC EAL5+ | CC EAL5+ + TEE |
| **Open Source** | ✅ | ✅ | ✅ |
| **Mobile App** | Optional | Required | Built-in |
| **DApp Browser** | ❌ | ❌ | ✅ |
| **Camera** | ❌ | ❌ | ✅ |
| **Fingerprint** | ❌ | ❌ | ✅ |
| **Price Range** | $79 | $39 | $199 |

## SDK Support Matrix

### Connection Methods

| Model | USB | Bluetooth | WebUSB | HTTP Bridge | Deep Link |
|-------|-----|-----------|--------|-------------|-----------|
| Classic 1S | ✅ | ❌ | ✅ | ✅ | ❌ |
| Mini | ✅ | ✅ | ✅ | ✅ | ✅ |
| Touch | ✅ | ✅ | ✅ | ✅ | ✅ |

### Platform Support

| Model | Web Browser | Node.js | React Native | Electron |
|-------|-------------|---------|--------------|----------|
| Classic 1S | ✅ | ✅ | ❌ | ✅ |
| Mini | ✅ | ✅ | ✅ | ✅ |
| Touch | ✅ | ✅ | ✅ | ✅ |

### Blockchain Support

| Model | Bitcoin | Ethereum | Solana | Cardano | Polkadot | Cosmos |
|-------|---------|----------|---------|---------|----------|---------|
| Classic 1S | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Mini | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Touch | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## Device Detection and Management

### Automatic Device Detection

```javascript
// Search for all connected OneKey devices
const searchDevices = async () => {
  try {
    const devices = await HardwareSDK.searchDevices();

    devices.forEach(device => {
      console.log(`Found: ${getModelName(device.features.model)}`);
      console.log(`Path: ${device.path}`);
      console.log(`Firmware: ${device.features.major_version}.${device.features.minor_version}.${device.features.patch_version}`);
      console.log(`Bootloader: ${device.features.bootloader_mode ? 'Yes' : 'No'}`);
    });

    return devices;
  } catch (error) {
    console.error('Device search failed:', error);
    return [];
  }
};

// Helper function to get model name
const getModelName = (model) => {
  const modelNames = {
    'T': 'OneKey Classic 1S',
    'mini': 'OneKey Mini',
    'touch': 'OneKey Touch'
  };
  return modelNames[model] || 'Unknown Model';
};
```

### Device Connection

```javascript
// Connect to a specific device
const connectDevice = async (devicePath) => {
  try {
    await HardwareSDK.connectDevice(devicePath);

    // Get device features
    const features = await HardwareSDK.getFeatures();
    console.log('Connected to:', getModelName(features.model));

    return features;
  } catch (error) {
    console.error('Connection failed:', error);
    throw error;
  }
};

// Disconnect device
const disconnectDevice = async () => {
  try {
    await HardwareSDK.disconnectDevice();
    console.log('Device disconnected');
  } catch (error) {
    console.error('Disconnect failed:', error);
  }
};
```

### Model-Specific Handling

```javascript
// Handle different models with specific logic
const handleDeviceByModel = async (device) => {
  const model = device.features.model;

  switch (model) {
    case 'T': // OneKey Classic 1S
      return await handleClassic(device);

    case 'mini': // OneKey Mini
      return await handleMini(device);

    case 'touch': // OneKey Touch
      return await handleTouch(device);

    default:
      throw new Error(`Unsupported model: ${model}`);
  }
};

// Classic 1S specific handling
const handleClassic = async (device) => {
  console.log('Handling OneKey Classic 1S');

  // Classic has a display, can show addresses
  const result = await HardwareSDK.btcGetAddress({
    path: "m/44'/0'/0'/0/0",
    showOnDevice: true, // Show on device screen
    coin: 'btc'
  });

  return result;
};

// Mini specific handling
const handleMini = async (device) => {
  console.log('Handling OneKey Mini');

  // Mini has no display, use companion app
  const result = await HardwareSDK.btcGetAddress({
    path: "m/44'/0'/0'/0/0",
    showOnDevice: false, // Cannot show on device
    coin: 'btc'
  });

  // Check battery if available
  try {
    const battery = await HardwareSDK.getBatteryStatus();
    console.log('Battery level:', battery.percentage + '%');
  } catch (error) {
    console.log('Battery status not available');
  }

  return result;
};

// Touch specific handling
const handleTouch = async (device) => {
  console.log('Handling OneKey Touch');

  // Touch has advanced features
  const result = await HardwareSDK.btcGetAddress({
    path: "m/44'/0'/0'/0/0",
    showOnDevice: true, // Show on touchscreen
    coin: 'btc'
  });

  // Check additional Touch features
  try {
    const wifi = await HardwareSDK.getWiFiStatus();
    console.log('WiFi status:', wifi.connected ? 'Connected' : 'Disconnected');

    const apps = await HardwareSDK.getInstalledApps();
    console.log('Installed apps:', apps.length);
  } catch (error) {
    console.log('Advanced features not available');
  }

  return result;
};
```

## Firmware Management

### Checking Firmware Version

```javascript
// Get current firmware information
const getFirmwareInfo = async () => {
  try {
    const features = await HardwareSDK.getFeatures();

    const firmwareInfo = {
      model: getModelName(features.model),
      version: `${features.major_version}.${features.minor_version}.${features.patch_version}`,
      bootloaderMode: features.bootloader_mode,
      firmwarePresent: features.firmware_present,
      needsBackup: features.needs_backup,
      unfinishedBackup: features.unfinished_backup,
      noBackup: features.no_backup
    };

    console.log('Firmware Info:', firmwareInfo);
    return firmwareInfo;
  } catch (error) {
    console.error('Failed to get firmware info:', error);
    throw error;
  }
};
```

### Checking for Updates

```javascript
// Check for firmware updates
const checkFirmwareUpdate = async () => {
  try {
    const updateInfo = await HardwareSDK.checkFirmwareRelease();

    if (updateInfo.required) {
      console.log('Firmware update required');
      console.log('Current:', updateInfo.current);
      console.log('Latest:', updateInfo.latest);
      console.log('Download URL:', updateInfo.url);
    } else {
      console.log('Firmware is up to date');
    }

    return updateInfo;
  } catch (error) {
    console.error('Failed to check firmware update:', error);
    throw error;
  }
};
```

## Next Steps

- [Supported Coins](supported-coins.md) - Complete list of supported cryptocurrencies
- [Troubleshooting](troubleshooting.md) - Common issues and solutions
- [API Reference](../api/device.md) - Device management API
- [Integration Guides](../integration/web-browser.md) - Platform-specific guides