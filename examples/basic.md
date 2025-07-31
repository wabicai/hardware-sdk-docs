---
icon: code
---

# Basic Examples

Complete working examples for common OneKey SDK use cases across different platforms.

## Web Application Example

### Simple Wallet Interface

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OneKey Web Wallet</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .button { padding: 10px 20px; margin: 10px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
        .button:disabled { background: #ccc; cursor: not-allowed; }
        .result { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; }
        .error { background: #f8d7da; color: #721c24; }
        .success { background: #d4edda; color: #155724; }
        .address { font-family: monospace; word-break: break-all; }
    </style>
</head>
<body>
    <h1>OneKey Web Wallet</h1>
    
    <div>
        <button class="button" onclick="connectWallet()">Connect Wallet</button>
        <button class="button" onclick="getBitcoinAddress()">Get Bitcoin Address</button>
        <button class="button" onclick="getEthereumAddress()">Get Ethereum Address</button>
        <button class="button" onclick="signMessage()">Sign Message</button>
    </div>
    
    <div id="status"></div>
    <div id="result"></div>

    <script src="https://unpkg.com/@onekey/hardware-web-sdk"></script>
    <script>
        let sdk;
        let connected = false;

        // Initialize SDK
        function initSDK() {
            sdk = new OneKeySDK({
                debug: true,
                manifest: {
                    email: 'developer@example.com',
                    appName: 'OneKey Web Wallet',
                    appUrl: window.location.origin
                }
            });
        }

        // Show status message
        function showStatus(message, isError = false) {
            const statusDiv = document.getElementById('status');
            statusDiv.className = `result ${isError ? 'error' : 'success'}`;
            statusDiv.innerHTML = message;
        }

        // Show result
        function showResult(data) {
            const resultDiv = document.getElementById('result');
            resultDiv.className = 'result';
            resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        }

        // Connect to wallet
        async function connectWallet() {
            if (!sdk) initSDK();
            
            try {
                showStatus('Connecting to OneKey device...');
                
                const features = await sdk.getFeatures();
                connected = true;
                
                showStatus(`✅ Connected to ${features.model}`);
                showResult({
                    model: features.model,
                    firmware: `${features.major_version}.${features.minor_version}.${features.patch_version}`,
                    deviceId: features.device_id
                });
                
            } catch (error) {
                showStatus(`❌ Connection failed: ${error.message}`, true);
            }
        }

        // Get Bitcoin address
        async function getBitcoinAddress() {
            if (!connected) {
                showStatus('Please connect wallet first', true);
                return;
            }

            try {
                showStatus('Getting Bitcoin address...');
                
                const result = await sdk.btcGetAddress({
                    path: "m/44'/0'/0'/0/0",
                    showOnDevice: true,
                    coin: 'btc'
                });

                if (result.success) {
                    showStatus('✅ Bitcoin address retrieved');
                    showResult({
                        address: result.payload.address,
                        path: result.payload.path
                    });
                } else {
                    showStatus(`❌ Error: ${result.payload.error}`, true);
                }
                
            } catch (error) {
                showStatus(`❌ Error: ${error.message}`, true);
            }
        }

        // Get Ethereum address
        async function getEthereumAddress() {
            if (!connected) {
                showStatus('Please connect wallet first', true);
                return;
            }

            try {
                showStatus('Getting Ethereum address...');
                
                const result = await sdk.ethereumGetAddress({
                    path: "m/44'/60'/0'/0/0",
                    showOnDevice: true
                });

                if (result.success) {
                    showStatus('✅ Ethereum address retrieved');
                    showResult({
                        address: result.payload.address,
                        path: result.payload.path
                    });
                } else {
                    showStatus(`❌ Error: ${result.payload.error}`, true);
                }
                
            } catch (error) {
                showStatus(`❌ Error: ${error.message}`, true);
            }
        }

        // Sign message
        async function signMessage() {
            if (!connected) {
                showStatus('Please connect wallet first', true);
                return;
            }

            const message = prompt('Enter message to sign:', 'Hello OneKey!');
            if (!message) return;

            try {
                showStatus('Signing message...');
                
                const result = await sdk.btcSignMessage({
                    path: "m/44'/0'/0'/0/0",
                    message: message,
                    coin: 'btc'
                });

                if (result.success) {
                    showStatus('✅ Message signed');
                    showResult({
                        message: message,
                        signature: result.payload.signature,
                        address: result.payload.address
                    });
                } else {
                    showStatus(`❌ Error: ${result.payload.error}`, true);
                }
                
            } catch (error) {
                showStatus(`❌ Error: ${error.message}`, true);
            }
        }

        // Initialize on page load
        window.addEventListener('load', initSDK);
    </script>
</body>
</html>
```

## Node.js CLI Example

### Bitcoin Wallet CLI

```javascript
#!/usr/bin/env node

const OneKeySDK = require('@onekey/hardware-js-sdk');
const readline = require('readline');

class OneKeyWalletCLI {
    constructor() {
        this.sdk = new OneKeySDK({
            manifest: {
                email: 'developer@example.com',
                appName: 'OneKey CLI Wallet',
                appUrl: 'https://example.com'
            }
        });
        
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        this.connected = false;
    }

    async start() {
        console.log('🔐 OneKey CLI Wallet');
        console.log('====================\n');
        
        try {
            await this.connectDevice();
            await this.showMainMenu();
        } catch (error) {
            console.error('❌ Startup error:', error.message);
            process.exit(1);
        }
    }

    async connectDevice() {
        console.log('🔍 Searching for OneKey devices...');
        
        const devices = await this.sdk.searchDevices();
        
        if (devices.length === 0) {
            throw new Error('No OneKey devices found. Please connect your device.');
        }
        
        console.log(`📱 Found ${devices.length} device(s)`);
        
        await this.sdk.connectDevice(devices[0].path);
        
        const features = await this.sdk.getFeatures();
        this.connected = true;
        
        console.log(`✅ Connected to ${features.model}`);
        console.log(`📋 Firmware: ${features.major_version}.${features.minor_version}.${features.patch_version}`);
        console.log(`🏷️  Label: ${features.label || 'Unnamed'}\n`);
    }

    async showMainMenu() {
        console.log('📋 Main Menu:');
        console.log('1. Get Bitcoin address');
        console.log('2. Get Ethereum address');
        console.log('3. Sign Bitcoin message');
        console.log('4. Get multiple addresses');
        console.log('5. Device information');
        console.log('6. Exit\n');
        
        this.rl.question('Select option (1-6): ', async (choice) => {
            try {
                switch (choice) {
                    case '1':
                        await this.getBitcoinAddress();
                        break;
                    case '2':
                        await this.getEthereumAddress();
                        break;
                    case '3':
                        await this.signMessage();
                        break;
                    case '4':
                        await this.getMultipleAddresses();
                        break;
                    case '5':
                        await this.showDeviceInfo();
                        break;
                    case '6':
                        console.log('👋 Goodbye!');
                        process.exit(0);
                        break;
                    default:
                        console.log('❌ Invalid option\n');
                }
            } catch (error) {
                console.error('❌ Error:', error.message);
            }
            
            setTimeout(() => this.showMainMenu(), 1000);
        });
    }

    async getBitcoinAddress() {
        console.log('\n🪙 Getting Bitcoin address...');
        
        const result = await this.sdk.btcGetAddress({
            path: "m/44'/0'/0'/0/0",
            showOnDevice: true,
            coin: 'btc'
        });

        if (result.success) {
            console.log('✅ Bitcoin Address:');
            console.log(`   Address: ${result.payload.address}`);
            console.log(`   Path: ${result.payload.path}`);
        } else {
            console.log('❌ Error:', result.payload.error);
        }
        console.log();
    }

    async getEthereumAddress() {
        console.log('\n🔷 Getting Ethereum address...');
        
        const result = await this.sdk.ethereumGetAddress({
            path: "m/44'/60'/0'/0/0",
            showOnDevice: true
        });

        if (result.success) {
            console.log('✅ Ethereum Address:');
            console.log(`   Address: ${result.payload.address}`);
            console.log(`   Path: ${result.payload.path}`);
        } else {
            console.log('❌ Error:', result.payload.error);
        }
        console.log();
    }

    async signMessage() {
        console.log('\n✍️  Message Signing...');
        
        const message = await this.askQuestion('Enter message to sign: ');
        
        const result = await this.sdk.btcSignMessage({
            path: "m/44'/0'/0'/0/0",
            message: message,
            coin: 'btc'
        });

        if (result.success) {
            console.log('✅ Message Signed:');
            console.log(`   Message: ${message}`);
            console.log(`   Signature: ${result.payload.signature}`);
            console.log(`   Address: ${result.payload.address}`);
        } else {
            console.log('❌ Error:', result.payload.error);
        }
        console.log();
    }

    async getMultipleAddresses() {
        console.log('\n📋 Getting multiple addresses...');
        
        const paths = [
            "m/44'/0'/0'/0/0",
            "m/44'/0'/0'/0/1",
            "m/44'/0'/0'/0/2",
            "m/44'/60'/0'/0/0",
            "m/44'/60'/0'/0/1"
        ];

        console.log('🔄 Generating addresses (this may take a moment)...');
        
        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            const isBitcoin = path.includes("44'/0'");
            
            try {
                let result;
                if (isBitcoin) {
                    result = await this.sdk.btcGetAddress({
                        path,
                        showOnDevice: false,
                        coin: 'btc'
                    });
                } else {
                    result = await this.sdk.ethereumGetAddress({
                        path,
                        showOnDevice: false
                    });
                }

                if (result.success) {
                    const coin = isBitcoin ? 'BTC' : 'ETH';
                    console.log(`   ${coin} ${path}: ${result.payload.address}`);
                } else {
                    console.log(`   ❌ ${path}: ${result.payload.error}`);
                }
            } catch (error) {
                console.log(`   ❌ ${path}: ${error.message}`);
            }
        }
        console.log();
    }

    async showDeviceInfo() {
        console.log('\n📱 Device Information:');
        
        const features = await this.sdk.getFeatures();
        
        console.log(`   Model: ${features.model}`);
        console.log(`   Firmware: ${features.major_version}.${features.minor_version}.${features.patch_version}`);
        console.log(`   Device ID: ${features.device_id}`);
        console.log(`   Label: ${features.label || 'Unnamed'}`);
        console.log(`   PIN Protection: ${features.pin_protection ? 'Enabled' : 'Disabled'}`);
        console.log(`   Passphrase Protection: ${features.passphrase_protection ? 'Enabled' : 'Disabled'}`);
        console.log(`   Initialized: ${features.initialized ? 'Yes' : 'No'}`);
        console.log();
    }

    askQuestion(question) {
        return new Promise((resolve) => {
            this.rl.question(question, resolve);
        });
    }

    async cleanup() {
        try {
            await this.sdk.disconnect();
            this.rl.close();
        } catch (error) {
            console.error('Cleanup error:', error.message);
        }
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n\n👋 Shutting down...');
    process.exit(0);
});

// Start the CLI
const cli = new OneKeyWalletCLI();
cli.start().catch(console.error);
```

## React Component Example

### OneKey Wallet Hook

```javascript
// useOneKeyWallet.js
import { useState, useEffect, useCallback } from 'react';
import OneKeySDK from '@onekey/hardware-web-sdk';

export function useOneKeyWallet() {
    const [sdk, setSdk] = useState(null);
    const [connected, setConnected] = useState(false);
    const [device, setDevice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initialize SDK
    useEffect(() => {
        const sdkInstance = new OneKeySDK({
            debug: process.env.NODE_ENV === 'development',
            manifest: {
                email: 'developer@yourapp.com',
                appName: 'React OneKey App',
                appUrl: window.location.origin
            }
        });
        
        setSdk(sdkInstance);
    }, []);

    // Connect to device
    const connect = useCallback(async () => {
        if (!sdk) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const features = await sdk.getFeatures();
            setDevice(features);
            setConnected(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [sdk]);

    // Get Bitcoin address
    const getBitcoinAddress = useCallback(async (path = "m/44'/0'/0'/0/0", showOnDevice = true) => {
        if (!sdk || !connected) throw new Error('Device not connected');
        
        const result = await sdk.btcGetAddress({
            path,
            showOnDevice,
            coin: 'btc'
        });
        
        if (!result.success) {
            throw new Error(result.payload.error);
        }
        
        return result.payload;
    }, [sdk, connected]);

    // Get Ethereum address
    const getEthereumAddress = useCallback(async (path = "m/44'/60'/0'/0/0", showOnDevice = true) => {
        if (!sdk || !connected) throw new Error('Device not connected');
        
        const result = await sdk.ethereumGetAddress({
            path,
            showOnDevice
        });
        
        if (!result.success) {
            throw new Error(result.payload.error);
        }
        
        return result.payload;
    }, [sdk, connected]);

    // Sign message
    const signMessage = useCallback(async (message, path = "m/44'/0'/0'/0/0") => {
        if (!sdk || !connected) throw new Error('Device not connected');
        
        const result = await sdk.btcSignMessage({
            path,
            message,
            coin: 'btc'
        });
        
        if (!result.success) {
            throw new Error(result.payload.error);
        }
        
        return result.payload;
    }, [sdk, connected]);

    return {
        connected,
        device,
        loading,
        error,
        connect,
        getBitcoinAddress,
        getEthereumAddress,
        signMessage
    };
}

// OneKeyWallet.jsx
import React, { useState } from 'react';
import { useOneKeyWallet } from './useOneKeyWallet';

export function OneKeyWallet() {
    const {
        connected,
        device,
        loading,
        error,
        connect,
        getBitcoinAddress,
        getEthereumAddress,
        signMessage
    } = useOneKeyWallet();
    
    const [addresses, setAddresses] = useState({});
    const [signature, setSignature] = useState(null);

    const handleGetBitcoinAddress = async () => {
        try {
            const result = await getBitcoinAddress();
            setAddresses(prev => ({ ...prev, bitcoin: result.address }));
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleGetEthereumAddress = async () => {
        try {
            const result = await getEthereumAddress();
            setAddresses(prev => ({ ...prev, ethereum: result.address }));
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleSignMessage = async () => {
        const message = prompt('Enter message to sign:');
        if (!message) return;
        
        try {
            const result = await signMessage(message);
            setSignature(result);
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>OneKey Wallet</h1>
            
            {error && (
                <div style={{ color: 'red', marginBottom: '20px' }}>
                    Error: {error}
                </div>
            )}
            
            {!connected ? (
                <button onClick={connect} disabled={loading}>
                    {loading ? 'Connecting...' : 'Connect OneKey'}
                </button>
            ) : (
                <div>
                    <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '5px' }}>
                        <strong>Connected to:</strong> {device?.model}<br />
                        <strong>Firmware:</strong> {device?.major_version}.{device?.minor_version}.{device?.patch_version}
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <button onClick={handleGetBitcoinAddress} style={{ marginRight: '10px' }}>
                            Get Bitcoin Address
                        </button>
                        <button onClick={handleGetEthereumAddress} style={{ marginRight: '10px' }}>
                            Get Ethereum Address
                        </button>
                        <button onClick={handleSignMessage}>
                            Sign Message
                        </button>
                    </div>
                    
                    {addresses.bitcoin && (
                        <div style={{ marginBottom: '10px' }}>
                            <strong>Bitcoin:</strong> <code>{addresses.bitcoin}</code>
                        </div>
                    )}
                    
                    {addresses.ethereum && (
                        <div style={{ marginBottom: '10px' }}>
                            <strong>Ethereum:</strong> <code>{addresses.ethereum}</code>
                        </div>
                    )}
                    
                    {signature && (
                        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                            <strong>Message Signature:</strong><br />
                            <code style={{ wordBreak: 'break-all' }}>{signature.signature}</code>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
```

## Error Handling Example

```javascript
// errorHandler.js
export class OneKeyErrorHandler {
    static handle(error) {
        switch (error.code) {
            case 'Device_NotFound':
                return {
                    title: 'Device Not Found',
                    message: 'Please connect your OneKey device and try again.',
                    action: 'retry'
                };
            
            case 'User_Cancelled':
                return {
                    title: 'Operation Cancelled',
                    message: 'The operation was cancelled by the user.',
                    action: 'none'
                };
            
            case 'Transport_Missing':
                return {
                    title: 'Connection Issue',
                    message: 'Please install OneKey Bridge or use a supported browser.',
                    action: 'install_bridge'
                };
            
            case 'Permission_Denied':
                return {
                    title: 'Permission Denied',
                    message: 'Please grant the necessary permissions and try again.',
                    action: 'check_permissions'
                };
            
            default:
                return {
                    title: 'Unknown Error',
                    message: error.message || 'An unexpected error occurred.',
                    action: 'contact_support'
                };
        }
    }
    
    static getActionButton(action) {
        switch (action) {
            case 'retry':
                return { text: 'Retry', onClick: () => window.location.reload() };
            
            case 'install_bridge':
                return { 
                    text: 'Install Bridge', 
                    onClick: () => window.open('https://onekey.so/bridge', '_blank') 
                };
            
            case 'check_permissions':
                return { text: 'Check Permissions', onClick: () => alert('Please check browser permissions') };
            
            case 'contact_support':
                return { 
                    text: 'Contact Support', 
                    onClick: () => window.open('mailto:support@onekey.so', '_blank') 
                };
            
            default:
                return null;
        }
    }
}
```

## Next Steps

- [Advanced Examples](advanced.md) - Complex integration patterns
- [Integration Examples](integrations.md) - Real-world application examples
- [API Reference](../api/init.md) - Complete method documentation
- [Best Practices](../guides/best-practices.md) - Development guidelines
