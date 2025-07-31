---
icon: terminal
---

# Node.js SDK

The OneKey Node.js SDK (`@onekeyfe/hd-common-connect-sdk`) provides full hardware wallet integration for Node.js applications, desktop apps, and CLI tools with direct USB communication and HTTP Bridge support.

## Overview

The Node.js SDK is designed for server-side and desktop environments and provides:

- **Direct USB/HID Communication** - No browser limitations
- **HTTP Bridge Support** - Connect through OneKey Bridge
- **Full Filesystem Access** - Complete Node.js capabilities
- **Cross-Platform Support** - Windows, macOS, Linux

## Installation

```bash
npm install @onekeyfe/hd-common-connect-sdk
# or
yarn add @onekeyfe/hd-common-connect-sdk
```

### System Requirements

- Node.js 14+ or Electron 10+
- USB access permissions
- OneKey Bridge (optional, for HTTP transport)

## Basic Setup

### CommonJS

```javascript
const { HardwareSDK } = require('@onekeyfe/hd-common-connect-sdk');

async function initialize() {
    await HardwareSDK.init({
        debug: false,
        manifest: {
            email: 'developer@yourapp.com',
            appName: 'Your Node.js App',
            appUrl: 'https://yourapp.com'
        }
    });
}
```

### ES6 Modules

```javascript
import { HardwareSDK } from '@onekeyfe/hd-common-connect-sdk';

await HardwareSDK.init({
    debug: false,
    manifest: {
        email: 'developer@yourapp.com',
        appName: 'Your Node.js App',
        appUrl: 'https://yourapp.com'
    }
});
```

## Configuration Options

### Basic Configuration

```javascript
await HardwareSDK.init({
    // Debug mode
    debug: process.env.NODE_ENV === 'development',
    
    // Application manifest
    manifest: {
        email: 'developer@yourapp.com',
        appName: 'Your Application',
        appUrl: 'https://yourapp.com'
    },
    
    // Transport settings
    transportReconnect: true,
    pendingTransportEvent: true
});
```

### Advanced Configuration

```javascript
await HardwareSDK.init({
    debug: true,
    
    // Manifest
    manifest: {
        email: 'developer@yourapp.com',
        appName: 'Advanced Node App',
        appUrl: 'https://yourapp.com'
    },
    
    // Transport configuration
    transport: {
        type: 'usb',              // 'usb' or 'bridge'
        bridgeUrl: 'http://localhost:21325'  // Custom bridge URL
    },
    
    // Connection settings
    connectTimeout: 10000,        // Connection timeout in ms
    transportReconnect: true,     // Auto-reconnect
    pendingTransportEvent: true,  // Handle pending events
    
    // Logging
    logLevel: 'debug',           // 'error', 'warn', 'info', 'debug'
    logToFile: './onekey.log'    // Log to file
});
```

## Transport Methods

### USB/HID Transport (Default)

Direct USB communication with the device:

```javascript
await HardwareSDK.init({
    manifest: { /* ... */ },
    transport: {
        type: 'usb'
    }
});

// Search for USB devices
const devices = await HardwareSDK.searchDevices();
console.log('USB devices found:', devices);
```

### HTTP Bridge Transport

Connect through OneKey Bridge application:

```javascript
await HardwareSDK.init({
    manifest: { /* ... */ },
    transport: {
        type: 'bridge',
        bridgeUrl: 'http://localhost:21325'
    }
});

// Bridge automatically handles device discovery
const devices = await HardwareSDK.searchDevices();
console.log('Bridge devices found:', devices);
```

## Device Management

### Device Discovery

```javascript
// Search for all available devices
const devices = await HardwareSDK.searchDevices();

devices.forEach(device => {
    console.log(`Device: ${device.label}`);
    console.log(`Path: ${device.path}`);
    console.log(`Features:`, device.features);
});
```

### Device Connection

```javascript
// Connect to first available device
if (devices.length > 0) {
    await HardwareSDK.connectDevice(devices[0].path);
    console.log('Connected to device');
}

// Get device features
const features = await HardwareSDK.getFeatures();
console.log('Device info:', features);
```

### Connection Management

```javascript
class DeviceManager {
    constructor() {
        this.device = null;
        this.isConnected = false;
    }
    
    async initialize() {
        await HardwareSDK.init({
            debug: false,
            manifest: {
                email: 'developer@yourapp.com',
                appName: 'Device Manager',
                appUrl: 'https://yourapp.com'
            }
        });
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        HardwareSDK.on('device-connect', (device) => {
            this.device = device;
            this.isConnected = true;
            console.log('Device connected:', device.label);
        });
        
        HardwareSDK.on('device-disconnect', () => {
            this.device = null;
            this.isConnected = false;
            console.log('Device disconnected');
        });
    }
    
    async ensureConnected() {
        if (!this.isConnected) {
            const devices = await HardwareSDK.searchDevices();
            if (devices.length === 0) {
                throw new Error('No devices found');
            }
            
            await HardwareSDK.connectDevice(devices[0].path);
        }
    }
    
    async getAddress(path, coin = 'btc') {
        await this.ensureConnected();
        
        const result = await HardwareSDK.btcGetAddress({
            path,
            coin,
            showOnDevice: true
        });
        
        if (result.success) {
            return result.payload.address;
        } else {
            throw new Error(result.payload.error);
        }
    }
}

// Usage
const deviceManager = new DeviceManager();
await deviceManager.initialize();
const address = await deviceManager.getAddress("m/44'/0'/0'/0/0");
console.log('Bitcoin address:', address);
```

## CLI Application Example

