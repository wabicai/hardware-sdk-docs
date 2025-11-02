# Step 4 · Connect and Authorize Your Device

With the SDK initialised, the next goal is to open the chooser, authorise the device, and persist the `connectId` for later requests.

## 4.1 Initialise the SDK

Add the following code to your app entry point (for example `src/main.tsx`). Keep the environment flag from Step 2 so you can disable logs in production.

```typescript
import HardwareSDK from '@onekeyfe/hd-common-connect-sdk';
import { UI_EVENT, UI_REQUEST, UI_RESPONSE } from '@onekeyfe/hd-core';

type InitParams = {
  debug?: boolean;
};

export async function initSDK({ debug = false }: InitParams = {}) {
  await HardwareSDK.init({
    env: 'webusb',
    debug,
    fetchConfig: true,
  });

  HardwareSDK.on(UI_EVENT, message => {
    if (message.type === UI_REQUEST.REQUEST_PIN) {
      // TODO: show a modal and collect the PIN
    }
    if (message.type === UI_REQUEST.REQUEST_PASSPHRASE) {
      // TODO: prompt the user to enter or confirm the passphrase
    }
    if (message.type === UI_REQUEST.REQUEST_BUTTON) {
      console.info('Confirm the action on the hardware wallet.');
    }
    if (message.type === UI_REQUEST.CLOSE_UI_WINDOW) {
      // TODO: reset any open dialogs
    }
  });
}
```

Call `initSDK({ debug: import.meta.env.VITE_ONEKEY_DEBUG === 'true' })` when your app boots.

## 4.2 Request WebUSB authorisation

Inside a button handler, copy the same pattern used by the playground. User gestures are mandatory for WebUSB.

```typescript
async function requestDevice() {
  await initSDK({ debug: true });

  const result = await HardwareSDK.searchDevices();
  if (!result.success || result.payload.length === 0) {
    throw new Error('No devices discovered. Connect your OneKey and try again.');
  }

  const device = result.payload[0];
  const features = await HardwareSDK.getFeatures(device.connectId);
  if (!features.success) {
    throw new Error(features.payload.error ?? 'Failed to fetch device features');
  }

  sessionStorage.setItem('ONEKEY_CONNECT_ID', device.connectId ?? '');
  sessionStorage.setItem('ONEKEY_DEVICE_ID', features.payload.deviceId ?? '');

  return { device, features };
}
```

When the chooser opens, select your hardware wallet. The browser should remember the permission for the current origin.

Proceed to [Step 5](5-run-first-command.md) to execute your first blockchain-specific call.
