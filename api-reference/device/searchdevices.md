# searchDevices

## Search for connected devices

Search for connected OneKey hardware devices and return their information.

```typescript
const result = await HardwareSDK.searchDevices();
```

## Params

This method takes no parameters.

## Example

Search for all connected devices:

```typescript
const devices = await HardwareSDK.searchDevices();

if (devices.success) {
    console.log('Found devices:', devices.payload);
    
    devices.payload.forEach(device => {
        console.log(`Device: ${device.label} (${device.deviceType})`);
        console.log(`Connect ID: ${device.connectId}`);
        console.log(`Device ID: ${device.deviceId}`);
    });
} else {
    console.error('Failed to search devices:', devices.payload.error);
}
```

## Result

```typescript
{
    success: true,
    payload: Array<{
        connectId: string,          // unique connection identifier
        deviceId: string,           // device identifier
        deviceType: string,         // device model (e.g., "classic", "mini", "touch")
        label: string,              // device label/name
        bleName?: string,           // Bluetooth name (if applicable)
        name?: string,              // device name
        features: {
            vendor: string,         // "onekey.so"
            model: string,          // device model
            deviceId: string,       // device ID
            firmwareVersion: string, // firmware version
            bootloaderVersion: string, // bootloader version
            pinProtection: boolean,  // PIN protection status
            passphraseProtection: boolean, // passphrase protection status
            initialized: boolean,    // device initialization status
            needsBackup: boolean,    // backup needed status
            unfinishedBackup: boolean, // unfinished backup status
            noBackup: boolean,       // no backup status
            recoveryMode: boolean,   // recovery mode status
            capabilities: Array<string>, // device capabilities
            supportedCoins: Array<object> // supported cryptocurrencies
        }
    }>
}
```

Error

```typescript
{
    success: false,
    payload: {
        error: string, // error message
        code: number // error code
    }
}
```

## Device Types

OneKey supports multiple device models:

### OneKey Classic
```typescript
{
    deviceType: "classic",
    model: "1",
    // Classic device features
}
```

### OneKey Mini
```typescript
{
    deviceType: "mini", 
    model: "mini",
    // Mini device features
}
```

### OneKey Touch
```typescript
{
    deviceType: "touch",
    model: "touch",
    // Touch device features
}
```

## Use Cases

### Device Discovery
```typescript
// Find and list all connected devices
const discoverDevices = async () => {
    const result = await HardwareSDK.searchDevices();
    
    if (result.success) {
        const devices = result.payload;
        
        if (devices.length === 0) {
            console.log('No devices found. Please connect a OneKey device.');
            return [];
        }
        
        return devices.map(device => ({
            id: device.connectId,
            name: device.label || `OneKey ${device.deviceType}`,
            model: device.deviceType,
            firmware: device.features.firmwareVersion,
            initialized: device.features.initialized,
            needsSetup: !device.features.initialized || device.features.needsBackup
        }));
    }
    
    throw new Error(result.payload.error);
};
```

### Device Selection
```typescript
// Let user select from multiple devices
const selectDevice = async () => {
    const devices = await discoverDevices();
    
    if (devices.length === 1) {
        return devices[0];
    }
    
    // Multiple devices found - let user choose
    console.log('Multiple devices found:');
    devices.forEach((device, index) => {
        console.log(`${index + 1}. ${device.name} (${device.model})`);
    });
    
    // In a real app, show UI for selection
    const selectedIndex = 0; // User selection
    return devices[selectedIndex];
};
```

