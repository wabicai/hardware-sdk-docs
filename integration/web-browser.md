---
icon: globe
---

# Web Browser Integration

Complete guide for integrating OneKey Hardware SDK into web applications with WebUSB and Bridge support.

## Overview

OneKey Web SDK enables web applications to communicate with OneKey hardware wallets through WebUSB or OneKey Bridge. This guide covers setup, configuration, and implementation for modern web browsers with comprehensive browser compatibility and security considerations.

## Prerequisites

- Modern web browser with WebUSB support (Chrome 61+, Edge 79+, Opera 48+)
- HTTPS connection (required for WebUSB)
- OneKey hardware device
- Basic knowledge of JavaScript/TypeScript

## Installation

### NPM Installation

```bash
npm install @onekeyfe/hd-web-sdk
```

### CDN Installation

```html
<script src="https://unpkg.com/@onekeyfe/hd-web-sdk@latest/dist/index.js"></script>
```

### TypeScript Support

```bash
npm install @onekeyfe/hd-web-sdk @types/w3c-web-usb
```

## Browser Compatibility Matrix

### WebUSB Support

| Browser | Version | WebUSB | Bridge | Notes |
|---------|---------|--------|--------|-------|
| Chrome | 61+ | ✅ | ✅ | Full support, recommended |
| Edge | 79+ | ✅ | ✅ | Full support |
| Opera | 48+ | ✅ | ✅ | Full support |
| Firefox | All | ❌ | ✅ | Bridge required |
| Safari | All | ❌ | ✅ | Bridge required |
| Mobile Chrome | 61+ | ❌ | ✅ | WebUSB not supported on mobile |
| Mobile Safari | All | ❌ | ✅ | Bridge required |

### Feature Detection

```javascript
const detectBrowserCapabilities = () => {
  const capabilities = {
    webusb: !!navigator.usb,
    https: location.protocol === 'https:' || location.hostname === 'localhost',
    browser: getBrowserInfo(),
    mobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    version: getBrowserVersion()
  };

  return capabilities;
};
        appName: 'Your Web App',
        appUrl: 'https://yourapp.com'
    }
});
```

### Environment Configuration

```javascript
// Development vs Production configuration
const config = {
    debug: process.env.NODE_ENV === 'development',
    connectSrc: process.env.NODE_ENV === 'development' 
        ? 'http://localhost:8088/' 
        : 'https://jssdk.onekey.so/',
    manifest: {
        email: 'developer@yourapp.com',
        appName: 'Your Web App',
        appUrl: process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : 'https://yourapp.com'
    }
};

await HardwareSDK.init(config);
```

## Security Requirements

### HTTPS Requirement

WebUSB requires HTTPS in production environments:

```javascript
// Check if running on secure context
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    console.error('OneKey Web SDK requires HTTPS in production');
    // Show user message about HTTPS requirement
}
```

### Content Security Policy

Configure CSP to allow OneKey Connect iframe:

```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    frame-src https://jssdk.onekey.so;
    connect-src https://jssdk.onekey.so;
    script-src 'self' 'unsafe-inline';
">
```

### Permissions Handling

```javascript
// Check WebUSB support
const checkWebUSBSupport = () => {
    if (!navigator.usb) {
        throw new Error('WebUSB not supported in this browser');
    }
    
    return true;
};

// Request device permissions (must be called from user gesture)
const requestDeviceAccess = async () => {
    try {
        // This will trigger browser permission dialog
        const devices = await HardwareSDK.searchDevices();
        return devices.length > 0;
    } catch (error) {
        if (error.message.includes('user gesture')) {
            throw new Error('Device access must be requested from user interaction');
        }
        throw error;
    }
};
```

## Framework Integration

### React Integration

