---
icon: rocket
---

# First Integration

Build your first OneKey hardware wallet integration in just a few minutes. This guide walks you through creating a simple application that connects to a OneKey device and gets a Bitcoin address.

## Overview

In this tutorial, you'll learn how to:
- Initialize the OneKey SDK
- Connect to a OneKey device
- Get a Bitcoin address from the device
- Handle basic errors and user interactions

## Step 1: Project Setup

Create a new project and install the OneKey SDK:

```bash
# Create a new project
mkdir onekey-first-app
cd onekey-first-app
npm init -y

# Install OneKey SDK (choose based on your platform)
npm install @onekeyfe/hd-web-sdk        # For web
# npm install @onekeyfe/hd-common-connect-sdk  # For Node.js
# npm install @onekeyfe/hd-ble-sdk             # For React Native
```

## Step 2: Basic HTML Setup (Web)

Create an `index.html` file:

```html
<!DOCTYPE html>
<html>
<head>
    <title>OneKey First Integration</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; }
        button { padding: 10px 20px; margin: 10px 0; font-size: 16px; }
        .result { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .error { background: #ffe6e6; border: 1px solid #ff9999; }
        .success { background: #e6ffe6; border: 1px solid #99ff99; }
    </style>
</head>
<body>
    <h1>OneKey Hardware Wallet Integration</h1>
    
    <button id="init-btn">Initialize SDK</button>
    <button id="connect-btn" disabled>Connect Device</button>
    <button id="get-address-btn" disabled>Get Bitcoin Address</button>
    
    <div id="result" class="result" style="display: none;"></div>
    
    <script type="module" src="app.js"></script>
</body>
</html>
```

## Step 3: JavaScript Implementation

Create an `app.js` file:

```javascript
import { HardwareSDK } from '@onekeyfe/hd-web-sdk';

// UI elements
const initBtn = document.getElementById('init-btn');
const connectBtn = document.getElementById('connect-btn');
const getAddressBtn = document.getElementById('get-address-btn');
const resultDiv = document.getElementById('result');

let isInitialized = false;
let connectedDevice = null;

// Utility function to show results
function showResult(message, isError = false) {
    resultDiv.style.display = 'block';
    resultDiv.className = `result ${isError ? 'error' : 'success'}`;
    resultDiv.innerHTML = message;
}

// Step 1: Initialize the SDK
initBtn.addEventListener('click', async () => {
    try {
        showResult('Initializing OneKey SDK...');
        
        await HardwareSDK.init({
            debug: true,
            connectSrc: 'https://jssdk.onekey.so/',
            manifest: {
                email: 'developer@yourapp.com',
                appName: 'OneKey First App',
                appUrl: 'https://yourapp.com'
            }
        });
        
        isInitialized = true;
        initBtn.disabled = true;
        connectBtn.disabled = false;
        
        showResult('✅ SDK initialized successfully!');
        
    } catch (error) {
        showResult(`❌ Initialization failed: ${error.message}`, true);
    }
});

// Step 2: Connect to device
connectBtn.addEventListener('click', async () => {
    try {
        showResult('Searching for OneKey devices...');
        
        // Search for available devices
        const devices = await HardwareSDK.searchDevices();
        
        if (devices.length === 0) {
            showResult('❌ No OneKey devices found. Please connect your device and try again.', true);
            return;
        }
        
        // Connect to the first available device
        const device = devices[0];
        await HardwareSDK.connectDevice(device.path);
        
        connectedDevice = device;
        connectBtn.disabled = true;
        getAddressBtn.disabled = false;
        
        showResult(`✅ Connected to OneKey device: ${device.label || 'OneKey Device'}`);
        
    } catch (error) {
        showResult(`❌ Connection failed: ${error.message}`, true);
    }
});

// Step 3: Get Bitcoin address
getAddressBtn.addEventListener('click', async () => {
    try {
        showResult('Getting Bitcoin address from device...');
        
        // Get Bitcoin address from device
        const result = await HardwareSDK.btcGetAddress({
            path: "m/44'/0'/0'/0/0",  // First Bitcoin address
            showOnDevice: true,       // Show address on device screen
            coin: 'btc'              // Bitcoin
        });
        
        if (result.success) {
            const { address, path } = result.payload;
            showResult(`
                <h3>✅ Bitcoin Address Retrieved!</h3>
                <p><strong>Address:</strong> <code>${address}</code></p>
                <p><strong>Path:</strong> <code>${path}</code></p>
                <p><em>Please verify this address on your OneKey device screen.</em></p>
            `);
        } else {
            showResult(`❌ Failed to get address: ${result.payload.error}`, true);
        }
        
    } catch (error) {
        showResult(`❌ Error getting address: ${error.message}`, true);
    }
});

// Handle SDK events
HardwareSDK.on('device-connect', (device) => {
    console.log('Device connected:', device);
});

HardwareSDK.on('device-disconnect', (device) => {
    console.log('Device disconnected:', device);
    connectedDevice = null;
    connectBtn.disabled = false;
    getAddressBtn.disabled = true;
    showResult('⚠️ Device disconnected', true);
});
```

## Step 4: Run Your Application

### For Web Applications

1. Start a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

2. Open your browser and navigate to `http://localhost:8000`

### For Node.js Applications

Create a Node.js version in `node-app.js`:

```javascript
const { HardwareSDK } = require('@onekeyfe/hd-common-connect-sdk');

async function main() {
    try {
        // Initialize SDK
        console.log('Initializing OneKey SDK...');
        await HardwareSDK.init({
            debug: true,
            manifest: {
                email: 'developer@yourapp.com',
                appName: 'OneKey Node App',
                appUrl: 'https://yourapp.com'
            }
        });
        console.log('✅ SDK initialized');

        // Search for devices
        console.log('Searching for devices...');
        const devices = await HardwareSDK.searchDevices();
        
        if (devices.length === 0) {
            console.log('❌ No devices found');
            return;
        }

        // Connect to first device
        console.log('Connecting to device...');
        await HardwareSDK.connectDevice(devices[0].path);
        console.log('✅ Device connected');

        // Get Bitcoin address
        console.log('Getting Bitcoin address...');
        const result = await HardwareSDK.btcGetAddress({
            path: "m/44'/0'/0'/0/0",
            showOnDevice: true,
            coin: 'btc'
        });

        if (result.success) {
            console.log('✅ Address:', result.payload.address);
        } else {
            console.log('❌ Error:', result.payload.error);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

main();
```

Run with: `node node-app.js`

## What's Happening?

1. **SDK Initialization**: Sets up the communication layer with your app manifest
2. **Device Discovery**: Searches for connected OneKey devices
3. **Device Connection**: Establishes a secure connection to the selected device
4. **Address Generation**: Requests the device to generate and display a Bitcoin address
5. **User Verification**: The address is shown on the device screen for user verification

## Next Steps

Now that you have a working integration, explore more features:

- [Basic Examples](examples.md) - More usage patterns
- [SDK Concepts](../sdk/concepts.md) - Understand the architecture
- [API Reference](../api/device.md) - Explore all available methods

## Common Issues

**Device not found:**
- Ensure your OneKey device is connected via USB
- Make sure the device is unlocked
- Try a different USB cable or port

**Permission denied:**
- Grant USB/Bluetooth permissions in your browser
- Check your browser's security settings

**Address verification:**
- Always verify addresses on the device screen
- Never trust addresses that don't appear on the device

For more help, see our [Troubleshooting Guide](../resources/troubleshooting.md).