### Device Health Check
```typescript
// Check device status and requirements
const checkDeviceHealth = async () => {
    const result = await HardwareSDK.searchDevices();
    
    if (!result.success) {
        return { status: 'error', message: result.payload.error };
    }
    
    const devices = result.payload;
    
    if (devices.length === 0) {
        return { 
            status: 'no_device', 
            message: 'No OneKey device found. Please connect your device.' 
        };
    }
    
    const device = devices[0];
    const features = device.features;
    
    // Check device status
    if (!features.initialized) {
        return { 
            status: 'not_initialized', 
            message: 'Device needs to be initialized first.' 
        };
    }
    
    if (features.needsBackup) {
        return { 
            status: 'needs_backup', 
            message: 'Device needs backup. Please backup your recovery phrase.' 
        };
    }
    
    if (features.unfinishedBackup) {
        return { 
            status: 'unfinished_backup', 
            message: 'Device has unfinished backup. Please complete the backup process.' 
        };
    }
    
    return { 
        status: 'ready', 
        message: 'Device is ready to use.',
        device: {
            model: device.deviceType,
            firmware: features.firmwareVersion,
            label: device.label
        }
    };
};
```

### Firmware Version Check
```typescript
// Check if firmware update is needed
const checkFirmwareVersion = async () => {
    const result = await HardwareSDK.searchDevices();
    
    if (result.success && result.payload.length > 0) {
        const device = result.payload[0];
        const currentVersion = device.features.firmwareVersion;
        
        // Compare with minimum required version
        const minRequiredVersion = "2.0.0";
        
        if (compareVersions(currentVersion, minRequiredVersion) < 0) {
            return {
                updateRequired: true,
                currentVersion,
                minRequiredVersion,
                message: 'Firmware update required for full compatibility.'
            };
        }
        
        return {
            updateRequired: false,
            currentVersion,
            message: 'Firmware is up to date.'
        };
    }
    
    throw new Error('No device found');
};

const compareVersions = (version1, version2) => {
    const v1parts = version1.split('.').map(Number);
    const v2parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
        const v1part = v1parts[i] || 0;
        const v2part = v2parts[i] || 0;
        
        if (v1part < v2part) return -1;
        if (v1part > v2part) return 1;
    }
    
    return 0;
};
```

### Connection Monitoring
```typescript
// Monitor device connection status
const monitorDeviceConnection = async (callback) => {
    let lastDeviceCount = 0;
    
    const checkConnection = async () => {
        try {
            const result = await HardwareSDK.searchDevices();
            
            if (result.success) {
                const currentDeviceCount = result.payload.length;
                
                if (currentDeviceCount !== lastDeviceCount) {
                    lastDeviceCount = currentDeviceCount;
                    
                    if (currentDeviceCount === 0) {
                        callback({ status: 'disconnected', devices: [] });
                    } else {
                        callback({ 
                            status: 'connected', 
                            devices: result.payload,
                            count: currentDeviceCount
                        });
                    }
                }
            }
        } catch (error) {
            callback({ status: 'error', error: error.message });
        }
    };
    
    // Check immediately
    await checkConnection();
    
    // Check periodically
    const interval = setInterval(checkConnection, 2000);
    
    // Return cleanup function
    return () => clearInterval(interval);
};
```

## Error Handling

Common search errors:

- **Transport not available**: WebUSB or Bridge not available
- **Permission denied**: User denied device access
- **Device busy**: Device is being used by another application
- **Driver issues**: USB driver problems on Windows/Linux

```typescript
const handleSearchError = (error) => {
    switch (error.code) {
        case 'Transport_Missing':
            return 'Please install OneKey Bridge or use a supported browser';
        case 'Transport_Permission':
            return 'Please allow device access when prompted';
        case 'Device_Busy':
            return 'Device is busy. Please close other applications using the device';
        default:
            return `Device search failed: ${error.error}`;
    }
};
```

## Best Practices

1. **Call before other operations** to ensure device availability
2. **Handle multiple devices** gracefully with user selection
3. **Check device status** before proceeding with operations
4. **Monitor connection** for better user experience
5. **Provide clear error messages** for connection issues
6. **Cache device information** to avoid repeated searches

## Related Methods

- [getFeatures](getfeatures.md) - Get detailed device features
- [deviceSettings](devicesettings.md) - Configure device settings