```jsx
import React, { useState, useEffect, useCallback } from 'react';
import { HardwareSDK } from '@onekeyfe/hd-web-sdk';

const OneKeyProvider = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [device, setDevice] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        initializeSDK();
    }, []);

    const initializeSDK = async () => {
        try {
            await HardwareSDK.init({
                debug: process.env.NODE_ENV === 'development',
                connectSrc: 'https://jssdk.onekey.so/',
                manifest: {
                    email: 'developer@yourapp.com',
                    appName: 'React OneKey App',
                    appUrl: window.location.origin
                }
            });

            // Setup event listeners
            HardwareSDK.on('device-connect', setDevice);
            HardwareSDK.on('device-disconnect', () => setDevice(null));

            setIsInitialized(true);
        } catch (error) {
            setError(error.message);
        }
    };

    const connectDevice = useCallback(async () => {
        try {
            const devices = await HardwareSDK.searchDevices();
            if (devices.length > 0) {
                await HardwareSDK.connectDevice(devices[0].path);
            } else {
                throw new Error('No devices found');
            }
        } catch (error) {
            setError(error.message);
        }
    }, []);

    const value = {
        isInitialized,
        device,
        error,
        connectDevice,
        HardwareSDK
    };

    return (
        <OneKeyContext.Provider value={value}>
            {children}
        </OneKeyContext.Provider>
    );
};

// Custom hook for using OneKey
const useOneKey = () => {
    const context = useContext(OneKeyContext);
    if (!context) {
        throw new Error('useOneKey must be used within OneKeyProvider');
    }
    return context;
};

// Component using OneKey
const WalletComponent = () => {
    const { isInitialized, device, connectDevice, HardwareSDK } = useOneKey();
    const [address, setAddress] = useState('');

    const getAddress = async () => {
        try {
            const result = await HardwareSDK.btcGetAddress({
                path: "m/44'/0'/0'/0/0",
                showOnDevice: true,
                coin: 'btc'
            });

            if (result.success) {
                setAddress(result.payload.address);
            }
        } catch (error) {
            console.error('Failed to get address:', error);
        }
    };

    if (!isInitialized) {
        return <div>Initializing OneKey SDK...</div>;
    }

    return (
        <div>
            {!device ? (
                <button onClick={connectDevice}>Connect OneKey</button>
            ) : (
                <div>
                    <p>Connected: {device.label}</p>
                    <button onClick={getAddress}>Get Bitcoin Address</button>
                    {address && <p>Address: {address}</p>}
                </div>
            )}
        </div>
    );
};
```

### Vue.js Integration

```vue
<template>
    <div class="onekey-wallet">
        <div v-if="!isInitialized" class="loading">
            Initializing OneKey SDK...
        </div>
        
        <div v-else-if="!device" class="connect">
            <button @click="connectDevice" :disabled="connecting">
                {{ connecting ? 'Connecting...' : 'Connect OneKey' }}
            </button>
        </div>
        
        <div v-else class="connected">
            <h3>Connected: {{ device.label }}</h3>
            <button @click="getAddress" :disabled="loading">
                {{ loading ? 'Getting Address...' : 'Get Bitcoin Address' }}
            </button>
            <div v-if="address" class="address">
                <strong>Address:</strong> {{ address }}
            </div>
        </div>
        
        <div v-if="error" class="error">
            Error: {{ error }}
        </div>
    </div>
</template>

<script>
import { HardwareSDK } from '@onekeyfe/hd-web-sdk';

export default {
    name: 'OneKeyWallet',
    
    data() {
        return {
            isInitialized: false,
            device: null,
            address: '',
            error: null,
            connecting: false,
            loading: false
        };
    },
    
    async mounted() {
        await this.initializeSDK();
    },
    
    methods: {
        async initializeSDK() {
            try {
                await HardwareSDK.init({
                    debug: process.env.NODE_ENV === 'development',
                    connectSrc: 'https://jssdk.onekey.so/',
                    manifest: {
                        email: 'developer@yourapp.com',
                        appName: 'Vue OneKey App',
                        appUrl: window.location.origin
                    }
                });

                HardwareSDK.on('device-connect', (device) => {
                    this.device = device;
                    this.connecting = false;
                });

                HardwareSDK.on('device-disconnect', () => {
                    this.device = null;
                });

                this.isInitialized = true;
            } catch (error) {
                this.error = error.message;
            }
        },
        
        async connectDevice() {
            this.connecting = true;
            this.error = null;
            
            try {
                const devices = await HardwareSDK.searchDevices();
                if (devices.length > 0) {
                    await HardwareSDK.connectDevice(devices[0].path);
                } else {
                    throw new Error('No devices found');
                }
            } catch (error) {
                this.error = error.message;
                this.connecting = false;
            }
        },
        
        async getAddress() {
            this.loading = true;
            this.error = null;
            
            try {
                const result = await HardwareSDK.btcGetAddress({
                    path: "m/44'/0'/0'/0/0",
                    showOnDevice: true,
                    coin: 'btc'
                });

                if (result.success) {
                    this.address = result.payload.address;
                } else {
                    throw new Error(result.payload.error);
                }
            } catch (error) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

<style scoped>
.onekey-wallet {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
}

.loading, .connect, .connected {
    text-align: center;
    margin: 20px 0;
}

button {
    background: #007AFF;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.address {
    margin-top: 15px;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 4px;
    word-break: break-all;
}

.error {
    color: #ff3b30;
    margin-top: 10px;
    padding: 10px;
    background: #ffe6e6;
    border-radius: 4px;
}
</style>
```

