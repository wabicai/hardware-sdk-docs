---
icon: desktop
---

# Electron Integration

Complete guide for integrating OneKey Hardware SDK into Electron desktop applications.

## Overview

OneKey Electron integration provides native USB/HID communication with OneKey hardware wallets in desktop applications. This guide covers setup, configuration, and implementation for cross-platform desktop apps with comprehensive security and packaging considerations.

## Prerequisites

- Electron 12.0.0+
- Node.js 14+
- OneKey hardware device
- Basic knowledge of Electron and Node.js

## Installation

### Core Dependencies

```bash
npm install @onekeyfe/hd-common-connect-sdk
npm install electron
```

### Native Dependencies

```bash
# For USB/HID communication
npm install node-hid
npm install usb

# For development
npm install --save-dev electron-builder
npm install --save-dev electron-rebuild
```

### Platform-Specific Setup

#### Windows
```bash
# Install Windows Build Tools
npm install --global windows-build-tools

# Or use Visual Studio Build Tools
# Download from: https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2019
```

#### macOS
```bash
# Install Xcode Command Line Tools
xcode-select --install
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get install build-essential libudev-dev

# CentOS/RHEL/Fedora
sudo yum groupinstall "Development Tools"
sudo yum install libudev-devel
```

## Electron Configuration

### Main Process Setup

```javascript
// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { HardwareSDK } = require('@onekeyfe/hd-common-connect-sdk');

class OneKeyElectronApp {
  constructor() {
    this.mainWindow = null;
    this.sdkInitialized = false;
  }

  async createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, 'preload.js')
      },
      // Security settings
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false
    });

    await this.mainWindow.loadFile('index.html');

    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.webContents.openDevTools();
    }
  }

  async initializeSDK() {
    try {
      await HardwareSDK.init({
        debug: process.env.NODE_ENV === 'development',
        manifest: {
          email: 'developer@yourapp.com',
          appName: 'Your Electron App',
          appUrl: 'https://yourapp.com'
        },
        // Electron-specific settings
        env: 'electron',
        lazyLoad: true
      });

      this.sdkInitialized = true;
      console.log('OneKey SDK initialized in Electron');
    } catch (error) {
      console.error('SDK initialization failed:', error);
      throw error;
    }
  }

  setupIPCHandlers() {
    // Device management
    ipcMain.handle('onekey:searchDevices', async () => {
      if (!this.sdkInitialized) {
        throw new Error('SDK not initialized');
      }
      return await HardwareSDK.searchDevices();
    });

    ipcMain.handle('onekey:connectDevice', async (event, devicePath) => {
      return await HardwareSDK.connectDevice(devicePath);
    });

    ipcMain.handle('onekey:disconnectDevice', async () => {
      return await HardwareSDK.disconnectDevice();
    });

    // Bitcoin operations
    ipcMain.handle('onekey:btcGetAddress', async (event, params) => {
      return await HardwareSDK.btcGetAddress(params);
    });

    ipcMain.handle('onekey:btcSignTransaction', async (event, params) => {
      return await HardwareSDK.btcSignTransaction(params);
    });

    // Ethereum operations
    ipcMain.handle('onekey:evmGetAddress', async (event, params) => {
      return await HardwareSDK.evmGetAddress(params);
    });

    ipcMain.handle('onekey:evmSignTransaction', async (event, params) => {
      return await HardwareSDK.evmSignTransaction(params);
    });

    // Error handling
    ipcMain.handle('onekey:getLastError', async () => {
      return HardwareSDK.getLastError?.() || null;
    });
  }

  async initialize() {
    await app.whenReady();
    
    // Initialize SDK first
    await this.initializeSDK();
    
    // Setup IPC handlers
    this.setupIPCHandlers();
    
    // Create window
    await this.createWindow();

    app.on('activate', async () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        await this.createWindow();
      }
    });
  }

  setupAppEvents() {
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('before-quit', async () => {
      // Cleanup SDK resources
      if (this.sdkInitialized) {
        try {
          await HardwareSDK.disconnectDevice();
        } catch (error) {
          console.error('Error during cleanup:', error);
        }
      }
    });

    // Handle certificate errors for development
    app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
      if (process.env.NODE_ENV === 'development') {
        // In development, ignore certificate errors
        event.preventDefault();
        callback(true);
      } else {
        // In production, use default behavior
        callback(false);
      }
    });
  }
}

// Initialize the app
const oneKeyApp = new OneKeyElectronApp();
oneKeyApp.setupAppEvents();
oneKeyApp.initialize().catch(console.error);
```

