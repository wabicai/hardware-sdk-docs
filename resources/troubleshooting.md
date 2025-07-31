---
icon: bug
---

# Troubleshooting

Common issues and solutions when working with OneKey Hardware SDK.

## Connection Issues

### Device Not Found

**Problem:** `searchDevices()` returns empty array or "Device not found" error.

**Solutions:**

1. **Check Physical Connection**
   ```javascript
   // Ensure device is properly connected
   const devices = await HardwareSDK.searchDevices();
   console.log('Found devices:', devices.length);
   ```

2. **Verify Device State**
   - Ensure device is unlocked
   - Check if device is in bootloader mode
   - Try different USB cable/port

3. **Platform-Specific Fixes**

   **Web Browser:**
   ```javascript
   // Check WebUSB support
   if (!navigator.usb) {
     console.error('WebUSB not supported');
   }
   
   // Ensure HTTPS connection
   if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
     console.error('WebUSB requires HTTPS');
   }
   ```

   **Node.js/Electron:**
   ```bash
   # Linux: Set up udev rules
   sudo nano /etc/udev/rules.d/51-onekey.rules
   
   # Add these lines:
   SUBSYSTEM=="usb", ATTR{idVendor}=="1209", ATTR{idProduct}=="53c1", MODE="0666", GROUP="plugdev"
   SUBSYSTEM=="usb", ATTR{idVendor}=="1209", ATTR{idProduct}=="53c0", MODE="0666", GROUP="plugdev"
   
   # Reload rules
   sudo udevadm control --reload-rules
   sudo udevadm trigger
   ```

   **React Native:**
   ```javascript
   // Check Bluetooth permissions
   import { PermissionsAndroid } from 'react-native';
   
   const requestPermissions = async () => {
     const permissions = [
       PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
       PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
     ];
     
     await PermissionsAndroid.requestMultiple(permissions);
   };
   ```

### Connection Timeout

**Problem:** Device connection times out or fails intermittently.

**Solutions:**

1. **Increase Timeout**
   ```javascript
   await HardwareSDK.init({
     connectTimeout: 30000, // 30 seconds
     manifest: { /* ... */ }
   });
   ```

2. **Retry Logic**
   ```javascript
   const connectWithRetry = async (maxRetries = 3) => {
     for (let i = 0; i < maxRetries; i++) {
       try {
         const devices = await HardwareSDK.searchDevices();
         if (devices.length > 0) {
           await HardwareSDK.connectDevice(devices[0].path);
           return devices[0];
         }
       } catch (error) {
         console.log(`Attempt ${i + 1} failed:`, error.message);
         if (i === maxRetries - 1) throw error;
         await new Promise(resolve => setTimeout(resolve, 2000));
       }
     }
   };
   ```

### Transport Errors

**Problem:** Transport layer errors or communication failures.

**Solutions:**

1. **Check Transport Configuration**
   ```javascript
   // Try different transport methods
   const transports = ['usb', 'bridge', 'webusb'];
   
   for (const transport of transports) {
     try {
       await HardwareSDK.init({
         transport: { type: transport },
         manifest: { /* ... */ }
       });
       break;
     } catch (error) {
       console.log(`${transport} failed:`, error.message);
     }
   }
   ```

2. **Bridge Issues**
   ```javascript
   // Check if OneKey Bridge is running
   const checkBridge = async () => {
     try {
       const response = await fetch('http://localhost:21325/');
       const status = await response.json();
       console.log('Bridge version:', status.version);
       return true;
     } catch (error) {
       console.error('Bridge not running');
       return false;
     }
   };
   ```

## Permission Issues

### WebUSB Permissions

**Problem:** Browser doesn't show device permission dialog.

**Solutions:**

1. **User Gesture Requirement**
   ```javascript
   // Must be called from user interaction
   document.getElementById('connect-btn').addEventListener('click', async () => {
     try {
       const devices = await HardwareSDK.searchDevices();
     } catch (error) {
       console.error('Permission denied:', error);
     }
   });
   ```