### Angular Integration

```typescript
// onekey.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HardwareSDK } from '@onekeyfe/hd-web-sdk';

interface DeviceState {
    isInitialized: boolean;
    device: any | null;
    error: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class OneKeyService {
    private stateSubject = new BehaviorSubject<DeviceState>({
        isInitialized: false,
        device: null,
        error: null
    });

    public state$: Observable<DeviceState> = this.stateSubject.asObservable();

    constructor() {
        this.initializeSDK();
    }

    private async initializeSDK() {
        try {
            await HardwareSDK.init({
                debug: false,
                connectSrc: 'https://jssdk.onekey.so/',
                manifest: {
                    email: 'developer@yourapp.com',
                    appName: 'Angular OneKey App',
                    appUrl: window.location.origin
                }
            });

            HardwareSDK.on('device-connect', (device) => {
                this.updateState({ device, error: null });
            });

            HardwareSDK.on('device-disconnect', () => {
                this.updateState({ device: null });
            });

            this.updateState({ isInitialized: true });
        } catch (error) {
            this.updateState({ error: error.message });
        }
    }

    private updateState(updates: Partial<DeviceState>) {
        const currentState = this.stateSubject.value;
        this.stateSubject.next({ ...currentState, ...updates });
    }

    async connectDevice(): Promise<void> {
        try {
            const devices = await HardwareSDK.searchDevices();
            if (devices.length > 0) {
                await HardwareSDK.connectDevice(devices[0].path);
            } else {
                throw new Error('No devices found');
            }
        } catch (error) {
            this.updateState({ error: error.message });
            throw error;
        }
    }

    async getAddress(path: string, coin: string = 'btc'): Promise<string> {
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
}

// wallet.component.ts
import { Component, OnInit } from '@angular/core';
import { OneKeyService } from './onekey.service';

@Component({
    selector: 'app-wallet',
    template: `
        <div class="wallet-container">
            <div *ngIf="!state.isInitialized">
                Initializing OneKey SDK...
            </div>
            
            <div *ngIf="state.isInitialized && !state.device">
                <button (click)="connectDevice()" [disabled]="connecting">
                    {{ connecting ? 'Connecting...' : 'Connect OneKey' }}
                </button>
            </div>
            
            <div *ngIf="state.device">
                <h3>Connected: {{ state.device.label }}</h3>
                <button (click)="getAddress()" [disabled]="loading">
                    {{ loading ? 'Getting Address...' : 'Get Bitcoin Address' }}
                </button>
                <div *ngIf="address" class="address">
                    <strong>Address:</strong> {{ address }}
                </div>
            </div>
            
            <div *ngIf="state.error" class="error">
                Error: {{ state.error }}
            </div>
        </div>
    `
})
export class WalletComponent implements OnInit {
    state: any = {};
    address = '';
    connecting = false;
    loading = false;

    constructor(private oneKeyService: OneKeyService) {}

    ngOnInit() {
        this.oneKeyService.state$.subscribe(state => {
            this.state = state;
        });
    }

    async connectDevice() {
        this.connecting = true;
        try {
            await this.oneKeyService.connectDevice();
        } catch (error) {
            console.error('Connection failed:', error);
        } finally {
            this.connecting = false;
        }
    }

    async getAddress() {
        this.loading = true;
        try {
            this.address = await this.oneKeyService.getAddress("m/44'/0'/0'/0/0");
        } catch (error) {
            console.error('Failed to get address:', error);
        } finally {
            this.loading = false;
        }
    }
}
```

