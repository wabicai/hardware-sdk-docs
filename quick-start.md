# Quick Start

Follow these steps to get a working OneKey Hardware SDK integration in minutes.

## 1. Install the SDK

```bash
npm install --save @onekeyfe/hd-common-connect-sdk
```

## 2. Initialize the transport

```typescript
import HardwareSDK from '@onekeyfe/hd-common-connect-sdk';

HardwareSDK.init({
  env: 'webusb',           // use 'webusb' for browsers, 'webble' for Web BLE, 'lowlevel' for native shells
  debug: process.env.NODE_ENV !== 'production',
  fetchConfig: true,
});
```

For native shells (iOS, Android, React Native, Electron), pass your low-level adapter as the third argument. See the individual transport recipes for concrete examples.

## 3. Subscribe to device events

```typescript
import { UI_EVENT, UI_REQUEST, UI_RESPONSE, CoreMessage } from '@onekeyfe/hd-core';

HardwareSDK.on(UI_EVENT, (message: CoreMessage) => {
  if (message.type === UI_REQUEST.REQUEST_PIN) {
    HardwareSDK.uiResponse({
      type: UI_RESPONSE.RECEIVE_PIN,
      payload: '@@ONEKEY_INPUT_PIN_IN_DEVICE',
    });
  }

  if (message.type === UI_REQUEST.REQUEST_PASSPHRASE) {
    HardwareSDK.uiResponse({
      type: UI_RESPONSE.RECEIVE_PASSPHRASE,
      payload: {
        value: '',
        passphraseOnDevice: true,
        save: false,
      },
    });
  }

  if (message.type === UI_REQUEST.REQUEST_BUTTON) {
    // Update your UI to remind the user to approve on the hardware wallet.
  }

  if (message.type === UI_REQUEST.CLOSE_UI_WINDOW) {
    // Dismiss any modals or banners you displayed during the request.
  }
});
```

## 4. Discover a device and fetch features

```typescript
const searchResult = await HardwareSDK.searchDevices();
if (!searchResult.success || searchResult.payload.length === 0) {
  throw new Error('No devices found');
}

const device = searchResult.payload[0];

const features = await HardwareSDK.getFeatures(device.connectId);
if (!features.success) {
  throw new Error(features.payload.error ?? 'Failed to get features');
}
```

Persist `connectId` and `deviceId` (returned by `getFeatures`) for subsequent API calls.

## 5. Call an API

```typescript
const addressResponse = await HardwareSDK.btcGetAddress(
  device.connectId,
  features.payload.deviceId,
  {
    path: "m/84'/0'/0'/0/0",
    coin: 'btc',
    showOnOneKey: true,
  },
);

if (!addressResponse.success) {
  throw new Error(addressResponse.payload.error ?? 'Failed to fetch address');
}

console.log('Address:', addressResponse.payload.address);
```

Every API returns `{ success: boolean, payload: {...} }`. When `success` is `false`, inspect `payload.error` and `payload.code`, then cross-check the [Error Code](references/hardware-sdk/api-reference/error-code.md) table.

## 6. Try the example project

Run the Expo Playground (`hardware-js-sdk/packages/connect-examples/expo-playground`) to see the WebUSB workflow in action:

```bash
git clone https://github.com/OneKeyHQ/hardware-js-sdk.git
cd hardware-js-sdk/packages/connect-examples/expo-playground
yarn
yarn start
```

Open http://localhost:3010 and follow the prompts. The playground includes the WebUSB user-gesture modal, transport switcher, and comprehensive logging you can mirror in production.

## 7. Continue with transport recipes

Choose the transport guide that matches your target platform:

- [Common Connect (WebUSB / native host)](transport-recipes/common-connect.md)
- [React Native BLE](transport-recipes/react-native-ble.md)

When the transport is settled, move on to the [Hardware SDK API Navigation](references/hardware-sdk/README.md) to implement chain-specific workflows.