2. **Check Browser Support**
   ```javascript
   const checkWebUSBSupport = () => {
     if (!navigator.usb) {
       alert('WebUSB not supported. Please use Chrome, Edge, or Opera.');
       return false;
     }
     return true;
   };
   ```

### Bluetooth Permissions

**Problem:** Bluetooth permissions denied on mobile.

**Solutions:**

1. **Request Permissions Properly**
   ```javascript
   // React Native
   import { PermissionsAndroid, Platform } from 'react-native';
   
   const requestBluetoothPermissions = async () => {
     if (Platform.OS === 'android') {
       const granted = await PermissionsAndroid.requestMultiple([
         PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
         PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
       ]);
       
       return Object.values(granted).every(
         permission => permission === PermissionsAndroid.RESULTS.GRANTED
       );
     }
     return true;
   };
   ```

2. **Handle Permission Denial**
   ```javascript
   const handlePermissionDenial = () => {
     Alert.alert(
       'Permissions Required',
       'Bluetooth permissions are required to connect to OneKey device.',
       [
         { text: 'Cancel', style: 'cancel' },
         { text: 'Settings', onPress: () => Linking.openSettings() }
       ]
     );
   };
   ```

## SDK Initialization Issues

### Initialization Failures

**Problem:** SDK fails to initialize or throws errors during setup.

**Solutions:**

1. **Check Manifest Configuration**
   ```javascript
   // Ensure all required fields are provided
   await HardwareSDK.init({
     debug: true, // Enable for debugging
     manifest: {
       email: 'developer@yourapp.com', // Required
       appName: 'Your App Name',       // Required
       appUrl: 'https://yourapp.com'   // Required
     }
   });
   ```

2. **Environment-Specific Issues**
   ```javascript
   // Web: Check connectSrc
   await HardwareSDK.init({
     connectSrc: 'https://jssdk.onekey.so/', // Required for web
     manifest: { /* ... */ }
   });
   
   // React Native: Check deep link setup
   await HardwareSDK.init({
     deeplinkOpen: (url) => Linking.openURL(url),
     deeplinkCallbackUrl: 'yourapp://onekey-callback',
     manifest: { /* ... */ }
   });
   ```

### Multiple Initialization

**Problem:** SDK initialized multiple times causing conflicts.

**Solutions:**

1. **Singleton Pattern**
   ```javascript
   class OneKeyManager {
     constructor() {
       this.initialized = false;
     }
     
     async init() {
       if (this.initialized) return;
       
       await HardwareSDK.init({
         manifest: { /* ... */ }
       });
       
       this.initialized = true;
     }
   }
   
   const oneKeyManager = new OneKeyManager();
   ```

2. **Proper Cleanup**
   ```javascript
   // Clean up before re-initialization
   await HardwareSDK.dispose();
   await HardwareSDK.init({ /* ... */ });
   ```

## Operation Errors

### User Cancellation

**Problem:** User cancels operation on device.

**Solutions:**

1. **Handle Cancellation Gracefully**
   ```javascript
   try {
     const result = await HardwareSDK.btcGetAddress({
       path: "m/44'/0'/0'/0/0",
       showOnDevice: true,
       coin: 'btc'
     });
   } catch (error) {
     if (error.message.includes('cancelled')) {
       console.log('User cancelled operation');
       // Show user-friendly message
     }
   }
   ```

2. **Provide Clear Instructions**
   ```javascript
   // Show instruction before operation
   const showInstruction = (message) => {
     alert(`Please ${message} on your OneKey device`);
   };
   
   HardwareSDK.on('ui-button', () => {
     showInstruction('confirm the action');
   });
   ```

### Invalid Parameters

**Problem:** API calls fail due to invalid parameters.

**Solutions:**

1. **Validate Inputs**
   ```javascript
   const validatePath = (path) => {
     const pathRegex = /^m(\/\d+'?)*$/;
     if (!pathRegex.test(path)) {
       throw new Error('Invalid derivation path');
     }
   };
   
   const validateAddress = (address, type = 'bitcoin') => {
     if (type === 'bitcoin') {
       const btcRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
       if (!btcRegex.test(address)) {
         throw new Error('Invalid Bitcoin address');
       }
     }
   };
   ```

