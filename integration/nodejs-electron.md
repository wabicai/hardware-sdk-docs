---
icon: desktop
---

# Node.js & Electron Integration

Complete guide for integrating OneKey hardware wallets into Node.js applications and Electron desktop apps with direct USB communication and HTTP Bridge support.

## Overview

Node.js and Electron integration provides the most comprehensive OneKey SDK experience with direct hardware access, full filesystem capabilities, and no browser limitations.

### Key Features

- **Direct USB/HID Communication** - No browser restrictions
- **HTTP Bridge Support** - Universal compatibility
- **Full Node.js Ecosystem** - Access to all npm packages
- **Cross-Platform Support** - Windows, macOS, Linux

### Use Cases

- Desktop wallet applications
- CLI tools and scripts
- Server-side integrations
- Development and testing tools
- Automated trading systems

## Installation & Setup

### Package Installation

```bash
npm install @onekeyfe/hd-common-connect-sdk
# or
yarn add @onekeyfe/hd-common-connect-sdk
```

### System Requirements

- Node.js 14+ or Electron 10+
- USB access permissions
- OneKey Bridge (optional, for HTTP transport)

### Basic Initialization

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
    
    console.log('OneKey SDK initialized');
}

initialize().catch(console.error);
```

## Node.js Integration

### CLI Application

```javascript
#!/usr/bin/env node

const { HardwareSDK } = require('@onekeyfe/hd-common-connect-sdk');
const readline = require('readline');

class OneKeyCLI {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.device = null;
    }

    async initialize() {
        console.log('🔧 Initializing OneKey CLI...');
        
        await HardwareSDK.init({
            debug: process.env.DEBUG === 'true',
            manifest: {
                email: 'developer@yourapp.com',
                appName: 'OneKey CLI Tool',
                appUrl: 'https://yourapp.com'
            }
        });

        this.setupEventListeners();
        console.log('✅ SDK initialized successfully');
    }

    setupEventListeners() {
        HardwareSDK.on('device-connect', (device) => {
            this.device = device;
            console.log(`📱 Device connected: ${device.label || 'OneKey Device'}`);
        });

        HardwareSDK.on('device-disconnect', () => {
            this.device = null;
            console.log('📱 Device disconnected');
        });
    }

    async connectDevice() {
        console.log('🔍 Searching for devices...');
        
        const devices = await HardwareSDK.searchDevices();
        
        if (devices.length === 0) {
            throw new Error('No OneKey devices found. Please connect your device.');
        }

        console.log(`Found ${devices.length} device(s):`);
        devices.forEach((device, index) => {
            console.log(`  ${index + 1}. ${device.label || 'OneKey Device'}`);
        });

        // Connect to first device
        await HardwareSDK.connectDevice(devices[0].path);
        return devices[0];
    }

    async getAddress(coin = 'btc', account = 0, index = 0) {
        if (!this.device) {
            throw new Error('No device connected');
        }

        const path = `m/44'/${this.getCoinType(coin)}'/${account}'/0/${index}`;
        
        console.log(`📍 Getting ${coin.toUpperCase()} address for path: ${path}`);

        const result = await HardwareSDK.btcGetAddress({
            path,
            showOnDevice: true,
            coin
        });

        if (result.success) {
            return result.payload.address;
        } else {
            throw new Error(result.payload.error);
        }
    }

    getCoinType(coin) {
        const coinTypes = {
            'btc': 0,
            'ltc': 2,
            'eth': 60,
            'bch': 145
        };
        return coinTypes[coin] || 0;
    }

    async showMenu() {
        console.log('\n📋 OneKey CLI Menu:');
        console.log('1. Connect device');
        console.log('2. Get Bitcoin address');
        console.log('3. Get Ethereum address');
        console.log('4. Get device info');
        console.log('5. Exit');

        const choice = await this.prompt('Select option (1-5): ');

        switch (choice) {
            case '1':
                await this.connectDevice();
                break;
            case '2':
                const btcAddress = await this.getAddress('btc');
                console.log(`💰 Bitcoin address: ${btcAddress}`);
                break;
            case '3':
                const ethAddress = await this.getEthereumAddress();
                console.log(`💰 Ethereum address: ${ethAddress}`);
                break;
            case '4':
                await this.showDeviceInfo();
                break;
            case '5':
                console.log('👋 Goodbye!');
                process.exit(0);
                break;
            default:
                console.log('❌ Invalid option');
        }

        // Show menu again
        setTimeout(() => this.showMenu(), 1000);
    }

    async getEthereumAddress() {
        if (!this.device) {
            throw new Error('No device connected');
        }

        const result = await HardwareSDK.evmGetAddress({
            path: "m/44'/60'/0'/0/0",
            showOnDevice: true
        });

        if (result.success) {
            return result.payload.address;
        } else {
            throw new Error(result.payload.error);
        }
    }

    async showDeviceInfo() {
        if (!this.device) {
            console.log('❌ No device connected');
            return;
        }

        const features = await HardwareSDK.getFeatures();
        
        console.log('\n📱 Device Information:');
        console.log(`  Label: ${features.label || 'Unnamed'}`);
        console.log(`  Model: ${features.model}`);
        console.log(`  Firmware: ${features.major_version}.${features.minor_version}.${features.patch_version}`);
        console.log(`  Device ID: ${features.device_id}`);
        console.log(`  Bootloader: ${features.bootloader_mode ? 'Yes' : 'No'}`);
    }

    prompt(question) {
        return new Promise((resolve) => {
            this.rl.question(question, resolve);
        });
    }

    async run() {
        try {
            await this.initialize();
            await this.showMenu();
        } catch (error) {
            console.error('❌ Error:', error.message);
            process.exit(1);
        }
    }
}

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n👋 Goodbye!');
    process.exit(0);
});

