# React Native BLE (hd-ble-sdk)

{% hint style="info" %}
Demo: React Native / Expo example → https://github.com/OneKeyHQ/hardware-js-sdk/tree/develop/packages/connect-examples/react-native-demo
{% endhint %}

This guide shows how to use the pure React Native BLE stack with `@onekeyfe/hd-ble-sdk` and `@onekeyfe/hd-transport-react-native`. No WebView or low-level adapter is required. The chain API usage stays the same as in Quick Start.

## Install

```bash
npm i @onekeyfe/hd-ble-sdk @onekeyfe/hd-transport-react-native
```

Optional polyfills (depending on your project):

```bash
npm i buffer process react-native-get-random-values react-native-url-polyfill
```

In your app entry (e.g., `index.js` or `App.tsx`):

```ts
// Polyfills (adjust to your project needs)
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
// @ts-ignore
global.Buffer = global.Buffer || require('buffer').Buffer;
// @ts-ignore
global.process = global.process || require('process');

// Register RN transport side-effects before SDK init
import '@onekeyfe/hd-transport-react-native';

import HardwareSDK from '@onekeyfe/hd-ble-sdk';
```

## Android setup

Add permissions in `AndroidManifest.xml` (Android 12+):

```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>

<uses-permission android:name="android.permission.BLUETOOTH" android:maxSdkVersion="30"/>
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" android:maxSdkVersion="30"/>
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" android:usesPermissionFlags="neverForLocation"/>
<uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE"/>
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT"/>
```

At runtime, request `BLUETOOTH_SCAN` and `BLUETOOTH_CONNECT` (and location on Android 12+).

## iOS setup

Add to `Info.plist`:

- `NSBluetoothAlwaysUsageDescription` (required)
- Optionally `NSBluetoothPeripheralUsageDescription` for older iOS versions

## Initialize and subscribe to events

```ts
export async function setupBle() {
  await HardwareSDK.init({
    env: 'webble',                 // React Native BLE transport
    debug: __DEV__,
    fetchConfig: true,
  });

  // Subscribe to UI events (PIN / Passphrase / confirmations)
  // import { UI_EVENT, UI_REQUEST, UI_RESPONSE } from '@onekeyfe/hd-core'
  // HardwareSDK.on(UI_EVENT, (msg) => { /* open dialogs and reply via HardwareSDK.uiResponse(...) */ });
}
```

## Discover devices and identify device_id

```ts
const devices = await HardwareSDK.searchDevices();
if (!devices.success) throw new Error(devices.payload.error);

// BLE returns id + name; fetch features to obtain device_id
const candidate = devices.payload[0];
const connectId = candidate.connectId;

const features = await HardwareSDK.getFeatures(connectId);
if (!features.success) throw new Error(features.payload.error);
const deviceId = features.payload.device_id;
```

Persist `connectId` and `deviceId` (most chain APIs require both).

## First call example (BTC address)

```ts
const res = await HardwareSDK.btcGetAddress(connectId, deviceId, {
  path: "m/44'/0'/0'/0/0",
  coin: 'btc',
  showOnOneKey: false,
});

if (res.success) {
  console.log('BTC address:', res.payload.address);
} else {
  console.error('Error:', res.payload.error, res.payload.code);
}
```

## Tips

- Always subscribe early to `UI_EVENT` so PIN/Passphrase/confirmations do not stall requests.
- Keep BLE permissions in sync with the OS version. Test on physical devices.
- For additional examples, check `hardware-js-sdk/packages/connect-examples/react-native-demo`.

## Continue

- Quick Start (response shapes, event handling): `../quick-start.md`
- Error codes and common params: `../hardware-sdk/error-code.md`, `../hardware-sdk/common-params.md`
- Protocol framing (64 bytes, for reference only): `../explanations/hardware-sdk/onekey-message-protocol.md`