```javascript
#!/usr/bin/env node

const { HardwareSDK } = require('@onekeyfe/hd-common-connect-sdk');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    try {
        console.log('Initializing OneKey SDK...');
        
        await HardwareSDK.init({
            debug: false,
            manifest: {
                email: 'developer@yourapp.com',
                appName: 'OneKey CLI Tool',
                appUrl: 'https://yourapp.com'
            }
        });
        
        console.log('Searching for devices...');
        const devices = await HardwareSDK.searchDevices();
        
        if (devices.length === 0) {
            console.log('No devices found. Please connect your OneKey device.');
            process.exit(1);
        }
        
        console.log(`Found ${devices.length} device(s):`);
        devices.forEach((device, index) => {
            console.log(`  ${index + 1}. ${device.label || 'OneKey Device'}`);
        });
        
        // Connect to first device
        await HardwareSDK.connectDevice(devices[0].path);
        console.log('Connected to device');
        
        // Interactive menu
        showMenu();
        
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

function showMenu() {
    console.log('\nOneKey CLI Tool');
    console.log('1. Get Bitcoin address');
    console.log('2. Get Ethereum address');
    console.log('3. Get device info');
    console.log('4. Exit');
    
    rl.question('Select option: ', async (answer) => {
        try {
            switch (answer) {
                case '1':
                    await getBitcoinAddress();
                    break;
                case '2':
                    await getEthereumAddress();
                    break;
                case '3':
                    await getDeviceInfo();
                    break;
                case '4':
                    console.log('Goodbye!');
                    process.exit(0);
                    break;
                default:
                    console.log('Invalid option');
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
        
        showMenu();
    });
}

async function getBitcoinAddress() {
    const result = await HardwareSDK.btcGetAddress({
        path: "m/44'/0'/0'/0/0",
        showOnDevice: true,
        coin: 'btc'
    });
    
    if (result.success) {
        console.log('Bitcoin address:', result.payload.address);
    } else {
        console.log('Error:', result.payload.error);
    }
}

async function getEthereumAddress() {
    const result = await HardwareSDK.evmGetAddress({
        path: "m/44'/60'/0'/0/0",
        showOnDevice: true
    });
    
    if (result.success) {
        console.log('Ethereum address:', result.payload.address);
    } else {
        console.log('Error:', result.payload.error);
    }
}

async function getDeviceInfo() {
    const features = await HardwareSDK.getFeatures();
    console.log('Device info:');
    console.log('  Label:', features.label);
    console.log('  Model:', features.model);
    console.log('  Firmware:', features.major_version + '.' + features.minor_version + '.' + features.patch_version);
}

// Handle process termination
process.on('SIGINT', () => {
    console.log('\nGoodbye!');
    process.exit(0);
});

main();
```

## Electron Integration

```javascript
// main.js (Main Process)
const { app, BrowserWindow } = require('electron');
const { HardwareSDK } = require('@onekeyfe/hd-common-connect-sdk');

let mainWindow;

async function createWindow() {
    // Initialize OneKey SDK in main process
    await HardwareSDK.init({
        debug: true,
        manifest: {
            email: 'developer@yourapp.com',
            appName: 'OneKey Electron App',
            appUrl: 'https://yourapp.com'
        }
    });
    
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    
    mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

// renderer.js (Renderer Process)
const { HardwareSDK } = require('@onekeyfe/hd-common-connect-sdk');

document.getElementById('connect-btn').addEventListener('click', async () => {
    try {
        const devices = await HardwareSDK.searchDevices();
        if (devices.length > 0) {
            await HardwareSDK.connectDevice(devices[0].path);
            console.log('Connected to device');
        }
    } catch (error) {
        console.error('Connection failed:', error);
    }
});
```

## Error Handling

```javascript
async function safeOperation(operation) {
    try {
        const result = await operation();
        
        if (result.success) {
            return result.payload;
        } else {
            // Handle specific errors
            switch (result.payload.error) {
                case 'Device_NotFound':
                    throw new Error('Device not found or disconnected');
                case 'Device_CallInProgress':
                    throw new Error('Another operation is in progress');
                case 'Runtime_CallException':
                    throw new Error('Operation cancelled by user');
                default:
                    throw new Error(result.payload.error);
            }
        }
    } catch (error) {
        console.error('Operation failed:', error.message);
        throw error;
    }
}

// Usage
try {
    const address = await safeOperation(() => 
        HardwareSDK.btcGetAddress({
            path: "m/44'/0'/0'/0/0",
            coin: 'btc',
            showOnDevice: true
        })
    );
    console.log('Address:', address.address);
} catch (error) {
    console.error('Failed to get address:', error.message);
}
```

## Performance Optimization

```javascript
// Connection pooling
class ConnectionPool {
    constructor() {
        this.connections = new Map();
    }
    
    async getConnection(devicePath) {
        if (!this.connections.has(devicePath)) {
            await HardwareSDK.connectDevice(devicePath);
            this.connections.set(devicePath, true);
        }
        return devicePath;
    }
    
    async closeAll() {
        for (const devicePath of this.connections.keys()) {
            await HardwareSDK.dispose();
        }
        this.connections.clear();
    }
}

// Batch operations
async function batchGetAddresses(paths) {
    const operations = paths.map(path => 
        HardwareSDK.btcGetAddress({
            path,
            coin: 'btc',
            showOnDevice: false
        })
    );
    
    const results = await Promise.all(operations);
    return results.map(result => 
        result.success ? result.payload.address : null
    );
}
```

## Next Steps

- [React Native SDK](react-native-sdk.md) - Mobile applications
- [Transport Layer](transport.md) - Communication protocols
- [Integration Guide](../integration/nodejs-electron.md) - Detailed Node.js integration
- [API Reference](../api/device.md) - Complete API documentation