2. **Use Type Checking**
   ```javascript
   const safeApiCall = async (method, params) => {
     // Validate required parameters
     if (!params.path) {
       throw new Error('Path is required');
     }
     
     if (typeof params.showOnDevice !== 'boolean') {
       params.showOnDevice = false;
     }
     
     return await method(params);
   };
   ```

## Performance Issues

### Slow Operations

**Problem:** API calls take too long to complete.

**Solutions:**

1. **Optimize Batch Operations**
   ```javascript
   // Instead of multiple individual calls
   const addresses = [];
   for (let i = 0; i < 10; i++) {
     const result = await HardwareSDK.btcGetAddress({
       path: `m/44'/0'/0'/0/${i}`,
       coin: 'btc'
     });
     addresses.push(result.payload.address);
   }
   
   // Use bundle operations when available
   const result = await HardwareSDK.btcGetAddress({
     bundle: Array.from({ length: 10 }, (_, i) => ({
       path: `m/44'/0'/0'/0/${i}`,
       showOnDevice: false
     })),
     coin: 'btc'
   });
   ```

2. **Connection Pooling**
   ```javascript
   class ConnectionPool {
     constructor() {
       this.connections = new Map();
     }
     
     async getConnection(devicePath) {
       if (!this.connections.has(devicePath)) {
         await HardwareSDK.connectDevice(devicePath);
         this.connections.set(devicePath, Date.now());
       }
       return devicePath;
     }
   }
   ```

### Memory Leaks

**Problem:** Memory usage increases over time.

**Solutions:**

1. **Proper Event Cleanup**
   ```javascript
   class EventManager {
     constructor() {
       this.listeners = [];
     }
     
     addListener(event, handler) {
       HardwareSDK.on(event, handler);
       this.listeners.push({ event, handler });
     }
     
     cleanup() {
       this.listeners.forEach(({ event, handler }) => {
         HardwareSDK.off(event, handler);
       });
       this.listeners = [];
     }
   }
   ```

2. **Dispose Resources**
   ```javascript
   // Clean up when done
   window.addEventListener('beforeunload', async () => {
     await HardwareSDK.dispose();
   });
   ```

## Debugging Tips

### Enable Debug Mode

```javascript
await HardwareSDK.init({
  debug: true,
  logLevel: 'debug',
  manifest: { /* ... */ }
});

// Monitor debug events
HardwareSDK.on('transport-debug', (event) => {
  console.log('Transport debug:', event);
});
```

### Network Debugging

```javascript
// Monitor network requests (web only)
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('Fetch request:', args);
  return originalFetch.apply(this, args);
};
```

### Device State Debugging

```javascript
const debugDeviceState = async () => {
  try {
    const features = await HardwareSDK.getFeatures();
    console.log('Device features:', features);
    
    const devices = await HardwareSDK.searchDevices();
    console.log('Available devices:', devices);
  } catch (error) {
    console.error('Debug failed:', error);
  }
};
```

## Getting Help

### Community Support

- **GitHub Issues**: [OneKey Hardware SDK Issues](https://github.com/OneKeyHQ/hardware-js-sdk/issues)
- **Discord**: [OneKey Community](https://discord.gg/onekey)
- **Documentation**: [OneKey Docs](https://developer.onekey.so/)

### Reporting Bugs

When reporting issues, please include:

1. **Environment Information**
   - Platform (Web/Node.js/React Native)
   - Browser/Node.js version
   - Operating system
   - Device model and firmware version

2. **Code Sample**
   ```javascript
   // Minimal reproducible example
   const result = await HardwareSDK.btcGetAddress({
     path: "m/44'/0'/0'/0/0",
     coin: 'btc'
   });
   ```

3. **Error Details**
   - Full error message
   - Stack trace
   - Console logs with debug enabled

4. **Steps to Reproduce**
   - Clear step-by-step instructions
   - Expected vs actual behavior

## Next Steps

- [FAQ](faq.md) - Frequently asked questions
- [Device Models](device-models.md) - Supported device information
- [Migration Guide](migration.md) - Upgrading from older versions
- [API Reference](../api/device.md) - Complete API documentation
