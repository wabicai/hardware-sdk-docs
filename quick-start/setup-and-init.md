# Setup and Init

This page covers installing the SDK and initializing it as early as possible, so device events and UI prompts (PIN/Passphrase) are handled correctly.

## Install

```bash
npm i @onekeyfe/hd-common-connect-sdk @onekeyfe/hd-shared @onekeyfe/hd-core
```

## Initialize the SDK

```ts
import HardwareSDK from '@onekeyfe/hd-common-connect-sdk';

export async function initSdk(env: 'webusb' | 'lowlevel' | 'react-native' = 'webusb') {
  await HardwareSDK.init({
    env,
    debug: process.env.NODE_ENV !== 'production',
    fetchConfig: true,
  });
}
```

- `env: 'webusb'` → browser WebUSB
- `env: 'lowlevel'` → native shells (iOS/Android/Flutter) via a low-level adapter bundle
- `env: 'react-native'` → React Native with pure BLE transports

## Bind events early 

- More Info： [Config Event](../hardware-sdk/config-event.md)

```ts
import { UI_EVENT, UI_REQUEST, UI_RESPONSE, DEVICE } from '@onekeyfe/hd-core';

export function bindEvents() {
  HardwareSDK.on(UI_EVENT, async (message: any) => {
    switch (message.type) {
      case UI_REQUEST.REQUEST_PIN:
        // See the dedicated PIN page for minimal dialog code
        break;
      case UI_REQUEST.REQUEST_PASSPHRASE:
        // See the dedicated Passphrase page for minimal dialog code
        break;
      default:
        break;
    }
  });

  HardwareSDK.on(DEVICE.CONNECT, (payload: any) => {
    console.log('Device connected:', payload);
  });
  HardwareSDK.on(DEVICE.DISCONNECT, (payload: any) => {
    console.log('Device disconnected:', payload);
  });
}
```

Proceed to Device Discovery to obtain `connectId` and `device_id` for subsequent API calls.