### Preload Script

```javascript
// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Expose OneKey API to renderer process
contextBridge.exposeInMainWorld('onekey', {
  // Device management
  searchDevices: () => ipcRenderer.invoke('onekey:searchDevices'),
  connectDevice: (devicePath) => ipcRenderer.invoke('onekey:connectDevice', devicePath),
  disconnectDevice: () => ipcRenderer.invoke('onekey:disconnectDevice'),

  // Bitcoin operations
  btcGetAddress: (params) => ipcRenderer.invoke('onekey:btcGetAddress', params),
  btcSignTransaction: (params) => ipcRenderer.invoke('onekey:btcSignTransaction', params),

  // Ethereum operations
  evmGetAddress: (params) => ipcRenderer.invoke('onekey:evmGetAddress', params),
  evmSignTransaction: (params) => ipcRenderer.invoke('onekey:evmSignTransaction', params),

  // Error handling
  getLastError: () => ipcRenderer.invoke('onekey:getLastError'),

  // Event listeners
  onDeviceConnect: (callback) => {
    ipcRenderer.on('device-connect', callback);
    return () => ipcRenderer.removeListener('device-connect', callback);
  },

  onDeviceDisconnect: (callback) => {
    ipcRenderer.on('device-disconnect', callback);
    return () => ipcRenderer.removeListener('device-disconnect', callback);
  }
});

// Expose platform information
contextBridge.exposeInMainWorld('platform', {
  os: process.platform,
  arch: process.arch,
  version: process.versions
});
```

### Renderer Process Implementation

