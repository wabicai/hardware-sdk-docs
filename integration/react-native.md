---
icon: mobile
---

# React Native Integration

Complete guide for integrating OneKey Hardware SDK into React Native applications.

## Overview

OneKey React Native SDK enables mobile applications to communicate with OneKey hardware wallets via Bluetooth. This guide covers installation, setup, and implementation for both iOS and Android platforms.

## Prerequisites

- React Native 0.60+
- iOS 11.0+ / Android API 21+
- Bluetooth Low Energy (BLE) support
- OneKey device with Bluetooth capability (Mini, Touch)

## Installation

### Install the SDK

```bash
npm install @onekeyfe/hd-ble-sdk
```

### Install Dependencies

```bash
# React Native Bluetooth dependencies
npm install react-native-ble-manager
npm install react-native-permissions

# For iOS
cd ios && pod install
```

### Platform Configuration

#### iOS Configuration

Add Bluetooth permissions to `ios/YourApp/Info.plist`:

```xml
<key>NSBluetoothAlwaysUsageDescription</key>
<string>This app needs Bluetooth to connect to OneKey devices</string>
<key>NSBluetoothPeripheralUsageDescription</key>
<string>This app needs Bluetooth to connect to OneKey devices</string>
```

#### Android Configuration

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

### Initialize the SDK

```javascript
import { HardwareSDK } from '@onekeyfe/hd-ble-sdk';
import { PermissionsAndroid, Platform } from 'react-native';

const initializeSDK = async () => {
  try {
    // Request permissions first
    await requestPermissions();
    
    // Initialize SDK
    await HardwareSDK.init({
      debug: __DEV__,
      manifest: {
        email: 'developer@yourapp.com',
        appName: 'Your App Name',
        appUrl: 'https://yourapp.com'
      }
    });
    
    console.log('OneKey SDK initialized');
  } catch (error) {
    console.error('SDK initialization failed:', error);
  }
};

const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    ]);
    
    const allGranted = Object.values(granted).every(
      permission => permission === PermissionsAndroid.RESULTS.GRANTED
    );
    
    if (!allGranted) {
      throw new Error('Bluetooth permissions not granted');
    }
  }
};
```

### Device Discovery and Connection

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';

const DeviceManager = () => {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [scanning, setScanning] = useState(false);

  const scanForDevices = async () => {
    try {
      setScanning(true);
      const foundDevices = await HardwareSDK.searchDevices();
      setDevices(foundDevices);
    } catch (error) {
      Alert.alert('Error', 'Failed to scan for devices: ' + error.message);
    } finally {
      setScanning(false);
    }
  };

  const connectToDevice = async (device) => {
    try {
      await HardwareSDK.connectDevice(device.path);
      setConnectedDevice(device);
      Alert.alert('Success', 'Connected to ' + device.name);
    } catch (error) {
      Alert.alert('Error', 'Failed to connect: ' + error.message);
    }
  };

  const disconnectDevice = async () => {
    try {
      await HardwareSDK.disconnectDevice();
      setConnectedDevice(null);
      Alert.alert('Success', 'Device disconnected');
    } catch (error) {
      Alert.alert('Error', 'Failed to disconnect: ' + error.message);
    }
  };

  const renderDevice = ({ item }) => (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => connectToDevice(item)}
    >
      <Text style={styles.deviceName}>{item.name || 'OneKey Device'}</Text>
      <Text style={styles.deviceId}>{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OneKey Devices</Text>
      
      {connectedDevice ? (
        <View style={styles.connectedDevice}>
          <Text>Connected: {connectedDevice.name}</Text>
          <TouchableOpacity onPress={disconnectDevice}>
            <Text style={styles.button}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <TouchableOpacity onPress={scanForDevices} disabled={scanning}>
            <Text style={styles.button}>
              {scanning ? 'Scanning...' : 'Scan for Devices'}
            </Text>
          </TouchableOpacity>
          
          <FlatList
            data={devices}
            renderItem={renderDevice}
            keyExtractor={(item) => item.id}
            style={styles.deviceList}
          />
        </>
      )}
    </View>
  );
};
```

## Cryptocurrency Operations

### Bitcoin Address Generation

```javascript
const generateBitcoinAddress = async () => {
  try {
    const result = await HardwareSDK.btcGetAddress({
      path: "m/44'/0'/0'/0/0",
      coin: 'btc',
      showOnDevice: true
    });

    if (result.success) {
      return result.payload.address;
    } else {
      throw new Error(result.payload.error);
    }
  } catch (error) {
    console.error('Failed to generate Bitcoin address:', error);
    throw error;
  }
};

// Usage in component
const AddressGenerator = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateAddress = async () => {
    setLoading(true);
    try {
      const btcAddress = await generateBitcoinAddress();
      setAddress(btcAddress);
      Alert.alert('Success', 'Address generated: ' + btcAddress);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleGenerateAddress} disabled={loading}>
        <Text style={styles.button}>
          {loading ? 'Generating...' : 'Generate Bitcoin Address'}
        </Text>
      </TouchableOpacity>
      {address && <Text>Address: {address}</Text>}
    </View>
  );
};
```

### Ethereum Address Generation

```javascript
const generateEthereumAddress = async () => {
  try {
    const result = await HardwareSDK.evmGetAddress({
      path: "m/44'/60'/0'/0/0",
      showOnDevice: true
    });

    if (result.success) {
      return result.payload.address;
    } else {
      throw new Error(result.payload.error);
    }
  } catch (error) {
    console.error('Failed to generate Ethereum address:', error);
    throw error;
  }
};
```

### Transaction Signing

```javascript
const signBitcoinTransaction = async (transactionData) => {
  try {
    const result = await HardwareSDK.btcSignTransaction({
      coin: 'btc',
      inputs: transactionData.inputs,
      outputs: transactionData.outputs,
      refTxs: transactionData.refTxs
    });

    if (result.success) {
      return result.payload.serializedTx;
    } else {
      throw new Error(result.payload.error);
    }
  } catch (error) {
    console.error('Failed to sign Bitcoin transaction:', error);
    throw error;
  }
};

const signEthereumTransaction = async (transactionData) => {
  try {
    const result = await HardwareSDK.evmSignTransaction({
      path: "m/44'/60'/0'/0/0",
      transaction: {
        to: transactionData.to,
        value: transactionData.value,
        gasPrice: transactionData.gasPrice,
        gasLimit: transactionData.gasLimit,
        nonce: transactionData.nonce,
        data: transactionData.data || '0x'
      }
    });

    if (result.success) {
      return result.payload;
    } else {
      throw new Error(result.payload.error);
    }
  } catch (error) {
    console.error('Failed to sign Ethereum transaction:', error);
    throw error;
  }
};
```

## Next Steps

- [Best Practices](best-practices.md) - Production deployment guidelines
- [API Reference](../api/device.md) - Complete API documentation
- [Troubleshooting](../resources/troubleshooting.md) - Common issues and solutions
- [Examples](../quick-start/examples.md) - More code examples
