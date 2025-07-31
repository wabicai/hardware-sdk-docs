---
icon: microchip
---

# Device Management

Manage OneKey hardware devices, including connection, device information, and settings.

## searchDevices()

Search for available OneKey devices (Node.js only).

### Syntax

```javascript
await sdk.searchDevices(options?)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `options` | `Object` | No | Search options |

### Options

| Option | Type | Description |
|--------|------|-------------|
| `transport` | `string` | Transport type: `'usb'`, `'bluetooth'`, `'bridge'` |

### Returns

```typescript
Promise<Device[]>
```

### Device Object

```typescript
interface Device {
  path: string;           // Device path/identifier
  product: string;        // Product name
  vendor: string;         // Vendor name
  transport: string;      // Transport type
  connected: boolean;     // Connection status
}
```

### Example

```javascript
// Search all devices
const devices = await sdk.searchDevices();
console.log('Found devices:', devices.length);

// Search USB devices only
const usbDevices = await sdk.searchDevices({
  transport: 'usb'
});

// Connect to first device
if (devices.length > 0) {
  await sdk.connectDevice(devices[0].path);
}
```

## connectDevice()

Connect to a specific OneKey device (Node.js only).

### Syntax

```javascript
await sdk.connectDevice(path)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | Device path from searchDevices() |

### Example

```javascript
const devices = await sdk.searchDevices();
if (devices.length > 0) {
  await sdk.connectDevice(devices[0].path);
  console.log('Connected to device');
}
```

## getFeatures()

Get device information and capabilities.

### Syntax

```javascript
await sdk.getFeatures()
```

### Returns

```typescript
Promise<Features>
```

### Features Object

```typescript
interface Features {
  vendor: string;                    // Device vendor
  major_version: number;             // Firmware major version
  minor_version: number;             // Firmware minor version
  patch_version: number;             // Firmware patch version
  bootloader_mode: boolean;          // Is in bootloader mode
  device_id: string;                 // Unique device identifier
  pin_protection: boolean;           // PIN protection enabled
  passphrase_protection: boolean;    // Passphrase protection enabled
  language: string;                  // Device language
  label: string;                     // Device label/name
  initialized: boolean;              // Device is initialized
  revision: string;                  // Hardware revision
  bootloader_hash: string;           // Bootloader hash
  imported: boolean;                 // Seed was imported
  unlocked: boolean;                 // Device is unlocked
  firmware_present: boolean;         // Firmware is present
  needs_backup: boolean;             // Needs backup
  flags: number;                     // Device flags
  model: string;                     // Device model
  fw_major: number;                  // Firmware major (alternative)
  fw_minor: number;                  // Firmware minor (alternative)
  fw_patch: number;                  // Firmware patch (alternative)
  fw_vendor: string;                 // Firmware vendor
  fw_vendor_keys: string;            // Firmware vendor keys
  unfinished_backup: boolean;        // Has unfinished backup
  no_backup: boolean;                // No backup performed
}
```

### Example

```javascript
const features = await sdk.getFeatures();

console.log('Device Info:');
console.log(`Model: ${features.model}`);
console.log(`Firmware: ${features.major_version}.${features.minor_version}.${features.patch_version}`);
console.log(`Label: ${features.label}`);
console.log(`PIN Protection: ${features.pin_protection}`);
console.log(`Initialized: ${features.initialized}`);
```

## disconnect()

Disconnect from the current device (Node.js only).

### Syntax

```javascript
await sdk.disconnect()
```

### Example

```javascript
await sdk.disconnect();
console.log('Device disconnected');
```

## Device Events

Listen for device state changes.

### Event Types

| Event | Description | Platforms |
|-------|-------------|-----------|
| `device-connect` | Device connected | Node.js |
| `device-disconnect` | Device disconnected | Node.js |
| `device-changed` | Device state changed | All |
| `ui-request_pin` | PIN input required | All |
| `ui-request_passphrase` | Passphrase input required | All |
| `ui-request_button` | Button press required | All |

### Example

```javascript
// Device connection events
sdk.on('device-connect', (device) => {
  console.log('Device connected:', device.path);
});

sdk.on('device-disconnect', (device) => {
  console.log('Device disconnected:', device.path);
});

// User interaction events
sdk.on('ui-request_pin', () => {
  console.log('Please enter PIN on device');
});

sdk.on('ui-request_passphrase', () => {
  console.log('Please enter passphrase');
});

sdk.on('ui-request_button', () => {
  console.log('Please confirm on device');
});
```

## Device Settings

### changePin()

Change device PIN.

```javascript
const result = await sdk.changePin({
  remove: false // Set to true to remove PIN
});

if (result.success) {
  console.log('PIN changed successfully');
}
```

### changeLabel()

Change device label/name.