```javascript
// renderer.js
class OneKeyElectronRenderer {
  constructor() {
    this.isConnected = false;
    this.currentDevice = null;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Device connection events
    window.onekey.onDeviceConnect((event, device) => {
      console.log('Device connected:', device);
      this.handleDeviceConnect(device);
    });

    window.onekey.onDeviceDisconnect((event, device) => {
      console.log('Device disconnected:', device);
      this.handleDeviceDisconnect(device);
    });

    // UI event listeners
    document.getElementById('connect-btn')?.addEventListener('click', () => {
      this.connectDevice();
    });

    document.getElementById('disconnect-btn')?.addEventListener('click', () => {
      this.disconnectDevice();
    });

    document.getElementById('btc-address-btn')?.addEventListener('click', () => {
      this.generateBitcoinAddress();
    });

    document.getElementById('eth-address-btn')?.addEventListener('click', () => {
      this.generateEthereumAddress();
    });
  }

  async connectDevice() {
    try {
      this.showLoading('Searching for OneKey devices...');

      const devices = await window.onekey.searchDevices();
      
      if (devices.length === 0) {
        throw new Error('No OneKey devices found');
      }

      this.updateLoading('Connecting to device...');
      
      await window.onekey.connectDevice(devices[0].path);
      
      this.currentDevice = devices[0];
      this.isConnected = true;
      
      this.hideLoading();
      this.updateConnectionStatus(true);
      
      console.log('Connected to OneKey device');
    } catch (error) {
      this.hideLoading();
      this.showError('Connection failed: ' + error.message);
    }
  }

  async disconnectDevice() {
    try {
      await window.onekey.disconnectDevice();
      this.isConnected = false;
      this.currentDevice = null;
      this.updateConnectionStatus(false);
      console.log('Disconnected from OneKey device');
    } catch (error) {
      this.showError('Disconnection failed: ' + error.message);
    }
  }

  async generateBitcoinAddress() {
    if (!this.isConnected) {
      this.showError('Please connect a OneKey device first');
      return;
    }

    try {
      this.showDeviceConfirmation('Please confirm address on your OneKey device');

      const result = await window.onekey.btcGetAddress({
        path: "m/44'/0'/0'/0/0",
        coin: 'btc',
        showOnDevice: true
      });

      this.hideDeviceConfirmation();

      if (result.success) {
        document.getElementById('btc-address').textContent = result.payload.address;
      } else {
        throw new Error(result.payload.error);
      }
    } catch (error) {
      this.hideDeviceConfirmation();
      this.showError('Failed to generate Bitcoin address: ' + error.message);
    }
  }

  async generateEthereumAddress() {
    if (!this.isConnected) {
      this.showError('Please connect a OneKey device first');
      return;
    }

    try {
      this.showDeviceConfirmation('Please confirm address on your OneKey device');

      const result = await window.onekey.evmGetAddress({
        path: "m/44'/60'/0'/0/0",
        showOnDevice: true
      });

      this.hideDeviceConfirmation();

      if (result.success) {
        document.getElementById('eth-address').textContent = result.payload.address;
      } else {
        throw new Error(result.payload.error);
      }
    } catch (error) {
      this.hideDeviceConfirmation();
      this.showError('Failed to generate Ethereum address: ' + error.message);
    }
  }

  handleDeviceConnect(device) {
    this.currentDevice = device;
    this.isConnected = true;
    this.updateConnectionStatus(true);
  }

  handleDeviceDisconnect(device) {
    this.currentDevice = null;
    this.isConnected = false;
    this.updateConnectionStatus(false);
  }

  updateConnectionStatus(connected) {
    const statusElement = document.getElementById('connection-status');
    const connectBtn = document.getElementById('connect-btn');
    const disconnectBtn = document.getElementById('disconnect-btn');
    const operationsDiv = document.getElementById('operations');

    if (connected) {
      statusElement.textContent = `Connected to ${this.currentDevice?.name || 'OneKey Device'}`;
      statusElement.className = 'status connected';
      connectBtn.disabled = true;
      disconnectBtn.disabled = false;
      operationsDiv.style.display = 'block';
    } else {
      statusElement.textContent = 'Disconnected';
      statusElement.className = 'status disconnected';
      connectBtn.disabled = false;
      disconnectBtn.disabled = true;
      operationsDiv.style.display = 'none';
    }
  }

  showLoading(message) {
    const loader = document.getElementById('loader');
    const loaderMessage = document.getElementById('loader-message');
    
    if (loader && loaderMessage) {
      loaderMessage.textContent = message;
      loader.style.display = 'flex';
    }
  }

  updateLoading(message) {
    const loaderMessage = document.getElementById('loader-message');
    if (loaderMessage) {
      loaderMessage.textContent = message;
    }
  }

  hideLoading() {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.display = 'none';
    }
  }

  showDeviceConfirmation(message) {
    const confirmation = document.getElementById('device-confirmation');
    const confirmationMessage = document.getElementById('confirmation-message');
    
    if (confirmation && confirmationMessage) {
      confirmationMessage.textContent = message;
      confirmation.style.display = 'flex';
    }
  }

  hideDeviceConfirmation() {
    const confirmation = document.getElementById('device-confirmation');
    if (confirmation) {
      confirmation.style.display = 'none';
    }
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
      <span class="error-message">${message}</span>
      <button class="error-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentElement) {
        errorDiv.remove();
      }
    }, 5000);
  }
}

// Initialize the renderer
document.addEventListener('DOMContentLoaded', () => {
  const app = new OneKeyElectronRenderer();
  console.log('OneKey Electron Renderer initialized');
});
```

