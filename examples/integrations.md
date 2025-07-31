---
icon: puzzle
---

# Integration Examples

Real-world integration patterns for popular frameworks and platforms.

## 🚀 Interactive Playground

Test all these examples live in our interactive playground:

**[OneKey SDK Playground](https://hardware-example.onekeytest.com/expo-playground/)**

Features:
- ✅ Live code editing and testing
- ✅ Real OneKey device connection
- ✅ Multiple blockchain examples
- ✅ Framework-specific demos
- ✅ Copy-paste ready code

## Next.js Integration

Complete Next.js application with OneKey wallet integration.

### Setup

```bash
npx create-next-app@latest onekey-nextjs-app
cd onekey-nextjs-app
npm install @onekey/hardware-web-sdk
```

### OneKey Provider Hook

```javascript
// hooks/useOneKey.js
import { createContext, useContext, useState, useEffect } from 'react';
import OneKeySDK from '@onekey/hardware-web-sdk';

const OneKeyContext = createContext();

export function OneKeyProvider({ children }) {
  const [sdk, setSdk] = useState(null);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [chainId, setChainId] = useState(1);

  useEffect(() => {
    const initSDK = async () => {
      const sdkInstance = new OneKeySDK({
        debug: process.env.NODE_ENV === 'development',
        manifest: {
          email: 'developer@yourapp.com',
          appName: 'NextJS OneKey App',
          appUrl: typeof window !== 'undefined' ? window.location.origin : 'https://yourapp.com'
        }
      });
      
      setSdk(sdkInstance);
    };

    initSDK();
  }, []);

  const connect = async () => {
    if (!sdk) return;
    
    try {
      const result = await sdk.ethereumGetAddress({
        path: "m/44'/60'/0'/0/0",
        showOnDevice: true
      });
      
      if (result.success) {
        setAddress(result.payload.address);
        setConnected(true);
      }
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const disconnect = () => {
    setConnected(false);
    setAddress('');
  };

  const signMessage = async (message) => {
    if (!sdk || !connected) throw new Error('Not connected');
    
    const result = await sdk.ethereumSignMessage({
      path: "m/44'/60'/0'/0/0",
      message
    });
    
    if (result.success) {
      return result.payload.signature;
    } else {
      throw new Error(result.payload.error);
    }
  };

  const value = {
    sdk,
    connected,
    address,
    chainId,
    connect,
    disconnect,
    signMessage
  };

  return (
    <OneKeyContext.Provider value={value}>
      {children}
    </OneKeyContext.Provider>
  );
}

export const useOneKey = () => {
  const context = useContext(OneKeyContext);
  if (!context) {
    throw new Error('useOneKey must be used within OneKeyProvider');
  }
  return context;
};
```

### Wallet Component

```javascript
// components/OneKeyWallet.js
import { useOneKey } from '../hooks/useOneKey';
import { useState } from 'react';

export default function OneKeyWallet() {
  const { connected, address, connect, disconnect, signMessage } = useOneKey();
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignMessage = async () => {
    if (!message) return;
    
    setLoading(true);
    try {
      const sig = await signMessage(message);
      setSignature(sig);
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">OneKey Wallet</h2>
      
      {!connected ? (
        <button
          onClick={connect}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Connect OneKey
        </button>
      ) : (
        <div>
          <div className="mb-4">
            <p className="text-sm text-gray-600">Connected Address:</p>
            <p className="font-mono text-sm break-all">{address}</p>
          </div>
          
          <div className="mb-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message to sign"
              className="w-full border rounded px-3 py-2"
            />
            <button
              onClick={handleSignMessage}
              disabled={loading || !message}
              className="w-full mt-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-300"
            >
              {loading ? 'Signing...' : 'Sign Message'}
            </button>
          </div>
          
          {signature && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">Signature:</p>
              <p className="font-mono text-xs break-all bg-gray-100 p-2 rounded">{signature}</p>
            </div>
          )}
          
          <button
            onClick={disconnect}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
```

### App Integration

```javascript
// pages/_app.js
import { OneKeyProvider } from '../hooks/useOneKey';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <OneKeyProvider>
      <Component {...pageProps} />
    </OneKeyProvider>
  );
}

// pages/index.js
import OneKeyWallet from '../components/OneKeyWallet';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <OneKeyWallet />
    </div>
  );
}
```

## Vue.js Integration

Complete Vue.js application with Composition API.

### OneKey Composable

```javascript
// composables/useOneKey.js
import { ref, reactive } from 'vue';
import OneKeySDK from '@onekey/hardware-web-sdk';

const sdk = ref(null);
const state = reactive({
  connected: false,
  address: '',
  loading: false,
  error: null
});

export function useOneKey() {
  const initialize = async () => {
    if (sdk.value) return;
    
    sdk.value = new OneKeySDK({
      debug: process.env.NODE_ENV === 'development',
      manifest: {
        email: 'developer@yourapp.com',
        appName: 'Vue OneKey App',
        appUrl: window.location.origin
      }
    });
  };

  const connect = async () => {
    if (!sdk.value) await initialize();
    
    state.loading = true;
    state.error = null;
    
    try {
      const result = await sdk.value.ethereumGetAddress({
        path: "m/44'/60'/0'/0/0",
        showOnDevice: true
      });
      
      if (result.success) {
        state.address = result.payload.address;
        state.connected = true;
      } else {
        throw new Error(result.payload.error);
      }
    } catch (error) {
      state.error = error.message;
    } finally {
      state.loading = false;
    }
  };

  const disconnect = () => {
    state.connected = false;
    state.address = '';
    state.error = null;
  };

  const signMessage = async (message) => {
    if (!sdk.value || !state.connected) {
      throw new Error('Not connected');
    }
    
    const result = await sdk.value.ethereumSignMessage({
      path: "m/44'/60'/0'/0/0",
      message
    });
    
    if (result.success) {
      return result.payload.signature;
    } else {
      throw new Error(result.payload.error);
    }
  };

  return {
    state,
    connect,
    disconnect,
    signMessage
  };
}
```

### Vue Component

```vue
<!-- components/OneKeyWallet.vue -->
<template>
  <div class="onekey-wallet">
    <h2>OneKey Wallet</h2>
    
    <div v-if="state.error" class="error">
      {{ state.error }}
    </div>
    
    <div v-if="!state.connected">
      <button @click="connect" :disabled="state.loading">
        {{ state.loading ? 'Connecting...' : 'Connect OneKey' }}
      </button>
    </div>
    
    <div v-else>
      <div class="address">
        <label>Address:</label>
        <span>{{ state.address }}</span>
      </div>
      
      <div class="sign-section">
        <input
          v-model="message"
          placeholder="Message to sign"
          type="text"
        />
        <button @click="handleSignMessage" :disabled="!message || signing">
          {{ signing ? 'Signing...' : 'Sign Message' }}
        </button>
      </div>
      
      <div v-if="signature" class="signature">
        <label>Signature:</label>
        <span>{{ signature }}</span>
      </div>
      
      <button @click="disconnect" class="disconnect">
        Disconnect
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useOneKey } from '../composables/useOneKey';

const { state, connect, disconnect, signMessage } = useOneKey();

const message = ref('');
const signature = ref('');
const signing = ref(false);

const handleSignMessage = async () => {
  if (!message.value) return;
  
  signing.value = true;
  try {
    signature.value = await signMessage(message.value);
  } catch (error) {
    alert(`Error: ${error.message}`);
  } finally {
    signing.value = false;
  }
};
</script>

<style scoped>
.onekey-wallet {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.error {
  color: red;
  margin-bottom: 10px;
}

.address {
  margin-bottom: 15px;
}

.address span {
  font-family: monospace;
  font-size: 12px;
  word-break: break-all;
}

.sign-section {
  margin-bottom: 15px;
}

.sign-section input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.signature {
  margin-bottom: 15px;
  font-size: 12px;
}

.signature span {
  font-family: monospace;
  word-break: break-all;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.disconnect {
  background-color: #dc3545;
  color: white;
}
</style>
```

## Electron Integration

Desktop application with OneKey integration.

### Main Process

```javascript
// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const OneKeySDK = require('@onekey/hardware-js-sdk');

let mainWindow;
let sdk;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');
}

async function initializeOneKey() {
  sdk = new OneKeySDK({
    manifest: {
      email: 'developer@yourapp.com',
      appName: 'Electron OneKey App',
      appUrl: 'https://yourapp.com'
    }
  });

  // Setup IPC handlers
  ipcMain.handle('onekey:connect', async () => {
    try {
      const devices = await sdk.searchDevices();
      if (devices.length === 0) {
        throw new Error('No devices found');
      }
      
      await sdk.connectDevice(devices[0].path);
      const features = await sdk.getFeatures();
      
      return { success: true, device: features };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('onekey:getAddress', async (event, params) => {
    try {
      const result = await sdk.ethereumGetAddress(params);
      return result;
    } catch (error) {
      return { success: false, payload: { error: error.message } };
    }
  });

  ipcMain.handle('onekey:signMessage', async (event, params) => {
    try {
      const result = await sdk.ethereumSignMessage(params);
      return result;
    } catch (error) {
      return { success: false, payload: { error: error.message } };
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  initializeOneKey();
});
```

### Preload Script

```javascript
// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('onekey', {
  connect: () => ipcRenderer.invoke('onekey:connect'),
  getAddress: (params) => ipcRenderer.invoke('onekey:getAddress', params),
  signMessage: (params) => ipcRenderer.invoke('onekey:signMessage', params)
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
    body { font-family: Arial, sans-serif; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; }
    button { padding: 10px 15px; margin: 5px; }
    .address { font-family: monospace; word-break: break-all; }
  </style>
</head>
<body>
  <div class="container">
    <h1>OneKey Electron App</h1>
    
    <div id="status"></div>
    
    <button onclick="connectDevice()">Connect Device</button>
    <button onclick="getAddress()">Get Address</button>
    
    <div>
      <input type="text" id="messageInput" placeholder="Message to sign" />
      <button onclick="signMessage()">Sign Message</button>
    </div>
    
    <div id="result"></div>
  </div>

  <script>
    let connected = false;
    let address = '';

    async function connectDevice() {
      const result = await window.onekey.connect();
      
      if (result.success) {
        connected = true;
        document.getElementById('status').innerHTML = 
          `Connected to ${result.device.model}`;
      } else {
        document.getElementById('status').innerHTML = 
          `Error: ${result.error}`;
      }
    }

    async function getAddress() {
      if (!connected) {
        alert('Please connect device first');
        return;
      }

      const result = await window.onekey.getAddress({
        path: "m/44'/60'/0'/0/0",
        showOnDevice: true
      });

      if (result.success) {
        address = result.payload.address;
        document.getElementById('result').innerHTML = 
          `Address: <span class="address">${address}</span>`;
      } else {
        document.getElementById('result').innerHTML = 
          `Error: ${result.payload.error}`;
      }
    }

    async function signMessage() {
      const message = document.getElementById('messageInput').value;
      if (!message || !connected) return;

      const result = await window.onekey.signMessage({
        path: "m/44'/60'/0'/0/0",
        message: message
      });

      if (result.success) {
        document.getElementById('result').innerHTML = 
          `Signature: <span class="address">${result.payload.signature}</span>`;
      } else {
        document.getElementById('result').innerHTML = 
          `Error: ${result.payload.error}`;
      }
    }
  </script>
</body>
</html>
```

## Express.js Backend Integration

Server-side OneKey integration for backend applications.

```javascript
// server.js
const express = require('express');
const OneKeySDK = require('@onekey/hardware-js-sdk');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let sdk;
let connectedDevice = null;

// Initialize OneKey SDK
async function initializeSDK() {
  sdk = new OneKeySDK({
    manifest: {
      email: 'developer@yourapp.com',
      appName: 'Express OneKey Server',
      appUrl: 'https://yourapp.com'
    }
  });

  // Auto-connect to first available device
  try {
    const devices = await sdk.searchDevices();
    if (devices.length > 0) {
      await sdk.connectDevice(devices[0].path);
      connectedDevice = await sdk.getFeatures();
      console.log(`Connected to ${connectedDevice.model}`);
    }
  } catch (error) {
    console.error('Failed to connect to device:', error);
  }
}

// API Routes
app.get('/api/device/status', (req, res) => {
  res.json({
    connected: !!connectedDevice,
    device: connectedDevice
  });
});

app.post('/api/device/connect', async (req, res) => {
  try {
    const devices = await sdk.searchDevices();
    if (devices.length === 0) {
      return res.status(404).json({ error: 'No devices found' });
    }

    await sdk.connectDevice(devices[0].path);
    connectedDevice = await sdk.getFeatures();
    
    res.json({ success: true, device: connectedDevice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/address/:chain', async (req, res) => {
  if (!connectedDevice) {
    return res.status(400).json({ error: 'No device connected' });
  }

  const { chain } = req.params;
  const { path, showOnDevice = false } = req.body;

  try {
    let result;
    
    switch (chain) {
      case 'bitcoin':
        result = await sdk.btcGetAddress({
          path,
          showOnDevice,
          coin: 'btc'
        });
        break;
      case 'ethereum':
        result = await sdk.ethereumGetAddress({
          path,
          showOnDevice
        });
        break;
      default:
        return res.status(400).json({ error: 'Unsupported chain' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sign/message', async (req, res) => {
  if (!connectedDevice) {
    return res.status(400).json({ error: 'No device connected' });
  }

  const { path, message, chain = 'ethereum' } = req.body;

  try {
    let result;
    
    if (chain === 'ethereum') {
      result = await sdk.ethereumSignMessage({ path, message });
    } else if (chain === 'bitcoin') {
      result = await sdk.btcSignMessage({ path, message, coin: 'btc' });
    } else {
      return res.status(400).json({ error: 'Unsupported chain' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeSDK();
});
```

## Testing Integration

Unit and integration tests for OneKey SDK.

```javascript
// tests/onekey.test.js
const OneKeySDK = require('@onekey/hardware-js-sdk');

// Mock SDK for testing
class MockOneKeySDK {
  constructor(options) {
    this.options = options;
    this.mockResponses = new Map();
  }

  setMockResponse(method, response) {
    this.mockResponses.set(method, response);
  }

  async getFeatures() {
    return this.mockResponses.get('getFeatures') || {
      model: 'OneKey Touch',
      major_version: 3,
      minor_version: 0,
      patch_version: 0
    };
  }

  async ethereumGetAddress(params) {
    const mockResponse = this.mockResponses.get('ethereumGetAddress');
    if (mockResponse) return mockResponse;

    return {
      success: true,
      payload: {
        address: '0x742d35Cc6634C0532925a3b8D400E4C3f8c8C9C8',
        path: params.path
      }
    };
  }
}

describe('OneKey SDK Integration', () => {
  let sdk;

  beforeEach(() => {
    sdk = new MockOneKeySDK({
      manifest: {
        email: 'test@example.com',
        appName: 'Test App',
        appUrl: 'https://test.com'
      }
    });
  });

  test('should initialize SDK correctly', () => {
    expect(sdk.options.manifest.appName).toBe('Test App');
  });

  test('should get device features', async () => {
    const features = await sdk.getFeatures();
    expect(features.model).toBe('OneKey Touch');
  });

  test('should get Ethereum address', async () => {
    const result = await sdk.ethereumGetAddress({
      path: "m/44'/60'/0'/0/0",
      showOnDevice: false
    });

    expect(result.success).toBe(true);
    expect(result.payload.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
  });

  test('should handle errors gracefully', async () => {
    sdk.setMockResponse('ethereumGetAddress', {
      success: false,
      payload: { error: 'User cancelled' }
    });

    const result = await sdk.ethereumGetAddress({
      path: "m/44'/60'/0'/0/0"
    });

    expect(result.success).toBe(false);
    expect(result.payload.error).toBe('User cancelled');
  });
});
```

## 🎮 Try It Live

All these integration examples are available in our interactive playground:

**[OneKey SDK Playground](https://hardware-example.onekeytest.com/expo-playground/)**

- Test with real OneKey devices
- Copy code directly to your project
- See live examples of all frameworks
- Interactive debugging tools

## Next Steps

- [Advanced Examples](advanced.md) - Complex DeFi and NFT integrations
- [Best Practices](../guides/best-practices.md) - Framework-specific tips
- [API Reference](../api/init.md) - Complete method documentation
- [Troubleshooting](../guides/troubleshooting.md) - Framework-specific issues