```javascript
const result = await sdk.changeLabel({
  label: 'My OneKey Device'
});

if (result.success) {
  console.log('Label changed successfully');
}
```

### enablePassphrase()

Enable or disable passphrase protection.

```javascript
const result = await sdk.enablePassphrase({
  enabled: true
});

if (result.success) {
  console.log('Passphrase protection enabled');
}
```

## Firmware Management

### checkFirmware()

Check for firmware updates.

```javascript
const result = await sdk.checkFirmware();

if (result.success) {
  const { current, latest, updateAvailable } = result.payload;
  
  console.log(`Current firmware: ${current}`);
  console.log(`Latest firmware: ${latest}`);
  console.log(`Update available: ${updateAvailable}`);
}
```

### updateFirmware()

Update device firmware.

```javascript
// Check for updates first
const check = await sdk.checkFirmware();

if (check.success && check.payload.updateAvailable) {
  const result = await sdk.updateFirmware();
  
  if (result.success) {
    console.log('Firmware update completed');
  }
}
```

## Device Verification

### verifyDevice()

Verify device authenticity.

```javascript
const result = await sdk.verifyDevice();

if (result.success) {
  console.log('Device verification:', result.payload.verified ? 'PASSED' : 'FAILED');
}
```

## Error Handling

```javascript
try {
  const devices = await sdk.searchDevices();
  
  if (devices.length === 0) {
    throw new Error('No devices found');
  }
  
  await sdk.connectDevice(devices[0].path);
  const features = await sdk.getFeatures();
  
  console.log('Connected to:', features.model);
  
} catch (error) {
  switch (error.code) {
    case 'Device_NotFound':
      console.error('No OneKey device found. Please connect your device.');
      break;
    case 'Device_Disconnected':
      console.error('Device was disconnected. Please reconnect.');
      break;
    case 'Device_Busy':
      console.error('Device is busy. Please wait and try again.');
      break;
    case 'Permission_Denied':
      console.error('Permission denied. Check device permissions.');
      break;
    case 'Transport_Missing':
      console.error('Transport not available. Install OneKey Bridge.');
      break;
    default:
      console.error('Device error:', error.message);
  }
}
```

## Best Practices

### Connection Management
- Always search for devices before connecting
- Handle device disconnection gracefully
- Implement reconnection logic for critical applications

### User Experience
- Show clear device status indicators
- Provide helpful error messages
- Guide users through device setup

### Security
- Verify device authenticity when possible
- Encourage users to enable PIN protection
- Validate device state before operations

### Performance
- Cache device features to avoid repeated calls
- Use event listeners for real-time status updates
- Implement proper cleanup on application exit

## Complete Example

```javascript
class OneKeyDeviceManager {
  constructor() {
    this.sdk = new OneKeySDK({
      manifest: {
        email: 'developer@yourapp.com',
        appName: 'Device Manager',
        appUrl: 'https://yourapp.com'
      }
    });
    
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    this.sdk.on('device-connect', (device) => {
      console.log('✅ Device connected:', device.path);
    });
    
    this.sdk.on('device-disconnect', () => {
      console.log('❌ Device disconnected');
    });
    
    this.sdk.on('ui-request_pin', () => {
      console.log('🔢 Please enter PIN on device');
    });
  }
  
  async initialize() {
    try {
      const devices = await this.sdk.searchDevices();
      
      if (devices.length === 0) {
        throw new Error('No devices found');
      }
      
      console.log(`Found ${devices.length} device(s)`);
      
      // Connect to first device
      await this.sdk.connectDevice(devices[0].path);
      
      // Get device info
      const features = await this.sdk.getFeatures();
      
      console.log('Device Info:');
      console.log(`  Model: ${features.model}`);
      console.log(`  Firmware: ${features.major_version}.${features.minor_version}.${features.patch_version}`);
      console.log(`  Label: ${features.label}`);
      console.log(`  PIN Protected: ${features.pin_protection}`);
      
      return features;
      
    } catch (error) {
      console.error('Initialization failed:', error.message);
      throw error;
    }
  }
  
  async cleanup() {
    try {
      await this.sdk.disconnect();
      console.log('Device manager cleaned up');
    } catch (error) {
      console.error('Cleanup error:', error.message);
    }
  }
}

// Usage
const deviceManager = new OneKeyDeviceManager();
await deviceManager.initialize();

// Cleanup on exit
process.on('exit', () => {
  deviceManager.cleanup();
});
```

## Next Steps

- [Bitcoin Methods](bitcoin.md) - Bitcoin-specific operations
- [Ethereum Methods](ethereum.md) - Ethereum-specific operations
- [Transport Layer](../concepts/transport.md) - Understanding transport options
- [Error Handling](../concepts/errors.md) - Comprehensive error management