## Security Considerations

### Content Security Policy

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="
        default-src 'self';
        script-src 'self' 'unsafe-inline';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data:;
        connect-src 'self';
    ">
    <title>OneKey Electron App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- App content -->
    <script src="renderer.js"></script>
</body>
</html>
```

### Secure IPC Communication

```javascript
// Validate IPC parameters
ipcMain.handle('onekey:btcGetAddress', async (event, params) => {
  // Validate parameters
  if (!params || typeof params !== 'object') {
    throw new Error('Invalid parameters');
  }

  if (!params.path || typeof params.path !== 'string') {
    throw new Error('Invalid derivation path');
  }

  if (!params.coin || typeof params.coin !== 'string') {
    throw new Error('Invalid coin type');
  }

  // Sanitize path
  const pathRegex = /^m\/\d+'?\/\d+'?\/\d+'?\/\d+\/\d+$/;
  if (!pathRegex.test(params.path)) {
    throw new Error('Invalid path format');
  }

  try {
    return await HardwareSDK.btcGetAddress(params);
  } catch (error) {
    console.error('btcGetAddress error:', error);
    throw error;
  }
});
```

## Packaging and Distribution

### Electron Builder Configuration

```json
// package.json
{
  "name": "onekey-electron-app",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder",
    "build:win": "electron-builder --win",
    "build:mac": "electron-builder --mac",
    "build:linux": "electron-builder --linux",
    "rebuild": "electron-rebuild"
  },
  "build": {
    "appId": "com.yourcompany.onekey-app",
    "productName": "OneKey Electron App",
    "directories": {
      "output": "dist"
    },
    "files": [
      "main.js",
      "preload.js",
      "renderer.js",
      "index.html",
      "styles.css",
      "node_modules/**/*"
    ],
    "win": {
      "target": "nsis",
      "icon": "assets/icon.ico"
    },
    "mac": {
      "target": "dmg",
      "icon": "assets/icon.icns",
      "category": "public.app-category.finance"
    },
    "linux": {
      "target": "AppImage",
      "icon": "assets/icon.png",
      "category": "Office"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true
    }
  }
}
```

### Native Module Rebuilding

```bash
# Rebuild native modules for Electron
npm run rebuild

# Or manually
./node_modules/.bin/electron-rebuild

# For specific Electron version
./node_modules/.bin/electron-rebuild --version=13.1.7
```

## Platform-Specific Considerations

### Windows

```javascript
// Handle Windows-specific USB permissions
if (process.platform === 'win32') {
  app.commandLine.appendSwitch('enable-experimental-web-platform-features');
  
  // Handle Windows USB device permissions
  app.on('ready', () => {
    // Windows-specific initialization
    console.log('Windows platform detected');
  });
}
```

### macOS

```javascript
// Handle macOS security and permissions
if (process.platform === 'darwin') {
  // Request USB access permissions
  app.on('ready', async () => {
    // macOS-specific initialization
    console.log('macOS platform detected');
    
    // Handle macOS app notarization requirements
    if (app.isPackaged) {
      console.log('Running as packaged app');
    }
  });
}
```

### Linux

```javascript
// Handle Linux udev rules and permissions
if (process.platform === 'linux') {
  app.on('ready', () => {
    // Linux-specific initialization
    console.log('Linux platform detected');
    
    // Check for udev rules
    const fs = require('fs');
    const udevRulesPath = '/etc/udev/rules.d/51-onekey.rules';
    
    if (!fs.existsSync(udevRulesPath)) {
      console.warn('OneKey udev rules not found. USB access may be limited.');
    }
  });
}
```

## Next Steps

- [React Native Integration](react-native.md) - Mobile application integration
- [Best Practices](best-practices.md) - Production deployment guidelines
- [API Reference](../api/device.md) - Complete API documentation
- [Troubleshooting](../resources/troubleshooting.md) - Common issues and solutions