## Advanced Features

### Custom UI Handling

```javascript
// Custom PIN entry interface
HardwareSDK.on('ui-request_pin', async (event) => {
    const pin = await showCustomPinDialog(event.type);
    HardwareSDK.uiResponse({
        type: 'ui-receive_pin',
        payload: pin
    });
});

const showCustomPinDialog = (pinType) => {
    return new Promise((resolve) => {
        // Create custom PIN matrix UI
        const modal = createPinModal(pinType);
        document.body.appendChild(modal);
        
        // Handle PIN input and resolve with result
        modal.addEventListener('pin-entered', (event) => {
            resolve(event.detail.pin);
            document.body.removeChild(modal);
        });
    });
};
```

### Connection Management

```javascript
class WebConnectionManager {
    constructor() {
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 3;
    }
    
    async initialize() {
        await HardwareSDK.init({
            debug: false,
            connectSrc: 'https://jssdk.onekey.so/',
            manifest: {
                email: 'developer@yourapp.com',
                appName: 'Web Connection Manager',
                appUrl: window.location.origin
            }
        });
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        HardwareSDK.on('device-connect', () => {
            this.isConnected = true;
            this.reconnectAttempts = 0;
        });
        
        HardwareSDK.on('device-disconnect', () => {
            this.isConnected = false;
            this.attemptReconnection();
        });
    }
    
    async attemptReconnection() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('Max reconnection attempts reached');
            return;
        }
        
        this.reconnectAttempts++;
        console.log(`Reconnection attempt ${this.reconnectAttempts}`);
        
        setTimeout(async () => {
            try {
                const devices = await HardwareSDK.searchDevices();
                if (devices.length > 0) {
                    await HardwareSDK.connectDevice(devices[0].path);
                }
            } catch (error) {
                console.log('Reconnection failed:', error);
            }
        }, 2000 * this.reconnectAttempts);
    }
}
```

## Performance Optimization

### Lazy Loading

```javascript
// Lazy load OneKey SDK
const loadOneKeySDK = async () => {
    if (!window.OneKeySDK) {
        const { HardwareSDK } = await import('@onekeyfe/hd-web-sdk');
        window.OneKeySDK = HardwareSDK;
    }
    return window.OneKeySDK;
};

// Use when needed
const connectWallet = async () => {
    const HardwareSDK = await loadOneKeySDK();
    
    await HardwareSDK.init({
        // configuration
    });
    
    // Continue with connection logic
};
```

### Caching Strategies

```javascript
// Cache device information
const deviceCache = {
    lastConnectedDevice: null,
    deviceFeatures: null,
    
    save(device, features) {
        this.lastConnectedDevice = device;
        this.deviceFeatures = features;
        
        localStorage.setItem('onekey_device_cache', JSON.stringify({
            device: device.path,
            features,
            timestamp: Date.now()
        }));
    },
    
    load() {
        try {
            const cached = JSON.parse(localStorage.getItem('onekey_device_cache'));
            if (cached && Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
                return cached;
            }
        } catch (error) {
            console.log('Failed to load device cache');
        }
        return null;
    }
};
```

## Troubleshooting

### Common Issues

**WebUSB not working:**
- Ensure HTTPS connection
- Use supported browser (Chrome, Edge, Opera)
- Grant device permissions when prompted

**Iframe loading failed:**
- Check `connectSrc` URL accessibility
- Verify CORS settings
- Ensure CSP allows iframe

**Device not found:**
- Connect device via USB
- Unlock the device
- Try different USB cable/port

### Debug Mode

```javascript
// Enable debug mode for troubleshooting
await HardwareSDK.init({
    debug: true,
    connectSrc: 'https://jssdk.onekey.so/',
    manifest: { /* ... */ }
});

// Monitor debug events
HardwareSDK.on('transport-debug', (event) => {
    console.log('Transport debug:', event);
});
```

## Next Steps

- [Node.js & Electron Integration](nodejs-electron.md) - Desktop applications
- [React Native Integration](react-native.md) - Mobile applications
- [Best Practices](best-practices.md) - Production-ready patterns
- [API Reference](../api/device.md) - Complete API documentation
