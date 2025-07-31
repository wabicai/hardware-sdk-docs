---
icon: mobile
---

# React Native SDK

The OneKey React Native SDK (`@onekeyfe/hd-ble-sdk`) enables hardware wallet integration in mobile applications through Bluetooth Low Energy (BLE) communication and deep link support.

## Overview

The React Native SDK is designed for mobile environments and provides:

- **Bluetooth Low Energy (BLE)** - Wireless device communication
- **Deep Link Integration** - Seamless mobile app workflows
- **Platform Permissions** - Automatic iOS/Android permission handling
- **Mobile-Optimized UI** - Touch-friendly interaction flows

## Installation

```bash
npm install @onekeyfe/hd-ble-sdk
# or
yarn add @onekeyfe/hd-ble-sdk
```

### Platform Setup

#### iOS Setup

Add Bluetooth permissions to `ios/YourApp/Info.plist`:

```xml
<key>NSBluetoothAlwaysUsageDescription</key>
<string>This app needs Bluetooth to communicate with OneKey hardware wallet</string>
<key>NSBluetoothPeripheralUsageDescription</key>
<string>This app needs Bluetooth to communicate with OneKey hardware wallet</string>
```

For iOS 13+, also add:

```xml
<key>NSBluetoothAlwaysUsageDescription</key>
<string>This app needs Bluetooth to communicate with OneKey hardware wallet</string>
```

#### Android Setup

Add permissions to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

<!-- For Android 12+ -->
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
```

## Basic Setup

```javascript
import { HardwareSDK } from '@onekeyfe/hd-ble-sdk';
import { Linking } from 'react-native';

await HardwareSDK.init({
    debug: false,
    manifest: {
        email: 'developer@yourapp.com',
        appName: 'Your Mobile App',
        appUrl: 'https://yourapp.com'
    },
    deeplinkOpen: (url) => Linking.openURL(url),
    deeplinkCallbackUrl: 'yourapp://onekey-callback'
});
```

## Configuration Options

### Required Configuration

```javascript
await HardwareSDK.init({
    // Application manifest
    manifest: {
        email: 'developer@yourapp.com',
        appName: 'Your Mobile App',
        appUrl: 'https://yourapp.com'
    },
    
    // Deep link configuration
    deeplinkOpen: (url) => Linking.openURL(url),
    deeplinkCallbackUrl: 'yourapp://onekey-callback'
});
```

### Optional Configuration

```javascript
await HardwareSDK.init({
    // Debug mode
    debug: process.env.NODE_ENV === 'development',
    
    // Manifest
    manifest: {
        email: 'developer@yourapp.com',
        appName: 'Advanced Mobile App',
        appUrl: 'https://yourapp.com'
    },
    
    // Deep link settings
    deeplinkOpen: (url) => Linking.openURL(url),
    deeplinkCallbackUrl: 'yourapp://onekey-callback',
    
    // BLE settings
    bleTimeout: 30000,           // BLE connection timeout
    bleScanTimeout: 10000,       // BLE scan timeout
    
    // Transport settings
    transportReconnect: true,     // Auto-reconnect
    pendingTransportEvent: true   // Handle pending events
});
```

## Deep Link Setup

### URL Scheme Registration

#### iOS (ios/YourApp/Info.plist)

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>yourapp</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>yourapp</string>
        </array>
    </dict>
</array>
```

#### Android (android/app/src/main/AndroidManifest.xml)

```xml
<activity
    android:name=".MainActivity"
    android:exported="true"
    android:launchMode="singleTop">
    
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="yourapp" />
    </intent-filter>
</activity>
```

### Deep Link Handling

```javascript
import { Linking } from 'react-native';

// Handle incoming deep links
useEffect(() => {
    const handleDeepLink = (url) => {
        console.log('Received deep link:', url);
        // Handle OneKey callback
        if (url.startsWith('yourapp://onekey-callback')) {
            // Process the callback
        }
    };

    // Listen for deep links
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Handle app launch from deep link
    Linking.getInitialURL().then((url) => {
        if (url) {
            handleDeepLink(url);
        }
    });

    return () => subscription?.remove();
}, []);
```

## BLE Device Management

### Device Discovery