// Run CLI
const cli = new OneKeyCLI();
cli.run();
```

### Express.js Server Integration

```javascript
const express = require('express');
const { HardwareSDK } = require('@onekeyfe/hd-common-connect-sdk');

class OneKeyServer {
    constructor() {
        this.app = express();
        this.device = null;
        this.setupMiddleware();
        this.setupRoutes();
    }

    setupMiddleware() {
        this.app.use(express.json());
        this.app.use(express.static('public'));
        
        // CORS for development
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            next();
        });
    }

    async initialize() {
        await HardwareSDK.init({
            debug: process.env.NODE_ENV === 'development',
            manifest: {
                email: 'developer@yourapp.com',
                appName: 'OneKey Server',
                appUrl: 'https://yourapp.com'
            }
        });

        HardwareSDK.on('device-connect', (device) => {
            this.device = device;
            console.log('Device connected:', device.label);
        });

        HardwareSDK.on('device-disconnect', () => {
            this.device = null;
            console.log('Device disconnected');
        });
    }

    setupRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'ok',
                device: this.device ? 'connected' : 'disconnected'
            });
        });

        // Search devices
        this.app.get('/devices', async (req, res) => {
            try {
                const devices = await HardwareSDK.searchDevices();
                res.json({ success: true, devices });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // Connect device
        this.app.post('/connect', async (req, res) => {
            try {
                const { devicePath } = req.body;
                await HardwareSDK.connectDevice(devicePath);
                res.json({ success: true, message: 'Device connected' });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // Get address
        this.app.post('/address', async (req, res) => {
            try {
                const { path, coin = 'btc', showOnDevice = true } = req.body;
                
                if (!this.device) {
                    return res.status(400).json({ 
                        success: false, 
                        error: 'No device connected' 
                    });
                }

                const result = await HardwareSDK.btcGetAddress({
                    path,
                    coin,
                    showOnDevice
                });

                res.json(result);
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // Sign transaction
        this.app.post('/sign', async (req, res) => {
            try {
                const { transaction } = req.body;
                
                if (!this.device) {
                    return res.status(400).json({ 
                        success: false, 
                        error: 'No device connected' 
                    });
                }

                // Implementation depends on transaction type
                const result = await this.signTransaction(transaction);
                res.json(result);
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }

    async signTransaction(transaction) {
        // Implement transaction signing based on type
        switch (transaction.type) {
            case 'bitcoin':
                return await HardwareSDK.btcSignTransaction(transaction.params);
            case 'ethereum':
                return await HardwareSDK.evmSignTransaction(transaction.params);
            default:
                throw new Error('Unsupported transaction type');
        }
    }

    async start(port = 3000) {
        await this.initialize();
        
        this.app.listen(port, () => {
            console.log(`OneKey server running on port ${port}`);
        });
    }
}

// Start server
const server = new OneKeyServer();
server.start(process.env.PORT || 3000);
```

## Electron Integration

### Main Process Setup

```javascript
// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const { HardwareSDK } = require('@onekeyfe/hd-common-connect-sdk');

class OneKeyElectronApp {
    constructor() {
        this.mainWindow = null;
        this.device = null;
    }

    async initialize() {
        await HardwareSDK.init({
            debug: true,
            manifest: {
                email: 'developer@yourapp.com',
                appName: 'OneKey Electron App',
                appUrl: 'https://yourapp.com'
            }
        });

        this.setupEventListeners();
        this.setupIpcHandlers();
    }

    setupEventListeners() {
        HardwareSDK.on('device-connect', (device) => {
            this.device = device;
            this.sendToRenderer('device-connected', device);
        });

        HardwareSDK.on('device-disconnect', () => {
            this.device = null;
            this.sendToRenderer('device-disconnected');
        });

        HardwareSDK.on('ui-button', (event) => {
            this.sendToRenderer('ui-button', event);
        });
    }

    setupIpcHandlers() {
        ipcMain.handle('onekey-search-devices', async () => {
            try {
                const devices = await HardwareSDK.searchDevices();
                return { success: true, devices };
            } catch (error) {
                return { success: false, error: error.message };
            }
        });

        ipcMain.handle('onekey-connect-device', async (event, devicePath) => {
            try {
                await HardwareSDK.connectDevice(devicePath);
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        });

        ipcMain.handle('onekey-get-address', async (event, params) => {
            try {
                const result = await HardwareSDK.btcGetAddress(params);
                return result;
            } catch (error) {
                return { success: false, error: error.message };
            }
        });

        ipcMain.handle('onekey-sign-transaction', async (event, params) => {
            try {
                const result = await HardwareSDK.btcSignTransaction(params);
                return result;
            } catch (error) {
                return { success: false, error: error.message };
            }
        });
    }

    sendToRenderer(channel, data) {
        if (this.mainWindow && !this.mainWindow.isDestroyed()) {
            this.mainWindow.webContents.send(channel, data);
        }
    }

    createWindow() {
        this.mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: path.join(__dirname, 'preload.js')
            }
        });

        this.mainWindow.loadFile('index.html');

        if (process.env.NODE_ENV === 'development') {
            this.mainWindow.webContents.openDevTools();
        }
    }

    async start() {
        await app.whenReady();
        await this.initialize();
        this.createWindow();

        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                this.createWindow();
            }
        });
    }
}

const oneKeyApp = new OneKeyElectronApp();
oneKeyApp.start();
```

### Preload Script

```javascript
// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('onekey', {
    searchDevices: () => ipcRenderer.invoke('onekey-search-devices'),
    connectDevice: (devicePath) => ipcRenderer.invoke('onekey-connect-device', devicePath),
    getAddress: (params) => ipcRenderer.invoke('onekey-get-address', params),
    signTransaction: (params) => ipcRenderer.invoke('onekey-sign-transaction', params),
    
    // Event listeners
    onDeviceConnected: (callback) => ipcRenderer.on('device-connected', callback),
    onDeviceDisconnected: (callback) => ipcRenderer.on('device-disconnected', callback),
    onUIButton: (callback) => ipcRenderer.on('ui-button', callback),
    
    // Remove listeners
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});
```

### Renderer Process

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
    <title>OneKey Electron App</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        button { padding: 10px 20px; margin: 10px 0; }
        .device-info { background: #f0f0f0; padding: 15px; margin: 10px 0; }
        .address { background: #e8f5e8; padding: 10px; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>OneKey Electron Wallet</h1>
    
    <div id="status">Initializing...</div>
    
    <button id="search-btn">Search Devices</button>
    <button id="connect-btn" disabled>Connect Device</button>
    <button id="address-btn" disabled>Get Bitcoin Address</button>
    
    <div id="device-info" style="display: none;"></div>
    <div id="address-result" style="display: none;"></div>

    <script>
        class OneKeyElectronUI {
            constructor() {
                this.devices = [];
                this.connectedDevice = null;
                this.setupEventListeners();
                this.setupUIHandlers();
            }

            setupEventListeners() {
                window.onekey.onDeviceConnected((event, device) => {
                    this.connectedDevice = device;
                    this.updateUI();
                    this.showDeviceInfo(device);
                });

                window.onekey.onDeviceDisconnected(() => {
                    this.connectedDevice = null;
                    this.updateUI();
                    this.hideDeviceInfo();
                });

                window.onekey.onUIButton((event, data) => {
                    this.showMessage('Please confirm action on your OneKey device');
                });
            }

            setupUIHandlers() {
                document.getElementById('search-btn').addEventListener('click', () => {
                    this.searchDevices();
                });

                document.getElementById('connect-btn').addEventListener('click', () => {
                    this.connectDevice();
                });

                document.getElementById('address-btn').addEventListener('click', () => {
                    this.getAddress();
                });
            }

            async searchDevices() {
                const result = await window.onekey.searchDevices();
                
                if (result.success) {
                    this.devices = result.devices;
                    this.updateStatus(`Found ${result.devices.length} device(s)`);
                    this.updateUI();
                } else {
                    this.updateStatus(`Error: ${result.error}`);
                }
            }

            async connectDevice() {
                if (this.devices.length === 0) {
                    this.updateStatus('No devices found');
                    return;
                }

                const result = await window.onekey.connectDevice(this.devices[0].path);
                
                if (!result.success) {
                    this.updateStatus(`Connection failed: ${result.error}`);
                }
            }

            async getAddress() {
                const result = await window.onekey.getAddress({
                    path: "m/44'/0'/0'/0/0",
                    showOnDevice: true,
                    coin: 'btc'
                });

                if (result.success) {
                    this.showAddress(result.payload.address);
                } else {
                    this.updateStatus(`Error: ${result.error}`);
                }
            }

            updateUI() {
                const connectBtn = document.getElementById('connect-btn');
                const addressBtn = document.getElementById('address-btn');

                connectBtn.disabled = this.devices.length === 0 || this.connectedDevice;
                addressBtn.disabled = !this.connectedDevice;
            }

            updateStatus(message) {
                document.getElementById('status').textContent = message;
            }

            showDeviceInfo(device) {
                const deviceInfo = document.getElementById('device-info');
                deviceInfo.innerHTML = `
                    <h3>Connected Device</h3>
                    <p><strong>Label:</strong> ${device.label || 'OneKey Device'}</p>
                    <p><strong>Model:</strong> ${device.features.model}</p>
                    <p><strong>Firmware:</strong> ${device.features.major_version}.${device.features.minor_version}.${device.features.patch_version}</p>
                `;
                deviceInfo.style.display = 'block';
            }

            hideDeviceInfo() {
                document.getElementById('device-info').style.display = 'none';
            }

            showAddress(address) {
                const addressResult = document.getElementById('address-result');
                addressResult.innerHTML = `
                    <h3>Bitcoin Address</h3>
                    <p><code>${address}</code></p>
                `;
                addressResult.style.display = 'block';
            }

            showMessage(message) {
                this.updateStatus(message);
            }
        }

        // Initialize UI
        const ui = new OneKeyElectronUI();
        ui.updateStatus('Ready');
    </script>
</body>
</html>
    ```

## Platform-Specific Setup

### Windows Setup

```bash
# Install Windows build tools
npm install --global windows-build-tools

# Install USB drivers
# Download and install OneKey Bridge or device drivers
```

### macOS Setup

```bash
# No additional setup required
# macOS has native USB/HID support
```

### Linux Setup

```bash
# Create udev rules for device access
sudo nano /etc/udev/rules.d/51-onekey.rules

# Add OneKey device rules
SUBSYSTEM=="usb", ATTR{idVendor}=="1209", ATTR{idProduct}=="53c1", MODE="0666", GROUP="plugdev"
SUBSYSTEM=="usb", ATTR{idVendor}=="1209", ATTR{idProduct}=="53c0", MODE="0666", GROUP="plugdev"

# Reload udev rules
sudo udevadm control --reload-rules
sudo udevadm trigger

# Add user to plugdev group
sudo usermod -a -G plugdev $USER
```

## Next Steps

- [React Native Integration](react-native.md) - Mobile applications
- [Best Practices](best-practices.md) - Production-ready patterns
- [API Reference](../api/device.md) - Complete API documentation
- [Troubleshooting](../resources/troubleshooting.md) - Common issues and solutions