```javascript
// Search for BLE devices
const devices = await HardwareSDK.searchDevices();

devices.forEach(device => {
    console.log(`Device: ${device.name}`);
    console.log(`ID: ${device.id}`);
    console.log(`RSSI: ${device.rssi}`);
});
```

### Device Connection

```javascript
// Connect to a specific device
if (devices.length > 0) {
    await HardwareSDK.connectDevice(devices[0].id);
    console.log('Connected via BLE');
}

// Check connection status
const isConnected = await HardwareSDK.isDeviceConnected();
console.log('Device connected:', isConnected);
```

### Connection Management

```javascript
class BLEDeviceManager {
    constructor() {
        this.device = null;
        this.isConnected = false;
        this.isScanning = false;
    }
    
    async initialize() {
        await HardwareSDK.init({
            debug: false,
            manifest: {
                email: 'developer@yourapp.com',
                appName: 'BLE Manager',
                appUrl: 'https://yourapp.com'
            },
            deeplinkOpen: (url) => Linking.openURL(url),
            deeplinkCallbackUrl: 'yourapp://onekey-callback'
        });
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        HardwareSDK.on('device-connect', (device) => {
            this.device = device;
            this.isConnected = true;
            console.log('BLE device connected:', device.name);
        });
        
        HardwareSDK.on('device-disconnect', () => {
            this.device = null;
            this.isConnected = false;
            console.log('BLE device disconnected');
        });
    }
    
    async scanAndConnect() {
        if (this.isScanning) return;
        
        this.isScanning = true;
        
        try {
            const devices = await HardwareSDK.searchDevices();
            
            if (devices.length > 0) {
                // Connect to the strongest signal device
                const bestDevice = devices.reduce((prev, current) => 
                    (prev.rssi > current.rssi) ? prev : current
                );
                
                await HardwareSDK.connectDevice(bestDevice.id);
                return bestDevice;
            } else {
                throw new Error('No devices found');
            }
        } finally {
            this.isScanning = false;
        }
    }
    
    async ensureConnected() {
        if (!this.isConnected) {
            await this.scanAndConnect();
        }
    }
}
```

## React Native Component Example

```jsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { HardwareSDK } from '@onekeyfe/hd-ble-sdk';
import { Linking } from 'react-native';

const OneKeyWallet = () => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [device, setDevice] = useState(null);
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        initializeSDK();
    }, []);

    const initializeSDK = async () => {
        try {
            await HardwareSDK.init({
                debug: __DEV__,
                manifest: {
                    email: 'developer@yourapp.com',
                    appName: 'OneKey Mobile App',
                    appUrl: 'https://yourapp.com'
                },
                deeplinkOpen: (url) => Linking.openURL(url),
                deeplinkCallbackUrl: 'yourapp://onekey-callback'
            });

            // Setup event listeners
            HardwareSDK.on('device-connect', (device) => {
                setDevice(device);
                Alert.alert('Success', `Connected to ${device.name}`);
            });

            HardwareSDK.on('device-disconnect', () => {
                setDevice(null);
                Alert.alert('Info', 'Device disconnected');
            });

            setIsInitialized(true);
        } catch (error) {
            Alert.alert('Error', `SDK initialization failed: ${error.message}`);
        }
    };

    const connectDevice = async () => {
        setLoading(true);
        
        try {
            const devices = await HardwareSDK.searchDevices();
            
            if (devices.length === 0) {
                Alert.alert('Error', 'No OneKey devices found. Please ensure your device is nearby and in pairing mode.');
                return;
            }

            // Show device selection if multiple devices
            if (devices.length > 1) {
                // Implement device selection UI
                showDeviceSelection(devices);
            } else {
                await HardwareSDK.connectDevice(devices[0].id);
            }
        } catch (error) {
            Alert.alert('Error', `Connection failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const getAddress = async () => {
        setLoading(true);
        
        try {
            const result = await HardwareSDK.btcGetAddress({
                path: "m/44'/0'/0'/0/0",
                showOnDevice: true,
                coin: 'btc'
            });

            if (result.success) {
                setAddress(result.payload.address);
                Alert.alert('Success', 'Address retrieved! Please verify on your device.');
            } else {
                Alert.alert('Error', result.payload.error);
            }
        } catch (error) {
            Alert.alert('Error', `Failed to get address: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const showDeviceSelection = (devices) => {
        const deviceNames = devices.map(d => d.name);
        
        Alert.alert(
            'Select Device',
            'Multiple devices found',
            devices.map((device, index) => ({
                text: `${device.name} (${device.rssi}dBm)`,
                onPress: () => HardwareSDK.connectDevice(device.id)
            }))
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>OneKey Mobile Wallet</Text>
            
            {!isInitialized && (
                <Text style={styles.status}>Initializing SDK...</Text>
            )}
            
            {isInitialized && !device && (
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={connectDevice}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.buttonText}>Connect OneKey</Text>
                    )}
                </TouchableOpacity>
            )}
            
            {device && (
                <View style={styles.deviceInfo}>
                    <Text style={styles.deviceText}>
                        Connected: {device.name}
                    </Text>
                    
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={getAddress}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Get Bitcoin Address</Text>
                        )}
                    </TouchableOpacity>
                    
                    {address && (
                        <View style={styles.addressContainer}>
                            <Text style={styles.addressLabel}>Bitcoin Address:</Text>
                            <Text style={styles.addressText}>{address}</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333'
    },
    status: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 8,
        marginVertical: 10,
        minWidth: 200,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    },
    deviceInfo: {
        alignItems: 'center',
        width: '100%'
    },
    deviceText: {
        fontSize: 18,
        color: '#333',
        marginBottom: 20
    },
    addressContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 8,
        width: '100%'
    },
    addressLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 5
    },
    addressText: {
        fontSize: 12,
        fontFamily: 'monospace',
        color: '#333',
        backgroundColor: '#f8f8f8',
        padding: 10,
        borderRadius: 4
    }
});

export default OneKeyWallet;
```

## Permission Handling

### Request Permissions

```javascript
import { PermissionsAndroid, Platform } from 'react-native';

const requestBluetoothPermissions = async () => {
    if (Platform.OS === 'android') {
        const permissions = [
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        ];

        const granted = await PermissionsAndroid.requestMultiple(permissions);
        
        const allGranted = permissions.every(permission => 
            granted[permission] === PermissionsAndroid.RESULTS.GRANTED
        );

        if (!allGranted) {
            Alert.alert('Error', 'Bluetooth permissions are required');
            return false;
        }
    }
    
    return true;
};

// Use before connecting
const connectWithPermissions = async () => {
    const hasPermissions = await requestBluetoothPermissions();
    if (hasPermissions) {
        await connectDevice();
    }
};
```

## Error Handling

```javascript
const handleSDKError = (error) => {
    switch (error.code) {
        case 'BLUETOOTH_NOT_ENABLED':
            Alert.alert(
                'Bluetooth Required',
                'Please enable Bluetooth to connect to your OneKey device',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Settings', onPress: () => Linking.openSettings() }
                ]
            );
            break;
            
        case 'DEVICE_NOT_FOUND':
            Alert.alert(
                'Device Not Found',
                'Make sure your OneKey device is nearby and in pairing mode'
            );
            break;
            
        case 'CONNECTION_TIMEOUT':
            Alert.alert(
                'Connection Timeout',
                'Failed to connect to device. Please try again.'
            );
            break;
            
        default:
            Alert.alert('Error', error.message);
    }
};
```

## Performance Optimization

```javascript
// Connection caching
class ConnectionCache {
    constructor() {
        this.cachedDevice = null;
        this.lastConnected = null;
    }
    
    async connectToLastDevice() {
        if (this.cachedDevice && this.lastConnected) {
            const timeSinceLastConnection = Date.now() - this.lastConnected;
            
            // Try to reconnect if less than 5 minutes
            if (timeSinceLastConnection < 5 * 60 * 1000) {
                try {
                    await HardwareSDK.connectDevice(this.cachedDevice.id);
                    return true;
                } catch (error) {
                    console.log('Failed to reconnect to cached device');
                }
            }
        }
        
        return false;
    }
    
    cacheDevice(device) {
        this.cachedDevice = device;
        this.lastConnected = Date.now();
    }
}
```

## Next Steps

- [Transport Layer](transport.md) - Communication protocols
- [Events & Error Handling](events-errors.md) - Event system and error handling
- [Integration Guide](../integration/react-native.md) - Detailed React Native integration
- [API Reference](../api/device.md) - Complete API documentation
